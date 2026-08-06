import * as z from "zod/v4";

// Schema for generate_study_plan tool
export const generateStudyPlanInputSchema = z.object({
  maxCredits: z
    .number()
    .int()
    .positive()
    .max(21)
    .describe("Maximum number of credits for the semester"),

});
