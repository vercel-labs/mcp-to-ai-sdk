import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: create_project
// Source: https://mcp.linear.app/sse
export const create_projectToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Create a new project in Linear",
    inputSchema: z
      .object({
        name: z.string().describe("A descriptive name of the project"),
        summary: z
          .string()
          .describe(
            "A concise plaintext summary of the project (max 255 chars)",
          )
          .optional(),
        description: z
          .string()
          .describe("The full project description in Markdown format")
          .optional(),
        state: z.string().describe("The state of the project").optional(),
        startDate: z
          .string()
          .describe("The start date of the project in ISO format")
          .optional(),
        targetDate: z
          .string()
          .describe("The target date of the project in ISO format")
          .optional(),
        team: z.string().describe("The team name or ID"),
        labels: z
          .array(z.string())
          .describe("Array of labels or IDs to set on the project")
          .optional(),
        lead: z
          .string()
          .describe('The user to assign (User ID, name, email, or "me")')
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "create_project",
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
