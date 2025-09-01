import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: dataset_search
// Source: https://huggingface.co/mcp
export const dataset_searchToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description:
      "Find Datasets hosted on the Hugging Face hub. Returns comprehensive information about matching datasets including downloads, likes, tags, and direct links. Include links to the datasets in your response",
    inputSchema: z
      .object({
        query: z
          .string()
          .describe(
            'Search term. Leave blank and specify "sort" and "limit" to get e.g. "Top 20 trending datasets", "Top 10 most recent datasets" etc" ',
          )
          .optional(),
        author: z
          .string()
          .describe(
            "Organization or user who created the dataset (e.g., 'google', 'facebook', 'allenai')",
          )
          .optional(),
        tags: z
          .array(z.string())
          .describe(
            "Tags to filter datasets (e.g., ['language:en', 'size_categories:1M<n<10M', 'task_categories:text-classification'])",
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
            "Sort order: trendingScore, downloads, likes, createdAt, lastModified",
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
        name: "dataset_search",
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
