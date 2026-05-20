---
title: "Portable AI Plugin Restructure GitHub-Native Classification Report"
description: "Issue #293 audit output classifying files that must remain in .github during the portable AI plugin restructure."
version: "v0.1.0"
last_updated: "2026-05-19"
file_type: "project-audit"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["audit", "github-native", "migration-map", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD defining the target portable AI operations structure."
  - path: "portable-ai-plugin-restructure-migration-map-2026-05-15.csv"
    description: "Canonical migration decision map updated by this audit."
  - path: "issues/children/batch-02-portable-migration/02-01-audit-classify-github-native-files.md"
    description: "GitHub issue #293 local source draft."
---

# Portable AI Plugin Restructure GitHub-Native Classification Report

Parent epic: #283. Child issue: #293.

## Summary

This audit protects GitHub inheritance and repository automation behaviour by
identifying files that must remain under `.github`. It also flags existing
portable AI assets that should move, convert, or defer through later migration
issues rather than being moved in this audit.

The migration decision map now includes the #293 GitHub-native classification
work:

- Migration map rows after this audit: **416**.
- New rows added for previously omitted GitHub-native PR, discussion, and
  governance files: **31**.
- Existing `keep` rows tagged with follow-up issue `#293`: **117**.
- Total rows linked to `#293`: **144**.
- Repo-local Copilot boundary row linked to `#292`: **1**.
- Cleanup review rows linked to `#294`: **10**.

## GitHub-Native Files That Stay In `.github`

| Area | Keep count | Decision |
| --- | ---: | --- |
| GitHub Actions workflows | 14 | Keep in `.github/workflows/`; portable agentic workflows belong in `/workflows`. |
| Issue templates | 28 | Keep in `.github/ISSUE_TEMPLATE/` for GitHub issue creation and organisation defaults. |
| Pull request templates | 11 | Keep default and branch-specific PR templates under `.github`. |
| Discussion templates | 10 | Keep in `.github/DISCUSSION_TEMPLATE/` for GitHub discussion defaults. |
| Saved replies | 75 | Keep in `.github/SAVED_REPLIES/` as maintainer/community-health responses unless later converted into cookbook examples. |
| Governance config | 6 | Keep Dependabot, funding, labels, labeler, issue types, and GitHub config under `.github`. |
| Repo-local Copilot instructions | 1 | Keep `.github/custom-instructions.md` scoped to this repository. |

## Portable Or Deferred Assets Flagged

| Asset group | Current map decision | Follow-up |
| --- | --- | --- |
| Agent specs in `.github/agents/` | `move` | #296 migrates reusable specs to `/agents`; repo-only remnants stay under `.github`. |
| Instruction files in `.github/instructions/` | `move`, `archive`, or `convert` | #295 handles reusable instructions; archived files remain until reviewed. |
| Legacy prompts in `.github/prompts/` | `convert` | #299 classifies prompts as skill, cookbook, archive, or delete. |
| Schemas in `.github/schemas/` | `move` | #297 moves active portable schemas to `/.schemas` once validators consume them. |
| Legacy agent and validation runtimes | `defer` | #311-#316 reset validation and avoid bulk-moving old JavaScript complexity. |
| Duplicate lowercase or metadata files | `defer` or `delete` | #294 should review stale paths and cleanup candidates before removal. |

## Findings And Risks

- Moving issue, pull request, or discussion templates out of `.github` would
  break GitHub's default template discovery.
- Moving `.github/workflows/` files would break GitHub Actions execution and
  reusable workflow references.
- Labels, labeler rules, issue types, Dependabot, and funding files are
  GitHub-native governance configuration and should stay in the control plane.
- Several `.github` folders still contain portable AI assets, but those require
  scoped migration issues because path references, frontmatter, and validation
  rules need updating first.
- Duplicate lowercase files and macOS metadata files should be reviewed under
  #294 instead of removed inside this audit.

## Migration Map Updates

The canonical migration map was updated to make the #293 audit traceable:

- Added `#293` to the `follow_up_issue` column for GitHub-native keep rows.
- Added missing PR template, discussion template, governance config, and
  repo-local Copilot rows.
- Added `#294` follow-up rows for duplicate lowercase files and the PR template
  macOS metadata cleanup candidate.
- Added `#292` to the repo-local Copilot instructions row.

## Acceptance Criteria Status

- [x] Classify issue, PR, and discussion templates.
- [x] Classify saved replies, labels, funding, dependabot, and workflows.
- [x] Classify repo-local Copilot and agent files.
- [x] Flag current `.github` files that are portable AI assets.
- [x] Add results to the migration decision map.
- [x] Findings and risks documented.
- [x] Remediation actions assigned and tracked.

## Remediation Actions

- Use #294 to review duplicate lowercase files, stale references, and macOS
  metadata cleanup candidates.
- Use #295-#298 for scoped portable source migration.
- Use #299-#304 for prompt classification, skills, and cookbook conversion.
- Use #311-#316 for validation reset and legacy runtime cleanup.
