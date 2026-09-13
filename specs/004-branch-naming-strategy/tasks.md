# Tasks: Branch Naming Strategy & Enforcement

**Input**: Design documents from `specs/004-branch-naming-strategy/`  
**Status**: Phase 2 Design Complete → Phase 3 Implementation Ready  
**Timeline**: 6 weeks (48-62 hours) | Weeks 1-6

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- 24 authorized branch types with pattern `{type}/{scope}-{title}`
- Forbidden prefixes: `claude/`, `copilot/`, `openai/`

---

## Phase 1: Setup & Infrastructure

**Purpose**: Project initialization and branch validation framework

- [ ] T001 Create branch validation framework directory at `.github/branch-validation/`
- [ ] T002 Create branch type definitions at `.github/branch-validation/branch-types.json` (24 authorized types from contracts)
- [ ] T003 [P] Create branch regex patterns at `.github/branch-validation/patterns.json` (pattern, forbidden, template-mapping for each type)
- [ ] T004 [P] Create type-to-template mapping at `.github/branch-validation/template-mapping.json` (each type maps to 1 PR template from 19 templates)
- [ ] T005 [P] Create type-to-labels mapping at `.github/branch-validation/label-mapping.json` (each type auto-applies canonical prefixed labels)
- [ ] T006 Initialize Node.js project for validators at `.github/branch-validation/package.json`
- [ ] T007 Create Git pre-push hook template at `.github/branch-validation/hooks/pre-push-template.sh`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core validation infrastructure for all user stories

**⚠️ CRITICAL**: All Phase 2 tasks MUST complete before FR-1 through FR-5 implementation

- [ ] T008 Implement branch name parser at `.github/branch-validation/lib/parser.js` (extract type, scope, title from branch name)
- [ ] T009 Implement validation rule engine at `.github/branch-validation/lib/validator.js` (validate against regex patterns, check forbidden prefixes)
- [ ] T010 [P] Implement type matcher at `.github/branch-validation/lib/type-matcher.js` (map branch type to metadata: template, labels, category)
- [ ] T011 [P] Implement compliance checker at `.github/branch-validation/lib/compliance-checker.js` (returns pass/fail + specific violations)
- [ ] T012 Create test fixtures at `.github/branch-validation/test/fixtures/branch-names.json` (valid and invalid branch name examples)
- [ ] T013 [P] Create metrics aggregator at `.github/branch-validation/lib/metrics-aggregator.js` (tracks compliance %, violations by type, adoption by team)

**Checkpoint**: Validation framework ready - user story implementation can begin

---

## Phase 3: User Story 1 - Branch Name Validation (FR-1) [P1]

**Goal**: System validates branch names match pattern `{type}/{scope}-{title}` with 24 authorized types, 0 forbidden prefixes

**Independent Test**: Validator rejects `claude/feature` (forbidden); accepts `feat/user-auth` (valid)

### Tests for User Story 1 (TDD)

- [ ] T014 [P] [US1] Unit test for type validation at `.github/branch-validation/test/unit/test-type-validation.js` (accept all 24 types, reject others)
- [ ] T015 [P] [US1] Unit test for forbidden prefix detection at `.github/branch-validation/test/unit/test-forbidden-prefixes.js` (reject claude/, copilot/, openai/)
- [ ] T016 [P] [US1] Unit test for pattern matching at `.github/branch-validation/test/unit/test-pattern-matching.js` ({type}/{scope}-{title} format)
- [ ] T017 [P] [US1] Unit test for scope validation at `.github/branch-validation/test/unit/test-scope-validation.js` (scope must be kebab-case, non-empty)
- [ ] T018 [US1] Integration test for full validation pipeline at `.github/branch-validation/test/integration/test-validation-pipeline.js`

### Implementation for User Story 1

- [ ] T019 [P] [US1] Implement type validator at `.github/branch-validation/lib/validators/type-validator.js` (check against 24 authorized types from branch-types.json)
- [ ] T020 [P] [US1] Implement forbidden prefix checker at `.github/branch-validation/lib/validators/forbidden-checker.js` (reject claude/, copilot/, openai/ absolutely)
- [ ] T021 [P] [US1] Implement pattern validator at `.github/branch-validation/lib/validators/pattern-validator.js` ({type}/{scope}-{title} with regex for each type)
- [ ] T022 [P] [US1] Implement scope validator at `.github/branch-validation/lib/validators/scope-validator.js` (kebab-case, 2-50 chars, no special chars)
- [ ] T023 [US1] Create validation CLI at `.github/branch-validation/bin/validate-branch-name.js` (standalone tool, accepts branch name, returns pass/fail)
- [ ] T024 [US1] Create detailed violation reporter at `.github/branch-validation/lib/violation-reporter.js` (human-readable error messages with suggestions)

