"""Return API endpoint for categories.

/categories/{category_id} a specific app
"""

import time
from typing import Self

from litestar import Controller, get
from litestar.config.response_cache import CACHE_FOREVER
from litestar.datastructures import State

from api_app.models import CategoriesOverview, CategoryDetail
from config import get_logger
from dbcon.queries import (
    get_country_map,
)
from dbcon.static import build_app_categories_overview, get_appstore_categories

logger = get_logger(__name__)


def category_overview(state: State) -> list[dict]:
    """Categories for apps."""
    cats = get_appstore_categories(state=state)
    return build_app_categories_overview(cats)


class CategoryController(Controller):
    """App Store Categories API."""

    path = "/api/categories"

    @get(path="/countries", cache=CACHE_FOREVER)
    async def get_countries(self: Self, state: State) -> dict:
        """Handle GET request for all countries."""
        df = get_country_map(state)
        country_dict = df.set_index("alpha2")[
            ["langen", "app_ranks", "app_details"]
        ].to_dict(orient="index")
        return country_dict

    @get(path="/", cache=CACHE_FOREVER)
    async def get_categories_overview(self: Self, state: State) -> CategoriesOverview:
        """Handle GET request for a list of categories.

        Returns
        -------
            A dictionary representation of the list of categories
            each with an id, name, type and total of apps

        """
        start = time.perf_counter() * 1000
        category_dicts = category_overview(state=state)
        overview = CategoriesOverview(
            categories=[CategoryDetail(**d) for d in category_dicts],  # type: ignore[arg-type]
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path} took {duration}ms")
        return overview
