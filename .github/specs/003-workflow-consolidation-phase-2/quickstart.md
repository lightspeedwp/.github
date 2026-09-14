---
title: "Phase 2 Quickstart & Validation Guide"
date_created: "2026-09-14"
---

# Phase 2 Quickstart & Validation Guide

**Purpose:** Validate Phase 2 implementation by running end-to-end scenarios that prove each unified workflow functions correctly.

**Prerequisites:**
- Feature branch: `refactor/workflow-consolidation-phase-2` (checked out)
- Phase 1 archive verified: `.github/workflows/archived/2026-09-11/` (all 71 workflows present)
- GitHub Actions enabled on repository
- Permissions: Author of test PRs, ability to trigger workflows

---

## Phase 0: Baseline Measurement

**Scenario:** Establish current GitHub Actions minute baseline

**Steps:**
1. Run metrics baseline script:
   ```bash
   .github/scripts/measure-actions-minutes.sh --baseline --output BASELINE_METRICS.md
   ```
2. Record output in `BASELINE_METRICS.md`
3. Verify output contains: current 30-day total, daily average, per-workflow breakdown

**Expected Outcome:**
- Baseline recorded: ~2,500 GitHub Actions minutes/month
- Script output validates current metric collection works
- Baseline saved for comparison post-Phase 2

**Validation Tests:**
- [ ] Script executes without errors
- [ ] Metrics output shows >0 minutes
- [ ] Output shows per-workflow breakdown (at least 5 categories)
- [ ] Timestamp recorded for audit trail

---

## Phase 1: Foundational Infrastructure

**Scenario:** Validate composite actions and test harness work

**Steps:**

### Test Composite Actions

1. **Test apply-labels composite action:**
   ```bash
   gh workflow run validate-composite-actions.yml \
     --ref refactor/workflow-consolidation-phase-2 \
     -f action=apply-labels \
     -f labels='["type:bug","priority:high"]'
   ```
2. Verify workflow completes without error
3. Check composite action output contains applied labels

2. **Test validate-check composite action:**
   ```bash
   gh workflow run validate-composite-actions.yml \
     --ref refactor/workflow-consolidation-phase-2 \
     -f action=validate-check \
     -f check_name="test-validation" \
     -f check_status="success"
   ```
3. Verify check status reported correctly

3. **Test aggregate-tests composite action:**
   ```bash
   gh workflow run validate-composite-actions.yml \
     --ref refactor/workflow-consolidation-phase-2 \
     -f action=aggregate-tests \
     -f test_results='{"total": 10, "passed": 10}'
   ```
4. Verify test aggregation calculates correctly

4. **Test collect-metrics composite action:**
   ```bash
   gh workflow run validate-composite-actions.yml \
     --ref refactor/workflow-consolidation-phase-2 \
     -f action=collect-metrics \
     -f workflow_name="labeling-unified"
   ```
5. Verify metrics collection reports minutes consumed

### Test Workflow Harness

1. Create test PR on feature branch:
   ```bash
   git checkout -b test/phase2-workflow-harness
   echo "Test content" > TEST_HARNESS.md
   git add TEST_HARNESS.md
   git commit -m "test: Phase 2 workflow harness validation"
   git push origin test/phase2-workflow-harness
   
   gh pr create --title "test: Phase 2 workflow harness" \
     --body "Validates workflow test harness on PR event"
   ```

2. Trigger workflow test harness:
   ```bash
   gh workflow run workflow-harness.yml \
     --ref refactor/workflow-consolidation-phase-2 \
     -f test_trigger="on_pr_event"
   ```

3. Wait for workflow completion (should be <2 minutes)

**Expected Outcome:**
- All 4 composite actions callable and functional
- Workflow test harness triggers on PR event without error
- Metrics reported per workflow type

**Validation Tests:**
- [ ] apply-labels: Labels applied correctly
- [ ] validate-check: Check status reported to GitHub
- [ ] aggregate-tests: Test counts aggregated correctly
- [ ] collect-metrics: GitHub Actions minutes reported
- [ ] Test harness: Triggers on PR, completes in <2 minutes

