import { listCompletedCourses } from "../lib/student.js";

export async function listCompletedCoursesHandler(input: { studentId: string }) {
  try {
    const result = await listCompletedCourses();

    if (result.studentId !== input.studentId) {
      return {
        content: [{ type: "text", text: "No matching student record for the given studentId." }],
        isError: true,
      };
    }

    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (err) {
    console.error(`[list_completed_courses] failed: ${(err as Error).message}`);
    return {
      content: [{ type: "text", text: "Sorry, I couldn't load completed courses right now." }],
      isError: true,
    };
  }
}
