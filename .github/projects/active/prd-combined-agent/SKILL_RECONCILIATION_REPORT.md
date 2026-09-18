---
file_type: report
title: "PRD Agent Skill Reconciliation Report"
description: "File-by-file diff of every skill shared between agents/prd-agent and agents/prd-factory-planner-agent, to determine what actually needs merging"
created_date: "2026-09-10"
last_updated: "2026-09-10"
status: active
tags:
  - prd
  - agent-standards
  - skills
  - reconciliation
owners:
  - lightspeedwp/maintainers
---

# PRD Agent Skill Reconciliation Report

**Related:** [FOLDER_STRUCTURE_PLAN.md](./FOLDER_STRUCTURE_PLAN.md) · [PLANNING.md](./PLANNING.md) · [AGENT_FOLDER_RECONCILIATION_REPORT.md](./AGENT_FOLDER_RECONCILIATION_REPORT.md) (same audit, applied to `agent/`) · [ROOT_FILES_RECONCILIATION_REPORT.md](./ROOT_FILES_RECONCILIATION_REPORT.md) (same audit, applied to root `AGENT.md`/`README.md`)

**Purpose:** Answer one question with evidence, not assumption: *does `agents/prd-factory-planner-agent/` contain unique logic that needs to be merged into `agents/prd-agent/` before the folder can be retired?* Method was `diff -rq` and `cmp` across every file pair, plus a line-count check on every differing file (a footer-tagline swap is 2-4 changed lines; real content divergence is not).

**Headline finding: no.** Every skill `prd-factory-planner-agent` has already exists under the same name in `prd-agent`, and 23 of 24 are byte-identical apart from a decorative footer line. The real unmerged content is inside `prd-agent` itself — a leftover `skills/hermes/` folder from an earlier, incomplete flattening pass. See §3.

This audit was run against the **current, in-progress flattened structure** (`skills/<name>/`, not the older `skills/agent-attached/hermes/lightspeed-*` paths audited in FOLDER_STRUCTURE_PLAN.md §1 — that flattening happened on disk between the two audits).

---

## 1. Skills shared by name between the two folders (24)

For each pair, every file with the same relative path was compared. "Changed lines" is the `diff | grep -c '^[<>]'` count, so a footer-only swap shows as 2 (one line removed, one added).

| Skill (`name:` field) | Files differing / total | Nature of every difference | Verdict |
|---|---|---|---|
| `lightspeed-acceptance-test-planner` | 13 differ, 0 unique either side | Footer tagline only | **Identical — safe to delete factory-planner's copy** |
| `lightspeed-approval-gate-manager` | 12 differ | Footer tagline only (verified: `SKILL.md` diff is exactly 1 line swapped) | **Identical** |
| `lightspeed-change-request-router` | 12 differ | Footer tagline only | **Identical** |
| `content-file-validator` | 8 differ | Footer tagline only; `scripts/validate_content_files.py` is **byte-identical** | **Identical** |
| `evidence-locker` | 0 differ | — | **Byte-identical** |
| `lightspeed-figma-wordpress-technical-brief` | 11 differ | Footer tagline only | **Identical** |
| `lightspeed-github-issue-drafter` | 12 differ | Footer tagline only | **Identical** |
| `lightspeed-implementation-plan-generator` | 14 differ | Footer tagline only | **Identical** |
| `lightspeed-intake-onboarding` | 0 differ | — | **Byte-identical** |
| `lightspeed-launch-task-router` | 8 differ | Footer tagline only | **Identical** |
| `markdown-content-validator` | 7 differ | Footer tagline only (largest single diff was 4 lines) | **Identical** |
| `wordpress-plugin-packaging-review` | 4 differ | Footer tagline only | **Identical** |
| `lightspeed-prd-generator` | 11 differ | Footer tagline only | **Identical** |
| `lightspeed-prd-task-manager` | 13 differ | Footer tagline only | **Identical** |
| `lightspeed-prd-task-pack-exporter` | 11 differ | Footer tagline only | **Identical** |
| `lightspeed-prd-task-reviewer` | 8 differ | Footer tagline only | **Identical** |
| `lightspeed-project-intake-router` | 13 differ | Footer tagline only | **Identical** |
| `lightspeed-project-memory-manager` | 15 differ | Footer tagline only | **Identical** |
| `lightspeed-project-researcher` | 12 differ | Footer tagline only | **Identical** |
| `lightspeed-project-status-reporter` | 13 differ | Footer tagline only | **Identical** |
| `lightspeed-qa-findings-router` | 11 differ | Footer tagline only | **Identical** |
| `lightspeed-release-handoff-generator` | 13 differ | Footer tagline only | **Identical** |
| `lightspeed-requirements-traceability-mapper` | 11 differ | Footer tagline only | **Identical** |
| `lightspeed-task-breakdown-planner` | 15 differ | Footer tagline only (spot-checked word counts per file: within 1-6 words across every reference/asset file) | **Identical** |

