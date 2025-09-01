import { tool } from 'ai';
import { type Client } from '@modelcontextprotocol/sdk/client/index.js';
import { z } from 'zod';

// Auto-generated wrapper for MCP tool: paper_search
// Source: https://huggingface.co/mcp
export const paper_searchToolWithClient = (getClient: () => Promise<Client> | Client) => tool({
  description: "Find Machine Learning research papers on the Hugging Face hub. Include 'Link to paper' When presenting the results. Consider whether tabulating results matches user intent.",
  inputSchema: z.object({ "query": z.string().min(3).max(200).describe("Semantic Search query"), "results_limit": z.number().describe("Number of results to return").default(12), "concise_only": z.boolean().describe("Return a 2 sentence summary of the abstract. Use for broad search terms which may return a lot of results. Check with User if unsure.").default(false) }).strict(),
  execute: async (args): Promise<string> => {
    const client = await getClient();
    const result = await client.callTool({
      name: "paper_search",
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
