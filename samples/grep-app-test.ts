import { config } from "dotenv";
import { generateText, stepCountIs } from "ai";
import { mcpGrepTools } from "../mcps/mcp.grep.app/index.js";

config({ path: ".env.local" });

async function main() {
  const result = await generateText({
    model: "moonshotai/kimi-k2",
    tools: mcpGrepTools,
    prompt:
      "Show me examples of React useState hooks for loading states.  Use the searchGitHub tool. Summarize the tool call as narural language",
    stopWhen: stepCountIs(2),
  });

  for (const message of result.response.messages) {
    if (message.role === "assistant") {
      for (const chunk of message.content) {
        if (typeof chunk === "string") {
          console.log(chunk);
        } else if (chunk.type === "text") {
          console.log(chunk.text);
        }
      }
    }
  }
}

main().catch(console.error);
