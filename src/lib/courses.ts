import { z } from "zod";
import { readJsonFile } from "./file.js";

// Shape of a single course, matching data/courses.json
export const courseSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  credits: z.number().int().positive(),
  year: z.number().int().positive(),
  semester: z.number().int().positive(),
  category: z.string().min(1),
  type: z.enum(["Core", "Elective"]),
  prerequisites: z.array(z.string()),
  description: z.string().optional(),
});

export type Course = z.infer<typeof courseSchema>;

const coursesFileSchema = z.array(courseSchema);

/**
 * Loads data/courses.json, validates it with Zod, and returns
 * a typed, guaranteed-valid array of courses.
 * Throws a clear error if the file is missing, empty, or malformed.
 */
export async function loadCourses(): Promise<Course[]> {
  const raw = await readJsonFile<unknown>("courses.json");

  const result = coursesFileSchema.safeParse(raw);
  if (!result.success) {
    console.error("courses.json failed validation:", result.error.format());
    throw new Error(
      "courses.json is malformed — check the console for details."
    );
  }

  return result.data;
}