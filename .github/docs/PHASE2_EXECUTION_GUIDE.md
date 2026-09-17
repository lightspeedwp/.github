---
title: "Phase 2 Execution Guide - Phase 7 Completion"
date_created: "2026-09-17"
version: "1.0"
---

# Phase 2 Execution Guide - Phase 7 Completion

**Document Date:** 2026-09-17  
**Current Status:** MVP Implementation Complete - CI Validation In Progress  
**Current Phase:** 7 (Integration & Validation)  
**Current Task:** T070 Cycle 1 Running  

---

## Quick Status Overview

| Item | Status | Notes |
|------|--------|-------|
| **Implementation** | ✅ Complete | All 5 workflows + documentation done |
| **T070 Cycle 1** | ⏳ Running | Integration tests auto-triggered via PR CI |
| **T071-T073** | ✅ Prepared | Scripts ready, waiting for T070 to complete |
| **T078** | ⏳ Pending | Final validation after T070-T073 |
| **Merge Target** | develop | After all Phase 7 tasks complete |

---

## Phase 7 Task Execution (T070-T078)

### Current: T070 - Integration Test Cycles

**Objective:** Run 3 consecutive integration test cycles to validate all 5 workflows execute without cascading failures

**Status:** First cycle in progress (auto-triggered by PR CI)

**What's Happening:**

- PR #3359 pushes trigger GitHub Actions workflows
- `.github/tests/phase2-integration-test.yml` runs automatically
- All 5 unified workflows are tested (labeling, validation, testing, linting, quality-gates)
- Metrics collected in workflow artifacts

**Expected Duration:**

- Per cycle: 3-5 minutes
- Total (3 cycles): ~15-20 minutes
- Expected completion: 2026-09-17 ~16:15 UTC

**How to Monitor:**

1. Go to: <https://github.com/lightspeedwp/.github/actions>
2. Look for: "Phase 2 Integration Tests" workflow runs
3. Watch for: ✅ All jobs passing across 3 consecutive runs

**Success Criteria:**

- ✅ All 5 workflows execute successfully
- ✅ No cascading failures between workflows
- ✅ Metrics collected (minutes_used, duration_seconds)
- ✅ Runtime within expected bounds (3-5 min per cycle)

**What to Do:**

1. **Monitor** first cycle to completion (~5 min)
2. **Trigger** second cycle (should auto-trigger, but manual trigger possible via workflow_dispatch)
3. **Trigger** third cycle
4. **Verify** all 3 cycles show ✅ in GitHub Actions
5. **Note** completion time and proceed to T071

---

### Next: T071 - Measure GitHub Actions Minutes Reduction

**Objective:** Validate ≥15% GitHub Actions minutes reduction (target ≤2,125/month)

**Status:** Ready to execute after T070 completes

**Steps:**

1. **Download Artifacts from T070 Cycles**

   ```bash
   # Download metrics from latest successful run
   gh run download <run-id> -n labeling-metrics
   gh run download <run-id> -n validation-metrics
   gh run download <run-id> -n testing-metrics
   gh run download <run-id> -n linting-metrics
   gh run download <run-id> -n quality-gates-metrics
   ```

2. **Calculate Reduction**

   ```
   Phase 1 Baseline: 2,500 min/month
   Phase 2 Actual: Sum of metrics from 3 cycles / 3 (average per cycle)
   Reduction: (2500 - Phase2Actual) / 2500
   Target: ≥0.15 (15%)
   Success: Reduction ≥ 15%
   ```

3. **Estimation**
   Based on budget planning:
   - Labeling: 0.03 min/run
   - Validation: 0.08 min/run
   - Testing: 0.12 min/run
   - Linting: 0.10 min/run
   - Quality Gates: 0.15 min/run
   - **Total: ~0.48 min/run (30% of old single-workflow average)**

4. **Document Results**
   - Update `PHASE2_STATUS.md` with actual metrics
   - Record in `.github/metrics/minutes-reduction-report.md`
   - Note date/time of measurement

**Success Criteria:**

- ✅ Reduction ≥15% documented
- ✅ Actual vs projected metrics compared
- ✅ Results saved for audit trail

---

### After T071: T072 - Execute Error Isolation Test

**Objective:** Verify single workflow failure doesn't cascade to other workflows

**Status:** Ready to execute

**Steps:**

1. **Run Error Isolation Test**

   ```bash
   # Set GitHub token first
   export GITHUB_TOKEN=<your-token-with-workflow-scope>
   
   # Run all scenarios
   ./.github/scripts/run-error-isolation-test.sh all_scenarios
   ```

