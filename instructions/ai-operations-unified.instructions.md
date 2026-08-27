---
file_type: instructions
title: Unified AI Operations
description: 'Provider-neutral AI operations for multi-provider agents: session integrity, logging and audit trails, escalation, file placement, and code-review integration across Claude, Copilot, and OpenAI.'
scope: organization-wide
applyTo: '**'
version: v1.0.1
last_updated: '2026-08-21'
owners:
  - lightspeedwp/maintainers
tags:
  - ai-operations
  - agents
  - governance
  - multi-provider
status: active
domain: governance
---

# Unified AI Operations

Provider-neutral operating rules for multi-provider agents. Provider-specific
tooling notes (e.g. Copilot session URLs) layer on top of these; they do not
replace them.

## General Rules

- **Session integrity** — load context at session start (CLAUDE.md, AGENTS.md,
  relevant instructions); state assumptions and scope.
- **Boundary respect** — stay within the repository; no cross-repo changes
  without authorisation.
- **Escalation** — on ambiguity or policy conflict, ask rather than act.
- **No destructive defaults** — never force-push, delete branches, or hard-delete
  without explicit confirmation.

## Detailed Guidance

### Provider-neutral session tracking

Record provenance in commit messages and PR bodies using whatever identifier the
active provider supplies (Claude Code session, Copilot session, or an OpenAI run
id). The requirement is an auditable trail, not a specific URL format.

### Logging and audit trails

- Prefer deterministic, greppable logs with timestamps and tool calls.
- Never log secrets, credentials, or private client data.
- Route agent reports to `.github/reports/{category}/`.

### File placement

- Portable AI assets live in top-level source folders: `agents/`, `plugins/`,
  `skills/`, `hooks/`, `instructions/`, `cookbook/`, `.schemas/`, `ai/`.
- GitHub-native governance lives under `.github/`.
- Temporary scratch lives in `.github/tmp/` and is removed before a PR.

### Escalation and approvals

External writes (GitHub, BugHerd, Harvest, or any third-party system) are
approval-gated. Default to read-only analysis and summarise planned changes
before acting.

### Code-review integration

AI-generated changes meet the same review, linting, testing, and security bars as
human changes. PR descriptions state what the agent did and why.

## Examples

The Playwright agent's provider configs each defer to
[`shared/core-prompt.md`](../.github/agents/playwright-testing-agent/shared/core-prompt.md)
for these operational rules and only add provider mechanics.

## Validation

- [ ] Context loaded at session start
- [ ] No secrets in logs or commits
- [ ] Reports under `.github/reports/`
- [ ] External writes were approval-gated
- [ ] Provenance recorded in commit/PR

## References

- [agent-creation-workflow.instructions.md](./agent-creation-workflow.instructions.md)
- [multi-provider-compatibility.instructions.md](./multi-provider-compatibility.instructions.md)

---

📐 *Schema validated by LightSpeedWP — always compliant.*

[📋 Coding Standards](https://github.com/lightspeedwp/.github/blob/develop/instructions/coding-standards.instructions.md) · [🔗 Related Files](https://github.com/lightspeedwp/.github/tree/develop/instructions)

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
