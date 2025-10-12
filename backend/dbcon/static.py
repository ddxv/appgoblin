"""Static queries - data preloaded at application startup."""

from dataclasses import dataclass

import pandas as pd
from litestar.datastructures import State

from config import get_logger
from dbcon.utils import sql

logger = get_logger(__name__)


@dataclass
class StaticData:
    """Container for all preloaded static data."""

    appstore_categories: pd.DataFrame
    store_collection_category_map: pd.DataFrame
    parent_companies: list[str]
    company_secondary_domains: list[str]
    company_countries: pd.DataFrame
    company_logos_df: pd.DataFrame
    child_companies: list[str]
    adtech_categories: pd.DataFrame
    total_counts: pd.DataFrame
    advertiser_creative_rankings: pd.DataFrame
    advertiser_creative_rankings_top: pd.DataFrame
    country_map: pd.DataFrame
    sdks: pd.DataFrame
    company_open_source: pd.DataFrame
    company_api_call_countrys: pd.DataFrame


def load_static_data(engine) -> StaticData:
    """Load all static data at startup."""
    logger.info("Loading static data...")

    # Appstore categories with transformations
    df = pd.read_sql(sql.appstore_categories, engine)
    df["store"] = df["store"].replace({1: "android", 2: "ios"})
    appstore_categories = pd.pivot_table(
        data=df, index="category", values="app_count", columns="store", fill_value=0
    ).reset_index()
    appstore_categories["total_apps"] = (
        appstore_categories["android"] + appstore_categories["ios"]
    )
    appstore_categories = appstore_categories.sort_values("total_apps", ascending=False)

    # SDKs with transformations
    sdks = pd.read_sql(sql.sdks, engine)
    sdks["store"] = sdks["store"].replace({1: "Google Play", 2: "Apple App Store"})

    # Adtech categories with sorting
    adtech_categories = pd.read_sql(sql.adtech_categories, engine).sort_values("id")

    # Simple queries - load as-is
    store_collection_category_map = pd.read_sql(
        sql.store_collection_category_map, engine
    )
    company_countries = pd.read_sql(sql.company_countries, engine)
    total_counts = pd.read_sql(sql.total_counts, engine)
    advertiser_creative_rankings = pd.read_sql(sql.advertiser_creative_rankings, engine)
    advertiser_creative_rankings_top = pd.read_sql(
        sql.advertiser_creative_rankings_top, engine
    )
    country_map = pd.read_sql(sql.countries, engine)
    company_open_source = pd.read_sql(sql.company_open_source, engine)
    company_api_call_countrys = pd.read_sql(sql.company_api_call_countrys, engine)

    # Queries that extract lists
    parent_companies = pd.read_sql(sql.parent_companies, engine)["domain_name"].tolist()
    company_secondary_domains = pd.read_sql(sql.company_secondary_domains, engine)[
        "domain_name"
    ].tolist()
    child_companies = pd.read_sql(sql.child_companies, engine)["domain_name"].tolist()

    # Company logos (inline query)
    company_logos_df = pd.read_sql(
        """SELECT ad.domain_name as company_domain, c.logo_url as company_logo_url 
           FROM adtech.companies as c 
           LEFT JOIN domains as ad ON c."domain_id" = ad."id";""",
        engine,
    )

    logger.info("Static data loading complete!")

    return StaticData(
        appstore_categories=appstore_categories,
        store_collection_category_map=store_collection_category_map,
        parent_companies=parent_companies,
        company_secondary_domains=company_secondary_domains,
        company_countries=company_countries,
        company_logos_df=company_logos_df,
        child_companies=child_companies,
        adtech_categories=adtech_categories,
        total_counts=total_counts,
        advertiser_creative_rankings=advertiser_creative_rankings,
        advertiser_creative_rankings_top=advertiser_creative_rankings_top,
        country_map=country_map,
        sdks=sdks,
        company_open_source=company_open_source,
        company_api_call_countrys=company_api_call_countrys,
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


def get_company_logos_df(state: State) -> pd.DataFrame:
    """Get company logos (preloaded at startup)."""
    return state.static_data.company_logos_df


def get_child_companies(state: State) -> list[str]:
    """Get child companies (preloaded at startup)."""
    return state.static_data.child_companies


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


def get_sdks(state: State) -> pd.DataFrame:
    """Get top sdks (preloaded at startup)."""
    return state.static_data.sdks


def get_company_open_source(state: State) -> pd.DataFrame:
    """Get company is open source (preloaded at startup)."""
    return state.static_data.company_open_source


def get_company_api_call_countrys(state: State) -> pd.DataFrame:
    """Get company api call countrys (preloaded at startup)."""
    return state.static_data.company_api_call_countrys
