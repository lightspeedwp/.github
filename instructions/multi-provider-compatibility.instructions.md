---
file_type: instructions
title: Multi-Provider Agent Compatibility
description: >-
  How to write agents that work across Claude, GitHub Copilot, and OpenAI Codex
  without duplication — separation of concerns, folder structure, and
  provider-specific customisation.
scope: organization-wide
applyTo: 'agents/**'
version: v1.0.0
last_updated: '2026-07-22'
owners:
  - lightspeedwp/maintainers
tags:
  - agents
  - multi-provider
  - compatibility
  - governance
status: active
domain: governance
---

# Multi-Provider Compatibility Guide

Write each agent once at the core, then layer provider-specific customisation.
This keeps behaviour consistent across Claude, GitHub Copilot, and OpenAI Codex.

## General Rules

- **Shared is provider-agnostic.** `AGENT.md` and `shared/core-prompt.md` define
  the role, workflow, constraints, and output contract in generic language.
- **Provider files add, never contradict.** `claude/`, `copilot/`, `openai/`
  supply tool/function/skill definitions and response-format specifics.
- **Parity is enforced** by `multi-provider-consistency-checker`.

## Detailed Guidance

### Separation of concerns

| Layer | Location | Contains |
| --- | --- | --- |
| Shared | `shared/core-prompt.md`, `AGENT.md` | Role, workflow, constraints, I/O contract |
| Claude | `claude/agent.md`, `claude/tools.json` | Tools (`input_schema`), JSON response format |
| Copilot | `copilot/agent.md`, `copilot/skills.yaml` | Skill references, Markdown chat format |
| OpenAI | `openai/agent.md`, `openai/tools.json` | Functions (`parameters`), function-call format |

### Writing core prompts

**Do:** write in generic language; focus on what the agent does; document
constraints; describe inputs and outputs.

**Don't:** reference a provider's SDK syntax; embed provider API calls; assume a
specific tool implementation.

### Provider-specific customisation

- **Claude** — tools with `input_schema`; structured JSON output; extended
  thinking for analysis (not narrated in the final answer).
- **GitHub Copilot** — skills/slash-command references; Markdown chat responses;
  GitHub Actions suggestions.
- **OpenAI** — function-calling schema (`parameters`); JSON mode; explicit
  gate handling (only call side-effect functions after approval).

### Tool mapping

Keep a conceptual capability stable across providers even when the tool name and
shape differ. Record the mapping in the plugin/agent manifest so parity is
auditable.

## Examples

See the Playwright agent's
[`claude/tools.json`](../agents/playwright-testing-agent/claude/tools.json) and
[`openai/tools.json`](../agents/playwright-testing-agent/openai/tools.json) for
the same capabilities expressed per provider.

## Validation

- [ ] `shared/core-prompt.md` contains no provider-specific syntax
- [ ] Each declared provider has an `agent.md` config
- [ ] Tool/function/skill definitions exist per provider
- [ ] `multi-provider-consistency-checker` passes

## References

- [agent-creation-workflow.instructions.md](./agent-creation-workflow.instructions.md)
- [provider-config.schema.json](../.schemas/provider-config.schema.json)

---

📐 *Schema validated by LightSpeedWP — always compliant.*

[📋 Coding Standards](https://github.com/lightspeedwp/.github/blob/develop/instructions/coding-standards.instructions.md) · [🔗 Related Files](https://github.com/lightspeedwp/.github/tree/develop/instructions)
