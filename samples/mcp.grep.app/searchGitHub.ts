import { tool } from 'ai';
import { type Client } from '@modelcontextprotocol/sdk/client/index.js';
import { z } from 'zod';

// Auto-generated wrapper for MCP tool: searchGitHub
// Source: https://mcp.grep.app
export const searchGitHubToolWithClient = (getClient: () => Promise<Client> | Client) => tool({
  description: "Find real-world code examples from over a million public GitHub repositories to help answer programming questions.\n\n**IMPORTANT: This tool searches for literal code patterns (like grep), not keywords. Search for actual code that would appear in files:**\n- ✅ Good: 'useState(', 'import React from', 'async function', '(?s)try {.*await'\n- ❌ Bad: 'react tutorial', 'best practices', 'how to use'\n\n**When to use this tool:**\n- When implementing unfamiliar APIs or libraries and need to see real usage patterns\n- When unsure about correct syntax, parameters, or configuration for a specific library\n- When looking for production-ready examples and best practices for implementation\n- When needing to understand how different libraries or frameworks work together\n\n**Perfect for questions like:**\n- \"How do developers handle authentication in Next.js apps?\" → Search: 'getServerSession' with language=['TypeScript', 'TSX']\n- \"What are common React error boundary patterns?\" → Search: 'ErrorBoundary' with language=['TSX']\n- \"Show me real useEffect cleanup examples\" → Search: '(?s)useEffect\\(\\(\\) => {.*removeEventListener' with useRegexp=true\n- \"How do developers handle CORS in Flask applications?\" → Search: 'CORS(' with matchCase=true and language=['Python']\n\nUse regular expressions with useRegexp=true for flexible patterns like '(?s)useState\\(.*loading' to find useState hooks with loading-related variables. Prefix the pattern with '(?s)' to match across multiple lines.\n\nFilter by language, repository, or file path to narrow results.",
  inputSchema: z.object({ "query": z.string().describe("The literal code pattern to search for (e.g., 'useState(', 'export function'). Use actual code that would appear in files, not keywords or questions."), "matchCase": z.boolean().describe("Whether the search should be case sensitive").default(false), "matchWholeWords": z.boolean().describe("Whether to match whole words only").default(false), "useRegexp": z.boolean().describe("Whether to interpret the query as a regular expression").default(false), "repo": z.string().describe("Filter by repository.\n            Examples: 'facebook/react', 'microsoft/vscode', 'vercel/ai'.\n            Can match partial names, for example 'vercel/' will find repositories in the vercel org.").optional(), "path": z.string().describe("Filter by file path.\n            Examples: 'src/components/Button.tsx', 'README.md'.\n            Can match partial paths, for example '/route.ts' will find route.ts files at any level.").optional(), "language": z.array(z.string()).describe("Filter by programming language.\n            Examples: ['TypeScript', 'TSX'], ['JavaScript'], ['Python'], ['Java'], ['C#'], ['Markdown'], ['YAML']").optional() }).strict(),
  execute: async (args): Promise<string> => {
    const client = await getClient();
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
