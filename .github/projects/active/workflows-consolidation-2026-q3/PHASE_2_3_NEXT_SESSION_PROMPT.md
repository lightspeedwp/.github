# Phase 2.3 Integration Testing & Phase 3 Labeling — Next Session Prompt

## Context Summary

**Completed Work (Current Session):**

- ✅ Phase 2 (Documentation Consolidation): PR #1313 & #1317 merged to develop
- ✅ Consolidated 3 README workflows → 1 `documentation.yml` (49% code deduplication, 3-4 min/month saved)
- ✅ Fixed 4 critical GitHub Actions issues (context variables, validation propagation, race conditions, multiline shell logic)
- ✅ Created Phase 2.3 Integration Testing plan (5 comprehensive test scenarios)
- ✅ Designed Phase 3 Labeling Consolidation (3 workflows → 1 unified system)

**Post-Merge Feedback (CodeRabbit):**

- Created follow-up branch `fix/workflows-documentation-security-hardening` with fixes for:
  - Job-scoped permissions (remove overly broad top-level permissions)
  - Missing persist-credentials flags
  - Maintenance report accuracy (show actual task outcomes)
  - README resolver over-inclusion (only add root README on subdirectory changes)
  - Documentation clarity (comma-separated output format)

## Current Status

- **PR #1317:** ✅ MERGED (Phase 2.4 cleanup, legacy workflows deleted)
- **PR #1387:** 🔄 OPEN (Security fixes, ready to merge)
- **Issue #1386:** 🔄 OPEN (CodeRabbit feedback tracking)
- **Branch:** `fix/workflows-documentation-security-hardening` (commit a2ff21505)
- **Next Phase:** Phase 2.3 Integration Testing OR Phase 3 Implementation

## Your Choice: Two Options

### Option 1: Merge Security Fixes First, Then Phase 2.3 Testing

**Steps:**

1. Create PR from `fix/workflows-documentation-security-hardening` → develop
2. Merge security fixes to develop
3. Execute Phase 2.3 Integration Testing (5 test scenarios)
4. Document results, mark Phase 2 complete
5. Proceed to Phase 3 Implementation

**Effort:** ~2-3 hours (PR merge + 5 test scenarios + documentation)

**Why:** Ensures workflow security baseline before testing, clean history.

### Option 2: Skip Security Fixes, Start Phase 2.3 Testing Now

**Steps:**

1. Execute Phase 2.3 Integration Testing with current `documentation.yml` (merged in develop)
2. Document test results
3. Create Phase 3 issues and start implementation
4. Merge security fixes later as a separate follow-up

**Effort:** ~1.5-2 hours (testing + documentation)

**Why:** Get to Phase 3 faster if security polish can be deferred.

---

## Key Files & References

### Phase 2 Completion

- **Summary:** `.github/projects/active/workflows-consolidation-2026-q3/PHASE_2_COMPLETION_SUMMARY.md`
- **Merged PRs:** #1313 (implementation), #1317 (cleanup)
- **Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227)
- **Issues:** #1307, #1308, #1309, #1310, #1311

### Phase 2.3 Integration Testing

