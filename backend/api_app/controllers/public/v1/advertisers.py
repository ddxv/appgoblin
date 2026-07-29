"""Versioned public advertiser endpoints — requires a paid API key."""

import os
import time
from typing import Self, cast

from litestar import Controller, Request, Response, get
from litestar.connection import ASGIConnection
from litestar.datastructures import State
from litestar.exceptions import NotFoundException, PermissionDeniedException
from litestar.handlers import BaseRouteHandler

from api_app.analytics import PUBLIC_API_HOSTNAME, build_request_page_view_task
from api_app.controllers.public.v1.public_models import (
    PublicAdvertiserCreative,
    PublicAdvertiserCreatives,
)
from api_app.guards import validate_api_key
from config import get_logger
from dbcon.queries import get_advertiser_creatives_by_host

logger = get_logger(__name__)

DEFAULT_CREATIVE_MEDIA_BASE = "https://media.appgoblin.info/"


def _is_missing_value(value: object) -> bool:
    """Return whether a value is missing after dataframe serialization."""
    if value is None:
        return True

    try:
        return bool(value != value)
    except TypeError:
        return False


def _optional_string(value: object) -> str | None:
    """Normalize optional strings from serialized pandas rows."""
    if _is_missing_value(value):
        return None

    normalized = str(value).strip()
    if not normalized or normalized.lower() == "nan":
        return None
    return normalized


def _build_creative_url(md5_hash: str | None, file_extension: str | None) -> str | None:
    """Build the public media URL for a creative asset.

    Mirrors the frontend URL scheme used in the public reports:
    ``https://media.appgoblin.info/creatives/raw/<md5[:3]>/<md5>.<ext>``
    """
    if not md5_hash or not file_extension:
        return None
    base = os.getenv("APPGOBLIN_DOWNLOADS_BASE", "").strip()
    if not base:
        base = DEFAULT_CREATIVE_MEDIA_BASE
    elif not base.endswith("/"):
        base = f"{base}/"
    return f"{base}creatives/raw/{md5_hash[:3]}/{md5_hash}.{file_extension}"


def _api_key_guard(request: ASGIConnection, route_handler: BaseRouteHandler) -> None:
    """Guard that requires a paid subscription tier for advertiser creatives."""
    state = request.app.state
    context = validate_api_key(cast("Request", request), state)
    if context.tier == "free":
        raise PermissionDeniedException(
            detail="Advertiser creatives API v1 requires a paid subscription tier"
        )


def _to_public_advertiser_creative(row: dict) -> PublicAdvertiserCreative:
    """Project a serialized advertiser creative row into the public contract."""
    created_at = row.get("created_at")
    if created_at is not None and not _is_missing_value(created_at):
        created_at_str = str(created_at)
    else:
        created_at_str = None

    return PublicAdvertiserCreative(
        created_at=created_at_str,
        ad_domain=_optional_string(row.get("ad_domain")),
        host_domain_company_name=_optional_string(row.get("host_domain_company_name")),
        pub_store_id=_optional_string(row.get("pub_store_id")),
        pub_name=_optional_string(row.get("pub_name")),
        vhash=_optional_string(row.get("vhash")),
        md5_hash=_optional_string(row.get("md5_hash")),
        file_extension=_optional_string(row.get("file_extension")),
        mmp_domain=_optional_string(row.get("mmp_domain")),
        creative_url=_build_creative_url(
            _optional_string(row.get("md5_hash")),
            _optional_string(row.get("file_extension")),
        ),
    )


def _build_advertiser_creatives_payload(
    state: State, host_domain: str
) -> PublicAdvertiserCreatives:
    """Build the public advertiser creatives payload for a host domain."""
    df = get_advertiser_creatives_by_host(state=state, host_domain=host_domain)
    if df.empty:
        msg = f"No advertiser creatives found for host domain: {host_domain!r}"
        raise NotFoundException(msg, status_code=404)

    creatives = [
        _to_public_advertiser_creative(row) for row in df.to_dict(orient="records")
    ]
    return PublicAdvertiserCreatives(host_domain=host_domain, creatives=creatives)


class V1AdvertisersController(Controller):
    """Public API v1 — advertiser creatives endpoints (paid API key required)."""

    path = "/api/v1/"
    guards = [_api_key_guard]

    @get(path="/advertisers/{host_domain:str}/creatives", cache=3600)
    async def advertiser_creatives(
        self: Self,
        state: State,
        request: Request,
        host_domain: str,
    ) -> PublicAdvertiserCreatives:
        """Return advertiser creatives recorded for a host domain."""
        start = time.perf_counter() * 1000
        payload = _build_advertiser_creatives_payload(
            state=state, host_domain=host_domain
        )
        duration = round((time.perf_counter() * 1000 - start), 2)
        logger.info(
            f"GET /api/v1/advertisers/{host_domain}/creatives took {duration}ms"
        )
        return Response(
            payload,
            background=build_request_page_view_task(
                request,
                url=f"/api/v1/advertisers/{host_domain}/creatives",
                hostname=PUBLIC_API_HOSTNAME,
            ),
        )
