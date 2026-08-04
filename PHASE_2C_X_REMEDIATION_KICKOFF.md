---
file_type: project_document
description: Phase 2C.X Remediation Phase kickoff with detailed task breakdown
date: 2026-08-04
author: Claude Haiku 4.5
status: ready-to-execute
---

# Phase 2C.X Remediation Phase — Kickoff Document

**Status:** 🚀 READY TO EXECUTE  
**Branch:** `test/phase-2c-remediation` (created from develop with merged audit)  
**Parent:** Issue #1461 (Script Organization Architecture)  
**Scope:** Resolve dual paths + update 49 file references  
**Effort:** 10-13 hours  
**Start Date:** 2026-08-04

---

## Executive Summary

Phase 2C.X is the remediation phase that completes Phase 2B execution. All testing is complete (1,114 tests passing), but critical dual-path and reference issues identified during Phase 2C audit must be resolved before final merge to develop.

### What's Done ✅

- PR #1493 (audit documentation) merged to develop
- All findings documented and issues updated
- New branch `test/phase-2c-remediation` created and ready
- Clear remediation roadmap provided

### What's Next 🔄

- Execute Phase 2C.X.1: Resolve dual paths (2-3 hours)
- Execute Phase 2C.X.2: Update workflows (3-4 hours)
- Execute Phase 2C.X.3: Update documentation (1-2 hours)
- Execute Phase 2C.X.4: Validation & testing (1 hour)
- Execute Phase 2C.X.5: Final PR & merge (1-2 hours)

---

## Critical Issues to Resolve

### Issue 1: Dual Path Problem 🔴

**Current State:**

- `.github/scripts/`: 107 files (old location)
- `scripts/`: 217 files (new location)
- Duplicated: ~54 files in BOTH locations

**Resolution Strategy:**

**Step 1: Identify Duplicates**

```bash
# Find files that exist in both locations
for file in $(ls scripts/agents/includes/*.js scripts/validation/*.js scripts/workflows/**/*.cjs 2>/dev/null); do
  basename_file=$(basename "$file")
  if [ -f ".github/scripts/${basename_file}" ]; then
    echo "DUPLICATE: $basename_file"
  fi
done
```

**Step 2: Determine Authoritative Location**

- Portable scripts (validation, agents, workflow utilities) → `scripts/`
- GitHub-only scripts (using @actions/github, core.setOutput) → `.github/scripts/`
- Workflow integrations → Evaluate per-script

**Step 3: Consolidate**

- Move portable scripts to `scripts/` if not already there
- Remove duplicates from old location
- Keep GitHub-only scripts in `.github/scripts/`
- Verify no orphaned files

**Step 4: Commit**

```bash
git add scripts/
git rm .github/scripts/[portable-files]
git commit -m "fix: resolve dual path problem by consolidating scripts

- Move portable scripts to scripts/ (117 files total)
- Remove duplicates from .github/scripts/
- Keep GitHub-only scripts in .github/scripts/ (50 files)
- Complete Phase 2C.X.1 resolution

Fixes Issue #1461 blocking condition.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Issue 2: Workflow Reference Updates 🔴

**Workflows to Update:** 21 files

**Update Pattern:**

```yaml
# BEFORE
run: node .github/scripts/workflows/assign-milestones-workflow.js

# AFTER
run: node scripts/workflows/assign-milestones-workflow.js
```

**Workflows List:**

**Priority 1 (High Impact):**

1. `.github/workflows/labeling.yml`
   - Update: `.github/scripts/agents/run-labeling-agent.cjs`
   - To: Verify location (GitHub-only agent)

2. `.github/workflows/labeling-governance.yml`
   - Update: `.github/scripts/agents/run-labeling-agent.cjs`
   - To: Verify location (GitHub-only agent)

3. `.github/workflows/release.yml`
   - Update: `.github/scripts/workflows/release/trigger-telemetry.cjs`
   - Determine: Portable or GitHub-specific?

4. `.github/workflows/changelog-management.yml`
   - Status: ✅ Already using scripts/ (review reference)

5. `.github/workflows/metadata-governance.yml`
   - Status: ✅ Already using scripts/ (review reference)

**Priority 2 (Medium Impact):**
6. `.github/workflows/issue-remediation-bulk.yml`
7. `.github/workflows/issues.yml`
8. `.github/workflows/reviewer.yml`
9. `.github/workflows/planner.yml`
10. `.github/workflows/meta.yml`
11. `.github/workflows/docs-maintenance.yml`
12. `.github/workflows/docs-validation.yml`
13. `.github/workflows/documentation.yml`
14. `.github/workflows/metrics-pipeline.yml`
15. `.github/workflows/metrics-reporting.yml`
16. `.github/workflows/project-archival.yml`
17-21. (and 5 more workflows)

**Execution Pattern:**

```bash
# For each workflow:
1. Read workflow file
2. Identify all .github/scripts/ references
3. Determine correct path for each reference
4. Update path
5. Test with dry-run (if applicable)
6. Commit with clear message
```

**Commit Template:**

```bash
git commit -m "fix: update workflow references for Phase 2C.X remediation

