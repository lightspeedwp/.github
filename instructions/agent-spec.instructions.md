---
file_type: "instructions"
title: "Agent Specification Instructions"
description: "How to design, write, and review LightSpeed Copilot agent specification files."
version: "v1.0"
last_updated: "2025-12-11"
owners: ["GitHub Community Health Team"]
tags: ["agents", "specs", "templates", "copilot", "governance"]
applyTo: ["agents/*.agent.md", ".github/agents/*.agent.md"]
status: "active"
stability: "stable"
domain: "governance"
---

# Agent Specification Instructions

You are a Copilot agent specification author. Follow our organisation-wide governance, security, and documentation standards to create deterministic, safe agent specs. Avoid granting implicit powers, vague scopes, or unlisted tools.

## Overview

Use this guide when drafting or updating `.agent.md` files in `agents/`, or repo-local specs that intentionally remain in `.github/agents/`. It pairs with the template in `../agents/template.agent.md` and aligns with community health standards, security policy, and automation guidelines. Keep specs concise, enforceable, and suitable for audits across all LightSpeed WordPress projects.

## General Rules

- Keep the agent scope unambiguous: what it owns, what it refuses, and which repos/APIs/workflows it may touch.
- Design for determinism: consistent inputs and outputs, defined error states, and explicit confirmation rules for risky actions.
- Front-load safety guardrails; treat tools as explicit permissions - if a tool is not listed, the agent cannot use it.
- Prefer minimal, modular behaviour; justify complex automation with clear value and maintainability.
- Use UK English, concise bullets, and the provided template; include realistic test tasks drawn from LightSpeed workflows.

> **Schema authority:** Always edit `../.schemas/frontmatter.schema.json` for schema updates; remove or ignore legacy copies elsewhere to keep the validator deterministic.

## Detailed Guidance

### Frontmatter and Metadata

- Use the template frontmatter fields (`title`, `description`, `version`, `last_updated`, `owners`, `tags`, `status`, `apply_to`, `file_type`, `tools`, `examples`, optional `metadata`). Do not add a `references` property; the schema no longer recognises it—link to related docs inline or in footers.
- Declare permissions through the optional `permissions` array; follow the approved vocabulary in `docs/FRONTMATTER_SCHEMA.md` (e.g., `read`, `write`, `shell`, `github:*`) so automation tooling always validates these scopes.
- Keep `apply_to` targeting `agents/*.agent.md` for portable specs; update `last_updated` whenever the spec meaningfully changes.
- Add `metadata.guardrails` for non-negotiable safety notes; reference relevant instructions and `SECURITY.md`.

### Permissions vocabulary

- Permissions describe the operational scopes the agent truly needs—complimenting tools without inflating capability. Declare them as `permissions: ["read", "github:repo"]` in the frontmatter.
- Use the approved enum from `../.schemas/frontmatter.schema.json` (currently: `read`, `write`, `execute`, `shell`, `filesystem`, `network`, `github:repo`, `github:issues`, `github:pulls`, `github:workflows`, `github:checks`, `github:actions`).
- Before introducing additional strings, extend the schema and update this instruction section at the same time so documentation, linting, and validation stay aligned.

### Role and Scope

- State the agent purpose, persona (if any), and boundaries.
- Name supported systems/workflows/teams and explicitly list out-of-scope areas.

### Responsibilities and Capabilities

- List concrete actions and automation rules the agent can perform.
- Note limitations (read-only, no deployments, no billing) and required confirmations.

### Allowed Tools and Integrations

- Enumerate every permitted tool, API, CLI, and connector with expected scopes.
- Mention required environment variables without storing secrets; forbid unlisted tools.

### Input and Output Specifications

- Define natural-language and structured inputs; include JSON Schema when structure matters.
- Specify deterministic output formats (status, summary, actions, logs, error fields) and any Markdown/JSON/table requirements.

### Safety Guardrails

- Prohibit exposing secrets, mutating production data without confirmation, or acting outside scope.
- Include escalation paths (human review), moderation or rate limits, and refusal patterns for unsafe requests.

### Failure and Rollback Strategy

- Document behaviour for invalid input, external tool failures, and partial successes.
- Describe rollback expectations and constraints; prefer safe defaults when rollback is impossible.

### Test Tasks for Validation

- Provide at least three tasks: normal, edge, and failure cases with expected outcomes.
- Use realistic scenarios from LightSpeed CI, content, or release workflows.

### Observability and Logging

- State required logs (timestamps, tool calls, external interactions) and privacy considerations.
- Clarify metrics/reporting expectations and how to trace actions for audits.

### Changelog and Versioning

- Maintain a short changelog with version, date, and rationale; increment `version` when behaviour changes.

### Review Checklist

- Role & Scope: [ ] Purpose is unambiguous; [ ] Boundaries are explicit.
- Capabilities: [ ] Only supported actions listed; [ ] No implied powers.
- Tools: [ ] All external tools are named with scopes; [ ] Auth/permissions noted.
- Permissions: [ ] Declared scopes use the approved `permissions` list from `docs/FRONTMATTER_SCHEMA.md`; keep the schema + docs in sync if you expand the vocabulary.
- Input/Output: [ ] Schemas/examples provided; [ ] Error format deterministic.
- Safety: [ ] Guardrails align with `SECURITY.md`; [ ] Confirmation rules present.
- Failure/Rollback: [ ] Partial-failure handling documented.
- Testing: [ ] Normal, edge, and failure tasks included.
- Observability: [ ] Logging/metrics/audit guidance included.

## Examples

Minimal skeleton using the template:

```md
---
title: "Example: Release Agent"
description: "Guides release PR checks and tagging."
version: "v1.2"
last_updated: "2025-12-11"
owners: ["Release Engineering"]
tags: ["agent", "release", "copilot"]
status: "active"
apply_to: ["agents/*.agent.md"]
file_type: "agent-spec"
tools: ["GitHub API", "Release workflows"]
metadata:
  guardrails: "Never publish or tag without human confirmation."
---

# 1. Role & Scope
- Guides release PR readiness; read-only on release workflows; refuses production deploys.

# 2. Responsibilities & Capabilities
- Surface release checklist status; summarise blocking issues; prepare tag notes.

# 3. Allowed Tools & Integrations
- GitHub API (read issues/PRs, read workflow runs); no write actions.
```

## Validation

- Run `npm run lint:md` for formatting and linting.
- Validate agent frontmatter with `npm run validate:agents`.
- Confirm the retired `references` frontmatter field is absent and convert supporting links to inline references or footer copy.
- Cross-check guardrails against `SECURITY.md` and automation constraints in `automation.instructions.md`.

## References

- [AGENTS.md](../AGENTS.md)
- [template.agent.md](../agents/template.agent.md)
- [instructions.instructions.md](instructions.instructions.md)
- [automation.instructions.md](automation.instructions.md)
- [documentation-formats.instructions.md](documentation-formats.instructions.md)
- [quality-assurance.instructions.md](quality-assurance.instructions.md)
- [SECURITY.md](../SECURITY.md)
