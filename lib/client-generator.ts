function escapeStringForTypeScript(str: string): string {
  return JSON.stringify(str);
}

export function generateClientFile(
  mcpUrl: string,
  useSSE: boolean,
  headers: Record<string, string> = {},
  oauthToken?: string
): string {
  const transportType = useSSE
    ? "SSEClientTransport"
    : "StreamableHTTPClientTransport";
  const transportImport = useSSE ? "sse" : "streamableHttp";

  // Strip path from URL to get base URL for transport
  let baseUrl = mcpUrl;
  try {
    const parsed = new URL(mcpUrl);
    baseUrl = `${parsed.protocol}//${parsed.host}`;
  } catch {
    // If not a valid URL, use as-is (for file paths)
    baseUrl = mcpUrl;
  }

  // Create headers object with OAuth token if provided
  const allHeaders = { ...headers };
  if (oauthToken) {
    allHeaders["Authorization"] = `Bearer ${oauthToken}`;
  }
  
  const hasHeaders = Object.keys(allHeaders).length > 0;
  let requestInit = "";
  if (hasHeaders) {
    // Replace header values with TODO placeholders to avoid embedding secrets
    const todoHeaders = Object.keys(allHeaders).reduce((acc, key) => {
      if (key === "Authorization" && oauthToken) {
        // For OAuth tokens, provide a placeholder that indicates token is needed
        acc[key] = "Bearer YOUR_OAUTH_TOKEN";
      } else {
        acc[key] = "TODO: Replace with your actual value";
      }
      return acc;
    }, {} as Record<string, string>);

    requestInit = `, { requestInit: { headers: ${JSON.stringify(
      todoHeaders,
      null,
      2
    )} } }`;
  }

  const oauthComment = oauthToken ? `
// Note: This MCP server requires OAuth authentication.
// The token has been included in the headers below.
// You may need to refresh the token periodically.
` : "";
  
  return `import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { ${transportType} } from '@modelcontextprotocol/sdk/client/${transportImport}.js';
${oauthComment}
let connectionPromise: Promise<Client> | null = null;
export async function getMcpClient(): Promise<Client> {

  if (connectionPromise) {
    return connectionPromise;
  }

  return connectionPromise = connectToMcp();
}

async function connectToMcp(): Promise<Client> {
  const transport = new ${transportType}(new URL(${escapeStringForTypeScript(
    baseUrl
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
