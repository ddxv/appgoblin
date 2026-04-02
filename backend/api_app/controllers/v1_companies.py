"""Versioned public API endpoints — requires API key authentication."""

import time
from typing import Self

from litestar import Controller, get
from litestar.datastructures import State

from api_app.controllers.companies import get_companies_parent_category_stats
from api_app.guards import validate_api_key
from config import get_logger

logger = get_logger(__name__)


def _api_key_guard(request, route_handler) -> None:
    """Guard that validates the X-API-Key header."""
    state = request.app.state
    validate_api_key(request, state)


class V1CompaniesController(Controller):
    """Public API v1 — companies endpoints (API key required)."""

    path = "/api/v1/"
    guards = [_api_key_guard]

    @get(path="/companies", cache=86400)
    async def companies(self: Self, state: State) -> list[dict]:
        """Return a list of all mapped companies.

        Each entry contains ``company_id``, ``name``, and ``count``
        (number of apps associated with the company across stores).
        """
        start = time.perf_counter() * 1000
        df = get_companies_parent_category_stats(state)
        df = (
            df.groupby(["company_domain", "company_name", "tag_source"])[
                ["app_count", "installs_d30"]
            ]
            .sum()
            .reset_index()
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"GET /api/v1/companies took {duration}ms")

        return df.to_dict(orient="records")
