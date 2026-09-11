# Tasks: PRD Agent Consolidation (Phases 4-7)

**Input**: Design documents from `.github/specs/001-prd-agent-consolidation/`

**Prerequisites**: plan.md (implementation strategy), spec.md (user stories for Phases 4-7)

**Status**: Phase 3 ✅ COMPLETE | Phases 4-7 PENDING

**Delivery Method**: Stacked PRs per phase to enable parallel review and phase-isolated rollback

---

## Format: `[ID] [P?] [Story] Description`

- **[ID]**: Task identifier (T001, T002, etc.)
- **[P]**: Can run in parallel (different files/PRs, no dependencies)
- **[Story]**: User story mapping (US4, US5, US6, US7)
- **File paths**: Exact location of deliverables or changes

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and PR infrastructure for Phases 4-7

**Status**: ✅ Foundation ready (Phase 3 complete); no new setup needed

- [ ] T001 Verify Phase 3 merge commit stable and all 28 canonical skills present in `agents/prd-agent/skills/`
- [ ] T002 Create stacked PR checklist document at `.github/projects/active/prd-combined-agent/STACKED_PR_CHECKLIST.md` (PR naming, review process, merge gates, CI integration)
- [ ] T003 [P] Set up branch protection rules for Phase 4 PRs to enforce all-together-or-nothing merge policy on `feat/prd-agent-phase4-*` branches
- [ ] T004 [P] Create Phase 4 milestone in GitHub Projects at `.github/projects/active/prd-combined-agent/` with gate criteria (SC-401 through SC-404)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before Phase 4 implementation

**Status**: ✅ Phase 3 foundation complete; Phase 4 can proceed

**Note**: No additional foundational work needed. Phase 3 structural consolidation provides stable base for all subsequent phases.

---

## Phase 3: Phase 4 — Prompt Enhancement & Memory Registry (Weeks 1-2, P1)

**Goal**: Enhance PRD agent prompt with improved architecture, update memory registry, validate via benchmarks

**User Story**: US4 - Enhanced PRD agent with improved prompt architecture (Priority: P1)

**Stacked PR Stack**:

1. `feat/prd-agent-phase4-prompt-enhancement` (prompt + tests)
2. `feat/prd-agent-phase4-memory-registry` (registry updates)
3. `feat/prd-agent-phase4-validation` (benchmarks, changelog, final validation)

**Independent Test**: Enhanced prompt loads in Claude Code without validation warnings; memory registry resolves without 404 errors; benchmark metrics documented

### Implementation: Stacked PR 1 — Prompt Enhancement

**File Path**: `agents/prd-agent/claude/agent.md`, `agents/prd-agent/claude/instructions.md`, `agents/prd-agent/copilot/agent.md`, `agents/prd-agent/copilot/instructions.md`

- [ ] T005 [US4] Analyze Phase 3 consolidation feedback in issue #1248 to identify prompt improvement areas (FR-411); document findings in `.github/projects/active/prd-combined-agent/PROMPT_ANALYSIS.md`
- [ ] T006 [US4] Review current prompt architecture in `agents/prd-agent/claude/instructions.md` and `agents/prd-agent/copilot/instructions.md` for context management gaps
- [ ] T007 [US4] Design enhanced prompt with improved context management and skill routing; update `agents/prd-agent/claude/instructions.md` (include explicit skill routing matrix)
- [ ] T008 [P] [US4] Update `agents/prd-agent/copilot/instructions.md` with matching enhancements
- [ ] T009 [P] [US4] Create baseline benchmark test cases in `agents/prd-agent/tests/benchmarks/baseline.md` (structured PRD generation scenarios with expected outputs)
- [ ] T010 [US4] Execute baseline test against Phase 3 agent; document success rate in `.github/projects/active/prd-combined-agent/BASELINE_METRICS.md`

### Implementation: Stacked PR 2 — Memory Registry Updates

**File Path**: `agents/mode-prd.agent.md`, `agents/prd-agent/AGENT.md`, `agents/prd-agent/claude/agent.md`, `agents/prd-agent/copilot/agent.md`

