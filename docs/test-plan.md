# Week 5 Manual Test Plan — Computer Engineering Course Planner MCP

**Scope:** Manual testing of the three P0 tools via MCP Inspector, using local JSON fixtures under `./data`. This project does not use an external API.

## P0 Tools

1. `search_courses`
2. `check_prerequisites`
3. `generate_study_plan`

| ID | Tool | Setup | Input | Expected | Result | Evidence |
|---|---|---|---|---|---|---|
| TC-01 | `search_courses` | Clean course fixtures loaded from `./data`. | Search for a known course by name. | The matching course is returned with its course code and relevant information. | PASS | [Search happy path — input](<./evidence/search-happy-path(input).png>) / [output](<./evidence/search-happy-path(output).png>) |
| TC-02 | `search_courses` | Clean course fixtures loaded from `./data`. | Search for a known course using different capitalization. | The same course is returned regardless of capitalization. | PASS | [Case-insensitive input](<./evidence/search-case-insensitive(input).png>) / [output](<./evidence/search-case-insensitive(output).png>) |
| TC-03 | `search_courses` | Clean course fixtures loaded from `./data`. | Empty query. | Zod validation rejects the input cleanly without exposing internal details. | PASS | [Search validation](<./evidence/search-validation.png>) |
| TC-04 | `check_prerequisites` | Clean `student.json` and `courses.json` fixtures. | Valid existing course code. | The tool correctly reports the course prerequisites and whether they are completed. | PASS | [Prerequisites happy path](<./evidence/prereq-happy-path.png>) |
| TC-05 | `check_prerequisites` | Clean `student.json` and `courses.json` fixtures. | A course code that does not exist, such as `FAKE9999`. | A safe not-found/error response is returned without exposing a stack trace. | PASS | [Prerequisites not found](<./evidence/prereq-not-found.png>) |
| TC-06 | `generate_study_plan` | Clean `student.json` and `courses.json` fixtures. | `maxCredits: 12`. | A valid study plan is returned without exceeding 12 credits. Completed courses are excluded and prerequisites are respected. | PASS | [Study plan happy path](<./evidence/plan-happy-path.png>) |
| TC-07 | `generate_study_plan` | Clean `student.json` and `courses.json` fixtures. | `maxCredits: 0`. | Zod validation rejects the invalid value cleanly. | PASS | [Zero credits validation](<./evidence/plan-validation-zero.png>) |
| TC-08 | `generate_study_plan` | Clean `student.json` and `courses.json` fixtures. | `maxCredits: -5`. | Zod validation rejects the invalid value cleanly. | PASS | [Negative credits validation](<./evidence/plan-validation-negative.png>) |

## Notes

- All eight test cases listed above were executed and passed in MCP Inspector.
- Screenshots were captured for the tested happy-path, validation, and error scenarios.
- `generate_study_plan` validation was tested separately with both `maxCredits: 0` and a negative value.
- No external API is used for testing.
- No source code was modified as part of these tests.
- All Inspector evidence is committed under `docs/evidence/`.
