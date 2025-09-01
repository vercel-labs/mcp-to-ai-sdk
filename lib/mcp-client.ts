import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ToolDefinition } from "./tool-generator.js";

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
  headers: Record<string, string> = {}
): Promise<ToolDefinition[]> {
  const requestInit = Object.keys(headers).length > 0 ? { headers } : undefined;
  
  const transport = useSSE
    ? new SSEClientTransport(new URL(url), requestInit ? { requestInit } : undefined)
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
  } finally {
    await client.close();
  }
}

export async function fetchToolDefinitions(
  mcpUrlOrPath: string,
  useSSE: boolean = false,
  headers: Record<string, string> = {}
): Promise<ToolDefinition[]> {
  if (await isUrl(mcpUrlOrPath)) {
    return fetchToolDefinitionsFromHttp(mcpUrlOrPath, useSSE, headers);
  } else {
    return fetchToolDefinitionsFromStdio(mcpUrlOrPath);
  }
}