---
description: "Retrieve and suggest the most relevant GitHub Saved Reply for a given issue or pull request scenario."
mode: "instruct"
model: "GPT-4"
tools: []
---

# Saved Replies Prompt

Given the context of a GitHub issue or pull request, suggest the most appropriate saved reply from `.github/SAVED_REPLIES/` (or subfolders) for the scenario.

- If the user is missing a label, suggest the missing-labels reply.
- If a changelog is missing, suggest the changelog-required reply.
- If QA is needed, suggest the needs-qa reply.
- Always provide the filename and a short summary of why it's relevant.

If no exact match, suggest the closest reply and explain your reasoning.
