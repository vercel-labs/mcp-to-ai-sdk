import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: list_deployments
// Source: https://mcp.vercel.com
export const list_deploymentsToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "List all deployments for a project",
    inputSchema: z
      .object({
        projectId: z
          .string()
          .describe("The project ID to list deployments for."),
        teamId: z.string().describe("The team ID to list deployments for."),
        since: z
          .number()
          .describe("Get deployments created after this timestamp.")
          .optional(),
        until: z
          .number()
          .describe("Get deployments created before this timestamp.")
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "list_deployments",
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