---

## Phase 3: labeling-unified.yml (MVP Validation)

**Scenario:** Validate labeling-unified.yml functions end-to-end

**Test 1: PR Labeling**

1. Create test PR with feature branch pattern:
   ```bash
   git checkout -b feat/test-labeling-workflow
   echo "# Test PR for labeling validation" > PR_TEST.md
   git add PR_TEST.md
   git commit -m "feat: Test labeling workflow consolidation"
   git push origin feat/test-labeling-workflow
   
   gh pr create --title "feat: Test labeling workflow consolidation" \
     --body "Validates labeling-unified.yml applies correct labels on PR creation"
   ```

2. Wait for labeling-unified.yml to trigger (should auto-trigger on PR open)

3. Verify labels applied:
   ```bash
   gh pr view test-labeling-workflow \
     --json labels --template '{{.labels}}'
   ```

**Expected Labels:**
- `type:feature` (mapped from feat/ branch prefix)
- `area:ci` (or appropriate area based on file changes)
- `status:needs-triage` (initial status)

**Test 2: Issue Labeling**

1. Create test issue:
   ```bash
   gh issue create --title "test: Validate issue labeling" \
     --body "Validates labeling-unified.yml applies correct labels on issue creation" \
     --label "type:task"
   ```

2. Wait for labeling workflow to trigger

3. Verify labels applied:
   ```bash
   gh issue view test-validate-issue-labeling --json labels
   ```

**Test 3: Scheduled Label Cleanup**

1. Verify scheduled cleanup job is configured in labeling-unified.yml:
   ```bash
   grep -A 5 "on.schedule" .github/workflows/labeling-unified.yml
   ```

2. Expected: Job configured to run daily/weekly, removes labels >90 days old

**Test 4: Metrics Reporting**

1. Check labeling-unified.yml workflow metrics:
   ```bash
   gh workflow view labeling-unified.yml --json jobRuns
   ```

2. Verify metrics artifact contains:
   - Labels applied count
   - Cleanup count
   - GitHub Actions minutes consumed

**Expected Outcome:**
- labeling-unified.yml triggers on PR/issue creation
- Correct labels applied per `.github/labels.yml` taxonomy
- Scheduled cleanup configured
- Metrics reported successfully

**Validation Tests:**
- [ ] PR created → labeling-unified.yml triggered within 30 seconds
- [ ] PR labels include type: + area: prefixed labels
- [ ] Issue created → labeling-unified.yml triggered
- [ ] Issue labels applied correctly
- [ ] Scheduled cleanup job configured with correct trigger
- [ ] Metrics artifact generated with counts

---

## Phase 4: validation-unified.yml Validation

**Scenario:** Validate branch naming, PR template, and changelog validations

**Test 1: Branch Naming Validation**

1. Create PR with INVALID branch name (should fail validation):
   ```bash
   git checkout -b claude/invalid-branch-name  # INVALID!
   echo "Test" > invalid.md
   git add invalid.md
   git commit -m "test: Invalid branch name"
   git push origin claude/invalid-branch-name
   
   gh pr create --title "test: Invalid branch name" \
     --body "Should trigger branch naming validation failure"
   ```

2. Wait for validation-unified.yml to run

3. Verify validation fails and PR comment posted:
   ```bash
   gh pr view invalid-branch --json comments
   ```

4. Expected comment: "Branch name does not match pattern {type}/{scope}-{title}"

5. Create PR with VALID branch name:
   ```bash
   git checkout -b fix/test-branch-naming-validation
   echo "Test" > valid.md
   git add valid.md
   git commit -m "test: Valid branch name"
   git push origin fix/test-branch-naming-validation
   
   gh pr create --title "test: Valid branch name" \
     --body "Should pass branch naming validation"
   ```

6. Verify validation passes (no comment, check passes)

