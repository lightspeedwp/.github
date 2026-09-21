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

Create and update GitHub pull requests correctly and consistently: deriving PR content from a branch's own commits, routing to the right PR template, validating branch names and labels, submitting the PR, and recovering from errors along the way. First-class in `lightspeedwp/.github`, portable to any other LightSpeedWP repository.

## Skills

| Skill | Responsibility |
| --- | --- |
| [`validate-branch-name`](skills/validate-branch-name/SKILL.md) | Validates a branch name follows `{type}/{scope}-{short-title}`, checking it against this repository's canonical forbidden and approved prefix lists. |
| [`route-pr-template`](skills/route-pr-template/SKILL.md) | Selects the correct PR template based on branch type, honouring the repository's own template-routing configuration and any user override. |
| [`orchestrate-pr-creation`](skills/orchestrate-pr-creation/SKILL.md) | Assembles and validates the PR data (title, body, head, base, labels) from the branch's own commits and diff before submission. |
| [`validate-and-apply-labels`](skills/validate-and-apply-labels/SKILL.md) | Validates labels against the repository's real canonical set and maps branch type to its required labels, including the changelog-decision label. |
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

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
