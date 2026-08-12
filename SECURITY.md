# Security Policy

## Supported Versions

This is a student project with a single active version — the code on the
`main` branch of this repository. There are no older releases to maintain.

## Reporting a Vulnerability

If you find a security issue in this project, please email the program
mentor directly at **info@nextflows.ai** rather than opening a public issue.
Include a description of the problem and, if possible, steps to reproduce it.

## Hardening Summary (Week 4)

This server takes input from a model, not a trusted human, so all tool
arguments are treated as untrusted input. The following mitigations are in
place:

- **Input validation** — every tool has a Zod schema with `.min()`/`.max()`
  bounds on strings and numbers, and `.enum()` for fixed-value fields
  (e.g. `priority`, course type). Empty strings and oversized inputs are
  rejected before any handler logic runs.
- **Path protection** — `lib/file.ts` resolves every file path with
  `path.resolve()` against a fixed `data/` directory and rejects any path
  that would resolve outside of it (blocks `../` traversal). Tool schemas
  never accept an arbitrary file name from the model in the first place.
- **Output caps** — `search_courses` caps results at 20, returning a
  `truncated` flag when results are cut off. `list_remaining_courses` and
  `list_completed_courses` are intentionally left unbounded — the course
  catalog is small and fixed (a university curriculum), not user-controllable
  or capable of unbounded growth.
- **Network allowlist & timeouts** — `lib/http.ts` (used once real external
  API calls are added) only permits HTTPS requests to an explicit
  `ALLOWED_HOSTS` list and enforces an 8-second timeout on every request;
  it refuses non-HTTPS URLs and any host not on the allowlist. No external
  network calls are made by any tool yet — this exists ahead of that work.
- **Student identity checks** — `list_completed_courses` and
  `list_remaining_courses` validate the `studentId` argument against the
  loaded student record instead of trusting it blindly.
- **No secrets in the repo** — this project does not use any API keys or
  tokens. `.gitignore` excludes `.env` and key-like filenames, and
  `.env.example` documents the (currently empty) convention for the future.
- **Error handling** — tool handlers catch errors and return short,
  user-facing messages (e.g. "Sorry, I couldn't load remaining courses
  right now.") instead of exposing raw stack traces or internal error
  detail to the model. Full error detail is only logged server-side via
  `console.error`.
