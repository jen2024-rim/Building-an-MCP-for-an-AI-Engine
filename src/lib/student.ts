import { z } from "zod";
import { readJsonFile, writeJsonFile } from "./file.js";
import { getCourseByCode, getRemainingCourses, loadCourses, type Course } from "./courses.js";

const semesterPlanSchema = z.object({
  semester: z.string().min(1),
  courses: z.array(z.string().min(1)),
});

export const studentSchema = z.object({
  studentId: z.string().min(1),
  name: z.string().min(1),
  major: z.string().min(1),
  maxCredits: z.number().int().positive(),
  completedCourses: z.array(z.string()),
  currentPlan: z.array(semesterPlanSchema),
});

export type Student = z.infer<typeof studentSchema>;
export type SemesterPlan = z.infer<typeof semesterPlanSchema>;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function containsCodeCaseInsensitive(list: string[], code: string): boolean {
  const normalizedCode = normalize(code);
  return list.some((c) => normalize(c) === normalizedCode);
}

export async function loadStudent(): Promise<Student> {
  const raw = await readJsonFile<unknown>("student.json");
  const result = studentSchema.safeParse(raw);
  if (!result.success) {
    console.error("[student] student.json failed validation:", result.error.format());
    throw new Error("Unable to load the student's course plan. Please verify that student.json is valid.");
  }
  return result.data;
}

async function saveStudent(student: Student): Promise<void> {
  try {
    await writeJsonFile("student.json", student);
  } catch (err) {
    console.error("[student] failed to save student.json:", err);
    throw new Error("Unable to update the student's course plan. Please try again.");
  }
}

/** All course codes currently in the student's plan, across every semester. */
export function flattenCurrentPlan(student: Student): string[] {
  return student.currentPlan.flatMap((entry) => entry.courses);
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

/* -------------------------------------------------------------------------- */
/* P0 — add_course_to_plan                                                    */
/* -------------------------------------------------------------------------- */

export interface AddCourseToPlanResult {
  success: boolean;
  semester: string;
  added: string[];
  skipped: { courseCode: string; reason: string }[];
  currentPlan: SemesterPlan[];
}

export async function addCourseToPlan(
  semester: string,
  courseCodes: string[]
): Promise<AddCourseToPlanResult> {
  const trimmedSemester = semester.trim();
  const courses = await loadCourses();
  const student = await loadStudent();

  const added: string[] = [];
  const skipped: { courseCode: string; reason: string }[] = [];

  const alreadyInPlan = flattenCurrentPlan(student);

  let semesterEntry = student.currentPlan.find(
    (entry) => normalize(entry.semester) === normalize(trimmedSemester)
  );

  for (const rawCode of courseCodes) {
    const course = getCourseByCode(courses, rawCode);

    if (!course) {
      skipped.push({ courseCode: rawCode, reason: `Course "${rawCode}" was not found.` });
      continue;
    }

    const canonicalCode = course.code;

    if (containsCodeCaseInsensitive(student.completedCourses, canonicalCode)) {
      skipped.push({ courseCode: canonicalCode, reason: "This course has already been completed." });
      continue;
    }

    if (containsCodeCaseInsensitive(alreadyInPlan, canonicalCode) || added.includes(canonicalCode)) {
      skipped.push({ courseCode: canonicalCode, reason: "This course is already in the current plan." });
      continue;
    }

    added.push(canonicalCode);
    alreadyInPlan.push(canonicalCode);
  }

  if (added.length > 0) {
    if (semesterEntry) {
      semesterEntry.courses.push(...added);
    } else {
      semesterEntry = { semester: trimmedSemester, courses: [...added] };
      student.currentPlan.push(semesterEntry);
    }
    await saveStudent(student);
  }

  return {
    success: added.length > 0,
    semester: trimmedSemester,
    added,
    skipped,
    currentPlan: student.currentPlan,
  };
}

/* -------------------------------------------------------------------------- */
/* P0 — complete_course                                                       */
/* -------------------------------------------------------------------------- */

export interface CompleteCourseResult {
  success: boolean;
  courseCode: string;
  completedCourses: string[];
  currentPlan: SemesterPlan[];
}

export async function completeCourse(courseCode: string): Promise<CompleteCourseResult> {
  const courses = await loadCourses();
  const course = getCourseByCode(courses, courseCode);

  if (!course) {
    throw new Error(`Course "${courseCode}" was not found.`);
  }

  const canonicalCode = course.code;
  const student = await loadStudent();

  // Remove from currentPlan (any semester), case-insensitively.
  student.currentPlan = student.currentPlan
    .map((entry) => ({
      ...entry,
      courses: entry.courses.filter((c) => normalize(c) !== normalize(canonicalCode)),
    }))
    .filter((entry) => entry.courses.length > 0);

  // Add to completedCourses if not already present.
  if (!containsCodeCaseInsensitive(student.completedCourses, canonicalCode)) {
    student.completedCourses.push(canonicalCode);
  }

  await saveStudent(student);

  return {
    success: true,
    courseCode: canonicalCode,
    completedCourses: student.completedCourses,
    currentPlan: student.currentPlan,
  };
}
