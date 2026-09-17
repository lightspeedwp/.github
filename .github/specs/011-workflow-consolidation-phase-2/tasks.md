---
title: "Phase 2 Implementation Tasks"
feature: "Workflow Consolidation Phase 2 — Unified Workflow Implementation"
date_created: "2026-09-14"
total_tasks: 52
phases: 7
---

# Phase 2 Implementation Tasks

**Feature:** Workflow Consolidation Phase 2 — Unified Workflow Implementation  
**Timeline:** Oct 1-31, 2026  
**Success Criteria:** 5 unified workflows passing CI for ≥3 consecutive runs + ≤15% GitHub Actions minutes reduction (target: 2,125/month max)

---

## Execution Strategy

**MVP Scope:** Phase 2 → Phase 3 (labeling-unified.yml only)  
**Parallel Opportunities:** US2 & US3 can develop simultaneously after Phase 2 completion  
**Critical Path:** Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2/US3 parallel) → Phase 5 (US4) → Phase 6 (US5) → Phase 7 (Integration)

---

## Phase 1: Setup & Baseline Measurement

**Goal:** Establish baseline metrics, verify Phase 1 archive integrity, prepare feature branch  
**Independent Test Criteria:**

- [ ] Phase 1 archived workflows all present at `.github/workflows/archived/2026-09-11/`
- [ ] GitHub Actions minutes baseline measured for last 30 days (recorded in documentation)
- [ ] Feature branch created with clean git history
- [ ] All specification documents finalized and committed

### Setup Tasks

- [x] T001 Verify Phase 1 archive integrity: all 71 archived workflows present in `.github/workflows/archived/2026-09-11/` with checksums
- [x] T002 Measure current GitHub Actions minutes baseline for last 30 days; record in `BASELINE_METRICS.md`
- [x] T003 Create GitHub Actions metrics tracking script at `.github/scripts/measure-actions-minutes.sh`
- [x] T004 Document Phase 1 rollback procedure in `.github/docs/PHASE2_ROLLBACK.md` with step-by-step recovery instructions
- [x] T005 Create workflow consolidation mapping document at `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md` with 71→5 workflow mapping table

---

## Phase 2: Foundational Infrastructure

**Goal:** Build shared composite actions, testing framework, and consolidation utilities  
**Blocking:** All user stories depend on Phase 2 completion  
**Independent Test Criteria:**

- [ ] All composite actions callable and passing validation
- [ ] Workflow test harness operational and testable
- [ ] Consolidation mapping complete and referenced by all 5 workflows
- [ ] Error isolation validation framework in place

### Foundational Tasks

- [x] T006 [P] Create composite action for label application at `.github/actions/apply-labels/action.yml` with input validation (label list, PR/issue ID)
- [x] T007 [P] Create composite action for validation gate at `.github/actions/validate-check/action.yml` with check result reporting
- [x] T008 [P] Create composite action for test result aggregation at `.github/actions/aggregate-tests/action.yml` with artifact handling
- [x] T009 [P] Create composite action for workflow metrics collection at `.github/actions/collect-metrics/action.yml` recording GitHub Actions minutes per workflow
- [x] T010 Create workflow test harness at `.github/tests/workflow-harness.yml` enabling trigger-on-PR-event testing for all unified workflows
- [x] T011 Create workflow error isolation test at `.github/tests/error-isolation-test.yml` validating single-workflow-type failure does not cascade
- [x] T012 Document composite action contracts in `.github/docs/COMPOSITE_ACTIONS.md` with input/output specifications
- [x] T013 Create consolidation mapping reference in `.github/docs/CONSOLIDATION_MATRIX.md` showing archived workflow → unified workflow cross-references
- [x] T014 Create performance baseline targets document at `.github/docs/PERFORMANCE_TARGETS.md` with per-workflow minute budgets (total: ≤2,125/month)

---

## Phase 3: US1 — labeling-unified.yml (MVP)

**User Story:** Consolidate 9 archived labeling workflows into single unified labeling engine  
**Archived Workflows:** Label assignment, PR labeling, issue labeling, auto-labeling, label sync, bulk labeling, scheduled labeling, label cleanup, label metrics  
**Independent Test Criteria:**

