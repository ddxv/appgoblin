"""Lightweight Litestar ``State`` surrogate + auth helpers for MCP tools.

All existing ``dbcon/queries.py`` helpers accept ``litestar.datastructures.State``
and access ``state.dbcon.engine``.  Instead of rewriting every query call, this
module provides a ``State``-compatible proxy that wraps the same module-level
engine reference injected by ``set_mcp_engine()``.

Usage::

    from api_app.mcp.state import get_mcp_state, assert_paid_tier
    from dbcon.queries import get_single_app

    df = get_single_app(get_mcp_state(), store_id="...")
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from api_app.mcp.engine import get_engine

if TYPE_CHECKING:
    from fastmcp import Context
    from sqlalchemy import Engine


class _MCPState:
    """Minimal ``litestar.datastructures.State`` look-alike.

    Only exposes the attributes that the shared query layer uses::

        state.dbcon.engine  # read connection
        state.dbconwrite.engine  # write connection (same engine in MCP context)
    """

    def __init__(self, engine: Engine) -> None:
        self.dbcon = _DBAlias(engine)
        self.dbconwrite = _DBAlias(engine)


class _DBAlias:
    """Holds a single ``engine`` attribute."""

    def __init__(self, engine: Engine) -> None:
        self.engine = engine


# ---------------------------------------------------------------------------
# Module-level cached proxy (lazily initialised)
# ---------------------------------------------------------------------------

_mcp_state: _MCPState | None = None


def get_mcp_state() -> _MCPState:
    """Return a cached ``State``-like proxy backed by the MCP engine.

    Raises ``RuntimeError`` if ``set_mcp_engine()`` has not been called yet
    (i.e. the Litestar lifespan has not started).
    """
    global _mcp_state  # noqa: PLW0603
    if _mcp_state is None:
        _mcp_state = _MCPState(get_engine())
    return _mcp_state


# ---------------------------------------------------------------------------
# Tier-gated auth helper
# ---------------------------------------------------------------------------


class MCPAuthError(RuntimeError):
    """Raised when a tool's tier requirement is not met.

    FastMCP catches raised exceptions and returns a proper ``isError=true``
    MCP response, which clients display as tool execution failures rather
    than successful results.
    """


_UNAUTHENTICATED_MSG = "Access Denied: Unauthenticated agent request."


def _paid_tier_required_msg(tool_name: str) -> str:
    """Build the paid-tier-required error message."""
    return (
        f"Access Denied: The '{tool_name}' tool requires an active AppGoblin "
        "Paid Tier subscription. Please upgrade your account to continue."
    )


def assert_paid_tier(ctx: Context, tool_name: str) -> None:
    """Raise ``MCPAuthError`` if the caller is on the free tier.

    The authenticated user is read from ``scope["user"]`` (injected by
    ``AuthenticatedMCPMiddleware`` in ``controller.py``).
    """
    user = ctx.request_context.request.scope.get("user")
    if not user:
        raise MCPAuthError(_UNAUTHENTICATED_MSG)
    if user.tier == "free":
        raise MCPAuthError(_paid_tier_required_msg(tool_name))
