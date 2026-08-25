# Develop Branch Stability Initiative

**Objective:** Establish a clean, stable baseline on `develop` so all future PRs branch from a known-good state with no blocking errors.

**Scope:** Review and fix test failures, linting errors, frontmatter validation issues, and workflow/CI problems.

**Duration:** 2026-08-10 (ongoing)

---

## Executive Summary

The `develop` branch is **mostly healthy**:

- ✅ **1109/1109 tests passing** (95 test suites)
- ✅ **Markdown linting: 0 issues** across 1235 files
- ⚠️ **JS linting: 3 unused variable warnings** (quick fix, ~5 minutes)
- ❌ **Frontmatter validation: 587 errors** (scope TBD)
- ⚠️ **Workflow CI failures:** Summary, README validation, changelog, Mergify (known issues being tracked)

**Key Finding:** No critical blockers preventing development, but linting and frontmatter issues should be resolved to maintain code quality standards.

---

## Current State Assessment

### Tests (✅ Passing)

```
Test Suites: 95 passed, 95 total
Tests:       1109 passed, 1109 total
Coverage:    25.36% statements, 72.79% branches, 58.98% functions
```

All test suites pass. Coverage gaps are in untested utilities, not core functionality.

### Markdown Linting (✅ Passing)

```
Files checked: 1235
Issues found: 0
```

No markdown linting issues detected.

### JS/TS Linting (⚠️ 3 Warnings)

```
Issues:      3 warnings, 0 errors
Files:       3
Type:        Unused variables (must use _prefix convention)
```

**Issues:**

1. `scripts/agents/includes/handle-needs-priority.js:23` — unused `currentPriority`
2. `scripts/agents/includes/handle-needs-triage.js:119` — unused `relationships`
3. `scripts/automation/handlers-orchestrator.js:189` — unused `config` parameter

**Action:** Rename to `_currentPriority`, `_relationships`, `_config` to signal intentional unused.

### Frontmatter Validation (❌ 587 Errors)

```
Files validated: 1760
Errors:         587
Warnings:       1723
Skipped:        8156
```

**Status:** Requires audit to determine if errors are:

- Old files in excluded patterns (expected)
- Missing required fields (fixable)
- Invalid field values (needs investigation)

### Workflow/CI Status (⚠️ Known Failures)

