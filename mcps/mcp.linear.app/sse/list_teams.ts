import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: list_teams
// Source: https://mcp.linear.app/sse
export const list_teamsToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "List teams in the user's Linear workspace",
    inputSchema: z
      .object({
        limit: z
          .number()
          .lte(250)
          .describe("The number of results to return (Max is 250)")
          .default(50),
        before: z.string().describe("An ID to end at").optional(),
        after: z.string().describe("An ID to start from").optional(),
        orderBy: z
          .enum(["createdAt", "updatedAt"])
          .describe("The order in which to return results")
          .default("updatedAt"),
        query: z.string().describe("An optional search query").optional(),
        includeArchived: z
          .boolean()
          .describe("Whether to include archived teams")
          .default(false),
        createdAt: z
          .string()
          .describe(
            `Return only teams created on or after this ISO-8601 date-time or duration. e.g. -P1D to get teams created in the last day`,
          )
          .optional(),
        updatedAt: z
          .string()
          .describe(
            `Return only teams updated on or after this ISO-8601 date-time or duration. e.g. -P1D to get teams updated in the last day`,
          )
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "list_teams",
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
