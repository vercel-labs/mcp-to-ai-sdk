import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: search
// Source: https://mcp.notion.com/mcp
export const searchToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `Perform a search over:
- "internal": Perform a semantic search over your entire Notion workspace and connected
sources (Slack, Google Drive, Github, Jira, Microsoft Teams, Sharepoint, OneDrive, or
Linear).
- "users": Perform a search over the Notion users in the current workspace.
You can use search when you need to find information which is not already available via
other tools, and you don't know where it's located.
If the user doesn't have access to Notion AI features, the search will automatically fall
back to a workspace search that doesn't use AI or include connected sources. This will be
indicated by the "type" field in the response being "workspace_search" instead of
"ai_search".
Do NOT use search to get information about a Database's integrations, views, or other
components.
If initial results do not contain all the information you need, you can try more specific
queries.
After obtaining internal search results, if the user asks for the full contents of a page or
database, use the "fetch" tool. This tool only shows some details like a highlight and the
URL and title of each search result.
To find pages under a Notion database, use this tool and supply the database's URL as the
data_source_url parameter. These look like "collection://f336d0bc-b841-465b-8045-024475c079dd".
You can get this URL by using the "fetch" tool to view the database and copying the URL from
the <data-source url="..."> block. Keep in mind that Notion-flavored Markdown has this
concept of a hierarchy of <database> blocks that contain <data-source> blocks, but users
aren't familiar with the Notion "Data Source" terminology or product. Prefer to refer to
both of them as "databases" in your response to humans to avoid confusion.
Examples of searches:
1. Search for information across the workspace:
{
"query": "quarterly revenue report",
"query_type": "internal"
}
2. Search within a specific page and its children:
{
"query": "meeting notes action items",
"query_type": "internal",
"page_url": "https://www.notion.so/workspace/Team-Hub-1234567890abcdef"
}
3. Search within a database's pages:
{
"query": "design review feedback",
"query_type": "internal",
"data_source_url": "collection://f336d0bc-b841-465b-8045-024475c079dd"
}
4. Search within a specific teamspace:
{
"query": "project updates",
"query_type": "internal",
"teamspace_id": "f336d0bc-b841-465b-8045-024475c079dd"
}
5. Search for users:
{
"query": "john@example.com",
"query_type": "user"
}
6. Find users by partial name:
{
"query": "sarah",
"query_type": "user"
}
Common use cases:
- "What does the sales team require from the product team in the next quarter?"
- "Find all meeting notes that mention the new pricing strategy"
- "Which pages discuss the API migration project?"
- "Find all team members with email addresses ending in @design.company.com"
- "What are the latest updates on the mobile app redesign?"`,
    inputSchema: z
      .object({
        query: z.string().min(1)
          .describe(`Semantic search query over your entire Notion workspace and connected sources
(Slack, Google Drive, Github, Jira, Microsoft Teams, Sharepoint, OneDrive,
or Linear). For best results, don't provide more than one question per tool call.
Use a separate "search" tool call for each search you want to perform.
Alternatively, the query can be a substring or keyword to find users by matching
against their name or email address. For example: "john" or "john@example.com"`),
        query_type: z
          .enum(["internal", "user"])
          .describe(
            `Specify type of the query as either "internal" or "user". Always include this input if performing
"user" search.`,
          )
          .optional(),
        data_source_url: z
          .string()
          .describe(
            `Optionally, provide the URL of a Data source to search. This will perform a semantic search over
the pages in the Data Source. Note: must be a Data Source, not a Database. <data-source> tags are
part of the Notion flavored Markdown format returned by tools like fetch. The full spec is
available in the create-pages tool description.`,
          )
          .optional(),
        page_url: z
          .string()
          .describe(
            `Optionally, provide the URL or ID of a page to search within. This will perform a semantic search
over the content within and under the specified page. Accepts either a full page URL
(e.g. https://notion.so/workspace/Page-Title-1234567890) or just the page ID (UUIDv4) with or
without dashes.`,
          )
          .optional(),
        teamspace_id: z
          .string()
          .describe(
            `Optionally, provide the ID of a teamspace to restrict search results to. This will perform a search
over content within the specified teamspace only. Accepts the teamspace ID (UUIDv4) with or
without dashes.`,
          )
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "search",
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
