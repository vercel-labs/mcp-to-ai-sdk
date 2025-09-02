import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: notion-get-users
// Source: https://mcp.notion.com/mcp
export const notiongetusersToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "List all users",
    inputSchema: z
      .object({
        query: z
          .object({
            start_cursor: z.string().optional(),
            page_size: z.number().optional(),
          })
          .strict(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "notion-get-users",
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
