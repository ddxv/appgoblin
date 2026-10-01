"""Public API for data exports.

/api/public/exports/datasets - list of available export files
"""

from typing import Self

import boto3
from litestar import Controller, get
from litestar.config.response_cache import CACHE_FOREVER
from litestar.datastructures import State

from config import CONFIG, get_logger
from dbcon.static import get_s3_datasets

logger = get_logger(__name__)

SIGNED_DOWNLOADS_CONFIG_KEY = "s3-signed-downloads"
SIGNED_DOWNLOAD_URL_TTL_SECONDS = 60 * 60


def _get_signed_download_client():
    s3_config = CONFIG[SIGNED_DOWNLOADS_CONFIG_KEY]
    return boto3.session.Session().client(
        "s3",
        region_name=s3_config["region_name"],
        endpoint_url="https://" + s3_config["host"],
        aws_access_key_id=s3_config["access_key_id"],
        aws_secret_access_key=s3_config["secret_key"],
    )


def _build_signed_download_key(dataset: str, domain: str, platform: str | None) -> str:
    if dataset == "app-ads-txt":
        return (
            "downloads/app-ads-txt/domains/"
            f"domain={domain}/appgoblin_{domain}_app_ads_txt.csv"
        )
    if dataset == "company-verified-apps" and platform in {"ios", "android"}:
        return (
            "downloads/company-verified-apps/domains/"
            f"domain={domain}/source=all/"
            f"appgoblin_{domain}_{platform}_verified_apps.csv"
        )
    raise ValueError("Unsupported download dataset or platform")


class ExportsController(Controller):
    """Public endpoint for free data export listings."""

    path = "/api/public/"

    @get(path="exports/datasets", cache=CACHE_FOREVER)
    async def get_datasets(self: Self, state: State) -> list[dict]:
        """Return list of available public export datasets from S3."""
        return get_s3_datasets(state)

    @get(path="exports/signed-url")
    async def get_signed_url(
        self: Self,
        dataset: str,
        domain: str,
        platform: str | None = None,
    ) -> dict[str, str]:
        """Return a short-lived signed URL for a company data export."""
        if not domain:
            raise ValueError("A domain is required")
        try:
            s3_key = _build_signed_download_key(dataset, domain, platform)
        except ValueError as exc:
            from litestar.exceptions import ClientException

            raise ClientException(detail=str(exc), status_code=400) from exc

        s3_config = CONFIG[SIGNED_DOWNLOADS_CONFIG_KEY]
        url = _get_signed_download_client().generate_presigned_url(
            "get_object",
            Params={"Bucket": s3_config["bucket"], "Key": s3_key},
            ExpiresIn=SIGNED_DOWNLOAD_URL_TTL_SECONDS,
        )
        return {"url": url}
