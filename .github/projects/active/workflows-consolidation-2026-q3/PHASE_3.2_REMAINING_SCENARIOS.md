---
name: Phase 3.2 Remaining Test Scenarios
title: Test Scenarios 2–5 Planning
description: Planning and setup for remaining Phase 3.2 integration tests
metadata:
  phase: 3.2
  status: ready-to-execute
---

# Phase 3.2: Test Scenarios 2–5 — Planning & Execution Guide

## Scenario 2: Dependabot PR Labeling (2 tests)

### Test 2.1: Security-Related Dependabot PR

**Trigger:** Dependabot creates a PR with security-related keyword in title or body

**Expected:** `meta:dependabot-security` label applied

**Setup:** Create a Dependabot-style PR (manual simulation)

```bash
# Create a test branch simulating a Dependabot security update
git checkout -b deps/security-update-test
echo "Bump vulnerable-package from 1.0.0 to 1.0.1

CVE-2024-1234: Fix critical vulnerability in package." >> package.json
git add package.json
git commit -m "chore(deps): bump vulnerable-package to fix CVE-2024-1234"
git push origin deps/security-update-test --no-verify

# Create PR (note: can't actually be from dependabot[bot] without real Dependabot)
# Alternative: Use workflow_dispatch with manual trigger
```

**Alternative (Workflow Dispatch):**

```bash
gh workflow run labeling-governance.yml \
  --ref develop \
  -f dry_run=false \
  -f report_commit=true
```

**Verification:**

```bash
gh pr view <pr-number> --json labels --jq '.labels[] | select(.name | contains("dependabot"))'
```

### Test 2.2: Non-Security Dependabot PR

**Expected:** `meta:dependabot-security` label NOT applied

**Setup:** Similar to 2.1 but without security keywords (update, bump, etc.)

---

## Scenario 3: Issue Type Labeling (3 tests)

### Test 3.1: Bug Issue → `type:bug` Label

**Status:** ✅ Ready (Issue #1470 created)

**Verification:**

```bash
gh issue view 1470 --json labels --jq '.labels[] | select(.name | contains("type:bug"))'
```

### Test 3.2: Feature Issue → `type:feature` Label

**Status:** ✅ Ready (Issue #1471 created)

**Verification:**

```bash
gh issue view 1471 --json labels --jq '.labels[] | select(.name | contains("type:feature"))'
```

### Test 3.3: Priority Label Detection

**Expected:** Issues with priority mentions get `priority:*` labels

**Setup:** Create issue with priority keyword

```bash
gh issue create \
  --title "test(labeling): priority detection in issues" \
  --body "This is a HIGH PRIORITY issue testing priority label detection

Expected label: priority:high
Status: Testing"
```

**Priority Keywords:**

- `critical` → `priority:critical`
- `high` / `urgent` → `priority:high`
- `medium` / `normal` → `priority:normal`
- `low` / `nice-to-have` → `priority:low`

---

## Scenario 4: Label Cleanup on Close (2 tests)

### Test 4.1: Remove `status:needs-triage` on Close

**Setup:**

1. Create an issue and apply `status:needs-triage` label
2. Close the issue
3. Verify label is removed

```bash
# Create an issue
ISSUE=$(gh issue create \
  --title "test(labeling): cleanup needs-triage on close" \
  --body "Test label cleanup workflow" \
  --json number -q)

# Add status label
gh issue edit $ISSUE --add-label status:needs-triage

# Wait for label application
sleep 5

# Close the issue
gh issue close $ISSUE

# Verify label removed
sleep 5
gh issue view $ISSUE --json labels --jq '.labels[]'
```

**Expected:** Label removed when issue closed

### Test 4.2: Preserve Other Labels on Close

**Expected:** Only `status:*` labels removed; other labels preserved

```bash
# Create an issue with multiple labels
ISSUE=$(gh issue create \
  --title "test(labeling): preserve labels on close" \
  --body "Test selective label cleanup" \
  --json number -q)

# Add multiple labels
gh issue edit $ISSUE \
  --add-label "status:in-progress" \
  --add-label "type:bug" \
  --add-label "area:documentation"

sleep 5

# Close the issue
gh issue close $ISSUE

# Verify: status:in-progress removed, others preserved
sleep 5
gh issue view $ISSUE --json labels --jq '.labels[] | .name'
```

---

## Scenario 5: Regression Testing (3 checks)

### Test 5.1: Label Names Unchanged

**Verify:** All labels match canonical set

```bash
# Get all labels applied by workflow
gh label list --limit 100 --json name | jq '.[] | .name' | sort

# Compare to labeler.yml canonical set
grep -o '"[a-z:]*":' .github/labeler.yml | sort | uniq
```

**Expected:** All applied labels match canonical definitions

### Test 5.2: Trigger Consistency

**Verify:** Workflow triggers on expected events

```bash
# Check workflow triggers
grep -A 10 "^on:" .github/workflows/labeling-governance.yml

# Expected triggers:
# - pull_request (opened, edited, synchronize, reopened, ready_for_review)
# - issues (opened, edited, reopened, closed)
# - discussion (created, edited, answered, reopened)
# - workflow_dispatch
```

**Verification:** Create PRs/issues on each trigger type and verify workflow runs

### Test 5.3: Performance Check (<3 minutes)

**Measure:** Workflow execution time from trigger to label application

```bash
# Record start time
START=$(date +%s)

# Create a PR
gh pr create --base develop --head feature/perf-test --title "perf test"

# Wait for label
# Check workflow logs
gh run list --workflow labeling-governance.yml --limit 5 --json createdAt,updatedAt

# Calculate elapsed time
END=$(date +%s)
ELAPSED=$((END - START))
echo "Labeling completed in ${ELAPSED} seconds"
```

**Expected:** < 180 seconds (3 minutes)

---

## Execution Order

1. ✅ Scenario 1: Standard PR Labeling (IN PROGRESS)
2. ⏹️ Scenario 2: Dependabot Labeling (READY)
3. ⏹️ Scenario 3: Issue Labeling (READY)
4. ⏹️ Scenario 4: Label Cleanup (READY)
5. ⏹️ Scenario 5: Regression Testing (READY)

---

## Success Criteria for Phase 3.2

✅ All 14 tests executed  
✅ Results documented with pass/fail status  
✅ No regressions in labeling behavior  
✅ All expected labels applied correctly  
✅ Cleanup behavior verified  
✅ Performance within acceptable limits  
✅ Ready to proceed to Phase 3.3 (deprecation)

---

## Related Issues & Docs

- **Epic:** #1227 — GitHub Workflows Consolidation Initiative
- **Phase 3.2 Issue:** #1323 — Integration Testing
- **Test Results:** PHASE_3.2_TEST_RESULTS.md
- **Workflow:** `.github/workflows/labeling-governance.yml`
- **Agent:** `./scripts/agents/labeling.agent.js`

---

**Status:** Ready for execution once Scenario 1 completes  
**Last Updated:** 2026-08-04 12:15 CEST
