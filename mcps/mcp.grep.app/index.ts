// Auto-generated index file for MCP tools
// Source: https://mcp.grep.app
import { getMcpClient } from "./client.js";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { searchGitHubToolWithClient } from "./searchGitHub.js";

// Exports using a default client
export const mcpGrepTools = {
  searchGitHub: searchGitHubToolWithClient(getMcpClient),
} as const;

export const mcpGrepToolsWithClient = (client: Promise<Client> | Client) =>
  ({
    searchGitHub: searchGitHubToolWithClient(() => client),
  }) as const;

// Individual tool exports
export const searchGitHubTool = searchGitHubToolWithClient(getMcpClient);
