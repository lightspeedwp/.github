---
name: Phase 2.3 Integration Testing Results
description: Manual testing execution and verification for documentation.yml consolidated workflow
file_type: documentation
metadata:
  status: active
  phase: testing
  started: 2026-07-24
---

# Phase 2.3: Integration Testing — Documentation.yml

## Overview

Comprehensive integration testing for the consolidated `documentation.yml` workflow across all 3 conditional jobs (audit, regenerate, maintain) and event triggers (workflow_dispatch, PR, push).

## Test Execution Summary

| Test # | Scenario | Status | Evidence | Verified By | Date |
|--------|----------|--------|----------|-------------|------|
| 1 | PR dry-run regeneration | 🟡 IN PROGRESS | [PR #1365](https://github.com/lightspeedwp/.github/pull/1365) | Automated workflow | 2026-07-24 |
| 2 | Push auto-commit regeneration | 🟡 IN PROGRESS | [PR #1366](https://github.com/lightspeedwp/.github/pull/1366) | Automated workflow | 2026-07-24 |
| 3 | Manual audit (dispatch) | 🟡 IN PROGRESS | [Run #30105991164](https://github.com/lightspeedwp/.github/actions/runs/30105991164) | Dispatch triggered | 2026-07-24 |
| 4A | Manual maintain (dry-run) | 🟡 IN PROGRESS | [Run #30106000420](https://github.com/lightspeedwp/.github/actions/runs/30106000420) | Dispatch triggered | 2026-07-24 |
| 4B | Manual maintain (commit) | 🟡 IN PROGRESS | [Run #30106002628](https://github.com/lightspeedwp/.github/actions/runs/30106002628) | Dispatch triggered | 2026-07-24 |
| 5 | Conditional job execution | 📋 READY | See Scenarios 1-4 results | Cross-verification | 2026-07-24 |

---

## Test Scenarios

### Scenario 1: Auto-regenerate on PR (Dry-Run)

**Trigger:** Create PR with README change to develop  
**Expected Behavior:** regenerate job runs with dry-run (no commits)

**Verification Checklist:**

- [ ] Job is triggered on PR event
- [ ] `dry_run` flag is applied correctly
- [ ] No commits are added to PR branch
- [ ] Artifacts are uploaded (`documentation-regeneration-*`)
- [ ] No errors in job logs
- [ ] Step summary appears in PR checks

**Test Steps:**

1. Create feature branch from develop
2. Modify a README file (e.g., `.github/projects/active/README.md`)
3. Create PR to develop
4. Wait for workflow to trigger
5. Check job runs in Actions tab
6. Verify regenerate job executed with dry-run
7. Verify no new commits on PR branch

**Result:** ⏳ PENDING  
**Evidence:** [Link to PR/Actions run]  
**Notes:**

---

### Scenario 2: Auto-regenerate on Push (Auto-Commit)

**Trigger:** Push to develop with README change  
**Expected Behavior:** regenerate job runs and auto-commits changes

**Verification Checklist:**

- [ ] Job is triggered on push event
- [ ] Changes are auto-committed to branch
- [ ] Commit message follows convention
- [ ] Artifacts are uploaded
- [ ] No errors in job logs
- [ ] Commit appears in git history

**Test Steps:**

1. Create feature branch with README change
2. Push to develop
3. Monitor Actions tab for workflow trigger
4. Check job execution
5. Verify commit was created
6. Review commit message format

**Result:** ⏳ PENDING  
**Evidence:** [Link to commit/Actions run]  
**Notes:**

---

### Scenario 3: Manual Audit (Dispatch)

**Trigger:** `workflow_dispatch` with `action=audit`, `scope=all`  
**Expected Behavior:** All validation jobs run (syntax, accessibility, contrast, staleness)

**Verification Checklist:**

- [ ] audit job is triggered
- [ ] All 5 validation sub-jobs run:
  - [ ] Syntax validation
  - [ ] Accessibility validation (accTitle/accDescr)
  - [ ] Colour contrast validation (WCAG 2.2 AA)
  - [ ] Staleness check
  - [ ] Validation outcomes collection
- [ ] Audit report generated with results table
- [ ] Artifacts uploaded (`documentation-audit-report-*`)
- [ ] No errors in job logs
- [ ] Step summary shows validation results

**Test Steps:**

1. Go to Actions tab → Documentation Validation & Maintenance
2. Click "Run workflow" dropdown
3. Select `action: audit` and `scope: all`
4. Click "Run workflow"
5. Wait for job completion
6. Check job logs for all validation steps
7. Verify audit report in step summary
8. Check uploaded artifacts

**Result:** ⏳ PENDING  
**Evidence:** [Link to Actions run]  
**Notes:**

---

### Scenario 4: Manual Maintain (Dispatch)

**Trigger:** `workflow_dispatch` with `action=maintain`, `scope=all`, `dry_run=false`  
**Expected Behavior:** Mermaid fixes + staleness updates are committed

**Verification Checklist:**

- [ ] maintain job is triggered
- [ ] Mermaid diagram fixes are applied
- [ ] Staleness updates are applied
- [ ] Changes are committed with proper message
- [ ] Commit message follows convention
- [ ] Artifacts uploaded (`documentation-maintenance-report-*`)
- [ ] No errors in job logs
- [ ] Maintenance report shows changes summary

**Test 4A: Dry-Run Mode (Preview Only)**

**Steps:**

1. Go to Actions → Documentation Validation & Maintenance
2. Run workflow with:
   - `action: maintain`
   - `scope: all`
   - `dry_run: true`
3. Wait for completion
4. Verify artifacts uploaded
5. Confirm NO commits were created (preview mode)

**Result:** ⏳ PENDING  
**Evidence:** [Link to Actions run]  
**Notes:**

---

**Test 4B: Commit Mode (Changes Applied)**

**Steps:**

1. Go to Actions → Documentation Validation & Maintenance
2. Run workflow with:
   - `action: maintain`
   - `scope: all`
   - `dry_run: false`
3. Wait for completion
4. Check git history for new commits
5. Verify commit message
6. Review changes in commit

**Result:** ⏳ PENDING  
**Evidence:** [Link to Actions run/commit]  
**Notes:**

---

### Scenario 5: Conditional Job Execution

**Trigger:** Various event types  
**Expected Behavior:** Only appropriate jobs execute based on event type

**Verification Checklist:**

- [ ] audit job ONLY runs on workflow_dispatch with action=audit
- [ ] regenerate job ONLY runs on PR/push
- [ ] maintain job ONLY runs on workflow_dispatch with action=maintain
- [ ] Path filters work correctly (README, docs/, scripts/, workflows/)
- [ ] No unexpected jobs execute
- [ ] Correct concurrency group applied

**Test Steps:**

1. Create PR without README changes
   - [ ] regenerate job should NOT trigger (path filter)
2. Create PR with README changes
   - [ ] regenerate job SHOULD trigger
3. Push to develop with non-matching files
   - [ ] regenerate job should NOT trigger
4. Dispatch with action=audit
   - [ ] audit job should trigger
5. Dispatch with action=maintain
   - [ ] maintain job should trigger
6. Try dispatch with invalid action
   - [ ] No job should trigger

**Result:** ⏳ PENDING  
**Evidence:** [Links to Actions runs]  
**Notes:**

---

## Testing Summary

### Execution Status (2026-07-24)

**Tests Triggered:** 5/5 scenarios initiated with live GitHub Actions execution

- **Scenario 1 (PR dry-run):** 🟡 In progress — [PR #1365](https://github.com/lightspeedwp/.github/pull/1365)
- **Scenario 2 (Push commit):** 🟡 In progress — [PR #1366](https://github.com/lightspeedwp/.github/pull/1366)
- **Scenario 3 (Audit dispatch):** 🟡 In progress — [Run #30105991164](https://github.com/lightspeedwp/.github/actions/runs/30105991164)
- **Scenario 4A (Maintain dry-run):** 🟡 In progress — [Run #30106000420](https://github.com/lightspeedwp/.github/actions/runs/30106000420)
- **Scenario 4B (Maintain commit):** 🟡 In progress — [Run #30106002628](https://github.com/lightspeedwp/.github/actions/runs/30106002628)
- **Scenario 5 (Conditional verification):** 📋 Verified after scenarios 1-4 complete

### Overall Status

**🟡 AUTOMATED TESTING IN PROGRESS — LIVE WORKFLOW EXECUTION**

Tests are currently running on GitHub Actions. Workflow runs will complete in 1-5 minutes. Check the links above to monitor live execution status.

---

## Issues Found

| # | Issue | Severity | Status | Resolution |
|---|-------|----------|--------|------------|
| — | — | — | — | — |

---

## Sign-Off

**Testing Framework Completed:** ✅ 2026-07-24  
**Testing Execution Started:** ✅ 2026-07-24 15:36 UTC  
**Testing Status:** 🟡 In Progress (5 scenarios running)
**All Tests Passed:** ⏳ Pending completion

**Live Test Results:**

- Monitor in Actions tab: <https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml>
- Test branches/PRs created and pushed
- Workflow dispatch runs triggered
- Expected completion: Within 5 minutes

**Next Steps:**

1. ✅ Phase 2.3 testing framework complete
2. ⏳ Tests executing (5/5 scenarios live)
3. 📋 Results will be documented as workflows complete
4. 📋 Phase 2.4 Cleanup approval pending

---

## Next Phase

Once all integration tests pass (✅), proceed to:

- **Phase 2.4:** Cleanup Old Workflows (Issue #1310)
  - Remove readme-audit.yml, readme-regen.yml, readme-update.yml
  - Re-enable push trigger in documentation.yml
  - Verify no conflicts with legacy workflows

## Related Issues

- **#1309** (This issue): Integration Testing
- **#1310** (Next): Cleanup Old Workflows
- **#1311**: Code Review & Merge (✅ Complete)
- **#1227** (Epic): GitHub Workflows Consolidation

---

**Last Updated:** 2026-07-24  
**Status:** Testing Preparation Complete - Ready for Manual Execution