From recent Phase 5 GitHub Actions v7 upgrade (PR #1703):

- Summary workflow: Needs investigation
- README validation: Path issues potentially unresolved
- Changelog validation: Known regex issues (documented in KNOWN_ISSUES_FOR_FOLLOWUP.md)
- Mergify: May have stale configuration

---

## Remediation Plan: Three Phases

### Phase 1: Quick Wins (10 minutes) ✅ Planned

**Goal:** Fix 3 JS linting warnings (unused variables).

**Tasks:**

1. Rename `currentPriority` → `_currentPriority` in handle-needs-priority.js
2. Rename `relationships` → `_relationships` in handle-needs-triage.js
3. Rename `config` → `_config` in handlers-orchestrator.js
4. Run `npm run lint:js` to verify all pass

**Expected Outcome:** 0 linting errors, 0 warnings

**Completion Criterion:** `npm run lint:js` returns 0 problems

---

### Phase 2: Frontmatter Audit & Fix (60 minutes) 🔄 Planned

**Goal:** Understand and remediate the 587 frontmatter validation errors.

**Tasks:**

1. **Categorize errors:**
   - Count files missing frontmatter entirely
   - Count files with missing required fields
   - Count files with invalid field values
   - Identify patterns (e.g., all errors in one folder?)

2. **Triage by severity:**
   - **High:** Files that MUST have frontmatter (agents, skills, instructions)
   - **Medium:** Files that SHOULD have frontmatter (documentation)
   - **Low:** Files where missing frontmatter is acceptable

3. **Remediate high-priority errors:**
   - Add missing frontmatter to agents, skills, instructions
   - Fix invalid field values
   - Update schema exclusions if needed

4. **Document decisions:**
   - Which error patterns are acceptable?
   - Which files should be excluded from validation?
   - Any schema changes needed?

**Expected Outcome:** Reduce errors to < 50 (only expected/acceptable cases)

**Completion Criterion:** Run validation, document rationale for remaining errors

---

### Phase 3: Workflow/CI Validation (Variable) 🔄 Planned

**Goal:** Identify and document workflow CI failures; create follow-up PRs if needed.

**Tasks:**

1. **Identify failing workflows:**
   - Check GitHub Actions runs on recent PRs
   - Document which workflows fail and why
   - Gather error messages and logs

2. **Triage known issues:**
   - Review KNOWN_ISSUES_FOR_FOLLOWUP.md from v7 upgrade project
   - Map failures to known issues
   - Identify new issues not yet documented

3. **Categorize by severity:**
   - **Blocking:** Prevents PRs from merging
   - **Non-blocking:** CI runs but with warnings
   - **Pre-merge:** Runs only on manual trigger

4. **Create follow-up tickets:**
   - Document each failure with reproduction steps
   - Link to related PRs/issues
   - Assign priority and owner

**Expected Outcome:** Clear list of blocking vs. non-blocking issues; roadmap for fixes

**Completion Criterion:** All workflows running, blocking issues identified with follow-up PR plan

---

## Known Issues from Related Projects

### GitHub Actions v7 Upgrade (PR #1703)

**File:** `.github/projects/active/github-actions-v7-upgrade-2026-08-09/KNOWN_ISSUES_FOR_FOLLOWUP.md`

**Summary:** 3 major issues identified in release/changelog agents:

1. **Release Agent Data Corruption Risk**
   - `gitOps` hardcodes `process.cwd()` instead of accepting directory parameter
   - Risk: When used as portable API, can modify caller's repository
   - **Priority:** P1 (Security)

2. **Changelog Validation Regex Bugs**
   - Validation allows undated versions (should require `YYYY-MM-DD`)
   - Regex errors: `\z` not valid in JS, unescaped metacharacters
   - **Priority:** P2 (Correctness)

3. **Test Expectations Misalignment**
   - Tests codify arbitrary behavior instead of verifying handler API
   - May mask logic bugs in issue triage automation
   - **Priority:** P2 (Testing)

**Status:** Identified, awaiting follow-up PRs. Not blocking develop stability.

---

## Success Criteria

✅ **Develop branch is stable when:**

1. All tests pass (1109/1109)
2. No linting errors (0 errors, 0 warnings)
3. Markdown linting clean (0 issues)
4. Frontmatter validation < 50 errors (only expected cases)
5. All blocking workflow issues documented with fix plan
6. All future PRs branch from this clean state

---

## Branch & PR Info

- **Branch:** `chore/develop-branch-stability`
- **Base Branch:** `develop`
- **PR:** [#1713](https://github.com/lightspeedwp/.github/pull/1713) — Establish develop branch stability baseline
- **Created:** 2026-08-10T18:26 CEST
- **Status:** PR Created (Awaiting Review & Merge)

---

## Timeline

| Phase | Task | Status | Target |
| --- | --- | --- | --- |
| 1 | Fix 3 linting warnings | 🔄 Ready | 10 min |
| 1 | Verify `npm run lint:js` passes | ⏳ Pending | 1 min |
| 2 | Categorize 587 frontmatter errors | ⏳ Pending | 15 min |
| 2 | Remediate high-priority errors | ⏳ Pending | 30 min |
| 2 | Document decisions | ⏳ Pending | 15 min |
| 3 | Audit workflow failures | ⏳ Pending | 20 min |
| 3 | Create follow-up tickets | ⏳ Pending | 20 min |
| **Total** | **All phases** | **🔄 In Progress** | **~110 min** |

---

## Issues & Follow-Up Work

**See OPENSPEC_ANALYSIS.md for comprehensive issue documentation**

### P1 (High Priority - Non-Blocking)

- **Release Agent Data Corruption Risk:** `gitOps.cjs` hardcodes `process.cwd()`. Fix: accept working directory parameter, add regression test, add branch validation, add pre-PR push step. Effort: 6–8 hrs.

### P2 (Medium Priority - Non-Blocking)

- **Changelog Validation Regex Bugs:** Multiple regex errors in `keepAChangelogParser.cjs`. Fix: `\z` → `$`, escape metacharacters, fix hyphenation detection. Effort: 3–4 hrs.
- **Test Expectations Misalignment:** Tests codify arbitrary behavior. Fix: audit handler API, update test expectations, add edge case tests. Effort: 4–5 hrs.

### P3 (Low Priority - Documentation)

- **Discussion Template Schema Refinement:** Schema mismatches despite valid fields. Action: document acceptable exceptions or update validation rules.

---

## Related Files

- **Branch:** `chore/develop-branch-stability` (current work)
- **Project Tracking:** `.github/projects/active/develop-branch-stability-2026-08-10/`
  - **PROJECT_README.md** ← You are here
  - **OPENSPEC_ANALYSIS.md** ← Comprehensive issue & metrics documentation
  - **SUMMARY.md** ← Session summary
  - **PHASE_1_LINTING_FIXES.md** ← Complete ✅
  - **PHASE_2_FRONTMATTER_AUDIT.md** ← In Progress 🔄
  - **PHASE_3_WORKFLOW_VALIDATION.md** ← Ready 📋
- **Related Projects:**
  - `github-actions-v7-upgrade-2026-08-09/` (PR #1703 known issues)
  - `github-projects-creation-system/` (project structure reference)
- **Key Scripts:**
  - `npm test` — Run all tests
  - `npm run lint:js` — Check JS linting
  - `npm run lint:md` — Check Markdown linting
  - `npm run validate:frontmatter` — Validate frontmatter

---

**Owner:** @ash (LightSpeed AI Ops)  
**Status:** In Progress (Phase 1 ✅ | Phase 2A 🔄 | Phase 2B–3 📋)  
**Last Updated:** 2026-08-10T18:55 CEST
