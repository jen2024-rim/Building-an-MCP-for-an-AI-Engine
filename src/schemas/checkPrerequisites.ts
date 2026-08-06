import * as z from "zod/v4";

// Schema for check_prerequisites tool
export const checkPrerequisitesInputSchema = z.object({
  courseCode: z
    .string()
    .min(1)
    .max(20)
    .describe("Course code to check prerequisites for"),
});
