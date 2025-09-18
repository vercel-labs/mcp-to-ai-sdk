import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: update_issue
// Source: https://mcp.linear.app/sse
export const update_issueToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Update an existing Linear issue",
    inputSchema: z
      .object({
        id: z.string().describe("The issue ID"),
        title: z.string().describe("The issue title").optional(),
        description: z
          .string()
          .describe("The issue description as Markdown")
          .optional(),
        priority: z
          .number()
          .describe(
            `The issue priority. 0 = No priority, 1 = Urgent, 2 = High, 3 = Normal, 4 = Low. Do not set this field unless explicitly requested.`,
          )
          .optional(),
        project: z
          .string()
          .describe("The project name or ID to add the issue to")
          .optional(),
        state: z
          .string()
          .describe("The issue state type, name, or ID")
          .optional(),
        cycle: z.string().describe("The cycle name, number, or ID").optional(),
        assignee: z
          .string()
          .describe('The user to assign (User ID, name, email, or "me")')
          .optional(),
        delegate: z
          .string()
          .describe("The agent name, displayName, or ID to delegate")
          .optional(),
        labels: z
          .array(z.string())
          .describe(
            `Array of label names or IDs to set on the issue (you can use label names directly, no need to look up IDs)`,
          )
          .optional(),
        parentId: z
          .string()
          .describe("The parent issue ID, if this is a sub-issue")
          .optional(),
        dueDate: z
          .string()
          .describe("The due date for the issue in ISO format")
          .optional(),
        estimate: z
          .number()
          .describe("The numerical issue estimate value")
          .optional(),
        links: z
          .array(
            z
              .object({ url: z.string().url(), title: z.string().min(1) })
              .strict(),
          )
          .describe(
            `Array of link objects to attach to the issue. Each object must contain a valid \`url\` and a non-empty \`title\`.`,
          )
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "update_issue",
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
