import * as z from "zod/v4";

// Schema for add_course_to_plan tool
export const addCourseToPlanInputSchema = z.object({
  semester: z
    .string()
    .min(1)
    .max(50)
    .describe('Semester the courses should be added to, e.g. "Spring 2027"'),

  courseCodes: z
    .array(z.string().min(1).max(20))
    .min(1)
    .describe("Course codes to add to the student's plan for the given semester (case-insensitive)"),
});
