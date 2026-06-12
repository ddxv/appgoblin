"""MCP (Model Context Protocol) server package for the AppGoblin API."""

# Auto-register all tools when the MCP package is imported.
# Re-export the central server instance so callers can write
# ``from api_app.mcp import mcp_server``.
from api_app.mcp.server import mcp_server as mcp_server
from api_app.mcp.tools import apps, companies, keywords  # noqa: F401
