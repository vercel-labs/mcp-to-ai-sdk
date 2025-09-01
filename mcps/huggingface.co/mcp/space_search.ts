import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: space_search
// Source: https://huggingface.co/mcp
export const space_searchToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description:
      "Find Hugging Face Spaces using semantic search. Include links to the Space when presenting the results.",
    inputSchema: z
      .object({
        query: z.string().min(1).max(100).describe("Semantic Search Query"),
        limit: z.number().describe("Number of results to return").default(10),
        mcp: z
          .boolean()
          .describe("Only return MCP Server enabled Spaces")
          .default(false),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "space_search",
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
