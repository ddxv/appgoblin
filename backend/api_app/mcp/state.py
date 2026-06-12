"""Lightweight Litestar ``State`` surrogate for MCP tool functions.

All existing ``dbcon/queries.py`` helpers accept ``litestar.datastructures.State``
and access ``state.dbcon.engine``.  Instead of rewriting every query call, this
module provides a ``State``-compatible proxy that wraps the same module-level
engine reference injected by ``set_mcp_engine()``.

Usage::

    from api_app.mcp.state import get_mcp_state
    from dbcon.queries import get_single_app

    df = get_single_app(get_mcp_state(), store_id="...")
"""

from __future__ import annotations

from sqlalchemy import Engine

from api_app.mcp.engine import get_engine


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
