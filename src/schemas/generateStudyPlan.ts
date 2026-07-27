import * as z from "zod/v4";

// Schema for generate_study_plan tool
export const generateStudyPlanInputSchema = z.object({
  maxCredits: z
    .number()
    .int()
    .positive()
    .max(21)
    .describe("Maximum number of credits for the semester"),

  preferredCategory: z
    .enum([
      "AI",
      "Networks",
      "Hardware",
      "Software"
    ])
    .optional()
    .describe("Preferred course category"),

  completedCourses: z
    .array(z.string())
    .describe("Courses already completed by the student"),
});