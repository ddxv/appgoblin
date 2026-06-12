"""MCP tool registrations — each module registers tools on ``mcp_server`` on import."""

# Import each tool module so the decorators execute and register on mcp_server.
# Order does not matter; FastMCP aggregates all tools at runtime.
from api_app.mcp.tools import apps, companies, keywords  # noqa: F401
