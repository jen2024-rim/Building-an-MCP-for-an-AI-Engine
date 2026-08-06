import { z } from "zod";
import { readJsonFile, writeJsonFile } from "./file.js";
import { getRemainingCourses, type Course } from "./courses.js";

const planEntrySchema = z.object({
  courseCode: z.string().min(1),
  semester: z.string().min(1),
  priority: z.enum(["required", "elective"]).optional(),
});

export const studentSchema = z.object({
  studentId: z.string().min(1),
  name: z.string().min(1),
  major: z.string().min(1),
  maxCredits: z.number().int().positive(),
  completedCourses: z.array(z.string()),
  currentPlan: z.array(planEntrySchema),
});

export type Student = z.infer<typeof studentSchema>;

export async function loadStudent(): Promise<Student> {
  const raw = await readJsonFile<unknown>("student.json");
  const result = studentSchema.safeParse(raw);
  if (!result.success) {
    console.error("[student] student.json failed validation:", result.error.format());
    throw new Error("student.json is malformed — check the logs for details.");
  }
  return result.data;
}

async function saveStudent(student: Student): Promise<void> {
  await writeJsonFile("student.json", student);
}

/** P1 — list_completed_courses */
export async function listCompletedCourses(): Promise<{
  studentId: string;
  completedCourses: string[];
}> {
  const student = await loadStudent();
  return { studentId: student.studentId, completedCourses: student.completedCourses };
}

/** P1 — list_remaining_courses */
export async function listRemainingCourses(
  includeElectives = true
): Promise<{ studentId: string; includeElectives: boolean; remainingCourses: Course[] }> {
  const student = await loadStudent();
  const remaining = await getRemainingCourses(student.completedCourses, includeElectives);
  return { studentId: student.studentId, includeElectives, remainingCourses: remaining };
}

/** P1 — add_course_to_plan */
export async function addCourseToPlan(
  courseCode: string,
  semester: string,
  priority: "required" | "elective" = "required"
): Promise<{ success: boolean; courseAdded: string; semester: string; priority: string }> {
  const student = await loadStudent();

  const alreadyPlanned = student.currentPlan.some(
    (p) => p.courseCode === courseCode && p.semester === semester
  );

  if (!alreadyPlanned) {
    student.currentPlan.push({ courseCode, semester, priority });
    await saveStudent(student);
  }

  return { success: true, courseAdded: courseCode, semester, priority };
}