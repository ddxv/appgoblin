"""Query database for backend API."""

import datetime
import pathlib
from functools import lru_cache

import numpy as np
import pandas as pd
from sqlalchemy import text

from config import MODULE_DIR, get_logger
from dbcon.connections import get_db_connection

logger = get_logger(__name__)


SQL_DIR = pathlib.Path(MODULE_DIR, "dbcon/sql/")


def load_sql_file(file_name: str) -> str:
    """Load local SQL file based on file name."""
    file_path = pathlib.Path(SQL_DIR, file_name)
    with file_path.open() as file:
        return text(file.read())


QUERY_CATEGORY_TOP_APPS_BY_INSTALLS = load_sql_file(
    "query_category_top_apps_by_installs.sql",
)
QUERY_RANKS_FOR_APP = load_sql_file("query_ranks_for_app.sql")
QUERY_RANKS_FOR_APP_OVERVIEW = load_sql_file("query_ranks_for_app_overview.sql")
QUERY_MOST_RECENT_TOP_RANKS = load_sql_file("query_most_recent_top_ranks.sql")
QUERY_HISTORY_TOP_RANKS = load_sql_file("query_history_top_ranks.sql")
QUERY_APPSTORE_CATEGORIES = load_sql_file("query_appstore_categories.sql")
QUERY_SEARCH_APPS = load_sql_file("query_search_apps.sql")
QUERY_SEARCH_COMPANIES = load_sql_file("query_search_companies.sql")
QUERY_SEARCH_DEVS = load_sql_file("query_search_devs.sql")
QUERY_SINGLE_DEVELOPER = load_sql_file("query_single_developer.sql")
QUERY_SINGLE_APP_ADSTXT = load_sql_file("query_single_app_adstxt.sql")
QUERY_APP_HISTORY = load_sql_file("query_app_history.sql")
QUERY_SINGLE_APP = load_sql_file("query_single_app.sql")
QUERY_APP_SDK_DETAILS = load_sql_file("query_app_sdk_details.sql")
QUERY_APP_SDK_OVERVIEW = load_sql_file("query_app_sdk_overview.sql")
QUERY_APPS_SDK_OVERVIEW = load_sql_file("query_apps_sdk_overview.sql")
QUERY_APP_ADSTXT_OVERVIEW = load_sql_file("query_app_adstxt_overview.sql")
QUERY_TOTAL_COUNTS = load_sql_file("query_total_counts.sql")
QUERY_STORE_COLLECTION_CATEGORY_MAP = load_sql_file(
    "query_store_collection_category_map.sql",
)
QUERY_PARENT_COMPANIES = load_sql_file("query_parent_companies.sql")
QUERY_CHILD_COMPANIES = load_sql_file("query_child_companies.sql")
QUERY_ADTECH_CATEGORIES = load_sql_file(
    "query_adtech_categories.sql",
)
QUERY_COMPANIES_CATEGORY_TAG_TYPE_STATS = load_sql_file(
    "query_companies_category_tag_type_stats.sql",
)
QUERY_COMPANY_TOPAPPS = load_sql_file("query_company_top_apps.sql")
QUERY_COMPANY_TOPAPPS_PARENT = load_sql_file("query_company_top_apps_parent.sql")
QUERY_COMPANY_TOPAPPS_CATEGORY = load_sql_file("query_company_top_apps_category.sql")
QUERY_COMPANY_TOPAPPS_CATEGORY_PARENT = load_sql_file(
    "query_company_top_apps_category_parent.sql"
)
QUERY_COMPANIES_PARENT_TAG_STATS = load_sql_file("query_companies_parent_tag_stats.sql")
QUERY_COMPANIES_TAG_STATS = load_sql_file("query_companies_tag_stats.sql")
QUERY_COMPANIES_PARENT_CATEGORY_TAG_STATS = load_sql_file(
    "query_companies_parent_category_tag_stats.sql"
)
QUERY_COMPANIES_CATEGORY_TAG_STATS = load_sql_file(
    "query_companies_category_tag_stats.sql"
)
QUERY_COMPANIES_PARENT_TOP = load_sql_file("query_companies_parent_top.sql")
QUERY_COMPANIES_CATEGORY_TYPE_TOP = load_sql_file(
    "query_companies_category_type_top.sql",
)
QUERY_COMPANY_CATEGORY_TAG_STATS = load_sql_file("query_company_category_tag_stats.sql")
QUERY_COMPANY_PARENT_CATEGORY_TAG_STATS = load_sql_file(
    "query_company_parent_category_tag_stats.sql"
)
QUERY_COMPANY_TREE = load_sql_file("query_company_tree.sql")
QUERY_COMPANY_SDKS = load_sql_file("query_company_sdks.sql")
QUERY_PARENT_COMPANY_CATEGORY_STATS = load_sql_file(
    "query_company_parent_category_stats.sql"
)
QUERY_COMPANY_CATEGORY_STATS = load_sql_file("query_company_category_stats.sql")
QUERY_TAG_SOURCE_CATEGORY_TOTALS = load_sql_file("query_category_totals.sql")
QUERY_SDKS = load_sql_file("query_sdks.sql")
QUERY_LATEST_SDKS = load_sql_file("query_sdks_latest.sql")
QUERY_USER_REQUESTED_LATEST_SDKS = load_sql_file("query_sdks_user_requested_latest.sql")
QUERY_SDK_PATTERN = load_sql_file("query_sdk_pattern.sql")
QUERY_SDK_PATTERN_COMPANIES = load_sql_file("query_sdk_pattern_companies.sql")

