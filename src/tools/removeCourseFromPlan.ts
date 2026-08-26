import { removeCourseFromPlan } from "../lib/student.js";

export async function removeCourseFromPlanHandler(input: { courseCode: string }) {
  try {
    const result = await removeCourseFromPlan(input.courseCode);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            message: `Removed ${result.courseCode} from the current plan.`,
            ...result,
          }),
        },
      ],
    };
  } catch (err) {
    const errorMessage = (err as Error).message;
    console.error(`[remove_course_from_plan] failed: ${errorMessage}`);

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