- [ ] T011 [P] [US4] Update memory registry in `agents/mode-prd.agent.md` to reflect consolidated 28-skill inventory (FR-413); validate all references resolve without 404 errors
- [ ] T012 [P] [US4] Update `agents/prd-agent/AGENT.md` metadata sections to match new prompt architecture and enhanced skill routing
- [ ] T013 [P] [US4] Validate agent frontmatter in `agents/prd-agent/claude/agent.md` loads without errors; run Claude Code validation (FR-413)
- [ ] T014 [P] [US4] Validate agent frontmatter in `agents/prd-agent/copilot/agent.md` loads without errors; run Copilot validation (FR-413)
- [ ] T015 [US4] Execute benchmark test against enhanced agent; compare success rate vs. baseline (target ≥15% improvement per spec US4 acceptance criteria)

### Implementation: Stacked PR 3 — Validation & Changelog

**File Path**: `CHANGELOG.md`, `.github/projects/active/prd-combined-agent/PHASE4_VALIDATION.md`

- [ ] T016 [US4] Document prompt enhancement summary in CHANGELOG.md with version bump to v2.2.0 (FR-415; SC-401 requirement)
- [ ] T017 [US4] Create Phase 4 validation report at `.github/projects/active/prd-combined-agent/PHASE4_VALIDATION.md` (baseline vs. improved metrics, memory registry validation results, agent loading validation)
- [ ] T018 [P] [US4] Run comprehensive validation: prompt syntax check, agent definitions loadability, memory registry 404 check, benchmark success rate comparison
- [ ] T019 [US4] Update `.github/projects/active/prd-combined-agent/` project board with Phase 4 completion status (all SC-401 through SC-404 criteria met)

**Checkpoint**: Phase 4 complete — Enhanced prompt loads in both Claude and Copilot; memory registry updated; all success criteria met. Ready for Phase 5.

---

## Phase 4: Phase 5 — Testing & Validation (Weeks 3-5, P1)

**Goal**: Create comprehensive test suite covering all 28 skills across all providers (Claude, Copilot, OpenAI); validate quality; triage bugs

**User Story**: US5 - Comprehensive PRD agent testing and validation (Priority: P1)

**Stacked PR Stack**:

1. `feat/prd-agent-phase5-test-suite` (test framework + suite)
2. `feat/prd-agent-phase5-provider-testing` (execution harness + provider tests)
3. `feat/prd-agent-phase5-quality-metrics` (results analysis, bug triage, documentation)

**Independent Test**: Test suite runs against all three providers; ≥90% skill coverage achieved; ≥95% pass rate across providers; no critical bugs blocking release

### Implementation: Stacked PR 1 — Test Suite Framework & Structure

**File Path**: `agents/prd-agent/tests/`, `agents/prd-agent/tests/test-suite.md`, `agents/prd-agent/tests/skills/`

- [ ] T020 [US5] Create test framework at `agents/prd-agent/tests/test-suite.md` (structure, naming convention, execution flow for 28 skills)
- [ ] T021 [US5] Create test case templates in `agents/prd-agent/tests/templates/` (input, expected output, pass criteria for routing, content generation, etc.)
- [ ] T022 [P] [US5] Write test cases for all 28 skills in `agents/prd-agent/tests/skills/` (≥3 scenarios per skill per FR-501; target ≥90% capability coverage)
- [ ] T023 [P] [US5] Create skill coverage matrix at `agents/prd-agent/tests/COVERAGE_MATRIX.md` (list all 28 skills, test count per skill, capability areas tested)
- [ ] T024 [US5] Document test setup requirements in `agents/prd-agent/tests/README.md` (dependencies, environment setup, how to run suite)

### Implementation: Stacked PR 2 — Provider Testing Harness & Execution

**File Path**: `agents/prd-agent/tests/providers/`, `agents/prd-agent/tests/execution/`, `agents/prd-agent/tests/results/`