QUERY_COMPANY_ADSTXT_AD_DOMAIN_OVERVIEW = load_sql_file(
    "query_company_adstxt_ad_domain_overview.sql"
)
QUERY_COMPANY_ADSTXT_PUBLISHERS_OVERVIEW = load_sql_file(
    "query_company_adstxt_publishers_overview.sql"
)
QUERY_COMPANY_ADSTXT_PUBLISHER_ID = load_sql_file(
    "query_company_adstxt_publisher_id.sql"
)
QUERY_COMPANY_ADSTXT_PUBLISHER_ID_APPS_OVERVIEW = load_sql_file(
    "query_company_adstxt_publisher_id_apps_overview.sql"
)
QUERY_COMPANY_OPEN_SOURCE = load_sql_file("query_company_open_source.sql")
QUERY_SINGLE_APP_KEYWORDS = load_sql_file("query_single_app_keywords.sql")
QUERY_KEYWORD_DETAILS = load_sql_file("query_keyword_details.sql")
QUERY_KEYWORD_APPS = load_sql_file("query_keyword_apps.sql")
# Used for generating sitemaps
QUERY_SITEMAP_APPS = load_sql_file("query_sitemap_apps.sql")
QUERY_SITEMAP_COMPANIES = load_sql_file("query_sitemap_companies.sql")

INSERT_SDK_SCAN_REQUEST = load_sql_file("insert_sdk_scan_request.sql")


def get_recent_apps(collection: str, limit: int = 20) -> pd.DataFrame:
    """Get app collections by time."""
    logger.info(f"Query app_store for recent apps {collection=}")
    if collection == "new_weekly":
        table_name = "apps_new_weekly"
    elif collection == "new_monthly":
        table_name = "apps_new_monthly"
    elif collection == "new_yearly":
        table_name = "apps_new_yearly"
    elif collection == "top":
        table_name = "top_categories"
    else:
        table_name = "apps_new_weekly"
    cols = [
        "name",
        "store",
        "mapped_category",
        "store_id",
        "installs",
        "review_count",
        "rating_count",
        "rating",
        "icon_url_512",
        "featured_image_url",
        "phone_image_url_1",
        "tablet_image_url_1",
    ]
    my_cols = ", ".join(cols)
    sel_query = f"""WITH NumberedRows AS (
                    SELECT 
                        {my_cols},
                        ROW_NUMBER() OVER (PARTITION BY store, mapped_category
                    ORDER BY 
                        CASE WHEN store = 1 THEN installs ELSE rating_count 
                            END DESC NULLS LAST
                ) AS rn
                FROM {table_name}
            )
            SELECT 
                {my_cols}
            FROM NumberedRows
            WHERE rn <= {limit}
            ;
            """  # noqa: S608 worried about SQL injection but all data is set internal
    df = pd.read_sql(sel_query, con=DBCON.engine)
    groups = df.groupby("store")
    for _store, group in groups:
        overall = group.sort_values(["installs", "rating_count"], ascending=False).head(
            limit,
        )
        overall["mapped_category"] = "overall"
        df = pd.concat([df, overall], axis=0)
    df = clean_app_df(df)
    return df


