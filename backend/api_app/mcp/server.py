"""Central FastMCP instance for the AppGoblin MCP server.

All tools register themselves against this shared ``mcp_server`` instance.
Importing this module from ``controller.py`` and the tool modules never causes
circular imports because ``FastMCP`` does not depend on any Litestar or
controller-layer code.
"""

from fastmcp import FastMCP

mcp_server = FastMCP(
    "AppGoblin Intelligence Server",
)