- [ ] T025 [P] [US5] Create execution harness in `agents/prd-agent/tests/execution/run-provider-tests.sh` (orchestrates test suite against Claude, Copilot, OpenAI providers per FR-502)
- [ ] T026 [P] [US5] Create provider-specific test adapters in `agents/prd-agent/tests/providers/claude-adapter.js`, `agents/prd-agent/tests/providers/copilot-adapter.js`, `agents/prd-agent/tests/providers/openai-adapter.js`
- [ ] T027 [P] [US5] Set up CI/CD integration to run full test suite on each PR (GitHub Actions workflow at `.github/workflows/prd-agent-test-suite.yml`)
- [ ] T028 [US5] Execute full test suite against Phase 4 agent across all three providers; capture results in `agents/prd-agent/tests/results/phase5-initial-run.json`
- [ ] T029 [US5] Validate PRD generation quality by running real-world workflow scenarios from `agents/prd-agent/tests/real-world-scenarios/` against baseline (FR-503); document quality comparison

### Implementation: Stacked PR 3 — Quality Metrics & Bug Triage

**File Path**: `agents/prd-agent/tests/PHASE5_RESULTS.md`, `.github/issues/`, `.github/projects/active/prd-combined-agent/`

- [ ] T030 [US5] Analyze test results and calculate pass rate per provider; document in `agents/prd-agent/tests/PHASE5_RESULTS.md` (target ≥95% per SC-502)
- [ ] T031 [P] [US5] Identify all failing tests and create bug tracking in GitHub issues; categorize by severity (critical, high, medium, low)
- [ ] T032 [P] [US5] Document any issues found in `agents/prd-agent/tests/PHASE5_BUGS.md` with reproduction steps, affected skills, severity, and fix estimation (FR-504)
- [ ] T033 [US5] Create bug triage backlog in `.github/projects/active/prd-combined-agent/` (list all known bugs with priority; confirm zero critical blockers per SC-503)
- [ ] T034 [US5] Publish test results and metrics in project documentation at `.github/projects/active/prd-combined-agent/PHASE5_METRICS.md` (test count, coverage %, pass rate per provider, bug summary)
- [ ] T035 [P] [US5] Update CHANGELOG.md with Phase 5 completion summary (test coverage %, pass rate, known issues)

**Checkpoint**: Phase 5 complete — Test suite covers ≥90% of skills; ≥95% pass rate across all providers; all bugs documented and triaged; no critical blockers. Ready for Phase 6.

---

## Phase 5: Phase 6 — Rollout & Adoption (Weeks 6-8, P1)

**Goal**: Communicate consolidated agent capabilities to organization; track team adoption; collect feedback; ensure ≥4.0/5.0 satisfaction

**User Story**: US6 - Organization-wide PRD agent rollout and team adoption (Priority: P1)

**Stacked PR Stack**:

1. `feat/prd-agent-phase6-rollout-comms` (docs, guides, FAQ)
2. `feat/prd-agent-phase6-adoption-tracking` (metrics setup, dashboards)
3. `feat/prd-agent-phase6-feedback-collection` (survey, analysis, iteration backlog)

**Independent Test**: Rollout comms delivered to all teams; ≥5 teams using agent after 30 days; satisfaction ≥4.0/5.0; no regressions vs. Phase 3

### Implementation: Stacked PR 1 — Rollout Communication & Documentation

**File Path**: `docs/prd-agent-rollout/`, `docs/prd-agent-guide.md`, `docs/prd-agent-faq.md`, `.github/discussions/`

- [ ] T036 [US6] Create rollout communication document at `docs/prd-agent-rollout/ROLLOUT_COMMUNICATION.md` (announcement, consolidated capabilities summary, benefits, getting started)
- [ ] T037 [P] [US6] Create user guide at `docs/prd-agent-rollout/USER_GUIDE.md` (how to access consolidated agent, core workflows, skill routing, examples)
- [ ] T038 [P] [US6] Create FAQ at `docs/prd-agent-rollout/FAQ.md` (common questions, troubleshooting, migration from phase 3, skill changes)
- [ ] T039 [P] [US6] Create team briefing slides/notes at `docs/prd-agent-rollout/TEAM_BRIEFING.md` (for FR-602 briefings; highlights benefits, answers common concerns)
- [ ] T040 [US6] Post rollout announcement in org-wide Slack channel and GitHub Discussions at `.github/discussions/` (FR-601 completion indicator)

