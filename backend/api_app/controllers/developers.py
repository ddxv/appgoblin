"""API for developer data.

/apps/{store_id} a specific app
/apps/search/{search_term} search for apps
"""

import time
from typing import Self

import pandas as pd
from litestar import Controller, get, post
from litestar.datastructures import State
from litestar.exceptions import NotFoundException

from api_app.models import (
    AppGroup,
    DeveloperApps,
    DeveloperSDKsOverview,
    PlatformDeveloper,
)
from api_app.utils import extend_app_icon_url
from config import get_logger
from dbcon.queries import (
    get_apps_sdk_overview,
    get_single_developer,
)

logger = get_logger(__name__)


class DeveloperController(Controller):
    """Controller holding all API endpoints for an app."""

    path = "/api/developers"

    @get(path="/{developer_id:str}", cache=3600)
    async def get_developer_apps(
        self: Self, state: State, developer_id: str
    ) -> DeveloperApps:
        """Handle GET request for a specific developer.

        Args:
        ----
            developer_id (str): The id of the developer to retrieve.

        Returns:
        -------
            json

        """
        start = time.perf_counter() * 1000

        developer_id = developer_id.replace("&", "%26")

        apps_df = get_single_developer(state, developer_id)
        apps_df = extend_app_icon_url(apps_df)
        if apps_df.empty:
            msg = f"Developer ID not found: {developer_id!r}"
            raise NotFoundException(
                msg,
                status_code=404,
            )

        ios_by_id_df = apps_df[
            (apps_df["store"] == "Apple App Store") & (apps_df["match_type"] == "by_id")
        ]
        google_by_id_df = apps_df[
            (apps_df["store"] == "Google Play") & (apps_df["match_type"] == "by_id")
        ]
        ios_by_url_df = apps_df[
            (apps_df["store"] == "Apple App Store")
            & (apps_df["match_type"] == "by_url")
        ]
        google_by_url_df = apps_df[
            (apps_df["store"] == "Google Play") & (apps_df["match_type"] == "by_url")
        ]
        google_developer_name = None
        google_developer_id = None
        google_developer_url = None
        google_pub_domain_url = None
        apple_developer_name = None
        apple_developer_id = None
        apple_developer_url = None
        apple_pub_domain_url = None
        if not google_by_id_df.empty:
            google_developer_name = google_by_id_df.to_dict(orient="records")[0][
                "developer_name"
            ]
            google_developer_id = google_by_id_df.to_dict(orient="records")[0][
                "developer_id"
            ]
            google_developer_url = google_by_id_df.to_dict(orient="records")[0][
                "store_developer_link"
            ]
            google_pub_domain_url = google_by_id_df[
                google_by_id_df["developer_url"].notna()
            ]["developer_url"].iloc[0]
        if not ios_by_id_df.empty:
            apple_developer_name = ios_by_id_df.to_dict(orient="records")[0][
                "developer_name"
            ]
            apple_developer_id = ios_by_id_df.to_dict(orient="records")[0][
                "developer_id"
            ]
            apple_developer_url = ios_by_id_df.to_dict(orient="records")[0][
                "store_developer_link"
            ]
            apple_pub_domain_url = ios_by_id_df[ios_by_id_df["developer_url"].notna()][
                "developer_url"
            ].iloc[0]
        developer_name = google_developer_name or apple_developer_name
        google_apps_dict = google_by_id_df.to_dict(orient="records")
        apple_apps_dict = ios_by_id_df.to_dict(orient="records")
        google_apps_dict_url = google_by_url_df.to_dict(orient="records")
        apple_apps_dict_url = ios_by_url_df.to_dict(orient="records")

        developer_apps = DeveloperApps(
            google=PlatformDeveloper(
                developer_id=google_developer_id,
                developer_name=google_developer_name,
                developer_url=google_developer_url,
                pub_domain_url=google_pub_domain_url,
                apps=AppGroup(title="Google", apps=google_apps_dict),
                apps_by_url=AppGroup(title="Google", apps=google_apps_dict_url),
            ),
            apple=PlatformDeveloper(
                developer_id=apple_developer_id,
                developer_name=apple_developer_name,
                developer_url=apple_developer_url,
                pub_domain_url=apple_pub_domain_url,
                apps=AppGroup(title="Apple", apps=apple_apps_dict),
                apps_by_url=AppGroup(title="Apple", apps=apple_apps_dict_url),
            ),
            title=developer_name,
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{developer_id} took {duration}ms")
        return developer_apps

    @post(path="/sdks")
    async def get_developer_sdks(
        self: Self, state: State, data: dict
    ) -> DeveloperSDKsOverview:
        """Handle GET request for a specific developer.

        Args:
        ----
            data:
                store_ids (list[str]): The store_ids of the apps to retrieve.

        Returns:
        -------
            json

        """
        start = time.perf_counter() * 1000
        store_ids = data.get("store_ids", [])
        store_ids_log_str = ",".join(store_ids[0:2])
        logger.info(f"looked up store_ids:{store_ids_log_str} start")

        df = get_apps_sdk_overview(state, store_ids=tuple(store_ids))

        success_store_ids = df["store_id"].unique().tolist()
        failed_store_ids = [
            store_id for store_id in store_ids if store_id not in success_store_ids
        ]
        cats = df.loc[df["category_slug"].notna(), "category_slug"].unique().tolist()
        company_cats = {}
        for cat in cats:
            company_cats[cat] = (
                df[df["category_slug"] == cat]
                .groupby(["company_name", "company_domain"])[
                    ["app_name", "store", "store_id"]
                ]
                .apply(
                    lambda x: pd.Series(
                        {
                            "count": len(x),
                            "apps": x[["store", "store_id", "app_name"]].to_dict(
                                orient="records"
                            ),
                        }
                    )
                )
                .reset_index()
                .to_dict(orient="records")
            )

        sdk_overview_dict = DeveloperSDKsOverview(
            sdks=company_cats,
            failed_store_ids=failed_store_ids,
            success_store_ids=success_store_ids,
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/developers/sdks took {duration}ms")
        return sdk_overview_dict
