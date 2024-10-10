"""API endoipoints for companies.

/companies/ returns list of top companies overall.
/networks/ returns list of top networks.
/trackers/ returns list of top trackers.
"""

from typing import Self

import pandas as pd
from litestar import Controller, get
from litestar.exceptions import NotFoundException

from api_app.models import (
    AppGroup,
    CompaniesOverview,
    CompanyApps,
    CompanyAppsOverview,
    CompanyOverview,
    CompanyPatterns,
    CompanyPatternsDict,
    CompanyPlatformOverview,
    ParentCompanyTree,
    PlatformCompanies,
    TopCompanies,
)
from config import get_logger
from dbcon.queries import (
    get_apps_for_company,
    get_companies_overview,
    get_company_overview,
    get_company_parent_categories,
    get_company_sdks,
    get_company_tree,
    get_top_companies,
    new_get_top_apps_for_company,
)

logger = get_logger(__name__)


def get_company_apps_new(company_name: str) -> CompanyAppsOverview:
    """Get the overview data from the database."""
    df = new_get_top_apps_for_company(company_name=company_name)

    android_adstxt = df[
        (df["tag_source"] == "app_ads") & (df["store"].str.startswith("Google"))
    ]
    ios_adstxt = df[
        (df["tag_source"] == "app_ads") & (~df["store"].str.startswith("Google"))
    ]

    android_sdk = df[
        (df["tag_source"] == "sdk") & (df["store"].str.startswith("Google"))
    ]
    ios_sdk = df[(df["tag_source"] == "sdk") & (~df["store"].str.startswith("Google"))]

    results = CompanyAppsOverview(
        adstxt=CompanyPlatformOverview(
            android=AppGroup(
                apps=android_adstxt.to_dict(orient="records"),
                title=company_name,
            ),
            ios=AppGroup(apps=ios_adstxt.to_dict(orient="records"), title=company_name),
        ),
        sdk=CompanyPlatformOverview(
            android=AppGroup(
                apps=android_sdk.to_dict(orient="records"),
                title=company_name,
            ),
            ios=AppGroup(apps=ios_sdk.to_dict(orient="records"), title=company_name),
        ),
    )
    return results


def get_overviews() -> CompaniesOverview:
    """Get the overview data from the database."""
    overview_df = get_companies_overview()

    ios_sdk = overview_df[
        (~overview_df["store"].str.contains("google", case=False))
        & (overview_df["tag_source"] == "sdk")
    ]

    ios_adstxt = overview_df[
        (~overview_df["store"].str.contains("google", case=False))
        & (overview_df["tag_source"] == "app_ads")
    ]

    android_sdk = overview_df[
        (overview_df["store"].str.contains("google", case=False))
        & (overview_df["tag_source"] == "sdk")
    ]

    android_adstxt = overview_df[
        (overview_df["store"].str.contains("google", case=False))
        & (overview_df["tag_source"] == "app_ads")
    ]

    results = CompaniesOverview(
        sdk=PlatformCompanies(
            ios=ios_sdk.to_dict(orient="records"),
            android=android_sdk.to_dict(orient="records"),
        ),
        adstxt=PlatformCompanies(
            ios=ios_adstxt.to_dict(orient="records"),
            android=android_adstxt.to_dict(orient="records"),
        ),
    )
    return results


def append_overall_categories(df: pd.DataFrame) -> pd.DataFrame:
    """Add single row for overall category."""
    metrics = ["installs", "app_count", "ratings"]
    total_cols = ["total_ratings", "total_installs", "category_total_apps"]
    overall_totals = (
        df.groupby(["store", "mapped_category"])[total_cols]
        .first()
        .reset_index()
        .groupby(["store"])[total_cols]
        .sum()
    )
    overall_company_df = df.groupby(["store", "name"])[metrics].sum().reset_index()
    overall_df = overall_company_df.merge(
        overall_totals,
        how="left",
        on="store",
        validate="m:1",
    )
    overall_df["mapped_category"] = "overall"
    df = pd.concat([df, overall_df])
    """Append a consolidated games category.
    note this wouldn't work for Apple as not needed.
    """
    games_cat_df = (
        df.loc[(df["mapped_category"].str.contains(r"^game"))]
        .groupby(["store", "name"])[metrics + total_cols]
        .sum()
        .reset_index()
    )
    games_cat_df["mapped_category"] = "games"
    df = pd.concat([df, games_cat_df])
    return df