**Test 2: PR Template Validation**

1. Create PR without following template format:
   ```bash
   gh pr create --title "test: Missing PR template fields" \
     --body "This is incomplete PR description without template" \
     --base develop
   ```

2. Verify validation fails with comment pointing to template

3. Create PR following template format:
   ```bash
   gh pr create --title "test: Valid PR template" \
     --body "## Summary
   - Validates PR template routing
   
   ## Test plan
   - [ ] Manual testing completed
   " \
     --base develop
   ```

4. Verify validation passes

**Test 3: Changelog Validation**

1. Create PR modifying code WITHOUT changelog entry:
   ```bash
   git checkout -b test/changelog-validation
   echo "// Code change" > src/test.js
   git add src/test.js
   git commit -m "test: Code change without CHANGELOG entry"
   git push origin test/changelog-validation
   
   gh pr create --title "test: Code change" \
     --body "Should fail changelog validation (no CHANGELOG.md entry)"
   ```

2. Verify validation fails: "PR modifies code but no CHANGELOG.md entry found"

3. Update PR to include changelog:
   ```bash
   echo "## [Unreleased]
   - Added test validation" >> CHANGELOG.md
   git add CHANGELOG.md
   git commit -m "docs: Add CHANGELOG entry"
   git push origin test/changelog-validation
   ```

4. Verify validation now passes

**Expected Outcome:**
- Branch naming validation enforces `{type}/{scope}-{title}` format
- Invalid branches (claude/, copilot/, openai/) rejected with comment
- PR template validation checks required fields
- Changelog validation enforces entry for code changes
- Validation failures post PR comments with remediation steps

**Validation Tests:**
- [ ] Invalid branch name → validation fails with comment
- [ ] Valid branch name → validation passes
- [ ] Missing PR template fields → validation fails
- [ ] Valid PR template → validation passes
- [ ] Code change without changelog → validation fails
- [ ] Code change with changelog → validation passes

---

## Phase 4: testing-unified.yml Validation

**Scenario:** Validate test orchestration and coverage reporting

**Test 1: Unit Test Execution**

1. Create test PR with passing tests:
   ```bash
   git checkout -b test/unit-tests-passing
   echo "// Unit test" > src/__tests__/test.js
   git add src/__tests__/test.js
   git commit -m "test: Add unit tests"
   git push origin test/unit-tests-passing
   ```

2. Wait for testing-unified.yml to trigger (on push/PR)

3. Verify unit tests run and pass:
   ```bash
   gh workflow view testing-unified.yml --json jobRuns
   ```

**Test 2: Integration Test Execution**

1. Create PR that includes integration tests:
   ```bash
   git checkout -b test/integration-tests
   echo "// Integration test" > tests/integration/test.js
   git add tests/integration/test.js
   git commit -m "test: Add integration tests"
   git push origin test/integration-tests
   ```

2. Verify integration tests run in parallel with unit tests

**Test 3: Coverage Reporting**

1. Verify coverage artifact generated:
   ```bash
   gh run view <run-id> --json artifacts
   ```

2. Expected artifact: `coverage-report` with ≥80% coverage

**Test 4: Coverage Failure**

1. Create test PR with low coverage (<80%):
   ```bash
   git checkout -b test/low-coverage
   echo "// Uncovered code" > src/new-feature.js
   git add src/new-feature.js
   git commit -m "feat: New feature with low coverage"
   git push origin test/low-coverage
   ```

2. Verify testing-unified.yml fails: "Coverage 65% < 80% minimum"

**Expected Outcome:**
- Unit, integration, and E2E tests run in parallel
- Coverage ≥80% enforced
- Test artifacts generated and uploaded
- Coverage failures block PR merge

**Validation Tests:**
- [ ] Unit tests trigger on push/PR
- [ ] Integration tests run in parallel
- [ ] Coverage ≥80% passes
- [ ] Coverage <80% fails with comment
- [ ] Test artifacts uploaded

---

