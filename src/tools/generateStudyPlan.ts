import type { McpServer } from "@modelcontextprotocol/server";

import { generateStudyPlanInputSchema } from "../schemas/generateStudyPlan.js";

/**
 * Week 2 stub — Generate semester study plan.
 *
 * Week 3: replace with real planning algorithm.
 */
export function registerGenerateStudyPlanTool(server: McpServer): void {

  server.registerTool(
    "generate_study_plan",
    {
      description:
        "Generate a suggested semester plan based on completed courses, credit limit, and preferences.",
      inputSchema: generateStudyPlanInputSchema,
    },

    async ({ creditLimit, preferredCategories, completedCourses }) => {

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "generate_study_plan",
                creditLimit,
                preferredCategories,
                completedCourses,
                message:
                  "Replace this stub in Week 3 with study plan generation logic.",
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