#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { jsonSchemaToZod } from "json-schema-to-zod";

interface ToolDefinition {
  name: string;
  description?: string;
  inputSchema: any;
}

function urlToPath(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove protocol and convert to filesystem-safe path
    let path = parsed.hostname + parsed.pathname;
    // Replace invalid filesystem characters
    path = path.replace(/[^\w\-_.\/]/g, "_");
    // Remove trailing slashes and ensure no double slashes
    path = path.replace(/\/+/g, "/").replace(/\/$/, "");
    return path || parsed.hostname;
  } catch {
    // If not a URL, sanitize as file path
    return url.replace(/[^\w\-_.\/]/g, "_");
  }
}

function validateToolName(name: string): string {
  // Ensure the tool name is a valid TypeScript identifier
  const validName = name.replace(/[^a-zA-Z0-9_]/g, "");
  if (!validName || /^[0-9]/.test(validName)) {
    throw new Error(
      `Invalid tool name: ${name}. Must be a valid TypeScript identifier.`
    );
  }
  return validName;
}

function escapeStringForTypeScript(str: string): string {
  return JSON.stringify(str);
}

function generateAISDKTool(
  tool: ToolDefinition,
  mcpUrl: string,
  useSSE: boolean
): string {
  // Validate and sanitize tool name
  const toolName = validateToolName(tool.name);

  // Validate URL
  try {
    new URL(mcpUrl);
  } catch {
    throw new Error(`Invalid MCP URL: ${mcpUrl}`);
  }

  // Generate schema with proper validation
  const schemaCode = generateZodSchema(tool.inputSchema);
  if (!schemaCode) {
    throw new Error(`Failed to generate schema for tool: ${tool.name}`);
  }

  return `import { tool } from 'ai';
import { type Client } from '@modelcontextprotocol/sdk/client/index.js';
import { z } from 'zod';

// Auto-generated wrapper for MCP tool: ${tool.name}
// Source: ${mcpUrl}
export const ${toolName}ToolWithClient = (getClient: () => Promise<Client> | Client) => tool({
  description: ${escapeStringForTypeScript(tool.description || "")},
  inputSchema: z.object(${schemaCode}),
  execute: async (args): Promise<string> => {
    const client = await getClient();
    const result = await client.callTool({
      name: ${escapeStringForTypeScript(tool.name)},
      arguments: args
    });
    
    // Handle different content types from MCP
    if (Array.isArray(result.content)) {
      return result.content
        .map((item: unknown) => typeof item === 'string' ? item : JSON.stringify(item))
        .join('\\n');
    } else if (typeof result.content === 'string') {
      return result.content;
    } else {
      return JSON.stringify(result.content);
    }
  }
});
`;
}

function generateClientFile(mcpUrl: string, useSSE: boolean): string {
  const transportType = useSSE
    ? "SSEClientTransport"
    : "StreamableHTTPClientTransport";
  const transportImport = useSSE ? "sse" : "streamableHttp";

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
  )}));
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

function generateZodSchema(schema: any): string {
  if (!schema || !schema.properties) {
    return "{}";
  }

  try {
    const zodSchema = jsonSchemaToZod(schema);
    // Remove the outer z.object() wrapper since we'll add it in the template
    const match = zodSchema.match(/^z\.object\(([\s\S]*)\)$/);
    const innerSchema = match ? match[1] : zodSchema;
    return innerSchema;
  } catch (error) {
    // Fallback to manual generation if json-schema-to-zod fails
    console.error(
      `Warning: Failed to convert schema for ${JSON.stringify(
        schema
      )}, using fallback`
    );
    process.exit(1);
  }
}

function generateIndexFile(toolNames: string[], mcpUrl: string): string {
  const imports = toolNames
    .map((name) => `import { ${name}ToolWithClient } from './${name}.js';`)
    .join("\n");

  const exportsWithDefaultClient = toolNames
    .map((name) => `  ${name}: ${name}ToolWithClient(getMcpClient)`)
    .join(",\n");

  const exportsWithClient = toolNames
    .map((name) => `  ${name}: ${name}ToolWithClient(() => client)`)
    .join(",\n");

  // Generate export name based on domain
  const exportName = generateMcpExportName(mcpUrl);

  return `// Auto-generated index file for MCP tools
// Source: ${mcpUrl}
import { getMcpClient } from './client.js';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
${imports}

// Exports using a default client
export const ${exportName}Tools = {
${exportsWithDefaultClient}
} as const;

export const ${exportName}ToolsWithClient = (client: Promise<Client> | Client) => ({
${exportsWithClient}
} as const);

// Individual tool exports
${toolNames
  .map(
    (name) => `export const ${name}Tool = ${name}ToolWithClient(getMcpClient);`
  )
  .join("\n")}
`;
}

