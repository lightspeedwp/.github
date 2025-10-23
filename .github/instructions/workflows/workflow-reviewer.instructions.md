---
title: "Workflow: Reviewer"
description: "Automate PR review summaries, CI status, and reviewer guidance."
version: "v1.0"
apply_to: ".github/workflows/reviewer.yml, ai-pr-reviewer.yml, reviewer agent"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "../agents/reviewer.agent.js"
---

# Mission

Automate PR review summaries, including CI status, changelog verification, and reviewer guidance.

# Strategy

- Trigger on PR open, update, or CI completion.
- Post review summary as a comment.
- Summarize CI, changelog, and reviewer instructions.
- Add AI-powered feedback and config in `reviewer.agent.js`.

# Agent Alignment

- Agent: `reviewer.agent.js`
- Future: rerun reviews, suggest/auto-assign reviewers.

---