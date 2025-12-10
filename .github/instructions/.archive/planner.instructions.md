---
file_type: "instructions"
title: "Workflow: Planner"
description: "Standardize PR readiness with checklists and exit criteria automation."
version: "v1.0"
apply_to: ".github/workflows/planner.yml, planner agent"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "../agents/planner.agent.js"
---

# Mission

Post and manage PR checklists, exit criteria, and merge readiness automation.

# Strategy

- On PR open/update, post checklists as comments.
- Checklist covers tests, docs, changelog, and review steps.
- Update checklist on PR changes.
- Allow per-repo/project config.

# Agent Alignment

- Agent: `planner.agent.js`
- Future: block merges if checklist not satisfied.

---

# Planner Agent Instructions

## Mission

Automate posting and updating merge checklists and exit criteria for every PR to ensure all requirements are met before merge.

## Process

- Triggered on PR open or update ([planner.yml](../../workflows/planner.yml)).
- Generate and post a checklist comment to the PR.
- Update the checklist as PR details change.
- One checklist comment per PR (update, don’t duplicate).

## What It Checks

- All standard PR requirements (tests, docs, a11y, CI green, etc.).
- Customizable checklists per repo/project.

## Best Practices

- Checklist must be clear, actionable, and not duplicated.
- Allow for repo/project-specific customization.

## Guardrails

- Do not block merges unless configured.
- Always update, never duplicate checklist comments.

## Outputs

- PR checklist comment.
- (Optional) analytics/report.

## References

- [Planner Agent Spec](../../agents/planner.agent.md)
- [Workflows Instructions](../workflows.instructions.md)
- [Automation Governance](../../AUTOMATION_GOVERNANCE.md)

---
