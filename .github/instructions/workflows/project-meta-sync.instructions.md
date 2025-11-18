---
"title": "Workflow: Project Meta Sync"
"description": "Sync GitHub Project board fields with issue/PR metadata and labels."
"version": "v1.0"
"apply_to": ".github/workflows/project-meta-sync.yml, planner agent"
"last_updated": "2025-10-22"
"owners":
  - "LightSpeed Engineering"
"references":
  - "./workflows.instructions.md"
  - "../agents/planner.agent.js"
"file_type": "instructions"
---

# Mission

Sync GitHub Project board meta fields (Status, Priority, Type) from issue/PR labels and branch names.

# Strategy

- On issue/PR events, update Project items and meta fields.
- Use GitHub App token and project APIs.
- Allow custom label-to-field mappings.

# Agent Alignment

- Agents: planner, labeling/status agents

---