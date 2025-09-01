# MCP to AI SDK

A CLI tool that generates Vercel AI SDK stubs for Model Context Protocol (MCP) tools.

Why would you do this over using the MCP directly:

- Security: Prevents possible prompt injection from unexpected changes to the MCP server.
- Security: Prevents security issues from unexpected new tools (e.g. when the server introduces a new delete function).
- Security: Allows overridding tool implementations with narrower arguments. E.g. by limiting queries to a single tenant or similar specialization of broad tools.
- Quality: Prevents quality regressions from unexpected changes to the MCP server.
- Quality: Allows tuning of tool call precision in the context of your project.

## Installation

```bash
# Install globally
npm install -g mcp-to-ai-sdk

# Or use with npx
npx mcp-to-ai-sdk <MCP_URL_OR_PATH>
```

## Usage

```bash
# Generate wrappers for HTTP MCP endpoints (uses StreamableHttp by default)
mcp-to-ai-sdk https://mcp.grep.app

# Use Server-Sent Events transport
mcp-to-ai-sdk --sse https://example.com/mcp/sse

# Generate wrappers for local MCP servers
mcp-to-ai-sdk /path/to/mcp-server.js

# Add authentication headers for protected MCP endpoints
mcp-to-ai-sdk -H 'Authorization: Bearer your-token' https://api.example.com/mcp
mcp-to-ai-sdk -H 'X-API-Key: your-key' -H 'Authorization: Bearer your-token' https://api.example.com/mcp
```

## Generated File Structure

```
samples/mcp.grep.app/
├── client.ts          # Shared MCP client with lazy connection
├── index.ts           # Domain-based exports (mcpGrepTools)
└── searchGitHub.ts    # Individual tool implementation
```

## Example Generated Tool

```typescript
import { tool } from "ai";
import { z } from "zod";
import { getMcpClient } from "./client.js";

export const searchGitHubTool = tool({
  description: "Find real-world code examples from GitHub repositories",
  inputSchema: z.object({
    query: z.string().describe("Code pattern to search for"),
    language: z.array(z.string()).optional().describe("Programming languages"),
  }),
  execute: async (args): Promise<string> => {
    const client = await getMcpClient(); // Shared client instance

    const result = await client.callTool({
      name: "searchGitHub",
      arguments: args,
    });

    // Handle different content types from MCP
    if (Array.isArray(result.content)) {
      return result.content
        .map((item: unknown) =>
          typeof item === "string" ? item : JSON.stringify(item)
        )
        .join("\n");
    } else if (typeof result.content === "string") {
      return result.content;
    } else {
      return JSON.stringify(result.content);
    }
  },
});
```

## Shared Client Benefits

- **Performance**: Single connection reused across all tools
- **Lazy Loading**: Connection established only when first tool is used
- **Automatic Handling**: Connection timeout, error handling, and cleanup
- **Memory Efficient**: No duplicate client instances per tool

## Using Generated Tools

### Option 1: Import all tools from index

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import mcpGrep from "./samples/mcp.grep.app/index.js"; // Domain-based export name

const result = await generateText({
  model: openai("gpt-4"),
  tools: mcpGrep, // Use all tools from the MCP server
  prompt: "Find examples of React hooks usage",
});
```

### Option 2: Import specific tools

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchGitHubTool } from "./samples/mcp.grep.app/index.js";

const result = await generateText({
  model: openai("gpt-4"),
  tools: {
    searchGitHub: searchGitHubTool,
  },
  prompt: "Find examples of React hooks usage",
});
```

### Option 3: Import directly from individual files

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchGitHubTool } from "./samples/mcp.grep.app/searchGitHub.js";

const result = await generateText({
  model: openai("gpt-4"),
  tools: {
    searchGitHub: searchGitHubTool,
  },
  prompt: "Find examples of React hooks usage",
});
```

## Authentication & Headers

When using `-H` flags to pass headers during tool discovery:

- Headers are used to authenticate with the MCP server during discovery
- Generated client files include header placeholders with `TODO` values for security
- You'll need to replace the TODO placeholders with actual values in your runtime environment

Example generated client with headers:
```typescript
const transport = new StreamableHTTPClientTransport(new URL("https://api.example.com/mcp"), { 
  requestInit: { 
    headers: {
      "Authorization": "TODO: Replace with your actual value",
      "X-API-Key": "TODO: Replace with your actual value"
    } 
  } 
});
```

## Supported Transports

- **StreamableHttp** (default for URLs): Best for most HTTP MCP servers
- **Server-Sent Events**: Use `--sse` flag for SSE endpoints
- **Stdio**: Automatic for local file paths

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev https://mcp.grep.app

# Build for distribution
pnpm build

# Test built version
node dist/mcp-tools-cli.js https://mcp.grep.app
```
