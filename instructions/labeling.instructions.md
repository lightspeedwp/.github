---
file_type: "instructions"
title: "Labeling Instructions"
description: "Canonical instructions for the unified labeling automation system. Describes mission, strategy, configuration, and best practices for label management across issues, PRs, and discussions"
scope: "repo-local"
version: "v1.0"
last_updated: "2026-05-29"
owners: ["LightSpeed Team"]
tags: ["labels", "automation", "triage", "metadata", "governance"]
applyTo: ["**/*.md", ".github/workflows/labeling.yml", "scripts/agents/labeling.agent.js"]
status: "active"
---

# LightSpeed Labeling Instructions

Unified labeling strategy for organizing and automating GitHub issues, PRs, and discussions. Labels support triage, routing, and workflow automation.

## Labeling Philosophy

- **One-hot principle**: Only one value per label group (e.g., one `priority:*`, one `status:*`)
- **Automation-first**: Labels trigger workflows and project updates
- **Discoverability**: Labels enable search and filtering
- **Governance**: Labels enforce quality gates and routing rules

## Label Categories

### Status Labels (`status:*`)

- `status:needs-triage` — New, not yet reviewed
- `status:ready` — Clear requirements, ready to work
- `status:in-progress` — Someone is actively working
- `status:needs-review` — Waiting for review/approval
- `status:blocked` — Blocked by another issue/PR
- `status:done` — Completed and closed

**Rule:** Each issue/PR has exactly one `status:*` label

### Priority Labels (`priority:*`)

- `priority:urgent` — Security, critical bug, or blocker
- `priority:high` — High-impact, affecting multiple users
- `priority:normal` — Standard feature or improvement
- `priority:low` — Nice-to-have, deferred work

**Rule:** Each issue has exactly one `priority:*` label (PRs inherit from linked issue)

### Type Labels (`type:*`)

- `type:bug` — Unexpected behavior or error
- `type:feature` — New functionality
- `type:chore` — Maintenance, cleanup, tooling
- `type:docs` — Documentation improvements
- `type:refactor` — Code quality, no behavior change

### Area Labels (`area:*`)

Examples: `area:ci`, `area:documentation`, `area:a11y`, `area:performance`

Indicates which system or domain the issue affects.

## Automation Rules

- Labels trigger workflows via `labeling.agent.js`
- Status changes update project board automatically
- Priority labels route issues to appropriate teams
- Type labels filter by issue category

## Creating New Labels

Before creating a label:

1. Check if an existing label covers the need
2. Propose in an issue with rationale
3. Get approval from governance team
4. Update this documentation
5. Add to `.github/labels.json`

---

## Related Files

- [issues.instructions.md](./issues.instructions.md) — Issue creation and labeling standards
- [pull-requests.instructions.md](./pull-requests.instructions.md) — PR creation and labeling standards
- [automation.instructions.md](./automation.instructions.md) — Automation and workflow integration

---
