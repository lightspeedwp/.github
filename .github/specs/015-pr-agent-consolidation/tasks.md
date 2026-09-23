---

description: "Task list for PR Agent Consolidation & Portability"
---

# Tasks: PR Agent Consolidation & Portability

**Input**: Design documents from `.github/specs/015-pr-agent-consolidation/`

**Prerequisites**: plan.md, spec.md, data-model.md, contracts/pr-agent-invocation.md, research.md, quickstart.md

**Tests**: Jest tests are already part of `agents/pr-agent/`'s existing, preserved suite — no new test-writing tasks below duplicate that; tasks reference the suite where relevant.

**Organization**: Tasks are grouped by user story. User Story 1 was delivered ahead of running this command, across three stacked branches/PRs (`aiops/pr-agent-consolidation-portability` #3400, `refactor/pr-agent-skills-restructure` #3401, `fix/pr-agent-branch-name-validation` #3403), all merged to `develop` on 2026-09-22 — its tasks below are marked done and reference the PR that delivered them, not left as pending work to redo.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

## Phase 1: Setup

- [x] T001 Inventory all 5 files under `agents/pr-creation-agent/` against `agents/pr-agent/`, recording a disposition (folded in / superseded / discarded-with-reason) for each — done, PR #3400/#3403
- [x] T002 Confirm the target Agent Skills specification folder shape (`SKILL.md` + `scripts/` + `scripts/__tests__/` per skill) against [agentskills.io](https://agentskills.io/specification) — done, PR #3401

**Checkpoint**: Inventory and target shape confirmed — restructuring work could begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core identity/tooling fixes that every later phase depends on

- [x] T003 Correct `agents/pr-agent/package.json` identity (name, `main`, `repository.directory`) per FR-002a — done, PR #3400
- [x] T004 Adopt `agents/pr-creation-agent/eslint.config.js` and its test into `agents/pr-agent/` as the one working lint configuration per FR-002a — done, PR #3400
- [x] T005 Rewrite `agents/pr-agent/AGENT.md` to describe `pr-agent`'s own real six skills per FR-002 — done, PR #3400 (paths corrected for this branch's state; end-state paths land with T007)
- [x] T006 Regenerate `agents/pr-agent/package-lock.json` against the corrected `package.json` — done, PR #3400

**Checkpoint**: Foundation ready — User Story 1's restructuring could begin.

---

## Phase 3: User Story 1 - Both existing agents fully inventoried, merged with no file or behaviour lost, and restructured to the Agent Skills specification shape, with known bugs fixed (Priority: P1) 🎯 MVP — ✅ DONE (merged to `develop` 2026-09-22)

**Goal**: Exactly one PR-related agent directory, every `pr-creation-agent` file accounted for, every skill in Agent Skills spec shape, the verified branch-validation bug fixed.

**Independent Test**: See spec.md's Independent Test for User Story 1 — satisfied per the verification below.

### Implementation for User Story 1

- [x] T007 [US1] Restructure all six skills into Agent Skills shape: move each `skills/<name>/<name>.js` → `skills/<name>/scripts/<name>.js`, its test → `skills/<name>/scripts/__tests__/<name>.test.js`, splitting the combined `submit-pr-and-error-handling.test.js` into two per-skill files, and fixing every import path this touches (4 unit test files, 5 integration test files) — done, PR #3401
- [x] T008 [US1] Write real `SKILL.md` content (name, description, when-to-use, input/output, usage example) for all six skills in `agents/pr-agent/skills/*/SKILL.md`, replacing the unfilled `template-skill` placeholder (FR-020) — done, PR #3401
- [x] T009 [US1] Fix `agents/pr-agent/skills/validate-branch-name/scripts/validate-branch-name.js`'s `FORBIDDEN_PREFIXES` (`claude`, `bot`, `automated` → `claude`, `copilot`, `openai`) per FR-003 — done, PR #3403
- [x] T010 [US1] Fix `agents/pr-agent/skills/validate-branch-name/scripts/validate-branch-name.js`'s `ALLOWED_TYPES` to include the full canonical list (add `task`, `doc`, `aiops`, `automation`, `epic`) per FR-004 — done, PR #3403
- [x] T011 [US1] Add test coverage in `agents/pr-agent/skills/validate-branch-name/scripts/__tests__/validate-branch-name.test.js` for the forbidden-prefix and allowed-type lists (neither had any before) — done, PR #3403
- [x] T012 [US1] Delete `agents/pr-creation-agent/` only once T001's inventory confirms every file's disposition, and confirm `agents/pr-agent/`'s suite and lint are unaffected by the removal — done, PR #3403
- [x] T013 [US1] Add `agents/pr-agent/README.md` (skills table, structure, dev commands, governance references per FR-022) and `agents/pr-agent/CHANGELOG.md` per FR-021 — done, PR #3403
- [ ] T014 Run quickstart.md Scenario 1 (consolidation complete, bug fixed) against `develop` — unblocked now that #3400/#3401/#3403 have merged

**Checkpoint**: User Story 1 fully implemented across the 3-PR stack; all three merged to `develop`.

---

## Phase 4: User Story 2 - The agent's PR-creation behaviour matches what's already been validated in practice (Priority: P2)

**Goal**: `pr-agent`'s skills perform the full validated PR-creation workflow from `ls-theme` `SKILL.md` (Source B9), not a thinner reimplementation.

**Independent Test**: Run the agent against a real branch with committed, pushed changes; confirm every behaviour in `PR_Agent_Consolidation_Brief.md` Source B9 is present (quickstart.md Scenario 2).

### Implementation for User Story 2

- [ ] T015 [P] [US2] Update `orchestrate-pr-creation`'s scripts to derive title/body from the branch's own commits/diff without assuming prior conversation context, matching `ls-theme` `SKILL.md` Step 1, in `agents/pr-agent/skills/orchestrate-pr-creation/scripts/orchestrate-pr-creation.js` (FR-005)
- [ ] T016 [US2] Implement base-branch-by-type resolution per FR-006's policy (`hotfix/`/`release/` → production-role branch; else → integration-role branch; fall back to the repository's real default branch only when neither role applies) in `agents/pr-agent/skills/orchestrate-pr-creation/scripts/orchestrate-pr-creation.js`, resolved via `gh repo view --json defaultBranchRef` and the repository's existing branches, never a literal `develop`/`main` string (depends on T015)
- [ ] T017 [P] [US2] Implement "check for an already-open PR, update in place" logic (read current body first, rewrite only stale parts, backfill missing labels/assignee/changelog-decision label) in `agents/pr-agent/skills/submit-pr/scripts/submit-pr.js` per FR-007
- [ ] T018 [P] [US2] Implement review-budget size calculation (excluding generated/compiled/lock/snapshot/translation files) and preferred (~15 files/~400 lines) / hard-flag (~25 files/~800 lines) threshold flagging in `agents/pr-agent/skills/orchestrate-pr-creation/scripts/orchestrate-pr-creation.js` per FR-008, reading `Repository Override Config` (`.github/pr-agent.config.json`, see `contracts/repository-override-config.schema.json`) where present
- [ ] T019 [US2] Implement the self-review gate from `ls-theme` `SKILL.md` Step 2.10, including the CodeRabbit/AI-review-findings check where enabled, in `agents/pr-agent/AGENT.md`'s orchestration instructions per FR-009 (depends on T015-T018)
- [ ] T020 [P] [US2] Implement PR-template verbatim-following with additive layering (never inventing a label absent from the repository's real label set) in `agents/pr-agent/skills/route-pr-template/scripts/route-pr-template.js` per FR-010, and the fallback structure per FR-011 when no routing configuration exists
- [ ] T021 [US2] Ensure assignee and all applicable labels (including exactly one changelog-decision indicator) are set in the same atomic action that creates/updates the PR, never a follow-up step, in `agents/pr-agent/skills/validate-and-apply-labels/scripts/validate-and-apply-labels.js` and `agents/pr-agent/skills/submit-pr/scripts/submit-pr.js` per FR-012
- [ ] T022 [US2] Implement changelog-entry addition (only after the PR exists, only when the changelog-decision indicator requires one, ≤250 characters per constitution Principle IX) in `agents/pr-agent/skills/submit-pr/scripts/submit-pr.js` per FR-013 (depends on T021)
- [ ] T023 [P] [US2] Implement stack position/issue-epic/dependencies/review-scope recording and the closing-vs-non-closing issue reference rule (only the layer completing the work uses a closing keyword) in `agents/pr-agent/skills/orchestrate-pr-creation/scripts/orchestrate-pr-creation.js` per FR-014
- [ ] T024 [P] [US2] Implement draft-PR support that skips ready-for-review actions (CI confirmation, reviewer request, review-status label, work-item link) until explicitly asked, in `agents/pr-agent/skills/submit-pr/scripts/submit-pr.js` per FR-015
- [ ] T025 [US2] Implement the mark-ready-for-review sequence (confirm checks, request reviewer, apply review-status indicator, attempt work-item link, warn-not-fail when no linking tool is available) in `agents/pr-agent/skills/submit-pr/scripts/submit-pr.js` per FR-016 (depends on T024)
- [ ] T026 [P] [US2] Add "reply to every review thread, fix a stacked-set defect in its owning layer, rebase layers above afterward" guidance to `agents/pr-agent/AGENT.md` per FR-017
- [ ] T027 [P] [US2] Add the natural-language-invocation confirm-branch-and-base-before-acting guard to `agents/pr-agent/AGENT.md` per FR-018
- [ ] T028 [US2] Run quickstart.md Scenario 2 end-to-end against a real branch, confirming create and update-in-place both work (depends on T015-T027)

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - The agent works the same way in any LightSpeedWP repository, not just this one (Priority: P3)

**Goal**: Assignee, base branch, review-budget thresholds, and prefix list all resolve per-repository, never hardcoded to `.github` or `ls-theme`.

**Independent Test**: Install/reference the agent from a second, different LightSpeedWP repository; confirm dynamic resolution and override behaviour (quickstart.md Scenario 3).

### Implementation for User Story 3

- [ ] T029 [P] [US3] Audit every skill under `agents/pr-agent/skills/` for any hardcoded assignee, branch name, threshold, or prefix value; replace each with dynamic resolution or the organisation-wide default per FR-023
- [ ] T030 [US3] Implement `Repository Override Config` (`.github/pr-agent.config.json`) reading in `agents/pr-agent/skills/orchestrate-pr-creation/scripts/orchestrate-pr-creation.js` and `agents/pr-agent/skills/validate-branch-name/scripts/validate-branch-name.js` per the schema in `contracts/repository-override-config.schema.json` — absent file MUST mean "use organisation-wide defaults," and an unrecognised field MUST NOT be treated as a valid override (depends on T029)
- [ ] T031 [P] [US3] Confirm assignee resolution never reads from `Repository Override Config` and is never hardcoded, via `gh` identity lookup, per FR-023/data-model.md's `assignee` field
- [ ] T032 [US3] Run quickstart.md Scenario 3 against a second LightSpeedWP repository with a different default branch and assignee-in-practice, including the override-file test (depends on T030, T031)

**Checkpoint**: All three user stories should now be independently functional.

---

## Phase 6: User Story 4 - Every skill follows the Agent Skills specification, is tested, linted, and documented (Priority: P4)

**Goal**: Per spec.md, this story's acceptance scenarios (real `SKILL.md` content, `scripts/`/`scripts/__tests__/` restructuring, demonstrable lint coverage, `README.md`/`CHANGELOG.md`) — all already delivered as part of User Story 1's actual scope (T007, T008, T013), not deferred here as originally organised in the spec's phasing.

- [x] T033 [US4] Confirm `npm run lint` from `agents/pr-agent/` demonstrably covers its own contents (deliberately-introduced-violation check, SC-007) — done, PR #3400/#3403 (verified twice: once adopting the config, once after the restructuring)
- [ ] T034 [US4] Run quickstart.md Scenario 4 in full (grep-based `template-skill` check, `npm test`, deliberate lint violation, `README.md` reference check) against `develop` — unblocked now that #3400/#3401/#3403 have merged

**Checkpoint**: All user stories independently functional; Story 4's own acceptance criteria already satisfied by Story 1's delivery.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T035 [P] Run quickstart.md Scenario 5 (LOCKED-file boundary: confirm zero changes to `.github/PULL_REQUEST_TEMPLATE/`, `.github/labels.yml`, `.github/issue-types.yml` across the full stack's diff)
- [ ] T036 Run `/speckit-analyze` for cross-artifact consistency across `spec.md`/`plan.md`/`tasks.md` before further implementation
- [ ] T037 Update Linear LS-4214 once Stories 2-4 land, and once all three of #3400/#3401/#3403 have merged

---

## Dependencies & Execution Order

- **Setup (Phase 1)** and **Foundational (Phase 2)**: Done (T001-T006), delivered in PR #3400.
- **User Story 1 (Phase 3)**: Done (T007-T014), delivered across PR #3401/#3403 — complete once those merge.
- **User Story 2 (Phase 4)**: Depends on User Story 1 being merged (its skills are the ones being extended). Not started.
- **User Story 3 (Phase 5)**: Depends on User Story 2 (portability generalises behaviour that must exist first, per spec.md's "Why this priority"). Not started.
- **User Story 4 (Phase 6)**: Already satisfied by User Story 1's actual delivery (T033 done); only T034's end-to-end confirmation remains, now unblocked.
- **Polish (Phase 7)**: T035 can run now (stack merged); T036 depends on Stories 2-3 for its full-picture analysis; T037 depends on all of the above.

### Parallel Opportunities

- Within Phase 4: T015, T017, T018, T020, T023, T024, T026, T027 are marked `[P]` — different files, no dependencies on each other.
- Within Phase 5: T029, T031 are marked `[P]`.

---

## Implementation Strategy

### Current state

User Story 1 (the MVP) is fully implemented, delivered across three stacked PRs (#3400 → `develop`, #3401 → #3400, #3403 → #3401), verified (Jest suite, lint, markdownlint) at every step, and merged to `develop` on 2026-09-22.

### Next increment

User Story 2 (T015-T028) is the next priority — it delivers the actual PR-creation value this agent exists for. User Story 3 (portability) and the remainder of User Story 4 (T034) follow, plus the Polish tasks (T035-T037).
