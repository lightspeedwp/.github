---
title: "Generic Agent Specification Template"
description: "A template for defining a custom Copilot agent’s capabilities, inputs, outputs and safety measures."
last_updated: "2025-10-17"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Role

Describe the agent’s purpose and the persona it should adopt. For example: “The agent acts as a continuous integration assistant that prepares builds, runs tests and reports results.”

# Capabilities

- List the high‑level actions the agent can perform (e.g. create repositories, fetch documents, execute scripts).
- Mention any limitations (e.g. read‑only access, no network calls outside approved domains).

# Allowed Tools

- Enumerate the connectors and tools the agent may use (GitHub, Google Drive, Gmail, custom APIs).
- Define any restricted operations within those tools (e.g. may fetch files but not delete them).

# Input Schema

- Define the expected inputs to the agent (e.g. objective string, list of tasks, optional parameters).
- Use JSON Schema or a simple table to describe each field (name, type, description).

# Output Schema

- Specify the structure of the agent’s responses (e.g. `status`, `summary`, `artifacts`).
- Include error fields for reporting issues.

# Safety Guardrails

- Detail rules the agent must follow to avoid harmful actions (e.g. no high‑impact decisions, ask for confirmation before publishing).
- Define redlines (e.g. never expose secrets, do not access PII).

# Failure/Rollback Policy

- Describe how the agent should handle errors. For example: “If a step fails, stop execution, report the error, and await further instructions.”
- Include rollback steps if applicable (e.g. revert a created branch).

# Test Tasks

- Provide sample tasks for validating the agent during development (e.g. create a dummy repository, fetch a sample document, run a test suite).

# Observability Notes

- Explain how to log actions and decisions. Suggest logging structures (timestamps, action type, result, errors).
- Mention metrics to monitor (e.g. execution time, success rate).

---