def companies_overview(categories: list[int]) -> TopCompanies:
    """Process networks and return TopCompanies class."""
    df = get_top_companies(categories=categories)
    df_parents = get_top_companies(
        categories=categories,
        group_by_parent=True,
    )

    df = df[~df["company_name"].isna()].rename(columns={"company_name": "name"})
    df_parents = df_parents.rename(columns={"company_name": "name"})

    # Append combined columns like "overall" and "games"
    df = append_overall_categories(df)
    df_parents = append_overall_categories(df_parents)

    # Since new columns added, recalculate percentages
    df["app_count_percent"] = df["app_count"] / df["category_total_apps"]
    df["installs_percent"] = df["installs"] / df["total_installs"]
    df["ratings_percent"] = df["ratings"] / df["total_ratings"]
    df_parents["app_count_percent"] = (
        df_parents["app_count"] / df_parents["category_total_apps"]
    )
    df_parents["installs_percent"] = (
        df_parents["installs"] / df_parents["total_installs"]
    )
    df_parents["ratings_percent"] = df_parents["ratings"] / df_parents["total_ratings"]

    df = df.sort_values(
        ["app_count_percent", "installs", "ratings"],
        ascending=False,
        na_position="first",
    )
    df_parents = df_parents.sort_values(
        ["app_count_percent", "installs", "ratings"],
        ascending=False,
        na_position="first",
    )

    required_columns = [
        "store",
        "mapped_category",
        "name",
        "installs",
        "ratings",
        "app_count",
        "installs_percent",
        "ratings_percent",
        "app_count_percent",
    ]

    df = df[[*required_columns, "parent_company_name"]]
    df_parents = df_parents[required_columns]

    def transform_group(group: pd.DataFrame) -> dict:
        return group.drop(columns=["store", "mapped_category"]).to_dict(
            orient="records",
        )

    top = TopCompanies(
        all_companies=df.groupby(["store", "mapped_category"])
        .apply(transform_group)
        .unstack(level=1)
        .to_dict(orient="index"),
        parent_companies=df_parents.groupby(["store", "mapped_category"])
        .apply(transform_group)
        .unstack(level=1)
        .to_dict(orient="index"),
    )
    return top


