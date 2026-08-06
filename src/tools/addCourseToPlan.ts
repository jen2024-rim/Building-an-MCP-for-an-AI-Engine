import { addCourseToPlan } from "../lib/student.js";

export async function addCourseToPlanHandler(input: {
  courseCode: string;
  semester: string;
  priority?: "required" | "elective";
}) {
  try {
    const result = await addCourseToPlan(input.courseCode, input.semester, input.priority ?? "required");
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (err) {
    console.error(`[add_course_to_plan] failed: ${(err as Error).message}`);
    return {
      content: [{ type: "text", text: "Sorry, I couldn't add that course to the plan right now." }],
      isError: true,
    };
  }
}
