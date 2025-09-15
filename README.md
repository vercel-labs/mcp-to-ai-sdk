# MCP to AI SDK

A CLI tool that generates Vercel AI SDK stubs for Model Context Protocol (MCP) tools. Think of it as "shadcn for MCP".

Why would you do this over using the MCP directly:

- Security: Prevents possible prompt injection from unexpected changes to the MCP server tool definitions.
- Security: Prevents security issues from unexpected new tools (e.g. when the server introduces a new delete function which your agent is not expected to call).
- Security: Allows overridding tool implementations with narrower arguments. E.g. by limiting queries to a single tenant or similar specialization of broad tools.
- Quality/cost: High context usage from unneeded functions.  
- Quality: Prevents quality regressions from unexpected changes to the MCP server.
- Quality: Allows tuning of tool call precision in the context of your project.

[See samples of generated output.](https://github.com/vercel-labs/mcp-to-ai-sdk/tree/main/mcps)

[See sample usage of MCP stubs.](https://github.com/vercel-labs/mcp-to-ai-sdk/blob/main/samples/grep-app-test.ts)

## Installation

```bash
npx mcp-to-ai-sdk@latest <MCP_URL_OR_PATH>
```

## Usage

```bash
# Generate wrappers for HTTP MCP endpoints (uses StreamableHttp by default)
npx mcp-to-ai-sdk@latest https://mcp.grep.app

# Use Server-Sent Events transport
npx mcp-to-ai-sdk@latest --sse https://example.com/mcp/sse

# Generate wrappers for local MCP servers
npx mcp-to-ai-sdk@latest /path/to/mcp-server.js

# Add authentication headers for protected MCP endpoints
npx mcp-to-ai-sdk@latest -H 'Authorization: Bearer your-token' https://api.example.com/mcp
npx mcp-to-ai-sdk@latest -H 'X-API-Key: your-key' -H 'Authorization: Bearer your-token' https://api.example.com/mcp
```

## Generated File Structure

```
mcps/mcp.grep.app/
├── client.ts          # Shared MCP client with lazy connection
├── index.ts           # Domain-based exports (mcpGrepTools)
└── searchGitHub.ts    # Individual tool implementation
```

## Example Generated Tool

```typescript
import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: searchGitHub
// Source: https://mcp.grep.app
export const searchGitHubToolWithClient = (
  getClient: () => Promise<Client> | Client
) =>
  tool({
    description: "Find real-world code examples from GitHub repositories",
    inputSchema: z.object({
      query: z.string().describe("Code pattern to search for"),
      language: z
        .array(z.string())
        .optional()
        .describe("Programming languages"),
    }),
    execute: async (args): Promise<string> => {
      const client = await getClient();
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

## Default client

The package generates a default client shared between all tools from a given MCP servers.
You may customize connection parameters by editing the generated `client.ts` file.

## Prerequisites

To use the generated output, install the required dependencies in your project:

```bash
npm install ai zod @modelcontextprotocol/sdk
```

## Using Generated Tools

### Option 1: Import all tools from index

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { mcpGrepTools } from "./mcps/mcp.grep.app"; // Domain-based export name

const result = await generateText({
  model: openai("gpt-4"),
  tools: mcpGrepTools, // Use all tools from the MCP server
  prompt: "Find examples of React hooks usage",
});
```

### Option 2: Import specific tools

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchGitHubTool } from "./mcps/mcp.grep.app";

const result = await generateText({
  model: openai("gpt-4"),
  tools: {
    searchGitHub: searchGitHubTool,
  },
  prompt: "Find examples of React hooks usage",
});
```

### Option 3: Import directly from individual files with custom client

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchGitHubToolWithClient } from "./mcps/mcp.grep.app/searchGitHub.js";
import { getMcpClient } from "./mcps/mcp.grep.app/client.js";

const result = await generateText({
  model: openai("gpt-4"),
  tools: {
    searchGitHub: searchGitHubToolWithClient(getMcpClient),
  },
  prompt: "Find examples of React hooks usage",
});
```

### Option 4: Use client injection for all tools

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { mcpGrepToolsWithClient } from "./mcps/mcp.grep.app/index.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

// Create your custom client
const customClient = new Client(/* ... */);

const result = await generateText({
  model: openai("gpt-4"),
  tools: mcpGrepToolsWithClient(customClient), // All tools with custom client
  prompt: "Find examples of React hooks usage",
});
```

## Authentication & Headers

### OAuth Authentication

For MCP servers that require OAuth authentication, the CLI will automatically handle the complete authentication flow:

- Detects when a server requires OAuth authentication
- Spins up a temporary local web server to handle the OAuth callback
- Opens your browser to complete the authentication flow
- Automatically captures the auth tokens and proceeds with tool discovery
- Downloads all available tool definitions after successful authentication

### Manual Headers

When using `-H` flags to pass headers during tool discovery:

- Headers are used to authenticate with the MCP server during discovery
- Generated client files include header placeholders with `TODO` values for security
- You'll need to replace the TODO placeholders with actual values in your runtime environment

**Important**: While the CLI successfully downloads tool definitions from authenticated servers, you'll need to configure authentication in the generated client files for actual tool usage in your agent.

Example generated client with headers:

```typescript
const transport = new StreamableHTTPClientTransport(
  new URL("https://api.example.com/mcp"),
  {
    requestInit: {
      headers: {
        Authorization: "TODO: Replace with your actual value",
        "X-API-Key": "TODO: Replace with your actual value",
      },
    },
  }
);
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
