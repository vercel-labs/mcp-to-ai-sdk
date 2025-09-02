import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// Note: This MCP server requires OAuth authentication.
// The token has been included in the headers below.
// You may need to refresh the token periodically.

let connectionPromise: Promise<Client> | null = null;
export async function getMcpClient(): Promise<Client> {
  if (connectionPromise) {
    return connectionPromise;
  }

  return (connectionPromise = connectToMcp());
}

async function connectToMcp(): Promise<Client> {
  const transport = new StreamableHTTPClientTransport(
    new URL("https://mcp.notion.com"),
    {
      requestInit: {
        headers: {
          Authorization: "Bearer YOUR_OAUTH_TOKEN",
        },
      },
    },
  );
  const client = new Client(
    {
      name: "ai-sdk-mcp-wrapper",
      version: "1.0.0",
    },
    {
      capabilities: {},
    },
  );
  await client.connect(transport);
  return client;
}

// Optional: Add cleanup function for graceful shutdown
export async function closeMcpClient(): Promise<void> {
  if (connectionPromise) {
    const client = await connectionPromise;
    await client.close();
    connectionPromise = null;
  }
}
