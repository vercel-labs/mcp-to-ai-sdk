import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

let connectionPromise: Promise<Client> | null = null;

export async function getMcpClient(): Promise<Client> {

  if (connectionPromise) {
    return connectionPromise;
  }

  return connectionPromise = connectToMcp();
}

async function connectToMcp(): Promise<Client> {
  const transport = new StreamableHTTPClientTransport(new URL("https://huggingface.co/mcp"));
  const client = new Client(
    {
      name: "ai-sdk-mcp-wrapper",
      version: "1.0.0"
    },
    {
      capabilities: {}
    }
  );
  await client.connect(transport)
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
