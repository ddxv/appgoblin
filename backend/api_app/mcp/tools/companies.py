"""MCP tools wrapping the public ``/api/v1/companies/`` endpoints.

Company tools are **paid-tier only** — unauthenticated or free-tier callers
receive a descriptive access-denied message rather than data.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from fastmcp import Context

from api_app.controllers.companies import get_overviews
from api_app.controllers.public.v1.companies import (
    _build_public_company_app_change_payload,
    _build_public_company_overview_payload,
    _to_public_company_list_item,
)
from api_app.mcp.serialize import to_json
from api_app.mcp.server import mcp_server
from api_app.mcp.state import get_mcp_state
from config import get_logger

logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _assert_paid_tier(ctx: Context, tool_name: str) -> str | None:
    """Return ``None`` if the user has a paid tier, else an error string."""
    user = ctx.request_context.request.scope.get("user")
    if not user:
        return "Access Denied: Unauthenticated agent request."
    if user.tier == "free":
        return (
            f"Access Denied: The '{tool_name}' tool requires an active AppGoblin "
            "Paid Tier subscription. Please upgrade your account to continue."
        )
    return None


# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------


@mcp_server.tool()
async def list_companies(ctx: Context) -> str:
    """Return all queryable company domains with latest overview trend snapshots.

    .. warning::
       This tool is restricted to paid-tier subscribers.
    """
    denied = _assert_paid_tier(ctx, "list_companies")
    if denied:
        return denied

    state = get_mcp_state()
    overview = get_overviews(state=state)
    items = [_to_public_company_list_item(c) for c in overview.companies_overview]
    # Serialise as a JSON array of dicts
    return to_json(items)


@mcp_server.tool()
async def get_company_overview(  # noqa: D417
    company_domain: str, ctx: Context
) -> str:
    """Fetch comprehensive market metrics, trends, and data for a company domain.

    Parameters
    ----------
    company_domain : str
        The domain of the target company (e.g. 'unity.com').

    """
    denied = _assert_paid_tier(ctx, "get_company_overview")
    if denied:
        return denied

    state = get_mcp_state()
    try:
        payload = _build_public_company_overview_payload(
            state=state, company_domain=company_domain
        )
        return to_json(payload)
    except Exception as exc:  # noqa: BLE001
        return f"Error fetching overview for {company_domain!r}: {exc}"


@mcp_server.tool()
async def get_company_app_changes(  # noqa: D417, PLR0913
    company_domain: str,
    tag_source: str,
    year: int,
    quarter: int,
    status: str,
    ctx: Context,
) -> str:
    """Return store IDs for apps a company added or lost in a given quarter.

    Parameters
    ----------
    company_domain : str
        The domain of the target company (e.g. 'unity.com').
    tag_source : str
        Signal source — one of ``sdk``, ``api_call``, ``app_ads_direct``.
    year : int
        Calendar year (e.g. 2026).
    quarter : int
        Quarter number (1, 2, 3, or 4).
    status : str
        Change direction — ``added`` or ``lost``.

    """
    denied = _assert_paid_tier(ctx, "get_company_app_changes")
    if denied:
        return denied

    state = get_mcp_state()
    try:
        payload = _build_public_company_app_change_payload(
            state=state,
            company_domain=company_domain,
            tag_source=tag_source,
            year=year,
            quarter=quarter,
            status=status,
        )
        return to_json(payload)
    except Exception as exc:  # noqa: BLE001
        return (
            f"Error fetching app changes for {company_domain!r} "
            f"({tag_source=}, {year}Q{quarter}, {status=}): {exc}"
        )
