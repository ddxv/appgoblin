"""Static queries - data preloaded at application startup."""

from dataclasses import dataclass, field

import numpy as np
import pandas as pd
from litestar.datastructures import State

from api_app.models import (
    CompanyTrendsSummary,
    CompanyTrendSummary,
)
from config import CONFIG, PUBLIC_DATA_URL, get_logger
from dbcon.connections import PostgresCon
from dbcon.utils import sql

logger = get_logger(__name__)

TREND_HISTORY_WINDOW_QUARTERS = 4
TREND_PLATFORM_MAP = {1: "android", 2: "ios"}
TREND_TAG_SOURCE_ORDER = {"sdk_api": 0, "app_ads_direct": 1}
TREND_OVERVIEW_MAX_SHARE_CHANGE_PCT = 500.0
TREND_INT_COLUMNS = [
    "year",
    "quarter",
    "total_apps",
    "total_apps_in_quarter",
    "apps_added",
    "apps_lost",
]
TREND_VALUE_COLUMNS = [
    "total_apps",
    "total_apps_in_quarter",
    "apps_added",
    "apps_lost",
]


def _normalize_trend_platform(store: object) -> str:
    """Map backend store identifiers to stable trend platform slugs."""
    if pd.isna(store):
        return "unknown"

    if store in TREND_PLATFORM_MAP:
        return TREND_PLATFORM_MAP[int(store)]

    normalized = str(store).strip().lower()
    if "google" in normalized or normalized == "android":
        return "android"
    if "apple" in normalized or normalized == "ios":
        return "ios"
    return normalized or "unknown"


def _cap_overview_share_change_pct(value: pd.Series) -> pd.Series:
    """Limit overview QoQ share growth to a readable percentage ceiling."""
    return value.clip(upper=TREND_OVERVIEW_MAX_SHARE_CHANGE_PCT)


def _optional_int(value: object) -> int | None:
    """Convert nullable pandas scalar values to plain ints."""
    if pd.isna(value):
        return None
    return int(value)


def _optional_float(value: object, digits: int = 4) -> float | None:
    """Convert nullable pandas scalar values to rounded floats."""
    if pd.isna(value):
        return None
    return round(float(value), digits)


