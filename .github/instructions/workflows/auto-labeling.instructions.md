---
file_type: "instructions"
title: "Workflow: Auto-labeling (File/Branch/Project)"
description: "Apply labels to PRs based on changed files, branch names, or project config."
version: "v1.0"
apply_to: ".github/workflows/label-prs.yml, labeler.yml, label-prs-project.yml, labeling agent"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "../agents/labeling.agent.js"
---

# Mission

Automatically label PRs according to changed files, branch naming, or project configuration.

# Strategy

- Use `actions/labeler` or custom scripts.
- Consolidate into `labeling.agent.js`.
- Ensure sync with org label standards.

# Agent Alignment

- Agent: `labeling.agent.js`

---
