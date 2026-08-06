import { loadCourses, searchCourses, checkPrerequisites, generateStudyPlan } from "./lib/courses.js";
import { loadStudent, listCompletedCourses, listRemainingCourses } from "./lib/student.js";

async function main() {
  console.log("== loadCourses() ==");
  const courses = await loadCourses();
  console.log(`Loaded ${courses.length} courses. First one:`, courses[0]);

  console.log("\n== loadStudent() ==");
  const student = await loadStudent();
  console.log("Student:", student);

  console.log("\n== searchCourses('calculus') ==");
  console.log(await searchCourses("calculus"));

  console.log("\n== checkPrerequisites ==");
  console.log(await checkPrerequisites("MATH1321", student.completedCourses));

  console.log("\n== generateStudyPlan ==");
  console.log(await generateStudyPlan(student.maxCredits, [], student.completedCourses));

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
