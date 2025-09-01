import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: hf_whoami
// Source: https://huggingface.co/mcp
export const hf_whoamiToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description:
      "Hugging Face tools are being used anonymously and may be rate limited. Call this tool for instructions on joining and authenticating.",
    inputSchema: z.object({}).strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "hf_whoami",
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
