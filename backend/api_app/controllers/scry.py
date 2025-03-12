"""Scry API controllers.

PUBLIC

"""

from typing import Self

from litestar import Controller, post

from config import get_logger
from dbcon.queries import (
    get_apps_sdk_overview,
)

logger = get_logger(__name__)


class ScryController(Controller):
    """API EndPoint return for all sdk related paths."""

    path = "/api/public/"

    @post(path="sdks/apps")
    async def lookup_apps(self: Self, data: dict) -> dict:
        """Lookup apps' SDKs by store_ids."""
        store_ids = data.get("store_ids", [])
        store_ids_log_str = ",".join(store_ids[0:2])
        df = get_apps_sdk_overview(tuple(store_ids))
        logger.info(f"looked up store_ids:{store_ids_log_str} found {df.shape[0]} apps")
        return df.to_dict(orient="records")
