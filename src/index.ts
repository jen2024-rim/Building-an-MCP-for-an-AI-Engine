import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerSearchCoursesTool } from "./tools/searchCourses.js";
import { registerCheckPrerequisitesTool } from "./tools/checkPrerequisites.js";
import { registerGenerateStudyPlanTool } from "./tools/generateStudyPlan.js";
import { registerListCompletedCoursesTool } from "./tools/listCompletedCourses.js";
import { registerListRemainingCoursesTool } from "./tools/listRemainingCourses.js";
import { registerAddCourseToPlanTool } from "./tools/addCourseToPlan.js";

/**
 * Create a new MCP server instance and register all project tools.
 */
function createServer(): McpServer {
  const server = new McpServer({
    name: "course-planner-mcp",
    version: "0.2.0",
  });

  registerSearchCoursesTool(server);
  registerCheckPrerequisitesTool(server);
  registerGenerateStudyPlanTool(server);
  registerListCompletedCoursesTool(server);
  registerListRemainingCoursesTool(server);
  registerAddCourseToPlanTool(server);

  return server;
}

void serveStdio(createServer);
console.error("course-planner-mcp MCP server running on stdio");