Workflows updated:
- [workflow-name].yml: Updated [count] references

References changed from .github/scripts/ to portable locations.
Part of Phase 2C.X.2 (workflow reference updates).

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Issue 3: Documentation Reference Updates 🟠

**Documentation Files to Update:** 28 files

**Files List:**

- docs/AUTOMATION.md
- docs/LABELING.md
- docs/RELEASE_PROCESS.md
- docs/METRICS.md
- docs/CHANGELOG_AUTOMATION.md
- docs/MAINTENANCE.md
- docs/ISSUE_TRIAGE_AUTOMATION.md
- docs/agents/AGENT_ARCHITECTURE.md
- docs/agents/PLANNER_RUNBOOK.md
- docs/agents/REVIEWER_RUNBOOK.md
- (and 18 more documentation files)

**Update Pattern:**

```markdown
# BEFORE
See `.github/scripts/agents/` for agent implementations

# AFTER
See `scripts/agents/includes/` for portable agent libraries
See `.github/scripts/agents/` for GitHub-specific agents
```

**Execution Pattern:**

```bash
# For each documentation file:
1. Read file for script references
2. Update .github/scripts/ references to correct paths
3. Add note about portable vs GitHub-only structure
4. Test that examples still work
5. Commit with clear message
```

**Commit Template:**

```bash
git commit -m "docs: update script references for portable structure

Updated [count] documentation files with correct script paths:
- Portable scripts: scripts/ (validation, agents, workflows)
- GitHub-only scripts: .github/scripts/ (agents, workflow adapters)

Part of Phase 2C.X.3 (documentation reference updates).

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Detailed Task Breakdown

### Phase 2C.X.1: Resolve Dual Path Problem (2-3 hours)

**Subtasks:**

- [ ] Identify all duplicate files between locations
- [ ] Audit each portable script location
- [ ] Remove duplicates from `.github/scripts/`
- [ ] Verify GitHub-only scripts remain in `.github/scripts/`
- [ ] Run full test suite to verify no breaks
- [ ] Commit changes

**Success Criteria:**

- [ ] `.github/scripts/` contains only GitHub-specific scripts (~50 files)
- [ ] `scripts/` contains all portable scripts (~220 files)
- [ ] No duplicates in both locations
- [ ] All 1,114 tests still passing
- [ ] All validators still working

---

### Phase 2C.X.2: Update Workflow References (3-4 hours)

**Subtasks:**

- [ ] Audit all 21 workflows for `.github/scripts/` references
- [ ] Update each workflow with correct path
- [ ] Test workflow syntax (spectral lint)
- [ ] Commit per workflow or per group
- [ ] Run workflow linting: `npm run lint:workflows`

**Success Criteria:**

- [ ] All 21 workflows updated
- [ ] Spectral YAML linting: 0 errors
- [ ] All workflows have correct paths
- [ ] No regressions in workflow execution

---

### Phase 2C.X.3: Update Documentation References (1-2 hours)

**Subtasks:**

- [ ] Identify all documentation files with old references
- [ ] Update paths in each documentation file
- [ ] Add clarity about portable vs GitHub-only structure
- [ ] Commit documentation updates

**Success Criteria:**

- [ ] All 28 documentation files updated
- [ ] Documentation reflects new structure
- [ ] Examples in docs are accurate
- [ ] No broken links

---

### Phase 2C.X.4: Path Validation & Testing (1 hour)

**Subtasks:**

- [ ] Run `npm test` (verify 1,114+ tests pass)
- [ ] Run `npm run validate:all` (verify all validators work)
- [ ] Audit schema path references
- [ ] Verify no path resolution errors
- [ ] Check for regressions

**Success Criteria:**

- [ ] 1,114+ tests passing
- [ ] All validators operational
- [ ] 0 path resolution errors
- [ ] 0 regressions detected
- [ ] All checks passing

---

### Phase 2C.X.5: Archive & Closure (1-2 hours)

**Subtasks:**

- [ ] Create follow-up PR to develop
- [ ] Document all changes in PR description
- [ ] Link to original audit (PR #1493)
- [ ] Update issue comments with completion status
- [ ] Merge PR to develop
- [ ] Close related issues (#1461, #1464, #1465)
- [ ] Update epic #1376

**PR Description Template:**

```markdown
## Phase 2C.X Remediation — Dual Path Resolution & Reference Updates

