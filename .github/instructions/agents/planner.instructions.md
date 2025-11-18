---
file_type: "instructions"
title: "Planner Agent Instructions"
description: "Instructions for Planner Agent: Automates PR checklists and exit criteria."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "planner", "instructions", "checklist", "automation"]
file_type: "instructions"
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
