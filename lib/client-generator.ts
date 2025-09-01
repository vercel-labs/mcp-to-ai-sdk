function escapeStringForTypeScript(str: string): string {
  return JSON.stringify(str);
}

export function generateClientFile(
  mcpUrl: string,
  useSSE: boolean,
  headers: Record<string, string> = {}
): string {
  const transportType = useSSE
    ? "SSEClientTransport"
    : "StreamableHTTPClientTransport";
  const transportImport = useSSE ? "sse" : "streamableHttp";

  const hasHeaders = Object.keys(headers).length > 0;
  let requestInit = "";
  if (hasHeaders) {
    // Replace header values with TODO placeholders to avoid embedding secrets
    const todoHeaders = Object.keys(headers).reduce((acc, key) => {
      acc[key] = "TODO: Replace with your actual value";
      return acc;
    }, {} as Record<string, string>);

    requestInit = `, { requestInit: { headers: ${JSON.stringify(
      todoHeaders,
      null,
      2
    )} } }`;
  }

  return `import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { ${transportType} } from '@modelcontextprotocol/sdk/client/${transportImport}.js';

let connectionPromise: Promise<Client> | null = null;
export async function getMcpClient(): Promise<Client> {

  if (connectionPromise) {
    return connectionPromise;
  }

  return connectionPromise = connectToMcp();
}

async function connectToMcp(): Promise<Client> {
  const transport = new ${transportType}(new URL(${escapeStringForTypeScript(
    mcpUrl
  )})${requestInit});
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
`;
}
