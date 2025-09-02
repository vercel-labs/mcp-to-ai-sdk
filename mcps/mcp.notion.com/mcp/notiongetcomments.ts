import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: notion-get-comments
// Source: https://mcp.notion.com/mcp
export const notiongetcommentsToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Get all comments of a page",
    inputSchema: z
      .object({ page_id: z.string().describe("Identifier for a Notion page.") })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "notion-get-comments",
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
