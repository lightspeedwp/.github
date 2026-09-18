---
file_type: report
title: "PRD Agent Intra-Folder Skill Duplication — Audit Scope"
description: "Defines what the fourth reconciliation pass must examine: overlapping skills within agents/prd-agent/ itself, not across the two source folders"
created_date: "2026-09-10"
last_updated: "2026-09-10"
status: draft
tags:
  - prd
  - agent-standards
  - skills
  - reconciliation
owners:
  - lightspeedwp/maintainers
---

# PRD Agent Intra-Folder Skill Duplication — Audit Scope

**Related:** [SKILL_RECONCILIATION_REPORT.md](./SKILL_RECONCILIATION_REPORT.md) (the cross-folder audit this one extends) · [FOLDER_STRUCTURE_PLAN.md](./FOLDER_STRUCTURE_PLAN.md) §4.4 · [PLANNING.md](./PLANNING.md#phase-3-structural-consolidation-scoped-) Phase 3, deliverable 3 · [.github/specs/001-prd-agent-consolidation/research.md](../../../specs/001-prd-agent-consolidation/research.md) D2 (the spec-kit finding that triggered this scope doc)

**Purpose:** `SKILL_RECONCILIATION_REPORT.md` proved `prd-agent` and `prd-factory-planner-agent` don't meaningfully duplicate each other. It never checked whether `prd-agent` duplicates **itself**. This document scopes that check — it is a plan for the audit, not the audit's findings. No `references/`-level file diffs have been run yet; the clustering below is based on `SKILL.md` name/description comparison only, which is the same first pass `SKILL_RECONCILIATION_REPORT.md` used before its file-by-file diff stage.

**Trigger:** Running `/speckit-plan` against the Phase 3 spec surfaced this by accident — comparing `review-qa`'s description against `lightspeed-prd-reviewer`'s and `lightspeed-prd-task-reviewer`'s side by side showed three skills doing the same job. Pulling every skill's description confirmed it's a repeat pattern, not a one-off.

---

## 1. Method (matches `SKILL_RECONCILIATION_REPORT.md`'s method, applied intra-folder)

1. **Cluster by description** — group skills whose stated purpose overlaps, regardless of name.
2. **Tag each cluster's style** — three recurring authoring styles were visible on sight:
   - **Style A**: `Use when...` framing, often generic (no LightSpeed/WordPress branding).
   - **Style B**: imperative lowercase, near-verbatim boilerplate — *"create/route/research X for lightspeed figma design system to wordpress block theme, block plugin, woocommerce, publishing, tourism and hybrid-theme projects"* appears, word-for-word or near enough, across more than a dozen skills.
   - **`lightspeed-*` specialist**: branded name, Style A framing, WordPress-specific detail.

   A cluster mixing styles is stronger duplication evidence than a cluster that doesn't — it suggests the same capability was authored in more than one batch/generation.
3. **File-by-file diff** (not done yet — this is the audit's execution phase, out of scope for this document): for every cluster below, `diff -rq` + `cmp` each candidate pair's `references/`/`assets/`, exactly as `SKILL_RECONCILIATION_REPORT.md` §1 did across folders.
4. **Decide per cluster**: keep one, merge complementary content, or confirm genuinely distinct (no action).

## 2. In scope / out of scope

**In scope**: all 45 top-level directories under `agents/prd-agent/skills/` (i.e. excluding `skills/hermes/`, whose 4 leftovers are already fully scoped by FR-001/FR-002 in the spec — a cross-folder fork question, not an intra-folder naming-generation question).

**Out of scope**: cross-folder duplication (closed by `SKILL_RECONCILIATION_REPORT.md`), `agent/` export-tree content (closed by `AGENT_FOLDER_RECONCILIATION_REPORT.md`), root `AGENT.md`/`README.md` (closed by `ROOT_FILES_RECONCILIATION_REPORT.md`).

## 3. Clusters requiring a diff-level decision

Confidence tier reflects description-only evidence. **High** = near-identical stated purpose, diff almost certainly needed. **Medium** = same domain, plausibly distinct, needs a read to confirm. **Low** = adjacent domain, likely distinct, included for completeness only.

| # | Capability | Skills (style) | Confidence | Note |
|---|---|---|---|---|
| 1 | PRD drafting | `prd-writer` (specialist), `prd-generation` (A), `prd-generator` (B) | **High** | 3-way; core "write the PRD" job stated three ways |
| 2 | PRD/artefact quality review | `prd-reviewer` (specialist), `prd-task-reviewer` (B), `review-qa` (A, unbranded) | **High** | 3-way; near-identical readiness/gap/evidence-quality language |
| 3 | Change request handling | `change-control` (specialist), `change-request-router` (B) | **High** | 2-way |
| 4 | Implementation planning | `implementation-planning` (A), `implementation-plan-generator` (B) | **High** | 2-way |
| 5 | Issue drafting | `issue-drafting` (A), `github-issue-drafter` (B) | **High** | 2-way |
| 6 | Launch readiness / routing | `launch-handoff-support` (A), `launch-task-router` (B) | **High** | 2-way; `release-handoff-generator` (below) is adjacent, not merged into this cluster |
| 7 | QA triage | `qa-triage` (specialist), `qa-findings-router` (B) | **High** | 2-way |
| 8 | Project pack export | `project-pack-exporter` (specialist), `prd-task-pack-exporter` (B) | **High** | 2-way |
| 9 | Intake structuring | `project-intake` (specialist), `project-intake-router` (B), `intake-routing` (A, unbranded) | **High** | 3-way; `lightspeed-intake-onboarding` deliberately excluded — see §4 |
| 10 | Research/evidence gathering | `project-research` (specialist), `project-researcher` (B) | **High** | 2-way |
| 11 | Evidence/fact discipline | `evidence-locker` (A), `evidence-locking` (A) | **High** | 2-way, both Style A — same style, still near-duplicate purpose |
| 12 | Markdown/frontmatter file validation | `content-file-validator`, `markdown-content-validator` | **High** | 2-way; near-identical descriptions, distinct from the planning-artefact validation cluster below |
| 13 | Planning-artefact validation | `acceptance-test-planner` (B), `validation-support` (A) | **Medium** | Plausibly distinct (test-plan generation vs. general validation pass) — needs a read, not assumed duplicate |
| 14 | Technical brief | `figma-wordpress-technical-brief` (B), `technical-brief-deep-dive` (A) | **Medium** | Could be sequential (create → deepen) rather than duplicate |
| 15 | Memory management | `memory-management` (A, generic), `project-memory-manager` (specialist) | **Medium** | Note: `project-memory-manager` *also* has confirmed forked content vs. its own `skills/hermes/` copy (spec.md FR-001) — that merge is separate from this cluster question |
| 16 | Task breakdown vs. delivery planning | `task-breakdown-planner` (B), `delivery-planner` (A) | **Medium** | Real overlap in stated scope (epics, tasks, sequencing, dependencies, acceptance coverage) — `estimation-planner` touches the edge of this too but reads more distinct (sizing/risk-buffer focus); include it in the read, don't presume it merges |
| 17 | Orchestration / catch-all | `prd-task-manager` (B), `prd-agent-orchestrator` (specialist) | **High** (differently) | Not a "same job, different name" pair — `prd-task-manager`'s description spans nearly every other skill's territory (PRD, briefs, plans, issues, breakdowns, QA plans, launch gates, memory packs), reading as an earlier do-everything generation now fragmented into specialists. `prd-agent-orchestrator` is a lifecycle *router*, a different job. Flag `prd-task-manager` for a standalone read against the whole skill set, not a pairwise diff |

## 4. Explicitly excluded from clustering (name looks similar, description reads distinct)

- **`lightspeed-intake-onboarding`** — "Collect first-run user defaults... persist in Memory, and resume the user's original request." This is session-bootstrapping, not intake *structuring* (cluster 9's job). Keep excluded unless a content read says otherwise.
- **`release-handoff-generator`** — broader than cluster 6 (release notes, client handover, support transition, post-launch monitoring), reads as downstream of launch-readiness routing rather than a duplicate of it. Worth confirming the boundary during the read, but not presumed to merge.

## 5. Additional findings (not skill-duplication, but surfaced by the same pass)

- **Possible routing-layer redundancy**: `change-request-router`, `launch-task-router`, `qa-findings-router`, `project-intake-router`, and `prd-agent-orchestrator` are five separate "decide where this goes" skills. This may be an intentional hub-and-spoke design (one orchestrator + per-domain routers) rather than duplication — resolving clusters 3/6/7/9 above will naturally answer this, but if it doesn't, it needs a maintainer architecture call, not a content diff, since the "right" answer depends on intended design, not on what's written down.
- **`frontend-skill`** doesn't belong in this audit's clusters at all — its description ("visually strong landing page, website, app, prototype, demo, or game UI... restrained composition") is unrelated to PRD/planning work entirely. This matches `FOLDER_STRUCTURE_PLAN.md` §1.4's existing warning about vendored platform skills that don't belong in this template. Recommend handling it as a removal candidate alongside that existing cleanup, not folding it into this audit.

## 6. Confirmed unique — no audit action needed

`approval-gate-manager` (top-level; its `hermes/` counterpart is FR-001's fork-merge, a separate question), `requirements-traceability-mapper`, `project-status-reporter`, `wordpress-plugin-packaging-review`, `estimation-planner` (tentatively — see cluster 16 note).

## 7. Recommended execution plan

| Phase | Scope |
|---|---|
| A | File-by-file diff (method §1.3) on the 11 **High**-confidence clusters (1-12, minus 13/14/15/16 which are Medium) — expect most to resolve the same way the cross-folder audit did: pick a winner, note anything genuinely complementary |
| B | Content read (not diff, since these aren't confirmed pairs) on the 4 **Medium**-confidence clusters (13, 14, 15, 16) and the `prd-task-manager` standalone case (17) |
| C | Resolve the routing-layer question (§5) — flag to maintainer if content alone doesn't answer it |
| D | Decide `frontend-skill`'s fate alongside the existing vendored-skill cleanup (`FOLDER_STRUCTURE_PLAN.md` §1.4), not as new scope |
| E | Publish results as `SKILL_DUPLICATION_AUDIT_REPORT.md` (same format as the three existing reconciliation reports); update this project's `PLANNING.md` Phase 3 deliverable 3 and `.github/specs/001-prd-agent-consolidation/spec.md` FR-003/SC-001 with the real, post-audit curated skill count |

**Status**: Scoped 2026-09-10. Execution (Phase A onward) not started.
