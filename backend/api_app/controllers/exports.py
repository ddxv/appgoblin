"""Public API for free data exports.

/api/public/exports/datasets - list of available export files
"""

from typing import Self

from litestar import Controller, get
from litestar.config.response_cache import CACHE_FOREVER
from litestar.datastructures import State

from config import get_logger
from dbcon.static import get_s3_datasets

logger = get_logger(__name__)


class ExportsController(Controller):
    """Public endpoint for free data export listings."""

    path = "/api/public/"

    @get(path="exports/datasets", cache=CACHE_FOREVER)
    async def get_datasets(self: Self, state: State) -> list[dict]:
        """Return list of available public export datasets from S3."""
        return get_s3_datasets(state)
