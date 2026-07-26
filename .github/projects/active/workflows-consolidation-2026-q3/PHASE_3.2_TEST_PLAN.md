---
name: Phase 3.2 Test Plan
title: Integration Testing — Labeling Workflows
description: Test scenarios and execution plan for Phase 3.2 integration testing
metadata:
  phase: 3.2
  status: ready
  created: 2026-07-24
  effort_hours: 2-3
  timeline: week 10
---

# Phase 3.2: Integration Testing — Labeling Workflows

## Overview

This document outlines the test scenarios for validating the consolidated `labeling-governance.yml` workflow created in Phase 3.1.

**Duration:** 2-3 hours  
**Timeline:** Week 10  
**Depends On:** PR #1367 (Phase 3.1) merged to develop

---

## Test Environment Setup

### Prerequisites

- ✅ PR #1367 merged to develop
- ✅ `labeling-governance.yml` active in develop branch
- ✅ Test branches ready to create
- ✅ Issue creation capability enabled

### Test Branches to Create

```bash
# Standard PR labeling tests
git checkout develop
git pull origin develop
git checkout -b test/labeling-feature-branch
git checkout -b test/labeling-fix-branch
git checkout -b test/labeling-docs-branch
```

---

## Test Scenarios

### Scenario 1: Standard PR Labeling (0.5 hours)

**Goal:** Verify PR labeling works based on branch prefix

#### Test 1.1: Feature Branch PR

- **Branch:** `test/labeling-feature-branch` (or `feat/something`)
- **Expected Label:** `type:feature`
- **Steps:**
  1. Create PR from feature branch to develop
  2. Wait for workflow to run (2-3 minutes)
  3. Verify PR has `type:feature` label
  4. ✅ **Pass** if label applied correctly
  5. ❌ **Fail** if label missing or incorrect

#### Test 1.2: Fix Branch PR

- **Branch:** `test/labeling-fix-branch` (or `fix/something`)
- **Expected Label:** `type:bug`
- **Steps:**
  1. Create PR from fix branch to develop
  2. Wait for workflow (2-3 minutes)
  3. Verify PR has `type:bug` label
  4. ✅ **Pass** if label applied
  5. ❌ **Fail** if missing

#### Test 1.3: Documentation Branch PR

- **Branch:** `test/labeling-docs-branch` (or `docs/something`)
- **Expected Label:** `type:documentation`
- **Steps:**
  1. Create PR from docs branch to develop
  2. Wait for workflow (2-3 minutes)
  3. Verify PR has `type:documentation` label
  4. ✅ **Pass** if label applied
  5. ❌ **Fail** if missing

**Success Criteria:** All 3 PRs labeled correctly within 5 minutes

---

### Scenario 2: Dependabot PR Labeling (0.5 hours)

**Goal:** Verify Dependabot security labeling works

#### Test 2.1: Security-Related Dependabot PR

- **Trigger:** Dependabot PR with security keywords in title/body
- **Expected Labels:** `meta:dependabot-security` (if security-related)
- **Keywords to include in PR body:**
  - "vulnerability"
  - "security fix"
  - "CVE-"
  - "GHSA-"
- **Steps:**
  1. Wait for or trigger a Dependabot security update PR
  2. Verify PR has `meta:dependabot-security` label
  3. Check workflow logs for security pattern match
  4. ✅ **Pass** if label applied correctly
  5. ❌ **Fail** if label missing

#### Test 2.2: Non-Security Dependabot PR

- **Trigger:** Dependabot PR without security keywords
- **Expected Labels:** No `meta:dependabot-security` label
- **Steps:**
  1. Wait for or trigger a routine Dependabot PR (e.g., minor version bump)
  2. Verify PR does NOT have `meta:dependabot-security`
  3. ✅ **Pass** if label correctly absent
  4. ❌ **Fail** if label incorrectly applied

**Success Criteria:** Security detection working correctly; accurate labeling

---

### Scenario 3: Issue Labeling (0.5 hours)

**Goal:** Verify issue labeling works on creation

#### Test 3.1: Bug Issue

