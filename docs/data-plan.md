# Data Plan

**Project:** Computer Engineering Course Planner MCP Server
**Repository:** [Building-an-MCP-for-an-AI-Engine (week-3-data branch)](https://github.com/jen2024-rim/Building-an-MCP-for-an-AI-Engine/tree/week-3-data)

## Introduction

This document defines the data sources for each tool **before** implementing the handlers. Planning the data sources early helps avoid scope creep and ensures every P0/P1 tool has a clear data source and expected response before coding begins.

The input fields and example responses below are based on the actual `src/schemas/*.ts` and `src/tools/*.ts` files in the `week-3-data` branch (not placeholders), so this plan reflects what the code currently does.

## Data Source Plan

| Tool | Priority | Source | Fixture Path | Auth | Failure Modes | Example Response |
|------|----------|--------|--------------|------|---------------|------------------|
| search_courses | P0 | Local JSON | data/courses.json | None | True | See JSON example |
| check_prerequisites | P0 | Local JSON | data/courses.json + data/student.json | None | True | See JSON example |
| generate_study_plan | P0 | Local JSON | data/courses.json + data/student.json | None | True | See JSON example |
| list_completed_courses | P1 | Local JSON | data/student.json | None | True | See JSON example |
| list_remaining_courses | P1 | Local JSON | data/courses.json + data/student.json | None | True | See JSON example |
| add_course_to_plan | P1 | Local JSON | data/student.json | None | True | See JSON example |

## Example Responses

### search_courses

**Input (from tool code):** `query` (string), `limit` (number, optional — defaults to 5 in code, but not yet declared in the schema, see Known Issues).

```json
{
  "courses": [
    {
      "code": "COMP231",
      "name": "Data Structures",
      "credits": 3,
      "level": 2,
      "category": "Software",
      "type": "Core",
      "prerequisites": ["COMP111"],
      "description": "Introduction to data structures and algorithm analysis."
    }
  ],
  "count": 1
}
```

### check_prerequisites

**Input:** `courseCode` (string), `completedCourses` (string array).

```json
{
  "courseCode": "COMP231",
  "eligible": false,
  "missingPrerequisites": ["COMP112"]
}
```

### generate_study_plan

**Input (from tool code):** `creditLimit` (number), `preferredCategories` (string array), `completedCourses` (string array).
*Note: the schema currently names these `maxCredits` / `preferredCategory` — see Known Issues below.*

```json
{
  "recommendedCourses": [
    { "code": "COMP231", "name": "Data Structures", "credits": 3, "category": "Software" },
    { "code": "COMP346", "name": "Computer Networks", "credits": 3, "category": "Networks" }
  ],
  "totalCredits": 15,
  "creditLimit": 18
}
```

### list_completed_courses

**Input:** `studentId` (string).

```json
{
  "studentId": "120230123",
  "completedCourses": ["COMP111", "COMP112", "MATH101"]
}
```

### list_remaining_courses

**Input:** `studentId` (string), `includeElectives` (boolean, optional).

```json
{
  "studentId": "120230123",
  "includeElectives": true,
  "remainingCourses": ["COMP231", "COMP346", "COMP431"]
}
```

### add_course_to_plan

**Input (from tool code):** `courseCode` (string), `semester` (string), `priority` (`"required"` | `"elective"`, optional).
*Note: no `studentId` in the current schema/tool — see Known Issues below.*

```json
{
  "success": true,
  "courseAdded": "COMP231",
  "semester": "Fall 2026",
  "priority": "required"
}
```

## Known Issues (to fix before Week 3 implementation)

- **generate_study_plan:** the schema defines `maxCredits` and `preferredCategory` (singular), but the tool code destructures `creditLimit` and `preferredCategories` (plural). These names must match, or the values will be `undefined` at runtime.
- **search_courses:** the tool code reads a `limit` parameter, but `limit` is not declared in `searchCoursesInputSchema`. It should be added (e.g. `z.number().int().positive().optional()`).
- **add_course_to_plan:** neither the schema nor the tool code accepts a `studentId`, so there is currently no way to know which student's plan is being updated. The example input file (`examples/add_course_to_plan.json`) includes a `studentId` that the schema does not define. This should be resolved — either add `studentId` to the schema, or explicitly document that the tool always acts on a single default/current student.

## Notes

- All tools use Local JSON files during Week 3.
- The project is designed to support an API in Week 4 while keeping JSON files as an offline fallback.
- Authentication is not required.
- Failure Modes are marked as True because they will be handled during implementation.
- The fixture files are:
  - `data/courses.json`
  - `data/student.json`
