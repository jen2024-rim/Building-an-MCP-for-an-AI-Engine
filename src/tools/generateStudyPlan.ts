import { generateStudyPlan } from "../lib/courses.js";

export async function generateStudyPlanHandler(input: {
  creditLimit: number;
  preferredCategories: string[];
  completedCourses: string[];
}) {
  try {
    const plan = await generateStudyPlan(
      input.creditLimit,
      input.preferredCategories,
      input.completedCourses
    );

    if (plan.recommendedCourses.length === 0) {
      return {
        content: [
          { type: "text", text: JSON.stringify({ recommendedCourses: [], totalCredits: 0, message: "No eligible courses found for this credit limit." }) },
        ],
      };
    }

    return { content: [{ type: "text", text: JSON.stringify(plan) }] };
  } catch (err) {
    console.error(`[generate_study_plan] failed: ${(err as Error).message}`);
    return {
      content: [{ type: "text", text: "Sorry, I couldn't generate a study plan right now." }],
      isError: true,
    };
  }
}
