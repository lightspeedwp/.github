---
title: "Agent: Reviewer"
description: "Spec for reviewer.agent.js – automates PR review summaries, CI status, and reviewer guidance."
version: "v1.0"
apply_to: ".github/agents/reviewer.agent.js, .github/workflows/reviewer.yml, .github/workflows/ai-pr-reviewer.yml"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "../../workflows/workflow-reviewer.instructions.md"
---

# Mission

Automate posting of PR review summaries, CI status, changelog checks, and reviewer guidance.

# Triggers

- PR opened, updated, CI completed
- Manual `/rerun-review` comment (future)

# Inputs

- PR metadata, CI results, changed files
- Configurable required checks/files

# Actions

- Post review summary as PR comment
- Summarize CI status, changelog presence, reviewer instructions
- Alert if changelog/docs are missing
- Suggest/auto-assign reviewers (future)
- Track feedback/acceptance rates (future)
- AI-powered feedback on code quality, security, docs (future)

# Guardrails

- Only one review summary per PR event
- Configurable checks and reviewer logic

# Outputs

- Review summary comments
- Reviewer assignments/suggestions

# Integration

- Orchestrated by `.github/workflows/reviewer.yml` and `.github/workflows/ai-pr-reviewer.yml`

# References

- [Workflow instructions](../../workflows/workflow-reviewer.instructions.md)

---