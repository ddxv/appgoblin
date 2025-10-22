"""API for app data.

/apps/{store_id} a specific app
/apps/search/{search_term} search for apps
"""

import datetime
import time
import urllib.parse
from typing import Self

import numpy as np
import pandas as pd
from adscrawler.app_stores import apple, google, scrape_stores
from litestar import Controller, Response, get, post
from litestar.background_tasks import BackgroundTask
from litestar.datastructures import State
from litestar.exceptions import NotFoundException

from api_app.models import (
    AdsTxtEntries,
    AppDetail,
    AppGroup,
    AppHistory,
    AppRank,
    AppRankOverview,
    AppSDKsOverview,
    SDKsDetails,
)
from config import get_logger
from dbcon.queries import (
    get_app_adstxt_overview,
    get_app_api_details,
    get_app_history,
    get_app_sdk_details,
    get_app_sdk_overview,
    get_growth_apps,
    get_ranks_for_app,
    get_ranks_for_app_overview,
    get_recent_apps,
    get_single_app,
    get_single_app_keywords,
    get_single_apps_adstxt,
    insert_sdk_scan_request,
    search_apps,
)
from dbcon.static import get_company_logos_df, get_total_counts

logger = get_logger(__name__)


def search_both_stores(state: State, search_term: str) -> None:
    """Search both stores and return resulting AppGroup."""
    google_full_results = google.search_play_store(search_term)
    if len(google_full_results) > 0:
        process_search_results(state.dbconwrite, google_full_results)
    apple_ids = apple.search_app_store_for_ids(search_term)
    if len(apple_ids) > 0:
        apple_full_results = [
            {"store_id": store_id, "store": 2} for store_id in apple_ids
        ]
        process_search_results(state.dbconwrite, apple_full_results)


def get_search_results(state: State, search_term: str) -> AppGroup:
    """Parse search term and return resulting AppGroup."""
    decoded_input = urllib.parse.unquote(search_term)
    decoded_input = decoded_input.strip()
    if decoded_input[-1] == "+":
        decoded_input = decoded_input[:-1]
    df = search_apps(state, search_input=decoded_input, limit=60)
    df = extend_app_icon_url(df)
    logger.info(f"{decoded_input=} returned rows: {df.shape[0]}")
    apps_dict = df.to_dict(orient="records")
    app_group = AppGroup(title=search_term, apps=apps_dict)
    return app_group


def process_search_results(dbconwrite, results: list[dict]) -> None:
    """After having queried an external app store send results to db."""
    logger.info(f"background:search results to be processed {len(results)}")
    scrape_stores.process_scraped(dbconwrite, results, "appgoblin_search")
    logger.info("background:search results done")


def attach_rating_history(app_hist: pd.DataFrame, star_cols: list[str]) -> pd.DataFrame:
    """Get the rating history of an app."""
    df = app_hist[["crawled_date", "histogram"]].copy()
    df[star_cols] = np.stack(app_hist["histogram"].values)
    df = df.sort_values(["crawled_date"])
    df = df.drop(columns=["histogram", "crawled_date"])
    change_df = df[star_cols].diff()
    change_df = change_df.rename(
        columns={col: "new_" + col for col in change_df.columns}
    )
    app_hist = pd.concat([app_hist, df, change_df], axis=1)
    return app_hist


def app_history(
    state: State, store_app: int, app_name: str, country: str
) -> AppHistory:
    """Get the history of app scraping."""
    app_hist = get_app_history(state, store_app, country)
    if app_hist.empty:
        return AppHistory(
            histogram=[],
            plot_data={},
        )
    histogram = app_hist.sort_values(["id"]).tail(1)["histogram"].to_numpy()[0]
    app_hist = app_hist[
        ~((app_hist["installs"].isna()) & (app_hist["rating_count"].isna()))
    ]
    app_hist["group"] = app_name
    plot_dicts = create_plot_dicts(app_hist, histogram)
    hist = AppHistory(
        histogram=histogram,
        plot_data=plot_dicts,
    )
    return hist


