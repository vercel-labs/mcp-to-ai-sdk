import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: create_issue_label
// Source: https://mcp.linear.app/sse
export const create_issue_labelToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Create a new Linear issue label",
    inputSchema: z
      .object({
        name: z.string().describe("The name of the label"),
        description: z
          .string()
          .describe("An optional description of the label")
          .optional(),
        color: z
          .string()
          .describe("The color of the label (hex color code)")
          .optional(),
        teamId: z
          .string()
          .describe(
            "The team UUID. If not provided, the label will be created as a workspace label",
          )
          .optional(),
        parentId: z
          .string()
          .describe(
            "The parent label UUID, if this is a child of a label group",
          )
          .optional(),
        isGroup: z
          .boolean()
          .describe(
            "Whether this is label group (cannot be applied to issues directly)",
          )
          .default(false),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "create_issue_label",
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
