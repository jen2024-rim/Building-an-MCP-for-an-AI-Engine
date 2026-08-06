import { listCompletedCourses } from "../lib/student.js";

export async function listCompletedCoursesHandler() {
  try {
    const result = await listCompletedCourses();
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (err) {
    console.error(`[list_completed_courses] failed: ${(err as Error).message}`);
    return {
      content: [{ type: "text", text: "Sorry, I couldn't load completed courses right now." }],
      isError: true,
    };
  }
}
