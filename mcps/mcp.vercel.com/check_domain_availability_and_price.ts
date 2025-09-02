import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: check_domain_availability_and_price
// Source: https://mcp.vercel.com
export const check_domain_availability_and_priceToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description:
      "Check if domain names are available for purchase and get pricing information",
    inputSchema: z
      .object({
        names: z
          .array(z.string().min(1))
          .min(1)
          .max(10)
          .describe(
            `Array of domain names to check availability for (e.g., ["example.com", "test.org"])`,
          ),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "check_domain_availability_and_price",
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
