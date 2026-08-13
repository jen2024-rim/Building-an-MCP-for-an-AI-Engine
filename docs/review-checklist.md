# Peer Review Checklist — Computer Engineering Course Planner MCP Server

## Peer Reviewer Information

| Field | Value |
|---|---|
| **Reviewer** | Roa Makhtoub |
| **Review Date** | August 12, 2026 |
| **Project** | Computer Engineering Course Planner MCP Server |
| **Reviewing Team** | Job Application Tracker – SMR Team |
| **Review Type** | On-site peer review |
| **Scope** | Schemas, handlers, supporting library logic, input validation, error handling, data handling, and behavior via MCP Inspector |

### Documentation of Review Notification

The screenshot below documents the peer review summary email sent by Roa Makhtoub on August 12, 2026.

![Peer review email from Roa Makhtoub](./peer-review-email-screenshot.png)

---

## Summary

- ✅ All three P0 tools **passed** their main functional tests.
- ✅ **No P0 / must-fix security issue** was identified.
- ⚠️ Findings identified are minor: functional, schema/implementation consistency, case-sensitivity, data consistency, and usability issues.
- 🔧 Recommendations are currently being addressed on the `week-4-harden` branch as part of Week 4 hardening.

---

## P0 #1 — `search_courses`

### ✅ Passed Checks

| Check | Result |
|---|---|
| Search by course name | Pass |
| Search by course code | Pass |
| Case-insensitive search (name & code) | Pass |
| Category filter (valid category) | Pass |
| Empty input validation (Zod) | Pass |

### ⚠️ Minor Findings / Recommendations

| # | Finding | Recommendation |
|---|---|---|
| 1 | Searching by category via the `query` field returns no results — the search logic only checks course name and course code, not category | Either extend the search to also check category, **or** update the schema description to only claim name/code support |
| 2 | Category filter is case-sensitive | Consider normalizing category input/stored values if case-insensitive filtering is intended |

### Not Tested
- **Limit testing** — could not be completed because MCP Inspector automatically sent an empty category value when the field was left blank, causing schema validation to fail.

### Severity
Minor functional/documentation issue. **Not a P0 security issue.**

### Overall Assessment
`search_courses` handles normal course-name and course-code searches correctly, including case-insensitive queries. Input validation, course-data validation, output limiting, and controlled error handling are implemented appropriately.

**✅ No P0/must-fix security issue identified.**

---

## P0 #2 — `check_prerequisites`

### ✅ Passed Checks

| Check | Result |
|---|---|
| Valid course lookup | Pass |
| Missing prerequisites | Pass |
| Completed prerequisites | Pass |
| Non-existing course | Pass |
| Empty course code | Pass |
| 20-character input | Pass |
| Internal error handling | Pass |

### ⚠️ Minor Recommendations

| # | Recommendation |
|---|---|
| 1 | **Case-insensitive course-code matching** — course-code matching is currently case-sensitive; consider normalizing codes if case-insensitive matching is intended |
| 2 | **More actionable error message** — current generic error message is safe (no internal details exposed) but could be improved to indicate the course may not exist |

### Overall Assessment
`check_prerequisites` correctly identifies missing and completed prerequisites, validates course-code input, and safely handles non-existing courses and internal errors.

**✅ No P0/must-fix security issue identified.**

---

## P0 #3 — `generate_study_plan`

### ✅ Passed Checks

| Check | Result |
|---|---|
| Valid `maxCredits` | Pass |
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

### ⚠️ Minor Recommendations / Findings

| # | Finding | Recommendation |
|---|---|---|
| 1 | **Schema/Handler Mismatch** — `preferredCategory` exists in handler and supporting library but not in the schema | Ensure exposed input fields accurately represent handler functionality |
| 2 | **Case Sensitivity** — course-code comparisons are case-sensitive | Consider normalizing course codes if case-insensitive matching is intended |
| 3 | **Generic Error Message** — safe, but could be more actionable | Improve message while avoiding exposure of internal implementation details |
| 4 | **Data Inconsistency** — `ENGL1201` (student.json) vs. `ENGC1201` (courses.json) | Correct the inconsistent course code so student data and course data use the same identifier |
| 5 | **Greedy Planning** — algorithm selects courses sequentially within the credit limit but doesn't guarantee the optimal combination | Future enhancement for study-plan optimization; **not a P0 issue** |

### Overall Assessment
`generate_study_plan` correctly validates the credit limit, respects the maximum, excludes completed courses, checks prerequisites, handles small credit limits, and safely handles internal errors.

**✅ No P0/must-fix security issue identified.**

---

## Final Peer Review Summary

Overall, the three P0 tools **passed their main functional tests**.

Findings identified during the review relate mainly to:
- Schema/implementation consistency
- Case sensitivity
- Data consistency
- Usability
- Documentation accuracy
- Future study-plan optimization

**No P0/must-fix security issue was identified during the review.**

The peer reviewer confirmed that core functionality, validation, and controlled error handling across the three P0 tools are working appropriately.

---

## Post-Review Improvement Work

Following the peer review, the identified findings and recommendations are being actively addressed. Improvements in progress:

- Schema and handler consistency
- Search behavior and documentation accuracy
- Case handling where appropriate
- Course-data consistency
- Error-message usability
- Overall reliability and maintainability

These improvements are being implemented on the **`week-4-harden`** branch as part of the Week 4 hardening process, with the goal of improving consistency, robustness, and usability before the final Demo Day stage.

---

## P0 Findings

**No P0/must-fix security findings were identified during the peer review.**
Therefore, there are no P0 security fixes required from this peer review.

---

## Action Items

- [ ] 1. Resolve the mismatch between the `query` field description and the actual `search_courses` implementation.
- [ ] 2. Review category case-sensitivity behavior.
- [ ] 3. Review course-code case-sensitivity behavior across the tools.
- [ ] 4. Review the `preferredCategory` schema/handler mismatch in `generate_study_plan`.
- [ ] 5. Correct the `ENGL1201` / `ENGC1201` course-code inconsistency.
- [ ] 6. Review error messages and make them more actionable while maintaining safe error handling.
- [ ] 7. Consider improving the study-plan algorithm in the future to support more optimal course combinations.

---

## Review Status

| Field | Value |
|---|---|
| **Peer review completed** | August 12, 2026 |
| **Peer reviewer** | Roa Makhtoub |
| **P0 security findings** | None |
| **Current status** | Improvements and recommended fixes are being worked on (`week-4-harden` branch) |