@lru_cache(maxsize=1)
def get_appstore_categories() -> pd.DataFrame:
    """Get categories for both appstores."""
    df = pd.read_sql(QUERY_APPSTORE_CATEGORIES, DBCON.engine)
    df["store"] = df["store"].replace({1: "android", 2: "ios"})
    df = pd.pivot_table(
        data=df,
        index="category",
        values="app_count",
        columns="store",
        fill_value=0,
    ).reset_index()
    df["total_apps"] = df["android"] + df["ios"]
    df = df.sort_values("total_apps", ascending=False)
    return df


@lru_cache(maxsize=1)
def get_store_collection_category_map() -> pd.DataFrame:
    """Get store collection and category map."""
    df = pd.read_sql(QUERY_STORE_COLLECTION_CATEGORY_MAP, con=DBCON.engine)
    return df


@lru_cache(maxsize=1)
def get_parent_companies() -> list[str]:
    """Get parent companies."""
    df = pd.read_sql(QUERY_PARENT_COMPANIES, con=DBCON.engine)
    return df["domain"].tolist()


@lru_cache(maxsize=1)
def get_child_companies() -> list[str]:
    """Get child companies."""
    df = pd.read_sql(QUERY_CHILD_COMPANIES, con=DBCON.engine)
    return df["domain"].tolist()


@lru_cache(maxsize=1)
def get_adtech_categories() -> pd.DataFrame:
    """Get the categories for adtech."""
    df = pd.read_sql(QUERY_ADTECH_CATEGORIES, con=DBCON.engine)
    df = df.sort_values("id")
    return df


@lru_cache(maxsize=1)
def get_total_counts() -> pd.DataFrame:
    """Get total counts."""
    df = pd.read_sql(QUERY_TOTAL_COUNTS, con=DBCON.engine)
    return df


def get_companies_category_tag_type_stats(
    type_slug: str,
    app_category: str | None = None,
) -> pd.DataFrame:
    """Get top companies for a category type."""
    if app_category and app_category == "games":
        app_category = "game%"
    df = pd.read_sql(
        QUERY_COMPANIES_CATEGORY_TAG_TYPE_STATS,
        con=DBCON.engine,
        params={"type_slug": type_slug, "app_category": app_category},
    )
    if app_category is None:
        df["app_category"] = "all"
    else:
        df.loc[df["app_category"].isna(), "app_category"] = "None"
    if app_category == "game%":
        df.loc[
            df["app_category"].str.contains("game"),
            "app_category",
        ] = "games"
    df = (
        df.groupby(
            [
                "store",
                "tag_source",
                "company_domain",
                "company_name",
                "app_category",
                "type_url_slug",
            ]
        )[["app_count", "installs_d30", "rating_count_d30"]]
        .sum()
        .reset_index()
    )

    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    return df


def get_ranks_for_app(
    store_id: str, country: str = "US", days: int = 30
) -> pd.DataFrame:
    """Get appstore ranks for a specific app."""
    start_date = (
        datetime.datetime.now(datetime.UTC) - datetime.timedelta(days=days)
    ).strftime("%Y-%m-%d")
    df = pd.read_sql(
        QUERY_RANKS_FOR_APP,
        con=DBCON.engine,
        params={"store_id": store_id, "start_date": start_date, "country": country},
    )
    return df


def get_ranks_for_app_overview(store_id: str, days: int = 30) -> pd.DataFrame:
    """Get appstore ranks for a specific app."""
    start_date = (
        datetime.datetime.now(datetime.UTC) - datetime.timedelta(days=days)
    ).strftime("%Y-%m-%d")
    df = pd.read_sql(
        QUERY_RANKS_FOR_APP_OVERVIEW,
        con=DBCON.engine,
        params={"store_id": store_id, "start_date": start_date},
    )
    return df


def get_most_recent_top_ranks(
    collection_id: int,
    category_id: int,
    country: str = "US",
    limit: int = 25,
) -> pd.DataFrame:
    """Get the latest top ranks for a category."""
    df = pd.read_sql(
        QUERY_MOST_RECENT_TOP_RANKS,
        con=DBCON.engine,
        params={
            "collection_id": collection_id,
            "category_id": category_id,
            "country": country,
            "mylimit": limit,
        },
    )
    df = df.sort_values("rank", ascending=True)
    return df


