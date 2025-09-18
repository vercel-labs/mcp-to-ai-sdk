import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: list_project_labels
// Source: https://mcp.linear.app/sse
export const list_project_labelsToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "List available project labels in the Linear workspace",
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
        name: z.string().describe("Filter by label name").optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "list_project_labels",
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
