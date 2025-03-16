"""Scry API controllers.

PUBLIC

"""

from typing import Self

import pandas as pd
from adscrawler import connection as write_conn
from adscrawler.app_stores import scrape_stores
from litestar import Controller, Response, post
from litestar.background_tasks import BackgroundTask

from config import get_logger
from dbcon.queries import (
    get_apps_sdk_overview,
)

logger = get_logger(__name__)


def add_store_ids(store_ids_dict: list[dict]) -> None:
    """After having queried an external app store send results to db."""
    logger.info("background:search results to try opening connection")
    db_conn = write_conn.get_db_connection(use_ssh_tunnel=True)
    db_conn.set_engine()
    logger.info("background:search results to be processed")
    scrape_stores.process_scraped(db_conn, store_ids_dict, "appgoblin_search")
    logger.info("background:search results done")


class ScryController(Controller):
    """API EndPoint return for all sdk related paths."""

    path = "/api/public/"

    @post(path="sdks/apps")
    async def lookup_apps(self: Self, data: dict) -> dict:
        """Lookup apps' SDKs by store_ids."""
        store_ids = data.get("store_ids", [])
        store_ids_log_str = ",".join(store_ids[0:2])

        df = get_apps_sdk_overview(tuple(store_ids))

        store_ids_df = df[["store_id"]].drop_duplicates()
        store_ids_dict = store_ids_df.to_dict(orient="records")
        success_store_ids = store_ids_df["store_id"].unique().tolist()
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
        return Response(
            my_dict,
            background=BackgroundTask(add_store_ids, store_ids_dict),
        )
