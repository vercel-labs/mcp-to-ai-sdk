import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: get_project
// Source: https://mcp.vercel.com
export const get_projectToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Get a specific project in Vercel",
    inputSchema: z
      .object({
        projectId: z.string()
          .describe(`The project ID to get the deployment events for. Alternatively the project slug can be used.
Project IDs start with "prj_".
If you do not know the project ID or slug, it can be found through these mechanism:
- Read the file .vercel/project.json if it exists and extract the projectId
- Use the \`list_projects\` tool`),
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
        name: "get_project",
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
