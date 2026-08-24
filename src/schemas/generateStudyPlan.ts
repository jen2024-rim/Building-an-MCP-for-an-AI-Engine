import * as z from "zod/v4";

// Schema for generate_study_plan tool
// NOTE: cross-field checks (minCredits <= maxCredits, etc.) are enforced in the
// handler rather than via .refine(), because registerTool() needs the raw
// object shape (schema.shape) to build the tool's JSON schema, and .refine()
// wraps the schema in a ZodEffects that no longer exposes .shape.
export const generateStudyPlanInputSchema = z.object({
  minCredits: z
    .number()
    .int()
    .nonnegative()
    .describe("Minimum number of credits the plan should try to reach for the semester"),

  maxCredits: z
    .number()
    .int()
    .positive()
    .max(18)
    .describe("Maximum number of credits the plan must not exceed for the semester"),

  minProjects: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Optional minimum number of project-bearing courses the plan should try to include"),

  maxProjects: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Optional maximum number of project-bearing courses the plan must not exceed"),

  minLabs: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Optional minimum number of lab courses the plan should try to include"),

  maxLabs: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Optional maximum number of lab courses the plan must not exceed"),

  goal: z
    .enum(["stay_on_track", "reduce_workload", "graduate_sooner"])
    .optional()
    .describe(
      "Optional planning preference. " +
        '"stay_on_track" balances progress and workload, ' +
        '"reduce_workload" favors fewer projects/labs and a lighter credit load, ' +
        '"graduate_sooner" favors packing in more credits and courses that unlock future courses.'
    ),
});

/**
 * Cross-field validation that Zod's object schema alone can't express
 * without losing .shape (see note above). Returns a user-facing error
 * message, or null if the input is valid.
 */
export function validateStudyPlanRanges(input: {
  minCredits: number;
  maxCredits: number;
  minProjects?: number;
  maxProjects?: number;
  minLabs?: number;
  maxLabs?: number;
}): string | null {
  if (input.minCredits > input.maxCredits) {
    return "minCredits must be less than or equal to maxCredits.";
  }
  if (
    input.minProjects !== undefined &&
    input.maxProjects !== undefined &&
    input.minProjects > input.maxProjects
  ) {
    return "minProjects must be less than or equal to maxProjects.";
  }
  if (input.minLabs !== undefined && input.maxLabs !== undefined && input.minLabs > input.maxLabs) {
    return "minLabs must be less than or equal to maxLabs.";
  }
  return null;
}
