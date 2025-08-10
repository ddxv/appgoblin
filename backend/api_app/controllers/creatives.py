"""API for creatives data.

/creatives/app/{store_id} creatives for a specific app
"""

from typing import Self

from litestar import Controller, get

from config import get_logger
from dbcon.queries import (
    get_advertiser_creative_rankings,
    get_advertiser_creative_rankings_top,
    get_advertiser_creatives,
)

logger = get_logger(__name__)


class CreativesController(Controller):
    """Controller holding all API endpoints for creatives."""

    path = "/api/creatives"

    @get(path="/top", cache=86400)
    async def top_advertiser_creative_rankings(self: Self) -> dict:
        """Handle GET request for a list of top advertiser creative rankings.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_advertiser_creative_rankings_top()
        df["last_seen"] = df["last_seen"].dt.strftime("%Y-%m-%d")
        return df.to_dict(orient="records")

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
        df["run_at"] = df["run_at"].dt.strftime("%Y-%m-%d")
        pdf = (
            df.groupby(
                [
                    "run_at",
                    "pub_name",
                    "pub_store_id",
                    "host_domain",
                    "host_domain_company_domain",
                    "host_domain_company_name",
                    "ad_domain",
                    "ad_domain_company_domain",
                    "ad_domain_company_name",
                    "vhash",
                    "file_extension",
                    "pub_icon_url_512",
                ]
            )[["md5_hash"]]
            .first()
            .reset_index()
        )
        cdf = (
            df.groupby(
                [
                    "vhash",
                    "file_extension",
                ]
            )[["md5_hash"]]
            .first()
            .reset_index()
        )
        return {
            "by_publisher": pdf.to_dict(orient="records"),
            "by_creative": cdf.to_dict(orient="records"),
        }

    @get(path="/apps/{store_id: str}/{vhash: str}", cache=86400)
    async def get_advertiser_creative_records(
        self: Self, store_id: str, vhash: str
    ) -> dict:
        """Handle GET request for a list of creatives for an app.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_advertiser_creatives(store_id)
        df["run_at"] = df["run_at"].dt.strftime("%Y-%m-%d")
        df = df[df["vhash"] == vhash]
        pdf = (
            df.groupby(
                [
                    "run_at",
                    "pub_name",
                    "pub_store_id",
                    "host_domain",
                    "host_domain_company_domain",
                    "host_domain_company_name",
                    "ad_domain",
                    "ad_domain_company_domain",
                    "ad_domain_company_name",
                    "vhash",
                    "file_extension",
                    "pub_icon_url_512",
                ]
            )[["md5_hash"]]
            .first()
            .reset_index()
        )

        return {
            "by_publisher": pdf.to_dict(orient="records"),
        }
