import type { McpServer } from "@modelcontextprotocol/server";

import { searchCoursesInputSchema } from "../schemas/searchCourses.js";

/**
 * Week 2 stub — Search Computer Engineering courses.
 *
 * Week 2: return placeholder response.
 * Week 3: connect with real course data.
 */
export function registerSearchCoursesTool(server: McpServer): void {

  server.registerTool(
    "search_courses",
    {
      description:
        "Search Computer Engineering courses by course name, code, or category and return course information.",
      inputSchema: searchCoursesInputSchema,
    },

    async ({ query, limit }) => {

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "search_courses",
                query,
                limit: limit ?? 5,
                message:
                  "Replace this stub in Week 3 with real course data search.",
              },
              null,
              2,
            ),
          },
        ],
      };

    },
  );

}