"""Scry API controllers.

PUBLIC

"""

import time
from typing import Self

import pandas as pd
from litestar import Controller, get, post


from config import get_logger
from dbcon.queries import (
    get_apps_sdk_overview,
)

logger = get_logger(__name__)


class ScryController(Controller):
    """API EndPoint return for all sdk related paths."""

    path = "/api/public/"

    @post(path="sdks/apps", cache=86400)
    async def lookup_apps(self: Self, data: dict) -> dict:
        """Lookup apps' SDKs by store_ids."""
        store_ids = data.get("store_ids", [])
        store_ids_log_str = ",".join(store_ids[0:2])
        df = get_apps_sdk_overview(store_ids)
        logger.info(f"looked up store_ids:{store_ids_log_str} found {df.shape[0]} apps")
        return df.to_dict(orient="records")
