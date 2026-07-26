# Phase 3.2 Integration Testing — Execution Continuation Prompt

## Current State (2026-07-26 15:45 UTC)

**Project:** GitHub Workflows Consolidation Initiative (Epic #1227)  
**Phase:** 3.2 — Integration Testing — Labeling Governance Consolidation  
**Status:** PROJECT PLANNING COMPLETE — AWAITING PR MERGE

### ✅ Phase 3.1: COMPLETE & MERGED

- PR #1367 merged to develop (2026-07-24T18:37:14Z)
- New consolidated workflow: `.github/workflows/labeling-governance.yml` (226 lines, LIVE)
- Consolidated from: `labeling.yml` + `dependabot-security-label.yml` + `issue-close-label-hygiene.yml`
- Code reduction: ~204 lines eliminated (47% deduplication)

### ✅ Phase 3.2: PROJECT PLANNING COMPLETE — PR #1390 PENDING MERGE

**Test Branch:** `test/feat-labeling-test-1`  
**Project Planning PR:** [#1390](https://github.com/lightspeedwp/.github/pull/1390)  
**Documentation Commits:** b126131b1, 76fb9ad94  
**Files Created:**

- `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_TEST_PLAN.md` ✓ Committed
- `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3_PROGRESS.md` ✓ Committed
- `.github/projects/active/workflows-consolidation-2026-q3/PHASE_2_3_INTEGRATION_TESTING.md` ✓ In PR #1390
- `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3_STATUS.md` ✓ In PR #1390
- `.github/workflows/labeling-governance.yml` ✓ In PR #1390 (Phase 3.1 deliverable)
- Project planning files for Agent Standards, Changelog Hardening, Phase 2B Skills ✓ In PR #1390

**Documentation Location:**

- Live test plan: `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_TEST_PLAN.md`
- Live progress tracking: `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3_PROGRESS.md`
- Live execution log: `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_EXECUTION_LOG.md`

## Related Issues & Epic

**Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227) — GitHub Workflows Consolidation Initiative

**Phase 3 Issues:**

- [#1322](https://github.com/lightspeedwp/.github/issues/1322) — Phase 3.1: Create labeling-governance.yml (✅ COMPLETED)
- [#1323](https://github.com/lightspeedwp/.github/issues/1323) — Phase 3.2: Integration Testing — Labeling Workflows (⏳ ACTIVE)
- [#1324](https://github.com/lightspeedwp/.github/issues/1324) — Phase 3.3: Cleanup & Deprecate Legacy Workflows (⏹️ PENDING)
- [#1325](https://github.com/lightspeedwp/.github/issues/1325) — Phase 3.4: Code Review & Merge (⏹️ PENDING)

## What Needs To Be Done: Phase 3.2 Integration Testing

### Test Scenario 1: Standard PR Labeling (3 tests)

- **Test 1.1:** Feature branch → `type:feature` label
  - Branch: `test/feat-labeling-test-1` (ready)
  - Status: ⏳ Ready for PR creation
  
- **Test 1.2:** Fix branch → `type:bug` label
  - Need to: Create branch `test/fix-labeling-test-2`, create PR, verify label
  
- **Test 1.3:** Docs branch → `type:documentation` label
  - Need to: Create branch `test/docs-labeling-test-3`, create PR, verify label

### Test Scenario 2: Dependabot PR Labeling (2 tests)

- **Test 2.1:** Security-related Dependabot PR → `meta:dependabot-security` label
- **Test 2.2:** Non-security Dependabot PR → no security label

### Test Scenario 3: Issue Labeling (3 tests)

- **Test 3.1:** Bug issue → `type:bug` label
- **Test 3.2:** Feature issue → `type:feature` label
- **Test 3.3:** Priority mention → `priority:*` label

### Test Scenario 4: Label Cleanup on Close (2 tests)

- **Test 4.1:** Remove `status:needs-triage` on close
- **Test 4.2:** Preserve other labels, only remove `status:needs-triage`

### Test Scenario 5: Regression Testing (4 checks)

- **Test 5.1:** Label names unchanged
- **Test 5.2:** Trigger consistency
- **Test 5.3:** Performance check (<3 minutes)
- **Test 5.4:** Comment format consistency

## Execution Instructions

### 1. Verify Branch & Setup

```bash
# Check current branches
git branch | grep test/

# Verify test documentation exists
ls -la .github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_*

# Check execution log status
cat .github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_EXECUTION_LOG.md
```

### 2. Execute Test Scenario 1 (Standard PR Labeling)

Start with Test 1.1 using the existing `test/feat-labeling-test-1` branch:

```bash
# Create PR from test/feat-labeling-test-1
gh pr create --base develop \
  --title "test(scenario-1.1): feature branch labeling" \
  --body "Test 1.1: Verify feature branch receives type:feature label"

# Wait 5 minutes for GitHub Actions workflow to run
# Check PR labels applied
gh pr view <pr-number> --json labels
```

### 3. Create Additional Test Branches (1.2, 1.3)

```bash
# Test 1.2: Fix branch
git checkout -b test/fix-labeling-test-2
echo "# Fix test" >> README.md
git add README.md
git commit -m "fix: testing standard labeling on fix branches"
git push -u origin test/fix-labeling-test-2

# Create PR
gh pr create --base develop \
  --title "test(scenario-1.2): fix branch labeling" \
  --body "Test 1.2: Verify fix branch receives type:bug label"

# Test 1.3: Docs branch
git checkout -b test/docs-labeling-test-3
echo "# Docs test" >> README.md
git add README.md
git commit -m "docs: testing standard labeling on docs branches"
git push -u origin test/docs-labeling-test-3

# Create PR
gh pr create --base develop \
  --title "test(scenario-1.3): docs branch labeling" \
  --body "Test 1.3: Verify docs branch receives type:documentation label"
```

### 4. Update Execution Log

After each test, update `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_EXECUTION_LOG.md`:

- Mark test status (✓ PASSED / ✗ FAILED)
- Record timing and results
- Document any issues

### 5. Complete All 14 Tests

- Follow test plan order (Scenario 1 → 2 → 3 → 4 → 5)
- Document results in execution log
- Record success/failure for each test

### 6. Success Criteria for Phase 3.2

✅ All 14 tests executed  
✅ Results documented in execution log  
✅ No regressions in labeling behavior  
✅ All labels applied correctly  
✅ Cleanup behavior verified  
✅ Ready to proceed to Phase 3.3

## Key Files to Reference

**Test Plans & Documentation:**

```
.github/projects/active/workflows-consolidation-2026-q3/
├── PHASE_3.2_TEST_PLAN.md              ← Detailed test scenarios
├── PHASE_3.2_EXECUTION_LOG.md          ← Update this with results
├── PHASE_3_PROGRESS.md                 ← Overall status
├── README.md                            ← Project overview
└── PROJECT_INDEX.md                    ← Navigation guide
```

**Live Consolidated Workflow:**

```
.github/workflows/
└── labeling-governance.yml             ← NEW (226 lines, consolidated, LIVE on develop)
```

**Legacy Workflows (to be deprecated in Phase 3.3):**

```
.github/workflows/
├── labeling.yml                        ← Legacy (to deprecate)
├── dependabot-security-label.yml       ← Legacy (to deprecate)
└── issue-close-label-hygiene.yml       ← Legacy (to deprecate)
```

## Next Phases (After 3.2 Complete)

- **Phase 3.3:** Deprecate & cleanup legacy workflows (issue #1324)
- **Phase 3.4:** Code review & final merge (issue #1325)

## Branching & PR Conventions

**Branch Naming:** Follow `{type}/{scope}-{short-title}` pattern

- `test/feat-labeling-test-1` ✓ Correct
- `test/fix-labeling-test-2` ✓ Correct
- Test branches always use `test/` prefix per CLAUDE.md

**PR Template:** Use appropriate template for branch type

- `test/*` branches use PR chore template (no special validation)
- Keep PR body simple for test PRs

**Base Branch:** All PRs merge to `develop` (NOT `main`)

- `develop` is the integration branch for all work
- `main` is locked for release cycles only

## Important Notes

1. **Workflow Execution:** GitHub Actions labeling-governance.yml triggers on:
   - `pull_request` events
   - `issues` events
   - `push` to develop
   - `workflow_dispatch` (manual)

2. **Timing:** Workflow usually completes within 2-5 minutes after PR creation

3. **Execution Log:** This is your source of truth for test results—update it as you go

4. **No Force Pushing:** All test branches use normal push (not force push)

5. **PR Cleanup:** Close test PRs after verifying labels (don't merge them)

## Success Milestone

When all 14 tests pass:

1. Update issue #1323 status to "Complete"
2. Create issue #1324 for Phase 3.3 (deprecate legacy workflows)
3. Proceed with deprecation of legacy workflow files

---

**Ready to start Phase 3.2?**

1. Copy this prompt into a new chat
2. Run verification commands above
3. Start with Test Scenario 1 (PR creation from `test/feat-labeling-test-1`)
4. Update execution log after each test
5. Continue until all 14 tests complete

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