- **Steps:**
  1. Create new GitHub issue using `01-bug.md` template
  2. Fill in required fields
  3. Submit issue
  4. Wait for labeling workflow (2-3 minutes)
  5. Verify issue has `type:bug` label
  6. ✅ **Pass** if labeled
  7. ❌ **Fail** if missing

#### Test 3.2: Feature Request

- **Steps:**
  1. Create new issue using `03-feature.md` template
  2. Fill in required fields
  3. Submit issue
  4. Wait for workflow (2-3 minutes)
  5. Verify issue has `type:feature` label
  6. ✅ **Pass** if labeled
  7. ❌ **Fail** if missing

#### Test 3.3: Issue with Priority Mention

- **Steps:**
  1. Create new issue with body containing "priority: urgent" or "priority: high"
  2. Submit issue
  3. Wait for workflow (2-3 minutes)
  4. Verify issue has `priority:*` label matching mention
  5. ✅ **Pass** if priority label applied
  6. ❌ **Fail** if missing

**Success Criteria:** Issues labeled correctly on creation

---

### Scenario 4: Label Cleanup on Issue Close (0.5 hours)

**Goal:** Verify labels are removed when issues are closed

#### Test 4.1: Remove `status:needs-triage` on Close

- **Setup:**
  1. Manually add `status:needs-triage` label to an issue
  2. Close the issue
  3. Wait for cleanup workflow (1-2 minutes)
- **Expected Result:** `status:needs-triage` label removed
- **Steps:**
  1. Verify label is gone
  2. ✅ **Pass** if removed
  3. ❌ **Fail** if still present

#### Test 4.2: Other Labels Remain on Close

- **Setup:**
  1. Create issue with labels: `type:bug`, `priority:high`
  2. Close the issue
  3. Wait for cleanup workflow (1-2 minutes)
- **Expected Result:** Other labels remain (only status:needs-triage removed)
- **Steps:**
  1. Verify `type:bug` and `priority:high` still present
  2. ✅ **Pass** if preserved
  3. ❌ **Fail** if removed

**Success Criteria:** Cleanup job removes only intended labels

---

### Scenario 5: Regression Testing (0.5 hours)

**Goal:** Ensure existing labeling behavior unchanged

#### Test 5.1: Label Names Unchanged

- **Verify:** All label names match previous labeling.yml behavior
- **Check:**
  1. No new labels introduced
  2. No labels renamed
  3. Label colors/descriptions unchanged
- **✅ Pass** if all match
- **❌ Fail** if any changes found

#### Test 5.2: Trigger Consistency

- **Verify:** Same events trigger labeling as before
- **Check:**
  1. PR opened → labels applied
  2. PR edited → labels updated
  3. Issue opened → labels applied
  4. Issue reopened → labels reapplied
- **✅ Pass** if all triggers work
- **❌ Fail** if any trigger broken

#### Test 5.3: Performance Check

- **Verify:** Workflow execution time comparable
- **Check:**
  1. Workflow completes in <3 minutes (same as before)
  2. No timeout issues
  3. No resource exhaustion
- **✅ Pass** if performance acceptable
- **❌ Fail** if degradation observed

#### Test 5.4: Comment & Message Format

- **Verify:** Workflow outputs unchanged
- **Check:**
  1. GitHub comments format same as before
  2. Automation messages unchanged
  3. Report formatting consistent
- **✅ Pass** if format matches
- **❌ Fail** if format changed

---

## Test Execution Checklist

### Pre-Testing

- [ ] PR #1367 merged to develop
- [ ] `labeling-governance.yml` active
- [ ] Test branches prepared
- [ ] GitHub access verified
- [ ] Slack notifications on (for workflow alerts)

### Scenario 1: Standard PR Labeling

- [ ] Feature branch PR created
  - [ ] Label applied: `type:feature`
  - [ ] Applied within 5 minutes
- [ ] Fix branch PR created
  - [ ] Label applied: `type:bug`
  - [ ] Applied within 5 minutes
- [ ] Docs branch PR created
  - [ ] Label applied: `type:documentation`
  - [ ] Applied within 5 minutes

### Scenario 2: Dependabot Labeling

