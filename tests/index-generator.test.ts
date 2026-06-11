import assert from "node:assert/strict";
import test from "node:test";

import { generateIndexFile } from "../lib/index-generator.js";

test("generates extensionless imports for generated TypeScript siblings", () => {
  const generated = generateIndexFile(
    ["searchGitHub", "list_projects"],
    "https://mcp.grep.app",
  );

  assert.ok(generated.includes("from './client';"));
  assert.ok(generated.includes("from './searchGitHub';"));
  assert.ok(generated.includes("from './list_projects';"));

  assert.ok(!generated.includes("from './client.js';"));
  assert.ok(!generated.includes("from './searchGitHub.js';"));
  assert.ok(!generated.includes("from './list_projects.js';"));
  assert.ok(
    generated.includes("from '@modelcontextprotocol/sdk/client/index.js';"),
  );
});
