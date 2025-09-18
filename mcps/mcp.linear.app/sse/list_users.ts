import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: list_users
// Source: https://mcp.linear.app/sse
export const list_usersToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Retrieve users in the Linear workspace",
    inputSchema: z
      .object({
        query: z
          .string()
          .describe("Optional query to filter users by name or email")
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "list_users",
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
