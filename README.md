# Building an MCP for an AI Engine – Computer Engineering Course Planner

## What it does

This project is an MCP (Model Context Protocol) server for a **Computer Engineering Course Planner**. It exposes a set of tools that an AI host — such as Claude — can call to help a student search the course catalog, check whether they meet the prerequisites for a course, and generate a study plan for an upcoming semester within a credit limit. The server reads course and student data from local JSON fixture files and returns structured results that the AI host can turn into a natural-language answer.

## Requirements

- Node.js 20+ (per course instructions)
- npm
- Git
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) for development/testing (run via `npx`, no separate install needed)
- Claude Desktop — only required if you want to connect the MCP server to Claude as a host

Python is not required by this project.

## Install

From the repository root:

```bash
npm install
```

This installs the runtime dependencies (`@modelcontextprotocol/sdk`, `zod`) and dev dependencies (`typescript`, `tsx`, `@types/node`) listed in `package.json`.

## Run

Start the MCP server from the repository root using the `dev` script defined in `package.json`:

```bash
npm run dev
```

This runs `tsx src/index.ts`, which starts the server on stdio.

## Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

This opens a local web interface where each tool can be called directly with sample inputs, so you can inspect requests, responses, and error handling without needing an AI host.

## Tools

| Tool | Purpose | Main inputs |
|---|---|---|
| `search_courses` | Searches courses by name, code, or category keyword. | `query` (optional), `category` (optional), `limit` (optional, default 5, max 20) |
| `check_prerequisites` | Checks whether the student is eligible for a course based on completed prerequisites. | `courseCode` |
| `generate_study_plan` | Generates a recommended set of courses for the next semester, respecting completed courses, prerequisites, and a credit limit. | `maxCredits` (positive integer, max 21) |
| `list_completed_courses` | Lists all courses a student has already completed. | `studentId` |
| `list_remaining_courses` | Lists courses a student still needs to take, optionally including electives. | `studentId`, `includeElectives` (optional) |
| `add_course_to_plan` | Adds a course to the student's current semester plan. | `courseCode`, `semester`, `priority` (optional: `required` or `elective`) |

`search_courses` matches against course name, code, and category — it does not currently search course descriptions.

## Example prompts

- "Find me courses in the Networks category."
- "What prerequisites am I missing for ENCS4320?"
- "Generate a study plan for me with a maximum of 15 credits."
- "What courses have I already completed?"
- "What courses do I still have left, not counting electives?"
- "Add ENCS4320 to my plan for next semester as a required course."

## Example Conversations

See [examples/conversations.md](examples/conversations.md) for three example end-to-end conversations, including the expected tool calls and good final answers.

## Troubleshooting

1. **Dependencies are missing.** Run `npm install` from the repository root before running the server or Inspector.
2. **MCP Inspector or the server does not start.** Make sure your terminal is in the repository root (where `package.json` lives) and that Node.js 20+ is installed.
3. **The tools cannot find course or student data.** The server resolves `./data` relative to the current working directory, so start it from the repository root — otherwise `courses.json` and `student.json` will not be found.

## Connect to Claude Desktop

Connecting this server to Claude Desktop is the next step and has not been completed in this repository yet. For now, MCP Inspector (see above) is the current method used for development and testing.

## Security

This project includes input validation (Zod schemas on every tool), path protection limiting file access to the `data/` directory, and error handling that avoids exposing internal details to the model, from the Week 4 hardening pass. See [SECURITY.md](SECURITY.md) for details.

## License

This is a student project created as part of the NxtFlows Academy MCP cohort.
No open-source license is currently specified.

## Student / Project Information

- **Name:** Jeneen Mohsen Sattouf
- **University:** Birzeit University
- **Major:** Computer Engineering
- **Program:** Building an MCP for an AI Engine – NxtFlows Academy