function generateMcpExportName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    // Convert domain to camelCase export name
    // Remove common prefixes and convert to camelCase
    let name = hostname
      .replace(/^(www\.|api\.|mcp\.)/i, "") // Remove common prefixes
      .replace(/\.(com|org|net|io|dev|app|ai|co)$/i, "") // Remove common TLDs
      .split(".")
      .map((part, index) => {
        // First part lowercase, rest capitalized
        if (index === 0) {
          return part.toLowerCase();
        }
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join("");

    // Ensure valid identifier
    name = name.replace(/[^a-zA-Z0-9]/g, "");
    if (!name || /^[0-9]/.test(name)) {
      name = "mcpTools"; // fallback
    } else {
      name = "mcp" + name.charAt(0).toUpperCase() + name.slice(1);
    }

    return name;
  } catch {
    // Fallback for non-URLs
    const sanitized = url.replace(/[^a-zA-Z0-9]/g, "");
    return sanitized
      ? `mcp${sanitized.charAt(0).toUpperCase()}${sanitized.slice(1)}`
      : "mcpTools";
  }
}

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
  useSSE: boolean = false
): Promise<ToolDefinition[]> {
  const transport = useSSE
    ? new SSEClientTransport(new URL(url))
    : new StreamableHTTPClientTransport(new URL(url));

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

async function fetchToolDefinitions(
  mcpUrlOrPath: string,
  useSSE: boolean = false
): Promise<ToolDefinition[]> {
  if (await isUrl(mcpUrlOrPath)) {
    return fetchToolDefinitionsFromHttp(mcpUrlOrPath, useSSE);
  } else {
    return fetchToolDefinitionsFromStdio(mcpUrlOrPath);
  }
}

async function main() {
  const args = process.argv.slice(2);
  let mcpUrlOrPath: string;
  let useSSE = false;

  // Parse command line arguments
  if (args.length === 0) {
    console.error("Usage: mcp-tools-cli [--sse] <MCP_URL_OR_PATH>");
    console.error("");
    console.error("Options:");
    console.error(
      "  --sse    Use Server-Sent Events transport (default: StreamableHttp for URLs)"
    );
    console.error("");
    console.error("Examples:");
    console.error("  mcp-tools-cli /path/to/mcp-server.js");
    console.error("  mcp-tools-cli http://localhost:3000/mcp");
    console.error("  mcp-tools-cli --sse https://example.com/mcp/sse");
    process.exit(1);
  }

  if (args[0] === "--sse") {
    useSSE = true;
    mcpUrlOrPath = args[1];
    if (!mcpUrlOrPath) {
      console.error("Error: Missing MCP URL or path after --sse flag");
      process.exit(1);
    }
  } else {
    mcpUrlOrPath = args[0];
  }

  try {
    const tools = await fetchToolDefinitions(mcpUrlOrPath, useSSE);
    const basePath = "samples/" + urlToPath(mcpUrlOrPath);

    console.log(`Found ${tools.length} tools from ${mcpUrlOrPath}`);
    console.log(`Generating AI SDK wrappers in: ${basePath}/`);

    // Ensure directory exists
    await mkdir(basePath, { recursive: true });

    // Generate shared client file first
    const clientPath = join(basePath, "client.ts");
    const clientCode = generateClientFile(mcpUrlOrPath, useSSE);
    await writeFile(clientPath, clientCode, "utf-8");
    console.log(`Generated: ${clientPath} ✓`);

    const generatedTools: string[] = [];

    for (const tool of tools) {
      try {
        const sanitizedName = validateToolName(tool.name);
        const filePath = join(basePath, `${sanitizedName}.ts`);
        const toolCode = generateAISDKTool(tool, mcpUrlOrPath, useSSE);

        // Write the tool file
        await writeFile(filePath, toolCode, "utf-8");

        console.log(`Generated: ${filePath} ✓`);
        generatedTools.push(sanitizedName);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `Failed to generate tool ${tool.name}: ${error.message}`
          );
        } else {
          console.error(`Failed to generate tool ${tool.name}: Unknown error`);
        }
        // Continue with other tools instead of failing completely
        continue;
      }
    }

    // Generate index.ts file that exports all tools
    if (generatedTools.length > 0) {
      const indexPath = join(basePath, "index.ts");
      const indexCode = generateIndexFile(generatedTools, mcpUrlOrPath);

      await writeFile(indexPath, indexCode, "utf-8");
      console.log(`Generated: ${indexPath} ✓`);
    }

    console.log(
      `\nGenerated ${tools.length} AI SDK tool wrappers successfully!`
    );
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching tool definitions:", error.message);
    } else {
      console.error("Error fetching tool definitions:", error);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