**Checkpoint**: FR-1 complete - branch names validated; proceed to FR-2

---

## Phase 4: User Story 2 - PR Template Routing (FR-2) [P2]

**Goal**: Branch type automatically determines PR template assignment; 100% of PRs use correct template

**Independent Test**: PR from `feat/user-auth` uses feature template; `fix/auth-bug` uses fix template

### Tests for User Story 2

- [ ] T025 [P] [US2] Unit test for template mapping at `.github/branch-validation/test/unit/test-template-mapping.js` (each type maps to correct template)
- [ ] T026 [P] [US2] Unit test for PR detection at `.github/branch-validation/test/unit/test-pr-branch-detection.js` (extract branch from PR context)
- [ ] T027 [US2] Integration test for GitHub Actions workflow at `.github/branch-validation/test/integration/test-gh-actions-workflow.js`

### Implementation for User Story 2

- [ ] T028 [P] [US2] Implement template resolver at `.github/branch-validation/lib/template-resolver.js` (given branch type, return correct PR template filename)
- [ ] T029 [P] [US2] Implement PR body body injector at `.github/branch-validation/lib/pr-body-injector.js` (read template, inject into PR description)
- [ ] T030 [US2] Create GitHub Actions workflow at `.github/workflows/branch-routing.yml` (triggers on PR creation, detects branch type, assigns template)
- [ ] T031 [P] [US2] Implement fallback handler at `.github/branch-validation/lib/fallback-handler.js` (if branch name invalid, use default template + add warning comment)
- [ ] T032 [US2] Create template cleanup tool at `.github/branch-validation/bin/cleanup-duplicate-templates.js` (remove duplicate PR templates, consolidate into single canonical set)

**Checkpoint**: FR-2 complete - PR templates routed correctly; proceed to FR-3

---

## Phase 5: User Story 3 - Label Auto-Assignment (FR-3) [P3]

**Goal**: Branch type automatically assigns canonical prefixed labels; PR automatically categorized

**Independent Test**: PR from `fix/payment-bug` receives `type:bug` + relevant area labels

### Tests for User Story 3

- [ ] T033 [P] [US3] Unit test for label mapping at `.github/branch-validation/test/unit/test-label-mapping.js` (each type maps to correct labels)
- [ ] T034 [P] [US3] Unit test for canonical label validation at `.github/branch-validation/test/unit/test-canonical-labels.js` (confirm only prefixed labels from labels.yml)
- [ ] T035 [US3] Integration test for label application at `.github/branch-validation/test/integration/test-label-application.js`

### Implementation for User Story 3

