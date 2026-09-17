---
title: "Phase 2 Implementation Plan"
date_created: "2026-09-14"
last_updated: "2026-09-17"
status: "active"
clarifications_session: "2026-09-17"
---

# Phase 2 Implementation Plan

## Executive Summary

Phase 2 consolidates 71 archived GitHub Actions workflows into 5 unified consolidated workflows, reducing maintenance burden by 82% and GitHub Actions minutes by ≥15% (hard requirement: ≤2,125/month). Implementation follows a 7-phase approach with MVP completion in 3 weeks, full delivery in 4 weeks.

## Clarifications Session (2026-09-17)

**Resolved ambiguities from specification analysis:**

| Clarification | Resolution |
|---------------|-----------|
| **Performance Target** | Hard minimum ≥15% reduction required (≤2,125/month baseline from ~2,500). If <15% achieved, PR cannot merge. |
| **Error Isolation** | Isolated failure model: When one unified workflow fails (e.g., labeling-unified.yml), other workflows (validation, testing, linting, quality-gates) continue independently. PR status check reports only failed workflow. No cascade to other workflows. |
| **Test Coverage** | Hybrid approach: Composite actions ≥80% line coverage (reusable shared logic); unified workflows 100% functional coverage (all critical paths, primary/error/edge cases). Line % not enforced for workflows. |
| **Footer/Badge Scope** | Deferred to Phase 2.1 (immediate follow-up). Phase 2 excludes footer de-duplication and badge validation logic. Keeps Phase 2 focused on workflow consolidation. |
| **Mergify Frequency** | Dependabot merge frequency: every 2 days (48-hour batching). To be implemented in Phase 2.1. |

---

## Technical Context

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Workflow Language** | YAML (GitHub Actions) | Unified workflow definition |
| **Platforms** | GitHub Actions, GitHub API | Workflow execution and event handling |
| **Composite Actions** | GitHub composite actions (YAML) | Reusable workflow components |
| **Testing** | GitHub Actions test harness | Workflow behavior validation |
| **Metrics** | GitHub API + custom script | Performance tracking and baseline measurement |
| **Documentation** | Markdown | Architecture, consolidation mapping, runbooks |

### Architecture Principles

1. **Consolidation Pattern:** N archived workflows → 1 unified workflow (same triggers, behavior, outputs)
2. **Modularity:** Composite actions for shared logic (label application, validation gates, metrics collection)
3. **Parallelization:** Jobs within unified workflows run concurrently where no dependencies exist
4. **Traceability:** Consolidation mapping document links each archived workflow → new consolidated location
5. **Backward Compatibility:** All archived workflow behavior preserved; no observable changes to dependent systems
6. **Error Isolation (Isolated Failure Model):** When one workflow type fails (e.g., labeling-unified.yml), other workflows continue independently. PR status check reports only the failed workflow; others report pass/fail based on their own execution. Dependent systems use last-known-good state or fallback logic. No cascade between workflows.

### File Structure

```
.github/
├── workflows/
│   ├── labeling-unified.yml              ← NEW (consolidates 9 workflows)
│   ├── validation-unified.yml            ← NEW (consolidates 12 workflows)
│   ├── linting-unified.yml               ← NEW (consolidates 2 workflows)
│   ├── quality-gates.yml                 ← NEW (consolidates 5 utilities)
│   ├── testing-unified.yml               ← NEW (consolidates 8 workflows)
│   ├── archived/2026-09-11/              ← REFERENCE ONLY (71 original workflows)
│   │   ├── labeling/
│   │   ├── validation/
│   │   ├── testing/
│   │   ├── linting/
│   │   └── quality-gates/
│   └── [9 existing core stub workflows]  ← UNCHANGED
├── actions/
│   ├── apply-labels/action.yml           ← NEW
│   ├── validate-check/action.yml         ← NEW
│   ├── aggregate-tests/action.yml        ← NEW
│   └── collect-metrics/action.yml        ← NEW
├── tests/
│   ├── workflow-harness.yml              ← NEW
│   ├── error-isolation-test.yml          ← NEW
│   └── phase2-integration-test.yml       ← NEW
├── scripts/
│   └── measure-actions-minutes.sh        ← NEW (metrics baseline)
└── docs/
    ├── WORKFLOW_CONSOLIDATION_MAPPING.md ← NEW
    ├── CONSOLIDATION_MATRIX.md           ← NEW
    ├── COMPOSITE_ACTIONS.md              ← NEW
    ├── PERFORMANCE_TARGETS.md            ← NEW
    ├── PHASE2_ROLLBACK.md                ← NEW
    ├── LABELING_UNIFIED.md               ← NEW
    ├── VALIDATION_UNIFIED.md             ← NEW
    ├── TESTING_UNIFIED.md                ← NEW
    ├── LINTING_UNIFIED.md                ← NEW
    ├── QUALITY_GATES.md                  ← NEW
    ├── PHASE2_OPERATIONS_RUNBOOK.md      ← NEW
    └── PHASE2_RELEASE_NOTES.md           ← NEW
```