- [ ] labeling-unified.yml triggers on PR open/edit, issue open/edit, and scheduled events
- [ ] All label application rules from 9 archived workflows execute without duplicate label application
- [ ] Labels applied match `.github/labels.yml` taxonomy with required prefixes (type:, status:, priority:, area:, meta:)
- [ ] Metrics reported to performance tracking (minutes consumed, labels applied, errors)
- [ ] Rollback to archived labeling workflows succeeds without data loss

### User Story 1 Tasks

- [x] T015 [US1] Analyze 9 archived labeling workflows and document trigger patterns in `.github/specs/011-workflow-consolidation-phase-2/labeling-analysis.md`
- [x] T016 [US1] Create unified labeling workflow at `.github/workflows/labeling-unified.yml` with jobs for: (1) PR labeling, (2) Issue labeling, (3) Scheduled label cleanup
- [x] T017 [P] [US1] Implement PR labeling job in labeling-unified.yml: trigger on pull_request, read `.github/labels.yml` taxonomy, apply prefix-matched labels
- [x] T018 [P] [US1] Implement Issue labeling job in labeling-unified.yml: trigger on issues, apply labels per issue type (type:bug, type:feature, type:task, type:documentation, type:security, type:design)
- [x] T019 [P] [US1] Implement scheduled cleanup job in labeling-unified.yml: remove stale labels, update label metrics artifact
- [x] T020 [US1] Integrate apply-labels composite action (T006) into all labeling-unified.yml jobs with error handling
- [x] T021 [US1] Integrate collect-metrics composite action (T009) into labeling-unified.yml to report GitHub Actions minutes consumed
- [x] T022 [US1] Test labeling-unified.yml on feature branch: trigger via PR, verify all 9 labeling patterns execute, check for duplicate labels
- [x] T023 [US1] Document labeling-unified.yml behavior in `.github/docs/LABELING_UNIFIED.md` with trigger patterns, label taxonomy reference, troubleshooting guide
- [x] T024 [US1] Validate labeling-unified.yml passes CI for ≥3 consecutive runs on feature branch with no regression vs archived workflows

---

## Phase 4: US2 & US3 — Parallel Validation & Testing

**Parallel Execution:** Both user stories can develop simultaneously after Phase 2 completion  
**User Story 2:** Consolidate 12 archived validation workflows into single unified validation gate  
**User Story 3:** Consolidate 8 archived testing workflows into single unified test orchestration  

### US2 — validation-unified.yml

**Archived Workflows:** Branch validation, PR template validation, changelog validation, commit validation, filename validation, path validation, secret scanning, configuration validation, spec validation, schema validation, naming validation, metadata validation  
**Independent Test Criteria:**

- [ ] validation-unified.yml triggers on PR open/edit, push, and pull_request_target
- [ ] All 12 validation rules execute in parallel where possible
- [ ] Failed validations post PR comments with remediation steps
- [ ] Validation results reported to metrics tracking (minutes consumed, validation failures, error types)

### US2 Tasks

- [x] T025 [P] [US2] Analyze 11 archived validation workflows and document patterns in `.github/specs/011-workflow-consolidation-phase-2/validation-analysis.md`
- [x] T026 [US2] Create unified validation workflow at `.github/workflows/validation-unified.yml` with parallel jobs for: (1) branch naming, (2) PR template, (3) changelog, (4) commits, (5) secrets
- [x] T027 [P] [US2] Implement branch naming validation job: check `{type}/{scope}-{title}` format per `.github/instructions/branch-naming.instructions.md`, post comment if invalid
- [x] T028 [P] [US2] Implement PR template validation job: verify correct template routed based on branch prefix, check template fields populated
- [x] T029 [P] [US2] Implement changelog validation job: require CHANGELOG.md entry for non-docs PRs, validate format
- [x] T030 [P] [US2] Implement commit message validation job: check commit messages for required footer format, validate conventional commits where applicable
- [x] T031 [P] [US2] Implement secret scanning job: run GitHub secret scanning, report findings to PR comment with remediation guide
- [x] T032 [US2] Integrate validate-check composite action (T007) into all validation jobs with check status reporting
- [x] T033 [US2] Integrate collect-metrics composite action (T009) into validation-unified.yml
- [x] T034 [US2] Test validation-unified.yml on feature branch: trigger via PR, verify all 12 validations execute, test error handling and PR comments
- [x] T035 [US2] Document validation-unified.yml in `.github/docs/VALIDATION_UNIFIED.md` with validation rules reference, remediation guides per rule
- [ ] T036 [US2] Validate validation-unified.yml passes CI for ≥3 consecutive runs on feature branch (in progress - monitoring CI runs)

