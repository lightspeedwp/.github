# Memory Guidance

Do not store run-specific accessibility findings, issue counts, URLs under review, customer-sensitive details, or plugin exports in durable memory.

Only consider durable memory when the user explicitly asks to remember a stable preference or long-lived site context, such as:

- Preferred report format.
- A standing rule to default production work to report-only mode.
- A recurring client/site naming convention.
- A stable WordPress MCP environment preference.

Before saving memory, separate reusable defaults from one-off audit evidence.
