import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ToolDefinition } from "./tool-generator.js";
import { OAuthHandler } from "./oauth-handler.js";

async function isUrl(input: string): Promise<boolean> {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}

async function fetchToolDefinitionsFromStdio(
  mcpPath: string
): Promise<ToolDefinition[]> {
  const transport = new StdioClientTransport({
    command: "node",
    args: [mcpPath],
    stderr: "pipe",
  });

  const client = new Client(
    {
      name: "mcp-tools-cli",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    await Promise.race([
      client.connect(transport),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Connection timeout after 10 seconds")),
          10000
        )
      ),
    ]);

    const toolsResult = await client.listTools();

    const tools: ToolDefinition[] = toolsResult.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));

    return tools;
  } finally {
    await client.close();
  }
}

async function fetchToolDefinitionsFromHttp(
  url: string,
  useSSE: boolean = false,
  headers: Record<string, string> = {},
  oauthOptions?: OAuthOptions
): Promise<ToolDefinition[]> {
  // First attempt: try without OAuth
  let attemptCount = 0;
  const maxAttempts = 2;

  while (attemptCount < maxAttempts) {
    attemptCount++;

    const requestInit =
      Object.keys(headers).length > 0 ? { headers } : undefined;

    const transport = useSSE
      ? new SSEClientTransport(
          new URL(url),
          requestInit ? { requestInit } : undefined
        )
      : new StreamableHTTPClientTransport(new URL(url), { requestInit });

    const client = new Client(
      {
        name: "mcp-tools-cli",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    try {
      await Promise.race([
        client.connect(transport),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Connection timeout after 10 seconds")),
            10000
          )
        ),
      ]);

      const toolsResult = await client.listTools();

      const tools: ToolDefinition[] = toolsResult.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return tools;
    } catch (error: any) {
      await client.close();

      // Check if this is a permission/auth error on first attempt
      if (attemptCount === 1 && !headers["Authorization"]) {
        // Check if error indicates authentication is required
        const errorStr = error.toString().toLowerCase();
        const isAuthError =
          errorStr.includes("401") ||
          errorStr.includes("unauthorized") ||
          errorStr.includes("permission") ||
          errorStr.includes("forbidden") ||
          errorStr.includes("authentication");

        if (isAuthError || (await OAuthHandler.requiresOAuth(url))) {
          console.log(
            "\n⚠️  Server requires authentication. Initiating OAuth flow..."
          );

          // Try to get OAuth configuration from the server
          let oauthConfig = await OAuthHandler.getOAuthConfig(url);

          // Override with provided options if available
          if (oauthOptions) {
            oauthConfig = {
              authUrl:
                oauthOptions.authUrl ||
                oauthConfig?.authUrl ||
                new URL("/oauth/authorize", url).toString(),
              tokenUrl: oauthOptions.tokenUrl || oauthConfig?.tokenUrl,
              clientId: oauthOptions.clientId || oauthConfig?.clientId,
              redirectPort: 3000,
              resource: oauthConfig?.resource || url,
            };
          }

          if (!oauthConfig || !oauthConfig.authUrl) {
            throw new Error(
              "OAuth required but no configuration could be auto-detected from the server's protected resource metadata."
            );
          }

          // Use auto-detected OAuth configuration
          const handler = new OAuthHandler(oauthConfig);

          try {
            const result = await handler.authenticate();
            headers["Authorization"] = `Bearer ${result.accessToken}`;
            console.log(
              "\n✅ OAuth authentication successful! Retrying connection..."
            );
            // Continue to next iteration with auth header
            continue;
          } catch (authError) {
            throw new Error(`OAuth authentication failed: ${authError}`);
          }
        }
      }

      // Re-throw the error if not auth-related or on second attempt
      throw error;
    } finally {
      await client.close();
    }
  }

  throw new Error("Failed to connect after maximum attempts");
}

export interface OAuthOptions {
  authUrl?: string;
  tokenUrl?: string;
  clientId?: string;
}

export async function fetchToolDefinitions(
  mcpUrlOrPath: string,
  useSSE: boolean = false,
  headers: Record<string, string> = {}
): Promise<ToolDefinition[]> {
  if (await isUrl(mcpUrlOrPath)) {
    return fetchToolDefinitionsFromHttp(
      mcpUrlOrPath,
      useSSE,
      headers
    );
  } else {
    return fetchToolDefinitionsFromStdio(mcpUrlOrPath);
  }
}
