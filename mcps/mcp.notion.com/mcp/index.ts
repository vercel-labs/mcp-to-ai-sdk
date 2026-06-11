// Auto-generated index file for MCP tools
// Source: https://mcp.notion.com/mcp
import { getMcpClient } from "./client";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { searchToolWithClient } from "./search";
import { fetchToolWithClient } from "./fetch";
import { notioncreatepagesToolWithClient } from "./notioncreatepages";
import { notionupdatepageToolWithClient } from "./notionupdatepage";
import { notionmovepagesToolWithClient } from "./notionmovepages";
import { notionduplicatepageToolWithClient } from "./notionduplicatepage";
import { notioncreatedatabaseToolWithClient } from "./notioncreatedatabase";
import { notionupdatedatabaseToolWithClient } from "./notionupdatedatabase";
import { notioncreatecommentToolWithClient } from "./notioncreatecomment";
import { notiongetcommentsToolWithClient } from "./notiongetcomments";
import { notiongetusersToolWithClient } from "./notiongetusers";
import { notiongetselfToolWithClient } from "./notiongetself";
import { notiongetuserToolWithClient } from "./notiongetuser";

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
