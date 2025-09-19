"""API for creatives data.

/creatives/app/{store_id} creatives for a specific app
"""

import time
from typing import Self

import numpy as np
import pandas as pd
from litestar import Controller, get

from config import get_logger
from dbcon.queries import (
    get_advertiser_creative_rankings,
    get_advertiser_creative_rankings_top,
    get_advertiser_creatives,
    get_company_creatives,
    get_company_logos_df,
)

logger = get_logger(__name__)


def expand_icon_url_100_to_full(df: pd.DataFrame) -> pd.DataFrame:
    """Expand the icon_url_100 column to a full URL."""
    df["icon_url_100"] = np.where(
        df["advertiser_icon_url_100"].notna(),
        "https://media.appgoblin.info/app-icons/"
        + df["store_id"]
        + "/"
        + df["advertiser_icon_url_100"],
        None,
    )
    return df


def append_company_logos_to_df(df: pd.DataFrame) -> pd.DataFrame:
    """Append a dictionary of company names, domains and logos to a dataframe."""
    company_logos_df = get_company_logos_df()

    def get_logo_url(domain: str) -> str:
        try:
            return company_logos_df[company_logos_df["company_domain"] == domain][
                "company_logo_url"
            ].iloc[0]
        except:  # noqa: E722
            return "default_company_logo.png"

    df["ad_networks"] = df["ad_network_domains"].apply(
        lambda x: [
            {"domain": d, "company_logo_url": get_logo_url(d)}
            for d in x
            if d is not None
        ]
    )
    return df


class CreativesController(Controller):
    """Controller holding all API endpoints for creatives."""

    path = "/api/creatives"

    @get(path="/", cache=86400)
    async def advertiser_creative_rankings(self: Self) -> dict:
        """Handle GET request for a list of apps.

        Returns
        -------
            A dictionary representation of the total counts

        """
        start = time.perf_counter() * 1000
        df = get_advertiser_creative_rankings()

        df = df.rename(
            columns={
                "advertiser_icon_url_512": "icon_url_512",
                "advertiser_name": "name",
                "advertiser_store_id": "store_id",
            }
        )

        df = expand_icon_url_100_to_full(df)
        df = append_company_logos_to_df(df)
        df["last_seen"] = df["last_seen"].dt.strftime("%Y-%m-%d")
        df = df.head(100)
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path} took {duration}ms")
        return df.to_dict(orient="records")

    @get(path="/top", cache=86400)
    async def top_advertiser_creative_rankings(self: Self) -> dict:
        """Handle GET request for a list of top advertiser creative rankings.

        Returns
        -------
            A dictionary representation of the total counts

        """
        start = time.perf_counter() * 1000
        df = get_advertiser_creative_rankings_top()
        df = df.rename(
            columns={
                "advertiser_icon_url_512": "icon_url_512",
                "advertiser_name": "name",
                "advertiser_store_id": "store_id",
            }
        )

        df = append_company_logos_to_df(df)
        df = expand_icon_url_100_to_full(df)
        df["last_seen"] = df["last_seen"].dt.strftime("%Y-%m-%d")
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/top took {duration}ms")
        return df.to_dict(orient="records")

    @get(path="/companies/{company_domain: str}", cache=86400)
    async def company_creatives(self: Self, company_domain: str) -> dict:
        """Handle GET request for a list of top advertiser creative rankings.

        Returns
        -------
            A dictionary representation of the total counts

        """
        start = time.perf_counter() * 1000
        df = get_company_creatives(company_domain)
        df = df.rename(columns={"advertiser_store_id": "store_id"})
        df = expand_icon_url_100_to_full(df)
        df["featured_image_url"] = (
            "https://media.appgoblin.info/creatives/thumbs/" + df["md5_hash"] + ".jpg"
        )
        if not df.empty:
            df["last_seen"] = df["last_seen"].dt.strftime("%Y-%m-%d")
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(f"{self.path}/companies/{company_domain} took {duration}ms")
        return df.to_dict(orient="records")

    @get(path="/apps/{store_id: str}/monetized", cache=86400)
    async def monetized_creatives(self: Self, store_id: str) -> dict:
        """Handle GET request for a list of creatives used for monetization by an app.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_advertiser_creatives(pub_store_id=store_id)
        if not df.empty:
            df["run_at"] = df["run_at"].dt.strftime("%Y-%m-%d")
        pdf = (
            df.groupby(
                [
                    "run_at",
                    "adv_name",
                    "adv_store_id",
                    "host_domain",
                    "host_domain_company_domain",
                    "host_domain_company_name",
                    "ad_domain",
                    "ad_domain_company_domain",
                    "ad_domain_company_name",
                    "vhash",
                    "file_extension",
                    "adv_icon_url_512",
                    "mmp_name",
                    "mmp_domain",
                ],
                dropna=False,
            )[["md5_hash", "additional_ad_domain_urls", "mmp_urls"]]
            .agg(
                {
                    "md5_hash": "first",
                    "additional_ad_domain_urls": lambda x: list(
                        set([item for sublist in x for item in sublist])
                    ),
                    "mmp_urls": lambda x: list(
                        set([item for sublist in x for item in sublist])
                    ),
                }
            )
            .sort_values(by="run_at", ascending=False)
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

    @get(path="/apps/{store_id: str}/ads", cache=86400)
    async def advertiser_creatives(self: Self, store_id: str) -> dict:
        """Handle GET request for a list of creatives for an app.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_advertiser_creatives(advertiser_store_id=store_id)
        if not df.empty:
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
                    "mmp_name",
                    "mmp_domain",
                ],
                dropna=False,
            )[["md5_hash", "additional_ad_domain_urls", "mmp_urls"]]
            .agg(
                {
                    "md5_hash": "first",
                    "additional_ad_domain_urls": lambda x: list(
                        set([item for sublist in x for item in sublist])
                    ),
                    "mmp_urls": lambda x: list(
                        set([item for sublist in x for item in sublist])
                    ),
                }
            )
            .reset_index()
            .sort_values(by="run_at", ascending=False)
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

    @get(path="/apps/{store_id: str}/ads/{vhash: str}", cache=86400)
    async def get_advertiser_creative_records(
        self: Self, store_id: str, vhash: str
    ) -> dict:
        """Handle GET request for a list of creatives for an app.

        Returns
        -------
            A dictionary representation of the total counts

        """
        df = get_advertiser_creatives(advertiser_store_id=store_id)
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
