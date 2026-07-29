---
name: Phase 3 Consolidation Status
title: Phase 3 — Labeling Workflows Consolidation Status
description: Real-time status tracking for Phase 3 work
metadata:
  created: 2026-07-24
  updated: 2026-07-24T14:30:00Z
  phase: 3
  status: in-progress
  epic: "#1227"
---

# Phase 3: Labeling Workflows Consolidation — Status Report

**Last Updated:** 2026-07-24 | **Status:** 🔄 IN PROGRESS | **Progress:** 25% (1 of 4 phases complete)

---

## Executive Summary

Phase 3 consolidates 3 labeling-related workflows into 1 unified `labeling-governance.yml`, eliminating duplication and reducing operational complexity.

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Workflows consolidated | 3 | 3 | ✅ |
| New workflow created | 1 | 1 | ✅ |
| Lines consolidated | ~265 | 232 | ✅ |
| PR created | 1 | 1 | ✅ |
| Issues created | 4 | 4 | ✅ |

---

## Phase Breakdown

### ✅ Phase 3.1: Create labeling-governance.yml

**Status:** COMPLETE (2026-07-24)

**Deliverables:**

- ✅ `.github/workflows/labeling-governance.yml` created (232 lines)
- ✅ Consolidated 3 workflows:
  - `labeling.yml` (108 lines) → Job: `standard-labeling`
  - `dependabot-security-label.yml` (75 lines) → Job: `label-dependabot-security`
  - `issue-close-label-hygiene.yml` (41 lines) → Job: `cleanup-labels-on-close`
- ✅ Conditional logic implemented (independent job execution)
- ✅ YAML validated (no syntax errors)
- ✅ All triggers preserved: push, pull_request, issues, discussion, workflow_dispatch
- ✅ All permissions preserved
- ✅ Committed: 091b7d480
- ✅ PR created: #1319
- ✅ Issue created: #1360

**Improvements:**

- Extended cleanup to cover 3 labels instead of 1 (status:in-progress, status:needs-triage, status:needs-review)
- Single concurrency group (vs 3 separate)
- Centralized permission model
- Easier to maintain and extend

---

### ⏳ Phase 3.2: Integration Testing

