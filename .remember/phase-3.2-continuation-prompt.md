# Phase 3.2 Integration Testing — Continuation Prompt

## Context

**Project:** GitHub Workflows Consolidation Initiative (Epic #1227)  
**Phase:** 3.2 — Integration Testing — Labeling Governance Consolidation  
**Status:** STARTED & READY FOR TEST EXECUTION  
**Session Date:** 2026-07-24

## Current State

### ✅ Phase 3.1: COMPLETE & MERGED

- PR #1367 merged to develop (2026-07-24T18:37:14Z)
- New workflow: `.github/workflows/labeling-governance.yml` (226 lines, consolidated from 3 legacy workflows)
- Consolidated: `labeling.yml` + `dependabot-security-label.yml` + `issue-close-label-hygiene.yml`
- Code reduction: ~204 lines eliminated (47% deduplication)

### ⏳ Phase 3.2: KICKOFF COMPLETE — READY TO EXECUTE

**Branch:** `test/labeling-consolidation-integration` (test/ naming convention)  
**Test branches created:**

- `test/feat-labeling-test-1` (ready for PR creation — Test 1.1)

**Documentation Files:**

- `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_TEST_PLAN.md` — Complete test plan with 5 scenarios, 14 test cases
- `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_EXECUTION_LOG.md` — Live execution tracking (STARTED)
- `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3_PROGRESS.md` — Overall Phase 3 progress

## Related Issues & Documentation

**Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227) — GitHub Workflows Consolidation Initiative

**Phase 3 Issues:**

- [#1322](https://github.com/lightspeedwp/.github/issues/1322) — Phase 3.1: Create labeling-governance.yml (COMPLETED)
- [#1323](https://github.com/lightspeedwp/.github/issues/1323) — Phase 3.2: Integration Testing — Labeling Workflows (ACTIVE)
- [#1324](https://github.com/lightspeedwp/.github/issues/1324) — Phase 3.3: Cleanup & Deprecate Legacy Workflows (PENDING)
- [#1325](https://github.com/lightspeedwp/.github/issues/1325) — Phase 3.4: Code Review & Merge (PENDING)

**Project Documentation:**

- [`.github/projects/active/workflows-consolidation-2026-q3/README.md`](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active/workflows-consolidation-2026-q3) — Project overview
- [`PHASE_3.2_TEST_PLAN.md`](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_TEST_PLAN.md) — Detailed test plan with all scenarios
- [`PHASE_3_EXECUTION.md`](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/workflows-consolidation-2026-q3/PHASE_3_EXECUTION.md) — Phase 3 execution roadmap

## What Needs To Be Done (Phase 3.2)

### Test Scenario 1: Standard PR Labeling ⏳ IN PROGRESS

- **Test 1.1:** Feature branch → `type:feature` label
  - Branch: `test/feat-labeling-test-1` (ready)
  - Need to: Create PR, verify label applied
  - Status: ⏳ Ready for PR creation

- **Test 1.2:** Fix branch → `type:bug` label
  - Need to: Create branch `test/fix-labeling-test-2`, create PR, verify label

- **Test 1.3:** Docs branch → `type:documentation` label
  - Need to: Create branch `test/docs-labeling-test-3`, create PR, verify label

### Test Scenario 2: Dependabot PR Labeling ⏳ QUEUED

- **Test 2.1:** Security-related Dependabot PR → `meta:dependabot-security` label
- **Test 2.2:** Non-security Dependabot PR → no security label

### Test Scenario 3: Issue Labeling ⏳ QUEUED

- **Test 3.1:** Bug issue → `type:bug` label
- **Test 3.2:** Feature issue → `type:feature` label
- **Test 3.3:** Priority mention → `priority:*` label

### Test Scenario 4: Label Cleanup on Close ⏳ QUEUED

- **Test 4.1:** Remove `status:needs-triage` on close
- **Test 4.2:** Preserve other labels, only remove `status:needs-triage`

### Test Scenario 5: Regression Testing ⏳ PENDING

- **Test 5.1:** Label names unchanged
- **Test 5.2:** Trigger consistency
- **Test 5.3:** Performance check (<3 minutes)
- **Test 5.4:** Comment format consistency

## Instructions for Continuation

1. **Verify branch & documentation:**

   ```bash
   git branch | grep test/labeling-consolidation-integration
   git branch | grep test/feat-labeling-test
   ```

2. **Start with Test Scenario 1:**
   - Create PR from `test/feat-labeling-test-1` branch
   - Verify `type:feature` label applied within 5 minutes
   - Document result in `PHASE_3.2_EXECUTION_LOG.md`

3. **Follow test plan sequence:**
   - Execute tests in order (Scenario 1 → 2 → 3 → 4 → 5)
   - Document results for each test
   - Mark status in execution log

4. **Update execution log:**
   - File: `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3.2_EXECUTION_LOG.md`
   - Update test status as you execute
   - Record timing and results

5. **Completion criteria:**
   - All 14 tests executed
   - Results documented
   - No regressions detected
   - Ready to proceed to Phase 3.3

## Key Files to Reference

```
.github/
├── workflows/
│   └── labeling-governance.yml ← NEW (consolidated workflow, live on develop)
└── projects/
    └── active/
        └── workflows-consolidation-2026-q3/
    ├── README.md
    ├── PHASE_3_EXECUTION.md
    ├── PHASE_3.2_TEST_PLAN.md ← Test scenarios & success criteria
    ├── PHASE_3.2_EXECUTION_LOG.md ← Live tracking (UPDATE THIS)
    └── PHASE_3_PROGRESS.md
```

## Success Criteria

✅ All 14 test cases executed  
✅ Results documented in execution log  
✅ No regressions in labeling behavior  
✅ All labels applied correctly  
✅ Cleanup behavior verified  
✅ Ready to proceed to Phase 3.3 (Cleanup & Deprecation)

## Next Phases (After 3.2)

- **Phase 3.3:** Deprecate & cleanup legacy workflows
- **Phase 3.4:** Code review & final merge

---

**Copy this prompt into a new chat to continue Phase 3.2 integration testing.**

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
