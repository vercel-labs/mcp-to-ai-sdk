#!/usr/bin/env node
import { mkdir, writeFile, readFile, access, constants } from "fs/promises";
import { join } from "path";
import { createInterface } from "readline";
import { Command } from "commander";
import { generateAISDKTool, validateToolName } from "./lib/tool-generator.js";
import { generateClientFile } from "./lib/client-generator.js";
import { generateIndexFile } from "./lib/index-generator.js";
import { fetchToolDefinitions } from "./lib/mcp-client.js";
import { urlToPath, parseHeader } from "./lib/utils.js";
import { formatCode } from "./lib/formatter.js";

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function promptUser(message: string): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim() === 'y' || answer.toLowerCase().trim() === 'yes');
    });
  });
}

async function safeWriteFile(filePath: string, content: string, skipPrompt: boolean = false): Promise<boolean> {
  const exists = await fileExists(filePath);
  
  if (!exists) {
    // File doesn't exist, safe to write
    await writeFile(filePath, content, "utf-8");
    return true;
  }

  // File exists, check if content is different
  try {
    const existingContent = await readFile(filePath, "utf-8");
    if (existingContent === content) {
      // Content is the same, no need to write
      return true;
    }

    // Content is different, prompt user unless skipPrompt is true
    if (skipPrompt) {
      await writeFile(filePath, content, "utf-8");
      return true;
    }

    const shouldOverwrite = await promptUser(`File ${filePath} exists and would be changed. Overwrite?`);
    if (shouldOverwrite) {
      await writeFile(filePath, content, "utf-8");
      return true;
    } else {
      console.log(`Skipped: ${filePath}`);
      return false;
    }
  } catch (error) {
    // If we can't read the existing file, treat it as safe to write
    await writeFile(filePath, content, "utf-8");
    return true;
  }
}

async function main() {
  const program = new Command();
  
  program
    .name("mcp-to-ai-sdk")
    .description("CLI tool to generate Vercel AI SDK wrappers for MCP tools")
    .version("1.0.0")
    .argument("<mcp-url-or-path>", "MCP URL or path to server")
    .option("--sse", "Use Server-Sent Events transport (default: StreamableHttp for URLs)")
    .option("-y, --yes", "Automatically overwrite existing files without prompting")
    .option("-H, --header <header>", "Add HTTP header (format: 'Header: value')", (value: string, previous: string[]) => {
      const headers = previous || [];
      headers.push(value);
      return headers;
    }, [] as string[])
    .addHelpText("after", `
Examples:
  $ mcp-to-ai-sdk /path/to/mcp-server.js
  $ mcp-to-ai-sdk http://localhost:3000/mcp
  $ mcp-to-ai-sdk --sse https://example.com/mcp/sse
  $ mcp-to-ai-sdk -H 'Authorization: Bearer token' https://api.example.com/mcp
  $ mcp-to-ai-sdk -H 'X-API-Key: key' -H 'Content-Type: application/json' https://api.example.com/mcp
  $ mcp-to-ai-sdk --yes https://mcp.grep.app`)
    .action(async (mcpUrlOrPath: string, options: { sse?: boolean; yes?: boolean; header: string[] }) => {
      const useSSE = options.sse || false;
      const skipPrompt = options.yes || false;
      
      // Parse headers
      const headers: Record<string, string> = {};
      try {
        for (const headerArg of options.header) {
          const [key, value] = parseHeader(headerArg);
          headers[key] = value;
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        } else {
          console.error("Error parsing headers:", error);
        }
        process.exit(1);
      }

      try {
        const tools = await fetchToolDefinitions(mcpUrlOrPath, useSSE, headers);
        const basePath = "samples/" + urlToPath(mcpUrlOrPath);

        console.log(`Found ${tools.length} tools from ${mcpUrlOrPath}`);
        if (Object.keys(headers).length > 0) {
          console.log(`Using headers: ${Object.keys(headers).join(', ')}`);
        }
        console.log(`Generating AI SDK wrappers in: ${basePath}/`);

        // Ensure directory exists
        await mkdir(basePath, { recursive: true });

        // Generate shared client file first
        const clientPath = join(basePath, "client.ts");
        const clientCode = generateClientFile(mcpUrlOrPath, useSSE, headers);
        const formattedClientCode = await formatCode(clientCode, clientPath);
        const clientWritten = await safeWriteFile(clientPath, formattedClientCode, skipPrompt);
        if (clientWritten) {
          console.log(`Generated: ${clientPath} ✓`);
        }

        const generatedTools: string[] = [];

        for (const tool of tools) {
          try {
            const sanitizedName = validateToolName(tool.name);
            const filePath = join(basePath, `${sanitizedName}.ts`);
            const toolCode = generateAISDKTool(tool, mcpUrlOrPath, useSSE);
            const formattedToolCode = await formatCode(toolCode, filePath);

            // Write the tool file
            const toolWritten = await safeWriteFile(filePath, formattedToolCode, skipPrompt);
            if (toolWritten) {
              console.log(`Generated: ${filePath} ✓`);
              generatedTools.push(sanitizedName);
            }
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
          const formattedIndexCode = await formatCode(indexCode, indexPath);

          const indexWritten = await safeWriteFile(indexPath, formattedIndexCode, skipPrompt);
          if (indexWritten) {
            console.log(`Generated: ${indexPath} ✓`);
          }
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
    });

  try {
    await program.parseAsync();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
