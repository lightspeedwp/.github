---
file_type: instructions
title: Agent Creation Workflow
description: >-
  Step-by-step workflow for converting a ChatGPT/Codex agent export into a
  standardised multi-provider agent (Claude, GitHub Copilot, OpenAI) with a
  plugin wrapper and validation.
scope: organization-wide
applyTo: 'agents/**'
version: v1.0.0
last_updated: '2026-07-22'
owners:
  - lightspeedwp/maintainers
tags:
  - agents
  - multi-provider
  - workflow
  - governance
status: active
domain: governance
---

# Agent Creation Workflow

You are converting a ChatGPT/Codex agent export into a standardised
multi-provider agent. Follow this workflow so every agent is consistent,
validated, and portable across Claude, GitHub Copilot, and OpenAI Codex.

## Overview

The reference implementation is
[`agents/playwright-testing-agent/`](../agents/playwright-testing-agent/AGENT.md),
packaged by
[`plugins/lightspeed-playwright-testing/`](../plugins/lightspeed-playwright-testing/README.md).

## General Rules

- Preserve the original export (`agent/`, `skills/`, `manifests/`,
  `checksums.sha256`) in place for provenance; add the multi-provider layer
  alongside it.
- Keep the canonical behaviour in `AGENT.md` + `shared/core-prompt.md`.
  Provider files only add provider-specific behaviour and must not contradict
  the core.
- Use UK English. Never commit secrets. Default to read-only; external writes are
  approval-gated.

## Detailed Guidance

### Phase 1 — Analyse the export

Read the export's instructions, business context, and manifests. Identify the
real capabilities, workflow, integrations, and the core agent-attached skill.
Separate genuine agent content from platform/environment boilerplate.

### Phase 2 — Create the structure

```text
agents/{slug}-agent/
├── AGENT.md
├── shared/core-prompt.md
├── claude/agent.md + tools.json
├── copilot/agent.md + skills.yaml
├── openai/agent.md + tools.json
├── .github/INSTALL.md + MANIFEST.json + security-policy.md
├── agent/ skills/ manifests/ checksums.sha256   # preserved export
```

### Phase 3 — Write the spec and core prompt

Write `AGENT.md` (YAML frontmatter valid against
[`multi-provider-agent.schema.json`](../.schemas/multi-provider-agent.schema.json))
and `shared/core-prompt.md` (provider-agnostic). Capture the real workflow, not a
generic template.

### Phase 4 — Provider configs and tools

Add `claude/`, `copilot/`, `openai/` configs and tool/skill definitions. See
[multi-provider-compatibility.instructions.md](./multi-provider-compatibility.instructions.md).

### Phase 5 — Plugin wrapper

Create or extend a `lightspeed-{domain}-{focus}` plugin. See
[plugin-architecture.instructions.md](./plugin-architecture.instructions.md).

### Phase 6 — Validate

Run the hooks and repo validators:

```bash
node hooks/agent-spec-validator/index.js agents/{slug}-agent
node hooks/multi-provider-consistency-checker/index.js agents/{slug}-agent
node hooks/plugin-integrity-checker/index.js plugins/{plugin}
node hooks/agent-security-auditor/index.js agents/{slug}-agent
npm run validate:plugins
npm run validate:json:schemas
```

### Phase 7 — Ship

Branch `feat/agent-standards-{slug}`, changelog entry, PR to `develop` with the
required template sections, then merge after review.

## Examples

See the Playwright pilot: [cookbook/playwright-agent-creation-guide.md](../cookbook/playwright-agent-creation-guide.md).

## Validation

- [ ] `AGENT.md` present with valid frontmatter
- [ ] `shared/core-prompt.md` present
- [ ] Claude, Copilot, OpenAI configs present
- [ ] Plugin manifests valid (`validate:plugins`)
- [ ] All four agent hooks pass
- [ ] Original export preserved

## References

- [multi-provider-compatibility.instructions.md](./multi-provider-compatibility.instructions.md)
- [plugin-architecture.instructions.md](./plugin-architecture.instructions.md)
- [ai-operations-unified.instructions.md](./ai-operations-unified.instructions.md)

---

📐 *Schema validated by LightSpeedWP — always compliant.*

[📋 Coding Standards](https://github.com/lightspeedwp/.github/blob/develop/instructions/coding-standards.instructions.md) · [🔗 Related Files](https://github.com/lightspeedwp/.github/tree/develop/instructions)
