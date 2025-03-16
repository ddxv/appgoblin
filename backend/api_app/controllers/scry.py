"""Scry API controllers.

PUBLIC

"""

from typing import Self

import pandas as pd
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

        store_ids = ["com.nexonm.dominations.adk"]

        df = get_apps_sdk_overview(tuple(store_ids))

        success_store_ids = df["store_id"].unique().tolist()
        failed_store_ids = [
            store_id for store_id in store_ids if store_id not in success_store_ids
        ]
        cats = df.loc[df["category_slug"].notna(), "category_slug"].unique().tolist()
        company_cats = {}
        for cat in cats:
            company_cats[cat] = (
                df[df["category_slug"] == cat]
                .groupby(["company_name", "company_domain"])
                .apply(
                    lambda x: pd.Series(
                        {
                            "count": len(x),
                            "apps": x[["store", "store_id", "app_name"]].to_dict(
                                orient="records"
                            ),
                        }
                    )
                )
                .reset_index()
                .to_dict(orient="records")
            )

        by_store_id_dict = (
            df.groupby(["store_id"])[
                ["category_slug", "company_name", "company_domain"]
            ]
            .apply(lambda x: x.to_dict(orient="records"))
            .to_dict()
        )

        my_dict = {
            "sdks_by_store_id": by_store_id_dict,
            "company_categories": cats,
            "sdks_by_company_category": company_cats,
            "failed_store_ids": failed_store_ids,
            "success_store_ids": success_store_ids,
        }

        logger.info(f"looked up store_ids:{store_ids_log_str} found {df.shape[0]} apps")
        return my_dict