**Result: 24/24 are the same skill, verbatim. Zero merge work required for this set — delete the `prd-factory-planner-agent` copies.**

---

## 2. Skills that exist in one folder only

### 2.1 In `prd-agent` but not in `prd-factory-planner-agent` (21)

These need no merge decision — they simply carry forward as-is:

`change-control`, `delivery-planner`, `estimation-planner`, `evidence-locking`, `frontend-skill`, `implementation-planning`, `intake-routing`, `issue-drafting`, `launch-handoff-support`, `memory-management`, `prd-agent-orchestrator`, `prd-generation`, `prd-reviewer`, `prd-writer`, `project-intake`, `project-pack-exporter`, `project-research`, `qa-triage`, `review-qa`, `technical-brief-deep-dive`, `validation-support`

Ten of these (`evidence-locking`, `implementation-planning`, `intake-routing`, `issue-drafting`, `launch-handoff-support`, `memory-management`, `prd-generation`, `review-qa`, `technical-brief-deep-dive`, `validation-support`) are a distinct, generic 2-file tier (`SKILL.md` + `agents/openai.yaml` only, no `references/`/`assets/`) that use a `$skill-name` invocation convention and read as lightweight routing/dispatch skills rather than LightSpeed-branded specialists — e.g. `review-qa`'s description is "Use when an existing planning artefact needs a quality review..." with no LightSpeed-specific framing. **Open question for FOLDER_STRUCTURE_PLAN.md §4:** are these a deliberate generic-entry-point layer that should be kept alongside the specialist `lightspeed-*` skills, or an earlier, now-superseded naming generation that should be retired the same way `lightspeed-prd-generator` was superseded by `lightspeed-prd-writer`? Needs a content read of a few pairs (e.g. `review-qa` vs `prd-reviewer` vs `prd-task-reviewer`) to judge overlap before deciding.

### 2.2 In `prd-factory-planner-agent` but not in `prd-agent` (0)

None. Every skill name in `prd-factory-planner-agent/skills/` has a same-named counterpart in `prd-agent/skills/` (see §1). There is no skill to port over.

---

## 3. Where the real unmerged content actually is: `prd-agent/skills/hermes/`

The in-progress flattening (moving skills from `skills/agent-attached/hermes/lightspeed-*` up to `skills/<name>/`) left **4 folders behind**, unflattened, still at `agents/prd-agent/skills/hermes/`:

| Leftover (`hermes/lightspeed-*`) | Same-named top-level copy exists? | Diff vs top-level copy |
|---|---|---|
| `lightspeed-approval-gate-manager` | Yes — `skills/approval-gate-manager/` | **Real content fork.** Leftover has `references/approval-gates.md`, `cross-skill-routing.md`, `go-no-go-rules.md`, plus `schemas/`, `templates/`, `tests/`, `examples/` that the top-level copy lacks. Top-level copy has `references/gate-types.md`, `stakeholder-review-rules.md`, `status-model.md`, `wordpress-project-gates.md` that the leftover lacks. **Complementary, not conflicting — union merge.** |
| `lightspeed-project-memory-manager` | Yes — `skills/project-memory-manager/` | **Real content fork.** Leftover has `memory-policy.md`, `project-state-rules.md`, `source-priority.md`, `cross-skill-routing.md`, plus `schemas/`, `templates/`, `tests/`, `examples/`, `memory/`. Top-level has `file-definitions.md`, `handoff-rules.md`, `memory-bank-workflow.md`, `status-and-decision-rules.md`, `task-index-rules.md`, `wordpress-project-memory.md`. **Complementary — union merge.** |
| `lightspeed-release-handoff-generator` | Yes — `skills/release-handoff-generator/` | **Real content fork.** Leftover has `client-safe-boundaries.md`, `cross-skill-routing.md`, `release-handoff-rules.md`, plus `schemas/`, `templates/`, `tests/`, `examples/`; `support-transition-rules.md` exists on both sides but with different content. Top-level has `client-handoff-rules.md`, `known-issues-rules.md`, `post-launch-monitoring.md`, `release-handoff-workflow.md`, `release-notes-rules.md`. **Complementary — union merge, and specifically reconcile the two versions of `support-transition-rules.md`.** |
| `lightspeed-qa-planner` | **No top-level copy exists anywhere.** `skills/qa-triage/` (`name: lightspeed-qa-triage`) is a different skill by name and description. | Not a fork — this is a wholly distinct skill that was never flattened. **Promote as-is to `skills/qa-planner/`, no merge needed, just a move.** |

