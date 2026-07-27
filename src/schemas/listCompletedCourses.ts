import * as z from "zod/v4";

// Schema for list_completed_courses tool
export const listCompletedCoursesInputSchema = z.object({
  studentId: z
    .string()
    .min(1)
    .max(50)
    .describe("Student identifier to retrieve completed courses"),
});