def _aggregate_company_trends(
    df: pd.DataFrame, *, include_company_domain: bool = False
) -> pd.DataFrame:
    """Aggregate raw company history into ordered quarterly trend rows."""
    if df.empty:
        return pd.DataFrame()

    trends_df = df.copy()
    trends_df["platform"] = trends_df["store"].apply(_normalize_trend_platform)
    trends_df["source_key"] = (
        trends_df["platform"].astype(str) + "_" + trends_df["tag_source"].astype(str)
    )
    for column in TREND_INT_COLUMNS:
        trends_df[column] = pd.to_numeric(trends_df[column], errors="coerce").fillna(0)
        trends_df[column] = trends_df[column].astype(int)

    group_columns = ["year", "quarter", "platform", "tag_source", "source_key"]
    history_group_columns = ["source_key"]
    sort_columns = ["year", "quarter", "platform", "tag_source_order"]
    if include_company_domain:
        group_columns = ["company_domain", *group_columns]
        history_group_columns = ["company_domain", *history_group_columns]
        sort_columns = ["company_domain", *sort_columns]

    aggregated_df = (
        trends_df.groupby(group_columns, dropna=False, sort=False)[TREND_VALUE_COLUMNS]
        .sum()
        .reset_index()
    )
    aggregated_df["tag_source_order"] = aggregated_df["tag_source"].map(
        TREND_TAG_SOURCE_ORDER
    )
    aggregated_df["tag_source_order"] = aggregated_df["tag_source_order"].fillna(
        len(TREND_TAG_SOURCE_ORDER)
    )
    aggregated_df = aggregated_df.sort_values(sort_columns).reset_index(drop=True)
    aggregated_df["period"] = (
        aggregated_df["year"].astype(str) + "-Q" + aggregated_df["quarter"].astype(str)
    )
    aggregated_df["previous_total_apps"] = aggregated_df.groupby(
        history_group_columns, sort=False
    )["total_apps"].shift(1)
    aggregated_df["net_apps_change"] = (
        aggregated_df["apps_added"] - aggregated_df["apps_lost"]
    )
    aggregated_df["pct_market_share"] = np.where(
        aggregated_df["total_apps_in_quarter"] > 0,
        aggregated_df["total_apps"] / aggregated_df["total_apps_in_quarter"] * 100,
        np.nan,
    )
    aggregated_df["previous_pct_market_share"] = aggregated_df.groupby(
        history_group_columns, sort=False
    )["pct_market_share"].shift(1)
    aggregated_df["pct_market_share_change"] = np.where(
        aggregated_df["previous_pct_market_share"].notna(),
        aggregated_df["pct_market_share"] - aggregated_df["previous_pct_market_share"],
        np.nan,
    )
    aggregated_df["pct_market_share_change_pct"] = np.where(
        aggregated_df["previous_pct_market_share"] > 0,
        aggregated_df["pct_market_share_change"]
        / aggregated_df["previous_pct_market_share"]
        * 100,
        np.nan,
    )
    aggregated_df["pct_apps_added"] = np.where(
        aggregated_df["previous_total_apps"] > 0,
        aggregated_df["apps_added"] / aggregated_df["previous_total_apps"] * 100,
        np.nan,
    )
    aggregated_df["pct_apps_lost"] = np.where(
        aggregated_df["previous_total_apps"] > 0,
        aggregated_df["apps_lost"] / aggregated_df["previous_total_apps"] * 100,
        np.nan,
    )
    aggregated_df["total_apps_change"] = np.where(
        aggregated_df["previous_total_apps"].notna(),
        aggregated_df["total_apps"] - aggregated_df["previous_total_apps"],
        np.nan,
    )
    aggregated_df["total_apps_change_pct"] = np.where(
        aggregated_df["previous_total_apps"] > 0,
        aggregated_df["total_apps_change"] / aggregated_df["previous_total_apps"] * 100,
        np.nan,
    )
    return aggregated_df.drop(columns=["tag_source_order"])


