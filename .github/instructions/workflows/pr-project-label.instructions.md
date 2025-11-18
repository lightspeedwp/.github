---
"title": "Workflow: PR Project Board Labeler"
"description": "Apply project-specific labels to PRs using configuration."
"version": "v1.0"
"apply_to": ".github/workflows/pr-project-label.yml, labeling agent"
"last_updated": "2025-10-22"
"owners":
  - "LightSpeed Engineering"
"references":
  - "./workflows.instructions.md"
  - "../agents/labeling.agent.js"
"file_type": "instructions"
---

# Mission

Automatically apply project-relevant labels to PRs using project-specific configuration.

# Strategy

- Use `actions/labeler` with project config.
- Merge config into `labeling.agent.js` for standardization.

# Agent Alignment

- Agent: `labeling.agent.js`

---