import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: list_cycles
// Source: https://mcp.linear.app/sse
export const list_cyclesToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Retrieve cycles for a specific Linear team",
    inputSchema: z
      .object({
        teamId: z.string().describe("The team ID"),
        type: z
          .enum(["current", "previous", "next"])
          .describe(
            `Retrieve the current, previous, next, or all cycles. If no type is provided all cycles in the team will be returned`,
          )
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "list_cycles",
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
