import { loadCourses, searchCourses, checkPrerequisites, generateStudyPlan, getCourseByCode } from "./lib/courses.js";
import { loadStudent, listCompletedCourses, listRemainingCourses, flattenCurrentPlan } from "./lib/student.js";

async function main() {
  console.log("== loadCourses() ==");
  const courses = await loadCourses();
  console.log(`Loaded ${courses.length} courses. First one:`, courses[0]);

  console.log("\n== loadStudent() ==");
  const student = await loadStudent();
  console.log("Student:", student);

  console.log("\n== getCourseByCode case-insensitivity (' Encs2340 ') ==");
  console.log(getCourseByCode(courses, " Encs2340 "));

  console.log("\n== searchCourses('calculus') ==");
  console.log(await searchCourses("calculus"));

  console.log("\n== searchCourses(undefined, 'college requirement') — category-only, case-insensitive ==");
  console.log(await searchCourses(undefined, "COLLEGE REQUIREMENT", 3));

  console.log("\n== checkPrerequisites('encs2380') ==");
  console.log(await checkPrerequisites("encs2380", student.completedCourses));

  console.log("\n== generateStudyPlan ==");
  const plannedCourseCodes = flattenCurrentPlan(student);
  console.log(
    await generateStudyPlan(
      { minCredits: 12, maxCredits: student.maxCredits, maxProjects: 2, maxLabs: 1, goal: "stay_on_track" },
      student.completedCourses,
      plannedCourseCodes
    )
  );

  console.log("\n== listCompletedCourses ==");
  console.log(await listCompletedCourses());

  console.log("\n== listRemainingCourses ==");
  console.log(await listRemainingCourses());

  console.log("\n✅ All smoke tests ran without crashing.");
}

main().catch((err) => {
  console.error("❌ Smoke test failed:", err);
  process.exit(1);
});
