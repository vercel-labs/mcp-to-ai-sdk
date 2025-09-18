import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: create_comment
// Source: https://mcp.linear.app/sse
export const create_commentToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Create a comment on a specific Linear issue",
    inputSchema: z
      .object({
        issueId: z.string().describe("The issue ID"),
        parentId: z
          .string()
          .describe("A parent comment ID to reply to")
          .optional(),
        body: z.string().describe("The content of the comment as Markdown"),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "create_comment",
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
