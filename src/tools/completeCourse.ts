import { completeCourse } from "../lib/student.js";

export async function completeCourseHandler(input: { courseCode: string }) {
  try {
    const result = await completeCourse(input.courseCode);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            message: `Marked ${result.courseCode} as completed.`,
            ...result,
          }),
        },
      ],
    };
  } catch (err) {
    const errorMessage = (err as Error).message;
    console.error(`[complete_course] failed: ${errorMessage}`);

    if (errorMessage.includes("was not found")) {
      return {
        content: [{ type: "text" as const, text: `${errorMessage} Please check the course code and try again.` }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text" as const, text: "Unable to update the student's course plan. Please try again." }],
      isError: true,
    };
  }
}
