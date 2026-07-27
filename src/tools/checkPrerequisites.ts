import type { McpServer } from "@modelcontextprotocol/server";

import { checkPrerequisitesInputSchema } from "../schemas/checkPrerequisites.js";

/**
 * Week 2 stub — Check course prerequisites.
 *
 * Week 3: replace with real prerequisite checking logic.
 */
export function registerCheckPrerequisitesTool(server: McpServer): void {

  server.registerTool(
    "check_prerequisites",
    {
      description:
        "Check whether a student can take a course based on completed courses and prerequisites.",
      inputSchema: checkPrerequisitesInputSchema,
    },

    async ({ courseCode, completedCourses }) => {

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "check_prerequisites",
                courseCode,
                completedCourses,
                message:
                  "Replace this stub in Week 3 with prerequisite checking logic.",
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