Completes Phase 2B execution by resolving critical dual-path problem and updating all script references.

### Changes Included

**Phase 2C.X.1: Resolve Dual Paths**
- Consolidated portable scripts to root-level scripts/
- Removed duplicates from .github/scripts/
- Kept GitHub-only scripts in .github/scripts/
- [Commit hashes]

**Phase 2C.X.2: Update Workflow References**
- Updated 21 workflows with correct script paths
- All workflows tested and linted
- [Commit hashes]

**Phase 2C.X.3: Update Documentation References**
- Updated 28 documentation files with correct paths
- Added clarity about portable vs GitHub-only structure
- [Commit hashes]

**Phase 2C.X.4: Full Testing**
- All 1,114+ tests passing ✅
- All validators operational ✅
- 0 regressions detected ✅

Closes #1461, #1464, #1465
Completes Phase 2B/2C initiative

[Full details and testing results...]
```

**Success Criteria:**

- [ ] All commits squashed or organized logically
- [ ] PR description comprehensive and clear
- [ ] All issues properly linked and closed
- [ ] Epic updated with completion status
- [ ] Merged to develop successfully

---

## Testing & Validation

### Before Each Phase

```bash
# Verify no regressions
npm test
npm run validate:all
```

### After Entire Remediation

```bash
# Full validation suite
npm run check
# Lint all files
npm run lint:all
# Validate everything
npm run validate:all
```

### Required Test Results

```
Test Suites: 116+ passing
Tests: 1,114+ passing
Linting: 0 errors
Validators: 13/13 passing
Coverage: 81%+ on critical code
Regressions: 0
```

---

## Time Estimate Breakdown

| Task | Est. Time | Actual | Notes |
|------|-----------|--------|-------|
| 2C.X.1: Resolve dual paths | 2-3 hrs | — | Identify & consolidate |
| 2C.X.2: Update workflows | 3-4 hrs | — | 21 files to update |
| 2C.X.3: Update docs | 1-2 hrs | — | 28 files to update |
| 2C.X.4: Validation | 1 hr | — | Full test suite |
| 2C.X.5: PR & merge | 1-2 hrs | — | Documentation & closure |
| **Total** | **10-13 hrs** | — | **Complete Phase 2B** |

---

## Success Criteria (Phase 2C Complete)

- [x] PR #1493 (audit documentation) merged to develop ✅
- [ ] Dual paths resolved (Phase 2C.X.1)
- [ ] 21 workflow references updated (Phase 2C.X.2)
- [ ] 28 documentation files updated (Phase 2C.X.3)
- [ ] All 1,114+ tests passing (Phase 2C.X.4)
- [ ] All validators operational (Phase 2C.X.4)
- [ ] 0 regressions (Phase 2C.X.4)
- [ ] Follow-up PR merged to develop (Phase 2C.X.5)
- [ ] Issues #1461, #1464, #1465 closed (Phase 2C.X.5)
- [ ] Epic #1376 marked complete (Phase 2C.X.5)

---

## Related Documents

**Audit Documentation (in PR #1493, merged to develop):**

- PHASE_2B_EXECUTION_PLAN.md
- SCRIPTS_INVENTORY.md
- 2026-08-04-CRITICAL-AUDIT-SUMMARY.md
- 2026-08-04-phase-2c-script-testing.md

**Issue Comments with Details:**

- #1461: Comprehensive audit findings
- #1464: Phase 2B status update
- #1465: Phase 2C testing results

---

## Ready to Execute

This branch (`test/phase-2c-remediation`) is ready for Phase 2C.X work to begin. All 5 phases documented with clear success criteria and testing requirements.

**Next Action:** Begin Phase 2C.X.1 (Resolve Dual Path Problem)

---

**Created:** 2026-08-04  
**Status:** Ready for execution  
**Time to Complete:** 10-13 hours  
**Expected Completion:** After Phase 2C.X.5 execution + merge
