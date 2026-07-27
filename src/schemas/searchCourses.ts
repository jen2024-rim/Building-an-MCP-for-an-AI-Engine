import * as z from "zod/v4";

// Schema for search_courses tool
export const searchCoursesInputSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(200)
    .describe("Course name, code, or category keyword to search for"),

  category: z
    .string()
    .optional()
    .describe("Optional course category such as AI, Networks, or Hardware"),
});