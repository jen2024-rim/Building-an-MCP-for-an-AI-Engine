import { z } from "zod";
import { readJsonFile } from "./file.js";

export const requirementTypeEnum = z.enum([
  "University Requirement",
  "College Requirement",
  "Specialization Requirement",
  "Specialization Elective",
]);

export const areaEnum = z.enum(["AI", "Hardware", "Software", "Networks"]);

export const courseSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  credits: z.number().int().positive(),
  year: z.number().int().positive(),
  semester: z.number().int().positive(),
  requirementType: requirementTypeEnum,
  // area only applies to specialization courses; University/College requirements use null.
  area: areaEnum.nullable(),
  type: z.enum(["Core", "Elective"]),
  hasLab: z.boolean(),
  projectCount: z.number().int().nonnegative(),
  prerequisites: z.array(z.string()),
  description: z.string().optional(),
});

export type Course = z.infer<typeof courseSchema>;
export type RequirementType = z.infer<typeof requirementTypeEnum>;
export type Area = z.infer<typeof areaEnum>;

const coursesFileSchema = z.array(courseSchema);

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export async function loadCourses(): Promise<Course[]> {
  const raw = await readJsonFile<unknown>("courses.json");
  const result = coursesFileSchema.safeParse(raw);
  if (!result.success) {
    console.error("[courses] courses.json failed validation:", result.error.format());
    throw new Error("Unable to load course data. Please verify that courses.json is valid.");
  }
  return result.data;
}

export function getCourseByCode(
  courses: Course[],
  code: string
): Course | undefined {
  const normalizedCode = normalize(code);

  return courses.find((c) => normalize(c.code) === normalizedCode);
}

/** True if `code` (case-insensitive) appears in `list` (case-insensitive). */
function containsCodeCaseInsensitive(list: string[], code: string): boolean {
  const normalizedCode = normalize(code);
  return list.some((c) => normalize(c) === normalizedCode);
}

/**
 * Returns true if every prerequisite for `course` is present (case-insensitively)
 * in `completedCourses`.
 */
function prerequisitesMet(course: Course, completedCourses: string[]): boolean {
  return course.prerequisites.every((prereq) =>
    containsCodeCaseInsensitive(completedCourses, prereq)
  );
}

/** P0 — search_courses
 *
 * `query` matches against course name, course code, or description.
 * `category` matches against either requirementType or area (whichever applies).
 * Both are case-insensitive and either may be provided on its own.
 */
