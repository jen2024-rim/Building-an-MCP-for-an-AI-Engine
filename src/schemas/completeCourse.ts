import * as z from "zod/v4";

// Schema for complete_course tool
export const completeCourseInputSchema = z.object({
  courseCode: z
    .string()
    .min(1)
    .max(20)
    .describe("Course code to mark as completed (moves it from the current plan to completed courses)"),
});
