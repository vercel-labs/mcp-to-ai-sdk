import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: list_issues
// Source: https://mcp.linear.app/sse
export const list_issuesToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `List issues in the user's Linear workspace. For my issues, use "me" as the assignee.`,
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
          .describe("Search for content in the issue title or description")
          .optional(),
        team: z
          .string()
          .describe("The team name or ID to filter by")
          .optional(),
        state: z
          .string()
          .describe("The state name or ID to filter by")
          .optional(),
        cycle: z
          .string()
          .describe("The cycle name or ID to filter by")
          .optional(),
        label: z
          .string()
          .describe("A label name or ID to filter by")
          .optional(),
        assignee: z
          .string()
          .describe('The assignee to filter by (User ID, name, email, or "me")')
          .optional(),
        delegate: z
          .string()
          .describe("An agent name or ID to filter by")
          .optional(),
        project: z
          .string()
          .describe("The project name or ID to filter by")
          .optional(),
        parentId: z
          .string()
          .describe("The parent issue ID to filter by")
          .optional(),
        createdAt: z
          .string()
          .describe(
            `Return only issues created on or after this ISO-8601 date-time or duration. e.g. -P1D to get issues created in the last day`,
          )
          .optional(),
        updatedAt: z
          .string()
          .describe(
            `Return only issues updated on or after this ISO-8601 date-time or duration. e.g. -P1D to get issues updated in the last day`,
          )
          .optional(),
        includeArchived: z
          .boolean()
          .describe("Whether to include archived issues")
          .default(true),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "list_issues",
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
