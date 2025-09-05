import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: get_access_to_vercel_url
// Source: https://mcp.vercel.com
export const get_access_to_vercel_urlToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `Creates a temporary shareable link that bypasses authentication for protected Vercel deployments.

  When you encounter a Vercel deployment URL (like https://myapp-abc123.vercel.app), 
  you might receive a 403 (Forbidden) error when trying to access it. 

  This tool generates a special URL with a '_vercel_share' parameter that allows temporary access 
  without requiring login credentials. The shareable URL will expire in 23 hours.
  
  When you use the returned URL, that URL will redirect and set an auth cookie.
  If your fetch implementation does not support cookies, use the 'web_fetch_vercel_url' tool instead.`,
    inputSchema: z
      .object({
        url: z
          .string()
          .describe(
            'The full URL of the Vercel deployment (e.g. "https://myapp.vercel.app").',
          ),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "get_access_to_vercel_url",
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