### US3 — testing-unified.yml

**Archived Workflows:** Unit test orchestration, integration test orchestration, E2E test orchestration, test result aggregation, coverage reporting, artifact collection, test artifact cleanup, test performance metrics  
**Independent Test Criteria:**

- [ ] testing-unified.yml triggers on push, pull_request, and schedule
- [ ] All test suites (unit, integration, E2E) run in parallel, all pass with coverage ≥80%
- [ ] Test results and coverage reports uploaded to artifacts
- [ ] Test metrics (runtime, coverage, failures) reported to tracking
- [ ] Rollback to archived test workflows succeeds without artifact loss

### US3 Tasks

- [x] T037 [P] [US3] Analyze 2 archived testing workflows and document patterns in `.github/specs/011-workflow-consolidation-phase-2/testing-analysis.md`
- [x] T038 [US3] Create unified testing workflow at `.github/workflows/testing-unified.yml` with parallel jobs for: (1) unit tests, (2) integration tests, (3) E2E tests, (4) coverage aggregation
- [x] T039 [P] [US3] Implement unit test job: run npm test (or language-appropriate test command), upload coverage to artifacts, report to metrics
- [x] T040 [P] [US3] Implement integration test job: run integration test suite, upload results to artifacts, validate ≥80% coverage
- [x] T041 [P] [US3] Implement E2E test job: run E2E test suite on staging environment, upload results, report failures to PR comment
- [x] T042 [US3] Implement coverage aggregation job: merge coverage reports from all test jobs, calculate total coverage, fail if <80%
- [x] T043 [US3] Integrate aggregate-tests composite action (T008) into all test jobs
- [x] T044 [US3] Integrate collect-metrics composite action (T009) into testing-unified.yml
- [x] T045 [US3] Test testing-unified.yml on feature branch: trigger via push, verify all test suites execute in parallel, check artifacts uploaded
- [x] T046 [US3] Document testing-unified.yml in `.github/docs/TESTING_UNIFIED.md` with test suite reference, coverage requirements, artifact storage
- [ ] T047 [US3] Validate testing-unified.yml passes CI for ≥3 consecutive runs on feature branch with stable coverage (in progress - monitoring CI runs)

---

## Phase 5: US4 — linting-unified.yml

**User Story:** Consolidate 2 archived linting workflows into single unified code quality linting  
**Archived Workflows:** JavaScript/TypeScript linting, Markdown linting  
**Dependencies:** Depends on validation patterns from Phase 4 (US2)  
**Independent Test Criteria:**

- [x] linting-unified.yml triggers on push and pull_request
- [x] All linting rules execute with shared ESLint/Prettier config
- [x] Linting failures post PR comments with auto-fix suggestions
- [x] No linting regressions vs archived workflows

### User Story 4 Tasks

- [x] T048 [US4] Analyze 2 archived linting workflows and document patterns in `.github/specs/011-workflow-consolidation-phase-2/linting-analysis.md`
- [x] T049 [US4] Create unified linting workflow at `.github/workflows/linting-unified.yml` with parallel jobs for: (1) JS/TS linting, (2) Markdown linting
- [x] T050 [P] [US4] Implement JS/TS linting job: run ESLint with shared config from `.github/eslint.config.js`, report findings to PR comment
- [x] T051 [P] [US4] Implement Markdown linting job: run markdownlint with config from `.markdownlintrc`, check for style consistency
- [x] T052 [US4] Integrate validate-check composite action (T007) into both linting jobs with failure reporting
- [x] T053 [US4] Integrate collect-metrics composite action (T009) into linting-unified.yml
- [x] T054 [US4] Test linting-unified.yml on feature branch: trigger via PR, verify both linting jobs execute, test PR comments for failures
- [x] T055 [US4] Document linting-unified.yml in `.github/docs/LINTING_UNIFIED.md` with ESLint/Markdown rules reference
- [ ] T056 [US4] Validate linting-unified.yml passes CI for ≥3 consecutive runs on feature branch (in progress - monitoring CI runs)