def _build_company_trends_summary_rows(
    history_df: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Build one row per company/source summary plus per-company latest periods."""
    aggregated_df = _aggregate_company_trends(history_df, include_company_domain=True)
    if aggregated_df.empty:
        return pd.DataFrame(), pd.DataFrame(columns=["company_domain", "latest_period"])

    aggregated_df = aggregated_df[pd.notna(aggregated_df["company_domain"])].copy()
    if aggregated_df.empty:
        return pd.DataFrame(), pd.DataFrame(columns=["company_domain", "latest_period"])

    by_source_df = aggregated_df.sort_values(
        ["company_domain", "source_key", "year", "quarter"]
    ).reset_index(drop=True)
    latest_source_df = (
        by_source_df.groupby(["company_domain", "source_key"], dropna=False, sort=False)
        .tail(1)
        .reset_index(drop=True)
    )
    trailing_df = by_source_df.groupby(
        ["company_domain", "source_key"], dropna=False, sort=False
    ).tail(TREND_HISTORY_WINDOW_QUARTERS)
    trailing_metrics_df = (
        trailing_df.groupby(["company_domain", "source_key"], dropna=False, sort=False)
        .agg(
            trailing_year_apps_added=("apps_added", "sum"),
            trailing_year_apps_lost=("apps_lost", "sum"),
            trailing_year_net_apps_change=("net_apps_change", "sum"),
            trailing_year_start_total_apps=("total_apps", "first"),
            trailing_year_end_total_apps=("total_apps", "last"),
        )
        .reset_index()
    )
    latest_period_df = (
        aggregated_df.sort_values(["company_domain", "year", "quarter"])
        .groupby("company_domain", dropna=False, sort=False)
        .tail(1)[["company_domain", "period"]]
        .rename(columns={"period": "latest_period"})
        .reset_index(drop=True)
    )

    summary_rows_df = latest_source_df.merge(
        trailing_metrics_df,
        on=["company_domain", "source_key"],
        how="left",
    )
    return summary_rows_df, latest_period_df


def _build_company_trends_summaries(
    summary_rows_df: pd.DataFrame, latest_period_df: pd.DataFrame
) -> dict[str, CompanyTrendsSummary]:
    """Convert summary rows into nested CompanyTrendsSummary objects."""
    sources_by_company: dict[str, dict[str, CompanyTrendSummary]] = {}
    for row in summary_rows_df.itertuples(index=False):
        company_domain = str(row.company_domain)
        sources_by_company.setdefault(company_domain, {})[str(row.source_key)] = (
            CompanyTrendSummary(
                source_key=str(row.source_key),
                platform=str(row.platform),
                tag_source=str(row.tag_source),
                latest_period=str(row.period),
                latest_total_apps=int(row.total_apps),
                previous_total_apps=_optional_int(row.previous_total_apps),
                latest_apps_added=int(row.apps_added),
                latest_apps_lost=int(row.apps_lost),
                latest_net_apps_change=int(row.net_apps_change),
                latest_pct_market_share=_optional_float(row.pct_market_share, digits=6),
                previous_pct_market_share=_optional_float(
                    row.previous_pct_market_share, digits=6
                ),
                latest_pct_market_share_change=_optional_float(
                    row.pct_market_share_change, digits=6
                ),
                latest_pct_market_share_change_pct=_optional_float(
                    row.pct_market_share_change_pct
                ),
                latest_pct_apps_added=_optional_float(row.pct_apps_added),
                latest_pct_apps_lost=_optional_float(row.pct_apps_lost),
                qoq_total_apps_change=_optional_int(row.total_apps_change),
                qoq_total_apps_change_pct=_optional_float(row.total_apps_change_pct),
                trailing_year_apps_added=int(row.trailing_year_apps_added),
                trailing_year_apps_lost=int(row.trailing_year_apps_lost),
                trailing_year_net_apps_change=int(row.trailing_year_net_apps_change),
                trailing_year_start_total_apps=int(row.trailing_year_start_total_apps),
                trailing_year_end_total_apps=int(row.trailing_year_end_total_apps),
            )
        )

    latest_period_lookup = latest_period_df.set_index("company_domain")[
        "latest_period"
    ].to_dict()
    return {
        company_domain: CompanyTrendsSummary(
            latest_period=str(latest_period_lookup[company_domain]),
            sources=sources,
        )
        for company_domain, sources in sources_by_company.items()
    }


def _build_company_trends_overview_df(
    summary_rows_df: pd.DataFrame, latest_period_df: pd.DataFrame
) -> pd.DataFrame:
    """Flatten latest summary metrics into one overview row per company."""
    overview_df = latest_period_df.rename(
        columns={"latest_period": "trends_latest_period"}
    ).copy()
    if summary_rows_df.empty:
        return (
            overview_df
            if not overview_df.empty
            else pd.DataFrame(columns=["company_domain"])
        )

    platform_prefix = summary_rows_df["platform"].map(
        {"android": "google", "ios": "apple"}
    )
    tag_prefix = summary_rows_df["tag_source"].map(
        {"sdk_api": "sdk", "app_ads_direct": "app_ads_direct"}
    )
    valid_prefix_mask = platform_prefix.notna() & tag_prefix.notna()
    if not valid_prefix_mask.any():
        return overview_df

    prefixed_df = summary_rows_df.loc[
        valid_prefix_mask,
        [
            "company_domain",
            "pct_market_share",
            "pct_market_share_change_pct",
            "total_apps",
            "apps_added",
            "apps_lost",
        ],
    ].copy()
    prefixed_df["pct_market_share_change_pct"] = _cap_overview_share_change_pct(
        prefixed_df["pct_market_share_change_pct"]
    )
    prefixed_df["prefix"] = (
        platform_prefix.loc[valid_prefix_mask].astype(str)
        + "_"
        + tag_prefix.loc[valid_prefix_mask].astype(str)
    )

    metric_suffixes = {
        "pct_market_share": "latest_pct_market_share",
        "pct_market_share_change_pct": "latest_pct_market_share_change",
        "total_apps": "latest_total_apps",
        "apps_added": "latest_apps_added",
        "apps_lost": "latest_apps_lost",
    }
    for metric_column, suffix in metric_suffixes.items():
        metric_df = prefixed_df.pivot(
            index="company_domain",
            columns="prefix",
            values=metric_column,
        )
        metric_df.columns = [f"{column}_{suffix}" for column in metric_df.columns]
        overview_df = overview_df.merge(
            metric_df.reset_index(),
            on="company_domain",
            how="left",
        )
    return overview_df


def build_company_trends_static_data(
    history_df: pd.DataFrame,
) -> tuple[dict[str, CompanyTrendsSummary], pd.DataFrame]:
    """Build precomputed trend payloads and flattened overview rows for all companies."""
    if history_df.empty:
        return {}, pd.DataFrame(columns=["company_domain"])

    summary_rows_df, latest_period_df = _build_company_trends_summary_rows(history_df)
    if summary_rows_df.empty:
        return {}, pd.DataFrame(columns=["company_domain"])

    company_trends_summaries = _build_company_trends_summaries(
        summary_rows_df, latest_period_df
    )
    company_trends_overview_df = _build_company_trends_overview_df(
        summary_rows_df, latest_period_df
    )
    return company_trends_summaries, company_trends_overview_df


@dataclass
class StaticData:
    """Container for all preloaded static data."""

    appstore_categories: pd.DataFrame
    store_collection_category_map: pd.DataFrame
    parent_companies: list[str]
    company_secondary_domains: list[str]
    company_countries: pd.DataFrame
    company_categories: pd.DataFrame
    company_logos_df: pd.DataFrame
    adtech_categories: pd.DataFrame
    total_counts: pd.DataFrame
    advertiser_creative_rankings: pd.DataFrame
    advertiser_creative_rankings_top: pd.DataFrame
    country_map: pd.DataFrame
    company_open_source: pd.DataFrame
    company_api_call_countrys: pd.DataFrame
    mediation_companies: pd.DataFrame
    company_trends_summaries: dict[str, CompanyTrendsSummary]
    company_trends_overview_df: pd.DataFrame
    s3_datasets: list[dict] = field(default_factory=list)


def load_s3_datasets() -> list[dict]:
    """Load list of public export datasets from S3 at startup."""
    s3_key = "public-s3"
    if s3_key not in CONFIG:
        logger.warning("public-s3 config section missing, skipping S3 dataset loading")
        return []
    try:
        import boto3

        session = boto3.session.Session()
        s3 = session.client(
            "s3",
            region_name=CONFIG[s3_key]["region_name"],
            endpoint_url="https://" + CONFIG[s3_key]["host"],
            aws_access_key_id=CONFIG[s3_key]["access_key_id"],
            aws_secret_access_key=CONFIG[s3_key]["secret_key"],
        )
        bucket = CONFIG[s3_key]["bucket"]

        paginator = s3.get_paginator("list_objects_v2")
        datasets = []
        for page in paginator.paginate(Bucket=bucket):
            for obj in page.get("Contents", []):
                key = obj["Key"]
                if (
                    key.endswith("/")
                    or "user-reports/" in key
                    or "company-verified-apps" in key
                ):
                    continue
                datasets.append(
                    {
                        "key": key,
                        "size_bytes": obj["Size"],
                        "last_modified": obj["LastModified"].isoformat(),
                        "download_url": f"{PUBLIC_DATA_URL}{key}",
                    }
                )
        logger.info(f"Loaded {len(datasets)} S3 export datasets")
        return datasets
    except Exception:
        logger.exception("Failed to load S3 datasets")
        return []


def load_static_data(engine: PostgresCon) -> StaticData:
    """Load all static data at startup."""
    logger.info("Loading static data...")

    # Appstore categories with transformations
    logger.info("Loading appstore categories...")
    df = pd.read_sql(sql.appstore_categories, engine)
    df["store"] = df["store"].replace({1: "android", 2: "ios"})
    appstore_categories = pd.pivot_table(
        data=df, index="category", values="app_count", columns="store", fill_value=0
    ).reset_index()
    appstore_categories["total_apps"] = (
        appstore_categories["android"] + appstore_categories["ios"]
    )
    appstore_categories = appstore_categories.sort_values("total_apps", ascending=False)

    # Adtech categories with sorting
    logger.info("Loading adtech categories...")
    adtech_categories = pd.read_sql(sql.adtech_categories, engine).sort_values("id")

    # Simple queries - load as-is
    logger.info("Loading store collection category map...")
    store_collection_category_map = pd.read_sql(
        sql.store_collection_category_map, engine
    )
    logger.info("Loading company countries...")
    company_countries = pd.read_sql(sql.company_countries, engine)
    logger.info("Loading company categories...")
    company_categories = pd.read_sql(sql.company_categories, engine)
    logger.info("Loading total counts...")
    total_counts = pd.read_sql(sql.total_counts, engine)
    logger.info("Loading advertiser creative rankings...")
    advertiser_creative_rankings = pd.read_sql(sql.advertiser_creative_rankings, engine)
    logger.info("Loading advertiser creative rankings top...")
    advertiser_creative_rankings_top = pd.read_sql(
        sql.advertiser_creative_rankings_top, engine
    )
    logger.info("Loading country map...")
    country_map = pd.read_sql(sql.countries, engine)
    logger.info("Loading company open source...")
    company_open_source = pd.read_sql(sql.company_open_source, engine)
    logger.info("Loading company api call countrys...")
    company_api_call_countrys = pd.read_sql(sql.company_api_call_countrys, engine)
    logger.info("Loading combined companies history...")
    combined_companies_history = pd.read_sql(
        sql.combined_companies_history_static,
        engine,
    )
    logger.info("Precomputing company trends...")
    (
        company_trends_summaries,
        company_trends_overview_df,
    ) = build_company_trends_static_data(combined_companies_history)

    # Queries that extract lists
    logger.info("Loading parent companies...")
    parent_companies = pd.read_sql(sql.parent_companies, engine)["domain_name"].tolist()
    logger.info("Loading company secondary domains...")
    company_secondary_domains = pd.read_sql(sql.company_secondary_domains, engine)[
        "domain_name"
    ].tolist()

    # Company logos (inline query)
    logger.info("Loading company logos...")
    company_logos_df = pd.read_sql(
        """SELECT ad.domain_name as company_domain, c.logo_url as company_logo_url 
           FROM adtech.companies as c 
           LEFT JOIN domains as ad ON c."domain_id" = ad."id";""",
        engine,
    )

    logger.info("Loading mediation companies...")
    mediation_companies = pd.read_sql(
        """SELECT ad.domain_name AS company_domain, 
        c.name as company_name, 
        c.logo_url AS company_logo_url 
           FROM adtech.sdk_mediation_patterns as mc
           LEFT JOIN adtech.sdks s on mc.sdk_id = s.id
           LEFT JOIN adtech.companies as c ON s.company_id = c.id
           LEFT JOIN domains as ad ON c."domain_id" = ad."id";""",
        engine,
    )

    # Load S3 public export datasets
    logger.info("Loading S3 public export datasets...")
    s3_datasets = load_s3_datasets()

    logger.info("Static data loading complete!")

    return StaticData(
        appstore_categories=appstore_categories,
        store_collection_category_map=store_collection_category_map,
        parent_companies=parent_companies,
        company_secondary_domains=company_secondary_domains,
        company_countries=company_countries,
        company_categories=company_categories,
        company_logos_df=company_logos_df,
        adtech_categories=adtech_categories,
        total_counts=total_counts,
        advertiser_creative_rankings=advertiser_creative_rankings,
        advertiser_creative_rankings_top=advertiser_creative_rankings_top,
        country_map=country_map,
        company_open_source=company_open_source,
        company_api_call_countrys=company_api_call_countrys,
        mediation_companies=mediation_companies,
        company_trends_summaries=company_trends_summaries,
        company_trends_overview_df=company_trends_overview_df,
        s3_datasets=s3_datasets,
    )


# Query accessor functions
def get_appstore_categories(state: State) -> pd.DataFrame:
    """Get categories for both appstores (preloaded at startup)."""
    return state.static_data.appstore_categories


def get_store_collection_category_map(state: State) -> pd.DataFrame:
    """Get store collection and category map (preloaded at startup)."""
    return state.static_data.store_collection_category_map


def get_parent_companies(state: State) -> list[str]:
    """Get parent companies (preloaded at startup)."""
    return state.static_data.parent_companies


def get_company_secondary_domains(state: State) -> list[str]:
    """Get company secondary domains (preloaded at startup)."""
    return state.static_data.company_secondary_domains


def get_company_countries(state: State) -> pd.DataFrame:
    """Get company countries (preloaded at startup)."""
    return state.static_data.company_countries


def get_company_categories(state: State) -> pd.DataFrame:
    """Get company categories (preloaded at startup)."""
    return state.static_data.company_categories


def get_company_logos_df(state: State) -> pd.DataFrame:
    """Get company logos (preloaded at startup)."""
    return state.static_data.company_logos_df


def get_adtech_categories(state: State) -> pd.DataFrame:
    """Get the categories for adtech (preloaded at startup)."""
    return state.static_data.adtech_categories


def get_total_counts(state: State) -> pd.DataFrame:
    """Get total counts (preloaded at startup)."""
    return state.static_data.total_counts


def get_advertiser_creative_rankings(state: State) -> pd.DataFrame:
    """Get advertiser creative rankings (preloaded at startup)."""
    return state.static_data.advertiser_creative_rankings


def get_advertiser_creative_rankings_top(state: State) -> pd.DataFrame:
    """Get advertiser creative rankings top (preloaded at startup)."""
    return state.static_data.advertiser_creative_rankings_top


def get_country_map(state: State) -> pd.DataFrame:
    """Get country map (preloaded at startup)."""
    return state.static_data.country_map


def get_company_open_source(state: State) -> pd.DataFrame:
    """Get company is open source (preloaded at startup)."""
    return state.static_data.company_open_source


def get_company_api_call_countrys(state: State) -> pd.DataFrame:
    """Get company api call countrys (preloaded at startup)."""
    return state.static_data.company_api_call_countrys


def get_mediation_companies(state: State) -> pd.DataFrame:
    """Get mediation companies (preloaded at startup)."""
    return state.static_data.mediation_companies


def get_company_trends_summary(
    state: State, company_domain: str
) -> CompanyTrendsSummary | None:
    """Get precomputed quarterly company trend summary for a company domain."""
    return state.static_data.company_trends_summaries.get(company_domain)


def get_company_trends_overview(state: State) -> pd.DataFrame:
    """Get flattened precomputed company trend metrics for overview tables."""
    return state.static_data.company_trends_overview_df


def get_s3_datasets(state: State) -> list[dict]:
    """Get S3 public export datasets (preloaded at startup)."""
    return state.static_data.s3_datasets
