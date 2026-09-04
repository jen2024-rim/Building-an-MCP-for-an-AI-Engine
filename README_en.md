# Course Planner MCP — Building an MCP for an AI Engine 🎓

An MCP (Model Context Protocol) server that helps Computer Engineering students plan their semester by giving an AI assistant, such as Claude, real access to a course catalog, prerequisite data, and a student's academic record — instead of the student typing all of that into a prompt by hand.

Built as the capstone project for **[NxtFlows Academy](https://nextflows.ai/academy/portal/dashboard)'s "Building an MCP for an AI Engine"** cohort.

---

## 👩‍💻 Student Info

| | |
|---|---|
| **Name** | Jeneen Mohsen Sattouf |
| **University** | Birzeit University |
| **Major** | Computer Engineering |
| **Year** | 4th year → entering 5th year |
| **Program** | Building an MCP for an AI Engine – NxtFlows Academy |

---

## 📌 Project Overview

Computer Engineering students juggle a lot when planning a semester: which courses they've finished, which prerequisites still block them, how many credits, labs, and projects they can reasonably take on, and how to fit all of that into a plan. That information usually lives scattered across PDFs, advisor conversations, and memory — and an AI assistant like Claude has no way to see any of it unless it's given a real way to look.

**Course Planner MCP** closes that gap. It's a TypeScript MCP server, built on top of `@modelcontextprotocol/sdk`, that exposes a Computer Engineering course catalog and a student's academic record as a set of structured, validated tools. An AI engine connected to the server can:

- Search for courses by name, code, or category
- Check whether a student meets a course's prerequisites
- List completed and remaining courses
- Generate a suggested semester study plan within credit, project, and lab limits
- Add courses to a student's plan, mark courses as completed, or remove a course from the plan

The project started as a small skeleton with three core tools and grew, over the six-week cohort, into a full course-management system with input validation, path-restricted file access, manual test coverage, and a tagged `v1.0.0` release.

---

## 🛠️ Tools

The server currently registers **8 tools**, defined in `src/tools/` with matching Zod schemas in `src/schemas/`:

| Tool | Purpose |
| --- | --- |
| `search_courses` | Search courses by name, code, description, requirement type, or specialization area (case-insensitive) |
| `check_prerequisites` | Check whether a student is eligible for a course based on completed prerequisites |
| `generate_study_plan` | Generate up to three study plan options within a credit/project/lab range, based on a chosen goal |
| `list_completed_courses` | List all courses a student has already completed |
| `list_remaining_courses` | List courses a student still needs to take |
| `add_course_to_plan` | Add one or more approved courses to a student's plan for a given semester |
| `complete_course` | Mark a course as completed, moving it from the current plan into completed courses |
| `remove_course_from_plan` | Remove a course from the current plan without marking it completed |

Each tool's real input shape (from the actual schema files):

- **`search_courses`** — optional `query` (string, ≤200 chars), optional `category` (matches requirement type or specialization area), optional `limit` (1–20, defaults to 5).
- **`check_prerequisites`** — `courseCode` (string, 1–20 chars).
- **`generate_study_plan`** — `minCredits`, `maxCredits` (max 18), optional `minProjects`/`maxProjects`, optional `minLabs`/`maxLabs`, optional `goal` (`stay_on_track`, `reduce_workload`, or `graduate_sooner`).
- **`list_completed_courses`** — `studentId` (string, 1–50 chars).
- **`list_remaining_courses`** — `studentId`, optional `includeElectives` (boolean).
- **`add_course_to_plan`** — `semester` (string, 1–50 chars), `courseCodes` (array of 1+ strings).
- **`complete_course`** — `courseCode` (string, 1–20 chars).
- **`remove_course_from_plan`** — `courseCode` (string, 1–20 chars).

---

## 🧭 Project Journey

The project developed in six stages, following the NxtFlows Academy cohort structure: **Requirements → MCP Fundamentals → Project Idea → Tool Design → Implementation with Real Data → Validation → Testing → Reliability → Claude Integration → Additional Tools → Fresh-Clone Verification → Demo Day.**

### Phase 1 — Understanding MCP

The project began with learning the fundamentals of the Model Context Protocol: what an **MCP Host** (the AI application), an **MCP Client** (the connection layer inside the host), and an **MCP Server** (this project) are, and how they communicate. Servers expose **Tools** (actions a model can call), and MCP more broadly also supports **Resources** and **Prompts**. The **MCP Inspector** was used throughout as a standalone way to run and test a server without needing a full AI host. At its core, MCP exists to let AI applications interact with external tools and data through one standardized protocol, instead of every integration being custom-built.

### Phase 2 — Requirements and Problem Identification

The initial problem was concrete and personal: Computer Engineering students need to track completed courses, remaining courses, prerequisites, credit limits, and semester planning — and study-plan decisions change often. The goal was an MCP server that could make this information accessible to an AI engine, so the AI could actually help with planning instead of just discussing it in the abstract. The exact scope of "help with planning" evolved as implementation progressed — starting with pure lookup and eligibility checks, and later growing into actual plan management.

### Phase 3 — Project Selection and Design

**Course Planner** was selected because it mapped directly onto the design of the six-week program and onto a problem the presenter deals with every semester. The initial design centered on three P0 tools:

- `search_courses`
- `check_prerequisites`
- `generate_study_plan`

The project then expanded with tools for tracking and managing a student's actual progress and plan:

- `list_completed_courses`
- `list_remaining_courses`
- `add_course_to_plan`
- `complete_course`
- `remove_course_from_plan`

That expansion is what turned the project from a read-only course-lookup tool into an interactive course-management system that can update a student's plan, not just describe it.

---

## 🗂️ Data and JSON Files

The project stores its data in two local JSON files under `data/`:

- **`data/courses.json`** — a 25-course Computer Engineering catalog, with each course's code, name, credits, year, semester, requirement type, specialization area, course type, lab/project flags, and prerequisite list.
- **`data/student.json`** — a student's ID, name, major, credit limit, completed courses, and current semester plan.

Every tool reads from these files through `src/lib/courses.ts` and `src/lib/student.ts`, which load and validate the JSON with Zod before any tool logic runs. Keeping the data separate from the tool implementation means the catalog or student record can be updated without touching any tool code, and a malformed file fails loudly (with a clear error) instead of silently corrupting a tool's output.

There is no external API or database — everything is local JSON, by design for this stage of the project (see [Learning Journey](#-learning-journey) for the planned next step).

---

## ✅ Schemas and Validation

Every tool's input is defined as a **Zod** object schema in `src/schemas/`, and `src/index.ts` passes each schema's `.shape` into `registerTool()` so the MCP SDK can build the tool's JSON schema directly from it. Validation includes:

- Required fields (e.g. `courseCode`, `semester`, `courseCodes`)
- String length bounds (e.g. course codes capped at 20 characters, search queries at 200)
- Numeric bounds (e.g. `maxCredits` capped at 18, all count fields must be non-negative integers)
- Enum constraints (e.g. `goal` in `generate_study_plan` must be one of three fixed values)
- Optional parameters where a sensible default exists (e.g. `limit` in `search_courses`, `includeElectives` in `list_remaining_courses`)

One implementation detail worth noting: cross-field checks — like requiring `minCredits <= maxCredits` in `generate_study_plan` — are done inside the tool handler rather than with Zod's `.refine()`, because `.refine()` wraps a schema in a type that no longer exposes `.shape`, which `registerTool()` needs. This keeps every schema usable directly by the SDK while still enforcing the cross-field rule before a plan is generated.

---

## 🛡️ Error Handling and Reliability

The project was hardened so that bad input produces a controlled, understandable error instead of an uncontrolled failure. Concretely:

- **Path-restricted file access** — `src/lib/file.ts` resolves every data file path against a fixed `data/` directory and refuses anything that would resolve outside it, blocking path traversal.
- **Validated inputs everywhere** — every tool argument is treated as untrusted (since it comes from a model, not a trusted human) and is checked against its Zod schema before any handler logic runs.
- **Bounded outputs** — `search_courses` caps its results (default 5, max 20) so a broad query can't return an unbounded response.
- **Safe error messages** — invalid course codes, non-existent courses, and malformed data all produce short, clear error messages rather than raw stack traces, while the underlying error detail is still logged for debugging.

These risks and mitigations are documented in full in [`docs/threat-model.md`](./docs/threat-model.md).

---

## 🧪 Testing

The three P0 tools — `search_courses`, `check_prerequisites`, and `generate_study_plan` — were manually tested through **MCP Inspector**, covering:

- Case-insensitive and standard course search
- An empty search query (validation)
- A valid, existing course code vs. a non-existent one (`FAKE9999`)
- A valid credit limit vs. invalid limits (`0` and a negative value)

All eight test cases are documented with pass/fail results in [`docs/test-plan.md`](./docs/test-plan.md), with screenshot evidence committed under [`docs/evidence/`](./docs/evidence/).

There is also `src/smoke-test.ts`, a standalone script that exercises the core data-loading and business-logic functions directly (independent of the MCP layer) as a fast sanity check during development.

---

## 🔍 MCP Inspector

**MCP Inspector** was used throughout development as the primary way to run and test the server before any AI engine was connected:

- Running the server locally over stdio
- Listing the tools the server registers
- Calling tools manually with hand-crafted inputs
- Inspecting raw JSON outputs and debugging handler behavior

Inspector remains the backup demo path if a live AI host isn't available (see [Fresh-Clone Verification](#-fresh-clone-verification)).

---

## 🤖 Claude / AI Engine Integration

The server was connected to **Claude Desktop** as its AI host, in addition to MCP Inspector. It's worth keeping these roles distinct:

- **MCP Server** (this project) — exposes the 8 course-planning tools over stdio.
- **MCP Client/Host** — the application that connects to the server, in this case Claude Desktop (or MCP Inspector, for manual testing).
- **Claude** — the AI engine that decides when to call a tool based on a natural-language question, and turns the structured result back into a helpful answer.
- **MCP Inspector** — a development/testing tool, not an AI host.

Connecting to Claude Desktop on Windows required resolving some working-directory and file-path issues so the server could reliably find `data/courses.json` and `data/student.json` when launched by Claude Desktop rather than from a terminal. Everything still runs locally against the JSON fixtures — there is no cloud deployment or automatic data synchronization.

---

## 💬 Example User Scenarios

**Course search**
> "Search for the Data Structures course in my specialization requirements."

**Prerequisite check**
> "Can I take Computer Organization and Microprocessor next semester? Check the prerequisites."

**Study plan**
> "Generate a study plan for me for next semester. I want between 14 and 18 credits, at most 2 project courses, at most 1 lab, and I want to stay on track."

**Academic progress**
> "Show me my completed courses."
> "Show me the courses I still need to complete."

**Plan management**
> "Add this course to my study plan for Spring 2027."
> "Mark this course as completed."
> "Remove this course from my study plan."

More worked examples, including expected tool calls and full sample answers, are in [`examples/conversations.md`](./examples/conversations.md).

---

## 📁 Repository Structure

```text
.
├── src/
│   ├── index.ts          # Registers all 8 tools and starts the stdio server
│   ├── smoke-test.ts     # Standalone sanity check for the core logic
│   ├── tools/             # One handler per tool
│   ├── schemas/           # One Zod input schema per tool
│   └── lib/                # Data access (courses.ts, student.ts), safe file I/O (file.ts),
│                            #   and an allowlisted fetch helper reserved for a future API (http.ts)
├── data/
│   ├── courses.json       # 25-course Computer Engineering catalog
│   └── student.json       # Sample student record (completed courses, current plan)
├── docs/
│   ├── project-choice.md
│   ├── design.md
│   ├── data-plan.md
│   ├── threat-model.md
│   ├── test-plan.md
│   ├── demo-script.md
│   ├── reflection.md
│   ├── review-checklist.md
│   └── evidence/           # Screenshots backing the test plan
├── examples/
│   ├── conversations.md    # Worked example conversations
│   └── *.json               # Sample tool input/output pairs
├── README.md
├── README_en.md
├── LICENSE
└── package.json
```

---

## 🧱 Tech Stack

- **TypeScript** + **Node.js**
- **Model Context Protocol (MCP)** via `@modelcontextprotocol/sdk`
- **Zod** for input validation
- **JSON** for course and student data
- **Claude** as the AI engine host (also tested via **MCP Inspector**)
- **Git** and **GitHub** for version control and release

---

## 🚀 Installation and Running

Clone the repository and install dependencies from a clean environment:

```bash
git clone https://github.com/jen2024-rim/Building-an-MCP-for-an-AI-Engine.git
cd Building-an-MCP-for-an-AI-Engine
npm install
```

Start the MCP server (runs over stdio):

```bash
npm run dev
```

To inspect and manually call the tools without connecting a full AI host, run MCP Inspector against the same entry point:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

This opens the Inspector UI, where you can list the 8 registered tools, send them sample inputs, and read the structured JSON responses directly — the same workflow used throughout development and testing.

To connect the server to Claude Desktop instead, add it as an MCP server pointing at `npm run dev` (or the equivalent `tsx src/index.ts` command) for this repository's working directory.

---

## 🔁 Fresh-Clone Verification

Before the final release, the project was verified from a completely separate, temporary folder — not the original development environment — to confirm it's actually runnable by someone who has never seen the presenter's machine:

1. Clone the public repository into a new, empty directory.
2. Run `npm install`.
3. Start the server with `npm run dev`.
4. Open MCP Inspector and connect to it.
5. Call at least one tool (e.g. `search_courses`) and confirm a valid response.
6. Confirm the server works with no leftover state or configuration from the original setup.

This verification passed and is part of what shipped in the `v1.0.0` release.

---

## 🏁 Final Delivery / Demo Day

In the final week, the project moved from active development to a shipped, public release:

- Final documentation pass across the README, `docs/`, and `examples/`
- Hardening work reflected in `docs/threat-model.md`
- Manual testing completed and logged in `docs/test-plan.md`, with evidence in `docs/evidence/`
- Repository made public on GitHub
- Final work merged into `main`
- Fresh-clone verification completed (see above)
- MCP Inspector verification completed
- Annotated release tag:

```text
v1.0.0 — Demo Day ship
```

The full Demo Day plan — including the live-demo script, timed talking points, and a no-internet backup plan — is documented in [`docs/demo-script.md`](./docs/demo-script.md).

---

## 🎓 NxtFlows Academy

This project was completed as part of the **Building an MCP for an AI Engine** hands-on cohort by **[NxtFlows Academy](https://nextflows.ai/academy/portal/dashboard)**, a six-week program for Computer Science and Computer Engineering students covering MCP fundamentals, tool design, real-data integration, and reliability hardening.

🔗 **Official Academy portal:** https://nextflows.ai/academy/portal/dashboard

---

## 📚 Learning Journey

Six weeks ago, MCP was an unfamiliar acronym. Building this project meant learning, hands-on:

- How MCP hosts, clients, and servers fit together
- How to design tools an AI engine can actually use well
- Defining input schemas with Zod, including where cross-field validation has to move into handler code
- Working with structured JSON data instead of hardcoded responses
- Connecting tools to real course and student data
- Treating every tool argument as untrusted input and validating it accordingly
- Handling errors so they're informative for debugging but safe for the model to see
- Testing with MCP Inspector as a first-class development tool, not an afterthought
- Connecting an MCP server to a real AI engine (Claude Desktop) and troubleshooting real-world path/working-directory issues
- Git and GitHub workflow, including the friction of working across a web editor and a local terminal
- Writing documentation that actually reflects what the code does
- Preparing a project for public use and verifying it from a fresh clone

The next planned step, not yet implemented, is moving the data layer from local JSON fixtures toward a small local API, using the allowlisted fetch helper already scaffolded in `src/lib/http.ts` but not yet wired into any tool.

---

## 📖 Documentation Links

- [Project Design](./docs/design.md)
- [Project Choice](./docs/project-choice.md)
- [Data Plan](./docs/data-plan.md)
- [Threat Model](./docs/threat-model.md)
- [Test Plan](./docs/test-plan.md)
- [Test Evidence](./docs/evidence/)
- [Demo Script](./docs/demo-script.md)
- [Final Reflection](./docs/reflection.md)
- [Example Conversations](./examples/conversations.md)