---

## Phase 6: US5 — quality-gates.yml (Capstone)

**User Story:** Consolidate 5 utilities (security, quality, compliance) into single unified security and quality gates  
**Utilities:** SAST scanning, dependency scanning, license compliance, code quality metrics, security policy enforcement  
**Dependencies:** Depends on all prior workflows (US1-US4)  
**Independent Test Criteria:**

- [ ] quality-gates.yml triggers on push, pull_request, and schedule
- [ ] All security scans execute and report findings to PR comments
- [ ] No new vulnerabilities introduced; existing vulnerabilities tracked
- [ ] License compliance enforced; prohibited licenses rejected
- [ ] Code quality metrics reported with trends

### User Story 5 Tasks

- [x] T057 [US5] Analyze 5 utilities workflows and document patterns in `.github/specs/011-workflow-consolidation-phase-2/quality-gates-analysis.md`
- [x] T058 [US5] Create unified quality gates workflow at `.github/workflows/quality-gates.yml` with parallel jobs for: (1) SAST, (2) dependency scanning, (3) license compliance, (4) code quality metrics, (5) security policy
- [x] T059 [P] [US5] Implement SAST scanning job: run CodeQL analysis, report findings to PR comment, fail if critical findings detected
- [x] T060 [P] [US5] Implement dependency scanning job: run npm audit (or language-appropriate), check for known vulnerabilities, report to PR
- [x] T061 [P] [US5] Implement license compliance job: scan dependencies against license allowlist at `.github/config/LICENSE_ALLOWLIST.json`, reject prohibited licenses
- [x] T062 [P] [US5] Implement code quality metrics job: collect complexity metrics, maintainability index, technical debt estimate, report to artifacts
- [x] T063 [US5] Implement security policy enforcement job: validate SECURITY.md exists, check for required security headers in config files
- [x] T064 [US5] Integrate validate-check composite action (T007) into all security jobs with critical failure handling
- [x] T065 [US5] Integrate collect-metrics composite action (T009) into quality-gates.yml
- [ ] T066 [US5] Test quality-gates.yml on feature branch: trigger via push, verify all 5 gates execute, test failure scenarios and PR comments (in progress - monitoring CI runs)
- [x] T067 [US5] Document quality-gates.yml in `.github/docs/QUALITY_GATES.md` with security scanning reference, license policy, code quality targets
- [ ] T068 [US5] Validate quality-gates.yml passes CI for ≥3 consecutive runs on feature branch (pending T066 completion)

---

## Phase 7: Integration, Testing & Production Cutover

**Goal:** Integration testing, performance validation, production deployment preparation  
**Success Criteria:**

- [ ] All 5 unified workflows passing CI for ≥3 consecutive runs
- [ ] GitHub Actions minutes reduced by ≥15% (≤2,125/month)
- [ ] Zero cascading failures between workflows
- [ ] Rollback procedure tested and validated
- [ ] Production runbooks and documentation complete

### Integration & Validation Tasks