### Dependencies & Integration Points

**Upstream (Depend on Phase 2):**

- PR creation workflows (use labeling-unified.yml)
- CI/CD validation (use validation-unified.yml)
- Release pipelines (use testing-unified.yml)
- Metrics dashboards (consume performance data from unified workflows)

**Downstream (Phase 2 Depends On):**

- Phase 1 archived workflows (reference for behavior mapping)
- `.github/labels.yml` (label taxonomy for labeling-unified.yml)
- `.github/ISSUE_TEMPLATE/*.md` (PR template routing for validation-unified.yml)
- GitHub Actions API (metrics collection)

### Known Constraints

- **Phase 1 archive must remain intact** — Reference and rollback capability
- **No PR/issue template changes** — Phase 2 focuses only on workflow consolidation
- **GitHub Actions minute budget static** — Must achieve ≥15% reduction without exceeding baseline
- **No breaking changes to archived workflow contracts** — All downstream automation must work unchanged
- **Composite action reuse mandatory** — Reduces duplication and lines of code

---

## Implementation Strategy

### MVP Scope (Weeks 1-3)

**Goal:** Validate consolidation pattern with simplest workflow (labeling-unified.yml)

1. **Setup (Days 1-2):**
   - Verify Phase 1 archive integrity
   - Measure baseline GitHub Actions minutes
   - Set up metrics tracking

2. **Foundational (Days 3-4):**
   - Implement 4 composite actions
   - Create workflow testing harness
   - Document consolidation mapping

3. **US1: labeling-unified.yml (Days 5-7):**
   - Consolidate 9 labeling workflows
   - Implement PR/issue labeling logic
   - Validate ≥3 consecutive CI passes
   - Document architecture

**MVP Acceptance Criteria:**

- ✅ labeling-unified.yml functional and passing CI ≥3 times
- ✅ No regression vs archived labeling workflows
- ✅ Metrics show GitHub Actions minutes reduction (even if minimal)
- ✅ Rollback to Phase 1 succeeds
- ✅ Zero cascading failures

### Full Scope (Weeks 4-5)

**Goal:** Complete all 5 unified workflows

1. **US2 & US3 Parallel (Week 4):**
   - validation-unified.yml (12 workflows)
   - testing-unified.yml (8 workflows)
   - These can develop simultaneously

2. **US4 & US5 Sequential (Week 5):**
   - linting-unified.yml (2 workflows)
   - quality-gates.yml (5 utilities)

3. **Integration & Cutover (Days 31+):**
   - Integration testing across all 5 workflows
   - Performance validation (≥15% reduction)
   - Production deployment readiness

### Parallel Execution Paths

**Path A (MVP):** Days 1-7 (setup → foundational → labeling only)
**Path B (Full):** Days 1-21 + integration

- Weeks 1-2: Setup + Foundational + US1 (sequential)
- Week 3: US2 & US3 (parallel after foundational)
- Week 4: US4 + US5 (sequential)
- Days 26+: Integration & Production

**Critical Dependencies:**

```
Setup (T001-T005)
    ↓
Foundational (T006-T014) [BLOCKING]
    ├─→ US1 (T015-T024)
    ├─→ US2 (T025-T036) + US3 (T037-T047) [PARALLEL]
    │   ↓
    ├─→ US4 (T048-T056)
    │   ↓
    └─→ US5 (T057-T068)
        ↓
Integration (T069-T078)
```

---

## Phase Structure & Deliverables

### Phase 1: Setup & Baseline (T001-T005)

**Deliverables:**