def create_plot_dicts(app_hist: pd.DataFrame, histogram: list[int]) -> dict:
    """Create plot dicts for the app history."""
    metrics = ["installs", "rating", "review_count", "rating_count"]
    group_col = "group"
    xaxis_col = "crawled_date"
    app_hist = app_hist.sort_values(xaxis_col)
    app_hist["date_change"] = app_hist[xaxis_col] - app_hist[xaxis_col].shift(1)
    app_hist["days_changed"] = app_hist["date_change"].apply(
        lambda x: np.nan if pd.isna(x) else x.days,
    )
    change_metrics = []
    for metric in metrics:
        app_hist[f"{metric}_change"] = app_hist[metric] - app_hist.shift(1)[metric]
        # Rate of Change
        app_hist[f"{metric}_rate_of_change"] = (
            app_hist[metric] - app_hist.shift(1)[metric]
        ) / app_hist.shift(1)[metric]
        # Treated as whole percentage by frontend
        app_hist[f"{metric}_rate_of_change"] = (
            app_hist[f"{metric}_rate_of_change"] * 100
        )
        # Avg Per Day
        app_hist[f"{metric}_avg_per_day"] = (
            app_hist[f"{metric}_change"] / app_hist["days_changed"]
        )
        change_metrics.append(metric + "_rate_of_change")
        change_metrics.append(metric + "_avg_per_day")
    star_cols: list[str] = []
    new_star_cols: list[str] = []
    if sum(histogram) > 0:
        new_star_cols = [f"new_{col}" for col in star_cols]
        star_cols = ["one_star", "two_star", "three_star", "four_star", "five_star"]
        new_star_cols = ["new_" + col for col in star_cols]
        app_hist = attach_rating_history(app_hist, star_cols)
    app_hist = (
        app_hist[[group_col, xaxis_col, *change_metrics, *star_cols, *new_star_cols]]
        .drop(app_hist.index[0])
        .rename(
            columns={
                "installs_avg_per_day": "Installs Daily Average",
                "rating_count_avg_per_day": "Rating Count Daily Average",
                "review_count_avg_per_day": "Review Count Daily Average",
                "rating_rate_of_change": "Rating Rate of Change",
                "installs_rate_of_change": "Installs Rate of Change",
                "rating_count_rate_of_change": "Rating Count Rate of Change",
                "review_count_rate_of_change": "Review Count Rate of Change",
                "one_star": "One Star",
                "two_star": "Two Star",
                "three_star": "Three Star",
                "four_star": "Four Star",
                "five_star": "Five Star",
                "new_one_star": "New One Star",
                "new_two_star": "New Two Star",
                "new_three_star": "New Three Star",
                "new_four_star": "New Four Star",
                "new_five_star": "New Five Star",
            },
        )
    )
    app_hist = app_hist.replace([np.inf, -np.inf], np.nan)
    app_hist = app_hist.dropna(axis="columns", how="all")
    if app_hist.empty:
        return app_hist.to_dict(orient="records")
    # Not useful column
    app_hist = app_hist.drop(["rating_avg_per_day"], axis=1, errors="ignore")
    # This is an odd step as it makes each group a metric
    # not for when more than 1 dimension
    mymelt = app_hist.melt(id_vars=xaxis_col).rename(columns={"variable": "group"})
    final_metrics = [x for x in app_hist.columns if x not in ["group", "crawled_date"]]
    change_dicts = []
    ratings_dicts = []
    ratings_stars_dicts = []
    ratings_stars_new_dicts = []
    plot_dicts = {}
    for metric in final_metrics:
        meltdf = mymelt.loc[mymelt.group == metric]
        metric_dict = meltdf.to_dict(orient="records")
        if "Rate of Change" in metric:
            change_dicts += metric_dict
        if metric == "Installs Daily Average":
            plot_dicts["installs"] = metric_dict
        if metric in ["Review Count Daily Average", "Rating Count Daily Average"]:
            ratings_dicts += metric_dict
        if " Star" in metric:
            if "New" in metric:
                ratings_stars_new_dicts += metric_dict
            else:
                ratings_stars_dicts += metric_dict
    plot_dicts["ratings"] = ratings_dicts
    plot_dicts["changes"] = change_dicts
    plot_dicts["ratings_stars"] = ratings_stars_dicts
    plot_dicts["ratings_stars_new"] = ratings_stars_new_dicts
    return plot_dicts


