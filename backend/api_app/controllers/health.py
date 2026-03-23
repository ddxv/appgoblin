"""Health check API controllers."""

from datetime import UTC, date, datetime, time, timedelta
from typing import Self

from litestar import Controller, Response, get
from litestar.datastructures import State
from litestar.params import Parameter
from sqlalchemy import text

from config import get_logger

logger = get_logger(__name__)

NO_CACHE_HEADERS = {
    "Cache-Control": "no-store,no-cache,must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
}


def _utc_now_iso() -> str:
    """Return the current UTC timestamp in ISO-8601 format with Z suffix."""
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def _normalize_to_utc(value: object) -> datetime | None:
    """Normalize DB timestamp/date values to timezone-aware UTC datetime."""
    if value is None:
        return None

    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=UTC)
        return value.astimezone(UTC)

    if isinstance(value, date):
        return datetime.combine(value, time.min, tzinfo=UTC)

    if isinstance(value, str):
        parsed = value.strip()
        if parsed.endswith("Z"):
            parsed = parsed[:-1] + "+00:00"
        try:
            parsed_dt = datetime.fromisoformat(parsed)
        except ValueError:
            logger.warning(
                "Failed to parse datetime string for health check: %s", value
            )
            return None

        if parsed_dt.tzinfo is None:
            return parsed_dt.replace(tzinfo=UTC)
        return parsed_dt.astimezone(UTC)

    logger.warning(
        "Unsupported datetime type for health check: %s", type(value).__name__
    )
    return None


def _is_truthy(value: str | None) -> bool:
    """Interpret common truthy query-string values."""
    if value is None:
        return False
    return value.strip().lower() in {"1", "true", "yes"}


class HealthController(Controller):
    """Health endpoints for backend service and DB freshness checks."""

    path = "/api/public/"

    @get(path="check")
    async def check(self: Self) -> Response:
        """Check basic backend liveness endpoint."""
        payload = {
            "status": "ok",
            "service": "backend",
            "timestamp_utc": _utc_now_iso(),
            "checks": {
                "app_lifecycle": {
                    "ok": True,
                }
            },
        }
        return Response(payload, status_code=200, headers=NO_CACHE_HEADERS)

    @get(path="checkdb")
    async def checkdb(
        self: Self,
        state: State,
        include_apps_freshness: str | None = Parameter(
            query="include_apps_freshness", required=False
        ),
    ) -> Response:
        """DB connectivity and data freshness endpoint."""
        now_utc = datetime.now(UTC)
        checks: dict[str, dict[str, object]] = {}
        failed_checks: list[str] = []
        require_apps_freshness = _is_truthy(include_apps_freshness)

        try:
            with state.dbcon.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
                checks["db_connection"] = {"ok": True}

                ranks_row = (
                    conn.execute(
                        text(
                            "SELECT max(crawled_date) AS last_ranks_crawled_at "
                            "FROM frontend.store_app_ranks_weekly"
                        )
                    )
                    .mappings()
                    .one()
                )
                last_ranks_raw = ranks_row.get("last_ranks_crawled_at")
                last_ranks_utc = _normalize_to_utc(last_ranks_raw)
                ranks_ok = (
                    last_ranks_utc is not None
                    and now_utc - last_ranks_utc <= timedelta(days=1)
                )
                checks["ranks_freshness"] = {
                    "ok": ranks_ok,
                    "last_ranks_crawled_at": (
                        last_ranks_utc.isoformat().replace("+00:00", "Z")
                        if last_ranks_utc
                        else None
                    ),
                    "threshold": "1 day",
                }
                if not ranks_ok:
                    failed_checks.append("ranks_freshness")

                if require_apps_freshness:
                    apps_row = (
                        conn.execute(
                            text(
                                "SELECT max(updated_at) AS last_apps_updated_at "
                                "FROM frontend.store_apps_overview"
                            )
                        )
                        .mappings()
                        .one()
                    )
                    last_apps_raw = apps_row.get("last_apps_updated_at")
                    last_apps_utc = _normalize_to_utc(last_apps_raw)
                    apps_ok = (
                        last_apps_utc is not None
                        and now_utc - last_apps_utc <= timedelta(hours=3)
                    )
                    checks["apps_freshness"] = {
                        "ok": apps_ok,
                        "last_apps_updated_at": (
                            last_apps_utc.isoformat().replace("+00:00", "Z")
                            if last_apps_utc
                            else None
                        ),
                        "threshold": "3 hours",
                    }
                    if not apps_ok:
                        failed_checks.append("apps_freshness")
        except Exception:
            logger.exception("Health check DB probe failed")
            checks["db_connection"] = {"ok": False}
            failed_checks.append("db_connection")

        status = "ok" if not failed_checks else "degraded"
        status_code = 200 if not failed_checks else 503
        payload = {
            "status": status,
            "service": "backend",
            "timestamp_utc": _utc_now_iso(),
            "checks": checks,
            "failed_checks": failed_checks,
        }
        return Response(payload, status_code=status_code, headers=NO_CACHE_HEADERS)
