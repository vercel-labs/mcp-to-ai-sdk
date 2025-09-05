import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: web_fetch_vercel_url
// Source: https://mcp.vercel.com
export const web_fetch_vercel_urlToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `Fetches a Vercel deployment URL and returns the response.
  This is useful if another web fetch tool returns 401 (Unauthorized) or 403 (Forbidden) for a Vercel URL.
  Supports accessing deployments protected with Vercel Authentication which the user of this MCP server has access to.`,
    inputSchema: z
      .object({
        url: z
          .string()
          .describe(
            `The full URL of the Vercel deployment including the path (e.g. "https://myapp.vercel.app/my-page").`,
          ),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "web_fetch_vercel_url",
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