- [ ] T036 [P] [US3] Implement label mapper at `.github/branch-validation/lib/label-mapper.js` (given branch type, return array of canonical labels from label-mapping.json)
- [ ] T037 [P] [US3] Implement GitHub label applicator at `.github/branch-validation/lib/github-label-applicator.js` (API call to add labels to PR)
- [ ] T038 [US3] Create GitHub Actions workflow at `.github/workflows/label-auto-assignment.yml` (triggers on PR creation, applies labels based on branch type)
- [ ] T039 [P] [US3] Implement label conflict handler at `.github/branch-validation/lib/label-conflict-handler.js` (if labels already applied, don't duplicate)

**Checkpoint**: FR-3 complete - PR labels auto-assigned; proceed to FR-4

---

## Phase 6: User Story 4 - Pre-Push Validation (FR-4) [P4]

**Goal**: Git pre-push hook validates branch name before push; developers get instant feedback locally

**Independent Test**: `git push` from invalid branch name fails locally with helpful error; valid branch succeeds

### Tests for User Story 4

- [ ] T040 [P] [US4] Unit test for hook installer at `.github/branch-validation/test/unit/test-hook-installer.js` (install/uninstall hooks)
- [ ] T041 [P] [US4] Unit test for hook execution at `.github/branch-validation/test/unit/test-hook-execution.js` (hook runs validation on branch being pushed)
- [ ] T042 [US4] Integration test for real git push scenario at `.github/branch-validation/test/integration/test-git-push-scenario.js` (mock git push from invalid branch)

### Implementation for User Story 4

- [ ] T043 [P] [US4] Create pre-push hook script at `.github/branch-validation/hooks/pre-push.sh` (shell script, validates current branch name, blocks invalid branches, provides helpful error)
- [ ] T044 [P] [US4] Create hook installer at `.github/branch-validation/bin/install-hook.js` (copies hook to .git/hooks/pre-push, makes executable, adds to setup docs)
- [ ] T045 [P] [US4] Create hook uninstaller at `.github/branch-validation/bin/uninstall-hook.js` (removes hook if desired)
- [ ] T046 [US4] Create setup documentation at `.github/branch-validation/docs/SETUP.md` (developer quick-start: install hook, understand validation)
- [ ] T047 [US4] Create bypass documentation at `.github/branch-validation/docs/BYPASS.md` (how to bypass hook if needed, when permitted)

**Checkpoint**: FR-4 complete - pre-push validation works locally; proceed to FR-5

---

## Phase 7: User Story 5 - Metrics & Compliance Tracking (FR-5) [P5]

**Goal**: Daily metrics track branch naming compliance; 24-hour visibility into adoption, violations by type

**Independent Test**: Metrics dashboard shows compliance %, violations by type; daily updated

### Tests for User Story 5

- [ ] T048 [P] [US5] Unit test for compliance calculation at `.github/branch-validation/test/unit/test-compliance-calc.js` ((valid/total)*100)
- [ ] T049 [P] [US5] Unit test for violation bucketing at `.github/branch-validation/test/unit/test-violation-bucketing.js` (group violations by error type)
- [ ] T050 [US5] Integration test for metrics collection at `.github/branch-validation/test/integration/test-metrics-collection.js`

### Implementation for User Story 5

- [ ] T051 [P] [US5] Implement metrics collector at `.github/branch-validation/lib/metrics-collector.js` (collect compliance % + violations by type from CI logs)
- [ ] T052 [P] [US5] Implement metrics storage at `.github/branch-validation/lib/metrics-storage.js` (persist snapshots in JSON, maintain 30-day history at `.github/branch-validation/data/metrics.json`)
- [ ] T053 [P] [US5] Create daily metrics automation at `.github/workflows/branch-metrics-daily.yml` (scheduled job, runs metrics collection daily)
- [ ] T054 [US5] Create metrics dashboard at `.github/branch-validation/dashboard.html` (static HTML, reads metrics.json, shows compliance %, violations by type, 30-day trends)
- [ ] T055 [US5] Create metrics CLI at `.github/branch-validation/bin/metrics.js` (query metrics for date ranges, generate reports)
- [ ] T056 [US5] Create metrics documentation at `.github/branch-validation/docs/METRICS.md` (how to interpret compliance data, identify problem types)

**Checkpoint**: FR-5 complete - metrics dashboard live; full feature complete

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, optimization across all features

- [ ] T057 [P] Create comprehensive README at `.github/branch-validation/README.md` (overview, setup, usage, troubleshooting)
- [ ] T058 [P] Create architecture documentation at `.github/branch-validation/ARCHITECTURE.md` (system design, module responsibilities, data flows)
- [ ] T059 [P] Create troubleshooting guide at `.github/branch-validation/docs/TROUBLESHOOTING.md` (common validation failures, solutions)
- [ ] T060 [P] Create deployment runbook at `.github/branch-validation/docs/DEPLOYMENT.md` (enable across 50+ repos, organization-wide rollout)
- [ ] T061 [P] Create type reference guide at `.github/branch-validation/docs/BRANCH_TYPES.md` (all 24 types, when to use each, examples)
- [ ] T062 Run quickstart.md validation scenarios at `.github/specs/004-branch-naming-strategy/quickstart.md` (confirm all scenarios work end-to-end)
- [ ] T063 Integrate with CLAUDE.md branching rules at `.github/CLAUDE.md` (update documentation to link to validation system)
- [ ] T064 Performance benchmarking at `.github/branch-validation/test/performance/bench.js` (confirm <500ms validation, <50ms per PR routing)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phases 3-7 (User Stories)**: All depend on Phase 2 completion
  - Can run **in parallel** (US1-US5 independent after foundational)
  - Or **sequentially** in priority order (P1 → P2 → P3 → P4 → P5)
- **Phase 8 (Polish)**: Depends on all user stories complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|-----------|------------------|
| US1 (FR-1) | Phase 2 foundation | US2-US5 |
| US2 (FR-2) | US1 (uses validation from FR-1) | US3-US5 |
| US3 (FR-3) | Phase 2 (independent label mapping) | US1-US2, US4-US5 |
| US4 (FR-4) | US1 (uses validation from FR-1) | US2-US3, US5 |
| US5 (FR-5) | Phase 2 (independent metrics) | US1-US4 |

### Parallel Opportunities

**Within Phase 2**: All [P] tasks can run in parallel (T010, T011, T012, T013)

**Within Phase 3 (US1)**: Tests (T014-T017) can run in parallel; all validators (T019-T022) can run in parallel

**Within Phase 4 (US2)**: Tests (T025-T026) can run in parallel; template resolver (T028) and PR injector (T029) can run in parallel

**Across Stories**: After Phase 2, US1-US5 can be assigned to different developers and run in parallel

---

## Parallel Example: 2-Developer Team

**Developer A (Weeks 1-3)**:
- Phase 1: Setup (T001-T007)
- Phase 2: Foundational (T008-T013, all [P] tasks in parallel)
- Phase 3: US1 Branch Validation (T014-T024)

**Developer B (Weeks 1-6)**:
- Phase 1: Parallel with Dev A on setup
- Phase 2: Parallel with Dev A (T010, T011, T012, T013)
- Phases 4-5: US2/US3 PR Routing & Labels while Dev A works Phase 3
- Phase 6: US4 Pre-Push Validation
- Week 6: Phase 7 (Metrics) + Phase 8 (Polish) with Dev A

---

## Implementation Strategy

### MVP First: User Story 1 Only (1 week)

1. Complete Phase 1: Setup (2 days)
2. Complete Phase 2: Foundational (1 day)
3. Complete Phase 3: US1 Branch Validation (3 days)
4. **STOP and VALIDATE**: Test validation against quickstart scenarios
5. Deploy to staging; gather feedback

### Incremental Delivery (6 weeks)

1. **Weeks 1-2**: Phase 1 + Phase 2 + Phase 3 (US1: Branch Name Validation)
   - Deliverable: Validator rejects invalid branch names
2. **Weeks 2-3**: Phase 4 (US2: PR Template Routing)
   - Deliverable: PRs auto-receive correct template based on branch type
3. **Weeks 3-4**: Phase 5 (US3: Label Auto-Assignment)
   - Deliverable: PRs auto-labeled with canonical labels
4. **Weeks 4-5**: Phase 6 (US4: Pre-Push Validation)
   - Deliverable: Git pre-push hook prevents invalid branches locally
5. **Weeks 5-6**: Phase 7 (US5: Metrics) + Phase 8 (Polish)
   - Deliverable: Metrics dashboard live, all documentation complete

---

## Task Count Summary

- **Phase 1 (Setup)**: 7 tasks
- **Phase 2 (Foundational)**: 6 tasks (3 blocking)
- **Phase 3 (US1 - FR-1)**: 10 tasks (5 tests, 5 implementation)
- **Phase 4 (US2 - FR-2)**: 5 tasks (3 tests, 2 workflows/tools)
- **Phase 5 (US3 - FR-3)**: 4 tasks (3 tests, 1 workflow)
- **Phase 6 (US4 - FR-4)**: 5 tasks (3 tests, 2 tools/docs)
- **Phase 7 (US5 - FR-5)**: 6 tasks (3 tests, 3 implementation)
- **Phase 8 (Polish)**: 8 tasks

**TOTAL: 51 tasks**

**Parallelizable**: ~28 tasks marked [P]  
**MVP Scope**: Phases 1-2-3 = 23 tasks (1.5 weeks for 1 FTE)  
**Full Timeline**: 6 weeks, 48-62 hours (parallel team capable)

---

## Success Metrics

At completion of Phase 8:
- ✅ 100% of branch names validated (FR-1)
- ✅ 100% of PRs receive correct template (FR-2)
- ✅ 100% of PRs auto-labeled correctly (FR-3)
- ✅ Pre-push validation prevents invalid branches (FR-4)
- ✅ Daily metrics show compliance, violations by type (FR-5)
- ✅ All phases completed within 6 weeks (48-62 hours)
- ✅ 24-type system adopted org-wide (50+ repos)

