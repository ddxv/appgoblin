"""MCP tools wrapping the public ``/api/v1/keywords/`` endpoints.

Keyword tools are **paid-tier only**.
"""

from __future__ import annotations

from fastmcp import Context

from api_app.controllers.public.v1.keywords import (
    _build_keyword_metrics_payload,
    _build_keyword_ranks_payload,
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
async def get_keyword_metrics(  # noqa: D417
    keyword: str, ctx: Context
) -> str:
    """Return keyword difficulty, competition, and opportunity scores.

    Parameters
    ----------
    keyword : str
        The exact search term (e.g. 'app privacy', 'fitness tracker').

    .. warning::
       This tool is restricted to paid-tier subscribers.

    """
    denied = _assert_paid_tier(ctx, "get_keyword_metrics")
    if denied:
        return denied

    state = get_mcp_state()
    try:
        payload = _build_keyword_metrics_payload(state=state, keyword=keyword)
        return to_json(payload)
    except Exception as exc:  # noqa: BLE001
        return f"Error fetching keyword metrics for {keyword!r}: {exc}"


@mcp_server.tool()
async def get_keyword_ranks(  # noqa: D417
    keyword: str, ctx: Context, limit: int = 20
) -> str:
    """Return the top-ranked apps for an exact keyword lookup, grouped by platform.

    Parameters
    ----------
    keyword : str
        The exact search term (e.g. 'app privacy').
    limit : int
        Maximum number of ranked apps to return per platform (default 20).

    .. warning::
       This tool is restricted to paid-tier subscribers.

    """
    denied = _assert_paid_tier(ctx, "get_keyword_ranks")
    if denied:
        return denied

    state = get_mcp_state()
    try:
        payload = _build_keyword_ranks_payload(
            state=state, keyword=keyword, limit=limit
        )
        return to_json(payload)
    except Exception as exc:  # noqa: BLE001
        return f"Error fetching keyword ranks for {keyword!r}: {exc}"
