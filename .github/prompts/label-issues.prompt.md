---
description: "Apply org label rules to a PR (not issues) via GitHub Action."
mode: "ask"
model: "GPT-4"
---
Generate or adjust a GitHub Actions workflow (e.g. `label-pr.yml`) that automatically labels pull requests based on patterns (such as branch names or file paths). Ensure the workflow:

1. Runs on `pull_request` events only.
2. Matches branch prefixes or file changes to predetermined labels (e.g. `fix/` → `bug`).
3. Does not modify issue labels.
4. Includes documentation and a brief summary of how labels are applied.

Reference: <https://docs.github.com/en/actions/tutorials/manage-your-work/add-labels-to-issues>