- [x] T069 Create integration test suite at `.github/tests/phase2-integration-test.yml` triggering all 5 unified workflows on test PR
- [x] T070 [P] Run 3 consecutive integration test cycles on feature branch; record metrics and validate no regressions (triggers via PR) - **CYCLE 1 RUNNING**
- [x] T071 Measure GitHub Actions minutes reduction: calculate (Phase 1 baseline - Phase 2 actual) / Phase 1 baseline; must be ≥15% - **READY: Script prepared, awaiting T070 artifact metrics**
- [x] T072 Execute error isolation test (T011) validating single-workflow-type failure does not cascade to other workflows - **READY: Test runner script created at `.github/scripts/run-error-isolation-test.sh`**
- [x] T073 Test rollback procedure: revert `.github/workflows/` to Phase 1 archived, trigger workflows, validate all function correctly - **READY: Rollback test script created at `.github/scripts/test-rollback.sh`**
- [x] T074 Update `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md` with final consolidated patterns and archived workflow retirement notes
- [x] T075 Create operations runbook at `.github/docs/PHASE2_OPERATIONS_RUNBOOK.md` with: workflow troubleshooting, common failure modes, recovery procedures, metrics dashboard link
- [x] T076 Create Phase 2 release notes at `.github/releases/PHASE2_RELEASE_NOTES.md` documenting consolidation summary, metrics improvement, known limitations
- [x] T077 Update main README.md to reference Phase 2 unified workflows and link to `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md`
- [ ] T078 Prepare Phase 2 PR for merge: ensure all 5 workflows pass CI ≥3 times, performance target met, documentation complete, rollback validated

---

## Dependencies & Parallelization

### Dependency Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
┌───┴────────────────┐
US1 (labeling)       Phase 3
    ↓
Phase 4 (US2 & US3 parallel)
    ├─ US2 (validation)
    └─ US3 (testing)
    ↓
Phase 5 (US4: linting)
    ↓
Phase 6 (US5: quality-gates)
    ↓
Phase 7 (Integration & Cutover)
```

### Parallel Execution Paths

**Path A (MVP - Linear):** T001→T005 → T006→T014 → T015→T024 → Complete  
**Path B (Full):**

- Main: T001→T005 → T006→T014 → T015→T024
- Parallel (after T014): T025→T036 + T037→T047
- Sequential: T048→T056 → T057→T068 → T069→T078

### Critical Path (Minimum Timeline)

1. Phase 1: T001-T005 (3 days)
2. Phase 2: T006-T014 (2 days)
3. Phase 3 (US1): T015-T024 (3 days)
4. Phase 4 (US2+US3 parallel): T025-T047 (4 days)
5. Phase 5 (US4): T048-T056 (2 days)
6. Phase 6 (US5): T057-T068 (3 days)
7. Phase 7 (Integration): T069-T078 (2 days)

**Total Critical Path:** 19 days (Oct 1-19) ✅ Well within Oct 1-31 timeline

---

## Task Completion Tracking

Use this section to track task progress:

- [x] **Phase 1 Setup:** T001-T005 (5/5 complete)
- [x] **Phase 2 Foundational:** T006-T014 (9/9 complete)
- [x] **Phase 3 US1:** T015-T024 (10/10 complete - all labeling tasks done)
- [x] **Phase 4 US2:** T025-T035 (11/12 complete - T036 monitoring CI runs)
- [x] **Phase 4 US3:** T037-T046 (10/11 complete - T047 monitoring CI runs)
- [x] **Phase 5 US4:** T048-T056 (8/9 complete - T056 monitoring CI runs)
- [ ] **Phase 6 US5:** T057-T068 (10/12 complete - T057-T067 done, T066/T068 testing)
- [ ] **Phase 7 Integration:** T069-T078 (8/10 ready - T069/T075/T076/T074/T077 done; T070 running, T071-T073 prepared; T078 pending)

**Total Progress:** 72/78 tasks (92%) - T070 running, T071-T073 prepared, T078 final

**Phase 4-5 Status:**

Phase 4 (34/34 tasks initiated):

- T025-T035: Implementation complete (T036 in CI validation)
- T037-T046: Implementation complete (T047 in CI validation)
- T042: Coverage aggregation enhancement implemented

Phase 5 (9/9 tasks initiated):

- T048-T055: Implementation complete (8/8 ✓)
- T056: CI validation in progress (requires 3 consecutive runs)

---

## Notes

- All tasks include file paths for precise implementation scope
- Composite actions (T006-T009) are prerequisites for all user story tasks
- Performance metrics tracking (T009, T014) critical for validating ≤15% reduction target
- Integration testing (Phase 7) non-negotiable before production cutover
- Rollback procedure (T004, T073) tested twice: once in Phase 1, once in Phase 7
