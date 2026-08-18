import * as z from "zod/v4";

// Schema for search_courses tool
export const searchCoursesInputSchema = z.object({
  query: z
    .string()
    .max(200)
    .optional()
    .describe("Optional course name, code, or category keyword to search for"),

  category: z
    .string()
    .min(1)
    .max(50)
    .optional()
    .describe("Optional course category such as AI, Networks, or Hardware"),

  limit: z
    .number()
    .int()
    .positive()
    .max(20)
    .optional()
    .describe("Maximum number of results to return (default 5, capped at 20)"),
});
