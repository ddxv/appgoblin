"""API for keywords data.

/keywords/app/{store_id} keywords for a specific app
"""

from litestar import Controller

from config import get_logger

logger = get_logger(__name__)


class KeywordsController(Controller):
    """Controller holding all API endpoints for keywords."""

    path = "/api/keywords"

    @get(path="/{keyword:str}", cache=86400)
    async def get_keyword_details(self: Self, keyword: str) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A dictionary representation of the total counts

        """
