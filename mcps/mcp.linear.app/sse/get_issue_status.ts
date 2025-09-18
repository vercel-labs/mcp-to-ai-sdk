import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: get_issue_status
// Source: https://mcp.linear.app/sse
export const get_issue_statusToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description:
      "Retrieve detailed information about an issue status in Linear by name or ID",
    inputSchema: z
      .object({
        id: z.string().describe("The ID of the issue status to retrieve"),
        name: z.string().describe("The name of the issue status to retrieve"),
        team: z.string().describe("The team name or ID"),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "get_issue_status",
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
