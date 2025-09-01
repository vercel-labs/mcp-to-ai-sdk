import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: hf_doc_search
// Source: https://huggingface.co/mcp
export const hf_doc_searchToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `Search documentation about all of Hugging Face products and libraries (Transformers, Datasets, Diffusers, Gradio, Hub, and more). Use this for the most up-to-date information Returns excerpts grouped by Product and Document.`,
    inputSchema: z
      .object({
        query: z.string().min(3).max(200).describe("Semantic search query"),
        product: z
          .string()
          .describe(
            `Filter by Product (e.g., "hub", "dataset-viewer", "transformers"). Supply when known for focused results`,
          )
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "hf_doc_search",
        arguments: args,
      });

      // Handle different content types from MCP
      if (Array.isArray(result.content)) {
        return result.content
          .map((item: unknown) =>
            typeof item === "string" ? item : JSON.stringify(item),
          )
          .join("\n");
      } else if (typeof result.content === "string") {
        return result.content;
      } else {
        return JSON.stringify(result.content);
      }
    },
  });
