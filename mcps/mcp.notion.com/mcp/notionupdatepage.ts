import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: notion-update-page
// Source: https://mcp.notion.com/mcp
export const notionupdatepageToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `Update a Notion page's properties or content.
Notion page properties are a JSON map of property names to SQLite values.
For pages in a database, use the SQLite schema definition shown in <database>.
For pages outside of a database, the only allowed property is "title", which is the title of the page in inline markdown format.
Notion page content is a string in Notion-flavored Markdown format. See the "create-pages" tool description for the full enhanced Markdown spec.
Before updating a page's content with this tool, use the "fetch" tool first to get the existing content to find out the Markdown snippets to use in the "replace_content_range" or "insert_content_after" commands.
IMPORTANT: Some property types require expanded formats:
- Date properties: Split into "date:{property}:start", "date:{property}:end" (optional), and "date:{property}:is_datetime" (0 or 1)
- Place properties: Split into "place:{property}:name", "place:{property}:address", "place:{property}:latitude", "place:{property}:longitude", and "place:{property}:google_place_id" (optional)
Number properties accept JavaScript numbers (not strings). Use null to remove a property's value. Boolean values like "__YES__" are supported for checkbox properties.
Examples:
(1) Update page properties:
{
"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
"command": "update_properties",
"properties": {
"title": "New Page Title",
"status": "In Progress",
"priority": 5,
"checkbox": "__YES__",
"date:deadline:start": "2024-12-25",
"date:deadline:is_datetime": 0,
"place:office:name": "HQ",
"place:office:latitude": 37.7749,
"place:office:longitude": -122.4194
}
}
(2) Replace the entire content of a page:
{
"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
"command": "replace_content",
"new_str": "# New Section
Updated content goes here"
}
(3) Replace specific content in a page:
{
"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
"command": "replace_content_range",
"selection_with_ellipsis": "# Old Section...end of section",
"new_str": "# New Section
Updated content goes here"
}
(4) Insert content after specific text:
{
"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
"command": "insert_content_after",
"selection_with_ellipsis": "## Previous section...",
"new_str": "
## New Section
Content to insert goes here"
}
Note: For selection_with_ellipsis, provide only the first ~10 characters, an ellipsis, and the last ~10 characters. Ensure the selection is unique; use longer snippets if needed to avoid ambiguity.`,
    inputSchema: z
      .object({
        data: z
          .intersection(
            z.object({
              page_id: z
                .string()
                .describe(
                  "The ID of the page to update, with or without dashes.",
                ),
            }),
            z.union([
              z
                .object({
                  command: z.literal("update_properties"),
                  properties: z.record(
                    z.union([z.string(), z.number(), z.null()]),
                  ).describe(`A JSON object that updates the page's properties.
For pages in a database, use the SQLite schema definition shown in <database>.
For pages outside of a database, the only allowed property is "title", which is the title of the page in inline markdown format.
Use null to remove a property's value.`),
                })
                .strict(),
              z
                .object({
                  command: z.literal("replace_content"),
                  new_str: z
                    .string()
                    .describe("The new string to replace all content with."),
                })
                .strict(),
              z
                .object({
                  command: z.literal("replace_content_range"),
                  selection_with_ellipsis: z.string()
                    .describe(`Unique start and end snippet of the string to replace in the page content, including whitespace.
DO NOT provide the entire string to replace. Instead, provide up to the first ~10 characters of the string to replace, an ellipsis, and then up to the last ~10 characters of the string to replace.
Make sure you provide enough of the start and end snippet to uniquely identify the string to replace.
For example, to replace an entire section, use "old_start_and_end_snippet":"# Section heading...last paragraph."`),
                  new_str: z
                    .string()
                    .describe("The new string to replace the old string with."),
                })
                .strict(),
              z
                .object({
                  command: z.literal("insert_content_after"),
                  selection_with_ellipsis: z.string()
                    .describe(`Unique start and end snippet of the string to match in the page content, including whitespace.
DO NOT provide the entire string to match. Instead, provide up to the first ~10 characters of the string to match, an ellipsis, and then up to the last ~10 characters of the string to match.
Make sure you provide enough of the start and end snippet to uniquely identify the string to match.
For example, to match an entire section, use "selection_with_ellipsis":"# Section heading...last paragraph."`),
                  new_str: z.string().describe("The new content to insert."),
                })
                .strict(),
            ]),
          )
          .describe("The data required for updating a page"),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "notion-update-page",
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