**Action for Phase 3 (FOLDER_STRUCTURE_PLAN.md §5, Phase B/C):** these 4 are the only skills in the entire audit that need real editorial merge work — combining two complementary reference sets per skill, not picking a winner. Everything else is either an exact duplicate (delete one copy) or already unique (carry forward, no action).

---

## 4. Non-skill content compared

| File | Result |
|---|---|
| `shared/core-prompt.md` | Differ substantially (609 vs 239 lines) — but **not a case of hidden logic to recover**. `prd-factory-planner-agent`'s version is a thin wrapper describing its own skill counts ("Agent-Attached Skills (24 total)", "Local Skills (10 total)", "Plugin-Provided Skills (5 total)") with generic "Interaction Patterns"/"Boundaries"/"Quality Standards" sections — no planning methodology not already covered, and covered in more depth, by `prd-agent`'s v2.1 prompt's "Feature Planning & Prioritization" and "Timeline & Roadmap Planning" sections. |
| `AGENT.md` | 204 changed lines, same story — factory-planner's version documents its own (identical) skill inventory and generic capabilities; no unique content. |
| `README.md` | 62 changed lines, same story. |
| `claude/agent.md`, `copilot/agent.md`, `openai/agent.md` | All differ, but per FOLDER_STRUCTURE_PLAN.md §1.6 **neither folder's copies have usable frontmatter regardless** — both need rewriting from scratch for Claude Code / Copilot compliance, so the difference between them is moot. |
| `agent/` (the raw export tree) | `prd-factory-planner-agent/agent/` has **zero files** not already present in `prd-agent/agent/`. `prd-agent/agent/` has 28 files factory-planner lacks. No unique content to recover. |
| `manifests/skills.md` | Identical skill-name inventory on both sides. |

---

## 5. Recommendation

1. **Delete `agents/prd-factory-planner-agent/` entirely.** Confirmed zero unique skills, zero unique non-skill content, and its only structurally-differentiated file (`shared/core-prompt.md`) is a subset of what `prd-agent`'s v2.1 prompt already covers.
2. **Union-merge the 3 forked skills** (`approval-gate-manager`, `project-memory-manager`, `release-handoff-generator`) by combining both reference/schema/template/example sets into the top-level flattened folder, reconciling `release-handoff-generator/references/support-transition-rules.md` specifically since it's the one file that exists on both sides with different content.
3. **Promote `lightspeed-qa-planner`** from `skills/hermes/` to `skills/qa-planner/` as a new, distinct skill — no merge needed.
4. **Decide the fate of the 10-skill generic/thin tier** (§2.1) before finalizing the target skill count in FOLDER_STRUCTURE_PLAN.md §3 — needs a content read, not a diff, since these aren't duplicates of anything, they're a different abstraction layer.
5. Once 1-3 are done, delete the now-empty `agents/prd-agent/skills/hermes/` wrapper.

This resolves open decisions #2 (fork reconciliation) and, partially, #4 (near-duplicate skill pairs) from FOLDER_STRUCTURE_PLAN.md §4 — the remaining part of #4 is the generic-tier question in §2.1 above, which needs a short content review, not a diff.