## Phase 7: Integration Testing

**Scenario:** Validate all 5 unified workflows together

**Full Integration Test PR:**

1. Create comprehensive test PR that touches all areas:
   ```bash
   git checkout -b test/phase2-full-integration
   
   # Add code changes (triggers testing-unified.yml)
   echo "// Feature" > src/feature.js
   
   # Add tests (triggers testing-unified.yml)
   echo "test('feature', () => {})" > src/__tests__/feature.test.js
   
   # Add markdown (triggers linting-unified.yml)
   echo "# Feature Doc" > docs/FEATURE.md
   
   # Update CHANGELOG (required by validation-unified.yml)
   echo "- Added feature" >> CHANGELOG.md
   
   git add .
   git commit -m "feat: Phase 2 integration test
   
   - Add feature code
   - Add unit tests
   - Add documentation
   - Update CHANGELOG
   
   Triggers all 5 unified workflows"
   git push origin test/phase2-full-integration
   ```

2. Create PR:
   ```bash
   gh pr create --title "test: Phase 2 full integration" \
     --body "## Summary
   - Tests all 5 unified workflows together
   
   ## Test plan
   - [ ] labeling-unified.yml triggers and applies labels
   - [ ] validation-unified.yml passes (branch name, PR template, changelog)
   - [ ] testing-unified.yml runs and coverage ≥80%
   - [ ] linting-unified.yml passes
   - [ ] quality-gates.yml passes (no vulnerabilities)
   "
   ```

3. Wait for all workflows to complete (should be <5 minutes total)

4. Verify all 5 workflows passed:
   ```bash
   gh pr view test-phase2-full-integration --json statusCheckRollup
   ```

**Expected Status Checks:**
- ✅ labeling-unified
- ✅ validation-unified
- ✅ testing-unified
- ✅ linting-unified
- ✅ quality-gates

**Expected Outcome:**
- All 5 unified workflows trigger on single PR event
- No cascading failures (if one fails, others not blocked)
- PR can merge only when all pass
- Metrics show ~2,125 minutes/month (≤15% reduction from baseline 2,500)

**Validation Tests:**
- [ ] All 5 workflows trigger within 30 seconds
- [ ] All 5 workflows complete <5 minutes total
- [ ] No cascading failures
- [ ] PR merge blocked until all checks pass
- [ ] Metrics show ≥15% reduction

---

## Performance Validation

**Scenario:** Verify GitHub Actions minutes reduction ≥15%

**Steps:**

1. Run integration tests 3 times on feature branch:
   ```bash
   for i in {1..3}; do
     gh pr create --title "test: Performance validation run $i" \
       --body "Run $i of performance validation"
     # Wait for all workflows
     sleep 300
     gh pr view performance-validation-run-$i --json statusCheckRollup
   done
   ```

2. Collect metrics after each run:
   ```bash
   .github/scripts/measure-actions-minutes.sh --current --output CURRENT_METRICS.md
   ```

3. Calculate reduction:
   ```bash
   # Formula: (Baseline - Current) / Baseline × 100
   # Example: (2500 - 2100) / 2500 × 100 = 16% reduction ✅
   ```

4. Verify ≥15% reduction achieved:
   ```bash
   echo "Baseline: 2,500 minutes/month"
   echo "Current: 2,100 minutes/month"
   echo "Reduction: 16% ✅ (target: ≥15%)"
   ```

**Expected Outcome:**
- 3 consecutive integration test runs completed
- GitHub Actions minutes reduced ≥15% (baseline 2,500 → target ≤2,125/month)
- Performance target met (hard requirement for Phase 2 merge)

**Validation Tests:**
- [ ] Run 1 metrics collected: X minutes
- [ ] Run 2 metrics collected: Y minutes
- [ ] Run 3 metrics collected: Z minutes
- [ ] Average reduction: ≥15%

---

## Rollback Validation

**Scenario:** Verify rollback to Phase 1 works

**Steps:**

