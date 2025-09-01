import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: model_search
// Source: https://huggingface.co/mcp
export const model_searchToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description:
      "Find Machine Learning models hosted on Hugging Face. Returns comprehensive information about matching models including downloads, likes, tags, and direct links. Include links to the models in your response",
    inputSchema: z
      .object({
        query: z
          .string()
          .describe(
            'Search term. Leave blank and specify "sort" and "limit" to get e.g. "Top 20 trending models", "Top 10 most recent models" etc" ',
          )
          .optional(),
        author: z
          .string()
          .describe(
            "Organization or user who created the model (e.g., 'google', 'meta-llama', 'microsoft')",
          )
          .optional(),
        task: z
          .string()
          .describe(
            "Model task type (e.g., 'text-generation', 'image-classification', 'translation')",
          )
          .optional(),
        library: z
          .string()
          .describe(
            "Framework the model uses (e.g., 'transformers', 'diffusers', 'timm')",
          )
          .optional(),
        sort: z
          .enum([
            "trendingScore",
            "downloads",
            "likes",
            "createdAt",
            "lastModified",
          ])
          .describe(
            "Sort order: trendingScore, downloads , likes, createdAt, lastModified",
          )
          .optional(),
        limit: z
          .number()
          .gte(1)
          .lte(100)
          .describe("Maximum number of results to return")
          .default(20),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "model_search",
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
