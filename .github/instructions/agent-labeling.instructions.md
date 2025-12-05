---
file_type: "instructions"
title: "Labeling Agent Instructions"
description: "Instructions for Labeling Agent: Automated label enforcement, triage, and standardization."
version: "v1.0"
last_updated: "2025-12-04"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "labeling", "instructions", "automation", "triage"]
file_type: "instructions"
---

# Mission

Automatically label Issues & PRs according to changed files, branch naming, or project configuration. Automate labeling, status, and changelog management for issues and PRs. Document how LightSpeed applies labels and automates labelling for pull requests.

# Strategy

- Use `actions/labeler` or custom scripts.
- Consolidate into `labeling.agent.js`.
- Ensure sync with org label standards.
- Trigger on issue/PR events.
- Auto-label PRs using file/branch heuristics.
- Enforce one `status:*` label.
- Add `meta:needs-changelog` if missing.
- Maintain a central list of **default labels** (e.g. `bug`, `enhancement`, `documentation`, `priority`, `needs-review`). Apply these manually to issues for triage and signalling.
- Avoid auto‑labelling issues; developers or triagers should apply labels based on context.

# Agent Alignment

- Agent: `labeling.agent.js`

# Automation for Pull Requests

- Use a GitHub Actions workflow (e.g. `label-pr.yml`) to automatically apply labels to pull requests based on branch names, file paths, or commit messages.
- Ensure the workflow only targets PRs (`pull_request` events) and does not run on issues.
- Keep the automation logic simple and maintainable (e.g. map prefixes like `fix/` to the `bug` label).

# References

- <https://docs.github.com/en/actions/tutorials/manage-your-work/add-labels-to-issues>

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