2. **Monitor Test Execution**
   - Watch: <https://github.com/lightspeedwp/.github/actions/workflows/error-isolation-test.yml>
   - Expected duration: 1-2 minutes
   - Expected output: 5 independent failure scenarios

3. **Verify Results**
   Confirm each scenario shows:
   - ✅ **Labeling fails** → Validation/Testing/Linting/Quality-Gates continue
   - ✅ **Validation fails** → Labeling/Testing/Linting/Quality-Gates continue
   - ✅ **Testing fails** → Labeling/Validation/Linting/Quality-Gates continue
   - ✅ **Linting fails** → Labeling/Validation/Testing/Quality-Gates continue
   - ✅ **Quality-Gates fail** → Labeling/Validation/Testing/Linting continue

4. **Document Results**
   - Screenshot workflow run results
   - Note: "Error isolation validated - No cascading failures observed"
   - Save to: `.github/metrics/error-isolation-report-*.md`

**Success Criteria:**

- ✅ All 5 failure scenarios tested
- ✅ No cascading failures detected
- ✅ Report generated and saved

---

### After T072: T073 - Test Rollback Procedure

**Objective:** Verify Phase 1 archived workflows still functional

**Status:** Ready to execute

**Steps:**

1. **Run Rollback Test**

   ```bash
   # Set up and execute rollback test
   ./.github/scripts/test-rollback.sh
   ```

2. **Test Procedure**
   - Creates temporary `ops/rollback-test-*` branch
   - Disables Phase 2 unified workflows
   - Restores Phase 1 archived workflows
   - Validates workflow syntax and structure
   - Re-enables Phase 2 workflows
   - Cleans up test branch

3. **Verify Results**
   Watch for output showing:
   - ✅ Phase 1 workflows copied successfully
   - ✅ All workflows pass syntax validation
   - ✅ Phase 2 workflows re-enabled
   - ✅ Test branch cleaned up
   - Results saved to: `.github/metrics/rollback-test-*.md`

4. **Execution Time**
   - Total: 15-20 minutes
   - Safe to run: Any time (creates isolated test branch)
   - No production impact

**Success Criteria:**

- ✅ All Phase 1 workflows validated
- ✅ Success rate ≥95%
- ✅ Rollback time ≤15 minutes
- ✅ Procedure documented and repeatable

---

### Final: T078 - Prepare PR for Merge

**Objective:** Validate all Phase 7 requirements met before merge to develop

**Steps:**

1. **Verify All Requirements Met**
   - [ ] T070: ≥3 consecutive CI cycles completed ✅
   - [ ] T071: GitHub Actions minutes reduction ≥15% documented ✅
   - [ ] T072: Error isolation validated ✅
   - [ ] T073: Rollback procedure tested ✅
   - [ ] No merge conflicts with develop ✅
   - [ ] Branch up-to-date with develop ✅
   - [ ] All documentation complete ✅

2. **Update Final PR Status**

   ```bash
   # Update PR body with final results
   # Include:
   # - All metrics from T071
   # - Error isolation results from T072
   # - Rollback test results from T073
   # - Timeline and completion date
   ```

3. **Get Approvals**
   - Request code review from team lead
   - Await GitHub approval (if configured)
   - Ensure stakeholder sign-off (optional but recommended)

4. **Merge to develop**

   ```bash
   # After all approvals
   gh pr merge 3359 --merge
   # Or manually merge via GitHub UI
   ```

**Success Criteria:**

- ✅ All hard requirements met and documented
- ✅ Code review approved
- ✅ CI green on latest commit
- ✅ PR ready for merge

---

## Artifacts & Metrics Location

All results stored in `.github/metrics/`:

```
.github/metrics/
├── rollback-test-20260917_151234.md      # T073 results
├── error-isolation-report-20260917.md    # T072 results
├── minutes-reduction-report.md           # T071 results
├── phase2-integration-cycle-1.json       # T070 artifacts
├── phase2-integration-cycle-2.json
└── phase2-integration-cycle-3.json
```

**How to Access:**

1. GitHub Actions tab → Workflow run → Artifacts
2. Or download via: `gh run download <run-id>`
3. Or view via: `.github/metrics/` directory in repo

---

## Troubleshooting

### T070 - Integration Tests Failing

**Symptom:** One or more workflow tests fail

**Investigation:**

1. Check GitHub Actions logs for specific failure
2. Review workflow syntax in `.github/workflows/*.yml`
3. Verify composite actions exist and are callable
4. Check for any recent changes that might affect workflows