### Implementation: Stacked PR 2 — Adoption Tracking Setup

**File Path**: `.github/projects/active/prd-combined-agent/adoption/`, `docs/prd-agent-rollout/ADOPTION_METRICS.md`

- [ ] T041 [P] [US6] Create adoption tracking dashboard at `.github/projects/active/prd-combined-agent/adoption/dashboard.md` (team count, usage frequency, feature adoption, satisfaction trend)
- [ ] T042 [P] [US6] Design metrics collection strategy in `docs/prd-agent-rollout/ADOPTION_METRICS.md` (how to collect team count, usage patterns, satisfaction data; timeline: daily/weekly/bi-weekly per FR-603)
- [ ] T043 [P] [US6] Set up adoption logging: add telemetry hooks to track which teams/users access consolidated agent (implementation location: `agents/prd-agent/telemetry.md`)
- [ ] T044 [US6] Create manual adoption check-in template at `.github/projects/active/prd-combined-agent/adoption/CHECK_IN_TEMPLATE.md` (team name, usage count, key workflows, blockers, satisfaction initial impression)
- [ ] T045 [US6] Initialize adoption tracking project board at `.github/projects/active/prd-combined-agent/` with columns for team status (not-yet-contacted, briefed, active, satisfied)

### Implementation: Stacked PR 3 — Feedback Collection & Analysis

**File Path**: `docs/prd-agent-rollout/feedback-survey.md`, `.github/projects/active/prd-combined-agent/feedback/`, `PHASE6_ADOPTION_RESULTS.md`

- [ ] T046 [P] [US6] Create feedback survey at `docs/prd-agent-rollout/FEEDBACK_SURVEY.md` (satisfaction 1-5 scale, workflow improvements, bug/issue reports, feature requests; FR-605 support)
- [ ] T047 [P] [US6] Create feedback collection procedure at `docs/prd-agent-rollout/FEEDBACK_COLLECTION.md` (how teams submit feedback, review frequency, response turnaround, escalation path)
- [ ] T048 [P] [US6] Set up GitHub Discussion threads or survey form for feedback collection (location: `.github/discussions/prd-agent-feedback` or external survey link in `.github/projects/active/prd-combined-agent/`)
- [ ] T049 [US6] At Day 30 (end of week 4 of rollout), collect and analyze adoption metrics: team count, usage patterns, feedback summary (FR-604); document in `docs/prd-agent-rollout/PHASE6_ADOPTION_RESULTS.md`
- [ ] T050 [P] [US6] Create FAQ iteration backlog at `.github/projects/active/prd-combined-agent/feedback/` based on collected questions and issues (prioritize by frequency and impact)
- [ ] T051 [US6] Document satisfaction score and adoption decision rationale in `docs/prd-agent-rollout/PHASE6_SATISFACTION_ANALYSIS.md` (≥4.0/5.0 target per SC-603; confirm ≥5 teams active per SC-602)

**Checkpoint**: Phase 6 complete — Rollout comms delivered to all teams; adoption tracking shows ≥5 active teams; user satisfaction ≥4.0/5.0; Phase 7 decision made (archive or sync). Ready for Phase 7 conditional execution.

---

## Phase 6: Phase 7 — Optional Spec-Based Agent Sync/Archive (Weeks 9-12, CONDITIONAL, P3)

**Goal**: Based on Phase 6 adoption metrics, decide whether to archive or sync `agents/mode-prd.agent.md` (spec-based agent)

**User Story**: US7 - Archive or sync the spec-based PRD agent (Priority: P3, Optional)

**Stacked PR Stack** (conditional; execute only if Phase 6 decision calls for Phase 7):

