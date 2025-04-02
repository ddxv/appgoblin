"""API for keywords data.

/keywords/app/{store_id} keywords for a specific app
"""

import time
from typing import Self

from litestar import Controller, get

from config import get_logger
from dbcon.queries import (
    get_single_app_keywords,
)

logger = get_logger(__name__)


class KeywordsController(Controller):
    """Controller holding all API endpoints for keywords."""

    path = "/api/keywords"

    @get(path="/app/{store_id:str}", cache=86400)
    async def get_app_keywords(self: Self, store_id: str) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A dictionary representation of the total counts

        """
        start = time.perf_counter() * 1000
        keywords_df = get_single_app_keywords(store_id)
        keywords_list = keywords_df["keyword_text"].tolist()
        keywords_dict = {"keywords": keywords_list}
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/app/{store_id} took {duration}ms")
        return keywords_dict
