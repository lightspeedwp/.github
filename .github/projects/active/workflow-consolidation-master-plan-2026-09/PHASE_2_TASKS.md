---
file_type: tasks
title: "Phase 2 Implementation Tasks — Unified Workflow Consolidation"
phase: 2
phase_duration: "4 weeks (Oct 1-31, 2026)"
total_effort_hours: "40-50"
feature_name: "Unified Workflow Consolidation — Phase 2"
related_epic: "[Epic] Workflow Consolidation Initiative 2026-Q4"
branch: "feature/unified-workflows-phase-2"
pr_type: "type:feature"
status: "planned"
created: "2026-09-12"
---

# Phase 2 Tasks — Unified Workflow Consolidation

**Feature:** Workflow Consolidation Initiative — Phase 2: Consolidation Implementation  
**Phase:** 2 of 3  
**Duration:** 4 weeks (Oct 1-31, 2026)  
**Effort:** 40-50 hours total  
**Branch:** `feature/unified-workflows-phase-2`  
**PR Type:** `type:feature` (feature template)  
**Status:** Planned

---

## Phase 2 Overview

**Goal:** Transform 62 archived workflows into 5 new unified consolidated workflows

**Workflows to Build:**
1. **labeling-unified.yml** — Consolidates 9 labeling workflows
2. **validation-unified.yml** — Consolidates 12 validation workflows
3. **linting-unified.yml** — Consolidates 2 linting workflows
4. **quality-gates.yml** — Consolidates 5 security/spec workflows
5. **testing-unified.yml** — Consolidates 8 testing workflows

**Success Criteria:**
- All 45 consolidated features working identically to originals
- No regressions in existing automation
- GitHub Actions minutes reduced by 15-20%
- PR merge time reduced from 8-12 min to 4-6 min

---

## Setup Phase

### Foundation: Create Feature Branch & Planning

- [ ] S001 Create feature branch `feature/unified-workflows-phase-2` from develop branch
- [ ] S002 Create Phase 2 implementation plan document with consolidation strategy
- [ ] S003 Create Phase 2 tasks.md (this file) with all implementation tasks
- [ ] S004 Create `.github/workflows/UNIFIED_WORKFLOWS_REFERENCE.md` skeleton for workflow documentation
- [ ] S005 Set up test infrastructure directory `tests/workflows/unified/` with Jest/test runners

**Success Criteria:**
- Branch created and ready for development
- Planning documents in place
- Test infrastructure scaffold complete

---

## Week 1: labeling-unified.yml (Oct 1-5)

### Phase 1: Analysis & Design

- [ ] T001 Analyze all 9 labeling workflows and extract features:
  - [ ] `labeling.yml` — Auto-label logic, frontmatter parsing
  - [ ] `labeling-governance.yml` — Label prefix validation, governance rules
  - [ ] `issue-labeling-automation.yml` — Issue type detection, auto-categorization
  - [ ] `meta-labels-sync.yml` — Label schema sync logic
  - [ ] `batch-label-prs.yml` — Batch relabeling operations
  - [ ] `remediate-bare-labels.yml` — Bare label fix logic
  - [ ] `validate-issue-labels.yml` — Label validation rules
  - [ ] `label-audit-report.yml` — Audit and reporting logic
  - [ ] `openspec-sync-labels.yml` — OpenSpec sync logic

- [ ] T002 Document feature mapping matrix (9 workflows → labeling-unified.yml)

- [ ] T003 Design unified workflow architecture:
  - [ ] Event triggers (pull_request, issues, workflow_dispatch)
  - [ ] Workflow job structure (parallel auto-label, validation, sync jobs)
  - [ ] Shared action components (label validation logic)
  - [ ] Output format and reporting

- [ ] T004 Create shared composite action `actions/label-validation.yml` for reusable label checks

### Phase 2: Implementation

- [ ] T005 Create `.github/workflows/labeling-unified.yml` skeleton with job structure

