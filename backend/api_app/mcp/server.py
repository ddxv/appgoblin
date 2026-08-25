"""Central MCPServer instance for the AppGoblin MCP server.

All tools register themselves against this shared ``mcp_server`` instance.
Importing this module from ``controller.py`` and the tool modules never causes
circular imports because ``MCPServer`` does not depend on any Litestar or
controller-layer code.
"""

from mcp.server.mcpserver import MCPServer

mcp_server = MCPServer(
    "AppGoblin Intelligence Server",
)
