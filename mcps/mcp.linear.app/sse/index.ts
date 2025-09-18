// Auto-generated index file for MCP tools
// Source: https://mcp.linear.app/sse
import { getMcpClient } from "./client.js";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { list_commentsToolWithClient } from "./list_comments.js";
import { create_commentToolWithClient } from "./create_comment.js";
import { list_cyclesToolWithClient } from "./list_cycles.js";
import { get_documentToolWithClient } from "./get_document.js";
import { list_documentsToolWithClient } from "./list_documents.js";
import { get_issueToolWithClient } from "./get_issue.js";
import { list_issuesToolWithClient } from "./list_issues.js";
import { create_issueToolWithClient } from "./create_issue.js";
import { update_issueToolWithClient } from "./update_issue.js";
import { list_issue_statusesToolWithClient } from "./list_issue_statuses.js";
import { get_issue_statusToolWithClient } from "./get_issue_status.js";
import { list_issue_labelsToolWithClient } from "./list_issue_labels.js";
import { create_issue_labelToolWithClient } from "./create_issue_label.js";
import { list_projectsToolWithClient } from "./list_projects.js";
import { get_projectToolWithClient } from "./get_project.js";
import { create_projectToolWithClient } from "./create_project.js";
import { update_projectToolWithClient } from "./update_project.js";
import { list_project_labelsToolWithClient } from "./list_project_labels.js";
import { list_teamsToolWithClient } from "./list_teams.js";
import { get_teamToolWithClient } from "./get_team.js";
import { list_usersToolWithClient } from "./list_users.js";
import { get_userToolWithClient } from "./get_user.js";
import { search_documentationToolWithClient } from "./search_documentation.js";

// Exports using a default client
export const mcpLinearTools = {
  list_comments: list_commentsToolWithClient(getMcpClient),
  create_comment: create_commentToolWithClient(getMcpClient),
  list_cycles: list_cyclesToolWithClient(getMcpClient),
  get_document: get_documentToolWithClient(getMcpClient),
  list_documents: list_documentsToolWithClient(getMcpClient),
  get_issue: get_issueToolWithClient(getMcpClient),
  list_issues: list_issuesToolWithClient(getMcpClient),
  create_issue: create_issueToolWithClient(getMcpClient),
  update_issue: update_issueToolWithClient(getMcpClient),
  list_issue_statuses: list_issue_statusesToolWithClient(getMcpClient),
  get_issue_status: get_issue_statusToolWithClient(getMcpClient),
  list_issue_labels: list_issue_labelsToolWithClient(getMcpClient),
  create_issue_label: create_issue_labelToolWithClient(getMcpClient),
  list_projects: list_projectsToolWithClient(getMcpClient),
  get_project: get_projectToolWithClient(getMcpClient),
  create_project: create_projectToolWithClient(getMcpClient),
  update_project: update_projectToolWithClient(getMcpClient),
  list_project_labels: list_project_labelsToolWithClient(getMcpClient),
  list_teams: list_teamsToolWithClient(getMcpClient),
  get_team: get_teamToolWithClient(getMcpClient),
  list_users: list_usersToolWithClient(getMcpClient),
  get_user: get_userToolWithClient(getMcpClient),
  search_documentation: search_documentationToolWithClient(getMcpClient),
} as const;

export const mcpLinearToolsWithClient = (client: Promise<Client> | Client) =>
  ({
    list_comments: list_commentsToolWithClient(() => client),
    create_comment: create_commentToolWithClient(() => client),
    list_cycles: list_cyclesToolWithClient(() => client),
    get_document: get_documentToolWithClient(() => client),
    list_documents: list_documentsToolWithClient(() => client),
    get_issue: get_issueToolWithClient(() => client),
    list_issues: list_issuesToolWithClient(() => client),
    create_issue: create_issueToolWithClient(() => client),
    update_issue: update_issueToolWithClient(() => client),
    list_issue_statuses: list_issue_statusesToolWithClient(() => client),
    get_issue_status: get_issue_statusToolWithClient(() => client),
    list_issue_labels: list_issue_labelsToolWithClient(() => client),
    create_issue_label: create_issue_labelToolWithClient(() => client),
    list_projects: list_projectsToolWithClient(() => client),
    get_project: get_projectToolWithClient(() => client),
    create_project: create_projectToolWithClient(() => client),
    update_project: update_projectToolWithClient(() => client),
    list_project_labels: list_project_labelsToolWithClient(() => client),
    list_teams: list_teamsToolWithClient(() => client),
    get_team: get_teamToolWithClient(() => client),
    list_users: list_usersToolWithClient(() => client),
    get_user: get_userToolWithClient(() => client),
    search_documentation: search_documentationToolWithClient(() => client),
  }) as const;

// Individual tool exports
export const list_commentsTool = list_commentsToolWithClient(getMcpClient);
export const create_commentTool = create_commentToolWithClient(getMcpClient);
export const list_cyclesTool = list_cyclesToolWithClient(getMcpClient);
export const get_documentTool = get_documentToolWithClient(getMcpClient);
export const list_documentsTool = list_documentsToolWithClient(getMcpClient);
export const get_issueTool = get_issueToolWithClient(getMcpClient);
export const list_issuesTool = list_issuesToolWithClient(getMcpClient);
export const create_issueTool = create_issueToolWithClient(getMcpClient);
export const update_issueTool = update_issueToolWithClient(getMcpClient);
export const list_issue_statusesTool =
  list_issue_statusesToolWithClient(getMcpClient);
export const get_issue_statusTool =
  get_issue_statusToolWithClient(getMcpClient);
export const list_issue_labelsTool =
  list_issue_labelsToolWithClient(getMcpClient);
export const create_issue_labelTool =
  create_issue_labelToolWithClient(getMcpClient);
export const list_projectsTool = list_projectsToolWithClient(getMcpClient);
export const get_projectTool = get_projectToolWithClient(getMcpClient);
export const create_projectTool = create_projectToolWithClient(getMcpClient);
export const update_projectTool = update_projectToolWithClient(getMcpClient);
export const list_project_labelsTool =
  list_project_labelsToolWithClient(getMcpClient);
export const list_teamsTool = list_teamsToolWithClient(getMcpClient);
export const get_teamTool = get_teamToolWithClient(getMcpClient);
export const list_usersTool = list_usersToolWithClient(getMcpClient);
export const get_userTool = get_userToolWithClient(getMcpClient);
export const search_documentationTool =
  search_documentationToolWithClient(getMcpClient);
