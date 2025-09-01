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
  let requestInit = '';
  if (hasHeaders) {
    if (useSSE) {
      requestInit = `, { requestInit: { headers: ${JSON.stringify(headers)} } }`;
    } else {
      requestInit = `, { requestInit: { headers: ${JSON.stringify(headers)} } }`;
    }
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