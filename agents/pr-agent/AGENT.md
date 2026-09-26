---
name: "PR Agent"
description: "Portable agent for GitHub pull request creation, template routing, labelling, and error handling."
file_type: "agent"
category: "automation"
status: "active"
visibility: "public"
tags:
  - automation
  - pull-requests
  - github
  - workflow-automation
  - portable
version: "v1.0.0"
created_date: "2026-08-01"
last_updated: "2026-09-21"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/pr-agent/"
permissions:
  - read
  - write
  - github
  - git
---

# PR Agent

## Purpose

Coordinate the current GitHub pull-request workflow: validate branch names, route caller-supplied PR data through static template and label mappings, submit it, and recover from errors. First-class in `lightspeedwp/.github`, portable to any other LightSpeedWP repository.

The complete User Story 2 guarantees are not implemented yet. Commit/diff-derived content is deferred to T015, repository-configuration-driven template routing to T020, and repository-backed exact label validation and atomic application to T021. Until those tasks land, callers must supply accurate PR content and any repository-specific policy inputs themselves.

## Skills

| Skill | Responsibility |
| --- | --- |
| [`validate-branch-name`](skills/validate-branch-name/SKILL.md) | Validates a branch name follows `{type}/{scope}-{short-title}`, checking it against this repository's canonical forbidden and approved prefix lists. |
| [`route-pr-template`](skills/route-pr-template/SKILL.md) | Selects a template from its static branch-type map or an explicit user override. |
| [`orchestrate-pr-creation`](skills/orchestrate-pr-creation/SKILL.md) | Validates and assembles caller-supplied PR data (title, body, head, base, labels) before submission. |
| [`validate-and-apply-labels`](skills/validate-and-apply-labels/SKILL.md) | Applies static or caller-configured branch-type mappings and validates labels against its current built-in or caller-supplied policy. |
| [`submit-pr`](skills/submit-pr/SKILL.md) | Submits the orchestrated PR object to GitHub, or validates it without creating anything in dry-run mode. |
| [`handle-pr-errors`](skills/handle-pr-errors/SKILL.md) | Catches errors from any stage of the PR workflow and suggests recovery actions. |

## Operating Modes

**Create PR** — validate branch name, route template, orchestrate PR data, apply labels, submit.
**Validate only** — run validation skills (branch name, labels) without submitting.
**Dry run** — orchestrate and validate the PR object without creating it on GitHub.

## Qodo PR-Agent integration

[Qodo PR-Agent](../../docs/QODO_PR_AGENT.md) is an optional input to this asset. It is the third-party tool, not the internal `agents/pr-agent/`. The full map of integrations is in the [responsibility matrix](../../.github/specs/017-qodo-pr-agent-integration/contracts/responsibility-matrix.md).

- **Invocation**: [`skills/qodo-pr-agent`](../../skills/qodo-pr-agent/SKILL.md) in **diff mode** (before the PR exists) for (1) `describe`, as an optional source for the diff-derived body section, and (2) `review` and `improve`, as the "AI-review findings" input to the self-review gate (spec 015 US2).
- **On output**: Use the summary as source material only. Template routing and the final PR body stay owned by this agent. Findings are listed in the self-review gate for the author to resolve.
- **Fallback**: Existing body generation and gate behaviour, with the gate recording "no Qodo PR-Agent input (skipped)". When the skill returns `skipped` or `error`, say `Qodo PR-Agent input skipped: <reason>` in this asset's own output.

## Implementation Reference

- **Folder:** `agents/pr-agent/`
- **Entry points:** each skill's own `skills/<name>/scripts/<name>.js`
- **Tests:** `skills/<name>/scripts/__tests__/<name>.test.js` (unit), `__tests__/integration/` (cross-skill)

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
