# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `mcp-to-ai-sdk`, a CLI tool that generates Vercel AI SDK wrappers for Model Context Protocol (MCP) tools. It connects to MCP servers, discovers their tools, and generates type-safe TypeScript wrappers that can be used with the Vercel AI SDK.

## Development Commands

```bash
# Build the CLI
npm run build

# Run the CLI directly (after building)
npm run dev <MCP_URL_OR_PATH>

# Test the built CLI
node dist/mcp-tools-cli.js https://mcp.grep.app
```

## Architecture

### Core Components

**Main CLI File (`mcp-tools-cli.ts`)**

- Single-file CLI that handles all generation logic
- Contains functions for connecting to MCP servers (HTTP/SSE/Stdio transports)
- Generates three types of files for each MCP server

**Generated Code Architecture**
The CLI generates a directory structure like `mcps/mcp.grep.app/` with:

1. **`client.ts`** - Shared MCP client with lazy connection
   - Uses singleton pattern with connection promise deduplication
   - Handles all transports: StreamableHTTP (default), SSE, or Stdio
   - Single persistent connection shared across all tools

2. **`{toolName}.ts`** - Individual tool implementations
   - Each exports a `{toolName}ToolWithClient` factory function
   - Takes a client getter function as parameter for dependency injection
   - Uses `json-schema-to-zod` for automatic schema conversion

3. **`index.ts`** - Convenience exports
   - Domain-based naming (e.g., `mcpGrepTools` for mcp.grep.app)
   - Two export patterns: default client and custom client injection
   - Individual tool re-exports for granular imports

### Key Design Patterns

**Tool Factory Pattern**: Tools are generated as factory functions that accept a client getter, enabling both default shared client usage and custom client injection.

**Domain-based Naming**: Export names are generated from MCP URLs (e.g., `mcp.grep.app` → `mcpGrep`) with intelligent TLD and prefix stripping.

**Transport Abstraction**: The CLI auto-detects URLs vs file paths and chooses appropriate MCP transport (StreamableHTTP, SSE, or Stdio).

**Schema Conversion**: JSON Schema from MCP tools is automatically converted to Zod schemas using `json-schema-to-zod` with manual fallback.

## File Generation Logic

The main generation flow in `mcp-tools-cli.ts`:

1. `fetchToolDefinitions()` - Connects to MCP and lists tools
2. `generateClientFile()` - Creates shared client with lazy connection
3. `generateAISDKTool()` - Creates individual tool wrappers
4. `generateIndexFile()` - Creates convenience exports with domain-based naming

## Build System

- TypeScript compilation to `dist/` directory
- Target: ES2022 with NodeNext modules
- Generates declarations and source maps
- Excludes `mcps/` directory from compilation (contains generated output)

## CLI Usage Patterns

The tool supports multiple MCP connection methods:

- HTTP URLs: `mcp-to-ai-sdk https://mcp.grep.app` (uses StreamableHTTP)
- SSE endpoints: `mcp-to-ai-sdk --sse https://example.com/mcp/sse`
- Local servers: `mcp-to-ai-sdk /path/to/server.js` (uses Stdio)
