import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: notion-create-comment
// Source: https://mcp.notion.com/mcp
export const notioncreatecommentToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: "Add a comment to a page",
    inputSchema: z
      .object({
        parent: z
          .object({
            page_id: z.string(),
            type: z.literal("page_id").optional(),
          })
          .strict()
          .describe("The parent of the comment. This must be a page."),
        rich_text: z
          .array(
            z.intersection(
              z.object({
                annotations: z
                  .object({
                    bold: z
                      .boolean()
                      .describe("Whether the text is formatted as bold.")
                      .optional(),
                    italic: z
                      .boolean()
                      .describe("Whether the text is formatted as italic.")
                      .optional(),
                    strikethrough: z
                      .boolean()
                      .describe(
                        "Whether the text is formatted with a strikethrough.",
                      )
                      .optional(),
                    underline: z
                      .boolean()
                      .describe(
                        "Whether the text is formatted with an underline.",
                      )
                      .optional(),
                    code: z
                      .boolean()
                      .describe("Whether the text is formatted as code.")
                      .optional(),
                    color: z
                      .string()
                      .min(3)
                      .max(18)
                      .describe(
                        `One of: \`default\`, \`gray\`, \`brown\`, \`orange\`, \`yellow\`, \`green\`, \`blue\`, \`purple\`, \`pink\`, \`red\`, \`default_background\`, \`gray_background\`, \`brown_background\`, \`orange_background\`, \`yellow_background\`, \`green_background\`, \`blue_background\`, \`purple_background\`, \`pink_background\`, \`red_background\``,
                      )
                      .optional(),
                  })
                  .strict()
                  .optional(),
              }),
              z.union([
                z
                  .object({
                    type: z.literal("text").optional(),
                    text: z
                      .object({
                        content: z
                          .string()
                          .max(2000)
                          .describe("The actual text content of the text."),
                        link: z
                          .union([
                            z
                              .object({
                                url: z
                                  .string()
                                  .describe("The URL of the link."),
                              })
                              .strict(),
                            z.null(),
                          ])
                          .describe(
                            "An object with information about any inline link in this text, if included.",
                          )
                          .optional(),
                      })
                      .strict()
                      .describe(
                        `If a rich text object's type value is \`text\`, then the corresponding text field contains an object including the text content and any inline link.`,
                      ),
                  })
                  .strict(),
                z
                  .object({
                    type: z.literal("mention").optional(),
                    mention: z
                      .union([
                        z
                          .object({
                            type: z.literal("user").optional(),
                            user: z
                              .object({
                                id: z.string(),
                                object: z
                                  .literal("user")
                                  .describe("The user object type name.")
                                  .optional(),
                              })
                              .strict(),
                          })
                          .strict(),
                        z
                          .object({
                            type: z.literal("date").optional(),
                            date: z
                              .object({
                                start: z
                                  .string()
                                  .date()
                                  .describe(
                                    "The start date of the date object.",
                                  ),
                                end: z
                                  .union([z.string().date(), z.null()])
                                  .describe(
                                    "The end date of the date object, if any.",
                                  )
                                  .optional(),
                                time_zone: z
                                  .union([z.string().min(2).max(32), z.null()])
                                  .describe(
                                    `The time zone of the date object, if any. E.g. America/Los_Angeles, Europe/London, etc.`,
                                  )
                                  .optional(),
                              })
                              .strict(),
                          })
                          .strict(),
                        z
                          .object({
                            type: z.literal("page").optional(),
                            page: z
                              .object({ id: z.string() })
                              .strict()
                              .describe("Details of the page mention."),
                          })
                          .strict(),
                        z
                          .object({
                            type: z.literal("database").optional(),
                            database: z
                              .object({ id: z.string() })
                              .strict()
                              .describe("Details of the database mention."),
                          })
                          .strict(),
                        z
                          .object({
                            type: z.literal("template_mention").optional(),
                            template_mention: z.union([
                              z
                                .object({
                                  type: z
                                    .literal("template_mention_date")
                                    .optional(),
                                  template_mention_date: z
                                    .enum(["today", "now"])
                                    .describe(
                                      "The date of the template mention.",
                                    ),
                                })
                                .strict(),
                              z
                                .object({
                                  type: z
                                    .literal("template_mention_user")
                                    .optional(),
                                  template_mention_user: z
                                    .literal("me")
                                    .describe(
                                      "The user of the template mention.",
                                    ),
                                })
                                .strict(),
                            ]),
                          })
                          .strict(),
                        z
                          .object({
                            type: z.literal("custom_emoji").optional(),
                            custom_emoji: z
                              .object({
                                id: z.string(),
                                name: z
                                  .string()
                                  .describe("The name of the custom emoji.")
                                  .optional(),
                                url: z
                                  .string()
                                  .describe("The URL of the custom emoji.")
                                  .optional(),
                              })
                              .strict()
                              .describe("Details of the custom emoji mention."),
                          })
                          .strict(),
                      ])
                      .describe(
                        `Mention objects represent an inline mention of a database, date, link preview mention, page, template mention, or user. A mention is created in the Notion UI when a user types \`@\` followed by the name of the reference.`,
                      ),
                  })
                  .strict(),
                z
                  .object({
                    type: z.literal("equation").optional(),
                    equation: z
                      .object({
                        expression: z
                          .string()
                          .describe("A KaTeX compatible string."),
                      })
                      .strict()
                      .describe(
                        `Notion supports inline LaTeX equations as rich text objects with a type value of \`equation\`.`,
                      ),
                  })
                  .strict(),
              ]),
            ),
          )
          .max(100)
          .describe(
            "An array of rich text objects that represent the content of the comment.",
          ),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "notion-create-comment",
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
