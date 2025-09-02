import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: notion-create-pages
// Source: https://mcp.notion.com/mcp
export const notioncreatepagesToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `Creates one or more Notion pages with specified properties and content.
Use "create-pages" when you need to create one or more new pages that don't exist yet.
Always include a title property under \`properties\` in each entry of the \`pages\` array.
Otherwise, the page title will appear blank even if the page content is populated. Don't
duplicate the page title at the top of the page's \`content\`.
When creating pages under a Notion database, the property names must match the database's
schema. Use the "fetch" tool with a Notion database URL to get the database schema. Or, look
for existing pages under the database using the "search" tool then use the "fetch" tool to see
the names of the property keys. One exception is the "title" property, which all pages have,
but can be named differently in the schema of a database. For convenience, you can use the
generic property name "title" in the "properties" object, and it will automatically be
re-mapped to the actual name of the title property in the database schema when creating the
page.
All pages created with a single call to this tool will have the same parent.
The parent can be a Notion page or database. If the parent is omitted, the pages will be
created as standalone, workspace-level private pages and the person that created them
can organize them as they see fit later.
IMPORTANT: When specifying a parent database, use the appropriate ID format:
- Use "data_source_id" when you have a collection:// URL from the fetch tool (this is the most common case)
- Use "database_id" when you have a page URL for a database view (less common)
- Use "page_id" when the parent is a regular page
Examples of creating pages:
1. Create a standalone page with a title and content:
{
"pages": [
{
"properties": {"title":"Page title"},
"content": "# Section 1
Section 1 content
# Section 2
Section 2 content"
}
]
}
2. Create a page under a database's data source (collection), e.g. using an ID from a collection:// URL provided by the fetch tool:
{
"parent": {"data_source_id": "f336d0bc-b841-465b-8045-024475c079dd"},
"pages": [
{
"properties": {
"Task Name": "Task 123",
"Status": "In Progress",
},
},
],
}
3. Create a page with an existing page as a parent:
{
"parent": {"page_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"},
"pages": [
{
"properties": {"title": "Page title"},
"content": "# Section 1
Section 1 content
# Section 2
Section 2 content"
}
]
}
The enhanced Markdown format used for page content is a superset of the standard Markdown
syntax. Here is the full spec, but please note that Notion does not yet use the Data Source
terminology, and only supports Databases. Ignore anything related to "data sources" and assume
databases can only define one schema for now.
### Notion-flavored Markdown
Notion-flavored Markdown is a variant of standard Markdown with additional features to support all Block and Rich text types.
Use tabs for indentation.
Use backslashes to escape characters. For example, * will render as * and not as a bold delimiter.
Block types:
Markdown blocks use a {color="Color"} attribute list to set a block color.
Text:
Rich text {color="Color"}
Children
Headings:
# Rich text {color="Color"}
## Rich text {color="Color"}
### Rich text {color="Color"}
(Headings 4, 5, and 6 are not supported in Notion and will be converted to heading 3.)
Bulleted list:
- Rich text {color="Color"}
Children
Numbered list:
1. Rich text {color="Color"}
Children
Rich text types:
Bold:
**Rich text**
Italic:
*Rich text*
Strikethrough:
~~Rich text~~
Underline:
<span underline="true">Rich text</span>
Inline code:
\`Code\`
Link:
[Link text](URL)
Citation:
[^URL]
To create a citation, you can either reference a compressed URL like [^{{1}}], or a full URL like [^https://example.com].
Colors:
<span color?="Color">Rich text</span>
Inline math:
$Equation$ or $\`Equation\`$ if you want to use markdown delimiters within the equation.
There must be whitespace before the starting $ symbol and after the ending $ symbol. There must not be whitespace right after the starting $ symbol or before the ending $ symbol.
Inline line breaks within rich text:
<br>
Mentions:
User:
<mention-user url="{{URL}}">User name</mention-user>
The URL must always be provided, and refer to an existing User.
But Providing the user name is optional. In the UI, the name will always be displayed.
So an alternative self-closing format is also supported: <mention-user url="{{URL}}"/>
Page:
<mention-page url="{{URL}}">Page title</mention-page>
The URL must always be provided, and refer to an existing Page.
Providing the page title is optional. In the UI, the title will always be displayed.
Mentioned pages can be viewed using the "view" tool.
Database:
<mention-database url="{{URL}}">Database name</mention-database>
The URL must always be provided, and refer to an existing Database.
Providing the database name is optional. In the UI, the name will always be displayed.
Mentioned databases can be viewed using the "view" tool.
Date:
<mention-date start="YYYY-MM-DD" end="YYYY-MM-DD"/>
Datetime:
<mention-date start="YYYY-MM-DDThh:mm:ssZ" end="YYYY-MM-DDThh:mm:ssZ"/>
Custom emoji:
:emoji_name:
Custom emoji are rendered as the emoji name surrounded by colons.
Colors:
Text colors (colored text with transparent background):
gray, brown, orange, yellow, green, blue, purple, pink, red
Background colors (colored background with contrasting text):
gray_bg, brown_bg, orange_bg, yellow_bg, green_bg, blue_bg, purple_bg, pink_bg, red_bg
Usage:
- Block colors: Add color="Color" to the first line of any block
- Rich text colors (text colors and background colors are both supported): Use <span color="Color">Rich text</span>
#### Advanced Block types for Page content
The following block types may only be used in page content.
<advanced-blocks>
Quote:
> Rich text {color="Color"}
Children
To-do:
- [ ] Rich text {color="Color"}
Children
- [x] Rich text {color="Color"}
Children
Toggle:
▶ Rich text {color="Color"}
Children
Toggle heading 1:
▶# Rich text {color="Color"}
Children
Toggle heading 2:
▶## Rich text {color="Color"}
Children
Toggle heading 3:
▶### Rich text {color="Color"}
Children
For toggles and toggle headings, the children must be indented in order for them to be toggleable. If you do not indent the children, they will not be contained within the toggle or toggle heading.
Divider:
---
Table:
<table fit-page-width?="true|false" header-row?="true|false" header-column?="true|false">
<colgroup>
<col color?="Color">
<col color?="Color">
</colgroup>
<tr color?="Color">
<td>Data cell</td>
<td color?="Color">Data cell</td>
</tr>
<tr>
<td>Data cell</td>
<td>Data cell</td>
</tr>
</table>
Note: All table attributes are optional. If omitted, they default to false.
Table structure:
- <table>: Root element with optional attributes:
- fit-page-width: Whether the table should fill the page width
- header-row: Whether the first row is a header
- header-column: Whether the first column is a header
- <colgroup>: Optional element defining column-wide styles
- <col>: Column definition with optional attributes:
- color: The color of the column
- width: The width of the column. Leave empty to auto-size.
- <tr>: Table row with optional color attribute
- <td>: Data cell with optional color attribute
Color precedence (highest to lowest):
1. Cell color (<td color="red">)
2. Row color (<tr color="blue_bg">)
3. Column color (<col color="gray">)
Equation:
$$
Equation
$$
Code:
\`\`\`language
Code
\`\`\`
XML blocks use the "color" attribute to set a block color.
Callout:
<callout icon?="emoji" color?="Color">
Children
</callout>
Columns:
<columns>
<column>
Children
</column>
<column>
Children
</column>
</columns>
Page:
<page url="{{URL}}" color?="Color">Title</page>
Sub-pages can be viewed using the "view" tool.
To create a new sub-page, omit the URL. You can then update the page content and properties with the "update-page" tool. Example: <page>New Page</page>
Database:
<database url="{{URL}}" inline?="{true|false}" color?="Color">Title</database>
To create a new database, omit the URL. You can then update the database properties and content with the "update-database" tool. Example: <database>New Database</database>
The "inline" toggles how the database is displayed in the UI. If it is true, the database is fully visible and interactive on the page. If false, the database is displayed as a sub-page.
There is no "Data Source" block type. Data Sources are always inside a Database, and only Databases can be inserted into a Page.
Audio:
<audio source="{{URL}}" color?="Color">Caption</audio>
File:
File content can be viewed using the "view" tool.
<file source="{{URL}}" color?="Color">Caption</file>
Image:
Image content can be viewed using the "view" tool.
<image source="{{URL}}" color?="Color">Caption</image>
PDF:
PDF content can be viewed using the "view" tool.
<pdf source="{{URL}}" color?="Color">Caption</pdf>
Video:
<video source="{{URL}}" color?="Color">Caption</video>
Table of contents:
<table_of_contents color?="Color"/>
Synced block:
The original source for a synced block.
When creating a new synced block, do not provide the URL. After inserting the synced block into a page, the URL will be provided.
<synced_block url?="{{URL}}">
Children
</synced_block>
Note: When creating new synced blocks, omit the url attribute - it will be auto-generated. When reading existing synced blocks, the url attribute will be present.
Synced block reference:
A reference to a synced block.
The synced block must already exist and url must be provided.
You can directly update the children of the synced block reference and it will update both the original synced block and the synced block reference.
<synced_block_reference url="{{URL}}">
Children
</synced_block_reference>
Meeting notes:
<meeting-notes>
Rich text (meeting title)
<summary>
AI-generated summary of the notes + transcript
</summary>
<notes>
User notes
</notes>
<transcript>
Transcript of the audio (cannot be edited)
</transcript>
</meeting-notes>
Note: The <transcript> tag contains a raw transcript and cannot be edited.
Unknown (a block type that is not supported in the API yet):
<unknown url="{{URL}}" alt="Alt"/>
</advanced-blocks>`,
    inputSchema: z
      .object({
        pages: z
          .array(
            z
              .object({
                properties: z
                  .record(z.union([z.string(), z.number(), z.null()]))
                  .describe(
                    `The properties of the new page, which is a JSON map of property names to SQLite values.
For pages in a database, use the SQLite schema definition shown in <database>.
For pages outside of a database, the only allowed property is "title", which is the title of the page and is automatically shown at the top of the page as a large heading.`,
                  )
                  .optional(),
                content: z
                  .string()
                  .describe(
                    "The content of the new page, using Notion Markdown.",
                  )
                  .optional(),
              })
              .strict(),
          )
          .max(100)
          .describe("The pages to create."),
        parent: z
          .union([
            z
              .object({
                page_id: z
                  .string()
                  .describe(
                    `The ID of the parent page (with or without dashes), for example, 195de9221179449fab8075a27c979105`,
                  ),
                type: z.literal("page_id").optional(),
              })
              .strict(),
            z
              .object({
                database_id: z
                  .string()
                  .describe(
                    `The ID of the parent database (with or without dashes), for example, 195de9221179449fab8075a27c979105`,
                  ),
                type: z.literal("database_id").optional(),
              })
              .strict(),
            z
              .object({
                data_source_id: z
                  .string()
                  .describe(
                    `The ID of the parent data source (collection), with or without dashes. For example, f336d0bc-b841-465b-8045-024475c079dd`,
                  ),
                type: z.literal("data_source_id").optional(),
              })
              .strict(),
          ])
          .describe(
            `The parent under which the new pages will be created. This can be a page (page_id), a database page (database_id), or a data source/collection under a database (data_source_id). If omitted, the new pages will be created as private pages at the workspace level. Use data_source_id when you have a collection:// URL from the fetch tool.`,
          )
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "notion-create-pages",
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
