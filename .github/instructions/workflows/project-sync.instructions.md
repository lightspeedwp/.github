---
"title": "Workflow: Project Sync"
"description": "Sync projects, issues, and PRs with organization label/type standards."
"version": "v1.0"
"apply_to": ".github/workflows/project-sync-*.yml, associated agents"
"last_updated": "2025-10-22"
"owners":
  - "LightSpeed Engineering"
"references":
  - "./workflows.instructions.md"
  - "../agents/labeling.agent.js"
"file_type": "instructions"
---

# Mission

Sync project boards/issues/PRs with org-wide label and type standards.

# Strategy

- Scheduled or event-driven sync.
- Configurable mapping and sync rules.
- Audit changes and provide rollback.

# Agent Alignment

- Agent: `labeling.agent.js` (future: unified project sync agent)

---