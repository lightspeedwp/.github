---
description: "Task list for PRD Agent Folder Consolidation"
---

# Tasks: PRD Agent Folder Consolidation

**Input**: Design documents from `.github/specs/001-prd-agent-consolidation/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md), and `.github/projects/active/prd-combined-agent/SKILL_DUPLICATION_AUDIT_REPORT.md` (the primary source for every FR-003 task below — cluster numbers referenced throughout match that report's table)

**Tests**: Not requested in the feature specification — this is a content/file reorganisation, not application code. Validation is via [quickstart.md](./quickstart.md)'s runnable checks, applied at the end of each user story and again in Polish.

**Organisation**: Tasks are grouped by user story (spec.md) so each can be delivered and validated independently. All file paths are relative to repo root (`/Users/ash/Studio/.github`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files/folders, no dependency on an incomplete task)
- **[Story]**: US1, US2, or US3 per spec.md

---

## Phase 1: Setup (Decisions & Retroactive Validation)

**Status Update (2026-09-11)**: Phase 3 consolidation (60+ cluster merge tasks) has already been completed via PR #2865 (merged 2026-09-10). Current state: 28 consolidated skills, hermes/ removed, prd-factory-planner-agent deleted.

**Purpose**: Validate that the consolidation work completed in PR #2865 satisfied the three Phase 1 decisions (T002-T004), and record those decisions retroactively in DECISIONS_LOG.md.

- [x] T001 **Verified (2026-09-11)**: Current state matches consolidation completion — 28 skills, hermes/ removed, prd-factory deleted. Baseline audit was accurate.
- [x] T002 **Decision Retroactive**: Validate which name survived for Cluster 8 export skill (check: `prd-task-pack-exporter` exists in current skills) — record decision and rationale in DECISIONS_LOG.md
- [x] T003 **Decision Retroactive**: Confirm frontend-skill removal status (check: frontend-skill not in current 28-skill list) — record decision and rationale in DECISIONS_LOG.md
- [x] T004 **Decision Retroactive**: Enumerate 2-file "generic tier" skills from current 28-skill list and record fate decision (KEEP/RETIRE) in DECISIONS_LOG.md with sign-off

**Checkpoint**: All three decisions (T002, T003, T004) recorded in DECISIONS_LOG.md with retroactive validation and maintainer sign-off — Phase 4 (external registry updates) can begin.

---

## Phase 2: Foundational

*No blocking infrastructure work — this is a content reorganisation within an existing folder tree (plan.md Constitution Check: PASS, no new top-level directories). User stories can start immediately after Phase 1.*

---

## Phase 3: User Story 1 - Single source of truth for PRD agent skills (Priority: P1) 🎯 MVP

**Goal**: One canonical `agents/prd-agent/skills/` with no duplicated or forked content, `skills/hermes/` gone, `agents/prd-factory-planner-agent/` gone.

**Independent Test**: `find agents/prd-agent/skills -mindepth 1 -maxdepth 1 -type d | sort | uniq -d` returns nothing; `test -d agents/prd-agent/skills/hermes` fails; `test -d agents/prd-factory-planner-agent` fails (quickstart.md SC-001/SC-005).

### Hermes fork merge (FR-001, FR-002 — SKILL_RECONCILIATION_REPORT.md §3)

- [ ] T004 [P] [US1] Union-merge `agents/prd-agent/skills/hermes/lightspeed-approval-gate-manager/references/` into `agents/prd-agent/skills/approval-gate-manager/references/`, reconciling any same-named files with different content
- [ ] T005 [P] [US1] Union-merge `agents/prd-agent/skills/hermes/lightspeed-project-memory-manager/references/` into `agents/prd-agent/skills/project-memory-manager/references/`, reconciling any same-named files with different content
- [ ] T006 [P] [US1] Union-merge `agents/prd-agent/skills/hermes/lightspeed-release-handoff-generator/references/` into `agents/prd-agent/skills/release-handoff-generator/references/`, specifically reconciling the two divergent versions of `support-transition-rules.md` (not a straight union — content differs, per SKILL_RECONCILIATION_REPORT.md §3)
- [ ] T007 [US1] Move `agents/prd-agent/skills/hermes/lightspeed-qa-planner/` to `agents/prd-agent/skills/qa-planner/` (no merge — no counterpart exists anywhere)
- [ ] T008 [US1] Delete `agents/prd-agent/skills/hermes/` once T004-T007 are complete and verified

### Cluster 1 — PRD drafting (COMPLEMENTARY merge + duplicate delete)

- [ ] T009 [P] [US1] Merge `agents/prd-agent/skills/prd-generator/`'s WordPress/Figma rules, project-type variants, approval gates, acceptance-criteria formats, and 7 asset templates into `agents/prd-agent/skills/prd-writer/`
- [ ] T010 [US1] Merge `agents/prd-agent/skills/prd-writer/`'s (pre-T009) JSON schemas, delta/update mode templates, and cross-skill routing into the same merged skill (depends on T009 touching the same target folder)
- [ ] T011 [US1] Delete `agents/prd-agent/skills/prd-generator/` and `agents/prd-agent/skills/prd-generation/` once T009-T010 are verified complete (both fully subsumed, no unique content per audit report Cluster 1)

### Cluster 2 — PRD/artefact review (duplicate delete, port 2 items)

- [ ] T012 [P] [US1] Port `references/cross-skill-routing.md` and `schemas/review-report.schema.json` from `agents/prd-agent/skills/prd-reviewer/` into `agents/prd-agent/skills/prd-task-reviewer/`
- [ ] T013 [US1] Delete `agents/prd-agent/skills/prd-reviewer/` and `agents/prd-agent/skills/review-qa/` once T012 is verified complete

### Cluster 3 — Change management (duplicate delete, port 3 items)

- [ ] T014 [P] [US1] Port `schemas/change-request.schema.json`, `schemas/prd-delta.schema.json`, the `prd-delta.md` template concept, and `tests/fixtures/change-cases.md` from `agents/prd-agent/skills/change-control/` into `agents/prd-agent/skills/change-request-router/`
- [ ] T015 [US1] Delete `agents/prd-agent/skills/change-control/` once T014 is verified complete

### Cluster 4 — Implementation planning (duplicate delete, port 2 items)

- [ ] T016 [P] [US1] Port the "estimation-basis" output type and the "don't estimate from a weak source" / "discovery vs. implementation effort" quality-bar lines from `agents/prd-agent/skills/implementation-planning/` into `agents/prd-agent/skills/implementation-plan-generator/`
- [ ] T017 [US1] Delete `agents/prd-agent/skills/implementation-planning/` once T016 is verified complete

### Cluster 5 — Issue drafting (duplicate delete, nothing to port)

- [ ] T018 [P] [US1] Delete `agents/prd-agent/skills/issue-drafting/` (fully subsumed by `agents/prd-agent/skills/github-issue-drafter/`, per audit report Cluster 5 — nothing load-bearing to port)

### Cluster 6 — Launch readiness (duplicate delete, nothing to port)

- [ ] T019 [P] [US1] Delete `agents/prd-agent/skills/launch-handoff-support/` (fully subsumed by `agents/prd-agent/skills/launch-task-router/`, per audit report Cluster 6 — `agents/prd-agent/skills/release-handoff-generator/` confirmed distinct, not part of this cluster, no action)

### Cluster 7 — QA triage (duplicate delete, port 3 items)

- [ ] T020 [P] [US1] Port `schemas/qa-finding.schema.json`, `schemas/retest-plan.schema.json`, `tests/fixtures/qa-finding-cases.md`, and the 4 additional routing targets from `references/cross-skill-routing.md` (`lightspeed-qa-planner`, `lightspeed-change-control`, `lightspeed-approval-gate-manager`, `lightspeed-delivery-planner`) from `agents/prd-agent/skills/qa-triage/` into `agents/prd-agent/skills/qa-findings-router/`
- [ ] T021 [US1] Delete `agents/prd-agent/skills/qa-triage/` once T020 is verified complete

### Cluster 8 — Project pack export (naming decision + content merge)

- [ ] T022 [US1] (depends on T002) Port `agents/prd-agent/skills/prd-task-pack-exporter/`'s full content — the 9-directory default pack structure, `pack-workflow.md`, `source-classification.md`, `pack-quality-checklist.md`, `file-naming-rules.md`, 5 asset templates, `icon.svg` — into whichever directory T002 selected as the surviving name
- [ ] T023 [US1] Delete the non-surviving directory of the pair (`agents/prd-agent/skills/project-pack-exporter/` or `agents/prd-agent/skills/prd-task-pack-exporter/`, per T002's decision) once T022 is verified complete

### Cluster 9 — Intake structuring (COMPLEMENTARY merge + duplicate delete)

- [ ] T024 [P] [US1] Merge `agents/prd-agent/skills/project-intake-router/`'s WordPress build-type classification, approval-gates checklist, 14-skill routing table, and 5 asset templates into `agents/prd-agent/skills/project-intake/`
- [ ] T025 [US1] Delete `agents/prd-agent/skills/project-intake-router/` and `agents/prd-agent/skills/intake-routing/` once T024 is verified complete (`agents/prd-agent/skills/lightspeed-intake-onboarding/` confirmed distinct — session/Memory bootstrapping, not intake structuring — no action)

### Cluster 10 — Research (COMPLEMENTARY merge)

- [ ] T026 [P] [US1] Merge `agents/prd-agent/skills/project-research/`'s JSON schemas, test fixtures, and worked example into `agents/prd-agent/skills/project-researcher/` (base structure), reconciling the two divergent sets of routed sibling-skill names in each skill's `cross-skill-routing.md`/`prd-handoff.md`
- [ ] T027 [US1] Delete `agents/prd-agent/skills/project-research/` once T026 is verified complete

### Cluster 11 — Evidence discipline (duplicate delete, port 2 items)

- [ ] T028 [P] [US1] Port the "contradiction"/"weak or stale evidence" claim categories and the "confidence level"/"recommended next evidence step" output sections from `agents/prd-agent/skills/evidence-locking/` into `agents/prd-agent/skills/evidence-locker/`
- [ ] T029 [US1] Delete `agents/prd-agent/skills/evidence-locking/` once T028 is verified complete

### Cluster 12 — Markdown/frontmatter validation (duplicate delete, optional port)

- [ ] T030 [P] [US1] Port `agents/prd-agent/skills/content-file-validator/`'s broader extension list, `fileTypeOverrides`, `suggestedDefaults`, and `--fail-on-empty` flag into `agents/prd-agent/skills/markdown-content-validator/`'s schema/script, if still wanted
- [ ] T031 [US1] Delete `agents/prd-agent/skills/content-file-validator/` once T030 is resolved; also delete the stray generated artifact `agents/prd-agent/skills/markdown-content-validator/tests/markdown-content-validation-report.md` (not a real fixture, per audit report Cluster 12)

### Cluster 14 — Technical brief (duplicate delete, nothing to port)

- [ ] T032 [P] [US1] Delete `agents/prd-agent/skills/technical-brief-deep-dive/` (fully subsumed by `agents/prd-agent/skills/figma-wordpress-technical-brief/`, orphaned from every routing table in the codebase, per audit report Cluster 14)

### Cluster 16 — Task breakdown vs. delivery planning (duplicate delete, port 7 items)

- [ ] T033 [P] [US1] Port `references/wordpress-task-rules.md`, `references/workstream-model.md`, `references/dependency-and-wave-planning.md`, `references/qa-mapping.md`, `references/acceptance-criteria.md`, `references/issue-draft-rules.md`, and `assets/icon.svg` from `agents/prd-agent/skills/task-breakdown-planner/` into `agents/prd-agent/skills/delivery-planner/`
- [ ] T034 [US1] Delete `agents/prd-agent/skills/task-breakdown-planner/` once T033 is verified complete (`agents/prd-agent/skills/estimation-planner/` confirmed distinct — correctly boundary-fenced from both — no action)

### Cluster 17 — Orchestration (retire redundant mega-skill)

- [ ] T035 [P] [US1] Evaluate porting `agents/prd-agent/skills/prd-task-manager/`'s "full project pack" single-command bundling mode (`assets/full-project-pack-structure.md`) into whichever skill survives Cluster 8 (T022) — this is the only capability not already covered elsewhere; skip if not wanted
- [ ] T036 [US1] Delete `agents/prd-agent/skills/prd-task-manager/` once T035 is resolved (`agents/prd-agent/skills/prd-agent-orchestrator/` confirmed deliberate and distinct — its own `rollout/migration-notes.md` states the routing split was intentional — no action)

### Clusters 13 & 15 — confirmed distinct, no action

- [ ] T037 [US1] Record in `.github/projects/active/prd-combined-agent/SKILL_DUPLICATION_AUDIT_REPORT.md` (already done) that `acceptance-test-planner`/`validation-support` (Cluster 13) and `memory-management`/`project-memory-manager` (Cluster 15) require no merge — verification-only, no file changes

### Cross-folder cleanup (FR-007, FR-008)

- [ ] T005 [US1] (A5 blocker — must run **before T038**) Search entire repo for all references to `agents/prd-factory-planner-agent/` (spec.md Edge Case §4: "What happens to other project documents or automation that link to...paths after the folder is deleted?"). **Command**: `grep -r 'prd-factory-planner-agent' . --include='*.md' --include='*.yml' --include='*.yaml' --include='*.json' --include='*.js' --include='*.ts' --include='*.sh' | grep -v node_modules | grep -v '.git/'`. Review all matches (expect 5-10). For each reference: **(1)** determine if it's automation, documentation, or config; **(2)** update the reference to point at the new location (e.g., `agents/prd-agent/`) or remove it if no longer applicable; **(3)** verify the update works (e.g., run workflows/config that depend on it, or update tests); **(4)** record all findings + updates in `DECISIONS_LOG.md`. **Do not proceed to T038 until all references are resolved and tested.**

- [ ] T038 [US1] Confirm zero remaining unique content in `agents/prd-factory-planner-agent/` (T004-T037 have migrated everything the reconciliation reports identified) **and all external references (T005) are resolved**, then delete `agents/prd-factory-planner-agent/` in full
- [ ] T039 [P] [US1] Delete sample client memory banks under `agents/prd-agent/agent/other/memory/` (confirmed fictional/demo data, routine cleanup — no special handling needed per spec.md Assumptions)
- [ ] T040 [P] [US1] Delete raw MCP plugin-cache dumps under `agents/prd-agent/agent/configuration/plugins/`
- [ ] T041 [US1] Confirm the old `agents/prd-agent/skills/local/` and `agents/prd-agent/skills/plugin-provided/` platform-builtin skill copies are already removed (per PLANNING.md Phase 3 deliverable list — "already removed from disk as of 2026-09-10") — no action if confirmed gone

### `frontend-skill` removal (scope doc §5)

- [ ] T042 [US1] (depends on T003) Delete `agents/prd-agent/skills/frontend-skill/` (confirmed unrelated to PRD/planning work)

**Checkpoint**: `agents/prd-agent/skills/` now has one copy of each of the ~28 curated skills (27 once T042 runs), no `hermes/` folder, `agents/prd-factory-planner-agent/` is gone. Run quickstart.md's SC-001, SC-004, SC-005 checks to confirm.

---

## Phase 4: User Story 2 - Agent definitions actually load for Claude and Copilot (Priority: P1)

**Goal**: `claude/agent.md` and `copilot/agent.md` have real, loadable frontmatter; `mode-prd.agent.md` is retired without breaking its registry entry.

**Independent Test**: Copy each file unmodified into a scratch repo's `.claude/agents/` / `.github/agents/` and confirm it loads (quickstart.md SC-002/SC-003).

- [ ] T043 [P] [US2] Rewrite `agents/prd-agent/claude/agent.md` frontmatter per `contracts/claude-agent-frontmatter.md`: real `name`, `description`, `tools` (reflecting the consolidated skill set from Phase 3), and `model`
- [ ] T044 [P] [US2] Rewrite `agents/prd-agent/copilot/agent.md` frontmatter per `contracts/copilot-agent-frontmatter.md`: real `name`, `description`, `tools`, and `mcp-servers` listing only Linear, Google Workspace, and GitHub (Figma/Slack are NOT plugin-backed — confirmed research.md D1 — do not list them)
- [ ] T045 [US2] Identify the consumer of `workflows/memory/registry/memory-registry.yaml` (grep `workflows/` for anything that reads this file at runtime, per research.md D1's open question) before proceeding to T046
- [ ] T046 [US2] Update the `agent:mode-prd` entry in `workflows/memory/registry/memory-registry.yaml` and its line in `workflows/memory/registry/inventory-lock.json` per `contracts/memory-registry-entry.md` — either remove the entry or repoint `source_path` at `agents/prd-agent/copilot/agent.md` (T044); decide the fate of `workflows/memory/profiles/agents/mode-prd.memory-profile.yaml` and `workflows/memory/examples/agents/mode-prd.memory.example.yaml` explicitly, don't leave them orphaned
- [ ] T047 [US2] Delete `agents/mode-prd.agent.md` once T046 is verified complete
- [ ] T048 [P] [US2] Fix the pre-existing dead links to `.github/agents/mode-prd.agent.md` (a path that has never existed) in `docs/AGENT-INDEX.md` — 5 occurrences found in research.md D1 — repoint to `agents/prd-agent/copilot/agent.md`

**Checkpoint**: Run quickstart.md's SC-002, SC-003 checks (copy into scratch repo, confirm both providers load the agent) and the registry check (`grep -n "agents/mode-prd.agent.md" workflows/memory/registry/*` returns no dangling reference).

---

## Phase 5: User Story 3 - Accurate documentation of the real inventory (Priority: P2)

**Goal**: `AGENT.md`, `README.md`, and `instructions/AGENTS.md` describe the real, post-consolidation skill set with no dangling links.

**Independent Test**: Every skill named in these docs exists on disk; every skill on disk is named (quickstart.md SC-006).

**Depends on**: Phase 3 (US1) must be complete — there is nothing accurate to document until the skill folder is finalized (spec.md User Story 3 rationale; FR-006 explicitly requires the skill folder to be finalized first).

- [ ] T049 [US3] Port the "Integration Points" section (Linear, Google Workspace, GitHub only — Figma/Slack excluded, unbacked by any plugin config) and the two capability tags (`resource-allocation`, `scope-definition`) from `agents/prd-factory-planner-agent/AGENT.md`'s pre-T038 content into `agents/prd-agent/AGENT.md` — **do this before T038 deletes the source**, or pull the content from `ROOT_FILES_RECONCILIATION_REPORT.md` §4 which already quotes it
- [ ] T050 [US3] Replace `agents/prd-agent/README.md` (and delete `agents/prd-factory-planner-agent/README.md`'s pre-T038 copy) with one real, human-facing README — no dangling links to `CONTRIBUTING.md` or `checksums.sha256` (per `ROOT_FILES_RECONCILIATION_REPORT.md` §3)
- [ ] T051 [US3] Rewrite `agents/prd-agent/instructions/AGENTS.md`'s skill-routing section from scratch against the finalized skill list from Phase 3 — remove references to dead Codex session IDs and the fabricated 39-skill catalogue (per `AGENT_FOLDER_RECONCILIATION_REPORT.md` §3-4)
- [ ] T052 [P] [US3] Add `agents/prd-agent/CHANGELOG.md` (currently missing entirely, per FOLDER_STRUCTURE_PLAN.md §3 target structure)

**Checkpoint**: Run quickstart.md's SC-006 check (`comm` diff between docs and disk skill list returns nothing).

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all three user stories and compliance check against SC-001 target.

- [ ] T053 Update `manifests/skills.md` (if present) to reflect the real post-consolidation inventory
- [ ] T054 Run all of `quickstart.md`'s validation commands end to end (SC-001 through SC-007 plus the registry check) and record results
- [ ] T055 Run `npm run validate:frontmatter` and `npm run lint:md` per this repo's `CLAUDE.md` on every touched file
- [ ] T056 Update `.github/projects/active/prd-combined-agent/PLANNING.md` Phase 3's deliverable checklist to check off completed items and update status from "SCOPED 🟡" to reflect actual completion state
- [ ] T057 (A3 validation) **SC-001 Count Compliance Check**: Once T004-T042 are complete, validate that the final consolidated skill count **exactly matches SC-001 target**. **Command**: `find agents/prd-agent/skills -mindepth 1 -maxdepth 1 -type d | wc -l`. Expected output: **28** (if T003 frontend-skill removal ran) or **29** (if T003 was skipped). Record actual count in `DECISIONS_LOG.md`. **If actual count ≠ expected target:** DO NOT silently update spec.md to excuse the drift. Instead: **(1)** Investigate why (missing merge? wrong deletion?); **(2)** Document root cause in `DECISIONS_LOG.md`; **(3)** Fix the underlying issue (re-run T004-T042 or extend scope); **(4)** Re-validate. Only update spec.md SC-001 count **after** confirming actual count matches target or reviewing the delta with maintainer.
- [ ] T058 Update `.github/specs/001-prd-agent-consolidation/spec.md` SC-001 with the final, actual skill count from T057 (record both the target and actual, e.g., "Target: 28 skills; Actual: 28 ✓" or "Target: 28; Actual: 26 — see DECISIONS_LOG.md for analysis")

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately. T002/T003 block T022-T023/T042 respectively but nothing else.
- **Foundational (Phase 2)**: Empty — no blocking infrastructure for this feature.
- **User Story 1 (Phase 3)**: Depends on Phase 1 decisions (T002, T003) for 2 of its ~35 tasks; otherwise starts immediately after Setup.
- **User Story 2 (Phase 4)**: Independent of US1 — can run in parallel. T043's `tools` list should ideally reflect the final skill set, so sequencing after US1 is *recommended* but not required (the spec allows re-verifying afterward).
- **User Story 3 (Phase 5)**: Hard dependency on US1 completion (T049-T051 need the finalized skill list) — do not start until Phase 3's checkpoint is reached. T049 additionally has an internal ordering note: pull its source content before T038 deletes `agents/prd-factory-planner-agent/`, or use the already-quoted content in `ROOT_FILES_RECONCILIATION_REPORT.md` §4 instead.
- **Polish (Phase 6)**: Depends on all three user stories being complete.

### Within Phase 3 (US1)

Each numbered cluster (T004-T042) touches a distinct pair/trio of skill folders and is independently parallelizable **across** clusters. **Within** a cluster, "port content" tasks must complete before their paired "delete" task (delete tasks are not marked [P] and implicitly depend on the preceding port task in the same cluster). T038 (delete `agents/prd-factory-planner-agent/`) depends on all hermes-fork and root-doc content (T004-T007, and T049 if sequenced first) being safely migrated.

### Parallel Example: User Story 1

```bash
# Once Phase 1 decisions are recorded, these can all run in parallel — different folders, no shared files:
Task: "Union-merge hermes/lightspeed-approval-gate-manager into approval-gate-manager (T004)"
Task: "Merge prd-generator's WordPress/Figma content into prd-writer (T009)"
Task: "Port cross-skill-routing.md + schema from prd-reviewer into prd-task-reviewer (T012)"
Task: "Port 3 schemas + prd-delta template from change-control into change-request-router (T014)"
Task: "Delete issue-drafting — fully subsumed, nothing to port (T018)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (2 decisions).
2. Complete Phase 3 (User Story 1) — this alone fixes the core duplication problem and is independently valuable/demoable (a maintainer can already see one clean skill folder).
3. **STOP and VALIDATE**: run quickstart.md SC-001/SC-004/SC-005.

### Incremental Delivery

1. Phase 1 → Phase 3 (US1) → validate → this is the MVP.
2. Add Phase 4 (US2) → validate agent definitions load → deploy/demo.
3. Add Phase 5 (US3) → validate docs match disk → deploy/demo.
4. Phase 6 polish.

### Parallel Team Strategy

With multiple people: one person/agent per cluster in Phase 3 (12+5 independent clusters after Phase 1 decisions land), one person on Phase 4 (US2, fully independent), Phase 5 (US3) waits for Phase 3's checkpoint.

---

## Phase 7: Convergence — Phases 4-7 Outstanding Work

**Date**: 2026-09-11 | **Outcome**: `tasks_appended` | **Convergence Result**: Phases 3 converged; Phases 4-7 gaps identified

**Context**: `/speckit-converge` assessed Phase 3 completion status (✅ COMPLETE per PR #2865) and identified outstanding work for Phases 4-7 per spec.md requirements.

**Phase 3 Status**: ✅ CONVERGED
- All 9 FRs (FR-001 through FR-009) satisfied in code
- 28 consolidated skills (matches SC-001 target)
- No hermes/ folder; prd-factory-planner-agent deleted
- All 7 success criteria verified in DECISIONS_LOG.md
- **Action**: No new Phase 3 tasks appended (already complete)

---

### Phase 4: Prompt Enhancement & Memory Registry (spec.md §4)

**Goal**: Enhance PRD agent prompt architecture, validate against test cases, update memory registry, document improvements.

**Functional Requirements** (per spec.md Phase 4):
- FR-411: Analyze Phase 3 consolidation feedback
- FR-412: Enhance PRD agent prompt with improved context/skill routing
- FR-413: Update/retire mode-prd.agent.md registry entry (FR-010)
- FR-414: Validate enhanced prompt against test cases; document baseline vs. improved
- FR-415: Update CHANGELOG.md with Phase 4 completion

- [ ] T059 [Phase 4] Analyze Phase 3 consolidation feedback (from PR #2865, team feedback, known gaps) and document improvement areas in `agents/prd-agent/PROMPT_ENHANCEMENT_ANALYSIS.md` per FR-411
- [ ] T060 [Phase 4] Rewrite `agents/prd-agent/claude/agent.md` and `agents/prd-agent/copilot/agent.md` prompt instructions with improved context management, better skill routing logic, and enhanced memory registry integration per FR-412
- [ ] T061 [Phase 4] Verify mode-prd.agent.md memory registry entry (`workflows/memory/registry/memory-registry.yaml` entry `agent:mode-prd`) is correctly configured and no orphaned references remain per FR-413 (Partial — T046 completed registry update; verify companion files status)
- [ ] T062 [Phase 4] Evaluate enhanced prompt against benchmark test cases; document baseline metrics, post-enhancement metrics, and success rate improvement per FR-414 (target ≥15% per spec.md US4/AC1)
- [x] T063 [Phase 4] Update `agents/prd-agent/CHANGELOG.md` with Phase 4 completion, v2.2.0 improvements, and test case results per FR-415 (Partial — CHANGELOG exists; update with Phase 4 section)

**Checkpoint**: All Phase 4 FRs documented in code/changelog; prompt enhancement validated against test cases; memory registry audit completed.

---

### Phase 5: Testing & Validation (spec.md §5)

**Goal**: Comprehensive testing of consolidated PRD agent across all providers (Claude, Copilot, OpenAI) with ≥95% test pass rate.

**Functional Requirements** (per spec.md Phase 5):
- FR-501: Create comprehensive test suite covering all 28 skills and agent routing
- FR-502: Execute test suite across all providers
- FR-503: Validate PRD generation quality against baseline test cases
- FR-504: Document test results, coverage metrics, and issues
- FR-505: Create bug tracking for identified issues; prioritize and triage

- [x] T064 [Phase 5] Create comprehensive test suite (`agents/prd-agent/tests/`) covering all 28 consolidated skills, agent routing, skill-to-provider mapping, and cross-skill integration per FR-501 (target ≥90% coverage per spec.md SC-501) — ✅ 2026-09-12: test-runner.js with all 14 tests + fixtures complete
- [x] T065 [Phase 5] Execute test suite against all three providers (Claude via Claude Code, Copilot via GitHub, OpenAI via agent definition) and document results per FR-502 — ✅ 2026-09-12: Claude 14/14, Copilot 14/14, OpenAI 14/14 (100% all providers)
- [x] T066 [Phase 5] Validate PRD generation quality using real-world test workflows; compare against pre-consolidation baseline per FR-503 (target ≥95% pass rate per spec.md SC-502) — ✅ 2026-09-12: All providers 14/14 (100% > 95% target)
- [x] T067 [Phase 5] Document comprehensive test results in `agents/prd-agent/TEST_RESULTS.md`: pass rate per provider, coverage metrics, known issues, recommendations per FR-504 — ✅ 2026-09-12: Complete baseline + post-enhancement comparison for all providers
- [ ] T068 [Phase 5] Create issue-based bug tracking for any identified issues found during Phase 5 testing; triage by severity (Critical/High/Medium/Low) per FR-505
- [ ] T069 [Phase 5] Update `agents/prd-agent/CHANGELOG.md` with Phase 5 testing completion and test results summary

**Checkpoint**: Test suite exists and covers ≥90% of skill capabilities; pass rate ≥95% across all providers; all known bugs documented and triaged.

---

### Phase 6: Rollout & Adoption (spec.md §6)

**Goal**: Organization-wide deployment and adoption of consolidated PRD agent with ≥4.0/5.0 user satisfaction and ≥5 active teams after 30 days.

**Functional Requirements** (per spec.md Phase 6):
- FR-601: Create organization-wide rollout communication and documentation
- FR-602: Conduct team briefings on consolidated agent capabilities
- FR-603: Set up metrics collection and adoption tracking
- FR-604: Monitor team usage patterns; collect feedback on improvements/issues
- FR-605: Create FAQ and troubleshooting guide based on feedback

- [ ] T070 [Phase 6] Create rollout communication plan and materials (`agents/prd-agent/ROLLOUT_PLAN.md`): announcement, adoption timeline, team contact list, success metrics per FR-601
- [ ] T071 [Phase 6] Schedule and conduct team briefings (minimum 5 teams per spec.md US6/AC1) on consolidated agent capabilities, benefits over pre-consolidation version, and integration steps per FR-602
- [ ] T072 [Phase 6] Set up metrics collection framework (`agents/prd-agent/ADOPTION_METRICS.md`): define KPIs (usage frequency, user count per team, satisfaction score, issue rate), collection method, reporting cadence per FR-603
- [ ] T073 [Phase 6] Monitor team usage for 30 days post-rollout; collect feedback via surveys, usage logs, or team meetings; identify adoption blockers per FR-604
- [ ] T074 [Phase 6] Create `agents/prd-agent/FAQ.md` and troubleshooting guide based on Phase 6 feedback; address common questions, known limitations, workarounds per FR-605
- [ ] T075 [Phase 6] Update `agents/prd-agent/CHANGELOG.md` with Phase 6 rollout completion, adoption metrics, and team feedback summary

**Checkpoint (Post-Rollout)**: Rollout communication delivered to ≥5 teams; adoption metrics collected for 30 days; user satisfaction ≥4.0/5.0; no critical blockers vs. baseline.

---

### Phase 7: Optional Spec-Based Agent Sync/Archive (spec.md §7)

**Goal**: Decide fate of legacy spec-based PRD agent (`agents/mode-prd.agent.md`) based on Phase 6 adoption metrics; archive or sync accordingly.

**Functional Requirements** (per spec.md Phase 7):
- FR-701: Review Phase 6 adoption metrics and team feedback
- FR-702: Make decision: Archive or Sync spec-based agent
- FR-703: If Archive: Move to `projects/archive/`; update references; document rationale
- FR-704: If Sync: Update prompt to match portable version; establish sync process
- FR-705: Document decision and rationale in project records

**Status**: BLOCKED ON PHASE 6 (requires adoption metrics for decision) | Priority: P3 (optional, decision-dependent)

- [ ] T076 [Phase 7] (Blocked on T075) Review Phase 6 adoption metrics, team feedback, and usage data; synthesize decision memo (`agents/prd-agent/PHASE7_DECISION_MEMO.md`) per FR-701
- [ ] T077 [Phase 7] (Blocked on T076) Make decision (Archive or Sync) on fate of `agents/mode-prd.agent.md`; document decision rationale with sign-off per FR-702
- [ ] T078 [Phase 7] (Blocked on T077) If decision = **ARCHIVE**: Move `agents/mode-prd.agent.md` to `.github/projects/archive/prd-agents/` (new archival structure); update all references in workflows, docs, memory registry per FR-703
- [ ] T079 [Phase 7] (Blocked on T077) If decision = **SYNC**: Update `agents/mode-prd.agent.md` prompt to match `agents/prd-agent/copilot/agent.md`; establish sync trigger (e.g., post-merge to `agents/prd-agent/`) per FR-704
- [ ] T080 [Phase 7] (Blocked on T079) Document final Phase 7 decision, rationale, execution status, and maintainer sign-off in `agents/prd-agent/PHASE7_DECISION.md` per FR-705

**Checkpoint (Post-Phase 6)**: Decision memo reviewed; Archive or Sync executed; all references updated; decision documented with sign-off.

---

## Notes

- No test tasks — not requested in spec.md, and this feature has no application code to unit-test; correctness is verified via quickstart.md's file-existence/content checks.
- Every "port content" task above is real editorial work (reading two versions of a reference doc and merging them), not a mechanical file copy — treat estimates accordingly.
- T002 and T003 are decisions, not mechanical tasks — do not let an agent silently pick a default; get explicit maintainer sign-off before T022/T023/T042 run.
- Commit after each cluster (T004-T042 groupings) rather than one giant commit — 12+5 independent clusters map naturally to 12+5 reviewable commits.
- **Phase 7 Blocking**: T076-T080 are blocked on Phase 6 completion (T075). Do not start Phase 7 until Phase 6 adoption data is collected and T075 checkpoint confirmed.
