import { generateStudyPlan } from "../lib/courses.js";
import { loadStudent } from "../lib/student.js";

export async function generateStudyPlanHandler(input: {
  maxCredits: number;
  preferredCategory?: string;
}) {
  try {
    const student = await loadStudent();
    const result = await generateStudyPlan(
      input.maxCredits,
      input.preferredCategory,
      student.completedCourses
    );
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (err) {
    console.error(`[generate_study_plan] failed: ${(err as Error).message}`);
    return {
      content: [{ type: "text", text: "Sorry, I couldn't generate a study plan right now." }],
      isError: true,
    };
  }
}
