---
file_type: "report"
title: "Portable Workflows Source Report"
description: "Issue #298 evidence for defining /workflows as the portable agentic workflow source."
version: "v0.1.0"
last_updated: "2026-05-26"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["portable-ai-plugin-restructure", "workflows", "migration", "issue-298"]
domain: "ai-ops"
stability: "draft"
references:
  - path: "issues/children/batch-02-portable-migration/02-06-feature-define-portable-workflows-source.md"
    description: "Issue #298 local source draft."
  - path: "../../../../workflows/README.md"
    description: "Portable workflow ownership index."
  - path: "../../../../workflows/portable-ai-plugin-restructure.md"
    description: "Example portable agentic workflow spec."
---

# Portable Workflows Source Report

Parent epic: #283. Child issue: #298.

## Summary

`/workflows` is now defined as the portable source folder for human-readable
agentic workflows and reusable runbooks. Executable GitHub Actions remain in
`.github/workflows/`.

## Changes Made

| Area | Outcome |
| --- | --- |
| Workflow ownership index | Updated `workflows/README.md` with the #298 reference and a workflow catalogue. |
| Example workflow spec | Added `workflows/portable-ai-plugin-restructure.md` as the first portable workflow example. |
| Related assets | Linked the example workflow to `agents/task-planner.agent.md`, `instructions/task-implementation.instructions.md`, and `skills/README.md`. |
| GitHub Actions boundary | Preserved `.github/workflows/` as the executable GitHub Actions folder. |

## Acceptance Criteria

- [x] `/workflows` is documented as agentic workflow source, not GitHub Actions.
- [x] `.github/workflows` remains the executable GitHub Actions folder.
- [x] At least one example portable workflow spec exists.
- [x] Links to related skills or agents are included.
- [x] Documentation updated.
- [x] Validation covers changed workflow documentation.

## Verification

| Command | Result |
| --- | --- |
| `npx markdownlint-cli2 "workflows/*.md" ".github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-portable-workflows-source-report-2026-05-26.md"` | Passed. |
| `npm run validate:structure` | Passed. |
| `git diff --check` | Passed. |

## Notes

- No GitHub Actions workflows were moved.
- No workflow validator exists yet, so Markdown linting and structure
  validation are the relevant checks for this issue.
