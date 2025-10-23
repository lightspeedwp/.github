---
title: "Workflow: Label Standardization"
description: "Sync repository labels to organization standard sets."
version: "v1.0"
apply_to: ".github/workflows/org-label-sync.yml, label-standardization agent"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "../agents/label-standardization.agent.js"
---

# Mission

Ensure all repositories use the organization’s canonical label set.

# Strategy

- On schedule or manual trigger, compare repo labels to org standard.
- Add, update, migrate, or remove labels as needed.
- Post summary reports and offer migration guidance.

# Agent Alignment

- Agent: `label-standardization.agent.js`

---