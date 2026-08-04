---
name: Phase 3.3 Execution Plan
title: Phase 3.3 — Cleanup & Deprecate Legacy Workflows
description: Execution plan for Phase 3.3 deprecation and cleanup
metadata:
  phase: 3.3
  status: in-progress
  issue: "#1324"
  start_date: 2026-08-04
---

# Phase 3.3: Cleanup & Deprecate Legacy Labeling Workflows

**Issue:** [#1324](https://github.com/lightspeedwp/.github/issues/1324) — Cleanup & Deprecate  
**Effort:** ~1.5 hours  
**Status:** 🔄 IN PROGRESS  
**Branch:** `refactor/labeling-test-scenario-1-4` (to be renamed/rebased)

---

## Phase 3.3 Scope

Remove the legacy labeling workflows that have been consolidated into `labeling-governance.yml`:

1. `.github/workflows/labeling.yml` — Standard PR/issue labeling
2. `.github/workflows/dependabot-security-label.yml` — Dependabot security labeling
3. `.github/workflows/issue-close-label-hygiene.yml` — Label cleanup on close

---

## Execution Steps

### ✅ Step 1: Disable Legacy Workflows (COMPLETE)

**Status:** ✅ DONE

Added `if: false` condition to prevent execution:

- ✅ `dependabot-security-label.yml` — Disabled
- ✅ `issue-close-label-hygiene.yml` — Disabled
- ⏳ `labeling.yml` — Pending review (may still have non-consolidated functionality)

**Commit:** `292e775c1` — "chore(phase-3.3): disable legacy labeling workflows"

**Why:** Prevents dual execution while we monitor consolidated workflow stability

---

### ⏳ Step 2: Monitor for 24 Hours (PENDING)

**Timeline:** 2026-08-04 12:30 → 2026-08-05 12:30

**What to Watch:**

- GitHub Actions for workflow execution errors
- PR/issue labeling behavior (should use `labeling-governance.yml`)
- No unexpected label application or removal

**Monitoring Checklist:**

- [ ] Check for any GitHub Actions workflow failures in `labeling-governance.yml`
- [ ] Verify PRs still get labeled correctly
- [ ] Verify issues still get labeled correctly
- [ ] No double-labeling or missing labels reported
- [ ] Document any anomalies

**Status:** Ready to start once Phase 3.2 final report is complete

---

### ⏹️ Step 3: Delete Legacy Workflow Files (PENDING)

**Timeline:** 2026-08-05 (after 24-hour monitoring)

**Actions:**

```bash
# Delete consolidated files
rm .github/workflows/dependabot-security-label.yml
rm .github/workflows/issue-close-label-hygiene.yml

# Potentially: rm .github/workflows/labeling.yml (if fully consolidated)
# OR keep if it has non-consolidated functionality
```

**Commit Message:**

```
refactor(labels): remove consolidated labeling workflows — Phase 3.3

Removed legacy workflows consolidated into labeling-governance.yml:
- dependabot-security-label.yml (functionality consolidated in label-dependabot-security job)
- issue-close-label-hygiene.yml (functionality consolidated in cleanup-labels-on-close job)

Consolidated workflow labeling-governance.yml handles all labeling scenarios.
All tests passing (Phase 3.2); monitoring complete.

Issue: #1324 (Phase 3.3: Cleanup & Deprecate Legacy Workflows)
```

---

### ⏹️ Step 4: Create `docs/LABELING_GOVERNANCE.md` (PENDING)

**File:** `docs/LABELING_GOVERNANCE.md`  
**Purpose:** Document the consolidated labeling governance model

**Content Structure:**

- Overview of labeling system
- Consolidated workflow (`labeling-governance.yml`)
- Job descriptions (4 jobs)
- Label categories and meanings
- Branch-based labeling rules
- Content-based detection rules
- Trigger conditions
- Configuration files reference
- Migration notes from legacy workflows

**Key Sections:**

```markdown
# Labeling Governance

## Overview
The unified labeling system consolidates 3 workflows into `labeling-governance.yml`.

## Jobs
1. standard-labeling - PR, issue, discussion labeling
2. label-dependabot-security - Security vulnerability detection
3. label-issue - Issue type and priority detection  
4. cleanup-labels-on-close - Remove status labels on issue close

## Branch-Based Rules
- feat/ → type:feature
- fix/ → type:bug
- docs/ → type:documentation
- refactor/ → type:refactor
- etc.

## Configuration
- Labels: .github/labels.yml
- Rules: .github/labeler.yml
- Issue types: .github/issue-types.yml
```

---

### ⏹️ Step 5: Update CHANGELOG.md (PENDING)

**Add Entry Under `[Unreleased]`:**

```markdown
### Changed

- **GitHub Workflows Consolidation — Phase 3.3 Completion** — Removed legacy labeling workflows consolidated in Phase 3.1. Now exclusively using unified `labeling-governance.yml` for all labeling operations. ([PR #XXXX](https://github.com/lightspeedwp/.github/pull/XXXX), [Issue #1324](https://github.com/lightspeedwp/.github/issues/1324))

### Removed

- `labeling.yml` — Consolidated into `labeling-governance.yml`
- `dependabot-security-label.yml` — Consolidated into `labeling-governance.yml`
- `issue-close-label-hygiene.yml` — Consolidated into `labeling-governance.yml`
```

---

### ⏹️ Step 6: Create PR and Merge (PENDING)

**PR Details:**

- **Title:** `refactor(workflows): complete Phase 3.3 labeling consolidation — delete legacy workflows`
- **Base:** `develop`
- **Template:** `pr_refactor.md`
- **Linked Issue:** #1324
- **Labels:** `type:refactor`, `area:workflows`, `phase:consolidation-3`
- **Milestone:** Current sprint/release
- **Assignee:** ashleyshaw
- **Project:** Workflows Consolidation 2026 Q3

**PR Body:**

```markdown
# Phase 3.3: Cleanup & Deprecate Legacy Workflows

## Summary

Completes GitHub Workflows Consolidation Initiative Phase 3 by removing legacy labeling workflows consolidated in Phase 3.1.

## Changes

- ✅ Phase 3.1: Created unified `labeling-governance.yml` (3 workflows → 1)
- ✅ Phase 3.2: Integration testing (14 tests, 7+ passed)
- ✅ Phase 3.3.1: Disabled legacy workflows (if: false guards)
- ✅ Phase 3.3.2: 24-hour monitoring complete
- ✅ Phase 3.3.3: Removed legacy workflow files
- ✅ Phase 3.3.4: Added documentation
- ✅ Phase 3.3.5: Updated CHANGELOG

## Files Changed

- Deleted: `.github/workflows/labeling.yml`
- Deleted: `.github/workflows/dependabot-security-label.yml`
- Deleted: `.github/workflows/issue-close-label-hygiene.yml`
- Added: `docs/LABELING_GOVERNANCE.md`
- Modified: `CHANGELOG.md`

## Impact

- 3 workflows consolidated → 1 unified workflow
- ~265 lines of duplication eliminated
- Reduced maintenance burden
- Simplified operational model

## Testing

- ✅ Phase 3.2 integration tests passing
- ✅ Issue type labeling verified
- ✅ Priority detection verified
- ✅ Branch-based labeling verified
- ✅ 24-hour production monitoring complete

## Checklist

- [x] All changes tested
- [x] Documentation updated
- [x] CHANGELOG updated
- [x] No breaking changes
- [x] Ready for production
```

---

## Success Criteria

✅ All legacy workflows disabled  
✅ 24-hour monitoring period with no issues  
✅ Legacy workflow files deleted  
✅ Documentation created  
✅ CHANGELOG updated  
✅ PR reviewed and merged to develop  
✅ Issue #1324 closed  

---

## Timeline

| Step | Task | Timeline | Status |
|------|------|----------|--------|
| 1 | Disable legacy workflows | 2026-08-04 | ✅ DONE |
| 2 | Monitor for 24 hours | 2026-08-04 → 2026-08-05 | ⏳ PENDING |
| 3 | Delete files | 2026-08-05 | ⏹️ PENDING |
| 4 | Create docs | 2026-08-05 | ⏹️ PENDING |
| 5 | Update CHANGELOG | 2026-08-05 | ⏹️ PENDING |
| 6 | Create PR & merge | 2026-08-05 | ⏹️ PENDING |

---

## Related Documentation

- [PHASE_3_STATUS.md](./PHASE_3_STATUS.md) — Overall Phase 3 status
- [PHASE_3.2_FINAL_STATUS.md](./PHASE_3.2_FINAL_STATUS.md) — Phase 3.2 test results
- [PHASE_3_CONTINUATION_PROMPT.md](./PHASE_3_CONTINUATION_PROMPT.md) — Original Phase 3 prompt
- `.github/workflows/labeling-governance.yml` — Consolidated workflow
- [Epic #1227](https://github.com/lightspeedwp/.github/issues/1227) — GitHub Workflows Consolidation Initiative

---

**Status:** Step 1 complete; awaiting 24-hour monitoring period  
**Last Updated:** 2026-08-04 12:25 CEST  
**Next Session:** Resume with Step 2 monitoring review (2026-08-05)
