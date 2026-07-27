import type { McpServer } from "@modelcontextprotocol/server";

import { listRemainingCoursesInputSchema } from "../schemas/listRemainingCourses.js";

/**
 * Week 2 stub — List remaining courses.
 *
 * Week 2: return placeholder response.
 * Week 3: calculate remaining courses from student progress.
 */
export function registerListRemainingCoursesTool(server: McpServer): void {
  server.registerTool(
    "list_remaining_courses",
    {
      description:
        "Display the courses that the student still needs to complete.",
      inputSchema: listRemainingCoursesInputSchema,
    },
    async ({ studentId, includeElectives }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "list_remaining_courses",
                studentId,
                includeElectives,
                message:
                  "Replace this stub in Week 3 with real remaining course calculation.",
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