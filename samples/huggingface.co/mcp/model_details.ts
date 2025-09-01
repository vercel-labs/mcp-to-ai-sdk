import { tool } from 'ai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { z } from 'zod';

// Auto-generated wrapper for MCP tool: model_details
// Source: https://huggingface.co/mcp
export const model_detailsTool = tool({
  description: "Get detailed information about a model from the Hugging Face Hub. Include relevant links in result summaries.",
  inputSchema: z.object({ "model_id": z.string().min(1).describe("The Model ID in author/model format (e.g., microsoft/DialoGPT-large)") }).strict(),
  execute: async (args): Promise<string> => {
    const transport = new StreamableHTTPClientTransport(new URL("https://huggingface.co/mcp"));
    const client = new Client(
      {
        name: "ai-sdk-mcp-wrapper",
        version: "1.0.0"
      },
      {
        capabilities: {}
      }
    );

    try {
      await client.connect(transport);
      
      const result = await client.callTool({
        name: "model_details",
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
