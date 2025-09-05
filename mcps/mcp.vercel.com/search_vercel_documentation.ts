import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: search_vercel_documentation
// Source: https://mcp.vercel.com
export const search_vercel_documentationToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `Search the Vercel documentation.
  
  Use this tool to answer any questions about Vercel’s platform, features, and best practices, including:
  - Core Concepts: Projects, Deployments, Git Integration, Preview Deployments, Environments
  - Frontend & Frameworks: Next.js, SvelteKit, Nuxt, Astro, Remix, frameworks configuration and optimization
  - APIs: REST API, Vercel SDK, Build Output API
  - Compute: Fluid Compute, Functions, Routing Middleware, Cron Jobs, OG Image Generation, Sandbox, Data Cache
  - AI: Vercel AI SDK, AI Gateway, MCP, v0
  - Performance & Delivery: Edge Network, Caching, CDN, Image Optimization, Headers, Redirects, Rewrites
  - Pricing: Plans, Spend Management, Billing
  - Security: Audit Logs, Firewall, Bot Management, BotID, OIDC, RBAC, Secure Compute, 2FA
  - Storage: Blog, Edge Config`,
    inputSchema: z
      .object({
        topic: z
          .string()
          .describe(
            "Topic to focus the documentation search on (e.g., 'routing', 'data-fetching').",
          ),
        tokens: z
          .number()
          .describe(
            "Maximum number of tokens to include in the result. Default is 2500.",
          )
          .default(2500),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "search_vercel_documentation",
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
