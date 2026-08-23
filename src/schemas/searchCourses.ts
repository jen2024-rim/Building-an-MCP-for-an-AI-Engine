import * as z from "zod/v4";

// Schema for search_courses tool
export const searchCoursesInputSchema = z.object({
  query: z
    .string()
    .max(200)
    .optional()
    .describe(
      "Optional keyword to search for in the course name, code, or description (case-insensitive)."
    ),

  category: z
    .string()
    .min(1)
    .max(50)
    .optional()
    .describe(
      "Optional filter matched case-insensitively against either the requirement type " +
        '(e.g. "University Requirement", "College Requirement", "Specialization Requirement", ' +
        '"Specialization Elective") or the specialization area (e.g. "AI", "Hardware", "Software", "Networks"). ' +
        "Can be used on its own without a query."
    ),

  limit: z
    .number()
    .int()
    .positive()
    .max(20)
    .optional()
    .describe("Maximum number of results to return (default 5, capped at 20)"),
});
