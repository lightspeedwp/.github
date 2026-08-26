---
title: "Template: Agent Specification"
description: "Standard specification for defining a LightSpeed Copilot Agent: role, behaviours, tooling, schemas, and safety constraints."
version: "v1.1"
last_updated: "2025-12-11"
owners: ["LightSpeedWP Engineering"]
tags: ["agent", "spec", "template", "copilot"]
status: "draft"
apply_to: ["agents/*.agent.md"]
file_type: "template"
tools: ["Copilot Agents"]
examples:
  - "agents/adr.agent.md"
metadata:
  guardrails: "Agents must never perform destructive or irreversible actions without explicit confirmation."
---

# 1. Role & Scope

Describe:

- The agent's purpose and boundaries.
- The persona or operating context (if relevant).
- The primary systems, workflows, or teams it supports.

# 2. Responsibilities & Capabilities

List what the agent can do and where it must stop:

- Core functions (for example CI checks, content linting, documentation support).
- Allowed transformations or automation rules.
- Explicit limitations (for example read-only, cannot deploy, no billing actions).

# 3. Allowed Tools & Integrations

Enumerate all approved tools:

- GitHub APIs and scopes.
- Third-party connectors (for example Drive, Sheets, internal APIs).
- Command-line interfaces or scripts the agent may call.
- Required environment variables (never list real values).

# 4. Input Specification

Define all accepted inputs:

- Natural-language prompts or commands.
- Structured inputs (JSON, YAML, forms) with examples.
- JSON Schema when structure needs enforcement.

# 5. Output Specification

Describe the required response format:

- Success, warning, and error shapes (fields such as status, summary, actions, logs).
- Formatting rules (for example Markdown with code blocks, JSON blocks, or tables).
- Deterministic fields needed for automation or parsing.

# 6. Safety Guardrails

Set non-negotiable safety rules:

- Never expose, request, or infer secrets or customer data.
- Do not destroy or mutate production data without explicit human confirmation.
- Stay within scope; refuse tasks that breach boundaries.
- Define escalation paths (for example flag to human review) and rate/moderation limits.

# 7. Failure & Rollback Strategy

Explain how the agent handles issues:

- Invalid inputs and missing context.
- External tool/API failures.
- Partial successes and rollback expectations or limits.

# 8. Test Tasks (for Validation)

Provide validation tasks with expected behaviours:

- A typical task the agent should complete.
- An edge case the agent should handle safely.
- A failure scenario with the expected error response.

# 9. Observability & Logging

Specify observability expectations:

- What to log (timestamps, tool calls, external interactions).
- How to report metrics and surface audit trails.
- Privacy considerations for any captured data.

# 10. Changelog

Maintain a simple audit trail of spec changes:

- Version, date, and a short note (for example `v1.1 - Updated guardrails; clarified rollback behaviour`).
