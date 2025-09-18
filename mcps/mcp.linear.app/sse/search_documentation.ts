import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: search_documentation
// Source: https://mcp.linear.app/sse
export const search_documentationToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description:
      "Search Linear's documentation to learn about features and usage",
    inputSchema: z
      .object({
        query: z.string().describe("The search query"),
        page: z.number().describe("The page number").default(0),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "search_documentation",
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
