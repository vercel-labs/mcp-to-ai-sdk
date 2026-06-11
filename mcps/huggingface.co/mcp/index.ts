// Auto-generated index file for MCP tools
// Source: https://huggingface.co/mcp
import { getMcpClient } from "./client";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { hf_whoamiToolWithClient } from "./hf_whoami";
import { space_searchToolWithClient } from "./space_search";
import { model_searchToolWithClient } from "./model_search";
import { model_detailsToolWithClient } from "./model_details";
import { paper_searchToolWithClient } from "./paper_search";
import { dataset_searchToolWithClient } from "./dataset_search";
import { dataset_detailsToolWithClient } from "./dataset_details";
import { hf_doc_searchToolWithClient } from "./hf_doc_search";
import { gr1_flux1_schnell_inferToolWithClient } from "./gr1_flux1_schnell_infer";

// Exports using a default client
export const mcpHuggingfaceTools = {
  hf_whoami: hf_whoamiToolWithClient(getMcpClient),
  space_search: space_searchToolWithClient(getMcpClient),
  model_search: model_searchToolWithClient(getMcpClient),
  model_details: model_detailsToolWithClient(getMcpClient),
  paper_search: paper_searchToolWithClient(getMcpClient),
  dataset_search: dataset_searchToolWithClient(getMcpClient),
  dataset_details: dataset_detailsToolWithClient(getMcpClient),
  hf_doc_search: hf_doc_searchToolWithClient(getMcpClient),
  gr1_flux1_schnell_infer: gr1_flux1_schnell_inferToolWithClient(getMcpClient),
} as const;

export const mcpHuggingfaceToolsWithClient = (
  client: Promise<Client> | Client,
) =>
  ({
    hf_whoami: hf_whoamiToolWithClient(() => client),
    space_search: space_searchToolWithClient(() => client),
    model_search: model_searchToolWithClient(() => client),
    model_details: model_detailsToolWithClient(() => client),
    paper_search: paper_searchToolWithClient(() => client),
    dataset_search: dataset_searchToolWithClient(() => client),
    dataset_details: dataset_detailsToolWithClient(() => client),
    hf_doc_search: hf_doc_searchToolWithClient(() => client),
    gr1_flux1_schnell_infer: gr1_flux1_schnell_inferToolWithClient(
      () => client,
    ),
  }) as const;

// Individual tool exports
export const hf_whoamiTool = hf_whoamiToolWithClient(getMcpClient);
export const space_searchTool = space_searchToolWithClient(getMcpClient);
export const model_searchTool = model_searchToolWithClient(getMcpClient);
export const model_detailsTool = model_detailsToolWithClient(getMcpClient);
export const paper_searchTool = paper_searchToolWithClient(getMcpClient);
export const dataset_searchTool = dataset_searchToolWithClient(getMcpClient);
export const dataset_detailsTool = dataset_detailsToolWithClient(getMcpClient);
export const hf_doc_searchTool = hf_doc_searchToolWithClient(getMcpClient);
export const gr1_flux1_schnell_inferTool =
  gr1_flux1_schnell_inferToolWithClient(getMcpClient);
