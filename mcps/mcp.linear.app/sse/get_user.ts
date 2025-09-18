import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: get_user
// Source: https://mcp.linear.app/sse
export const get_userToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Retrieve details of a specific Linear user",
    inputSchema: z
      .object({
        query: z.string().describe("The UUID or name of the user to retrieve"),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "get_user",
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
