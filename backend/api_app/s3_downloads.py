"""Helpers for generating short-lived S3 download URLs."""

import boto3

from config import CONFIG

SIGNED_DOWNLOADS_CONFIG_KEY = "s3-signed-downloads"
SIGNED_DOWNLOAD_URL_TTL_SECONDS = 60 * 60


def get_signed_download_url(key: str) -> str:
    """Generate a signed GET URL for an object in the configured downloads bucket."""
    s3_config = CONFIG[SIGNED_DOWNLOADS_CONFIG_KEY]
    client = boto3.session.Session().client(
        "s3",
        region_name=s3_config["region_name"],
        endpoint_url="https://" + s3_config["host"],
        aws_access_key_id=s3_config["access_key_id"],
        aws_secret_access_key=s3_config["secret_key"],
    )
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": s3_config["bucket"], "Key": key},
        ExpiresIn=SIGNED_DOWNLOAD_URL_TTL_SECONDS,
    )