- `feat/prd-agent-phase7-archive-decision` (if archiving) **OR**
- `feat/prd-agent-phase7-sync-decision` (if syncing)

**Independent Test**: Spec-based agent fate resolved; all affected workflows updated; decision documented for maintainers

**Precondition**: Phase 6 adoption metrics reviewed; decision ratified (archive or sync)

### Implementation Path A: Archive Decision

**File Path**: `projects/archive/agents/mode-prd.agent.md`, `.github/projects/active/prd-combined-agent/PHASE7_ARCHIVE_DECISION.md`

- [ ] T052 [P] [US7] If archive decision: Move `agents/mode-prd.agent.md` to `projects/archive/agents/mode-prd.agent.md.archived` (preserve for historical reference; FR-703)
- [ ] T053 [P] [US7] Search codebase for all references to `mode-prd.agent.md` (grep: `mode-prd` in workflows, docs, configs); create reference list at `.github/projects/active/prd-combined-agent/mode-prd-references.txt`
- [ ] T054 [US7] Update all references to point to `agents/prd-agent/copilot/agent.md` as canonical Copilot source (FR-703; affected files likely: GitHub Actions workflows, documentation, plugin configs)
- [ ] T055 [P] [US7] Document archival rationale in `.github/projects/active/prd-combined-agent/PHASE7_ARCHIVE_DECISION.md` (why portable agent preferred; adoption metrics showing successful consolidation; no external dependencies on mode-prd)
- [ ] T056 [US7] Update CHANGELOG.md with Phase 7 archival completion and version bump to v3.0.0 (FR-705)

### Implementation Path B: Sync Decision

**File Path**: `agents/mode-prd.agent.md`, `.github/projects/active/prd-combined-agent/PHASE7_SYNC_PROCESS.md`

- [ ] T057 [P] [US7] If sync decision: Update `agents/mode-prd.agent.md` prompt to match `agents/prd-agent/copilot/agent.md` exactly (FR-704; manual sync at phase completion)
- [ ] T058 [P] [US7] Create sync procedure document at `.github/projects/active/prd-combined-agent/PHASE7_SYNC_PROCESS.md` (when/how to sync spec-based agent with portable agent going forward; recommended: monthly sync review per risk register)
- [ ] T059 [US7] Set up recurring sync task as GitHub Issue template or scheduled workflow (location: `.github/workflows/prd-agent-monthly-sync-reminder.yml` or `.github/ISSUE_TEMPLATE/prd-agent-sync-reminder.md`)
- [ ] T060 [P] [US7] Document sync rationale in `.github/projects/active/prd-combined-agent/PHASE7_SYNC_DECISION.md` (why both agents retained; sync frequency; governance for future changes)
- [ ] T061 [US7] Update CHANGELOG.md with Phase 7 sync process establishment and version bump to v3.0.0 (FR-705)

**Checkpoint**: Phase 7 complete (conditional) — Spec-based agent archived or synced; all references updated; decision documented. Entire PRD Agent Consolidation project (Phases 3-7) now complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation cleanup, and post-project follow-up

- [ ] T062 [P] Final verification of all 28 canonical skills still present and loadable in `agents/prd-agent/skills/`
- [ ] T063 [P] Verify all four provider agent definitions (Claude, Copilot, OpenAI, and spec-based if kept) load without warnings
- [ ] T064 [P] Validate all CHANGELOG.md entries (v2.2.0 Phase 4, v2.3.0 Phase 5, v2.4.0 Phase 6, v3.0.0 Phase 7) are present and accurate
- [ ] T065 Update `.github/projects/active/prd-combined-agent/` board final status (all phases complete; all PRs merged; project closed)
- [ ] T066 Create final project retrospective at `.github/projects/active/prd-combined-agent/PROJECT_RETROSPECTIVE.md` (timeline adherence, risks realized, lessons learned, adoption success)
- [ ] T067 Archive completed phase folders (Phases 4-7) to `.github/projects/archive/prd-agent-phases-4-7/` for historical reference
- [ ] T068 Schedule post-project review meeting (timing: 2 weeks after Phase 7 completion to allow adoption data to stabilize)

