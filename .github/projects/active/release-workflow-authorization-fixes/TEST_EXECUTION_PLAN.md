---
file_type: documentation
title: ""Release Workflow Authorization Fixes - Test Execution Plan""
description: ""Comprehensive testing strategy to validate the release.yml telemetry non-blocking fix""
created_date: 2026-08-04
last_updated: "2026-08-25"
status: active
---

# Test Execution Plan: Release Workflow Authorization Fixes

## Objective

Validate that the `continue-on-error: true` fix for the `trigger-telemetry` job in `.github/workflows/release.yml` successfully:

1. Allows telemetry logging to run for audit purposes
2. Gracefully handles telemetry authorization failures without blocking workflow
3. Permits lint/test/release jobs to execute normally when telemetry fails
4. Maintains workflow integrity and job dependencies

## Test Strategy

### Phase 1: Dry-Run Test (Non-Destructive)

**Purpose:** Validate workflow structure without executing release actions

**Test Case 1.1: Dry-Run with Default Settings**

```
Trigger: Manual workflow_dispatch
Inputs:
  - version: "" (leave blank, derive from scope)
  - scope: "patch"
  - provider: "shell"
  - dry_run: true (CRITICAL: safety mode)
  - notes_from: "" (empty)

Expected Behavior:
  ✓ trigger-telemetry job runs and outputs authorization status
  ✓ If telemetry fails, workflow continues (continue-on-error: true)
  ✓ lint job executes (should pass)
  ✓ test job executes (should pass)
  ✓ validate-changelog-release job executes (should pass)
  ✓ release job builds dry-run artifacts (no actual commits/tags)
  ✓ Artifacts uploaded: release-dry-run-artefacts/
  ✓ Workflow completes with success status (even if telemetry failed)

Success Criteria:
  - All jobs complete or skip gracefully
  - No jobs blocked by telemetry failure
  - Dry-run artifacts generated and uploaded
  - Logs show telemetry ran and other jobs executed
```

**Test Case 1.2: Verify Conditional Job Dependencies**

```
Verify in workflow logs that:
  ✓ trigger-telemetry completes with continue-on-error: true
  ✓ lint depends on trigger-telemetry with condition: unauthorized_attempts == '0'
  ✓ test depends on trigger-telemetry with condition: unauthorized_attempts == '0'
  ✓ validate-changelog-release depends on trigger-telemetry
  ✓ release depends on [lint, test, validate-changelog-release]

Validate outputs:
  - trigger-telemetry.outputs.unauthorized_attempts captured
  - trigger-telemetry.outputs.is_authorized captured
  - Artifact uploaded: trigger-telemetry.json

Success Criteria:
  - Conditional logic correctly gates downstream jobs
  - All outputs properly captured and passed
```

### Phase 2: Authorization Failure Simulation (Controlled Test)

**Purpose:** Simulate the original telemetry authorization failure to verify graceful handling

**Test Case 2.1: Capture Telemetry Failure Gracefully**

```
Scenario: Telemetry authorization check fails (expected in current state)

Expected Behavior During Failure:
  ✓ trigger-telemetry step runs and logs authorization failure
  ✓ Step exits with non-zero status (failure)
  ✓ continue-on-error: true prevents job failure
  ✓ trigger-telemetry job marked as "success" (not failure)
  ✓ Downstream jobs evaluate their conditions:
    - If condition checks unauthorized_attempts == '0' and telemetry failed:
      → Jobs are skipped (expected)
    - Other jobs without explicit condition checks continue
  ✓ workflow completes normally

Success Criteria:
  - Telemetry failure captured in logs
  - Workflow does NOT fail due to telemetry error
  - Downstream job behavior is correct (skipped if conditioned)
  - Overall workflow status: SUCCESS (even with telemetry failure)
```

### Phase 3: Validation of Job Execution Order

**Purpose:** Verify that job dependencies and execution order are correct

**Test Case 3.1: Lint & Test Execution**

```
Expected Execution Flow:
  1. trigger-telemetry starts and completes
  2. lint job:
     - Waits for: trigger-telemetry
     - Condition: unauthorized_attempts == '0'
     - If unauthorized_attempts > 0: SKIPPED (expected if telemetry failed)
     - If unauthorized_attempts == 0: EXECUTED
  3. test job:
     - Waits for: trigger-telemetry
     - Condition: unauthorized_attempts == '0'
     - Same behavior as lint job

Success Criteria:
  - Job dependency graph is correct
  - Jobs don't execute out of order
  - Conditional skipping works correctly
  - No race conditions or timing issues
```

**Test Case 3.2: Release Job Execution (Dry-Run)**

```
Expected Execution Flow:
  1. validate-changelog-release completes
  2. release job:
     - Waits for: [lint, test, validate-changelog-release]
     - Executes dry-run release (no actual commits/tags)
     - Artifacts uploaded
     - Metrics logged

Success Criteria:
  - release job waits for all dependencies
  - Dry-run mode prevents actual release
  - Artifacts uploaded correctly
  - Preview files generated (if applicable)
```

