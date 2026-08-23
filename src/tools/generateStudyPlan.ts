import { generateStudyPlan, type StudyPlanGoal } from "../lib/courses.js";
import { validateStudyPlanRanges } from "../schemas/generateStudyPlan.js";
import { flattenCurrentPlan, loadStudent } from "../lib/student.js";

export async function generateStudyPlanHandler(input: {
  minCredits: number;
  maxCredits: number;
  minProjects?: number;
  maxProjects?: number;
  minLabs?: number;
  maxLabs?: number;
  goal?: StudyPlanGoal;
}) {
  const validationError = validateStudyPlanRanges(input);
  if (validationError) {
    return {
      content: [{ type: "text" as const, text: validationError }],
      isError: true,
    };
  }

  try {
    const student = await loadStudent();
    const plannedCourseCodes = flattenCurrentPlan(student);

    const result = await generateStudyPlan(
      {
        minCredits: input.minCredits,
        maxCredits: input.maxCredits,
        minProjects: input.minProjects,
        maxProjects: input.maxProjects,
        minLabs: input.minLabs,
        maxLabs: input.maxLabs,
        goal: input.goal,
      },
      student.completedCourses,
      plannedCourseCodes
    );

    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  } catch (err) {
    console.error(`[generate_study_plan] failed: ${(err as Error).message}`);
    return {
      content: [
        { type: "text" as const, text: "Unable to generate a study plan right now. Please verify that course and student data are valid." },
      ],
      isError: true,
    };
  }
}
