import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { searchCoursesInputSchema } from "./schemas/searchCourses.js";
import { checkPrerequisitesInputSchema } from "./schemas/checkPrerequisites.js";
import { generateStudyPlanInputSchema } from "./schemas/generateStudyPlan.js";
import { listCompletedCoursesInputSchema } from "./schemas/listCompletedCourses.js";
import { listRemainingCoursesInputSchema } from "./schemas/listRemainingCourses.js";
import { addCourseToPlanInputSchema } from "./schemas/addCourseToPlan.js";
import { completeCourseInputSchema } from "./schemas/completeCourse.js";

import { searchCoursesHandler } from "./tools/searchCourses.js";
import { checkPrerequisitesHandler } from "./tools/checkPrerequisites.js";
import { generateStudyPlanHandler } from "./tools/generateStudyPlan.js";
import { listCompletedCoursesHandler } from "./tools/listCompletedCourses.js";
import { listRemainingCoursesHandler } from "./tools/listRemainingCourses.js";
import { addCourseToPlanHandler } from "./tools/addCourseToPlan.js";
import { completeCourseHandler } from "./tools/completeCourse.js";

const server = new McpServer({
  name: "course-planner-mcp",
  version: "0.2.0",
});

server.registerTool(
  "search_courses",
  {
    description:
      "Search for courses by name, code, description, requirement type, or specialization area. All matching is case-insensitive, and either the query or the category filter alone is enough to search.",
    inputSchema: searchCoursesInputSchema.shape,
  },
  searchCoursesHandler
);

server.registerTool(
  "check_prerequisites",
  { description: "Check whether a student is eligible for a course based on completed prerequisites.", inputSchema: checkPrerequisitesInputSchema.shape },
  checkPrerequisitesHandler
);

server.registerTool(
  "generate_study_plan",
  {
    description:
      "Generate up to three study plan options (e.g. Balanced, Lighter workload, Faster progress) within a credit/project/lab workload range, based on completed courses and academic priority (eligibility, required courses, and course dependencies).",
    inputSchema: generateStudyPlanInputSchema.shape,
  },
  generateStudyPlanHandler
);

server.registerTool(
  "list_completed_courses",
  { description: "List all courses a student has already completed.", inputSchema: listCompletedCoursesInputSchema.shape },
  listCompletedCoursesHandler
);

server.registerTool(
  "list_remaining_courses",
  { description: "List courses a student still needs to take.", inputSchema: listRemainingCoursesInputSchema.shape },
  listRemainingCoursesHandler
);

server.registerTool(
  "add_course_to_plan",
  {
    description:
      "Add one or more approved courses to the student's plan for a given semester. Preserves existing plans for other semesters and skips courses that are already planned or already completed.",
    inputSchema: addCourseToPlanInputSchema.shape,
  },
  addCourseToPlanHandler
);

server.registerTool(
  "complete_course",
  {
    description:
      "Mark a course as completed: removes it from the student's current plan (if present) and adds it to completed courses.",
    inputSchema: completeCourseInputSchema.shape,
  },
  completeCourseHandler
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("course-planner-mcp MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
