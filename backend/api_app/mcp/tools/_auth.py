"""Shared authentication helpers for MCP tools.

Provides a single ``assert_paid_tier()`` function used by both
``companies.py`` and ``keywords.py`` to enforce paid-tier gating
without duplicating the logic.
"""

from __future__ import annotations

from fastmcp import Context


class MCPAuthError(RuntimeError):
    """Raised when a tool's tier requirement is not met.

    FastMCP catches this and returns a proper ``isError=true`` MCP
    response, which clients display as tool execution failures rather
    than successful results.
    """


def assert_paid_tier(ctx: Context, tool_name: str) -> None:
    """Raise ``MCPAuthError`` if the caller is on the free tier.

    Silently returns when the user has sufficient access.
    """
    user = ctx.request_context.request.scope.get("user")
    if not user:
        raise MCPAuthError("Access Denied: Unauthenticated agent request.")
    if user.tier == "free":
        raise MCPAuthError(
            f"Access Denied: The '{tool_name}' tool requires an active AppGoblin "
            "Paid Tier subscription. Please upgrade your account to continue."
        )