def get_history_top_ranks(
    collection_id: int,
    category_id: int,
    country: str = "US",
    limit: int = 25,
    days: int = 30,
) -> pd.DataFrame:
    """Get appstore rank history for plotting."""
    start_date = (
        datetime.datetime.now(datetime.UTC) - datetime.timedelta(days=days)
    ).strftime("%Y-%m-%d")
    df = pd.read_sql(
        QUERY_HISTORY_TOP_RANKS,
        con=DBCON.engine,
        params={
            "collection_id": collection_id,
            "category_id": category_id,
            "country": country,
            "start_date": start_date,
            "mylimit": limit,
        },
    )
    return df


def get_category_top_apps_by_installs(category: str, limit: int = 10) -> pd.DataFrame:
    """Get category top apps sorted by installs."""
    logger.info(f"Query {category=} for top installs")
    df = pd.read_sql(
        QUERY_CATEGORY_TOP_APPS_BY_INSTALLS,
        DBCON.engine,
        params={"category": category, "mylimit": limit},
    )
    if not df.empty:
        df = clean_app_df(df)
    return df


@lru_cache(maxsize=100)
def get_single_app(store_id: str) -> pd.DataFrame:
    """Get basic app details for a single store_id."""
    logger.info(f"Query for single app_id={store_id}")
    df = pd.read_sql(QUERY_SINGLE_APP, DBCON.engine, params={"store_id": store_id})
    if not df.empty:
        df = clean_app_df(df)
    return df


def get_app_sdk_details(store_id: str) -> pd.DataFrame:
    """Get basic app details for a single store_id."""
    logger.info(f"Query SDKs app_id={store_id}")
    df = pd.read_sql(
        QUERY_APP_SDK_DETAILS,
        DBCON.engine,
        params={"store_id": store_id},
    )
    return df


@lru_cache(maxsize=1000)
def get_apps_sdk_overview(store_ids: tuple[str, ...]) -> pd.DataFrame:
    """Get SDK overview for multiple store_ids."""
    logger.info(f"Query SDKs for {store_ids=}")
    df = pd.read_sql(
        QUERY_APPS_SDK_OVERVIEW,
        DBCON.engine,
        params={"store_ids": store_ids},
    )
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    return df


def get_app_sdk_overview(store_id: str) -> pd.DataFrame:
    """Get SDK overview for a single store_id."""
    logger.info(f"Query SDKs app_id={store_id}")
    df = pd.read_sql(
        QUERY_APP_SDK_OVERVIEW,
        DBCON.engine,
        params={"store_id": store_id},
    )
    return df


def get_app_adstxt_overview(store_id: str) -> pd.DataFrame:
    """Get app-ads.txt overview for a single store_id."""
    logger.info(f"Query app-ads.txt overview app_id={store_id}")
    df = pd.read_sql(
        QUERY_APP_ADSTXT_OVERVIEW,
        DBCON.engine,
        params={"store_id": store_id},
    )
    return df


@lru_cache(maxsize=100)
def get_companies_parent_category_stats(
    app_category: str | None = None,
) -> pd.DataFrame:
    """Get overview of companies from multiple types like sdk and app-ads.txt."""
    parent_company_domains = get_parent_companies()
    child_company_domains = get_child_companies()
    if app_category:
        if app_category == "games":
            app_category = "game%"
        parents_df = pd.read_sql(
            QUERY_COMPANIES_PARENT_CATEGORY_TAG_STATS,
            DBCON.engine,
            params={"app_category": app_category},
        )
        child_df = pd.read_sql(
            QUERY_COMPANIES_CATEGORY_TAG_STATS,
            DBCON.engine,
            params={"app_category": app_category},
        )
        child_df = child_df[
            ~child_df["company_domain"].isin(
                parent_company_domains + child_company_domains
            )
        ]
        df = pd.concat([parents_df, child_df], axis=0)
        if app_category == "game%":
            df["app_category"] = "games"
            df = (
                df.groupby(
                    [
                        "company_domain",
                        "company_name",
                        "store",
                        "app_category",
                        "tag_source",
                    ]
                )[["app_count", "installs_d30", "rating_count_d30"]]
                .sum()
                .reset_index()
            )
    else:
        parents_df = pd.read_sql(QUERY_COMPANIES_PARENT_TAG_STATS, DBCON.engine)
        child_df = pd.read_sql(QUERY_COMPANIES_TAG_STATS, DBCON.engine)
        child_df = child_df[
            ~child_df["company_domain"].isin(
                parent_company_domains + child_company_domains
            )
        ]
        df = pd.concat([parents_df, child_df], axis=0)
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    df.loc[df["app_category"].isna(), "app_category"] = "None"
    return df


