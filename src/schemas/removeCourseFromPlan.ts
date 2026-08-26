import * as z from "zod/v4";

export const removeCourseFromPlanInputSchema = z.object({
  courseCode: z
    .string()
    .min(1)
    .max(20)
    .describe("Course code to remove from the current plan WITHOUT marking it completed (it goes back to remaining courses)"),
});
