---
name: Execution Playbook
description: Step-by-step implementation guide for workflows consolidation phases
file_type: documentation
metadata:
  status: active
  phase: implementation
---

# Workflows Consolidation — Execution Playbook

## Overview

This playbook provides detailed, step-by-step instructions for implementing each consolidation phase. It includes testing strategies, verification procedures, and rollback plans.

## Phase 1A Execution (COMPLETE)

### Issue #1231: Remove testing.yml

**Status:** ✅ MERGED

**Steps Completed:**

1. ✅ Deleted `.github/workflows/testing.yml`
2. ✅ Verified checks.yml covers all test scenarios
3. ✅ Confirmed no external repo references
4. ✅ Committed and pushed changes
5. ✅ Merged to develop

---

### Issue #1233: Extract Template Validation Helpers

**Status:** ✅ MERGED

**Steps Completed:**

1. ✅ Extracted helper functions to `scripts/validation/template-helpers.cjs`
2. ✅ Created comprehensive test suite (45 tests, >90% coverage)
3. ✅ Updated `validate-pr-template.yml` to import helpers
4. ✅ Updated `template-enforcement.yml` to import helpers
5. ✅ All tests passing (777/777)
6. ✅ Linting and formatting complete
7. ✅ Merged to develop

---

## Phase 1B Execution (READY)

### Issue #1.B.1: Consolidate Changelog Workflows

**Effort:** 8-12 hours
**Dependencies:** Phase 1A complete ✅

#### Planning Steps

1. [ ] Create feature branch: `refactor/changelog-workflow-consolidation`
2. [ ] Review current workflows:
   - `changelog-validate.yml` (validates on PR)
   - `changelog-auto-update.yml` (syncs on merge to develop)
   - `release.yml` (pre-release validation)
3. [ ] Design `changelog-management.yml`:
   - Job 1: Validate (on PR)
   - Job 2: Auto-sync (on merge)
   - Job 3: Pre-release check (on release)

#### Implementation Steps

1. [ ] Create `changelog-management.yml` with 3 conditional jobs
2. [ ] Migrate `changelogUtils.cjs` usage (already shared)
3. [ ] Update `release.yml` to call consolidated workflow
4. [ ] Create integration test suite in `scripts/changelog/__tests__/`
5. [ ] Test changelog validation on sample PR
6. [ ] Test auto-sync on merge to develop
7. [ ] Test pre-release validation
8. [ ] Remove old workflows: `changelog-validate.yml`, `changelog-auto-update.yml`

#### Testing Checklist

- [ ] Unit tests for changelog utilities (existing)
- [ ] Integration test: PR validation fails for missing changelog
- [ ] Integration test: PR validation passes with changelog entry
- [ ] Integration test: Auto-sync updates CHANGELOG.md on merge
- [ ] Integration test: Release validation catches missing changelog
- [ ] Manual test: Create PR with changelog, verify comment
- [ ] Manual test: Merge to develop, verify changelog updated
- [ ] All existing tests still pass: `npm test`

#### Verification

- [ ] New workflow executes correctly
- [ ] Error messages unchanged
- [ ] Performance similar to original (no >20% regression)
- [ ] No breaking changes to validation behavior

---

### Issue #1.B.2: Consolidate Metrics Pipeline

**Effort:** 6-8 hours
**Dependencies:** Phase 1A complete ✅

#### Planning Steps

1. [ ] Create feature branch: `refactor/metrics-workflow-consolidation`
2. [ ] Review current workflows:
   - `metrics.yml` (6 AM) - Collect metrics
   - `metrics-summary.yml` (9 AM) - Aggregate & report
3. [ ] Design `metrics-reporting.yml`:
   - Job 1: Collect (6:00 AM)
   - Job 2: Aggregate (6:05 AM, depends on Job 1)
   - Keep `reporting.yml` separate for ad-hoc

#### Implementation Steps

