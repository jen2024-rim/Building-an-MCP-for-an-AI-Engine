import { z } from "zod";
import { readJsonFile } from "./file.js";

// Shape of a single planned course inside student.currentPlan
const planEntrySchema = z.object({
  courseCode: z.string().min(1),
  semester: z.string().min(1),
  priority: z.enum(["required", "elective"]).optional(),
});

// Shape of data/student.json
export const studentSchema = z.object({
  studentId: z.string().min(1),
  name: z.string().min(1),
  major: z.string().min(1),
  maxCredits: z.number().int().positive(),
  completedCourses: z.array(z.string()),
  currentPlan: z.array(planEntrySchema),
});

export type Student = z.infer<typeof studentSchema>;

/**
 * Loads data/student.json, validates it with Zod, and returns
 * a typed, guaranteed-valid Student object.
 * Throws a clear error if the file is missing, empty, or malformed.
 */
export async function loadStudent(): Promise<Student> {
  const raw = await readJsonFile<unknown>("student.json");

  const result = studentSchema.safeParse(raw);
  if (!result.success) {
    console.error("student.json failed validation:", result.error.format());
    throw new Error(
      "student.json is malformed — check the console for details."
    );
  }

  return result.data;
}