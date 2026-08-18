# Threat Model — Course Planner MCP

## Assets
- Course data stored in `./data/courses.json`.
- Student data stored in `./data/student.json`.
- The local filesystem where the MCP server runs.
- Tool responses returned to the AI model.
- No API keys or authentication tokens are currently used because the project uses local JSON files.

## Trust Boundaries
- Model → tool arguments: tool inputs are treated as untrusted input and validated with Zod.
- Tool → filesystem: tools read course and student data from the local `./data` directory.
- Tool → model: tool results are returned to the model, so responses should be limited and structured.
- Network access is currently not used because the project relies on local JSON fixtures.

## Top 5 Risks
1. Path traversal could allow a tool to access files outside the `./data` directory.
2. Invalid or unexpected tool arguments could cause incorrect tool behavior.
3. A large course search result could create an unnecessarily large response.
4. Malformed or unexpected JSON data could cause parsing or validation errors.
5. Sensitive information could accidentally be added to the JSON files or exposed in logs.

## Mitigations This Week
- Restrict file access to the `./data` directory and reject unsafe paths.
- Use Zod validation for all tool inputs and data read from JSON files.
- Add reasonable limits to search results and response sizes.
- Validate JSON data before using it in the tools and handle invalid data safely.
- Avoid storing secrets in JSON files and never log sensitive information.

## Out of Scope
- External API security and SSRF are currently out of scope because this version uses local JSON files and does not make network requests.
- Authentication and authorization are out of scope for this student project because there are no external users or protected APIs.
- Production-level security monitoring is out of scope because this is an educational MCP project.
