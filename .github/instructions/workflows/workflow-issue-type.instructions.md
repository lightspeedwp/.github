---
title: "Workflow: Issue Type"
description: "Automate detection and labeling of issue types using heuristics."
version: "v1.0"
apply_to: ".github/workflows/auto-issue-type.yml, issue-type.yml, issue-type agent"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "../agents/issue-type.agent.js"
---

# Mission

Automatically analyze and label issues/PRs with type labels (`type:bug`, `type:feature`, etc.) using heuristics.

# Strategy

- On issue/PR creation, analyze title/body for type.
- Apply type labels based on heuristics or title prefix.
- Support user corrections and alias definitions.

# Agent Alignment

- Agent: `issue-type.agent.js`
- Merge `auto-issue-type.yml` and `issue-type.yml` logic.

---