def get_companies_top(
    type_slug: str | None = None,
    app_category: str | None = None,
    limit: int = 10,
) -> pd.DataFrame:
    """Get overview of companies from multiple types like sdk and app-ads.txt."""
    if app_category == "games":
        app_category = "game%"
    if type_slug:
        df = pd.read_sql(
            QUERY_COMPANIES_CATEGORY_TYPE_TOP,
            DBCON.engine,
            params={
                "type_slug": type_slug,
                "app_category": app_category,
                "mylimit": limit,
            },
        )
    else:
        df = pd.read_sql(
            QUERY_COMPANIES_PARENT_TOP,
            DBCON.engine,
            params={"app_category": app_category, "mylimit": limit},
        )
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    return df


def get_company_overview(company_domain: str) -> pd.DataFrame:
    """Get overview of companies from multiple types like sdk and app-ads.txt."""
    logger.info(f"query company overview: {company_domain=}")
    parent_companies = get_parent_companies()
    is_parent_company = company_domain in parent_companies
    query = (
        QUERY_COMPANY_PARENT_CATEGORY_TAG_STATS
        if is_parent_company
        else QUERY_COMPANY_CATEGORY_TAG_STATS
    )
    df = pd.read_sql(
        query,
        DBCON.engine,
        params={"company_domain": company_domain},
    )
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    df.loc[df["app_category"].isna(), "app_category"] = "None"
    return df


def get_company_adstxt_publisher_id_apps_overview(
    ad_domain_url: str,
    publisher_id: str,
) -> pd.DataFrame:
    """Get ad domain publisher id."""
    df = pd.read_sql(
        QUERY_COMPANY_ADSTXT_PUBLISHER_ID_APPS_OVERVIEW,
        DBCON.engine,
        params={
            "ad_domain_url": ad_domain_url,
            "publisher_id": publisher_id,
        },
    )
    df["store"] = df["store"].replace({1: "google", 2: "apple"})
    df["relationship"] = df["relationship"].str.lower()
    return df


def get_company_adstxt_publisher_id_apps_raw(
    ad_domain_url: str,
    publisher_id: str,
) -> pd.DataFrame:
    """Get ad domain publisher id."""
    df = pd.read_sql(
        QUERY_COMPANY_ADSTXT_PUBLISHER_ID,
        DBCON.engine,
        params={
            "ad_domain_url": ad_domain_url,
            "publisher_id": publisher_id,
        },
    )
    df["store"] = df["store"].replace({1: "Android", 2: "iOS"})
    df["developer_id"] = df["developer_id"].astype(str)
    return df


def get_company_adstxt_publishers_overview(
    ad_domain_url: str,
    publisher_id: str | None = None,
    limit: int = 5,
) -> pd.DataFrame:
    """Get ad domain publishers overview."""
    df = pd.read_sql(
        QUERY_COMPANY_ADSTXT_PUBLISHERS_OVERVIEW,
        DBCON.engine,
        params={
            "ad_domain_url": ad_domain_url,
            "pubrank_limit": limit,
            "publisher_id": publisher_id,
        },
    )
    df["store"] = df["store"].replace({1: "google", 2: "apple"})
    df["relationship"] = df["relationship"].str.lower()
    return df


def get_company_adstxt_ad_domain_overview(ad_domain_url: str) -> pd.DataFrame:
    """Get ad domain overview."""
    df = pd.read_sql(
        QUERY_COMPANY_ADSTXT_AD_DOMAIN_OVERVIEW,
        DBCON.engine,
        params={"ad_domain_url": ad_domain_url},
    )
    df["store"] = df["store"].replace({1: "google", 2: "apple"})
    df["relationship"] = df["relationship"].str.lower()
    return df


def get_company_tree(company_domain: str) -> pd.DataFrame:
    """Get a company tree with parent companies and domains."""
    logger.info(f"query company tree: {company_domain=}")
    df = pd.read_sql(
        QUERY_COMPANY_TREE,
        DBCON.engine,
        params={"company_domain": company_domain},
    )
    return df


