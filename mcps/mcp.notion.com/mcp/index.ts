// Auto-generated index file for MCP tools
// Source: https://mcp.notion.com/mcp
import { getMcpClient } from "./client.js";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { searchToolWithClient } from "./search.js";
import { fetchToolWithClient } from "./fetch.js";
import { notioncreatepagesToolWithClient } from "./notioncreatepages.js";
import { notionupdatepageToolWithClient } from "./notionupdatepage.js";
import { notionmovepagesToolWithClient } from "./notionmovepages.js";
import { notionduplicatepageToolWithClient } from "./notionduplicatepage.js";
import { notioncreatedatabaseToolWithClient } from "./notioncreatedatabase.js";
import { notionupdatedatabaseToolWithClient } from "./notionupdatedatabase.js";
import { notioncreatecommentToolWithClient } from "./notioncreatecomment.js";
import { notiongetcommentsToolWithClient } from "./notiongetcomments.js";
import { notiongetusersToolWithClient } from "./notiongetusers.js";
import { notiongetselfToolWithClient } from "./notiongetself.js";
import { notiongetuserToolWithClient } from "./notiongetuser.js";

// Exports using a default client
export const mcpNotionTools = {
  search: searchToolWithClient(getMcpClient),
  fetch: fetchToolWithClient(getMcpClient),
  notioncreatepages: notioncreatepagesToolWithClient(getMcpClient),
  notionupdatepage: notionupdatepageToolWithClient(getMcpClient),
  notionmovepages: notionmovepagesToolWithClient(getMcpClient),
  notionduplicatepage: notionduplicatepageToolWithClient(getMcpClient),
  notioncreatedatabase: notioncreatedatabaseToolWithClient(getMcpClient),
  notionupdatedatabase: notionupdatedatabaseToolWithClient(getMcpClient),
  notioncreatecomment: notioncreatecommentToolWithClient(getMcpClient),
  notiongetcomments: notiongetcommentsToolWithClient(getMcpClient),
  notiongetusers: notiongetusersToolWithClient(getMcpClient),
  notiongetself: notiongetselfToolWithClient(getMcpClient),
  notiongetuser: notiongetuserToolWithClient(getMcpClient),
} as const;

export const mcpNotionToolsWithClient = (client: Promise<Client> | Client) =>
  ({
    search: searchToolWithClient(() => client),
    fetch: fetchToolWithClient(() => client),
    notioncreatepages: notioncreatepagesToolWithClient(() => client),
    notionupdatepage: notionupdatepageToolWithClient(() => client),
    notionmovepages: notionmovepagesToolWithClient(() => client),
    notionduplicatepage: notionduplicatepageToolWithClient(() => client),
    notioncreatedatabase: notioncreatedatabaseToolWithClient(() => client),
    notionupdatedatabase: notionupdatedatabaseToolWithClient(() => client),
    notioncreatecomment: notioncreatecommentToolWithClient(() => client),
    notiongetcomments: notiongetcommentsToolWithClient(() => client),
    notiongetusers: notiongetusersToolWithClient(() => client),
    notiongetself: notiongetselfToolWithClient(() => client),
    notiongetuser: notiongetuserToolWithClient(() => client),
  }) as const;

// Individual tool exports
export const searchTool = searchToolWithClient(getMcpClient);
export const fetchTool = fetchToolWithClient(getMcpClient);
export const notioncreatepagesTool =
  notioncreatepagesToolWithClient(getMcpClient);
export const notionupdatepageTool =
  notionupdatepageToolWithClient(getMcpClient);
export const notionmovepagesTool = notionmovepagesToolWithClient(getMcpClient);
export const notionduplicatepageTool =
  notionduplicatepageToolWithClient(getMcpClient);
export const notioncreatedatabaseTool =
  notioncreatedatabaseToolWithClient(getMcpClient);
export const notionupdatedatabaseTool =
  notionupdatedatabaseToolWithClient(getMcpClient);
export const notioncreatecommentTool =
  notioncreatecommentToolWithClient(getMcpClient);
export const notiongetcommentsTool =
  notiongetcommentsToolWithClient(getMcpClient);
export const notiongetusersTool = notiongetusersToolWithClient(getMcpClient);
export const notiongetselfTool = notiongetselfToolWithClient(getMcpClient);
export const notiongetuserTool = notiongetuserToolWithClient(getMcpClient);
