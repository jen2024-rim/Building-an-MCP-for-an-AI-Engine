# Week 6 — Demo Day Script (3–5 minutes)

**Project:** Computer Engineering Course Planner MCP Server
**Presenter:** Jeneen Mohsen Sattouf — Birzeit University, Computer Engineering
**Repository:** `jen2024-rim/Building-an-MCP-for-an-AI-Engine` (branch: `week-6-ship`)

---

## 1. Demo Overview

- **Project name:** `course-planner-mcp` (server name/version declared in `src/index.ts` as `course-planner-mcp`, `0.2.0`).
- **What it does:** An MCP (Model Context Protocol) server that lets an AI host — Claude — search a Computer Engineering course catalog, check whether a student meets a course's prerequisites, and generate a semester study plan within credit/project/lab constraints. All data comes from local JSON fixtures, not a live university system.
- **Target user:** A Computer Engineering student at Birzeit University planning their next semester (the bundled fixture data is the presenter's own student record, ID `1221682`).
- **Technologies actually used:** TypeScript, Node.js 20+, `@modelcontextprotocol/sdk`, Zod v4 for input validation, `tsx` for running the server, stdio transport, MCP Inspector for manual testing. No external API and no database — everything reads from `data/courses.json` and `data/student.json`.
- **Tools implemented (7):** `search_courses`, `check_prerequisites`, `generate_study_plan`, `list_completed_courses`, `list_remaining_courses`, `add_course_to_plan`, `complete_course`.

---

## 2. Slide-by-Slide Plan (5 slides)

### Slide 1 — Title
**On slide:**
- Computer Engineering Course Planner — an MCP Server
- Jeneen Mohsen Sattouf · Birzeit University · Computer Engineering
- NxtFlows Academy — Building an MCP for an AI Engine

**Say:** "Hi, I'm Jeneen. I built an MCP server that helps Computer Engineering students plan their semester by talking to Claude in plain language."

### Slide 2 — Problem
**On slide:**
- Students juggle prerequisites, credit limits, and course categories by hand
- Course info lives in scattered PDFs / advisor memory
- Claude alone can't see *your* real academic record

**Say:** "Planning a semester means checking prerequisites, credit limits, and category requirements all at once — and Claude has no way to see my actual transcript or the course catalog unless I give it tools to look."

### Slide 3 — Architecture
**On slide:**
- AI host (Claude / MCP Inspector) → MCP server (stdio) → 7 tools → `src/lib/` → `data/courses.json`, `data/student.json`
- Every tool input validated with a Zod schema before it touches any logic

**Say:** "Claude talks to my server over stdio using the MCP SDK. Every tool call is validated by a Zod schema first, then handed to plain business logic in `src/lib`, which reads the two local JSON fixture files — the course catalog and my student record."

### Slide 4 — Tools
**On slide:**
- `search_courses` — find courses by name / code / category
- `check_prerequisites` — am I eligible for this course?
- `generate_study_plan` — build a semester plan under credit/project/lab limits
- + `list_completed_courses`, `list_remaining_courses`, `add_course_to_plan`, `complete_course`

**Say:** "There are seven tools total. Today I'll demo the three core ones live: searching, checking prerequisites, and generating a study plan."

### Slide 5 — Next Steps
**On slide:**
- Add a "preferred area" filter to `generate_study_plan` (AI / Hardware / Software / Networks)
- Replace local JSON fixtures with a live course-registration API
- Add an automated test suite (currently manual testing via MCP Inspector)

**Say:** "Next, I'd like to let students filter a study plan by their preferred specialization area, move from static JSON files to a live data source, and add automated tests on top of the manual Inspector test plan I have now."

---

## 3. Detailed Timed Speaking Script

### 0:00–0:40 — Problem

> "Every semester I have to figure out: what courses am I even eligible for, given what I've already completed? What fits under my credit limit? How many labs or projects am I taking on at once? Right now that means manually cross-referencing a course catalog against my own transcript. Claude is great at reasoning through that kind of thing in natural language — but only if it can actually see the data. That's the gap this project closes: an MCP server that gives Claude real, structured access to a course catalog and a student record, instead of me typing all of that into a prompt by hand."

### 0:40–1:10 — Architecture

> "The setup is simple. Claude — or, for testing, MCP Inspector — connects to my server over stdio using the official MCP SDK. The server registers seven tools, each with a Zod schema that validates the input before any logic runs. The handlers call into plain TypeScript functions in `src/lib` — course lookup, prerequisite checking, plan generation — which read two local JSON files: `data/courses.json`, a 25-course Computer Engineering catalog, and `data/student.json`, my own completed courses and current plan. No external API, no database — just validated tool calls over local fixture data."

### 1:10–3:30 — Live Demo

Use the actual MCP host connected for the demo (Claude Desktop or MCP Inspector, whichever is running). All three prompts below are backed by the real fixture data in `data/student.json` (completed: `ARAB135`, `ENGC1201`, `ENME120`, `MATH1411`, `PHYS111`, `PHYS141`; `maxCredits: 18`) and `data/courses.json` (25 courses).

#### Primary Prompt 1 — `generate_study_plan`

- **Exact prompt to paste:**
  > "Generate a study plan for me for next semester. I want between 14 and 18 credits, at most 2 project courses, at most 1 lab, and I want to stay on track."
- **Expected tool call:** `generate_study_plan` with `{ minCredits: 14, maxCredits: 18, maxProjects: 2, maxLabs: 1, goal: "stay_on_track" }`
- **Point out while it runs:** "Notice the tool isn't just filtering by credits — it's also respecting my completed courses and each course's prerequisites before it ever proposes anything."
- **Expected successful result:** A `"Balanced"` plan option totaling **17 credits**, **2 project-bearing courses**, **1 lab**, and an empty `unmetConstraints` list — built from courses whose prerequisites I've already satisfied (e.g. `COMP133`, `PHYS132`, `ENGC1202`, `ARAB136`, `ENME121`, `COMP233`, `PHYS112`).
- **Say after result:** "That's a full, prerequisite-respecting 17-credit plan, generated from my actual completed courses — not something I typed in manually."

#### Primary Prompt 2 — `check_prerequisites`

- **Exact prompt to paste:**
  > "Can I register for Computer Organization and Microprocessor next semester? Check the prerequisites."
- **Expected tool call:** `check_prerequisites` with `{ courseCode: "ENCS2380" }`
- **Point out while it runs:** "This course is two prerequisite hops away from what I've completed, so this is a good test of whether the eligibility check actually understands the dependency chain."
- **Expected successful result:** `{ eligible: false, missingPrerequisites: ["ENCS2340"] }` — I haven't taken `ENCS2340` (Digital Systems), so I can't take `ENCS2380` yet.
- **Say after result:** "So Claude correctly tells me I'm not eligible yet, and exactly which prerequisite I'm missing — not just a blanket 'no'."

#### Backup Prompt — `search_courses`

- **Exact prompt to paste:**
  > "Search for the Data Structures course in my specialization requirements."
- **Expected tool call:** `search_courses` with `{ query: "Data Structures", category: "Specialization Requirement" }`
- **Point out while it runs:** "This is the simplest tool — pure catalog lookup — so it's my fallback if anything upstream is acting up."
- **Expected successful result:** One match — `COMP2421 – Data Structures and Algorithms`, 4 credits, Specialization Requirement (Software), prerequisite `COMP133`.
- **Say after result:** "Even with zero dependencies on the other tools, this confirms the catalog and search are working end to end."

### 3:30–4:30 — What I Would Build Next

> "Three realistic next steps. First, `generate_study_plan` doesn't yet let a student filter by preferred specialization area — like AI or Networks — even though the course data already has that field, so that's a natural next addition. Second, right now everything runs off local JSON fixtures; the next step is pointing the same tool interfaces at a live course-registration data source instead. And third, testing today is manual — I have an eight-case test plan I run through MCP Inspector — so I'd like to add an automated test suite on top of that so regressions get caught without me re-running Inspector by hand."

### 4:30–5:00 — Q&A

> "That's the demo — happy to take questions."

**Likely mentor questions:**

1. **Why MCP instead of just prompting Claude with the data directly?**
   MCP gives Claude a stable, structured way to call into real, validated tools instead of me pasting a snapshot of my transcript into every prompt — the model gets exactly the data it asks for, from the current fixture files, every time.

2. **Why TypeScript?**
   The official `@modelcontextprotocol/sdk` has first-class TypeScript support, and TypeScript's static types pair naturally with the Zod runtime schemas — one schema drives both compile-time types and runtime validation.

3. **Why Zod?**
   `registerTool()` needs the raw object shape (`schema.shape`) to build each tool's JSON schema, so every tool input is defined as a Zod object. One constraint I hit: `.refine()` wraps a schema in `ZodEffects`, which strips `.shape` — so cross-field checks, like `minCredits <= maxCredits` in `generate_study_plan`, are done in the handler instead of via `.refine()`.

4. **How did you handle security / untrusted input?**
   Every tool argument is treated as untrusted, since it comes from the model, not a trusted human. Concretely: Zod validation with `.min()`/`.max()` bounds and enums on every schema, file access in `lib/file.ts` restricted to the `data/` directory (blocking path traversal), `search_courses` capped at 20 results, `list_completed_courses`/`list_remaining_courses` validate the `studentId` against the actual student record, and handlers catch errors and return short, safe messages instead of raw stack traces.

5. **How did you test the server?**
   Manual testing through MCP Inspector, documented in `docs/test-plan.md` — 8 test cases covering happy paths, case-insensitive search, empty-query and invalid-credit validation, and an unknown course code, all logged as pass with screenshot evidence in `docs/evidence/`. There's also `src/smoke-test.ts`, a small script that exercises the core library functions directly as a fast sanity check.

---

## 4. Backup Plan (Wi-Fi / Claude Fails)

This project has no external API or network dependency — everything already runs off local JSON fixtures in `./data`. If the internet or Claude itself is unavailable during the live demo:

1. Skip the Claude host entirely and run MCP Inspector locally instead:
   ```bash
   npx @modelcontextprotocol/inspector npx tsx src/index.ts
   ```
2. In the Inspector UI, call the same three tools with the same inputs used above (`generate_study_plan`, `check_prerequisites`, `search_courses`) and narrate the JSON responses instead of Claude's natural-language answer.
3. No data changes are needed — Inspector reads the exact same `data/courses.json` and `data/student.json` fixtures, so the results match what was rehearsed.

---

## 5. Rehearsal Checklist

- [ ] Open repository README (`README.md`) for a quick refresher
- [ ] Run `npm install` if dependencies aren't already installed
- [ ] Start the MCP server (`npm run dev`) or launch MCP Inspector as the backup path
- [ ] Open Claude Desktop (or Inspector) and confirm the server is connected
- [ ] Have Primary Prompt 1 (`generate_study_plan`) copied and ready to paste
- [ ] Have Primary Prompt 2 (`check_prerequisites`) copied and ready to paste
- [ ] Test the backup prompt (`search_courses`) once through Inspector
- [ ] Rehearse once with a timer, full run-through
- [ ] Rehearse again and confirm total time stays under 5 minutes
