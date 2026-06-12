"""Module-level database engine reference for the MCP server.

Exists as a separate module to avoid circular imports:
- ``controller.py`` imports from ``engine.py``
- ``state.py`` imports from ``engine.py``
- ``controller.py`` also triggers tool registrations (via ``import api_app.mcp``)
  which in turn load ``state.py`` — if ``state.py`` tried to import from
  ``controller.py`` directly, it would fail because the module is still being
  evaluated.
"""

from __future__ import annotations

from sqlalchemy import Engine

from config import get_logger

logger = get_logger(__name__)

_engine: Engine | None = None


def set_mcp_engine(engine: Engine) -> None:
    """Inject the write-capable engine into the MCP module.

    Called during the Litestar ``db_lifespan`` startup so that the ASGI
    authentication layer and tool functions can access the database without
    coupling to ``app.state``.
    """
    global _engine  # noqa: PLW0603
    _engine = engine
    logger.info("MCP server received database engine reference")


def get_engine() -> Engine:
    """Return the injected engine or raise."""
    if _engine is None:
        msg = "MCP database engine not initialised — call set_mcp_engine() during lifespan"
        raise RuntimeError(msg)
    return _engine
