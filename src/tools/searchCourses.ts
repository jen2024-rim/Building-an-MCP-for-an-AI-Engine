import { searchCourses } from "../lib/courses.js";

export async function searchCoursesHandler(input: {
  query: string;
  category?: string;
  limit?: number;
}) {
  try {
    const results = await searchCourses(input.query, input.category, input.limit ?? 5);

    if (results.length === 0) {
      return {
        content: [
          { type: "text", text: JSON.stringify({ courses: [], message: "No courses matched your search." }) },
        ],
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify({ courses: results, count: results.length }) }],
    };
  } catch (err) {
    console.error(`[search_courses] failed: ${(err as Error).message}`);
    return {
      content: [{ type: "text", text: "Sorry, I couldn't search courses right now." }],
      isError: true,
    };
  }
}