- **Test Plan:** `.github/projects/active/workflows-consolidation-2026-q3/PHASE_2_3_TEST_EXECUTION_PLAN.md`
- **Test Scenarios:** 5 comprehensive tests (PR dry-run, push commit, manual audit, manual maintain, conditional verification)
- **Issue:** [#1309](https://github.com/lightspeedwp/.github/issues/1309)
- **Status:** Ready to execute (fresh branches from develop)

### Phase 3 Labeling Consolidation

- **Design:** `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3_LABELING_CONSOLIDATION_PLAN.md`
- **Scope:** 3 workflows → 1 unified system (234 lines → ~130 lines, ~45% dedup)
  - `labeling.yml` (~108 lines) — main labeling engine
  - `dependabot-security-label.yml` (~89 lines) — Dependabot PR labeling
  - `issue-close-label-hygiene.yml` (~37 lines) — issue closure label cleanup
- **Effort:** 12 hours (2h design ✅, 4h implementation, 4h testing, 2h cleanup)
- **Timeline:** Phase 3.2 implementation target 2026-07-31

### Security Fixes (PR #1387, Issue #1386)

- **PR:** [#1387](https://github.com/lightspeedwp/.github/pull/1387) (ready to merge)
- **Issue:** [#1386](https://github.com/lightspeedwp/.github/issues/1386) (tracking CodeRabbit feedback)
- **Branch:** `fix/workflows-documentation-security-hardening` (commit a2ff21505)
- **Changes:**
  - Job-scoped permissions (audit, regenerate, maintain each have minimal required perms)
  - persist-credentials flags (false for read, true for write)
  - Maintenance report accuracy (track individual step outcomes)
  - README resolver fix (only add root README on subdirectory changes)
  - Enhanced documentation (output format clarity)

### Active Project Documentation

- **Project Index:** `.github/projects/active/workflows-consolidation-2026-q3/PROJECT_INDEX.md`
- **PHASE_2_3_INTEGRATION_TESTING.md** (5 test scenarios, fresh branch setup instructions)
- **PHASE_3_LABELING_CONSOLIDATION_PLAN.md** (design, 5 conditional jobs, risk analysis)

---

## Branches & Pull Requests

| Branch | Purpose | Status | PR | Issue |
|--------|---------|--------|----|----|
| `develop` | Production integration branch | ✅ Phase 2 merged | — | — |
| `fix/workflows-documentation-security-hardening` | CodeRabbit feedback fixes | 🔄 OPEN | [#1387](https://github.com/lightspeedwp/.github/pull/1387) | [#1386](https://github.com/lightspeedwp/.github/issues/1386) |
| `test/phase-2-3-*` | Phase 2.3 test branches (to create fresh) | ⏳ Not created yet | — | — |

---

## Branch Naming Conventions (From CLAUDE.md)

- Feature/fix PRs: `{type}/{scope}-{short-title}` (lowercase, kebab-case)
- Core types: `feat`, `fix`, `chore`, `refactor`, `docs`, `ci`, etc.
- Example: `fix/workflows-documentation-security-hardening` ✅
- **NO** `claude/` prefix (forbidden per CLAUDE.md)

---

## Next Session Prompt Template

**If choosing Option 1 (Security Fixes → Testing):**

```
Workflows Consolidation: Merge Security Fixes & Execute Phase 2.3 Testing

Epic: #1227 (GitHub Workflows Consolidation Initiative)
PR: #1387 (Security fixes — ready to merge)
Issue: #1386 (CodeRabbit feedback tracking)
Phase: 2.3 Integration Testing + Phase 3 Planning

Related Issues:
- #1309: Phase 2.3 Integration Testing
- #1310: Phase 2.4 Cleanup (resolved)
- #1311: Phase 2.5 Code Review & Merge (resolved)

Steps:
1. Review and merge PR #1387 (security fixes)
   - Fixes: Job-scoped permissions, persist-credentials flags, report accuracy, resolver optimization
   - Closes: Issue #1386
   - CI checks should pass

2. Execute Phase 2.3 Integration Testing (5 test scenarios)
   - Reference: .github/projects/active/workflows-consolidation-2026-q3/PHASE_2_3_TEST_EXECUTION_PLAN.md
   - Create fresh test branches from develop (post-merge)
   - Run all 5 scenarios: PR dry-run, push commit, audit dispatch, maintain dispatch, conditional verification
   - Expected duration: 30-50 minutes

3. Document test results in PHASE_2_3_INTEGRATION_TESTING.md
   - Update each scenario status (pass/fail)
   - Record any issues or regressions

4. Update PROJECT_INDEX.md status:
   - Phase 2.4: ✅ COMPLETE
   - Phase 2.5: ✅ COMPLETE
   - Phase 2.3: 🟡 TESTING COMPLETE (update)

5. Review Phase 3 Labeling Consolidation design
   - Reference: PHASE_3_LABELING_CONSOLIDATION_PLAN.md
   - Create GitHub issues for Phase 3.1–3.4 (implementation, testing, cleanup, verification)

6. Prepare for Phase 3 Implementation
```

**If choosing Option 2 (Testing Now, Fixes Later):**

```
Phase 2.3 Integration Testing — Start Now

Epic: #1227 (GitHub Workflows Consolidation Initiative)
Issue: #1309 (Phase 2.3 Integration Testing)
PR: #1387 (Security fixes — can merge later)
Phase: 2.3 Testing + Phase 3 Design Review

Related Issues:
- #1386: CodeRabbit feedback (PR #1387 ready to merge anytime)

Steps:
1. Execute Phase 2.3 Integration Testing (5 test scenarios)
   - Reference: .github/projects/active/workflows-consolidation-2026-q3/PHASE_2_3_TEST_EXECUTION_PLAN.md
   - Create fresh test branches from develop
   - Run all scenarios: PR dry-run, push commit, audit dispatch, maintain dispatch, conditional verification
   - Expected duration: 30-50 minutes

2. Document test results in PHASE_2_3_INTEGRATION_TESTING.md
   - Mark each scenario PASS or FAIL
   - Note any issues discovered

3. Update PROJECT_INDEX.md status: Phase 2.3 → TESTING COMPLETE

4. Review Phase 3 Labeling Consolidation design
   - Reference: PHASE_3_LABELING_CONSOLIDATION_PLAN.md
   - Design: 3 workflows → 1 unified system (234 lines → ~130, ~45% dedup)

5. Create GitHub issues for Phase 3:
   - #3.1: Implementation
   - #3.2: Integration Testing
   - #3.3: Cleanup
   - #3.4: Verification & Sign-Off

6. Kickoff Phase 3 Implementation

Note: PR #1387 (security fixes) ready to merge anytime—you can merge it in parallel with Phase 2.3 testing or after Phase 3 starts.
```

---

## Success Criteria

### For Option 1

- ✅ Security fixes PR created and merged
- ✅ All 5 Phase 2.3 test scenarios pass
- ✅ Phase 2 marked COMPLETE in PROJECT_INDEX.md
- ✅ Phase 3 design reviewed, issues created

### For Option 2

- ✅ All 5 Phase 2.3 test scenarios pass
- ✅ Test results documented
- ✅ Phase 3 issues created (#3.1–#3.4)
- ✅ Phase 3 ready to start (design complete)

---

## Relevant Documentation Links

### Epic & Parent Issues

- **Epic:** [#1227 GitHub Workflows Consolidation Initiative](https://github.com/lightspeedwp/.github/issues/1227)

### Phase 2: Documentation Consolidation (✅ Complete)

- **PR #1313:** [Implementation](https://github.com/lightspeedwp/.github/pull/1313)
- **PR #1317:** [Cleanup](https://github.com/lightspeedwp/.github/pull/1317) (merged)
- **Issue #1307–#1311:** Phase 2 sub-issues (all resolved)

### Phase 2.3: Integration Testing (⏳ Ready to Execute)

- **Issue:** [#1309 Integration Testing](https://github.com/lightspeedwp/.github/issues/1309)
- **Plan:** `.github/projects/active/workflows-consolidation-2026-q3/PHASE_2_3_TEST_EXECUTION_PLAN.md`

### Phase 2.4: Cleanup (✅ Complete, PR #1317)

- **Issue:** [#1310 Cleanup](https://github.com/lightspeedwp/.github/issues/1310)

### Phase 2.5: Code Review & Merge (✅ Complete, PR #1317)

- **Issue:** [#1311 Code Review & Merge](https://github.com/lightspeedwp/.github/issues/1311)

### Security Fixes (🔄 Ready to Merge)

- **PR:** [#1387 Address CodeRabbit Security Feedback](https://github.com/lightspeedwp/.github/pull/1387)
- **Issue:** [#1386 CodeRabbit Feedback Tracking](https://github.com/lightspeedwp/.github/issues/1386)
- **Branch:** `fix/workflows-documentation-security-hardening`

### Phase 3: Labeling Consolidation (📋 Design Complete)

- **Design:** `.github/projects/active/workflows-consolidation-2026-q3/PHASE_3_LABELING_CONSOLIDATION_PLAN.md`
- **Issues:** To be created (#3.1–#3.4 for implementation, testing, cleanup, verification)

### Project Documentation

- **Project Index:** `.github/projects/active/workflows-consolidation-2026-q3/PROJECT_INDEX.md`
- **README:** `.github/projects/active/workflows-consolidation-2026-q3/README.md`
- **Completion Summary:** `.github/projects/active/workflows-consolidation-2026-q3/PHASE_2_COMPLETION_SUMMARY.md`

---

**Ready to proceed:** Choose Option 1 or Option 2 when starting next session, then use the corresponding prompt template above.
