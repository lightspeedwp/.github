---
file_type: "workflow"
title: "Portable AI Plugin Restructure Workflow"
description: "Portable agentic workflow for completing the LightSpeed portable AI plugin restructure in dependency order."
version: "v0.1.0"
last_updated: "2026-05-26"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["workflow", "ai-ops", "plugin-restructure", "governance"]
domain: "governance"
stability: "draft"
references:
  - path: "../.github/projects/active/portable-ai-plugin-restructure/complete-portable-ai-plugin-restructure.prompt.md"
    description: "Project orchestration prompt this workflow distils into a portable runbook."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD defining the restructure phases and acceptance criteria."
  - path: "../agents/task-planner.agent.md"
    description: "Related planning agent specification."
  - path: "../instructions/task-implementation.instructions.md"
    description: "Related implementation instruction set."
---

# Portable AI Plugin Restructure Workflow

Use this workflow when completing the portable AI plugin restructure across
GitHub issues, local reports, migration-map rows, and validation evidence. It
is a portable agentic workflow, not a GitHub Actions workflow.

## Inputs

- Active project prompt:
  `.github/projects/active/portable-ai-plugin-restructure/complete-portable-ai-plugin-restructure.prompt.md`.
- Local issue drafts under
  `.github/projects/active/portable-ai-plugin-restructure/issues/`.
- Canonical migration map:
  `.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv`.
- Live GitHub issues #282 through #321 in `lightspeedwp/.github`.

## Outputs

- One reviewable implementation slice at a time.
- Updated local reports or migration-map rows when the issue changes project
  state.
- Validation evidence recorded in the GitHub issue comment before closure.
- Closed child issues only when acceptance criteria are genuinely complete.

## Steps

1. Re-check live GitHub issue state before starting a slice.
2. Pick the first open issue in the dependency order from the orchestration
   prompt.
3. Read the child draft, parent epic, related report, and current code paths.
4. Confirm dependencies are closed or document a safe reason to proceed.
5. Implement only the current issue acceptance criteria.
6. Run the smallest meaningful validation commands plus `git diff --check`.
7. Update the relevant local report or migration-map rows.
8. Comment on the GitHub issue with files changed, acceptance criteria,
   verification evidence, and blockers.
9. Close the issue only when the evidence is complete.

## Guardrails

- Keep `.github/workflows/` for executable GitHub Actions only.
- Keep `/workflows` for human-readable, portable AI runbooks and process
  contracts.
- Do not batch unrelated migrations into one issue just because the files are
  near each other.
- Prefer read-only validators for completion evidence; use explicit `format:*`
  or `fix:*` commands only when the issue calls for writes.
- Preserve historical reports unless a current issue explicitly updates them.

## Related Assets

- [Task planner agent](../agents/task-planner.agent.md)
- [Task implementation instructions](../instructions/task-implementation.instructions.md)
- [Portable skills index](../skills/README.md)
- [Portable workflow ownership index](README.md)
