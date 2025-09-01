import { tool } from 'ai';
import { type Client } from '@modelcontextprotocol/sdk/client/index.js';
import { z } from 'zod';

// Auto-generated wrapper for MCP tool: dataset_details
// Source: https://huggingface.co/mcp
export const dataset_detailsToolWithClient = (getClient: () => Promise<Client> | Client) => tool({
  description: "Get detailed information about a specific dataset on Hugging Face Hub.",
  inputSchema: z.object({ "dataset_id": z.string().min(5).describe("The Dataset ID (e.g. Anthropic/hh-rlhf, squad)") }).strict(),
  execute: async (args): Promise<string> => {
    const client = await getClient();
    const result = await client.callTool({
      name: "dataset_details",
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
