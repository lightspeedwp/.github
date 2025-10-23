---
title: "Agent: Labels/Issues/PRs"
description: "Spec for labeling.agent.js – automates labeling, status, and changelog management for issues and PRs."
version: "v1.0"
apply_to: ".github/agents/labeling.agent.js, .github/workflows/labels-issues-prs.yml, .github/workflows/label-prs.yml, .github/workflows/labeler.yml, .github/workflows/label-prs-project.yml"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "../../workflows/workflow-labeling-status.instructions.md"
  - "../../workflows/workflow-auto-labeling.instructions.md"
---

# Mission

Automate and enforce labeling, status, and changelog management for issues and PRs.

# Triggers

- Issue or PR events (created, labeled, edited, etc.)

# Inputs

- Issue/PR metadata, changed files, branch names, PR body/front matter
- Label configuration/standards

# Actions

- Auto-label PRs based on file/branch heuristics or front matter
- Enforce single `status:*` label on issues/PRs
- Add `meta:needs-changelog` if missing
- Sync labels with org standards
- Provide feedback/reporting to PR authors

# Guardrails

- All logic should be agent-driven, not shell scripts
- Configurable and overridable per repo/project

# Outputs

- Updated issue/PR labels
- Feedback/comments for authors

# Integration

- Orchestrated by `.github/workflows/labels-issues-prs.yml`, `label-prs.yml`, `labeler.yml`, `label-prs-project.yml`

# References

- [Workflow instructions](../../workflows/workflow-labeling-status.instructions.md)
- [Auto-labeling](../../workflows/workflow-auto-labeling.instructions.md)

---