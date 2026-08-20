# Week 5 Manual Test Plan — Computer Engineering Course Planner MCP

**Scope:** Manual testing of the three P0 tools via MCP Inspector, using local JSON fixtures under `./data`. This project does not use an external API; the offline/error scenario simulates a local fixture/data-loading failure rather than a network timeout.

**P0 Tools:**
1. `search_courses`
2. `check_prerequisites`
3. `generate_study_plan`

| id | tool | setup | input | expected | result | evidence |
|----|------|-------|-------|----------|--------|----------|
| TC-01 | search_courses | Clean course fixtures loaded from `./data`. | Search for a known course by name. | The matching course is returned with its course code and relevant information. | PASS | search-happy-path.png |
| TC-02 | search_courses | Clean course fixtures loaded from `./data`. | Search for a known course using different capitalization. | The same course is returned regardless of capitalization. | PASS | search-case-insensitive.png |
| TC-03 | search_courses | Clean course fixtures loaded from `./data`. | Use a valid course category, including a capitalization variation if supported by the current implementation. | Matching courses are returned. | PASS | search-category-filter.png |
| TC-04 | search_courses | Clean course fixtures loaded from `./data`. | Empty query. | Zod validation rejects the input cleanly without exposing internal details. | PASS | validation-rejection.png |
| TC-05 | check_prerequisites | Clean `student.json` and `courses.json` fixtures. | Valid existing course code. | The tool correctly reports the course prerequisites and whether they are completed. | PASS | prereq-happy-path.png |
| TC-06 | check_prerequisites | Clean `student.json` and `courses.json` fixtures. | A course code that does not exist. | A safe not-found/error response is returned without exposing a stack trace. | PASS | empty-error.png |
| TC-07 | check_prerequisites | Clean `student.json` and `courses.json` fixtures. | Empty course code. | Zod validation rejects the input cleanly. | PASS | prereq-validation.png |
| TC-08 | generate_study_plan | Clean `student.json` and `courses.json` fixtures. | `maxCredits: 12`. | A valid study plan is returned without exceeding 12 credits. Completed courses are excluded and prerequisites are respected. | PASS | plan-happy-path.png |
| TC-09 | generate_study_plan | Clean `student.json` and `courses.json` fixtures. | `maxCredits: 0` or a negative value. | Zod validation rejects the invalid value. | PASS | plan-validation.png |
| TC-10 | (any P0 tool) | Simulate a local data-source failure by temporarily making the required JSON fixture unavailable or otherwise causing the data-loading operation to fail. Do not permanently modify or delete the real fixture. | Run a P0 tool while the required local fixture is unavailable. | The tool returns a short, safe user-facing error and does not expose a stack trace or crash the server. This is a simulated local fixture/data-loading failure, not a network timeout. | PASS | fixture-load-error.png |

**Notes:**
- All test cases above were executed and confirmed passing in MCP Inspector prior to this write-up.
- No external API is used or was introduced for testing purposes.
- No source code was modified as part of this test plan.
