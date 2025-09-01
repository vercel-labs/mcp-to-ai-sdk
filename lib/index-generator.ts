export function generateMcpExportName(url: string): string {
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

export function generateIndexFile(toolNames: string[], mcpUrl: string): string {
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