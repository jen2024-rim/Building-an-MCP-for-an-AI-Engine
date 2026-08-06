import { z } from "zod";
import { readJsonFile } from "./file.js";

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

export async function loadCourses(): Promise<Course[]> {
  const raw = await readJsonFile<unknown>("courses.json");
  const result = coursesFileSchema.safeParse(raw);
  if (!result.success) {
    console.error("[courses] courses.json failed validation:", result.error.format());
    throw new Error("courses.json is malformed — check the logs for details.");
  }
  return result.data;
}

export function getCourseByCode(courses: Course[], code: string): Course | undefined {
  return courses.find((c) => c.code === code);
}

/** P0 — search_courses */
export async function searchCourses(
  query: string,
  category?: string,
  limit = 5
): Promise<Course[]> {
  const courses = await loadCourses();
  const q = query.trim().toLowerCase();

  let results = courses.filter(
    (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  );

  if (category) {
    results = results.filter((c) => c.category === category);
  }

  return results.slice(0, Math.max(1, limit));
}

/** P0 — check_prerequisites */
export async function checkPrerequisites(
  courseCode: string,
  completedCourses: string[]
): Promise<{ courseCode: string; eligible: boolean; missingPrerequisites: string[] }> {
  const courses = await loadCourses();
  const course = getCourseByCode(courses, courseCode);

  if (!course) {
    throw new Error(`Course "${courseCode}" was not found.`);
  }

  const missing = course.prerequisites.filter((p) => !completedCourses.includes(p));

  return {
    courseCode,
    eligible: missing.length === 0,
    missingPrerequisites: missing,
  };
}

/**
 * P0 — generate_study_plan
 * NOTE: parameter names now match generateStudyPlanInputSchema exactly
 * (maxCredits, preferredCategory — singular optional) to fix the
 * previous schema/code naming mismatch.
 */
export async function generateStudyPlan(
  maxCredits: number,
  preferredCategory: string | undefined,
  completedCourses: string[]
): Promise<{ recommendedCourses: Course[]; totalCredits: number; maxCredits: number }> {
  const courses = await loadCourses();

  const eligible = courses.filter((c) => {
    if (completedCourses.includes(c.code)) return false;
    const prereqsMet = c.prerequisites.every((p) => completedCourses.includes(p));
    return prereqsMet;
  });

  const prioritized = preferredCategory
    ? [
        ...eligible.filter((c) => c.category === preferredCategory),
        ...eligible.filter((c) => c.category !== preferredCategory),
      ]
    : eligible;

  const recommendedCourses: Course[] = [];
  let totalCredits = 0;

  for (const course of prioritized) {
    if (totalCredits + course.credits > maxCredits) continue;
    recommendedCourses.push(course);
    totalCredits += course.credits;
  }

  return { recommendedCourses, totalCredits, maxCredits };
}

/** P1 — list_remaining_courses (needs course list + student's completed list) */
export async function getRemainingCourses(
  completedCourses: string[],
  includeElectives = true
): Promise<Course[]> {
  const courses = await loadCourses();
  return courses.filter((c) => {
    if (completedCourses.includes(c.code)) return false;
    if (!includeElectives && c.type === "Elective") return false;
    return true;
  });
}
