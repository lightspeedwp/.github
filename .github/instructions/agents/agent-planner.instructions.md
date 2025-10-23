---
title: "Agent: Planner"
description: "Spec for planner.agent.js – automates PR checklists, merge readiness, and process analytics."
version: "v1.0"
apply_to: ".github/agents/planner.agent.js, .github/workflows/planner.yml"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "../../workflows/workflow-planner.instructions.md"
---

# Mission

Standardize and automate PR readiness, checklists, and exit criteria for all repositories.

# Triggers

- PR opened, updated, synchronized
- Manual workflow invocation

# Inputs

- PR metadata (title, body, labels, changed files)
- Repository/project config (custom checklists, requirements)

# Actions

- Post a Markdown checklist as a PR comment
- Update checklist if PR changes (avoid duplicates)
- Evaluate if checklist is satisfied (block merge if not)
- Suggest reviewers or enforce security steps (future)
- Collect analytics on checklist completion

# Guardrails

- Configurable per-repo/project
- Checklist must sync with org standards

# Outputs

- Up-to-date checklist comments on PRs
- Merge readiness status
- Analytics data

# Integration

- Orchestrated by `.github/workflows/planner.yml`

# References

- [Workflow instructions](../../workflows/workflow-planner.instructions.md)

---