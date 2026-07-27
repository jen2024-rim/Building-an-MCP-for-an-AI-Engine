import * as z from "zod/v4";

// Schema for add_course_to_plan tool
export const addCourseToPlanInputSchema = z.object({
  courseCode: z
    .string()
    .min(1)
    .max(20)
    .describe("Course code to add to the student's planned semester"),

  semester: z
    .string()
    .min(1)
    .max(50)
    .describe("Semester where the course should be planned"),

  priority: z
    .enum(["required", "elective"])
    .optional()
    .describe("Course priority type in the study plan"),
});