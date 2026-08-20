# Example Conversations

## Conversation A — Search for an Arabic Language Course

### User Prompt
> Find the Arabic Language course in my course catalog.

### Expected Tool Call
1. `search_courses`
   * Search for courses related to Arabic Language.

### Good Final Answer
> I found two Arabic Language courses:
>
> * **ARAB135 – Arabic Language Skills 1** — 3 credits, University Requirement (Core), no prerequisites.
> * **ARAB136 – Arabic Language Skills 2** — 3 credits, University Requirement (Core), prerequisite: ARAB135.

---

## Conversation B — Check Digital Course Prerequisites

### User Prompt
> Can I take the Digital course right now? Check its prerequisites based on my completed courses.

### Expected Tool Call
1. `check_prerequisites`
   * `courseCode`: `ENCS2340`

### Good Final Answer
> You cannot take **ENCS2340 – Digital Systems** yet because you still need to complete **COMP133** first.

---

## Conversation C — Generate a 14-Credit Study Plan

### User Prompt
> Create a study plan for me with exactly 14 credit hours. Include a mix of university requirements, college requirements, and major requirements, and include only one lab course.

### Expected Tool Call
1. `generate_study_plan`
   * Maximum/target credits: `14`

### Good Final Answer
> Here is a 14-credit study plan:
>
> | Course                             | Credits | Category                  |
> | ----------------------------------- | ------: | -------------------------- |
> | ARAB136 – Arabic Language Skills 2 |       3 | University Requirement    |
> | ENGC1201 – Intermediate English 1  |       2 | University Requirement    |
> | COMP133 – Computer and Programming |       3 | Faculty Requirement       |
> | MATH1321 – Calculus 2              |       3 | Faculty Requirement       |
> | ENME121 – Engineering Drawing      |       2 | Faculty Requirement       |
> | PHYS112 – General Physics Lab 2    |       1 | Faculty Requirement — Lab |
>
> **Total: 14 credit hours.**
>
> The plan contains one lab course. Major courses were not included because their prerequisites require completing COMP133 first.