- ✅ Phase 1 archive integrity verification
- ✅ GitHub Actions minutes baseline (current: ~2,500/month)
- ✅ Metrics tracking script (measure-actions-minutes.sh)
- ✅ Rollback procedure documentation
- ✅ Consolidation mapping frame (71 workflows → 5 unified)

**Acceptance Criteria:**

- Archive: All 71 workflows present with valid checksums
- Baseline: Metrics recorded for last 30 days
- Scripts: Metrics collection automated and testable
- Documentation: Rollback procedure callable within 15 minutes

### Phase 2: Foundational Infrastructure (T006-T014)

**Deliverables:**

- ✅ 4 Composite actions (apply-labels, validate-check, aggregate-tests, collect-metrics)
- ✅ Workflow test harness (trigger-on-PR testing)
- ✅ Error isolation validation framework
- ✅ Consolidation mapping with 71→5 reference table
- ✅ Per-workflow GitHub Actions minute budgets

**Acceptance Criteria:**

- Composite actions: Callable, idempotent, error-handling validated, ≥80% line coverage
- Test harness: Can trigger all 5 unified workflows on PR event
- Error isolation: Single workflow type failure tested and validated
- Documentation: All composite actions documented with input/output specs
- Budgets: Performance targets set per workflow (total ≤2,125/month)

### Phase 3: US1 — labeling-unified.yml (T015-T024)

**Consolidates:** 9 archived labeling workflows  
**Deliverable:** `.github/workflows/labeling-unified.yml`

**Jobs:**

1. **PR Labeling Job:** Trigger on `pull_request`, apply labels per PR metadata
2. **Issue Labeling Job:** Trigger on `issues`, apply labels per issue type
3. **Scheduled Cleanup Job:** Trigger on schedule, remove stale labels, update metrics

**Acceptance Criteria:**

- ✅ All 9 labeling workflows consolidated into single YAML
- ✅ PR/Issue labeling logic matches archived workflow behavior
- ✅ Labels applied follow `.github/labels.yml` taxonomy with required prefixes
- ✅ Scheduled cleanup removes stale labels (>90 days) per archived behavior
- ✅ Metrics reported: labels applied, cleanup count, GitHub Actions minutes
- ✅ CI passes ≥3 consecutive times on feature branch
- ✅ Rollback to Phase 1 labeling workflows succeeds

**Tests:**

- [ ] T022a: Trigger labeling-unified.yml via PR creation, verify labels applied
- [ ] T022b: Verify no duplicate label application (9 archived patterns deduplicated)
- [ ] T022c: Verify label prefixes match taxonomy (type:, status:, priority:, area:, meta:)
- [ ] T022d: Verify scheduled cleanup removes stale labels

### Phase 4: US2 & US3 — Parallel Validation & Testing (T025-T047)

**Parallel Execution:** Both US2 and US3 can develop simultaneously after Phase 2

#### US2 — validation-unified.yml

**Consolidates:** 12 archived validation workflows  
**Deliverable:** `.github/workflows/validation-unified.yml`

**Jobs (Parallel):**

1. **Branch Naming Validation:** Check `{type}/{scope}-{title}` format
2. **PR Template Validation:** Verify correct template routed, fields populated
3. **Changelog Validation:** Require CHANGELOG.md entry for non-docs PRs
4. **Commit Validation:** Check commit messages, required footers
5. **Secret Scanning:** Run GitHub secret scanning, report findings

**Acceptance Criteria:**

- ✅ All 12 validation workflows consolidated
- ✅ Branch naming validation rejects invalid prefixes (claude/, copilot/, openai/)
- ✅ Failed validations post PR comments with remediation steps
- ✅ Metrics reported: validations run, failures per type, GitHub Actions minutes
- ✅ CI passes ≥3 consecutive times
- ✅ Rollback to Phase 1 validation workflows succeeds

#### US3 — testing-unified.yml

**Consolidates:** 8 archived testing workflows  
**Deliverable:** `.github/workflows/testing-unified.yml`

**Jobs (Parallel):**

1. **Unit Tests:** Run npm test (or language-appropriate), coverage ≥80%
2. **Integration Tests:** Run integration test suite
3. **E2E Tests:** Run E2E tests on staging
4. **Coverage Aggregation:** Merge coverage reports, calculate total

**Acceptance Criteria:**

