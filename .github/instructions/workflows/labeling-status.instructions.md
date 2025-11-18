---
file_type: "instructions"
title: "Workflow: Labeling & Status Automation"
description: "Automate and enforce PR/issue labeling, status, and changelog requirements."
version: "v1.0"
apply_to: ".github/workflows/labels-issues-prs.yml, associated agents"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "../agents/labeling.agent.js"
  - "../agents/status-one-hot.enforcer.js"
---

# Mission

Automate labeling, status, and changelog management for issues and PRs.

# Strategy

- Trigger on issue/PR events.
- Auto-label PRs using file/branch heuristics.
- Enforce one `status:*` label.
- Add `meta:needs-changelog` if missing.

# Agent Alignment

- Agents: `labeling.agent.js`, `status-one-hot.enforcer.js`
- Migrate all shell logic to agents.

---
