---
title: "Labeling Agent Instructions"
description: "Instructions for Labeling Agent: Automated label enforcement, triage, and standardization."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "labeling", "instructions", "automation", "triage"]
file_type: "instructions"
---

# Labeling Agent Instructions

## Mission

Automate the application, enforcement, and standardization of labels on issues and PRs, ensuring one-hot status/priority labeling and reducing manual workload.

## Process

- Triggered on issue/PR open, update, or label events ([labeling.yml](../../workflows/labeling.yml)).
- Analyze content, files, and metadata.
- Apply/remove labels as needed based on config (labeler.yml, labels.yml, issue-types.yml).
- Enforce required labels (status, priority).
- Remove redundant/conflicting labels.

## What It Checks

- Presence of status, priority, and type labels.
- File path, branch, frontmatter-based label mapping.
- Conflict and redundancy resolution.

## Best Practices

- Keep label logic DRY and agent-driven.
- Allow per-repo config (labels.yml, labeler.yml).

## Guardrails

- Only apply existing labels.
- Never overwrite user-applied labels without warning.
- Log all label actions.

## Outputs

- Updated labels on issues/PRs.
- Action logs.

## References

- [Labeling Agent Spec](../../agents/labeling.agent.md)
- [Workflows Instructions](../workflows.instructions.md)
- [Automation Governance](../../AUTOMATION_GOVERNANCE.md)

---