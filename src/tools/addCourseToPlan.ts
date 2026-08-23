import { addCourseToPlan } from "../lib/student.js";

export async function addCourseToPlanHandler(input: {
  semester: string;
  courseCodes: string[];
}) {
  try {
    const result = await addCourseToPlan(input.semester, input.courseCodes);

    const messageParts: string[] = [];
    if (result.added.length > 0) {
      messageParts.push(`Added ${result.added.join(", ")} to ${result.semester}.`);
    }
    if (result.skipped.length > 0) {
      messageParts.push(
        `Skipped: ${result.skipped.map((s) => `${s.courseCode} (${s.reason})`).join("; ")}`
      );
    }
    if (messageParts.length === 0) {
      messageParts.push("No courses were added.");
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ message: messageParts.join(" "), ...result }),
        },
      ],
      isError: !result.success && result.skipped.length > 0,
    };
  } catch (err) {
    console.error(`[add_course_to_plan] failed: ${(err as Error).message}`);
    return {
      content: [
        { type: "text" as const, text: "Unable to update the student's course plan. Please try again." },
      ],
      isError: true,
    };
  }
}