---

## Dependencies & Execution Order

### Phase Dependencies

\`\`\`
Phase 3 ✅ (Complete; stable foundation)
    ↓ BLOCKER: All Phase 4 PRs must merge
Phase 4 (Weeks 1-2, 10 business days)
    ↓ BLOCKER: Phase 5 requires Phase 4 PRs merged + enhanced prompt stable
Phase 5 (Weeks 3-5, 15 business days)
    ↓ BLOCKER: Phase 6 requires ≥95% test pass rate
Phase 6 (Weeks 6-8, 15 business days)
    ↓ DECISION GATE: Phase 7 executes only if adoption decision made
Phase 7 (Weeks 9-12, CONDITIONAL; 5-15 business days)

Total Duration: 8-12 weeks (Phases 4-6 fixed; Phase 7 conditional)
\`\`\`

### Stacked PR Merge Policy (All-or-Nothing)

Each phase's stacked PR stack:

1. All PRs in stack opened with explicit sequencing
2. All PRs reviewed and approved
3. **All PRs merged together in single operation** (no partial merges)
4. If any PR fails CI/review, entire stack blocks until resolved

Example Phase 4:

- `feat/prd-agent-phase4-prompt-enhancement` → `feat/prd-agent-phase4-memory-registry` → `feat/prd-agent-phase4-validation`
- All three approved → merge all three together → base branch updated
- Only then can Phase 5 stack begin

### Parallel Opportunities Within Phase 4

- T001 + T002 + T003 + T004 can start immediately (Phase 1 setup)
- Within Stacked PR 1: T006 + T007 + T008 + T009 can run in parallel (different files)
- Within Stacked PR 2: T011 + T012 + T013 + T014 can run in parallel (different files)
- Within Stacked PR 3: T018 can only start after T017 (validation depends on documentation)

### Parallel Opportunities Within Phase 6

- T036 + T037 + T038 + T039 can run in parallel (different documentation files)
- T041 + T042 + T043 can run in parallel (different infrastructure setup files)
- T046 + T047 + T048 can run in parallel (different feedback infrastructure files)

### Between Phases (Preparation Overlap)

- Phase 5 test case writing can begin while Phase 4 PRs are in review (T020-T024 can start before Phase 4 merges)
- Phase 6 communication drafting can begin while Phase 5 testing is underway (T036-T039 can start before Phase 5 gate passes)

---

## Phase Gate Validation Checkpoints

### Phase 4 Gate (End of Week 2)

All of the following must be true before Phase 5 begins:

- ✅ T017 completed: CHANGELOG.md updated with v2.2.0
- ✅ T015 completed: Benchmark test shows ≥15% improvement over baseline
- ✅ T011-T014 completed: Memory registry validated (zero 404 errors)
- ✅ T013-T014 completed: Agent definitions load without warnings (Claude + Copilot)
- ✅ All Phase 4 PRs merged to main branch

**Gate Decision**: Proceed to Phase 5 ✅ or delay/fix ❌

### Phase 5 Gate (End of Week 5)

All of the following must be true before Phase 6 begins:

- ✅ T022 completed: Test cases written for all 28 skills
- ✅ T028 completed: Full test suite executed across all three providers
- ✅ T030 completed: Pass rate ≥95% across all providers
- ✅ T033 completed: Bug triage complete; zero critical blockers confirmed
- ✅ T034 completed: Metrics published; coverage ≥90%
- ✅ All Phase 5 PRs merged to main branch

**Gate Decision**: Proceed to Phase 6 ✅ or delay/fix ❌

### Phase 6 Gate (End of Week 8)

All of the following must be true before Phase 7 decision:

- ✅ T040 completed: Rollout announcement posted to all teams
- ✅ T049 completed: 30-day adoption metrics collected
- ✅ T051 completed: Satisfaction score ≥4.0/5.0 confirmed; ≥5 teams active confirmed
- ✅ T034 completed: Zero critical regressions vs. Phase 3 baseline reported
- ✅ All Phase 6 PRs merged to main branch

**Gate Decision**: Phase 6 adoption successful ✅; Proceed to Phase 7 decision (archive or sync) ✅ or investigate blockers ❌

### Phase 7 Gate (End of Week 12, CONDITIONAL)

Executes only if Phase 6 gate passed and decision made (archive or sync):

- ✅ T052 or T057 completed: Spec-based agent archived or synced
- ✅ T055 or T060 completed: Rationale documented for maintainers
- ✅ T056 or T061 completed: CHANGELOG.md updated with v3.0.0
- ✅ If archive (T054): All references updated to portable agent
- ✅ If sync (T059): Sync procedure established and documented
- ✅ All Phase 7 PRs merged to main branch

**Gate Decision**: Phase 7 complete ✅; PRD Agent Consolidation project fully delivered

---

## Implementation Strategy

### MVP: Phase 4 Only (2 weeks)

1. Complete Phase 1 setup (T001-T004)
2. Execute Phase 4 stacked PR stack (T005-T019)
3. **STOP and VALIDATE**: Benchmark metrics ≥15% improvement; prompt loads without warnings
4. **Outcome**: Enhanced agent ready; foundation for testing in Phase 5

### Incremental Delivery

1. **Phase 4** → Enhanced prompt + memory registry ✅
2. **Phase 5** → Comprehensive testing across providers ✅
3. **Phase 6** → Organization adoption + feedback ✅
4. **Phase 7** → Conditional archive/sync decision (optional) ✅

Each phase adds value independently:

- After Phase 4: Team has improved agent architecture
- After Phase 5: Team has confidence in quality across providers
- After Phase 6: Organization actively using; adoption validated
- After Phase 7: Codebase governance clarified (single or dual source)

### Parallel Team Strategy (If Staffed)

Assuming multiple developers and Phase 4 complete:

- **Developer A**: Phase 5 test suite creation (T020-T024) while Phase 4 in review
- **Developer B**: Phase 5 provider testing setup (T025-T028) while Phase 4 in review
- **Developer C**: Phase 6 communication drafting (T036-T040) while Phase 5 in testing

By the time Phase 4 merges, Phase 5 test infrastructure is ready; by time Phase 5 completes, Phase 6 comms are drafted.

---

## Task Status & Progress Tracking

| Phase | Status | Owner | Start Date | Target Completion |
|-------|--------|-------|------------|-------------------|
| Phase 4 (Weeks 1-2) | PENDING | Ash Shaw | TBD | +10 business days |
| Phase 5 (Weeks 3-5) | PENDING | Ash Shaw | TBD (after Phase 4) | +15 business days |
| Phase 6 (Weeks 6-8) | PENDING | Ash Shaw | TBD (after Phase 5) | +15 business days |
| Phase 7 (Weeks 9-12, conditional) | PENDING | TBD | TBD (after Phase 6 decision) | +5-15 business days |

**Current Phase**: Phase 3 ✅ COMPLETE; Ready to begin Phase 4

---

## Next Steps

1. **Assign Phase 4 owner** (default: Ash Shaw per plan.md)
2. **Create stacked PR infrastructure** (T001-T004)
3. **Begin Phase 4 Stacked PR 1** (T005-T010): Prompt enhancement
4. **Maintain weekly check-ins** against timeline; escalate blockers to stakeholder review
5. **Execute Phase 4 Gate validation** at end of Week 2; confirm ≥15% benchmark improvement before Phase 5 kickoff

---

## Notes

- All file paths relative to repository root (`.github/` for specifications, specs directory for outputs)
- Phase 4-7 tasks depend on Phase 3 structural consolidation remaining stable (assumption from plan.md)
- Stacked PR merge strategy is all-or-nothing; no partial phase deployments allowed
- Phase 7 is conditional on Phase 6 adoption decision; no Phase 7 execution without clear adoption metrics and stakeholder sign-off
- [P] marked tasks indicate parallelizable work (can be assigned to different team members or run concurrently)
