"""API for creatives data.

/creatives/app/{store_id} creatives for a specific app
"""

from typing import Self

from litestar import Controller, get

from config import get_logger
from dbcon.queries import get_advertiser_creative_rankings, get_advertiser_creatives

logger = get_logger(__name__)


class CreativesController(Controller):
    """Controller holding all API endpoints for creatives."""

    path = "/api/creatives"

    @get(path="/", cache=86400)
    async def advertiser_creative_rankings(self: Self) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_advertiser_creative_rankings()
        df["last_seen"] = df["last_seen"].dt.strftime("%Y-%m-%d")
        return df.to_dict(orient="records")

    @get(path="/apps/{store_id: str}", cache=86400)
    async def get_advertiser_creatives(self: Self, store_id: str) -> dict:
        """Handle GET request for a list of creatives for an app.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_advertiser_creatives(store_id)
        return df.to_dict(orient="records")
