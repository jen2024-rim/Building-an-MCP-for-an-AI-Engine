## Peer Review Checklist — Computer Engineering Course Planner MCP Server

## P eer Reviewer Information

| Field | Value |
| --- | --- |
| Reviewer | Roa Makhtoub |
| Review Date | August 12, 2026 |
| Project | Computer Engineering Course Planner |
|   | MCP Server |
| Reviewing Team | Job Application Tracker – SMR Team |
| Review Type | On-site peer review |
| Scope | Schemas, handlers, supporting library |
|   | logic, input validation, error handling, data |
|   | handling, and behavior via MCP Inspector |

## D ocumentation of Review Notification

The screenshot below documents the peer review summary email sent by Roa Makhtoub on August 12, 2026.


## S ummary

- All three P0 tools passed their main functional tests.

- No P0 / must-fix security issue was identified.

- ⚠️ Findings identified are minor: functional, schema/implementation consistency, case-sensitivity, data consistency, and usability issues.

- 🔧 Recommendations are currently being addressed on the week-4-harden branch as part of Week 4 hardening.

## P 0 #1 — search_courses

## Passed Checks

| Check | Result |
| --- | --- |
| Search by course name | Pass |
| Search by course code | Pass |
| Case-insensitive search (name & code) | Pass |
| Category filter (valid category) | Pass |
| Empty input validation (Zod) | Pass |

## ⚠️ Minor Findings / Recommendations

| # | Finding | Recommendation |
| --- | --- | --- |
| 1 | Searching by category via | Either extend the search to |
|   | the query field returns no | also check category, or |
|   | results — the search logic | update the schema |
|   | only checks course name | description to only claim |
|   | and course code, not | name/code support |
|   | category |   |
| 2 | Category filter is | Consider normalizing |
|   | case-sensitive | category input/stored |
|   |   | values if case-insensitive |
|   |   | filtering is intended |

## N ot Tested

- Limit testing — could not be completed because MCP Inspector automatically sent an empty category value when the field was left blank, causing schema validation to fail.

## Severity

Minor functional/documentation issue. Not a P0 security issue.


## O verall Assessment

search_courses handles normal course-name and course-code searches correctly, including case-insensitive queries. Input validation, course-data validation, output limiting, and controlled error handling are implemented appropriately.

No P0/must-fix security issue identified.

## P 0 #2 — check_prerequisites

## Passed Checks

| Check | Result |
| --- | --- |
| Valid course lookup | Pass |
| Missing prerequisites | Pass |
| Completed prerequisites | Pass |
| Non-existing course | Pass |
| Empty course code | Pass |
| 20-character input | Pass |
| Internal error handling | Pass |

## ⚠️ Minor Recommendations

| # | Recommendation |
| --- | --- |
| 1 | Case-insensitive course-code matching |
|   | — course-code matching is currently |
|   | case-sensitive; consider normalizing codes |
|   | if case-insensitive matching is intended |
| 2 | More actionable error message — |
|   | current generic error message is safe (no |
|   | internal details exposed) but could be |
|   | improved to indicate the course may not |
|   | exist |

## O verall Assessment

check_prerequisites correctly identifies missing and completed prerequisites, validates course-code input, and safely handles non-existing courses and internal errors.

No P0/must-fix security issue identified.


## P 0 #3 — generate_study_plan

## Passed Checks

| Check | Result |
| --- | --- |
| Valid maxCredits | Pass |
| Maximum allowed value (21) | Pass |
| Zero value | Pass |
| Negative values | Pass |
| Integer validation | Pass |
| Credit limit enforcement | Pass |
| Completed courses exclusion | Pass |
| Prerequisite checking | Pass |
| Internal error handling | Pass |
| Small credit limits | Pass |
| Available eligible courses | Pass |

## ⚠️ Minor Recommendations / Findings

| # | Finding | Recommendation |
| --- | --- | --- |
| 1 | Schema/Handler | Ensure exposed input fields |
|   | Mismatch — | accurately represent |
|   | preferredCategory exists in | handler functionality |
|   | handler and supporting |   |
|   | library but not in the |   |
|   | schema |   |
| 2 | Case Sensitivity — | Consider normalizing |
|   | course-code comparisons | course codes if |
|   | are case-sensitive | case-insensitive matching |
|   |   | is intended |
| 3 | Generic Error Message — | Improve message while |
|   | safe, but could be more | avoiding exposure of |
|   | actionable | internal implementation |
|   |   | details |
| 4 | Data Inconsistency — | Correct the inconsistent |
|   | ENGL1201 (student.json) | course code so student |
|   | vs. ENGC1201 | data and course data use |
|   | (courses.json) | the same identifier |
| 5 | Greedy Planning — | Future enhancement for |
|   | algorithm selects courses | study-plan optimization; not |
|   | sequentially within the | a P0 issue |
|   | credit limit but doesn't |   |


#

Finding

Recommendation

guarantee the optimal combination

## O verall Assessment

generate_study_plan correctly validates the credit limit, respects the maximum, excludes completed courses, checks prerequisites, handles small credit limits, and safely handles internal errors.

No P0/must-fix security issue identified.

## F inal Peer Review Summary

Overall, the three P0 tools passed their main functional tests.

Findings identified during the review relate mainly to:

- Schema/implementation consistency

- Case sensitivity

- Data consistency

- Usability

- Documentation accuracy

- Future study-plan optimization

No P0/must-fix security issue was identified during the review.

The peer reviewer confirmed that core functionality, validation, and controlled error handling across the three P0 tools are working appropriately.

## P ost-Review Improvement Work

Following the peer review, the identified findings and recommendations are being actively addressed. Improvements in progress:

- Schema and handler consistency

- Search behavior and documentation accuracy

- Case handling where appropriate

- Course-data consistency

- Error-message usability

- Overall reliability and maintainability

These improvements are being implemented on the week-4-harden branch as part of the


Week 4 hardening process, with the goal of improving consistency, robustness, and usability before the final Demo Day stage.

## P 0 Findings

No P0/must-fix security findings were identified during the peer review. Therefore, there are no P0 security fixes required from this peer review.

## A ction Items

- 1. Resolve the mismatch between the query field description and the actual search_courses implementation.

- 2. Review category case-sensitivity behavior.

- 3. Review course-code case-sensitivity behavior across the tools.

- 4. Review the preferredCategory schema/handler mismatch in generate_study_plan.

- 5. Correct the ENGL1201 / ENGC1201 course-code inconsistency.

- 6. Review error messages and make them more actionable while maintaining safe error handling.

- 7. Consider improving the study-plan algorithm in the future to support more optimal course combinations.

## R eview Status

| Field | Value |
| --- | --- |
| Peer review completed | August 12, 2026 |
| Peer reviewer | Roa Makhtoub |
| P0 security findings | None |
| Current status | Improvements and recommended fixes are |
|   | being worked on (week-4-harden branch) |
