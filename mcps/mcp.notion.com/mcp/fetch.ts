import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: fetch
// Source: https://mcp.notion.com/mcp
export const fetchToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `Retrieves details about a Notion entity by its URL or ID.
You can fetch the following types of entities:
- Page, i.e. from a <page> block or a <mention-page> mention
- Database, i.e. from a <database> block or a <mention-database> mention
Use the "fetch" tool when you need to see the details of a Notion entity you already know
exists and have its URL or ID.
Provide the Notion entity's URL or ID in the \`id\` parameter. You must make multiple calls
to the "fetch" tool if you want to fetch multiple entities.
Content for pages that are returned use the enhanced Markdown format, which is a superset of
the standard Markdown syntax. See the full spec in the description of the "create-pages"
tool.
Databases can have multiple data sources, which are collections of pages with the same schema.
When fetching a database, the tool will return information about all its data sources.
Examples of fetching entities:
1. Fetch a page by URL:
{
"id": "https://www.notion.so/workspace/Product-Requirements-1234567890abcdef"
}
2. Fetch a page by ID (UUIDv4 with dashes):
{
"id": "12345678-90ab-cdef-1234-567890abcdef"
}
3. Fetch a page by ID (UUIDv4 without dashes):
{
"id": "1234567890abcdef1234567890abcdef"
}
4. Fetch a database:
{
"id": "https://www.notion.so/workspace/Projects-Database-abcdef1234567890"
}
Common use cases:
- "What are the product requirements still need to be implemented from this ticket
https://notion.so/page-url?"
- "Show me the details of the project database at this URL"
- "Get the content of page 12345678-90ab-cdef-1234-567890abcdef"`,
    inputSchema: z
      .object({
        id: z.string().describe("The ID or URL of the Notion page to fetch"),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "fetch",
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
