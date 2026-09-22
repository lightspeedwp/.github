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

## Implementation Reference

- **Folder:** `agents/pr-agent/`
- **Entry points:** each skill's own `skills/<name>/scripts/<name>.js`
- **Tests:** `skills/<name>/scripts/__tests__/<name>.test.js` (unit), `__tests__/integration/` (cross-skill)

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
