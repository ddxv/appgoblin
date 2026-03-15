"""API for keywords data.

/keywords/app/{store_id} keywords for a specific app
"""

from typing import Self

import pandas as pd
from litestar import Controller, get
from litestar.datastructures import State

from api_app.utils import extend_app_icon_url
from config import get_logger
from dbcon.queries import (
    get_app_keywords_history,
    get_keyword_apps,
    get_keyword_details,
)

logger = get_logger(__name__)


class KeywordsController(Controller):
    """Controller holding all API endpoints for keywords."""

    path = "/api/keywords"

    @get(path="/{keyword:str}", cache=3600)
    async def get_keyword_details(self: Self, state: State, keyword: str) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_keyword_details(state, keyword)
        return df.to_dict(orient="records")

    @get(path="/{keyword:str}/ranks", cache=3600)
    async def get_keyword_apps(self: Self, state: State, keyword: str) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_keyword_apps(state, keyword)
        df = extend_app_icon_url(df)
        df_android = df[df["store"] == 1]
        df_ios = df[df["store"] == 2]
        return {
            "apple": {"ranks": df_ios.to_dict(orient="records")},
            "google": {"ranks": df_android.to_dict(orient="records")},
        }

    @get(path="/app/{store_app_id:int}", cache=3600)
    async def get_app_keywords(
        self: Self, state: State, store_app_id: int, keyword_ids: list[int]
    ) -> list[dict]:
        """Handle GET request for app keywords history.

        Returns
        -------
            A list of dictionary representations of the history

        """
        if not keyword_ids:
            return []
        logger.info(
            f"Getting keyword history for app {store_app_id} and keywords {keyword_ids}"
        )
        df = get_app_keywords_history(
            state, store_app_id=store_app_id, keyword_ids=tuple(keyword_ids)
        )
        if df.empty:
            return []

        # Build one row per date with keyword_id columns, then carry rank forward.
        df["crawled_date"] = pd.to_datetime(df["crawled_date"]).dt.strftime("%Y-%m-%d")
        pivoted = (
            df.pivot_table(
                index="crawled_date",
                columns="keyword_id",
                values="app_rank",
                aggfunc="first",
            )
            .sort_index()
            .ffill()
        )

        # Use string keys for stable JSON object fields.
        pivoted.columns = pivoted.columns.astype(str)
        pivoted = pivoted.reset_index()
        pivoted = pivoted.astype(object).where(pd.notna(pivoted), None)
        pdicts = pivoted.to_dict(orient="records")

        return pdicts