1. Before rollback, verify Phase 2 workflows functional:
   ```bash
   gh workflow view labeling-unified.yml --json jobRuns | head -5
   ```

2. Simulate rollback:
   ```bash
   # Temporarily disable Phase 2 workflows
   git stash  # Stash Phase 2 changes
   git checkout .github/workflows/  # Restore archived workflows
   ```

3. Trigger archived workflows:
   ```bash
   git checkout develop
   git checkout -b test/rollback-validation
   echo "Rollback test" > ROLLBACK_TEST.md
   git commit -am "test: Rollback validation"
   git push origin test/rollback-validation
   gh pr create --title "test: Rollback" --body "Validate rollback works"
   ```

4. Verify archived workflows still function:
   ```bash
   gh pr view rollback-validation --json statusCheckRollup
   ```

5. Restore Phase 2:
   ```bash
   git stash pop
   git push origin test/rollback-validation
   ```

**Expected Outcome:**
- Rollback to Phase 1 workflows succeeds
- Archived workflows trigger and function correctly
- Recovery time <15 minutes
- No data loss or state corruption

**Validation Tests:**
- [ ] Phase 2 workflows disabled successfully
- [ ] Phase 1 archived workflows trigger on PR
- [ ] Archived workflows complete without error
- [ ] Rollback recovery time documented as <15 minutes

---

## Summary Validation Checklist

**MVP (Phase 1-3):**
- [ ] Baseline metrics recorded (~2,500 minutes/month)
- [ ] 4 composite actions functional
- [ ] Workflow test harness triggers on PR
- [ ] labeling-unified.yml consolidates 9 workflows
- [ ] Labels applied correctly per taxonomy
- [ ] Metrics reported successfully
- [ ] ≥3 consecutive CI passes

**Full Phase 2 (Phase 1-7):**
- [ ] All Phase 3 checks passed
- [ ] validation-unified.yml passes 12 validation rules
- [ ] testing-unified.yml achieves ≥80% coverage
- [ ] linting-unified.yml consolidates 2 workflows
- [ ] quality-gates.yml blocks critical vulnerabilities
- [ ] All 5 workflows run without cascading failures
- [ ] GitHub Actions minutes reduced ≥15% (≤2,125/month)
- [ ] Rollback procedure tested and <15 minutes
- [ ] Operations runbook complete
- [ ] 3 consecutive integration test runs passed

**Go-Live Criteria (All above + Production):**
- [ ] Phase 2 merged to main branch
- [ ] Monitoring active (alert on failures)
- [ ] Operations team trained
- [ ] Incident response procedure practiced
- [ ] Metrics dashboard showing ≥15% reduction
- [ ] <2 incidents in first 4 weeks post-production

---

## Troubleshooting

| Issue | Root Cause | Resolution |
|-------|-----------|-----------|
| Workflow not triggering | Event filter too restrictive | Check `on:` triggers match repository event type |
| Labels not applied | Label not in `.github/labels.yml` | Add label to taxonomy with required prefix |
| Coverage <80% | New code without tests | Add test coverage for new code |
| Validation comment not posted | Composite action failure | Check `validate-check` action logs |
| Metrics not reported | Script error or API rate limit | Re-run `measure-actions-minutes.sh` with `--verbose` |
| Rollback fails | Phase 1 archive corrupted | Verify Phase 1 archive checksum in T001 |

---

## Next Steps

1. ✅ Complete Phase 0: Baseline measurement
2. ✅ Complete Phase 1: Foundational infrastructure tests
3. ✅ Complete Phase 3: MVP validation (labeling-unified.yml)
4. ✅ Complete Phase 4: Validation & testing workflows
5. ✅ Complete Phase 5: Linting workflow
6. ✅ Complete Phase 6: Quality gates workflow
7. ✅ Complete Phase 7: Integration & performance validation
8. ✅ Execute rollback validation
9. ✅ Merge PR to main branch
10. ✅ Monitor production for 4 weeks post-deployment
