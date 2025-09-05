import { tool } from "ai";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: notion-update-database
// Source: https://mcp.notion.com/mcp
export const notionupdatedatabaseToolWithClient = (
  getClient: () => Promise<Client> | Client,
) =>
  tool({
    description: `Update a Notion database's properties, name, description, or other attributes.
The tool returns a rendered Markdown string showing the updated database structure,
including its properties, data sources, and schema information.
Database properties define the columns/fields that pages in the database can have.
Each property has a type (text, number, select, etc.) and configuration options.
Examples:
(1) Update database title and description:
{
"database_id": "f336d0bc-b841-465b-8045-024475c079dd",
"title": [{"type": "text", "text": {"content": "Project Tracker 2024"}}],
"description": [{"type": "text", "text": {"content": "Track all projects and deliverables"}}]
}
(2) Add new properties to a database:
{
"database_id": "f336d0bc-b841-465b-8045-024475c079dd",
"properties": {
"Priority": {
"select": {
"options": [
{"name": "High", "color": "red"},
{"name": "Medium", "color": "yellow"},
{"name": "Low", "color": "green"}
]
}
},
"Due Date": {"date": {}},
"Assigned To": {"people": {}}
}
}
(3) Rename an existing property (use the property ID or current name):
{
"database_id": "f336d0bc-b841-465b-8045-024475c079dd",
"properties": {
"Status": {"name": "Project Status"}
}
}
(4) Remove a property (set to null):
{
"database_id": "f336d0bc-b841-465b-8045-024475c079dd",
"properties": {
"Old Property": null
}
}
(5) Change display mode from inline to full page:
{
"database_id": "f336d0bc-b841-465b-8045-024475c079dd",
"is_inline": false
}
(6) Move database to trash (WARNING: cannot be undone without going to the Notion app UI so
explicitly confirm with the user that they really want to do this):
{
"database_id": "f336d0bc-b841-465b-8045-024475c079dd",
"in_trash": true
}
Common property types:
- title: The main property (required, cannot be deleted)
- rich_text: Multi-line text
- number: Numeric values with optional formatting
- select: Single choice from options
- multi_select: Multiple choices from options
- date: Date with optional time
- people: User references
- checkbox: Boolean values
- url: Web links
- email: Email addresses
- phone_number: Phone numbers
- formula: Calculated values based on other properties
- relation: Links to pages in another database
- rollup: Aggregated values from related pages
Notes:
- You cannot delete or create new title properties
- A database can only have one unique_id property
- Synced databases cannot be updated
- Use the "fetch" tool first to see the current database schema`,
    inputSchema: z
      .object({
        database_id: z
          .string()
          .describe(
            `The ID of the database to update. This is a UUID v4, with or without dashes, and can be parsed from a database URL.`,
          ),
        title: z
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
            "The new title of the database, as a rich text object, if you want to update it.",
          )
          .optional(),
        description: z
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
            `The new description of the database, as a rich text object, if you want to update it.`,
          )
          .optional(),
        properties: z
          .record(
            z.union([
              z.intersection(
                z.object({
                  name: z
                    .string()
                    .describe("The name of the property.")
                    .optional(),
                  description: z
                    .union([z.string().min(1).max(280), z.null()])
                    .describe("The description of the property.")
                    .optional(),
                }),
                z.union([
                  z
                    .object({
                      type: z.literal("number").optional(),
                      number: z
                        .object({
                          format: z.string().min(3).max(18).optional(),
                        })
                        .strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("formula").optional(),
                      formula: z
                        .object({ expression: z.string().optional() })
                        .strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("select").optional(),
                      select: z
                        .object({
                          options: z
                            .array(
                              z.intersection(
                                z.object({
                                  name: z.string(),
                                  color: z
                                    .enum([
                                      "default",
                                      "gray",
                                      "brown",
                                      "orange",
                                      "yellow",
                                      "green",
                                      "blue",
                                      "purple",
                                      "pink",
                                      "red",
                                    ])
                                    .describe(
                                      `One of: \`default\`, \`gray\`, \`brown\`, \`orange\`, \`yellow\`, \`green\`, \`blue\`, \`purple\`, \`pink\`, \`red\``,
                                    )
                                    .optional(),
                                  description: z
                                    .union([z.string(), z.null()])
                                    .optional(),
                                }),
                                z.union([
                                  z
                                    .object({
                                      name: z.string(),
                                      id: z.string().optional(),
                                    })
                                    .strict(),
                                  z
                                    .object({
                                      id: z.string(),
                                      name: z.string().optional(),
                                    })
                                    .strict(),
                                ]),
                              ),
                            )
                            .max(100)
                            .optional(),
                        })
                        .strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("multi_select").optional(),
                      multi_select: z
                        .object({
                          options: z
                            .array(
                              z.intersection(
                                z.object({
                                  name: z.string(),
                                  color: z
                                    .enum([
                                      "default",
                                      "gray",
                                      "brown",
                                      "orange",
                                      "yellow",
                                      "green",
                                      "blue",
                                      "purple",
                                      "pink",
                                      "red",
                                    ])
                                    .describe(
                                      `One of: \`default\`, \`gray\`, \`brown\`, \`orange\`, \`yellow\`, \`green\`, \`blue\`, \`purple\`, \`pink\`, \`red\``,
                                    )
                                    .optional(),
                                  description: z
                                    .union([z.string(), z.null()])
                                    .optional(),
                                }),
                                z.union([
                                  z
                                    .object({
                                      name: z.string(),
                                      id: z.string().optional(),
                                    })
                                    .strict(),
                                  z
                                    .object({
                                      id: z.string(),
                                      name: z.string().optional(),
                                    })
                                    .strict(),
                                ]),
                              ),
                            )
                            .max(100)
                            .optional(),
                        })
                        .strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("status").optional(),
                      status: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("relation").optional(),
                      relation: z.intersection(
                        z.object({ data_source_id: z.string() }),
                        z.union([
                          z
                            .object({
                              type: z.literal("single_property").optional(),
                              single_property: z.object({}).strict(),
                            })
                            .strict(),
                          z
                            .object({
                              type: z.literal("dual_property").optional(),
                              dual_property: z
                                .object({
                                  synced_property_id: z.string().optional(),
                                  synced_property_name: z.string().optional(),
                                })
                                .strict(),
                            })
                            .strict(),
                        ]),
                      ),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("rollup").optional(),
                      rollup: z.intersection(
                        z.object({ function: z.string().min(3).max(17) }),
                        z.union([
                          z
                            .object({
                              relation_property_name: z.string(),
                              rollup_property_name: z.string(),
                            })
                            .strict(),
                          z
                            .object({
                              relation_property_id: z.string(),
                              rollup_property_name: z.string(),
                            })
                            .strict(),
                          z
                            .object({
                              relation_property_name: z.string(),
                              rollup_property_id: z.string(),
                            })
                            .strict(),
                          z
                            .object({
                              relation_property_id: z.string(),
                              rollup_property_id: z.string(),
                            })
                            .strict(),
                        ]),
                      ),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("unique_id").optional(),
                      unique_id: z
                        .object({
                          prefix: z.union([z.string(), z.null()]).optional(),
                        })
                        .strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("title").optional(),
                      title: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("rich_text").optional(),
                      rich_text: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("url").optional(),
                      url: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("people").optional(),
                      people: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("files").optional(),
                      files: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("email").optional(),
                      email: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("phone_number").optional(),
                      phone_number: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("date").optional(),
                      date: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("checkbox").optional(),
                      checkbox: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("created_by").optional(),
                      created_by: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("created_time").optional(),
                      created_time: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("last_edited_by").optional(),
                      last_edited_by: z.object({}).strict(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.literal("last_edited_time").optional(),
                      last_edited_time: z.object({}).strict(),
                    })
                    .strict(),
                ]),
              ),
              z
                .object({
                  name: z.string().describe("The new name of the property."),
                })
                .strict(),
              z.null(),
            ]),
          )
          .describe(
            `Updates to make to the database's schema. Use null to remove a property, or provide the \`name\` only to rename a property.`,
          )
          .optional(),
        is_inline: z
          .boolean()
          .describe(
            `Whether the database should be displayed inline in the parent page, if you want to change this setting.`,
          )
          .optional(),
        in_trash: z
          .boolean()
          .describe(
            `Whether to move the database to the trash. WARNING: This operation currently cannot be undone without going to the Notion app UI. Make sure you want to do this before proceeding.`,
          )
          .optional(),
      })
      .strict(),
    execute: async (args): Promise<string> => {
      const client = await getClient();
      const result = await client.callTool({
        name: "notion-update-database",
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