def get_company_sdks(company_domain: str) -> pd.DataFrame:
    """Get a company tree with parent companies and domains."""
    logger.info(f"query company sdks: {company_domain=}")
    df = pd.read_sql(
        QUERY_COMPANY_SDKS,
        DBCON.engine,
        params={"company_domain": company_domain},
    )
    return df


def get_company_categories_topn(
    company_domain: str, num_categories: int = 9
) -> pd.DataFrame:
    """Get a company parent categories."""
    logger.info(f"query company parent categories: {company_domain=}")
    parent_companies = get_parent_companies()
    is_parent_company = company_domain in parent_companies
    query = (
        QUERY_PARENT_COMPANY_CATEGORY_STATS
        if is_parent_company
        else QUERY_COMPANY_CATEGORY_STATS
    )
    df = pd.read_sql(
        query,
        DBCON.engine,
        params={"company_domain": company_domain},
    )
    df.loc[df["app_category"].isna(), "app_category"] = "None"

    top_cats = (
        df.sort_values(by="app_count", ascending=False)
        .head(num_categories)
        .app_category.tolist()
    )
    game_cat_count = sum(["game" in x for x in top_cats])
    is_mostly_games = game_cat_count > num_categories / 2
    is_mostly_non_games = game_cat_count <= 1

    if is_mostly_games:
        df.loc[~df["app_category"].str.contains("game"), "app_category"] = "apps"
        top_cats = (
            df.sort_values(by="app_count", ascending=False)
            .head(num_categories)
            .app_category.tolist()
        )
    if is_mostly_non_games:
        df.loc[df["app_category"].str.contains("game"), "app_category"] = "games"
        top_cats = (
            df.sort_values(by="app_count", ascending=False)
            .head(num_categories)
            .app_category.tolist()
        )

    df.loc[~df["app_category"].isin(top_cats), "app_category"] = "others"
    df = df.groupby(["app_category"])["app_count"].sum().reset_index()
    df["name"] = df["app_category"]
    df["name"] = (
        df["name"]
        .str.replace("game_", "Games: ")
        .str.replace("_and_", " & ")
        .str.replace("_", " ")
        .str.title()
    )

    df = df.rename(columns={"name": "group", "app_count": "value"})

    return df


@lru_cache(maxsize=100)
def get_tag_source_category_totals(app_category: str | None = None) -> pd.DataFrame:
    """Get category totals."""
    if app_category:
        if app_category == "games":
            app_category = "game%"
        df = pd.read_sql(
            QUERY_TAG_SOURCE_CATEGORY_TOTALS,
            DBCON.engine,
            params={"app_category": app_category},
        )
        if app_category == "game%":
            df.loc[
                df["app_category"].str.contains("game"),
                "app_category",
            ] = "games"

    else:
        df = pd.read_sql(
            QUERY_TAG_SOURCE_CATEGORY_TOTALS,
            DBCON.engine,
            params={"app_category": "%"},
        )
        df["app_category"] = "all"
    df.loc[df["app_category"].isna(), "app_category"] = "None"
    df = (
        df.groupby(["app_category", "store", "tag_source"])[
            [
                "app_count",
                "installs_total",
                "rating_count_total",
                "installs_d30",
                "rating_count_d30",
            ]
        ]
        .sum()
        .reset_index()
    )
    df = df.rename(
        columns={
            "app_count": "cat_total_app_count",
            "installs_total": "cat_total_installs",
            "rating_count_total": "cat_total_rating_count",
            "installs_d30": "cat_total_installs_d30",
            "rating_count_d30": "cat_total_rating_count_d30",
        }
    )
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    return df


