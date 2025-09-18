import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: list_projects
// Source: https://mcp.linear.app/sse
export const list_projectsToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "List projects in the user's Linear workspace",
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
        query: z
          .string()
          .describe("Search for content in the project name")
          .optional(),
        state: z
          .string()
          .describe("The state name or ID to filter by")
          .optional(),
        initiative: z
          .string()
          .describe("The initiative name or ID to filter by")
          .optional(),
        team: z
          .string()
          .describe("The team name or ID to filter by")
          .optional(),
        member: z
          .string()
          .describe(
            'A team member to filter by (User ID, name, email, or "me")',
          )
          .optional(),
        createdAt: z
          .string()
          .describe(
            `Return only projects created on or after this ISO-8601 date-time or duration. e.g. -P1D to get projects created in the last day`,
          )
          .optional(),
        updatedAt: z
          .string()
          .describe(
            `Return only projects updated on or after this ISO-8601 date-time or duration. e.g. -P1D to get projects updated in the last day`,
          )
          .optional(),
        includeArchived: z
          .boolean()
          .describe("Whether to include archived projects")
          .default(false),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "list_projects",
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