1. [ ] Create `metrics-reporting.yml` with job dependencies
2. [ ] Set schedule: Both at 6:00 AM, sequential 5-min gap
3. [ ] Update `reporting.yml` for manual use (no change needed)
4. [ ] Create integration tests for metric flow
5. [ ] Test collection job runs
6. [ ] Test aggregation depends on collection
7. [ ] Remove old workflows: `metrics.yml`, `metrics-summary.yml`

#### Testing Checklist

- [ ] Collection job produces expected artifacts
- [ ] Aggregation job waits for collection
- [ ] Timing: Sequential execution, no race conditions
- [ ] Reports generate correctly
- [ ] Metrics posted to correct location
- [ ] No data loss from metrics collection
- [ ] All existing tests still pass: `npm test`

#### Verification

- [ ] Scheduled runs complete successfully
- [ ] No data corruption from metric pipeline
- [ ] Aggregation always has fresh data (no stale reads)
- [ ] Performance: No significant regression

---

## Testing Strategy

### Per-Issue Testing

1. **Pre-Implementation Review**
   - Audit the workflows being consolidated
   - Identify all helper functions and utilities
   - Document current behavior and outputs

2. **Unit Testing**
   - Test all extracted helper functions
   - Cover edge cases and error conditions
   - Target >90% code coverage

3. **Integration Testing**
   - Test the consolidated workflow end-to-end
   - Create actual PRs/issues to verify behavior
   - Verify error messages are unchanged

4. **Performance Testing**
   - Measure workflow duration before/after
   - Ensure no >20% regression
   - Document in issue

5. **Manual Testing**
   - Create sample PR/issue to trigger workflow
   - Verify output and side effects
   - Check error messages and comments

### Quality Assurance Checklist (Per Phase)

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Linting: `npm run lint` passes
- [ ] Formatting: `npm run format` passes
- [ ] No type errors: `npm run type-check` (if applicable)
- [ ] Code coverage: >90% on new code
- [ ] Manual testing: All scenarios verified
- [ ] Documentation: Updated where needed
- [ ] Backwards compatible: Old behavior preserved
- [ ] Performance: No >20% regression

---

## Rollback Procedures

If a consolidation causes issues:

1. **Immediate Rollback (if merged to develop)**
   - Revert the consolidation commit
   - Restore original workflow files
   - Push revert commit to develop
   - Document the failure reason

2. **Investigation**
   - Review error logs and CI output
   - Identify root cause
   - Plan fix before attempting again

3. **Prevention**
   - Add missing test coverage
   - Improve design based on findings
   - Create issue for improved validation

---

## Troubleshooting Guide

### Common Issues

**"Workflow job timeout"**

- Consolidated workflows taking longer than originals
- Mitigation: Check for inefficient serialization of jobs that should be parallel

**"Missing data/functionality"**

- A step was accidentally removed during consolidation
- Prevention: Comprehensive comparison of old vs. new workflow

**"Performance regression"**

- New workflow takes >20% longer than original
- Investigation: Profile the job execution, compare step duration

**"Breaking change in output"**

- Comments, labels, or status changed format
- Prevention: Comprehensive integration testing

---

## Success Criteria

Each phase is considered successful when:

1. ✅ All new tests passing
2. ✅ All existing tests still passing (777/777 for full suite)
3. ✅ Code coverage maintained or improved (>90%)
4. ✅ Manual testing verified successful
5. ✅ No performance regression (>20% threshold)
6. ✅ No breaking changes to external interfaces
7. ✅ Documentation updated
8. ✅ Merged to develop
9. ✅ Issue closed with summary

---

## Timeline & Effort

| Phase | Duration | Effort | Status |
|-------|----------|--------|--------|
| 1A | Week 1 | 4h | ✅ COMPLETE |
| 1B | Weeks 2-3 | 14-20h | ⏳ READY |
| 2 | Weeks 5-8 | 12-16h | 📋 QUEUED |
| 3 | Weeks 5-8 | 6-8h | 📋 QUEUED |
| 4 | Week 12+ | TBD | 📋 FUTURE |

---

**Related:** Epic #1227, Audit Report, Implementation Summary