export async function searchCourses(
  query: string | undefined,
  category?: string,
  limit = 5
): Promise<Course[]> {
  const courses = await loadCourses();

  const q = query?.trim() ? normalize(query) : undefined;
  const normalizedCategory = category?.trim() ? normalize(category) : undefined;

  let results = courses;

  if (q) {
    results = results.filter((c) => {
      const name = normalize(c.name);
      const code = normalize(c.code);
      const description = c.description ? normalize(c.description) : "";
      const requirementType = normalize(c.requirementType);
      const area = c.area ? normalize(c.area) : "";

      return (
        name.includes(q) ||
        code.includes(q) ||
        description.includes(q) ||
        requirementType.includes(q) ||
        area.includes(q)
      );
    });
  }

  if (normalizedCategory) {
    results = results.filter((c) => {
      const requirementType = normalize(c.requirementType);
      const area = c.area ? normalize(c.area) : "";
      return requirementType === normalizedCategory || area === normalizedCategory;
    });
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

  const missing = course.prerequisites.filter(
    (prerequisite) => !containsCodeCaseInsensitive(completedCourses, prerequisite)
  );

  return {
    courseCode: course.code,
    eligible: missing.length === 0,
    missingPrerequisites: missing,
  };
}

/* -------------------------------------------------------------------------- */
/* P0 — generate_study_plan                                                    */
/* -------------------------------------------------------------------------- */

export type StudyPlanGoal = "stay_on_track" | "reduce_workload" | "graduate_sooner";

export interface StudyPlanParams {
  minCredits: number;
  maxCredits: number;
  minProjects?: number;
  maxProjects?: number;
  minLabs?: number;
  maxLabs?: number;
  goal?: StudyPlanGoal;
}

export interface StudyPlanOption {
  label: string;
  reason: string;
  courses: Course[];
  totalCredits: number;
  totalProjects: number;
  totalLabs: number;
  unmetConstraints: string[];
}

export interface StudyPlanResult {
  options: StudyPlanOption[];
}

type PlanProfile = {
  label: string;
  reason: string;
  /** Weight applied to "this course unlocks other future courses". */
  unlockWeight: number;
  /** Weight applied to earlier-year courses (bigger = stronger preference). */
  yearWeight: number;
  /** Weight subtracted per unit of workload (projects + labs). Higher = lighter workload. */
  workloadPenalty: number;
  /** Weight added per credit — favors packing more credits in. */
  creditWeight: number;
  /** Soft target credits to aim for within [minCredits, maxCredits]. */
  targetCredits: (min: number, max: number) => number;
  /**
   * Effective credit ceiling used during the search itself (hard constraint),
   * which may be tighter than the user's maxCredits. Without this, a profile
   * that merely *penalizes* going over its target will still grab every
   * available course whenever they all comfortably fit under maxCredits —
   * because each additional required course keeps adding a flat "required"
   * bonus that a workload penalty rarely outweighs. Capping the search itself
   * is what actually produces a meaningfully lighter (or heavier) plan.
   */
  effectiveMaxCredits: (min: number, max: number) => number;
};

function buildProfiles(goal: StudyPlanGoal | undefined): PlanProfile[] {
  const balanced: PlanProfile = {
    label: "Balanced",
    reason:
      "Prioritizes required courses you're already eligible for and keeps you on your normal track.",
    unlockWeight: 3,
    yearWeight: 2,
    workloadPenalty: 1,
    creditWeight: 1,
    targetCredits: (min, max) => Math.round((min + max) / 2),
    effectiveMaxCredits: (_min, max) => max,
  };

  const lighter: PlanProfile = {
    label: "Lighter workload",
    reason:
      "Trims projects and lab sections where possible and aims closer to your minimum credit target.",
    unlockWeight: 1.5,
    yearWeight: 2,
    workloadPenalty: 4,
    creditWeight: 0.25,
    targetCredits: (min) => min,
    // Hard-cap the search near the minimum so this profile genuinely trims
    // the load instead of taking every course that happens to fit under
    // the user's (often much larger) maxCredits.
    effectiveMaxCredits: (min, max) => Math.min(max, min + 3),
  };

  const faster: PlanProfile = {
    label: "Faster progress",
    reason:
      "Packs in as many credits as allowed and favors courses that unlock the most future courses.",
    unlockWeight: 5,
    yearWeight: 1,
    workloadPenalty: 0.25,
    creditWeight: 2,
    targetCredits: (_min, max) => max,
    effectiveMaxCredits: (_min, max) => max,
  };

  const profiles = [balanced, lighter, faster];

  if (goal === "reduce_workload") {
    return [lighter, balanced, faster];
  }
  if (goal === "graduate_sooner") {
    return [faster, balanced, lighter];
  }
  // "stay_on_track" or no goal specified — balanced leads.
  return profiles;
}

function computeUnlockCounts(courses: Course[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const course of courses) {
    for (const prereq of course.prerequisites) {
      const key = normalize(prereq);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function scoreCourse(
  course: Course,
  profile: PlanProfile,
  unlockCounts: Map<string, number>,
  maxYear: number
): number {
  const requiredBonus = course.type === "Core" ? 6 : 0;
  const unlockBonus = (unlockCounts.get(normalize(course.code)) ?? 0) * profile.unlockWeight;
  const yearBonus = (maxYear - course.year + 1) * profile.yearWeight;
  const workload = course.projectCount + (course.hasLab ? 1 : 0);
  const workloadPenalty = workload * profile.workloadPenalty;
  const creditBonus = course.credits * profile.creditWeight;

  return requiredBonus + unlockBonus + yearBonus + creditBonus - workloadPenalty;
}

interface Combo {
  courses: Course[];
  totalCredits: number;
  totalProjects: number;
  totalLabs: number;
  score: number;
}

/**
 * Finds the best combination of eligible courses for a single plan profile,
 * respecting hard limits (maxCredits, maxProjects, maxLabs) and trying to
 * reach the soft minimums (minCredits, minProjects, minLabs) plus the
 * profile's target credit count. Uses bounded backtracking rather than a
 * plain greedy pass so better-fitting combinations aren't missed.
 */
function findBestCombo(
  candidates: Course[],
  params: StudyPlanParams,
  profile: PlanProfile,
  unlockCounts: Map<string, number>,
  maxYear: number
): Combo {
  const scored = candidates
    .map((course) => ({
      course,
      score: scoreCourse(course, profile, unlockCounts, maxYear),
    }))
    .sort((a, b) => b.score - a.score);

  const target = Math.min(Math.max(profile.targetCredits(params.minCredits, params.maxCredits), params.minCredits), params.maxCredits);
  // Hard cap used during the search — may be tighter than params.maxCredits
  // (see PlanProfile.effectiveMaxCredits), but never looser than it.
  const searchMaxCredits = Math.min(params.maxCredits, profile.effectiveMaxCredits(params.minCredits, params.maxCredits));

  let best: Combo = { courses: [], totalCredits: 0, totalProjects: 0, totalLabs: 0, score: -Infinity };

  function evaluate(chosen: { course: Course; score: number }[]): Combo {
    const totalCredits = chosen.reduce((sum, c) => sum + c.course.credits, 0);
    const totalProjects = chosen.reduce((sum, c) => sum + c.course.projectCount, 0);
    const totalLabs = chosen.reduce((sum, c) => sum + (c.course.hasLab ? 1 : 0), 0);
    const rawScore = chosen.reduce((sum, c) => sum + c.score, 0);
    // Closer to the target credit count scores higher (soft preference).
    const creditFitPenalty = Math.abs(totalCredits - target) * 0.5;
    return {
      courses: chosen.map((c) => c.course),
      totalCredits,
      totalProjects,
      totalLabs,
      score: rawScore - creditFitPenalty,
    };
  }

  // Bounded exhaustive search. For realistic catalog sizes the eligible pool
  // at any one time is small; guard with a hard cap to stay responsive even
  // if the course list grows substantially.
  const SEARCH_CAP = 22;
  const searchable = scored.slice(0, SEARCH_CAP);
  const overflow = scored.slice(SEARCH_CAP); // considered greedily afterward if room remains

  function backtrack(index: number, chosen: { course: Course; score: number }[], credits: number) {
    if (index === searchable.length) {
      const combo = evaluate(chosen);
      if (combo.score > best.score) best = combo;
      return;
    }

    // Prune: even taking everything left can't beat the current best target fit meaningfully.
    if (credits > searchMaxCredits) return;

    const item = searchable[index];
    const { course } = item;

    // Try including this course, if it fits hard constraints.
    const wouldExceedCredits = credits + course.credits > searchMaxCredits;
    const projectsSoFar = chosen.reduce((s, c) => s + c.course.projectCount, 0);
    const labsSoFar = chosen.reduce((s, c) => s + (c.course.hasLab ? 1 : 0), 0);
    const wouldExceedProjects =
      params.maxProjects !== undefined && projectsSoFar + course.projectCount > params.maxProjects;
    const wouldExceedLabs =
      params.maxLabs !== undefined && labsSoFar + (course.hasLab ? 1 : 0) > params.maxLabs;

    if (!wouldExceedCredits && !wouldExceedProjects && !wouldExceedLabs) {
      backtrack(index + 1, [...chosen, item], credits + course.credits);
    }

    // Try excluding this course.
    // Pruning: skip if even with all remaining courses we can't reach target credits
    // and we've already found a combo that reaches it — not essential for correctness,
    // just keeps things fast for larger catalogs.
    backtrack(index + 1, chosen, credits);
  }

  backtrack(0, [], 0);

  // If there's leftover room and unconsidered overflow courses, greedily top up.
  if (overflow.length > 0) {
    let credits = best.totalCredits;
    let projects = best.totalProjects;
    let labs = best.totalLabs;
    const chosen = [...best.courses];
    for (const item of overflow) {
      const { course } = item;
      if (credits + course.credits > searchMaxCredits) continue;
      if (params.maxProjects !== undefined && projects + course.projectCount > params.maxProjects) continue;
      if (params.maxLabs !== undefined && labs + (course.hasLab ? 1 : 0) > params.maxLabs) continue;
      chosen.push(course);
      credits += course.credits;
      projects += course.projectCount;
      labs += course.hasLab ? 1 : 0;
    }
    if (chosen.length !== best.courses.length) {
      best = evaluate(chosen.map((course) => ({ course, score: scoreCourse(course, profile, unlockCounts, maxYear) })));
    }
  }

  return best;
}

function describeUnmetConstraints(combo: Combo, params: StudyPlanParams): string[] {
  const unmet: string[] = [];
  if (combo.totalCredits < params.minCredits) {
    unmet.push(
      `Could not reach the minimum of ${params.minCredits} credits — only ${combo.totalCredits} credits of eligible courses fit within the other constraints.`
    );
  }
  if (params.minProjects !== undefined && combo.totalProjects < params.minProjects) {
    unmet.push(
      `Could not reach the minimum of ${params.minProjects} project(s) — this plan has ${combo.totalProjects}.`
    );
  }
  if (params.minLabs !== undefined && combo.totalLabs < params.minLabs) {
    unmet.push(
      `Could not reach the minimum of ${params.minLabs} lab course(s) — this plan has ${combo.totalLabs}.`
    );
  }
  return unmet;
}

export async function generateStudyPlan(
  params: StudyPlanParams,
  completedCourses: string[],
  plannedCourseCodes: string[] = []
): Promise<StudyPlanResult> {
  const courses = await loadCourses();

  const eligible = courses.filter((c) => {
    if (containsCodeCaseInsensitive(completedCourses, c.code)) return false;
    if (containsCodeCaseInsensitive(plannedCourseCodes, c.code)) return false;
    return prerequisitesMet(c, completedCourses);
  });

  const unlockCounts = computeUnlockCounts(
    courses.filter((c) => !containsCodeCaseInsensitive(completedCourses, c.code))
  );
  const maxYear = courses.reduce((m, c) => Math.max(m, c.year), 1);

  const profiles = buildProfiles(params.goal);

  const seen = new Set<string>();
  const options: StudyPlanOption[] = [];

  for (const profile of profiles) {
    const combo = findBestCombo(eligible, params, profile, unlockCounts, maxYear);
    const signature = combo.courses
      .map((c) => normalize(c.code))
      .sort()
      .join(",");

    if (seen.has(signature) && options.length > 0) {
      // Avoid presenting duplicate plans if two profiles converge on the same result.
      continue;
    }
    seen.add(signature);

    options.push({
      label: profile.label,
      reason: profile.reason,
      courses: combo.courses,
      totalCredits: combo.totalCredits,
      totalProjects: combo.totalProjects,
      totalLabs: combo.totalLabs,
      unmetConstraints: describeUnmetConstraints(combo, params),
    });
  }

  return { options };
}

/** P1 — list_remaining_courses (needs course list + student's completed list) */
export async function getRemainingCourses(
  completedCourses: string[],
  includeElectives = true
): Promise<Course[]> {
  const courses = await loadCourses();
  return courses.filter((c) => {
    if (containsCodeCaseInsensitive(completedCourses, c.code)) return false;
    if (!includeElectives && c.type === "Elective") return false;
    return true;
  });
}
