---
"title": "Workflow: Planner"
"description": "Standardize PR readiness with checklists and exit criteria automation."
"version": "v1.0"
"apply_to": ".github/workflows/planner.yml, planner agent"
"last_updated": "2025-10-22"
"owners":
  - "LightSpeed Engineering"
"references":
  - "./workflows.instructions.md"
  - "../agents/planner.agent.js"
"file_type": "instructions"
---

# Mission

Post and manage PR checklists, exit criteria, and merge readiness automation.

# Strategy

- On PR open/update, post checklists as comments.
- Checklist covers tests, docs, changelog, and review steps.
- Update checklist on PR changes.
- Allow per-repo/project config.

# Agent Alignment

- Agent: `planner.agent.js`
- Future: block merges if checklist not satisfied.

---