def clean_app_df(df: pd.DataFrame) -> pd.DataFrame:
    """Apply generic cleaning for a DF with app data from store_apps table.

    Required columns:
    - store
    - store_id
    - developer_id
    - installs
    - review_count
    - rating_count
    - rating

    """
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    string_nums = [
        "installs",
        "review_count",
        "rating_count",
        "installs_d30",
        "rating_count_d30",
    ]
    for col in [x for x in string_nums if x in df.columns]:
        df[f"{col}_num"] = df[col]
        df[col] = df[col].apply(
            lambda x: "N/A" if (x is None or np.isnan(x)) else f"{x:,.0f}",
        )
    df["rating"] = df["rating"].apply(lambda x: round(x, 2) if x else 0)
    ios_link = "https://apps.apple.com/us/app/-/id"
    play_link = "https://play.google.com/store/apps/details?id="
    play_dev_link = "play.google.com/store/apps/dev?id="
    play_dev_name_link = "play.google.com/store/apps/developer?id="
    ios_dev_link = "apps.apple.com/us/developer/-/id"
    df["store_link"] = (
        np.where(df["store"].str.contains("Google"), play_link, ios_link)
        + df["store_id"]
    )
    if "developer_id" in df.columns:
        is_dev_digits = df["developer_id"].astype(str).str.isdigit()
        is_store_google = df["store"].str.contains("Google")
        is_store_apple = df["store"].str.contains("Apple")

        df.loc[is_store_apple, "store_developer_link"] = (
            ios_dev_link + df["developer_id"]
        )
        df.loc[is_store_google, "store_developer_link"] = (
            play_dev_link + df["developer_id"]
        )
        df.loc[is_store_google & ~is_dev_digits, "store_developer_link"] = (
            play_dev_name_link + df["developer_id"]
        )

    date_cols = [
        "created_at",
        "store_last_updated",
        "updated_at",
        "adstxt_last_crawled",
        "sdk_last_crawled",
        "sdk_successful_last_crawled",
    ]
    for x in date_cols:
        if x not in df.columns:
            continue
        if df[x].notna().all():
            df[x] = df[x].dt.strftime("%Y-%m-%d")
    return df


def get_app_history(store_app: int, country: str = "US") -> pd.DataFrame:
    """Get scraping history for an app."""
    logger.info(f"Query for history single app_id={store_app}")
    df = pd.read_sql(
        QUERY_APP_HISTORY,
        DBCON.engine,
        params={"store_app": store_app, "country": country},
    )
    return df


def get_single_developer(developer_id: str) -> pd.DataFrame:
    """Get single developer details."""
    logger.info(f"Developers: {developer_id=}")
    df = pd.read_sql(
        QUERY_SINGLE_DEVELOPER,
        con=DBCON.engine,
        params={"developer_id": developer_id},
    )
    if not df.empty:
        df = clean_app_df(df)
    return df


def get_single_apps_adstxt(store_id: str) -> pd.DataFrame:
    """Get single developer's app ads txt entries."""
    logger.info(f"Query app's app-ads-txt: {store_id=}")
    df = pd.read_sql(
        QUERY_SINGLE_APP_ADSTXT,
        con=DBCON.engine,
        params={"store_id": store_id},
    )
    return df


def get_topapps_for_company(
    company_domain: str, mapped_category: str | None = None, limit: int = 20
) -> pd.DataFrame:
    """Get top apps for for a company."""
    if mapped_category == "games":
        mapped_category = "game%"
        needs_groupby = True
    else:
        needs_groupby = False

    parent_companies = get_parent_companies()
    is_parent_company = company_domain in parent_companies

    if mapped_category:
        query = (
            QUERY_COMPANY_TOPAPPS_CATEGORY_PARENT
            if is_parent_company
            else QUERY_COMPANY_TOPAPPS_CATEGORY
        )
        df = pd.read_sql(
            query,
            con=DBCON.engine,
            params={
                "company_domain": company_domain,
                "mapped_category": mapped_category,
                "mylimit": limit,
            },
        )
        if needs_groupby:
            df = (
                df.groupby(
                    [
                        "company_domain",
                        "store",
                        "tag_source",
                        "name",
                        "store_id",
                    ]
                )[["installs", "rating_count"]]
                .sum()
                .reset_index()
            )
    else:
        query = (
            QUERY_COMPANY_TOPAPPS_PARENT if is_parent_company else QUERY_COMPANY_TOPAPPS
        )
        df = pd.read_sql(
            query,
            con=DBCON.engine,
            params={"company_domain": company_domain, "mylimit": limit},
        )

    if not df.empty:
        df["review_count"] = 0
        df["rating"] = 5
        df = clean_app_df(df)
        df = df.sort_values(by="rank", ascending=True)
    return df


def search_companies(search_input: str, limit: int = 10) -> pd.DataFrame:
    """Search companies by term in database."""
    logger.info(f"Company search: {search_input=}")
    df = pd.read_sql(
        QUERY_SEARCH_COMPANIES,
        DBCON.engine,
        params={"searchinput": search_input, "mylimit": limit},
    )
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    return df


