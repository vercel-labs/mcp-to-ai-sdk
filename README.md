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
   - Shared MCP client for optimal performance
3. **Creates Convenient Exports**: Generates an `index.ts` file that exports:
   - Default export: Domain-based object (e.g., `mcpGrep` for mcp.grep.app) with all tools `{toolName: toolImplementation}`
   - Individual named exports for each tool
4. **Creates Shared Client**: Generates a `client.ts` file with:
   - Lazy connection on first use
   - Connection pooling and reuse
   - Automatic timeout handling
   - Graceful cleanup functions
5. **Outputs Ready-to-Use Files**: Generates files in `samples/{hostname}/` format

## Generated Code Features

- ✅ **Full TypeScript support** with proper types throughout
- ✅ **Zod schema validation** with descriptions and defaults
- ✅ **Shared MCP client** for optimal performance and connection reuse
- ✅ **Multiple transport support** (StreamableHttp, SSE, Stdio)
- ✅ **Robust error handling** and content type conversion
- ✅ **Both named and default exports** for flexibility
- ✅ **Lazy connection** - client connects only when first tool is used

## Generated File Structure

```
samples/mcp.grep.app/
├── client.ts          # Shared MCP client with lazy connection
├── index.ts           # Domain-based exports (mcpGrepTools)
└── searchGitHub.ts    # Individual tool implementation
```

## Example Generated Tool

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import { getMcpClient } from './client.js';

export const searchGitHubTool = tool({
  description: "Find real-world code examples from GitHub repositories",
  inputSchema: z.object({
    query: z.string().describe("Code pattern to search for"),
    language: z.array(z.string()).optional().describe("Programming languages")
  }),
  execute: async (args): Promise<string> => {
    const client = await getMcpClient(); // Shared client instance
    
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
  }
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