- [ ] Security Dependabot PR monitored
  - [ ] Label applied: `meta:dependabot-security` (if security-related)
  - [ ] Pattern matching accurate
- [ ] Non-security Dependabot PR monitored
  - [ ] No security label (as expected)
  - [ ] Other labels applied correctly

### Scenario 3: Issue Labeling

- [ ] Bug issue created
  - [ ] Label applied: `type:bug`
  - [ ] Applied within 5 minutes
- [ ] Feature issue created
  - [ ] Label applied: `type:feature`
  - [ ] Applied within 5 minutes
- [ ] Priority mention issue created
  - [ ] Priority label applied
  - [ ] Applied within 5 minutes

### Scenario 4: Label Cleanup

- [ ] Issue closed with `status:needs-triage`
  - [ ] Label removed within 2 minutes
  - [ ] No errors in workflow logs
- [ ] Issue closed with other labels
  - [ ] Other labels preserved
  - [ ] Only target label removed

### Scenario 5: Regression

- [ ] Label names unchanged from previous version
- [ ] Trigger events fire correctly
- [ ] Performance acceptable (<3 minutes)
- [ ] Comment/message format consistent

### Post-Testing

- [ ] All test PRs/issues documented
- [ ] Results recorded
- [ ] Screenshots/logs captured
- [ ] Test cleanup (close test PRs/issues)
- [ ] Report compiled

---

## Success Criteria

**Phase 3.2 passes if:**

1. ✅ All 5 test scenarios pass
2. ✅ No regressions in labeling behavior
3. ✅ All label operations consistent with original workflows
4. ✅ No broken triggers or timing issues
5. ✅ Performance acceptable
6. ✅ No unexpected error messages

**If any test fails:**

1. Document failure with screenshot/logs
2. Investigate root cause
3. Create issue #1326 (Phase 3 blockers)
4. Report findings
5. Do NOT proceed to Phase 3.3

---

## Test Documentation

### For Each Test Scenario

Record:

- Test date/time
- Branch/PR/issue number
- Expected vs. actual result
- Screenshots if applicable
- Workflow run ID (for logs)
- Time to completion
- Any issues or anomalies

### Example Test Record

```
### Test 1.1: Feature Branch PR
- Date: 2026-07-25 10:30 UTC
- PR: #1368 (test/labeling-feature-branch)
- Expected: `type:feature` label
- Actual: `type:feature` label applied ✅
- Time: 2 minutes 45 seconds
- Workflow Run: https://github.com/lightspeedwp/.github/actions/runs/XXXXX
- Status: PASS ✅
```

---

## Rollback Procedure

If Phase 3.2 identifies critical failures:

1. **Stop testing** — do not proceed to Phase 3.3
2. **Create issue #1326** — document all failures
3. **Preserve evidence** — screenshots, workflow logs, test PRs
4. **Revert PR #1367** — restore old workflows
5. **Investigate** — determine root cause
6. **Plan fixes** — create follow-up PRs

---

## Timeline

| Task | Est. Time | Notes |
|------|-----------|-------|
| Setup & prerequisites | 15 min | Create test branches |
| Scenario 1: PR Labeling | 30 min | 3 test PRs × 5 min each |
| Scenario 2: Dependabot | 30 min | Wait for Dependabot or trigger |
| Scenario 3: Issue Labeling | 30 min | 3 test issues × 5 min each |
| Scenario 4: Cleanup | 30 min | 2 close tests × 2 min each |
| Scenario 5: Regression | 30 min | Quick verification pass |
| Documentation & Report | 15 min | Compile results |
| **Total** | **~2.5 hours** | |

---

## Related Issues & Documentation

- **Phase 3.1:** PR #1367 (merged)
- **Phase 3.3:** Deprecation & Cleanup (depends on 3.2 passing)
- **Epic:** #1227 (Workflows Consolidation)
- **Audit:** `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`
- **Project:** `.github/projects/active/workflows-consolidation-2026-q3/README.md`

---

**Status:** Ready for execution  
**Next Step:** Execute Phase 3.2 once PR #1367 merges to develop

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
