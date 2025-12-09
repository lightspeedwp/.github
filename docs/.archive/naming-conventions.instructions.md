---
file_type: "instructions"
apply_to: "*.md"
title: "Naming Conventions for Documentation and Config Files"
description: |
  Standardizes naming for instruction, agent, prompt, and documentation files.
last_updated: "2025-10-22"
owners: ["lightspeedwp/maintainers"]
category: "governance"
---

# Naming Conventions

- Documentation and configuration filenames **must** use lowercase with hyphens (`-`) for spaces, except for top-level summary/reference files (e.g., `AGENTS.md`, `FRONTMATTER-SCHEMA.md`), which are all uppercase.
- **Single instruction files:** `name.instructions.md` (e.g., `coding-standards.instructions.md`)
- **Single prompt files:** `name.prompt.md` (e.g., `refactor-function.prompt.md`)
- **Agent specification:** `name.agent.md` (e.g., `jsdoc-review.agent.md`)
- **Agent code (JavaScript):** `name-agent.js` (e.g., `jsdoc-review-agent.js`)
- **Agent code (Python):** `name-agent.py` (e.g., `wp-accessibility-review-agent.py`)
- **Agent code (Shell):** `name-agent.sh`
- **Chatmode files:** `name.chatmode.md`
- **Prompt index:** `prompts.md`
- **Instructions index:** `instructions.md`
- **Saved replies:** `SAVED_REPLIES.md`, individual: `name.md` in `.github/SAVED_REPLIES/`
- **Issue/PR templates:** Must live in `.github/ISSUE_TEMPLATE/` or `.github/PULL_REQUEST_TEMPLATE/`
- **Discussion templates:** `.github/DISCUSSION_TEMPLATES/`

**Always include a canonical `file_type` field in YAML frontmatter.**
