import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { searchCoursesInputSchema } from "./schemas/searchCourses.js";
import { checkPrerequisitesInputSchema } from "./schemas/checkPrerequisites.js";
import { generateStudyPlanInputSchema } from "./schemas/generateStudyPlan.js";
import { listCompletedCoursesInputSchema } from "./schemas/listCompletedCourses.js";
import { listRemainingCoursesInputSchema } from "./schemas/listRemainingCourses.js";
import { addCourseToPlanInputSchema } from "./schemas/addCourseToPlan.js";

import { searchCoursesHandler } from "./tools/searchCourses.js";
import { checkPrerequisitesHandler } from "./tools/checkPrerequisites.js";
import { generateStudyPlanHandler } from "./tools/generateStudyPlan.js";
import { listCompletedCoursesHandler } from "./tools/listCompletedCourses.js";
import { listRemainingCoursesHandler } from "./tools/listRemainingCourses.js";
import { addCourseToPlanHandler } from "./tools/addCourseToPlan.js";

/**
 * Create a new MCP server instance and register all project tools.
 */
function createServer(): McpServer {
  const server = new McpServer({
    name: "course-planner-mcp",
    version: "0.2.0",
  });

  server.registerTool(
    "search_courses",
    { description: "Search for courses by name, code, or category keyword.", inputSchema: searchCoursesInputSchema },
    searchCoursesHandler
  );

  server.registerTool(
    "check_prerequisites",
    { description: "Check whether a student is eligible for a course based on completed prerequisites.", inputSchema: checkPrerequisitesInputSchema },
    checkPrerequisitesHandler
  );

  server.registerTool(
    "generate_study_plan",
    { description: "Generate a recommended set of courses for the next semester within a credit limit.", inputSchema: generateStudyPlanInputSchema },
    generateStudyPlanHandler
  );

  server.registerTool(
    "list_completed_courses",
    { description: "List all courses a student has already completed.", inputSchema: listCompletedCoursesInputSchema },
    listCompletedCoursesHandler
  );

  server.registerTool(
    "list_remaining_courses",
    { description: "List courses a student still needs to take.", inputSchema: listRemainingCoursesInputSchema },
    listRemainingCoursesHandler
  );

  server.registerTool(
    "add_course_to_plan",
    { description: "Add a course to the student's current semester plan.", inputSchema: addCourseToPlanInputSchema },
    addCourseToPlanHandler
  );

  return server;
}

void serveStdio(createServer);
console.error("course-planner-mcp MCP server running on stdio");