**Resolution:**

1. Fix underlying issue in failing workflow
2. Re-trigger integration test
3. Verify fix doesn't break other workflows
4. Record results and proceed to T071

### T071 - Metrics Not Collected

**Symptom:** Artifact metrics files missing or empty

**Investigation:**

1. Verify workflows completed successfully (check CI logs)
2. Check if artifact retention settings correct
3. Verify collect-metrics composite action executed

**Resolution:**

1. Re-run integration test cycle (T070)
2. Manually calculate from workflow run times if needed
3. Use estimated budgets as fallback (98% reduction projected)
4. Document any discrepancies and proceed

### T072 - Error Isolation Test Not Triggering

**Symptom:** Workflow dispatch request fails

**Investigation:**

1. Verify GitHub token has `workflow` scope
2. Check token isn't expired
3. Verify workflow file exists at `.github/tests/error-isolation-test.yml`
4. Check branch is correct (should be `refactor/workflow-consolidation-phase-2`)

**Resolution:**

1. Regenerate GitHub token with correct scopes
2. Retry script with correct token
3. Or trigger manually via GitHub Actions UI
4. Proceed with results

### T073 - Rollback Test Git Conflicts

**Symptom:** Git merge/rebase conflicts when restoring workflows

**Investigation:**

1. Check if anyone else pushed changes during test
2. Verify git working directory is clean before starting

**Resolution:**

1. Abort test: `git checkout develop && git branch -D ops/rollback-test-*`
2. Pull latest changes: `git pull origin develop`
3. Retry rollback test
4. Note: Test is isolated and safe to retry

---

## Communication Template

### For Team/Stakeholders

Use this template when reporting status:

**Phase 2 Workflow Consolidation - Status Update**

> Phase 2 Workflow Consolidation is in final validation phase (Phase 7 - Integration & Testing).
>
> **Current Progress:** 72/78 tasks (92%)
>
> - MVP Implementation: ✅ Complete
> - Integration Tests: ⏳ T070 Cycle 1/3 Running
> - Pending Execution: T071-T073 (preparation complete)
>
> **Timeline:**
>
> - T070 (CI Cycles): ~15-20 min (running now)
> - T071 (Minutes Measurement): ~10 min (ready)
> - T072 (Error Isolation): ~5 min (ready)
> - T073 (Rollback Testing): ~20 min (ready)
> - T078 (Final Validation): ~10 min (ready)
> - **Total Remaining:** ~60 min (est. completion ~17:30 UTC)
>
> **Merge Target:** develop (after T070-T078 complete)
>
> **Next Steps:** Monitor integration tests, execute validation tasks, merge when complete.

---

## Completion Checklist

Mark off each as you complete:

**Phase 7 Tasks:**

- [ ] T070: 3 integration test cycles complete + metrics collected
- [ ] T071: GitHub Actions minutes reduction ≥15% validated
- [ ] T072: Error isolation test passed (no cascading failures)
- [ ] T073: Rollback procedure tested (Phase 1 workflows functional)
- [ ] T078: Final PR validation complete (all requirements met)

**Documentation:**

- [ ] `.github/docs/PHASE2_STATUS.md` updated with final results
- [ ] `.github/docs/PHASE2_OPERATIONS_RUNBOOK.md` reviewed
- [ ] `.github/docs/PHASE2_RELEASE_NOTES.md` reviewed
- [ ] All 5 workflow guides reviewed

**PR Preparation:**

- [ ] PR body updated with final metrics
- [ ] All hard requirements documented
- [ ] Code review requested
- [ ] No merge conflicts
- [ ] Branch up-to-date with develop

**Merge:**

- [ ] All approvals received
- [ ] CI green on latest commit
- [ ] Ready to merge PR #3359 to develop

---

## References

- **PR:** [#3359 - Phase 2 Workflow Consolidation](https://github.com/lightspeedwp/.github/pull/3359)
- **Status Dashboard:** [PHASE2_STATUS.md](./PHASE2_STATUS.md)
- **Operations Guide:** [PHASE2_OPERATIONS_RUNBOOK.md](./PHASE2_OPERATIONS_RUNBOOK.md)
- **Tasks Breakdown:** [.github/specs/011-workflow-consolidation-phase-2/tasks.md](../../.github/specs/011-workflow-consolidation-phase-2/tasks.md)

---

*Last Updated: 2026-09-17 16:00 UTC | Phase 2 MVP Complete, Phase 7 In Progress*