def search_apps(search_input: str, limit: int = 100) -> pd.DataFrame:
    """Search apps by term in database."""
    logger.info(f"App search: {search_input=}")
    search_input = search_input.replace("+", " & ")
    apps = pd.read_sql(
        QUERY_SEARCH_APPS,
        DBCON.engine,
        params={"searchinput": search_input, "mylimit": limit},
    )
    logger.info(f"App search devs: {search_input=}")
    devapps = pd.read_sql(
        QUERY_SEARCH_DEVS,
        DBCON.engine,
        params={"searchinput": search_input, "mylimit": limit},
    )
    logger.info(f"App search finished: {search_input=}")
    df = pd.concat([apps, devapps]).drop_duplicates()
    if not df.empty:
        df["tempsort"] = df["installs"].fillna(df["rating_count"] * 100)
        df = df.sort_values(by="tempsort", ascending=False).drop(columns=["tempsort"])
        df = clean_app_df(df)
    return df


@lru_cache(maxsize=1)
def get_sdks() -> pd.DataFrame:
    """Get top sdks."""
    df = pd.read_sql(QUERY_SDKS, DBCON.engine)
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    return df


def get_latest_sdks() -> pd.DataFrame:
    """Get latest sdks."""
    df = pd.read_sql(QUERY_LATEST_SDKS, DBCON.engine)
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    return df


def get_user_requested_latest_sdks() -> pd.DataFrame:
    """Get user requested latest sdks."""
    df = pd.read_sql(QUERY_USER_REQUESTED_LATEST_SDKS, DBCON.engine)
    return df


def get_sdk_pattern(value_pattern: str) -> pd.DataFrame:
    """Get sdk pattern."""
    df = pd.read_sql(
        QUERY_SDK_PATTERN,
        DBCON.engine,
        params={"value_pattern": value_pattern},
    )
    df["store"] = df["store"].replace({1: "Google Play", 2: "Apple App Store"})
    return df


@lru_cache(maxsize=1)
def get_company_open_source() -> pd.DataFrame:
    """Get company is open source."""
    df = pd.read_sql(QUERY_COMPANY_OPEN_SOURCE, DBCON.engine)
    return df


def get_keyword_details(keyword: str, limit: int = 30) -> pd.DataFrame:
    """Get keyword details."""
    df = pd.read_sql(
        QUERY_KEYWORD_DETAILS,
        DBCON.engine,
        params={"keyword": keyword, "limit": limit},
    )
    return df


def get_keyword_apps(keyword: str, rank: int = 30) -> pd.DataFrame:
    """Get keyword apps."""
    df = pd.read_sql(
        QUERY_KEYWORD_APPS,
        DBCON.engine,
        params={"keyword": keyword, "rank": rank},
    )
    return df


def get_single_app_keywords(store_id: str) -> pd.DataFrame:
    """Get single app keywords."""
    df = pd.read_sql(
        QUERY_SINGLE_APP_KEYWORDS, DBCON.engine, params={"store_id": store_id}
    )
    return df


def get_sdk_pattern_companies(value_pattern: str) -> pd.DataFrame:
    """Get sdk pattern companies."""
    df = pd.read_sql(
        QUERY_SDK_PATTERN_COMPANIES,
        DBCON.engine,
        params={"value_pattern": value_pattern},
    )
    return df


def get_sitemap_companies() -> pd.DataFrame:
    """Get sitemap companies."""
    df = pd.read_sql(QUERY_SITEMAP_COMPANIES, DBCONWRITE.engine)
    return df


def get_sitemap_apps() -> pd.DataFrame:
    """Get sitemap apps."""
    df = pd.read_sql(QUERY_SITEMAP_APPS, DBCONWRITE.engine)
    return df


def insert_sdk_scan_request(store_id: str | list[str]) -> None:
    """Insert a new sdk scan request."""
    logger.info(f"Inserting new sdk scan request: {store_id}")

    if isinstance(store_id, str):
        store_ids = [{"store_id": store_id}]
    else:
        store_ids = [{"store_id": s} for s in store_id]

    with DBCONWRITE.engine.connect() as connection:
        connection.execute(INSERT_SDK_SCAN_REQUEST, store_ids)
        connection.commit()


logger.info("set db engine")
DBCON = get_db_connection("madrone")
DBCON.set_engine()
DBCONWRITE = get_db_connection("madrone-write")
DBCONWRITE.set_engine()