- [ ] T006 [P] Implement parallel labeling jobs:
  - [ ] T006a — Auto-label job (frontmatter parsing, label application)
  - [ ] T006b — Governance validation job (prefix compliance, rules enforcement)
  - [ ] T006c — Issue type detection job (issue categorization)

- [ ] T007 [P] Implement labeling operations jobs:
  - [ ] T007a — Label schema sync job (meta-labels-sync logic)
  - [ ] T007b — Batch relabeling job (bulk operations)
  - [ ] T007c — Bare label remediation job (fix non-prefixed labels)

- [ ] T008 Implement audit & reporting job:
  - [ ] Label compliance audit logic
  - [ ] OpenSpec label sync
  - [ ] Metrics and reporting output

### Phase 3: Testing & Validation

- [ ] T009 Create unit tests for label validation logic (regex patterns, parsing)
  - File: `tests/workflows/unified/labeling.test.js`
  - Coverage: Frontmatter parsing, prefix validation, issue type detection

- [ ] T010 Create integration tests for labeling-unified.yml
  - [ ] Test PR label application
  - [ ] Test issue type detection
  - [ ] Test label governance enforcement
  - [ ] Test batch relabeling

- [ ] T011 Run regression tests against 9 original labeling workflows
  - [ ] Verify all labels applied identically
  - [ ] Verify validation rules enforced
  - [ ] Verify no feature loss

- [ ] T012 Performance baseline: Measure GitHub Actions minutes for labeling operations

### Phase 4: Documentation & PR

- [ ] T013 Document labeling-unified.yml in UNIFIED_WORKFLOWS_REFERENCE.md:
  - [ ] Event triggers and input parameters
  - [ ] Job descriptions and outputs
  - [ ] Configuration options
  - [ ] Examples of usage

