"""API endoipoints for sdks.

/sdks/overview returns list of all sdks.
"""

import time
from typing import Self

from litestar import Controller, get

from api_app.models import (
    SdkCompanies,
    SdkOverview,
    SdksOverview,
)
from config import get_logger
from dbcon.queries import (
    get_latest_sdks,
    get_sdk_pattern,
    get_sdk_pattern_companies,
    get_sdks,
    get_user_requested_latest_sdks,
)

logger = get_logger(__name__)


class SdksController(Controller):
    """API EndPoint return for all sdk related paths."""

    path = "/api/sdks"

    @get(path="/overview", cache=12000)
    async def sdks(self: Self) -> SdksOverview:
        """Handle GET request for all sdks.

        Returns
        -------
        SdksOverview
            An overview of sdks across different platforms and sources.

        """
        start = time.perf_counter() * 1000

        most_sdk_parts = get_sdks()
        latest_apps = get_latest_sdks()
        user_requested_latest_apps = get_user_requested_latest_sdks()

        is_google = most_sdk_parts["store"].str.startswith("Google")
        is_google_apps = latest_apps["store"].str.startswith("Google")

        is_success = latest_apps["crawl_result"] == 1

        android_sdkparts = most_sdk_parts[is_google]
        ios_sdkparts = most_sdk_parts[~is_google]

        android_success_latest_apps = latest_apps[is_google_apps & is_success]
        ios_success_latest_apps = latest_apps[~is_google_apps & is_success]

        android_failed_latest_apps = latest_apps[is_google_apps & ~is_success]
        ios_failed_latest_apps = latest_apps[~is_google_apps & ~is_success]

        android_sdkparts_dict = android_sdkparts.to_dict(orient="records")
        ios_sdkparts_dict = ios_sdkparts.to_dict(orient="records")

        android_success_latest_apps_dict = android_success_latest_apps.to_dict(
            orient="records"
        )
        ios_success_latest_apps_dict = ios_success_latest_apps.to_dict(orient="records")
        android_failed_latest_apps_dict = android_failed_latest_apps.to_dict(
            orient="records"
        )
        ios_failed_latest_apps_dict = ios_failed_latest_apps.to_dict(orient="records")
        user_requested_latest_apps_dict = user_requested_latest_apps.to_dict(
            orient="records"
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/overview took {duration}ms")

        return SdksOverview(
            android_sdkparts=android_sdkparts_dict,
            ios_sdkparts=ios_sdkparts_dict,
            android_success_latest_apps=android_success_latest_apps_dict,
            ios_success_latest_apps=ios_success_latest_apps_dict,
            android_failed_latest_apps=android_failed_latest_apps_dict,
            ios_failed_latest_apps=ios_failed_latest_apps_dict,
            user_requested_latest_apps=user_requested_latest_apps_dict,
        )

    @get(path="/{value_pattern:str}", cache=3600)
    async def sdks_pattern(self: Self, value_pattern: str) -> SdkOverview:
        """Handle GET request for all sdks.

        Returns
        -------
        SdkOverview
            An overview of apps for a given sdk pattern.

        """
        start = time.perf_counter() * 1000

        overview = get_sdk_pattern(value_pattern)

        is_google = overview["store"].str.startswith("Google")
        android_overview = overview[is_google]
        ios_overview = overview[~is_google]

        ios_overview_dict = ios_overview.to_dict(orient="records")
        android_overview_dict = android_overview.to_dict(orient="records")

        overview_resp = SdkOverview(
            ios_overview=ios_overview_dict, android_overview=android_overview_dict
        )

        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{value_pattern} took {duration}ms")
        return overview_resp

    @get(path="/{value_pattern:str}/companies", cache=3600)
    async def sdks_companies(self: Self, value_pattern: str) -> SdkCompanies:
        """Handle GET request for all sdks.

        Returns
        -------
        SdkOverview
            An overview of apps for a given sdk pattern.

        """
        start = time.perf_counter() * 1000

        overview = get_sdk_pattern_companies(value_pattern)

        overview_dict = overview.to_dict(orient="records")

        overview_resp = SdkCompanies(companies=overview_dict)

        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/{value_pattern}/companies took {duration}ms")
        return overview_resp
