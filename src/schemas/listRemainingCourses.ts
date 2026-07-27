import * as z from "zod/v4";

// Schema for list_remaining_courses tool
export const listRemainingCoursesInputSchema = z.object({
  studentId: z
    .string()
    .min(1)
    .max(50)
    .describe("Student identifier to find remaining courses"),

  includeElectives: z
    .boolean()
    .optional()
    .describe("Whether to include elective courses in the remaining list"),
});