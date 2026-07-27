import type { McpServer } from "@modelcontextprotocol/server";

import { addCourseToPlanInputSchema } from "../schemas/addCourseToPlan.js";

/**
 * Week 2 stub — Add course to semester plan.
 *
 * Week 2: return placeholder response.
 * Week 3: update the student's planned courses.
 */
export function registerAddCourseToPlanTool(server: McpServer): void {
  server.registerTool(
    "add_course_to_plan",
    {
      description:
        "Add a selected course to the student's planned semester schedule.",
      inputSchema: addCourseToPlanInputSchema,
    },
    async ({ courseCode, semester, priority }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "add_course_to_plan",
                courseCode,
                semester,
                priority,
                message:
                  "Replace this stub in Week 3 with real course planning.",
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