import { tool } from 'ai';
import { type Client } from '@modelcontextprotocol/sdk/client/index.js';
import { z } from 'zod';

// Auto-generated wrapper for MCP tool: gr1_flux1_schnell_infer
// Source: https://huggingface.co/mcp
export const gr1_flux1_schnell_inferToolWithClient = (getClient: () => Promise<Client> | Client) => tool({
  description: "Generate an image using the Flux 1 Schnell Image Generator. (from evalstate/flux1_schnell)",
  inputSchema: z.object({ "prompt": z.string().describe("Approximately 60-70 words max - description of the image to generate.").optional(), "seed": z.number().describe("numeric value between 0 and 2147483647").optional(), "randomize_seed": z.boolean().default(true), "width": z.number().describe("numeric value between 256 and 2048").default(1024), "height": z.number().describe("numeric value between 256 and 2048").default(1024), "num_inference_steps": z.number().describe("numeric value between 1 and 16").default(4) }).strict(),
  execute: async (args): Promise<string> => {
    const client = await getClient();
    const result = await client.callTool({
      name: "gr1_flux1_schnell_infer",
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
