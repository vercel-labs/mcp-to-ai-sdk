import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: notion-move-pages
// Source: https://mcp.notion.com/mcp
export const notionmovepagesToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Move one or more Notion pages or databases to a new parent.",
    inputSchema: z
      .object({
        page_or_database_ids: z
          .array(z.string())
          .min(1)
          .max(100)
          .describe(
            `An array of up to 100 page or database IDs to move. IDs are v4 UUIDs and can be supplied with or without dashes (e.g. extracted from a <page> or <database> URL given by the "search" or "view" tool). Data Sources under Databases can't be moved individually.`,
          ),
        new_parent: z
          .union([
            z
              .object({
                page_id: z
                  .string()
                  .describe(
                    `The ID of the parent page (with or without dashes), for example, 195de9221179449fab8075a27c979105`,
                  ),
                type: z.literal("page_id").optional(),
              })
              .strict(),
            z
              .object({
                database_id: z
                  .string()
                  .describe(
                    `The ID of the parent database (with or without dashes), for example, 195de9221179449fab8075a27c979105`,
                  ),
                type: z.literal("database_id").optional(),
              })
              .strict(),
          ])
          .describe(
            `The new parent under which the pages will be moved. This can be a page or a database.`,
          ),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "notion-move-pages",
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