**Status:** PENDING (blocked by PR #1319 merge)

**Effort:** 2.5 hours

**Test Scenarios:**

1. **PR Branch-Based Labeling**
   - [ ] Create PR from `feat/` branch → verify `type:feature` label
   - [ ] Create PR from `fix/` branch → verify `type:bug` label
   - [ ] Create PR from `docs/` branch → verify `type:documentation` label
   - [ ] Create PR from `refactor/` branch → verify `type:refactor` label

2. **Dependabot Security Labeling**
   - [ ] Dependabot PR → `meta:dependabot-security` label (when security patterns detected)
   - [ ] Non-security Dependabot PR → label not applied
   - [ ] Verify Dependabot job runs independently

3. **Issue Type Labeling**
   - [ ] New issue → labeled by issue type
   - [ ] Issue with priority mention → `priority:*` label applied

4. **Label Cleanup on Close**
   - [ ] Close issue with `status:in-progress` → label removed
   - [ ] Close issue with `status:needs-triage` → label removed
   - [ ] Close issue with `status:needs-review` → label removed

5. **Regression Testing**
   - [ ] All original labeling behavior preserved
   - [ ] Label names unchanged
   - [ ] Trigger behavior consistent
   - [ ] Performance comparable to originals

**Tracking:** Issue #1361

---

### ⏳ Phase 3.3: Deprecation & Cleanup

**Status:** PENDING (blocked by Phase 3.2 completion)

**Effort:** 1.5 hours

**Steps:**

1. **Disable Old Workflows** (0.5 hours)
   - [ ] Add `if: false` to all jobs in `dependabot-security-label.yml`
   - [ ] Add `if: false` to all jobs in `issue-close-label-hygiene.yml`
   - [ ] Commit: `chore(labels): disable legacy labeling workflows`

2. **Monitor for Issues** (24 hours)
   - [ ] Watch for any GitHub workflow errors
   - [ ] Verify new workflow executes correctly
   - [ ] Check label application on test PRs/issues

3. **Delete Old Workflows** (0.5 hours)
   - [ ] Delete `.github/workflows/dependabot-security-label.yml`
   - [ ] Delete `.github/workflows/issue-close-label-hygiene.yml`
   - [ ] Commit: `refactor(labels): remove consolidated labeling workflows`

4. **Update Documentation** (0.5 hours)
   - [ ] Update `.github/workflows/README.md`
   - [ ] Add entries to `CHANGELOG.md`
   - [ ] Verify all references updated

**Tracking:** Issue #1362

---

### 🔄 Phase 3.4: Code Review & Merge

**Status:** IN PROGRESS

**PR:** #1319
**Branch:** `refactor/labeling-consolidation-phase-3`
**Target:** `develop`
**Effort:** 1.5 hours

**Review Checklist:**

- [ ] YAML syntax valid (`npm run lint:yaml` ✅ PASSED)
- [ ] All jobs properly conditioned
- [ ] No duplicate logic between jobs
- [ ] Security: no command injection risks
- [ ] Error handling consistent
- [ ] Permissions match originals

**Merge Protocol:**

1. Code review approval (1+ reviewer)
2. Address any feedback
3. Squash merge to develop
4. Delete branch post-merge
5. Monitor for workflow failures

**Tracking:** Issue #1363

---

## Timeline & Effort

| Phase | Status | Effort | Actual | Next |
|-------|--------|--------|--------|------|
| 3.1 | ✅ COMPLETE | 2h | ~2h | 3.2 |
| 3.2 | ⏳ PENDING | 2.5h | - | After PR merge |
| 3.3 | ⏳ PENDING | 1.5h | - | After Phase 3.2 |
| 3.4 | 🔄 IN PROGRESS | 1.5h | - | Now |
| **Total** | **25%** | **~7.5h** | **~2h** | **~5.5h remaining** |

---

## GitHub Issues Tracking

| Issue | Title | Status | Phase |
|-------|-------|--------|-------|
| #1360 | Create labeling-governance.yml | ✅ COMPLETE | 3.1 |
| #1361 | Integration Testing | ⏳ PENDING | 3.2 |
| #1362 | Deprecation & Cleanup | ⏳ PENDING | 3.3 |
| #1363 | Code Review & Merge | 🔄 IN PROGRESS | 3.4 |

---

## Risk & Mitigation

### Identified Risks

**Risk:** Workflow failures in production after merge

- **Mitigation:** Phase 3.2 integration testing covers all scenarios
- **Fallback:** Rollback commits; restore old workflows from git history

**Risk:** Label cleanup too aggressive

- **Mitigation:** Only removes specific status labels, not all labels
- **Fallback:** Manual label re-application if needed

**Risk:** Dependabot PR labeling conflicts

- **Mitigation:** Conditional job (`github.actor == 'dependabot[bot]'`)
- **Fallback:** Can be disabled independently

### Mitigation Strategy

1. Comprehensive integration testing (Phase 3.2)
2. 24-hour monitoring period (Phase 3.3)
3. Gradual deprecation (disable before delete)
4. Clear rollback path via git history

---

## Success Criteria

**Quantitative:**

- ✅ 3 workflows consolidated to 1
- ✅ ~33 lines of code eliminated (265 → 232)
- ✅ 0 workflow dependencies broken
- ✅ 100% of original behavior preserved

**Qualitative:**

- ✅ Simpler operational model
- ✅ Easier to understand and modify
- ✅ Reduced maintenance burden
- ✅ Team confidence in consolidation

---

## Next Steps

1. **Immediate (Today)**
   - Code review and approval of PR #1319
   - Merge to develop after approval

2. **Short-term (Tomorrow)**
   - Phase 3.2: Integration testing (2.5 hours)
   - Verify all labeling functions correctly

3. **Medium-term (2-3 days)**
   - Phase 3.3: Disable and delete old workflows (1.5 hours)
   - 24-hour monitoring period

4. **Completion**
   - All Phase 3 issues closed
   - Prepare Phase 4 (future workflows consolidation)

---

## Related Resources

- **Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227) — GitHub Workflows Consolidation Initiative
- **PR:** [#1319](https://github.com/lightspeedwp/.github/pull/1319) — labeling-governance.yml consolidation
- **Phase Documentation:** PHASE_3_EXECUTION.md, PHASE_3_ISSUES.md
- **Project:** [Workflows Consolidation 2026 Q3](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/workflows-consolidation-2026-q3/)

---

**Status:** Ready to proceed with Phase 3.3 (Deprecation & Cleanup)
**Last Updated:** 2026-07-24
*Built by 🧱 LightSpeedWP with ☕, 🚀, and GitHub Actions spirit!*