- ✅ All 8 testing workflows consolidated
- ✅ Unit + Integration + E2E tests run in parallel
- ✅ 100% functional coverage (all critical paths, primary/error/edge cases)
- ✅ Test results and coverage uploaded to artifacts
- ✅ Metrics reported: test execution time, coverage results, failures, GitHub Actions minutes
- ✅ CI passes ≥3 consecutive times with stable results
- ✅ Rollback to Phase 1 testing workflows succeeds

### Phase 5: US4 — linting-unified.yml (T048-T056)

**Consolidates:** 2 archived linting workflows  
**Deliverable:** `.github/workflows/linting-unified.yml`

**Jobs (Parallel):**

1. **JS/TS Linting:** ESLint on shared config from `.github/eslint.config.js`
2. **Markdown Linting:** markdownlint on config from `.markdownlintrc`

**Acceptance Criteria:**

- ✅ Both linting workflows consolidated
- ✅ ESLint and Markdown linting rules deduplicated
- ✅ Linting failures post PR comments with auto-fix suggestions
- ✅ No regressions vs archived workflows
- ✅ CI passes ≥3 consecutive times
- ✅ Rollback to Phase 1 linting workflows succeeds

### Phase 6: US5 — quality-gates.yml (T057-T068)

**Consolidates:** 5 utility workflows (security, compliance, quality)  
**Deliverable:** `.github/workflows/quality-gates.yml`

**Jobs (Parallel):**

1. **SAST Scanning:** CodeQL analysis, fail on critical findings
2. **Dependency Scanning:** npm audit, check for known vulnerabilities
3. **License Compliance:** Check against allowlist at `.github/config/LICENSE_ALLOWLIST.json`
4. **Code Quality Metrics:** Complexity, maintainability index, technical debt
5. **Security Policy:** Validate SECURITY.md exists, required security headers

**Acceptance Criteria:**

- ✅ All 5 utilities consolidated
- ✅ Security scans execute with findings reported to PR
- ✅ License compliance enforced; prohibited licenses rejected
- ✅ Code quality metrics reported with trends
- ✅ CI passes ≥3 consecutive times
- ✅ No new critical vulnerabilities introduced
- ✅ Rollback to Phase 1 utilities succeeds

### Phase 7: Integration & Production Cutover (T069-T078)

**Deliverables:**

