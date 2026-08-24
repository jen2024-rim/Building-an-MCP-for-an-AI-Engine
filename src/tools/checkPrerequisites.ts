import { checkPrerequisites } from "../lib/courses.js";
import { loadStudent } from "../lib/student.js";

export async function checkPrerequisitesHandler(input: { courseCode: string }) {
  try {
    const student = await loadStudent();

    const result = await checkPrerequisites(input.courseCode, student.completedCourses);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(result) }],
    };
  } catch (err) {
    const errorMessage = (err as Error).message;

    console.error(`[check_prerequisites] failed: ${errorMessage}`);

    if (errorMessage.includes("was not found")) {
      return {
        content: [
          {
            type: "text" as const,
            text: `${errorMessage} Please check the course code and try again.`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: "Unable to check prerequisites because the course data could not be loaded.",
        },
      ],
      isError: true,
    };
  }
}