- [ ] T014 Create PR #XXXX for labeling-unified.yml with:
  - [ ] Linked issues (Relates to #2896)
  - [ ] Changelog entries (Added unified labeling engine)
  - [ ] Test results and regression verification
  - [ ] Migration notes for archive restoration

**Definition of Done:**
- ✅ labeling-unified.yml complete and functional
- ✅ All 9 labeling features working identically
- ✅ Unit tests passing (100% coverage)
- ✅ Integration tests passing
- ✅ Regression tests passing
- ✅ PR ready for review

---

## Week 2: validation-unified.yml (Oct 6-10)

### Phase 1: Analysis & Design

- [ ] T015 Analyze all 12 validation workflows and extract validation rules:
  - [ ] Branch name validation patterns
  - [ ] PR template section detection (regex patterns)
  - [ ] Changelog entry validation (Keep a Changelog format)
  - [ ] DoR/DoD section rules
  - [ ] Documentation requirements
  - [ ] Workflow YAML syntax rules
  - [ ] Issue/PR linking requirements
  - [ ] Project linking rules

- [ ] T016 Document validation feature mapping (12 workflows → validation-unified.yml)

- [ ] T017 Design modular validation architecture:
  - [ ] Separate validation jobs by domain (branch, PR, docs, workflow, issues)
  - [ ] Shared validation helpers (reusable regex, check functions)
  - [ ] Validation report aggregation
  - [ ] Pass/fail decision logic

- [ ] T018 Create shared validation utilities:
  - [ ] Composite action: `actions/branch-name-validation.yml`
  - [ ] Composite action: `actions/pr-template-validation.yml`
  - [ ] Composite action: `actions/changelog-validation.yml`
  - [ ] Validation helper library: `scripts/validation/template-helpers.cjs`

### Phase 2: Implementation

- [ ] T019 Create `.github/workflows/validation-unified.yml` skeleton with modular job structure

- [ ] T020 [P] Implement domain-specific validation jobs:
  - [ ] T020a — Branch name validation job (enforce naming conventions)
  - [ ] T020b — PR template validation job (Linked issues, Changelog, Checklist)
  - [ ] T020c — Documentation validation job (docs completeness)

- [ ] T021 [P] Implement lifecycle validation jobs:
  - [ ] T021a — Blocking issue enforcement job (before issue close)
  - [ ] T021b — Blocking status enforcement job (before issue status change)
  - [ ] T021c — Project linking validation job (issues/PRs linked to projects)

- [ ] T022 Implement workflow validation job:
  - [ ] Workflow YAML syntax validation
  - [ ] Workflow structure rules enforcement

- [ ] T023 Implement validation report aggregation:
  - [ ] Collect all validation results
  - [ ] Generate unified validation report
  - [ ] Set overall pass/fail status

### Phase 3: Testing & Validation

- [ ] T024 Create unit tests for validation rules (regex patterns, parsing)
  - File: `tests/workflows/unified/validation.test.js`
  - Coverage: Branch names, PR sections, changelog format, docs rules

- [ ] T025 Create integration tests for validation-unified.yml
  - [ ] Test branch name validation
  - [ ] Test PR template detection
  - [ ] Test changelog validation
  - [ ] Test issue linking validation
  - [ ] Test workflow YAML validation

- [ ] T026 Create edge case tests:
  - [ ] Valid: Branch name `feat/my-feature-2026-09-12`
  - [ ] Invalid: Branch name `claude/my-feature`
  - [ ] Valid: PR template with all sections
  - [ ] Invalid: PR template missing Changelog section

- [ ] T027 Run regression tests against 12 original validation workflows
  - [ ] Verify validation rules unchanged
  - [ ] Verify false positives eliminated
  - [ ] Verify no feature loss

### Phase 4: Documentation & PR

- [ ] T028 Document validation-unified.yml in UNIFIED_WORKFLOWS_REFERENCE.md
- [ ] T029 Create test matrix for validation scenarios (50+ test cases)
- [ ] T030 Create PR #XXXX for validation-unified.yml

**Definition of Done:**
- ✅ validation-unified.yml complete and functional
- ✅ All 12 validation features working identically
- ✅ Unit tests passing with 100+ edge cases
- ✅ Integration tests passing
- ✅ Regression tests passing
- ✅ PR ready for review

---

## Week 2-3: linting-unified.yml & quality-gates.yml (Oct 11-15)

### Part 1: linting-unified.yml

- [ ] T031 Analyze 2 linting workflows:
  - [ ] `linting.yml` — Core linting logic
  - [ ] `markdown-audit-ci-optimization.yml` — Markdown + performance optimization

- [ ] T032 Design linting workflow architecture:
  - [ ] Parallel linting jobs by language (Markdown, JS/TS, YAML, Python)
  - [ ] Changed-file detection for performance
  - [ ] Caching strategy for lint dependencies

- [ ] T033 Create `.github/workflows/linting-unified.yml` with:
  - [ ] Markdown linting job (markdownlint)
  - [ ] JavaScript/TypeScript linting job (ESLint, with caching)
  - [ ] YAML linting job (yamllint)
  - [ ] Changed-file filtering for performance

- [ ] T034 [P] Implement language-specific linting:
  - [ ] T034a — Markdown linter job with markdownlint config
  - [ ] T034b — JS/TS linter job with ESLint config + caching
  - [ ] T034c — YAML linter job with yamllint config

- [ ] T035 Implement performance optimizations:
  - [ ] Detect only changed files (using git diff)
  - [ ] Cache linter dependencies
  - [ ] Skip full linting on formatting-only changes

- [ ] T036 Create tests for linting-unified.yml
  - File: `tests/workflows/unified/linting.test.js`

- [ ] T037 Create PR #XXXX for linting-unified.yml

### Part 2: quality-gates.yml

- [ ] T038 Analyze 5 security/spec workflows:
  - [ ] `gitleaks.yml` — Secret scanning
  - [ ] `gitleaks-update.yml` — Secret scanning updates
  - [ ] `gitleaks-reusable.yml` — Reusable secret scanning
  - [ ] `agent-spec-validation.yml` — Agent spec validation
  - [ ] `openspec-validation.yml` — OpenSpec validation

- [ ] T039 Design quality gates architecture:
  - [ ] Secret scanning job (always blocking)
  - [ ] Spec validation job (always blocking)
  - [ ] Reusable secret scanning composite action
  - [ ] Cache management strategy

- [ ] T040 Create `.github/workflows/quality-gates.yml` with:
  - [ ] Secret scanning job (GitLeaks on all commits)
  - [ ] Agent spec validation job
  - [ ] OpenSpec compliance validation job
  - [ ] Composite actions for reusability

- [ ] T041 [P] Implement security gates:
  - [ ] T041a — GitLeaks secret scanning job (fail on secrets)
  - [ ] T041b — GitLeaks signature update management
  - [ ] T041c — Reusable composite action for secret scanning

- [ ] T042 [P] Implement compliance gates:
  - [ ] T042a — Agent specification validation
  - [ ] T042b — OpenSpec schema validation

- [ ] T043 Create tests for quality-gates.yml
  - File: `tests/workflows/unified/quality-gates.test.js`

- [ ] T044 Create PR #XXXX for quality-gates.yml

**Definition of Done (Both Workflows):**
- ✅ Both workflows complete and functional
- ✅ All features from original 7 workflows working
- ✅ Performance optimizations validated
- ✅ Security gates always blocking
- ✅ Tests passing
- ✅ PRs ready for review

---

## Week 3-4: testing-unified.yml & Integration (Oct 16-31)

### Part 1: testing-unified.yml

- [ ] T045 Analyze 8 testing workflows:
  - [ ] `testing.yml` — Main test orchestration
  - [ ] `release-e2e-tests.yml` — Release E2E tests
  - [ ] `checks.yml` (test portions) — Test orchestration
  - [ ] `test-runner.yml` — Test runner
  - [ ] `integration-tests.yml` — Integration suite
  - [ ] `unit-tests.yml` — Unit suite
  - [ ] `e2e-tests.yml` — E2E suite
  - [ ] `test-coverage.yml` — Coverage reporting

- [ ] T046 Design test orchestration architecture:
  - [ ] Sequential test phases: unit → integration → e2e
  - [ ] Parallel test jobs within each phase
  - [ ] Coverage thresholds and enforcement
  - [ ] Test result aggregation
  - [ ] Badge generation

- [ ] T047 Create `.github/workflows/testing-unified.yml` skeleton with:
  - [ ] Phase 1 job: Unit tests
  - [ ] Phase 2 job: Integration tests
  - [ ] Phase 3 job: E2E tests
  - [ ] Coverage reporting job

- [ ] T048 [P] Implement test phase jobs:
  - [ ] T048a — Unit tests job (run all unit tests, aggregate results)
  - [ ] T048b — Integration tests job (depends on unit tests passing)
  - [ ] T048c — E2E tests job (depends on integration tests passing)

- [ ] T049 Implement coverage reporting:
  - [ ] Code coverage collection from all test runs
  - [ ] Coverage threshold enforcement (fail if below threshold)
  - [ ] Badge generation and update
  - [ ] Coverage artifact storage

- [ ] T050 Implement release-specific testing:
  - [ ] Release E2E tests triggered on release events
  - [ ] Release-specific test scenarios
  - [ ] Release testing report

- [ ] T051 Create matrix tests for different test scenarios:
  - [ ] Node versions: 18.x, 20.x, 22.x
  - [ ] OS: ubuntu-latest, macos-latest, windows-latest
  - [ ] Coverage thresholds: unit (80%), integration (70%), overall (75%)

- [ ] T052 Create comprehensive tests for testing-unified.yml
  - File: `tests/workflows/unified/testing.test.js`

- [ ] T053 Create PR #XXXX for testing-unified.yml

### Part 2: Integration & Enhancement

- [ ] T054 [P] Enhance retained workflows to integrate with unified workflows:
  - [ ] T054a — Update `events-issue-pr-metadata.yml` to dispatch to unified workflows
  - [ ] T054b — Update `pr-workflow.yml` to use unified validation
  - [ ] T054c — Update `issue-management.yml` to use unified validation
  - [ ] T054d — Update `release-orchestration.yml` to use unified testing

- [ ] T055 Create cross-workflow integration tests
  - [ ] Test event dispatch from metadata workflow to unified workflows
  - [ ] Test error propagation across workflow boundaries
  - [ ] Test concurrent workflow execution

- [ ] T056 Update `.github/docs/AUTOMATION.md` with Phase 2 completion notes:
  - [ ] Add section: "Phase 2 Implementation Complete"
  - [ ] Document unified workflow interfaces
  - [ ] Update architecture diagram

- [ ] T057 Create `.github/workflows/UNIFIED_WORKFLOWS_REFERENCE.md` final document:
  - [ ] Complete reference for all 5 unified workflows
  - [ ] Event triggers and job descriptions
  - [ ] Configuration and customization guide
  - [ ] Examples and troubleshooting

- [ ] T058 Create `.github/workflows/MIGRATION_GUIDE.md` for team:
  - [ ] Overview of unified workflows
  - [ ] Before/after comparison
  - [ ] Key changes and new interfaces
  - [ ] Troubleshooting guide

### Part 3: Mirror Testing & Cutover Preparation

- [ ] T059 Set up mirror testing environment:
  - [ ] Configure GitHub Actions to run both old (archived) and new (unified) workflows
  - [ ] Create comparison dashboard

- [ ] T060 Run mirror testing (Oct 26-31):
  - [ ] [ ] T060a — Mirror test labeling-unified vs. archived labeling workflows
  - [ ] [ ] T060b — Mirror test validation-unified vs. archived validation workflows
  - [ ] [ ] T060c — Mirror test linting-unified vs. archived linting workflows
  - [ ] [ ] T060d — Mirror test quality-gates vs. archived security workflows
  - [ ] [ ] T060e — Mirror test testing-unified vs. archived testing workflows

- [ ] T061 Compare mirror testing results:
  - [ ] Verify identical output between old and new workflows
  - [ ] Document any discrepancies
  - [ ] Fix discrepancies before deployment

- [ ] T062 Performance analysis:
  - [ ] Measure GitHub Actions minutes: old vs. new
  - [ ] Document 15-20% savings achieved
  - [ ] Analyze per-workflow performance improvements

- [ ] T063 Rollback procedure validation:
  - [ ] Test restoration of archived workflows if needed
  - [ ] Document rollback decision criteria
  - [ ] Prepare rollback runbook

- [ ] T064 Team training & readiness:
  - [ ] Document new unified workflow interfaces
  - [ ] Conduct team training session
  - [ ] Gather questions and feedback
  - [ ] Update documentation based on feedback

### Part 4: Release & Deployment

- [ ] T065 Create consolidation PR combining all 5 unified workflows:
  - [ ] Title: `feat: Unified workflow consolidation (Phase 2) - 62 workflows → 5 consolidated`
  - [ ] Linked issues: Closes #2896, Relates to #2897-#2901
  - [ ] Changelog: Document all 5 unified workflows, feature consolidations, performance improvements
  - [ ] Checklist: All items marked complete

- [ ] T066 Pre-deployment validation:
  - [ ] All CI checks passing
  - [ ] All tests passing
  - [ ] Mirror testing complete
  - [ ] Tech lead approval obtained

- [ ] T067 Deploy to develop branch (Oct 31):
  - [ ] Merge PR to develop branch
  - [ ] Verify unified workflows active
  - [ ] Verify archived workflows disabled
  - [ ] Monitor CI metrics

- [ ] T068 Production monitoring (Nov 1+ ongoing):
  - [ ] Monitor PR merge times (target: 4-6 min)
  - [ ] Monitor GitHub Actions minutes (target: 15-20% savings)
  - [ ] Monitor workflow failure rates
  - [ ] Gather team feedback

**Definition of Done (Phase 2):**
- ✅ All 5 unified workflows complete and functional
- ✅ All 45 archived features replicated and working
- ✅ All 9 retained workflows integrated
- ✅ Mirror testing complete (old vs. new identical)
- ✅ Performance target achieved (15-20% savings)
- ✅ Team trained and comfortable
- ✅ Deployed to develop branch
- ✅ Production monitoring active

---

## Polish Phase

### Documentation & Artifacts

- [ ] T069 Create Phase 2 completion summary document:
  - [ ] Overview of Phase 2 accomplishments
  - [ ] Metrics: workflows consolidated, lines of code eliminated, cost savings
  - [ ] Team performance highlights
  - [ ] Lessons learned

- [ ] T070 Update AUTOMATION.md with Phase 2 completion
- [ ] T071 Archive Phase 2 planning documents to `.github/projects/completed/`
- [ ] T072 Create Phase 3 planning document (Monitoring & Optimization)

### Cleanup & Finalization

- [ ] T073 Remove Phase 2 branch after merge
- [ ] T074 Clean up temporary test workflows and fixtures
- [ ] T075 Final documentation review and approval

**Definition of Done (Polish):**
- ✅ All documentation complete
- ✅ Phase 2 summary published
- ✅ Phase 3 planning initiated
- ✅ Repository in clean state

---

## Success Metrics

### Functional Metrics
- [ ] 100% of 62 archived features replicated
- [ ] 0 regressions in existing automation
- [ ] 5 unified workflows deployed to develop
- [ ] All 9 retained workflows integrated

### Performance Metrics
- [ ] GitHub Actions minutes: 15-20% reduction achieved
- [ ] PR merge time: 8-12 min → 4-6 min
- [ ] Check gates per PR: 15-20+ → 5 (one per unified workflow)
- [ ] ~500 lines of duplicate code eliminated

### Quality Metrics
- [ ] Test coverage: 100% of new unified workflow logic
- [ ] Regression tests: 100% passing
- [ ] Mirror testing: 100% feature parity
- [ ] CI: 100% green on Phase 2 PR

### Operational Metrics
- [ ] Team training: 100% attendance
- [ ] Documentation: Complete and reviewed
- [ ] Deployment: 0 rollback incidents in first week
- [ ] Support: <5 issues reported in first week

---

## Dependencies & Sequencing

### Sequential Tasks (Must Complete in Order)
- S001-S005 → Setup Phase (foundation)
- Setup Phase → T001-T004 → T005-T008 → T009-T012 (labeling)
- Labeling complete → T015-T018 (validation analysis)
- T018 → T019-T023 (validation implementation)
- Validation complete → T031-T037 (linting)
- Linting complete → T038-T044 (quality-gates)
- Both complete → T045-T053 (testing-unified)
- Testing complete → T054-T058 (integration)
- Integration complete → T059-T064 (mirror testing)
- Mirror testing complete → T065-T068 (deployment)

### Parallel Tasks Within Each Workflow
- T006a, T006b, T006c (parallel labeling jobs) — Can run simultaneously
- T007a, T007b, T007c (parallel labeling operations) — Can run simultaneously
- T020a, T020b, T020c (parallel validation jobs) — Can run simultaneously
- T021a, T021b, T021c (parallel validation jobs) — Can run simultaneously
- T034a, T034b, T034c (parallel linting jobs) — Can run simultaneously
- T041a, T041b, T041c (parallel security jobs) — Can run simultaneously
- T048a, T048b, T048c (parallel test phases) — Run sequentially (depends)
- T054a, T054b, T054c, T054d (parallel enhancements) — Can run simultaneously
- T060a-T060e (parallel mirror tests) — Can run simultaneously

---

## Related Documentation

- [PHASE_2_IMPLEMENTATION_PLAN.md](./PHASE_2_IMPLEMENTATION_PLAN.md) — Detailed implementation strategy
- [WORKFLOW_CONSOLIDATION_MAPPING.md](../../docs/WORKFLOW_CONSOLIDATION_MAPPING.md) — Complete workflow mapping
- [AUTOMATION.md](../../docs/AUTOMATION.md) — Architecture documentation
- [Phase 1 Tasks](./tasks.md) — Phase 1 completion reference

---

**Document Status:** Phase 2 Tasks Ready ✅  
**Created:** 2026-09-12  
**Scheduled Start:** Oct 1, 2026  
**Estimated Completion:** Oct 31, 2026  
**Effort:** 40-50 hours
