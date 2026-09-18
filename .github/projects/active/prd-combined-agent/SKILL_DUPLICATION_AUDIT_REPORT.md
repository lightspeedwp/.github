---
file_type: report
title: "PRD Agent Skill Duplication Audit Report"
description: "File-by-file diff of every intra-folder skill cluster identified in INTRA_FOLDER_SKILL_AUDIT_SCOPE.md — all 17 clusters (Phase A + Phase B) complete"
created_date: "2026-09-10"
last_updated: "2026-09-10"
status: complete
tags:
  - prd
  - agent-standards
  - skills
  - reconciliation
owners:
  - lightspeedwp/maintainers
---

# PRD Agent Skill Duplication Audit Report

**Related:** [INTRA_FOLDER_SKILL_AUDIT_SCOPE.md](./INTRA_FOLDER_SKILL_AUDIT_SCOPE.md) (the scope this report executes) · [SKILL_RECONCILIATION_REPORT.md](./SKILL_RECONCILIATION_REPORT.md) (the cross-folder audit this one extends) · [PLANNING.md](./PLANNING.md#phase-3-structural-consolidation-scoped-) · [.github/specs/001-prd-agent-consolidation/](../../../specs/001-prd-agent-consolidation/)

**Method:** Full-content read (`SKILL.md` in full, `references/`/`assets/`/`examples/`/`scripts/` skimmed and spot-read) for every skill in each of the 12 High-confidence clusters from the scope doc, run in parallel. This is analysis only — no files have been merged, moved, or deleted yet. That's Phase 3 execution work, tracked separately.

## Headline finding: this is an abandoned rename campaign, not random duplication

**8 of the 12 clusters contain a `rollout/rename-notes.md` or `rollout/consolidation-notes.md` file that self-declares which skill is meant to replace which.** In every one of those 8 cases, the skill claiming to be "the replacement" is the thinner, less-developed one — the older skill it was meant to replace still holds all the real domain content (WordPress rules, Figma mapping, templates, schemas, routing tables). Someone (or some automated pass) started renaming/re-scaffolding these skills into a new naming convention and wrote the intent down, but never finished porting the actual content across. This explains the pattern the original `SKILL_RECONCILIATION_REPORT.md` §2.1 misread as "a deliberate generic-routing tier vs. specialists" — it isn't a deliberate two-tier design, it's an interrupted migration.

The exception: **`content-file-validator` vs. `markdown-content-validator`** (cluster 12) shows no rename-notes and no content lineage — two independently-written, incompatible script implementations solving the same problem. Genuine parallel duplication, different root cause from the other 11.

## Cluster verdicts

| # | Cluster | Skills examined | Verdict | Keep / merge into | Content that must be ported before deleting the loser(s) |
|---|---|---|---|---|---|
| 1 | PRD drafting | `prd-writer`, `prd-generation`, `prd-generator` | COMPLEMENTARY (2) + duplicate (1) | Merge `prd-writer` + `prd-generator`; delete `prd-generation` (pure subset, nothing lost) | Into merged skill: `prd-generator`'s WordPress/Figma rules, project-type variants, approval gates, acceptance-criteria formats, 7 asset templates — **and** `prd-writer`'s JSON schemas, delta/update mode, cross-skill routing |
| 2 | PRD/artefact review | `prd-reviewer`, `prd-task-reviewer`, `review-qa` | DUPLICATE | Keep `prd-task-reviewer`; delete the other two | `prd-reviewer`'s `cross-skill-routing.md` and `schemas/review-report.schema.json` |
| 3 | Change management | `change-control`, `change-request-router` | DUPLICATE | Keep `change-request-router`; delete `change-control` | `change-control`'s 2 JSON schemas, `prd-delta.md` template concept, `tests/fixtures/change-cases.md` |
| 4 | Implementation planning | `implementation-planning`, `implementation-plan-generator` | DUPLICATE | Keep `implementation-plan-generator`; delete `implementation-planning` | The "estimation-basis" output type and the "don't estimate from a weak source" / "discovery vs. implementation effort" quality-bar lines |
| 5 | Issue drafting | `issue-drafting`, `github-issue-drafter` | DUPLICATE | Keep `github-issue-drafter`; delete `issue-drafting` | Nothing load-bearing — optionally fold in as a "lightweight mode" note |
| 6 | Launch readiness | `launch-handoff-support`, `launch-task-router` | DUPLICATE | Keep `launch-task-router`; delete `launch-handoff-support` | Nothing — strict subset |
| 6b | *(adjacent, not merged)* | `release-handoff-generator` | DISTINCT | Stays separate | Confirmed downstream/post-launch lifecycle stage (release notes, client handover, 7/30/60/90-day monitoring) vs. cluster 6's pre/at-launch routing — not part of this cluster |
| 7 | QA triage | `qa-triage`, `qa-findings-router` | DUPLICATE | Keep `qa-findings-router`; delete `qa-triage` | `qa-triage`'s 2 JSON schemas, `tests/fixtures/qa-finding-cases.md`, and 4 routing targets from its `cross-skill-routing.md` not present in the router's list |
| 8 | Project pack export | `project-pack-exporter`, `prd-task-pack-exporter` | DUPLICATE (name/content split) | Content favours `prd-task-pack-exporter`; naming/rollout-notes favour `project-pack-exporter` as the surviving name — **maintainer call needed on which wins**, but either way port content into whichever name survives | `prd-task-pack-exporter`'s entire 9-directory pack structure, `pack-workflow.md`, `source-classification.md`, `pack-quality-checklist.md`, `file-naming-rules.md`, 5 asset templates, icon.svg |
| 9 | Intake structuring | `project-intake`, `project-intake-router`, `intake-routing` | COMPLEMENTARY (2) + duplicate (1) | Merge `project-intake` + `project-intake-router`; delete `intake-routing` (nothing lost) | Into merged skill: `project-intake-router`'s WordPress build-type classification, approval-gates checklist, 14-skill routing, 5 asset templates — **and** `project-intake`'s JSON schemas, worked example, test fixtures |
| 9b | *(adjacent, confirmed distinct)* | `lightspeed-intake-onboarding` | DISTINCT | Stays separate | Confirmed: first-run Memory/user-defaults bootstrapping, explicitly *not* per-project evidence — different job entirely |
| 10 | Research | `project-research`, `project-researcher` | COMPLEMENTARY | Merge, base on `project-researcher`'s structure | Into merged skill: `project-researcher`'s Figma/GitHub/WordPress-site research playbooks and finer evidence-status taxonomy — **and** `project-research`'s JSON schemas, test fixtures, worked example |
| 11 | Evidence discipline | `evidence-locker`, `evidence-locking` | DUPLICATE | Keep `evidence-locker`; delete `evidence-locking` | The "contradiction"/"weak or stale evidence" claim categories and the "confidence level"/"recommended next evidence step" output fields |
| 12 | Markdown/frontmatter validation | `content-file-validator`, `markdown-content-validator` | DUPLICATE (independent implementations) | Keep `markdown-content-validator` (zero runtime deps, cleaner reporting model, scope matches its name) | `content-file-validator`'s broader extension list, `fileTypeOverrides`, `suggestedDefaults`, `--fail-on-empty` flag — port only what's still wanted |

## Net effect on skill count

27 skills went into these 12 clusters; **12 survive** (either as the kept skill or as a merge target) once content is ported and losers deleted — a reduction of 15. Combined with the 18 top-level skills this Phase A pass didn't touch (the 4 remaining Medium-confidence clusters from the scope doc — `acceptance-test-planner`/`validation-support`, `figma-wordpress-technical-brief`/`technical-brief-deep-dive`, `memory-management`/`project-memory-manager`, `task-breakdown-planner`/`delivery-planner`(+`estimation-planner`) — the standalone `prd-task-manager`/`prd-agent-orchestrator` question, `frontend-skill`, and the 4 confirmed-unique skills), plus `qa-planner` being promoted from `skills/hermes/` (spec.md FR-002):

**Provisional curated count after Phase A alone: ~31 skills** (was ~45 + hermes leftovers before this audit), and that number will likely drop further once Phase B resolves the remaining Medium clusters and the `prd-task-manager` question — several of those (task-breakdown-planner/delivery-planner, memory-management/project-memory-manager) read as plausible additional merges on a first pass, they just weren't diffed at file level in this round.

## Phase B: the 4 Medium-confidence clusters + the `prd-task-manager` standalone read

Same method as Phase A (full-content read, not just descriptions), run in parallel across the 5 remaining items from the scope doc.

| # | Cluster | Skills examined | Verdict | Keep / merge into | Content that must be ported before deleting the loser(s) |
|---|---|---|---|---|---|
| 13 | Acceptance/validation | `acceptance-test-planner`, `validation-support` | **DISTINCT** | Both kept | N/A — different objects entirely: `acceptance-test-planner` authors new WordPress/Figma-specific QA artifacts (test plans, matrices, scripts); `validation-support` is a generic file-set completeness/hygiene checker with no domain content. Overlap was superficial vocabulary ("validation", "coverage"), not job overlap. Flag separately: `validation-support` has zero references/assets (44-line SKILL.md only) — worth a "is this a stub?" check outside this audit's scope |
| 14 | Technical brief | `figma-wordpress-technical-brief`, `technical-brief-deep-dive` | DUPLICATE | Keep `figma-wordpress-technical-brief`; delete `technical-brief-deep-dive` | Nothing — `technical-brief-deep-dive` claims to be a "go deeper" sequential step but has no mechanism to ingest an existing brief, is orphaned from every routing table in the codebase (`grep` for it returns zero hits elsewhere), and is 32x smaller with no supporting files |
| 15 | Memory | `memory-management`, `project-memory-manager` | **DISTINCT** | Both kept | N/A — `memory-management` is a lightweight *whether-to-persist* judgment gate; `project-memory-manager` is the *how-to-structure-the-memory-bank* content/file-schema system. Sequential relationship (one's "save" output could hand off to the other), not duplication |
| 16 | Task breakdown / delivery / estimation | `task-breakdown-planner`, `delivery-planner`, `estimation-planner` | DUPLICATE (first two) + DISTINCT (estimation-planner) | Keep `delivery-planner` (already wired into the live routing graph via `estimation-planner`'s `cross-skill-routing.md`, and its own `rollout/consolidation-notes.md` names it as replacing task-breakdown-planner); delete `task-breakdown-planner`. `estimation-planner` stays separate — correctly boundary-fenced ("do not create implementation tasks unless routed to `lightspeed-delivery-planner`") | Same abandoned-rename pattern as Phase A: `delivery-planner`'s reference files are skeletal stubs. Must port from `task-breakdown-planner` before deleting it: `wordpress-task-rules.md` (theme/plugin split), `workstream-model.md` (WooCommerce/tourism/publishing workstreams), `dependency-and-wave-planning.md` (Wave 0-5 model + DAG syntax), `qa-mapping.md`, `acceptance-criteria.md`, `issue-draft-rules.md` (label taxonomy), `assets/icon.svg` |
| 17 | Orchestration | `prd-task-manager`, `prd-agent-orchestrator` | Redundant (1) + **DISTINCT, confirmed deliberate** (1) | Retire `prd-task-manager`; **keep `prd-agent-orchestrator`** | `prd-task-manager` is the pre-fragmentation "do everything" generation — its per-topic content is a condensed table-of-contents version of what each specialist skill later expanded into, at roughly half the depth. `prd-agent-orchestrator`'s own `rollout/migration-notes.md` states explicitly: *"migrate only the routing behaviour here rather than collapsing the suite back into one skill"* — confirming the split from a broader PRD skill was deliberate and one-directional. Before deleting `prd-task-manager`: consider porting its "full project pack" single-command bundling mode (nothing else generates-then-bundles in one pass; closest is `project-pack-exporter`/`prd-task-pack-exporter`, which only assemble existing artefacts) |

**This closes the routing-layer architecture question from `INTRA_FOLDER_SKILL_AUDIT_SCOPE.md` §5** (at least for this pairing): `prd-agent-orchestrator` is not redundant with the content-generating specialists — it's a deliberately separated lifecycle router with its own migration record confirming intent. The earlier "possible hub-and-spoke redundancy" concern doesn't hold for this pair.

## Net effect on skill count (Phase A + Phase B combined)

- Baseline before any audit: 45 top-level skills + `skills/hermes/`'s 4 leftovers (3 forks of existing skills, 1 new — `qa-planner`, promoted per FR-002) = **46**.
- Phase A: 27 skills → 12 survivors (-15).
- Phase B: 11 skills → 8 survivors (-3).
- Untouched (confirmed unique or confirmed-distinct-adjacent, no action needed): `approval-gate-manager`, `requirements-traceability-mapper`, `project-status-reporter`, `wordpress-plugin-packaging-review`, `release-handoff-generator`, `lightspeed-intake-onboarding` (6 skills) + `frontend-skill` (1, pending removal as out-of-scope content, not a duplication question).

**Curated total: 46 → 28 skills** (12 + 8 + 6 + 1 [`qa-planner`] + 1 [`frontend-skill`, pending its removal decision] = 28; drops to **27** once `frontend-skill` is removed).

## What remains — hand to `/speckit-tasks`

- **Cluster 8's naming question** (`project-pack-exporter` vs. `prd-task-pack-exporter` — content merges either way, but the surviving directory name needs a maintainer call).
- **`frontend-skill`**'s removal (confirmed out of place, unrelated to PRD work) — decision still pending, per scope doc §5.
- Every "content that must be ported before deleting" list across both phases is real implementation work (union-merging reference docs, templates, schemas) — not yet executed. This report is findings only.

## Status

**All 17 clusters from `INTRA_FOLDER_SKILL_AUDIT_SCOPE.md` now diffed/read (Phase A + Phase B complete, 2026-09-10).** No file merges/deletions executed — that's Phase 3 implementation work, ready to be broken into tasks.
