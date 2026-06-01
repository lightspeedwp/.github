---
title: "Portable AI Plugin Restructure Issue Linking Plan"
description: "Issue #288 plan for milestones, labels, posting order, and parent-child linking across the portable AI plugin restructure programme."
version: "v0.1.0"
last_updated: "2026-05-19"
file_type: "project-report"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["task", "issues", "milestones", "labels", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD defining the target portable AI operations structure."
  - path: "issues/README.md"
    description: "Local index of posted parent and child GitHub issue drafts."
  - path: "issues/children/batch-00-planning-control/00-03-task-create-milestone-label-and-issue-linking-plan.md"
    description: "GitHub issue #288 local source draft."
---

# Portable AI Plugin Restructure Issue Linking Plan

Parent epic: #282. Child issue: #288.

## Summary

The restructure issue set has been posted to GitHub and linked back into the
local issue drafts. This plan records the milestone scheme, parent order, child
posting order, label requirements, and relationship rules that should be used
to manage the programme through completion.

Live GitHub verification on 2026-05-19 returned all 40 issues as open:

- Parent epics: #282, #283, #284, #285.
- Child issues: #286 through #321.
- Local draft count: 4 parent issues and 36 child issues.
- Local issue drafts with `github_issue` URLs: 40.
- Local child drafts with `github_parent` URLs: 36.

## Milestone Scheme

No GitHub milestones were returned for `lightspeedwp/.github` during the
2026-05-19 check, so these milestone names should be created or assigned when
the maintainers are ready to track the work in GitHub milestones.

| Milestone | Parent epic | Scope | Close when |
| --- | --- | --- | --- |
| `Portable AI Plugin Restructure - Foundation` | #282 | Planning control, inventory, baseline, skeleton, ownership indexes, and `.github` boundary policy. | Issues #286-#292 are complete and verified. |
| `Portable AI Plugin Restructure - Source Migration` | #283 | Portable instructions, agents, schemas, workflows, prompt classification, first skills, and cookbook backlog. | Issues #293-#304 are complete and verified. |
| `Portable AI Plugin Restructure - Pilot Plugin` | #284 | `lightspeed-github-ops` package skeleton, manifests, packaged pilot assets, and install docs. | Issues #305-#310 are complete and verified, with #317 smoke-test findings cross-linked. |
| `Portable AI Plugin Restructure - Stabilisation` | #285 | Validation reset, smoke tests, pilot rollout, future plugin pack backlog, and release readiness. | Issues #311-#321 are complete and verified. |

## Parent Epic Order

| Order | Issue | Parent scope | Dependency |
| --- | --- | --- | --- |
| 1 | #282 | Planning control and target skeleton. | Starts first; blocks broad migration. |
| 2 | #283 | Portable source migration. | Starts after #282 defines the target structure and boundary rules. |
| 3 | #284 | Core plugin and compatibility. | Starts after selected portable assets and pilot skills exist. |
| 4 | #285 | Validation, docs, pilot, and release. | Runs partly in parallel for read-only validation, then finishes after the pilot plugin exists. |

## Child Posting And Execution Order

The issues have already been posted. Keep this order for execution and any
future reposting.

| Order | Issue | Parent | Local draft | Purpose |
| --- | --- | --- | --- | --- |
| 1 | #286 | #282 | `children/batch-00-planning-control/00-01-audit-current-asset-inventory-and-migration-map.md` | Inventory AI assets and create the migration decision map. |
| 2 | #287 | #282 | `children/batch-00-planning-control/00-02-audit-baseline-validation-and-dependency-state.md` | Capture baseline validation, test, and dependency state. |
| 3 | #288 | #282 | `children/batch-00-planning-control/00-03-task-create-milestone-label-and-issue-linking-plan.md` | Create this milestone, label, and parent-child issue linking plan. |
| 4 | #289 | #282 | `children/batch-01-skeleton-boundary/01-01-task-create-target-folder-skeleton.md` | Create target top-level folder skeleton. |
| 5 | #290 | #282 | `children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md` | Add ownership indexes for new top-level folders. |
| 6 | #291 | #282 | `children/batch-01-skeleton-boundary/01-03-refactor-file-organisation-boundary.md` | Update file organisation rules for GitHub-native vs portable assets. |
| 7 | #292 | #282 | `children/batch-01-skeleton-boundary/01-04-refactor-repo-local-copilot-instructions.md` | Scope `.github` Copilot instructions to this repo only. |
| 8 | #293 | #283 | `children/batch-02-portable-migration/02-01-audit-classify-github-native-files.md` | Classify GitHub-native files that must remain in `.github`. |
| 9 | #294 | #283 | `children/batch-02-portable-migration/02-02-maintenance-clean-stale-path-references.md` | Clean stale path references before migration. |
| 10 | #295 | #283 | `children/batch-02-portable-migration/02-03-refactor-migrate-portable-instructions.md` | Migrate reusable instructions to `/instructions`. |
| 11 | #296 | #283 | `children/batch-02-portable-migration/02-04-refactor-migrate-portable-agent-specs.md` | Migrate reusable agent specs to `/agents`. |
| 12 | #297 | #283 | `children/batch-02-portable-migration/02-05-refactor-move-active-schemas-to-root-schemas.md` | Move active portable schemas to `/.schemas`. |
| 13 | #298 | #283 | `children/batch-02-portable-migration/02-06-feature-define-portable-workflows-source.md` | Define `/workflows` as portable agentic workflow source. |
| 14 | #299 | #283 | `children/batch-03-skills-cookbook/03-01-audit-classify-legacy-prompts.md` | Classify legacy prompts as skill, cookbook, archive, or delete. |
| 15 | #300 | #283 | `children/batch-03-skills-cookbook/03-02-feature-create-skills-library-index.md` | Create the portable `/skills` library index. |
| 16 | #301 | #283 | `children/batch-03-skills-cookbook/03-03-feature-create-frontmatter-audit-skill.md` | Create `lightspeed-frontmatter-audit` skill. |
| 17 | #302 | #283 | `children/batch-03-skills-cookbook/03-04-feature-create-pr-review-skill.md` | Create `lightspeed-pr-review` skill. |
| 18 | #303 | #283 | `children/batch-03-skills-cookbook/03-05-feature-create-label-governance-skill.md` | Create `lightspeed-label-governance` skill. |
| 19 | #304 | #283 | `children/batch-03-skills-cookbook/03-06-document-cookbook-and-favourite-skills-backlog.md` | Create cookbook and favourite skills backlog. |
| 20 | #305 | #284 | `children/batch-04-pilot-plugin/04-01-feature-create-lightspeed-github-ops-plugin-skeleton.md` | Create `plugins/lightspeed-github-ops` pilot plugin skeleton. |
| 21 | #306 | #284 | `children/batch-04-pilot-plugin/04-02-compatibility-add-copilot-plugin-manifest.md` | Add VS Code and GitHub Copilot plugin manifest metadata. |
| 22 | #307 | #284 | `children/batch-04-pilot-plugin/04-03-compatibility-add-codex-plugin-manifest.md` | Add Codex/OpenAI plugin manifest for pilot package. |
| 23 | #308 | #284 | `children/batch-04-pilot-plugin/04-04-compatibility-add-claude-plugin-manifest.md` | Add Claude Code plugin manifest for pilot package. |
| 24 | #309 | #284 | `children/batch-04-pilot-plugin/04-05-feature-package-pilot-agent-and-skills.md` | Package selected agent and pilot skills into `lightspeed-github-ops`. |
| 25 | #310 | #284 | `children/batch-04-pilot-plugin/04-06-document-plugin-installation-guide.md` | Write pilot plugin installation and update guide. |
| 26 | #311 | #285 | `children/batch-05-validation-reset/05-01-maintenance-fix-invalid-json-schema-syntax.md` | Fix invalid JSON schema syntax before validator reset. |
| 27 | #312 | #285 | `children/batch-05-validation-reset/05-02-buildci-split-validation-from-formatting.md` | Split validation commands from mutating format and fix commands. |
| 28 | #313 | #285 | `children/batch-05-validation-reset/05-03-buildci-add-validate-structure.md` | Add read-only `validate:structure` command. |
| 29 | #314 | #285 | `children/batch-05-validation-reset/05-04-buildci-add-validate-plugins-and-skills.md` | Add read-only plugin and skill validators. |
| 30 | #315 | #285 | `children/batch-05-validation-reset/05-05-buildci-add-validate-frontmatter-and-links.md` | Add read-only frontmatter and local link validators. |
| 31 | #316 | #285 | `children/batch-05-validation-reset/05-06-test-fix-coverage-reporting-and-import-side-effects.md` | Fix misleading coverage reporting and noisy import side effects. |
| 32 | #317 | #285 | `children/batch-06-pilot-release/06-01-compatibility-run-local-tool-smoke-tests.md` | Run local tool smoke tests for the pilot plugin. |
| 33 | #318 | #285 | `children/batch-06-pilot-release/06-02-feature-pilot-plugin-in-one-lightspeed-repo.md` | Pilot `lightspeed-github-ops` in one LightSpeed repository. |
| 34 | #319 | #285 | `children/batch-06-pilot-release/06-03-document-pilot-findings.md` | Document pilot findings and follow-up decisions. |
| 35 | #320 | #285 | `children/batch-06-pilot-release/06-04-research-create-future-plugin-pack-backlogs.md` | Create future plugin pack backlogs. |
| 36 | #321 | #285 | `children/batch-06-pilot-release/06-05-release-readiness-checklist.md` | Prepare pilot plugin restructure release readiness checklist. |

## Required Labels

The required labels already exist in `lightspeedwp/.github` as of the
2026-05-19 GitHub label check.

| Label group | Required labels |
| --- | --- |
| Status | `status:needs-planning`, `status:needs-triage`, `status:needs-review`, `status:in-progress`, `status:done`, `status:blocked` |
| Priority | `priority:important`, `priority:normal` |
| Area | `area:core`, `area:ci`, `area:documentation` |
| Type | `type:epic`, `type:ai-ops`, `type:audit`, `type:task`, `type:documentation`, `type:refactor`, `type:maintenance`, `type:feature`, `type:compatibility`, `type:build`, `type:test`, `type:research`, `type:release` |

Use a single status label per issue. Keep `type:ai-ops` on parent epics and
add the more specific type label for the work slice.

## Parent-Child Linking Rules

- Parent epics must list their child issue URLs in the `Linked Stories/Tasks`
  section.
- Each child draft must include a `github_parent` frontmatter URL.
- Each child body must name its parent epic with a clickable GitHub URL.
- Batch ownership remains:
  - #282 owns batches 00 and 01.
  - #283 owns batches 02 and 03.
  - #284 owns batch 04 and receives a cross-link from #317.
  - #285 owns batches 05 and 06.
- If GitHub native sub-issues are enabled later, mirror this relationship there
  but keep the Markdown links as durable fallback documentation.

## Acceptance Criteria Status

- [x] Milestone name and scope are defined.
- [x] Parent epic issue order is documented.
- [x] Child issue posting order is documented.
- [x] Required labels are listed.
- [x] Parent issue numbers are added back to local child drafts after posting.

## Follow-Up

- Create the four milestones in GitHub when maintainers want milestone tracking
  beyond issue links and labels.
- Assign issues to their milestone after the first PR for each parent epic is
  ready, so milestone state reflects real implementation progress.
- Comment on #288 with this report path once the project artefacts are staged
  or included in a PR.
