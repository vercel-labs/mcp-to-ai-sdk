import { jsonSchemaToZod } from "json-schema-to-zod";

export interface ToolDefinition {
  name: string;
  description?: string;
  inputSchema: any;
}

export function validateToolName(name: string): string {
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

export function generateAISDKTool(
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