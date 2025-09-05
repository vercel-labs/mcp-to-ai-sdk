import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: get_deployment
// Source: https://mcp.vercel.com
export const get_deploymentToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Get a specific deployment by ID or URL.",
    inputSchema: z
      .object({
        idOrUrl: z
          .string()
          .describe("The unique identifier or hostname of the deployment."),
        teamId: z.string()
          .describe(`The team ID to get the deployment events for. Alternatively the team slug can be used.
Team IDs start with "team_".
If you do not know the team ID or slug, it can be found through these mechanism:
- Read the file .vercel/project.json if it exists and extract the orgId
- Use the \`list_teams\` tool`),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "get_deployment",
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
