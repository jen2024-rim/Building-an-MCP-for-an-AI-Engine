import { checkPrerequisites } from "../lib/courses.js";

export async function checkPrerequisitesHandler(input: {
  courseCode: string;
  completedCourses: string[];
}) {
  try {
    const result = await checkPrerequisites(input.courseCode, input.completedCourses);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (err) {
    console.error(`[check_prerequisites] failed: ${(err as Error).message}`);
    return {
      content: [{ type: "text", text: "Sorry, I couldn't check prerequisites right now." }],
      isError: true,
    };
  }
}
