"""API for keywords data.

/keywords/app/{store_id} keywords for a specific app
"""

from typing import Self

from litestar import Controller, get
from litestar.datastructures import State

from api_app.utils import extend_app_icon_url
from config import get_logger
from dbcon.queries import get_keyword_apps, get_keyword_details

logger = get_logger(__name__)


class KeywordsController(Controller):
    """Controller holding all API endpoints for keywords."""

    path = "/api/keywords"

    @get(path="/{keyword:str}", cache=86400)
    async def get_keyword_details(self: Self, state: State, keyword: str) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_keyword_details(state, keyword)
        return df.to_dict(orient="records")

    @get(path="/{keyword:str}/ranks", cache=86400)
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
