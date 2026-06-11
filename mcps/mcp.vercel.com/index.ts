// Auto-generated index file for MCP tools
// Source: https://mcp.vercel.com
import { getMcpClient } from "./client";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { search_vercel_documentationToolWithClient } from "./search_vercel_documentation";
import { deploy_to_vercelToolWithClient } from "./deploy_to_vercel";
import { list_projectsToolWithClient } from "./list_projects";
import { get_projectToolWithClient } from "./get_project";
import { list_deploymentsToolWithClient } from "./list_deployments";
import { get_deploymentToolWithClient } from "./get_deployment";
import { get_deployment_build_logsToolWithClient } from "./get_deployment_build_logs";
import { get_access_to_vercel_urlToolWithClient } from "./get_access_to_vercel_url";
import { web_fetch_vercel_urlToolWithClient } from "./web_fetch_vercel_url";
import { list_teamsToolWithClient } from "./list_teams";
import { check_domain_availability_and_priceToolWithClient } from "./check_domain_availability_and_price";

// Exports using a default client
export const mcpVercelTools = {
  search_vercel_documentation:
    search_vercel_documentationToolWithClient(getMcpClient),
  deploy_to_vercel: deploy_to_vercelToolWithClient(getMcpClient),
  list_projects: list_projectsToolWithClient(getMcpClient),
  get_project: get_projectToolWithClient(getMcpClient),
  list_deployments: list_deploymentsToolWithClient(getMcpClient),
  get_deployment: get_deploymentToolWithClient(getMcpClient),
  get_deployment_build_logs:
    get_deployment_build_logsToolWithClient(getMcpClient),
  get_access_to_vercel_url:
    get_access_to_vercel_urlToolWithClient(getMcpClient),
  web_fetch_vercel_url: web_fetch_vercel_urlToolWithClient(getMcpClient),
  list_teams: list_teamsToolWithClient(getMcpClient),
  check_domain_availability_and_price:
    check_domain_availability_and_priceToolWithClient(getMcpClient),
} as const;

export const mcpVercelToolsWithClient = (client: Promise<Client> | Client) =>
  ({
    search_vercel_documentation: search_vercel_documentationToolWithClient(
      () => client,
    ),
    deploy_to_vercel: deploy_to_vercelToolWithClient(() => client),
    list_projects: list_projectsToolWithClient(() => client),
    get_project: get_projectToolWithClient(() => client),
    list_deployments: list_deploymentsToolWithClient(() => client),
    get_deployment: get_deploymentToolWithClient(() => client),
    get_deployment_build_logs: get_deployment_build_logsToolWithClient(
      () => client,
    ),
    get_access_to_vercel_url: get_access_to_vercel_urlToolWithClient(
      () => client,
    ),
    web_fetch_vercel_url: web_fetch_vercel_urlToolWithClient(() => client),
    list_teams: list_teamsToolWithClient(() => client),
    check_domain_availability_and_price:
      check_domain_availability_and_priceToolWithClient(() => client),
  }) as const;

// Individual tool exports
export const search_vercel_documentationTool =
  search_vercel_documentationToolWithClient(getMcpClient);
export const deploy_to_vercelTool =
  deploy_to_vercelToolWithClient(getMcpClient);
export const list_projectsTool = list_projectsToolWithClient(getMcpClient);
export const get_projectTool = get_projectToolWithClient(getMcpClient);
export const list_deploymentsTool =
  list_deploymentsToolWithClient(getMcpClient);
export const get_deploymentTool = get_deploymentToolWithClient(getMcpClient);
export const get_deployment_build_logsTool =
  get_deployment_build_logsToolWithClient(getMcpClient);
export const get_access_to_vercel_urlTool =
  get_access_to_vercel_urlToolWithClient(getMcpClient);
export const web_fetch_vercel_urlTool =
  web_fetch_vercel_urlToolWithClient(getMcpClient);
export const list_teamsTool = list_teamsToolWithClient(getMcpClient);
export const check_domain_availability_and_priceTool =
  check_domain_availability_and_priceToolWithClient(getMcpClient);
