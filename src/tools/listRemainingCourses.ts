import { listRemainingCourses } from "../lib/student.js";
export async function listRemainingCoursesHandler(input: { studentId: string; includeElectives?: boolean }) {
  try {
    const result = await listRemainingCourses(input.includeElectives ?? true);

    if (result.studentId !== input.studentId) {
      return {
        content: [{ type: "text" as const, text: "No matching student record for the given studentId." }],
        isError: true,
      };
    }

    if (result.remainingCourses.length === 0) {
      return {
        content: [
          { type: "text" as const, text: JSON.stringify({ ...result, message: "No remaining courses — everything is completed!" }) },
        ],
      };
    }

    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  } catch (err) {
    console.error(`[list_remaining_courses] failed: ${(err as Error).message}`);
    return {
      content: [{ type: "text" as const, text: "Sorry, I couldn't load remaining courses right now." }],
      isError: true,
    };
  }
}