- ✅ Integration test suite (all 5 workflows triggered on single PR)
- ✅ Performance validation (≥15% reduction: baseline 2,500 → target 2,125/month)
- ✅ Error isolation validation (single workflow failure doesn't cascade)
- ✅ Rollback procedure tested end-to-end
- ✅ Operations runbook (troubleshooting, recovery, metrics)
- ✅ Phase 2 release notes
- ✅ Production deployment checklist

**Acceptance Criteria:**

- ✅ 3 consecutive integration test cycles pass
- ✅ GitHub Actions minutes reduced ≥15% (≤2,125/month)
- ✅ Zero cascading failures between workflows
- ✅ Rollback to Phase 1 succeeds in <15 minutes
- ✅ All documentation complete and validated
- ✅ Operations team trained on Phase 2 workflows

---

## Constitution Check

**Project Principles** (from CLAUDE.md):

| Principle | Phase 2 Alignment | Validation |
|-----------|------------------|-----------|
| **Branch Naming** | MUST use `refactor/{scope}-{title}` | ✅ Branch: `refactor/workflow-consolidation-phase-2` |
| **UK English** | All documentation and comments in UK English | ✅ Spec/plan use "consolidate", "organisation" |
| **Security** | Validate input, escape output, no secrets | ✅ Metrics scripts, rollback procedures safe |
| **Accessibility** | WCAG 2.2 AA (where applicable) | ⓘ N/A (workflows, not UI) |
| **Performance** | Optimize for GitHub Actions minutes | ✅ Goal: ≥15% reduction |
| **No References Frontmatter** | Use inline links or footer sections | ✅ Spec uses inline links |
| **Label Creation** | ALL labels from `.github/labels.yml` with prefixes | ✅ Consolidation mapping enforces prefix taxonomy |

**Gate Evaluations:**

| Gate | Status | Justification |
|------|--------|---------------|
| **Configuration Locked Files** | ✅ PASS | Phase 2 does not modify `.github/labels.yml`, issue types, or templates |
| **Label Prefixes** | ✅ PASS | labeling-unified.yml enforces prefixed labels from taxonomy |
| **Repository Boundaries** | ✅ PASS | All artifacts in `.github/` or `.github/specs/011-workflow-consolidation-phase-2/` |
| **Security Review** | ⏳ PENDING | Will be evaluated during Phase 7 production cutover |

---

## Risk Mitigation

| Risk | Severity | Mitigation | Owner |
|------|----------|-----------|-------|
| **New failure modes introduced** | Critical | Error isolation testing (T011), ≥3 CI passes per workflow | T059, T066, T072 |
| **Performance target not met** | Critical | Per-workflow budgets (T014), metrics tracking (T009), contingency review | T071 |
| **Rollback fails in production** | Critical | Tested twice (Phase 1 setup + Phase 7 integration), <15min recovery documented | T004, T073 |
| **Cascading workflow failures** | High | Error isolation validation, single-type failure containment | T011 |
| **GitHub Actions minute regression** | High | Parallel job optimization, composite action reuse, metrics monitoring | All phases |
| **Compatibility regression** | High | Archived workflow behavior preservation, no contract changes | Per-US testing |

---

## Success Metrics

### Hard Requirements (Merge Gate)

1. ✅ **All 5 unified workflows passing CI** — ≥3 consecutive runs, 0 failures
2. ✅ **GitHub Actions minutes reduced ≥15%** — Current 2,500/month → Target ≤2,125/month
3. ✅ **Error isolation validated** — Single workflow type failure tested, no cascade
4. ✅ **Rollback tested** — Phase 1 archive restore succeeds, <15 minutes
5. ✅ **Zero cascading failures** — Dependent systems unaffected, no breaking changes

### Soft Goals (Measure Post-Merge)

1. **Maintenance burden reduced 82%** — 71 workflows → 5, ~1,400 lines code → ~700 lines
2. **Team confidence high** — <2 incidents in 4 weeks post-production
3. **Documentation complete** — 12 runbooks, operations guide, troubleshooting guide
4. **Performance stable** — <5% variance in GitHub Actions minutes over 30 days

---

## Technical Decisions Rationale

| Decision | Chosen | Alternative | Why |
|----------|--------|-------------|-----|
| **Consolidation Unit** | Per-workflow-type (5 workflows) | Per-domain (3 workflows) | Cleaner separation of concerns, easier to troubleshoot failures |
| **Composite Action Reuse** | Yes (4 shared actions) | Duplicate logic in each workflow | Reduces duplication, eases maintenance, enforces consistency |
| **Parallel Job Execution** | Maximize parallelization | Sequential execution | Reduces GitHub Actions minutes (critical for 15% target) |
| **Rollback Strategy** | Phase 1 archive restore | Feature flag to archived workflows | Simpler, no feature flag maintenance, instant rollback |
| **Testing Approach** | ≥3 consecutive CI passes | Single pass + staging | Validates stability, catches intermittent failures |
| **Metrics Collection** | GitHub API + custom script | Manual reporting | Automated, repeatable, audit trail for performance claims |

---

## Timeline & Milestones

| Milestone | Target Date | Deliverables | Owner |
|-----------|------------|--------------|-------|
| **MVP Complete** | Oct 7, 2026 | labeling-unified.yml + foundational artifacts | Phase 1-3 |
| **US2/US3 Complete** | Oct 14, 2026 | validation + testing unified workflows | Phase 4 |
| **US4/US5 Complete** | Oct 21, 2026 | linting + quality-gates unified workflows | Phase 5-6 |
| **Integration Pass 1** | Oct 23, 2026 | All 5 workflows passing integration tests | Phase 7 |
| **Performance Validation** | Oct 25, 2026 | ≥15% GitHub Actions minutes reduction verified | Phase 7 |
| **Production Ready** | Oct 28, 2026 | Rollback tested, operations guide complete | Phase 7 |
| **Go-Live** | Oct 31, 2026 | Phase 2 merged to main, monitoring active | Deployment |

---

## Related Documents

- **Specification:** `.github/specs/011-workflow-consolidation-phase-2/spec.md`
- **Tasks:** `.github/specs/011-workflow-consolidation-phase-2/tasks.md`
- **Data Model:** `.github/specs/011-workflow-consolidation-phase-2/data-model.md`
- **Branch Naming Rules:** `CLAUDE.md` § Branch Naming
- **Label Taxonomy:** `.github/labels.yml`
- **Phase 1 Reference:** `.github/workflows/archived/2026-09-11/`
