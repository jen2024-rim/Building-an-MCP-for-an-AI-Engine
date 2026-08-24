# Final Reflection

## Wins

Over the six weeks of the NxtFlows "Building an MCP for an AI Engine" cohort, I went from not knowing what MCP was to shipping a working, tagged MCP server: a Computer Engineering Course Planner built in TypeScript on top of `@modelcontextprotocol/sdk`. The server exposes seven tools — `search_courses`, `check_prerequisites`, `generate_study_plan`, `list_completed_courses`, `list_remaining_courses`, `add_course_to_plan`, and `complete_course` — each backed by its own Zod input schema and handler under `src/tools/` and `src/schemas/`.

The biggest technical win was building a real data layer instead of hardcoding responses. `src/lib/courses.ts` and `src/lib/student.ts` load and validate `data/courses.json` (25 real Birzeit Computer Engineering courses with codes, credits, categories, and prerequisite chains) and `data/student.json` through Zod, so a malformed record fails loudly instead of silently corrupting a tool's output. Writing `check_prerequisites` and `generate_study_plan` forced me to actually think through prerequisite-graph logic — checking a student's completed courses against a course's prerequisite list, and then building a set of recommended courses that respects a credit ceiling, project/lab limits, and a stated goal — rather than just wiring inputs to outputs.

I used Zod for every tool's inputs, which was new to me at the start of the program. By Week 4 I understood it well enough to add `.min()`/`.max()` bounds on strings and numbers, `.enum()` constraints on fixed-value fields like `priority`, and to reject empty or oversized inputs before any handler logic runs. That same week I added `lib/file.ts`, which resolves every file path against a fixed `data/` directory and refuses to read anything outside it — a concrete lesson in treating model-supplied arguments as untrusted input rather than trusted human input.

I tested every P0 tool (`search_courses`, `check_prerequisites`, `generate_study_plan`) manually through MCP Inspector in Week 5, covering happy paths, case-insensitive search, an unknown course code, and both zero and negative credit limits — eight test cases in total, all passing, with screenshots committed under `docs/evidence/`. I also wrote a smoke test (`src/smoke-test.ts`) that exercises the data-loading and core logic functions directly, separate from the MCP layer.

Documentation went through a real rewrite in Week 5: the README now has accurate install/run/test instructions, a tools table, example prompts, and a troubleshooting section, and `examples/conversations.md` walks through three end-to-end conversations with expected tool calls. In the final week I prepared the repository for release — added a proper `.gitignore`, an MIT `LICENSE`, merged the `week-6-ship` branch into `main`, and tagged the result `v1.0.0` ("Demo Day ship"). I also verified the release myself by cloning the repository fresh, running `npm install`, and confirming the server starts cleanly on stdio — so I know the instructions in the README actually work for someone starting from nothing.

Beyond Inspector testing, I also connected the server to Claude Desktop, working through some path and working-directory issues on Windows to get the connection stable. That let me test the tools in something closer to the real-world use case — Claude itself deciding when to call `search_courses`, `check_prerequisites`, or `generate_study_plan` based on a natural-language question, instead of me sending pre-built requests through Inspector.

## Blockers and Challenges

The hardest stretch was Week 3, when I moved the tools from stub responses to real data. My commit history shows several passes at the data fixtures and the tool handlers (`add local data fixtures` appears more than once) before the schema and the actual JSON shape lined up — field names in `courses.json` didn't initially match what the Zod schemas expected, which meant fixing the mismatch on both sides rather than just adjusting one file. I also had an early dependency mistake: I had imported from `@modelcontextprotocol/server` instead of the correct `@modelcontextprotocol/sdk` package, which took a bit of digging through error output to catch.

Working across both the GitHub web editor and local Git Bash created recurring sync friction — a few commits in my history exist only to rename or re-add a file (like `README_en.md` vs `README.md`) after the two environments diverged. It taught me to be more deliberate about doing all real edits from one place and using the other only for quick fixes.

Week 4's hardening pass was conceptually the biggest shift in how I thought about the project: up to that point I'd been writing tools as if the input would always be reasonable, and the threat-modeling exercise (`docs/threat-model.md`) made me treat every tool argument as coming from a model that could send anything — empty strings, out-of-range numbers, or a path trying to escape the `data/` directory. Adding the path-resolution guard in `lib/file.ts` and result caps in `search_courses` came directly out of that exercise.

Getting Claude Desktop connected also had its own friction — sorting out the right working directory and file paths so the server could actually find `data/courses.json` and `data/student.json` when launched by Claude Desktop instead of from my own terminal. It was a good reminder that "it works when I run it" and "it works when something else launches it" are not the same claim.

None of these were dramatic failures — they were the normal friction of learning a new protocol, a new validation library, and a stricter way of thinking about untrusted input, all inside a six-week window with a fixed Demo Day deadline.

## Resume Blurb

Built a Computer Engineering Course Planner, an MCP (Model Context Protocol) server in TypeScript that lets an AI assistant search a Computer Engineering course catalog, check course prerequisites, and generate personalized semester study plans within credit and workload limits. Implemented seven tools with Zod-validated inputs, path-restricted file access, and capped/structured outputs, backed by local JSON course and student data. Manually tested all core tools through MCP Inspector with documented, passing test cases, connected the server to Claude Desktop for real end-to-end use, and shipped the project as a public GitHub repository tagged `v1.0.0`, verified to install and run cleanly from a fresh clone. Completed as part of NxtFlows Academy's six-week "Building an MCP for an AI Engine" cohort for Computer Science and Computer Engineering students.

## LinkedIn Draft

I just wrapped up a six-week cohort with NxtFlows Academy on building an MCP (Model Context Protocol) server for an AI engine — and I want to share what I built: a Computer Engineering Course Planner that lets an AI assistant search courses, check prerequisites, and generate a semester study plan based on what a student has already completed.

Going in, I didn't know MCP existed. By the end, I'd built seven tools in TypeScript with Zod schema validation on every input, gotten hands-on with threat-modeling a server that takes instructions from a model rather than a human, tested everything through MCP Inspector, connected it to Claude Desktop for a real end-to-end test, and shipped a tagged `v1.0.0` release on GitHub.

Two things really stuck with me. First, how much of "AI integration" is actually just careful software engineering — validating inputs, handling bad data gracefully, restricting what a tool is allowed to touch. Second, how differently you have to think about trust boundaries when the caller is a model instead of a person clicking through a UI.

Proud of what a six-week side project turned into, and looking forward to building on it.

## Next Two-Week Improvement

**What I would improve:** Move the data layer from local JSON fixtures toward a small local API — the direction `docs/data-plan.md` already flagged as the plan ("designed to support an API... while keeping JSON files as an offline fallback"). Concretely, that means standing up a lightweight local Express endpoint that serves the same course and student data currently in `data/courses.json` and `data/student.json`, routing tool reads through `lib/http.ts` (which already has an allowlist and timeout in place but isn't used by any tool yet) instead of `lib/file.ts`.

**Why it matters:** The current design hardcodes the data source as flat files read from disk, which only works because the server and its data live on the same machine. An API-backed data layer is the natural next step toward the data actually being editable and shareable — for example, updating a student's completed courses without hand-editing JSON — and it exercises the network-allowlist and timeout logic in `lib/http.ts` that was written ahead of this work but has never actually been called by a live tool.

**What it would add:** It would prove out the security work from Week 4 (the HTTPS-only allowlist and timeout handling) against a real network call instead of code that's only ever been reviewed, and it would move the project from "a fixed local dataset an AI can read" to "a small backend an AI can query," which is a meaningfully more realistic architecture if this project were to keep growing past the cohort.