### Phase 4: Artifact & Logging Validation

**Purpose:** Verify that workflow artifacts and logs are properly captured

**Test Case 4.1: Telemetry Artifact**

```
Expected Artifacts:
  ✓ trigger-telemetry.json uploaded to workflow artifacts
  ✓ Contains:
    - unauthorized_attempts count
    - is_authorized boolean
    - Timestamp
    - GitHub event details

Success Criteria:
  - Artifact generated even if telemetry fails
  - JSON structure valid and complete
  - Artifact retention: 7 days (default)
```

**Test Case 4.2: Workflow Logs**

```
Expected Log Output:
  ✓ trigger-telemetry logs authorization check details
  ✓ Each job logs its execution
  ✓ Conditional job skips logged with reason
  ✓ Errors logged without blocking workflow
  ✓ Final workflow status logged

Success Criteria:
  - Logs are comprehensive and readable
  - Authorization status is clear from logs
  - Job execution flow is traceable
  - No misleading or missing log entries
```

## Execution Schedule

| Phase | Test Case | Status | Date | Notes |
|-------|-----------|--------|------|-------|
| 1 | 1.1 Dry-run | PENDING | 2026-08-04 | Run first: safest test |
| 1 | 1.2 Conditionals | PENDING | 2026-08-04 | Verify after 1.1 |
| 2 | 2.1 Failure Sim | PENDING | 2026-08-04 | Simulate auth failure |
| 3 | 3.1 Job Order | PENDING | 2026-08-04 | Validate execution |
| 3 | 3.2 Release Job | PENDING | 2026-08-04 | Final integration test |
| 4 | 4.1 Artifacts | PENDING | 2026-08-04 | Validate outputs |
| 4 | 4.2 Logs | PENDING | 2026-08-04 | Validate logging |

## Test Execution Instructions

### Manual Workflow Trigger

1. **Go to GitHub Actions**
   - URL: `https://github.com/lightspeedwp/.github/actions/workflows/release.yml`

2. **Click "Run workflow"**
   - Branch: `develop`
   - version: `""` (blank — derive from scope)
   - scope: `patch`
   - provider: `shell`
   - dry_run: `true` ⚠️ CRITICAL: Must be true
   - notes_from: `""` (blank)

3. **Submit and Monitor**
   - Wait for workflow to complete
   - Monitor each job execution
   - Capture logs and artifacts

### Scripted Trigger (Via GitHub CLI)

```bash
gh workflow run release.yml \
  --ref develop \
  -f version="" \
  -f scope="patch" \
  -f provider="shell" \
  -f dry_run="true" \
  -f notes_from=""
```

### Success Indicators (Green Checkmarks)

- ✅ trigger-telemetry job shows green (even if step inside fails)
- ✅ lint job completes (skipped or passed)
- ✅ test job completes (skipped or passed)
- ✅ validate-changelog-release completes
- ✅ release job generates dry-run artifacts
- ✅ Overall workflow status: SUCCESS (green badge)

### Failure Indicators (Red X)

- ❌ trigger-telemetry job marked as failed (should not happen with continue-on-error)
- ❌ Workflow stops before reaching release job
- ❌ Artifacts not uploaded
- ❌ Overall workflow status: FAILURE (red badge)

## Pass/Fail Criteria

**PASS Conditions (Fix is Valid):**

1. ✅ Workflow completes successfully (green status)
2. ✅ trigger-telemetry step fails but job succeeds (continue-on-error works)
3. ✅ Downstream jobs execute normally or skip gracefully
4. ✅ No jobs are unexpectedly blocked
5. ✅ Artifacts are generated and uploaded
6. ✅ Logs clearly show job execution flow

**FAIL Conditions (Fix Needs Revision):**

1. ❌ Workflow fails (red status) due to telemetry error
2. ❌ Downstream jobs are blocked by telemetry failure
3. ❌ Artifacts are not uploaded
4. ❌ Job execution order is incorrect
5. ❌ Conditional logic doesn't work as expected

## Next Steps After Testing

### If Tests PASS

1. ✅ Document test results in `TEST_RESULTS.md`
2. ✅ Close issue #1453 with test results link
3. ✅ Update parent epic #1427 with completion status
4. ✅ Archive project folder (mark as completed)

### If Tests FAIL

1. ⚠️ Document failure details and logs
2. ⚠️ Reopen issue #1453 with new findings
3. ⚠️ Revise fix and re-test
4. ⚠️ Escalate to infrastructure team if needed

## Risk Mitigation

**Risk:** Workflow might actually execute release (creating unwanted tags/commits)  
**Mitigation:** ALWAYS run with `dry_run: true` in test execution

**Risk:** Telemetry authorization issue may have been fixed independently  
**Mitigation:** Check GitHub security audit logs before testing

**Risk:** Job dependencies may have subtle issues  
**Mitigation:** Carefully review logs and job status in real-time

---

**Created:** 2026-08-04  
**Status:** Ready for Execution  
**Owner:** DevOps / Infrastructure Team  
**Related Issue:** #1453  
**Parent Epic:** #1427