class CompaniesController(Controller):

    """API EndPoint return for all ad tech companies."""

    path = "/api/"

    @get(path="/companies", cache=3600)
    async def companies(self: Self) -> CompaniesOverview:
        """Handle GET request for all companies.

        Returns
        -------
        CompaniesOverview
            An overview of companies across different platforms and sources.

        """
        logger.info("GET /api/companies start")

        overview = get_overviews()

        return overview

    @get(
        path="/companies/{company_name:str}",
        cache=3600,
    )
    async def company_overview(
        self: Self,
        company_name: str,
    ) -> CompanyOverview:
        """Handle GET request for a specific company.

        Args:
        ----
        company_name : str
            The name of the company to retrieve apps for.

        Returns:
        -------
        CompaniesOverview
            An overview of companies, filtered for the specified company and category.

        """
        logger.info(f"GET /api/companies/{company_name}/ start")

        df = get_company_overview(company_name=company_name)

        # Define conditions
        conditions = {
            "sdk_ios": (df["store"].str.contains("Apple"))
            & (df["tag_source"] == "sdk"),
            "sdk_android": (df["store"].str.contains("Google"))
            & (df["tag_source"] == "sdk"),
            "adstxt_ios": (df["store"].str.contains("Apple"))
            & (df["tag_source"] == "app_ads"),
            "adstxt_android": (df["store"].str.contains("Google"))
            & (df["tag_source"] == "app_ads"),
        }

        # Calculate sums for all conditions in one go
        results = {
            key: df.loc[condition, "app_count"].sum()
            for key, condition in conditions.items()
        }

        # Unpack results
        (
            sdk_ios_total_apps,
            sdk_android_total_apps,
            adstxt_ios_total_apps,
            adstxt_android_total_apps,
        ) = (
            results["sdk_ios"],
            results["sdk_android"],
            results["adstxt_ios"],
            results["adstxt_android"],
        )

        total_apps = (
            sdk_ios_total_apps
            + sdk_android_total_apps
            + adstxt_ios_total_apps
            + adstxt_android_total_apps
        )

        overview = CompanyOverview(
            total_apps=total_apps,
            adstxt_ios_total_apps=adstxt_ios_total_apps,
            adstxt_android_total_apps=adstxt_android_total_apps,
            sdk_ios_total_apps=sdk_ios_total_apps,
            sdk_android_total_apps=sdk_android_total_apps,
        )
        return overview

    @get(
        path="/companies/{company_name:str}/topapps",
        cache=3600,
    )
    async def company_apps(
        self: Self,
        company_name: str,
    ) -> CompanyAppsOverview:
        """Handle GET request for a specific company.

        Args:
        ----
        company_name : str
            The name of the company to retrieve apps for.

        Returns:
        -------
        CompaniesOverview
            An overview of companies, filtered for the specified company and category.

        """
        logger.info(f"GET /api/companies/{company_name}/apps start")

        results = get_company_apps_new(company_name=company_name)

        return results

    @get(
        path="/companies/{company_name:str}/parentcategories",
        cache=3600,
    )
    async def company_parent_categories(
        self: Self,
        company_name: str,
    ) -> dict:
        """Handle GET request for a specific company parent categories.

        Args:
        ----
        company_name : str
            The name of the company to retrieve apps for.

        Returns:
        -------
        dict
            A dictionary of parent categories for the specified company.

        """
        logger.info(f"GET /api/companies/{company_name}/parentcategories start")

        df = get_company_parent_categories(company_name=company_name)

        num_categories = 6

        top_cats = (
            df.sort_values(by="app_count", ascending=False)
            .head(num_categories)
            .app_categories.tolist()
        )

        df.loc[df["app_category"].isin(top_cats), "app_category"] = "others"

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

        """export default [
                  {
                    group: '2V2N 9KYPM version 1',
                    value: 20000
                },
                {
                    group: 'L22I P66EP L22I P66EP L22I P66EP',
                    value: 65000
                },
                ...
                ]
            """

        return df.to_dict(orient="records")

    @get(
        path="/companies/{company_name:str}/tree",
        cache=3600,
    )
    async def company_tree(
        self: Self,
        company_name: str,
    ) -> ParentCompanyTree:
        """Handle GET request for company tree.

        Args:
        ----
        company_name : str
            The name of the company to retrieve apps for.

        Returns:
        -------
        ParentCompanyTree
            An overview of companies, filtered for the specified company and category.

        """
        logger.info(f"GET /api/companies/{company_name}/tree start")

        df = get_company_tree(company_name=company_name)

        parent_company = df["parent_company_name"].tolist()[0]
        parent_company_domain = df[df["parent_company_name"] == df["company_name"]][
            "domain"
        ].tolist()[0]

        children_companies = df[~(df["parent_company_name"] == df["company_name"])][
            ["company_name", "domain"]
        ].to_dict(orient="records")

        tree = ParentCompanyTree(
            parent_company_name=parent_company,
            parent_company_domain=parent_company_domain,
            children_companies=children_companies,
        )

        return tree

    @get(
        path="/companies/{company_name:str}/sdks",
        cache=3600,
    )
    async def company_sdks(
        self: Self,
        company_name: str,
    ) -> CompanyPatternsDict:
        """Handle GET request for company sdks.

        Args:
        ----
        company_name : str
            The name of the company to retrieve apps for.

        Returns:
        -------
        ParentCompanySDKs
            An overview of companies, filtered for the specified company and category.

        """
        logger.info(f"GET /api/companies/{company_name}/sdks start")

        df = get_company_sdks(company_name=company_name)

        mydict = CompanyPatternsDict(
            companies={
                company_name[0]: CompanyPatterns(
                    package_patterns=mylist["package_pattern"].unique().tolist(),
                    paths=mylist["path_pattern"].unique().tolist(),
                )
                for company_name, mylist in df.groupby(["company_name"])
            },
        )

        return mydict

    @get(
        path="/companies/{company_name:str}/{store_name:str}/{category_name:str}",
        cache=3600,
    )
    async def get_company_apps(
        self: Self,
        company_name: str,
        store_name: str,
        category_name: str,
    ) -> CompanyApps:
        """Handle GET request for apps of a specific company.

        Args:
        ----
        company_name : str
            The name of the company to retrieve apps for.
        store_name : str
            The name of the store to retrieve apps for.
        category_name : str
            The name of the category to retrieve apps for.

        Returns:
        -------
        CompanyApps
            A representation of the apps for the specified company, store, and category.

        Raises:
        ------
        NotFoundException
            If the store name or company name is not found.

        """
        logger.info(
            f"GET /api/companies/{company_name}/{store_name}/{category_name} start",
        )

        if store_name == "Google":
            store_id = 1
        elif store_name == "Apple":
            store_id = 2
        else:
            msg = f"Store Name not found: {store_name!r}"
            raise NotFoundException(
                msg,
                status_code=404,
            )

        apps_df = get_apps_for_company(
            company_name=company_name,
            store_id=store_id,
            mapped_category=category_name,
            include_parents=True,
        )

        if apps_df.empty:
            msg = f"Network Name not found: {company_name!r}"
            raise NotFoundException(
                msg,
                status_code=404,
            )
        apps_dict = apps_df.to_dict(orient="records")

        apps = CompanyApps(
            title=company_name,
            apps=apps_dict,
        )
        return apps

    @get(path="/networks", cache=3600)
    async def top_networks(self: Self) -> TopCompanies:
        """Handle GET request for a list of top networks.

        Returns
        -------
        TopCompanies
            A representation of the top networks across different platforms and categories.

        """
        logger.info("GET /api/networks start")
        overview = companies_overview(categories=[1])

        return overview

    @get(path="/trackers", cache=3600)
    async def top_trackers(self: Self) -> TopCompanies:
        """Handle GET request for a list of top trackers.

        Returns
        -------
        TopCompanies
            A representation of the top trackers across different platforms and categories.

        """
        logger.info("GET /api/trackers start")
        overview = companies_overview(categories=[2, 3])

        return overview