def get_string_date_from_days_ago(days: int) -> str:
    """Get the stringified date from x days ago."""
    mydate = datetime.datetime.now(datetime.UTC) - datetime.timedelta(days=days)
    mydate_str = mydate.strftime("%Y-%m-%d")
    return mydate_str


def extend_app_icon_url(df: pd.DataFrame) -> pd.DataFrame:
    df["app_icon_url"] = np.where(
        df["icon_url_100"].notna(),
        "https://media.appgoblin.info/app-icons/"
        + df["store_id"]
        + "/"
        + df["icon_url_100"],
        df["icon_url_512"],
    )
    return df


def get_new_apps_dict(state: State, period: str, store: int, category: str) -> AppGroup:
    """Get collection overview."""
    category_limit = 20

    df = get_recent_apps(
        state, collection=period, store=store, category=category, limit=category_limit
    )
    df = extend_app_icon_url(df)
    df = df.sort_values(["installs", "rating_count"], ascending=False).head(
        category_limit
    )
    appgroup = AppGroup(
        title=COLLECTIONS[period]["title"],
        apps=df.to_dict(orient="records"),
    )
    return appgroup


class AppController(Controller):
    """Controller holding all API endpoints for an app."""

    path = "/api/apps"

    @get(path="/overview", cache=86400)
    async def get_overview(self: Self, state: State) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A dictionary representation of the total counts

        """
        start = time.perf_counter() * 1000
        overview_df = get_total_counts(state)
        overview_dict = overview_df.to_dict(orient="records")[0]
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/overview took {duration}ms")
        return overview_dict

    @get(path="/new-apps/{period:str}/{store:int}/{category:str}", cache=86400)
    async def get_new_apps(
        self: Self, state: State, period: str, store: int, category: str
    ) -> AppGroup:
        """Handle GET request for a list of apps.

        Args:
        ----
            period: these are appgoblin specific collections of 'new' apps
            store: which store to query
            category: app category

        Returns:
        -------
            A dictionary representation of the list of apps for homepage

        """
        start = time.perf_counter() * 1000
        home_dict = get_new_apps_dict(
            state=state, period=period, store=store, category=category
        )

        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/collections/{period} took {duration}ms")
        return home_dict

    @get(path="/growth/{store:int}", cache=86400)
    async def get_growth_apps(
        self: Self, state: State, store: int, app_category: str | None = None
    ) -> list[dict]:
        """Handle GET request for a list of fastest growing apps.

        Args:
        ----
            store (int): The store to retrieve.
            app_category (str): The category of apps to retrieve.

        Returns:
        -------
            A dictionary representation of the list of apps for homepage

        """
        start = time.perf_counter() * 1000
        if app_category == "overall":
            app_category = None
        df = get_growth_apps(state, store=store, app_category=app_category)
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/growth took {duration}ms")
        return {"apps": df.to_dict(orient="records")}

    @get(path="/{store_id:str}", cache=3600)
    async def get_app_detail(self: Self, state: State, store_id: str) -> AppDetail:
        """Handle GET request for a specific app.

         store_id (str): The id of the app to retrieve.

        Returns
        -------
            json

        """
        start = time.perf_counter() * 1000
        app_df = get_single_app(state, store_id)
        if app_df.empty:
            msg = f"Store ID not found: {store_id!r}"
            raise NotFoundException(
                msg,
                status_code=404,
            )
        app_dict = app_df.to_dict(orient="records")[0]
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id} took {duration}ms")
        return app_dict

    @get(path="/{store_id:str}/history", cache=3600)
    async def get_app_history_details(
        self: Self,
        state: State,
        store_id: str,
    ) -> AppHistory:
        """Handle GET request for a specific app.

         store_id (str): The id of the app to retrieve.

        Returns
        -------
            json

        """
        start = time.perf_counter() * 1000
        app_df = get_single_app(state, store_id)

        if app_df.empty:
            logger.info(f"App history not found: {store_id}")
            return AppHistory(
                histogram=[],
                plot_data={},
            )

        app_dict = app_df.to_dict(orient="records")[0]
        store_app = app_dict["id"]
        app_name = app_dict["name"]

        hist_dict = app_history(
            state=state, store_app=store_app, app_name=app_name, country="US"
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id}/history took {duration}ms")
        return hist_dict

    @get(path="/{store_id:str}/sdksoverview", cache=3600)
    async def get_sdk_overview(
        self: Self, state: State, store_id: str
    ) -> AppSDKsOverview:
        """Handle GET request for overview of SDKs for a specific app.

         store_id (str): The id of the app to retrieve.

        Returns
        -------
            json

        """
        start = time.perf_counter() * 1000

        df = get_app_sdk_overview(state, store_id)

        df = df.merge(
            get_company_logos_df(state),
            left_on="company_domain",
            right_on="company_domain",
            how="left",
            validate="m:1",
        )

        cats = df.loc[df["category_slug"].notna(), "category_slug"].unique().tolist()
        company_cats = {}
        for cat in cats:
            company_cats[cat] = df[df["category_slug"] == cat][
                ["company_name", "company_domain", "company_logo_url"]
            ].to_dict(orient="records")

        sdk_overview_dict = AppSDKsOverview(
            company_categories=company_cats,
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id}/sdksoverview took {duration}ms")
        return sdk_overview_dict

    @get(path="/{store_id:str}/sdks", cache=3600)
    async def get_sdk_details(self: Self, state: State, store_id: str) -> SDKsDetails:
        """Handle GET request for all SDKs for a specific app.

         store_id (str): The id of the app to retrieve.

        Returns
        -------
            json

        """
        start = time.perf_counter() * 1000

        df = get_app_sdk_details(state, store_id)

        if df.empty or df.isna().all().all():
            logger.info(f"SDK info not found: {store_id}")
            return SDKsDetails(
                company_categories={},
                permissions=[],
                app_queries=[],
                skadnetwork=[],
                leftovers={},
            )

        df.loc[df["value_name"].isna(), "value_name"] = ""

        # NOTE WARNING only works for android packages
        # First medium short for com.google.analytics
        df["short_value_name"] = df.value_name.apply(
            lambda x: ".".join(x.split(".")[0:2])
        )

        cats = df.loc[df["category_slug"].notna(), "category_slug"].unique().tolist()
        company_sdk_dict = {}
        # example: {"ad-networks":
        # {"bytedance.com":
        # {"com.bytedance.sdk":
        # {"application/acitivity":
        # ["com.bytedance.sdk.analytics"]}}}}
        for cat in cats:
            company_sdk_dict[cat] = {
                company: {
                    short_value_name: dddf.groupby("xml_path")["value_name"]
                    .apply(list)
                    .to_dict()
                    for short_value_name, dddf in ddf.groupby("short_value_name")
                }
                for company, ddf in df[df["category_slug"] == cat].groupby(
                    "company_domain"
                )
            }

        is_permission = df["xml_path"] == "uses-permission"
        df.loc[df["xml_path"].str.contains("key", case=False), "value_name"] = (
            "redacted_key"
        )
        is_matching_store_id = df["value_name"].str.startswith(
            ".".join(store_id.split(".")[:2]),
        )

        # maybe try ~(?:com.android... to skip the match groups?
        is_android_activity = df["value_name"].str.contains(
            r"^(com\.android|android|kotlin|smali_)", regex=True
        )

        is_package_query = df["xml_path"].str.contains(
            r"^queries/package|LSApplicationQueriesSchemes"
        )

        is_value_empty = df["value_name"] == ""

        is_skadnetwork = df["xml_path"] == "SKAdNetworkItems"

        permissions_df = df[is_permission]

        leftovers_df = df[
            ~is_permission
            & ~is_matching_store_id
            & ~is_android_activity
            & ~is_value_empty
            & ~is_package_query
            & ~is_skadnetwork
            & df["company_name"].isna()
        ]

        # example: {"bytedance.com":
        # {"application/acitivity":
        # ["com.bytedance.sdk.analytics"] }}
        leftovers_dict = {
            short_value_name: dddf.groupby("xml_path")["value_name"]
            .apply(list)
            .to_dict()
            for short_value_name, dddf in leftovers_df.groupby("short_value_name")
        }

        permissions_list = permissions_df.value_name.tolist()
        permissions_list = [
            x.replace("android.permission.", "") for x in permissions_list
        ]

        app_queries = df[is_package_query].value_name.unique().tolist()

        skadnetwork_list = df[is_skadnetwork].value_name.unique().tolist()

        trackers_dict = SDKsDetails(
            company_categories=company_sdk_dict,
            permissions=permissions_list,
            leftovers=leftovers_dict,
            app_queries=app_queries,
            skadnetwork=skadnetwork_list,
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id}/sdks took {duration}ms")
        return trackers_dict

    @get(path="/{store_id:str}/ranks/overview", cache=3600)
    async def app_ranks_overview(
        self: Self, state: State, store_id: str
    ) -> AppRankOverview:
        """Handle GET requests for a specific app ranks.

        Args:
        ----
            store_id (str): The id of the store to retrieve.

        Returns:
        -------
            json

        """
        start = time.perf_counter() * 1000
        df_overview = get_ranks_for_app_overview(state, store_id=store_id, days=90)
        if df_overview.empty:
            logger.info(f"No ranks found for {store_id!r}")
            return AppRankOverview(countries=[], best_ranks=[])
        countries = df_overview["country"].unique().tolist()
        countries = sorted(countries)
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id}/ranks/overview took {duration}ms")
        return AppRankOverview(
            countries=countries, best_ranks=df_overview.to_dict(orient="records")
        )

    @get(path="/{store_id:str}/ranks", cache=3600)
    async def app_ranks(
        self: Self, state: State, store_id: str, country: str = "US"
    ) -> AppRank:
        """Handle GET requests for a specific app ranks.

        Args:
        ----
            store_id (str): The id of the store to retrieve.
            country (str): The country to retrieve, alpha2 code (capitalized)

        Returns:
        -------
            json

        """
        start = time.perf_counter() * 1000
        df = get_ranks_for_app(state, store_id=store_id, country=country, days=90)
        if df.empty:
            logger.info(f"No ranks found for {store_id!r}")
            return AppRank(history={})
        df["rank_group"] = df["collection"] + ": " + df["category"]
        df["crawled_date"] = pd.to_datetime(df["crawled_date"]).dt.strftime("%Y-%m-%d")
        pdf = df[df["country"] == country][
            ["crawled_date", "rank", "rank_group"]
        ].sort_values("crawled_date")
        # This format is for echarts, expects data series as columns
        hist_dict = (
            pdf.pivot_table(
                columns=["rank_group"],
                index=["crawled_date"],
                values="rank",
            )
            .reset_index()
            .to_dict(orient="records")
        )
        rank_dict = AppRank(history=hist_dict)
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id}/ranks took {duration}ms")
        return rank_dict

    @get(path="/{store_id:str}/adstxt/overview", cache=3600)
    async def get_app_adstxt_overview(
        self: Self, state: State, store_id: str
    ) -> AdsTxtEntries:
        """Handle GET request for a store_id's related ads txt entries.

        Note these IDs are only connected to the app's developer's URL
        and thus are not app specific.

        Args:
        ----
            store_id (str): The url of the store_id's ads txt to retrieve

        Returns:
        -------
            json

        """
        start = time.perf_counter() * 1000
        adstxt_df = get_app_adstxt_overview(state, store_id)

        direct_adstxt_dict = adstxt_df[
            adstxt_df["relationship"].str.upper() == "DIRECT"
        ].to_dict(orient="records")
        reseller_adstxt_dict = adstxt_df[
            adstxt_df["relationship"].str.upper() == "RESELLER"
        ].to_dict(orient="records")

        txts = AdsTxtEntries(
            direct_entries=direct_adstxt_dict,
            reseller_entries=reseller_adstxt_dict,
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id}/adstxt/overview took {duration}ms")
        return txts

    @get(path="/{store_id:str}/adstxt", cache=3600)
    async def get_developer_adstxt(
        self: Self, state: State, store_id: str
    ) -> AdsTxtEntries:
        """Handle GET request for a store_id's related ads txt entries.

        Note these IDs are only connected to the app's developer's URL
        and thus are not app specific.

        Args:
        ----
            store_id (str): The url of the store_id's ads txt to retrieve

        Returns:
        -------
            json

        """
        start = time.perf_counter() * 1000
        adstxt_df = get_single_apps_adstxt(state, store_id)

        if adstxt_df.empty:
            logger.info(f"No ads-txt entries found for {store_id!r}")
            return AdsTxtEntries(direct_entries=[], reseller_entries=[])
        direct_adstxt_dict = adstxt_df[
            adstxt_df["relationship"].str.upper() == "DIRECT"
        ].to_dict(orient="records")
        reseller_adstxt_dict = adstxt_df[
            adstxt_df["relationship"].str.upper() == "RESELLER"
        ].to_dict(orient="records")

        txts = AdsTxtEntries(
            direct_entries=direct_adstxt_dict,
            reseller_entries=reseller_adstxt_dict,
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id}/adstxt took {duration}ms")
        return txts

    @get(path="/search/{search_term:str}", cache=3600)
    async def search(self: Self, state: State, search_term: str) -> AppGroup:
        """Search apps and developers.

        Args:
        ----
            search_term: str the search term to search for.
                Can search packages, developers and app names.

        """
        start = time.perf_counter() * 1000
        apps_dict = get_search_results(state=state, search_term=search_term)
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path} took {duration}ms")
        return Response(
            apps_dict,
            background=BackgroundTask(search_both_stores, state, search_term),
        )

    @post(path="/{store_id:str}/requestSDKScan")
    async def request_sdk_scan(self: Self, state: State, store_id: str) -> dict:
        """Request a new SDK scan for an app."""
        logger.info(f"Requesting SDK scan for {store_id}")
        insert_sdk_scan_request(state, store_id)
        return {"status": "success"}

    @get(path="/{store_id:str}/keywords", cache=86400)
    async def get_app_keywords(self: Self, state: State, store_id: str) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A dictionary representation of the total counts

        """
        start = time.perf_counter() * 1000
        keywords_df = get_single_app_keywords(state, store_id)
        keyword_scores = keywords_df.to_dict(orient="records")
        keywords_list = keywords_df["keyword_text"].tolist()
        keywords_dict = {"keywords": keywords_list, "keyword_scores": keyword_scores}
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id}/keywords took {duration}ms")
        return keywords_dict

    @get(path="/{store_id:str}/apis", cache=86400)
    async def get_app_apis(self: Self, state: State, store_id: str) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A list of API calls

        """
        start = time.perf_counter() * 1000
        apis_df = get_app_api_details(state, store_id)
        apis_list = apis_df.to_dict(orient="records")
        apis_dict = {"apis": apis_list}
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{store_id}/apis took {duration}ms")
        return apis_dict


COLLECTIONS = {
    "new_weekly": {"title": "New Apps this Week"},
    "new_monthly": {"title": "New Apps this Month"},
    "new_yearly": {"title": "New Apps this Year"},
}
