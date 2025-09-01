# MCP to AI SDK

A CLI tool that generates Vercel AI SDK wrappers for Model Context Protocol (MCP) tools.

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
```

## What it does

1. **Discovers MCP Tools**: Connects to an MCP server and fetches all available tool definitions
2. **Generates Type-Safe Wrappers**: Creates individual TypeScript files for each tool with:
   - Proper Vercel AI SDK `tool()` definitions
   - Zod schema validation converted from JSON Schema
   - Type-safe parameter handling
   - MCP client connection management
3. **Creates Convenient Exports**: Generates an `index.ts` file that exports:
   - Default export: Domain-based object (e.g., `mcpGrep` for mcp.grep.app) with all tools `{toolName: toolImplementation}`
   - Individual named exports for each tool
4. **Outputs Ready-to-Use Files**: Generates files in `samples/{hostname}/` format

## Generated Code Features

- ✅ **Full TypeScript support** with proper types throughout
- ✅ **Zod schema validation** with descriptions and defaults
- ✅ **Automatic MCP client management** (connect/execute/close)
- ✅ **Multiple transport support** (StreamableHttp, SSE, Stdio)
- ✅ **Robust error handling** and content type conversion
- ✅ **Both named and default exports** for flexibility

## Example Generated Tool

```typescript
import { tool } from 'ai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { z } from 'zod';

export const searchGitHubTool = tool({
  description: "Find real-world code examples from GitHub repositories",
  inputSchema: z.object({
    query: z.string().describe("Code pattern to search for"),
    language: z.array(z.string()).optional().describe("Programming languages")
  }),
  execute: async (args): Promise<string> => {
    const transport = new StreamableHTTPClientTransport(new URL("https://mcp.grep.app"));
    const client = new Client({
      name: "ai-sdk-mcp-wrapper",
      version: "1.0.0"
    }, {
      capabilities: {}
    });

    try {
      await client.connect(transport);
      const result = await client.callTool({
        name: "searchGitHub",
        arguments: args
      });
      
      // Handle different content types from MCP
      if (Array.isArray(result.content)) {
        return result.content
          .map((item: unknown) => typeof item === 'string' ? item : JSON.stringify(item))
          .join('\n');
      } else if (typeof result.content === 'string') {
        return result.content;
      } else {
        return JSON.stringify(result.content);
      }
    } finally {
      await client.close();
    }
  }
});
```

## Using Generated Tools

### Option 1: Import all tools from index
```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import mcpGrep from './samples/mcp.grep.app/index.js'; // Domain-based export name

const result = await generateText({
  model: openai('gpt-4'),
  tools: mcpGrep, // Use all tools from the MCP server
  prompt: 'Find examples of React hooks usage'
});
```

### Option 2: Import specific tools
```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { searchGitHubTool } from './samples/mcp.grep.app/index.js';

const result = await generateText({
  model: openai('gpt-4'),
  tools: {
    searchGitHub: searchGitHubTool
  },
  prompt: 'Find examples of React hooks usage'
});
```

### Option 3: Import directly from individual files
```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { searchGitHubTool } from './samples/mcp.grep.app/searchGitHub.js';

const result = await generateText({
  model: openai('gpt-4'),
  tools: {
    searchGitHub: searchGitHubTool
  },
  prompt: 'Find examples of React hooks usage'
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