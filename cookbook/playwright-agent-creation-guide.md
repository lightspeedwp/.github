---
file_type: documentation
title: Playwright Agent Creation Guide
description: >-
  Worked playbook for converting the Playwright Testing Agent export into a
  standardised multi-provider agent and plugin — the Phase 1 pilot reference.
version: v1.0.0
last_updated: '2026-07-22'
owners:
  - lightspeedwp/maintainers
tags:
  - playwright
  - testing
  - agents
  - multi-provider
  - cookbook
status: active
domain: generic
---

# Playwright Agent Creation Playbook

This cookbook documents the Phase 1 pilot: converting the Playwright Testing
Agent ChatGPT/Codex export into a standardised multi-provider agent (Claude,
GitHub Copilot, OpenAI) with a plugin wrapper and validation.

## Context

- **Source export:** [`agents/playwright-testing-agent/`](../agents/playwright-testing-agent/AGENT.md)
- **Real behaviour:** a WordPress/WooCommerce **test-pack builder** with a
  review-before-code workflow, requirement traceability, and Figma / GitHub /
  BugHerd / Harvest integrations — not a generic browser-automation bot.
- **Plugin:** [`plugins/lightspeed-playwright-testing/`](../plugins/lightspeed-playwright-testing/README.md)

## Phase 1 — Analyse

Read `agent/instructions/AGENTS.md`, `agent/other/agent_files/business-context.md`,
and `manifests/skills.md`. Capture the real workflow (PRD → requirements → test
cases → review gate → specs), the source-priority order, and the genuinely
relevant skill (`test-pack-builder`). Treat the 300+ platform-managed skill files
(imagegen, pdf, presentations, google-*) as environment boilerplate to preserve,
not core behaviour.

## Phase 2 — Structure

Add the multi-provider layer alongside the preserved export:

```bash
A=agents/playwright-testing-agent
mkdir -p $A/shared/{tools,memory,hooks} $A/claude $A/copilot $A/openai $A/.github
```

## Phase 3 — Spec and core prompt

- `AGENT.md` — frontmatter valid against
  [`multi-provider-agent.schema.json`](../.schemas/multi-provider-agent.schema.json);
  documents the real responsibilities, workflow, source priority, and integrations.
- `shared/core-prompt.md` — provider-agnostic instructions (routing, requirement
  discipline, Playwright rules, WP/Woo rules, safety).

## Phase 4 — Provider configs and tools

- `claude/agent.md` + `claude/tools.json` (`input_schema` tools, JSON responses)
- `copilot/agent.md` + `copilot/skills.yaml` (skill refs, Markdown chat)
- `openai/agent.md` + `openai/tools.json` (function-calling schema, gate handling)

The same capabilities map across providers (see
[multi-provider-compatibility.instructions.md](../instructions/multi-provider-compatibility.instructions.md)).

## Phase 5 — Plugin wrapper

Create `plugins/lightspeed-playwright-testing/` with the four provider manifests,
a packaged agent pointer, `README.md`, `INSTALL.md`, and register it in
`PLUGIN_MANIFEST.json`.

## Phase 6 — Validate

```bash
node hooks/agent-spec-validator/index.js agents/playwright-testing-agent
node hooks/multi-provider-consistency-checker/index.js agents/playwright-testing-agent
node hooks/plugin-integrity-checker/index.js plugins/lightspeed-playwright-testing
node hooks/agent-security-auditor/index.js agents/playwright-testing-agent
npm run validate:plugins
npm run validate:json:schemas
npx jest --config .jest.config.cjs hooks/
```

## Phase 7 — Ship

Branch `feat/agent-standards-playwright-testing`, add a `CHANGELOG.md` entry, open
a PR to `develop` with Linked issues, Changelog, and a completed Global DoD
checklist, then merge after review.

## Checklist

- [ ] Export analysed; real behaviour captured
- [ ] `AGENT.md` + `shared/core-prompt.md` written
- [ ] Claude / Copilot / OpenAI configs + tools written
- [ ] Plugin created and registered
- [ ] 4 schemas + 4 hooks added and passing
- [ ] Instruction files added
- [ ] All validators and hook tests green
- [ ] PR opened against `develop`

## Next steps

Reuse this playbook (and
[agent-creation-workflow.instructions.md](../instructions/agent-creation-workflow.instructions.md))
for the remaining 15 agents in Phase 2.
