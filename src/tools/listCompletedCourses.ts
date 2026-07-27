import type { McpServer } from "@modelcontextprotocol/server";

import { listCompletedCoursesInputSchema } from "../schemas/listCompletedCourses.js";

/**
 * Week 2 stub — List completed courses.
 *
 * Week 2: return placeholder response.
 * Week 3: read completed courses from student data.
 */
export function registerListCompletedCoursesTool(server: McpServer): void {
  server.registerTool(
    "list_completed_courses",
    {
      description:
        "Display the courses that the student has already completed.",
      inputSchema: listCompletedCoursesInputSchema,
    },
    async ({ studentId }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "list_completed_courses",
                studentId,
                message:
                  "Replace this stub in Week 3 with real completed course data.",
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