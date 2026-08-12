---
name: Phase 2 Documentation & Validation Consolidation
description: Consolidate README/docs workflows from 3 to 1-2 unified workflows
file_type: documentation
metadata:
  status: active
  phase: implementation
  revised: 2026-07-24
---

# Phase 2: Documentation & Validation Consolidation

## Executive Summary

Consolidate 3 README/documentation workflows into 1-2 unified workflows. Current implementation shows overlapping validation logic across three separate workflows that can be unified.

**Scope Revision (2026-07-24):** Actual workflows differ from original plan. Phase 2 now targets the 3 README workflows, not 5 separate ones.

| Metric | Current | Target | Impact |
|--------|---------|--------|--------|
| Workflows | 3 | 1-2 | -33-67% |
| Code lines | 449 total | ~250 | -44% dedup |
| Actions minutes | ~8-10/month | ~5-6/month | ~35% savings |
| Validation logic | 3x duplicated | Centralized | Single source of truth |

---

## Phase Scope

### Workflows to Consolidate

**Consolidation Target: 3 → 1-2 workflows**

1. **`readme-audit.yml`** (189 lines)
   - Manual, workflow-dispatch triggered
   - 5 conditional jobs: audit, syntax, accessibility, contrast, staleness
   - Scoped audit with format/output options
   - Role: On-demand comprehensive audit

2. **`readme-regen.yml`** (111 lines)
   - Automatic on PR/push with path filters
   - Auto-generates README sections
   - Detects impacted files and regenerates
   - Role: Automatic regeneration on content change

3. **`readme-update.yml`** (149 lines)
   - Manual, workflow-dispatch triggered
   - Dry-run option for previewing changes
   - Mermaid diagram fixes + staleness updates
   - Role: Preventive maintenance on-demand

**Mermaid Validation (No Change):**

- `validate-mermaid-pr.yml` is already consolidated
  - Already includes syntax + accessibility + contrast checks
  - Does not need further consolidation
  - Should integrate into broader validation if appropriate

### Proposed Consolidation Structure

**Option A: Single `documentation.yml` workflow (Recommended)**

```yaml
jobs:
  validate:        # Job 1: Audit (on workflow_dispatch)
    # Syntax validation, accessibility, contrast, staleness
    
  regenerate:      # Job 2: Auto-regenerate (on PR/push)
    # Auto-generate README sections on content change
    
  maintain:        # Job 3: Maintenance (on workflow_dispatch)
    # Mermaid fixes, staleness updates with dry-run option
```

**Workflow Conditions:**

```yaml
on:
  workflow_dispatch:
    inputs:
      action:
        type: choice
        options: [audit, maintain]
      scope: [all, syntax, accessibility, contrast, staleness, mermaid]
      dry_run: [true, false]
  
  pull_request:
    branches: [develop]
    paths: [README files, docs/, scripts/]
  
  push:
    branches: [develop]
    paths: [README files, docs/, scripts/]
```

**Benefits:**

- Single workflow file to maintain
- Clearer intent (action + scope)
- Conditional job execution
- Easier to add new validation types

---

## Implementation Plan

### Step 1: Audit Current Structure (1-2 hours)

- [x] Read all 3 README workflows
- [x] Document overlapping logic
- [x] Identify triggers and conditions
- [x] Map job dependencies
- [x] Create consolidation design

**Status:** ✅ COMPLETE

### Step 2: Design Consolidated Workflow (2-3 hours)

- [ ] Create unified workflow structure
- [ ] Plan condition logic (dispatch action selection)
- [ ] Design job dependencies
- [ ] Document parameter mapping
- [ ] Create test scenarios

### Step 3: Implement Consolidation (4-6 hours)

- [ ] Create `documentation.yml` with all jobs
- [ ] Implement conditional logic
- [ ] Test each job independently
- [ ] Test job orchestration
- [ ] Verify all original functionality preserved

### Step 4: Testing & Validation (2-3 hours)

- [ ] Run full test suite
- [ ] Test on PR creation/update
- [ ] Test workflow_dispatch scenarios
- [ ] Monitor for performance regressions
- [ ] Verify artifact uploads

### Step 5: Documentation & Cleanup (1-2 hours)

- [ ] Update CHANGELOG.md
- [ ] Document new workflow structure
- [ ] Create or update PATTERNS.md
- [ ] Archive old workflow files
- [ ] Delete old workflow files after validation

---

## Workflow Consolidation Details

### Job 1: Audit (workflow_dispatch)

**Current:** `readme-audit.yml` jobs (audit, validate-syntax, check-accessibility, check-contrast, check-staleness)

**Consolidated Job Structure:**

```yaml
audit:
  if: github.event_name == 'workflow_dispatch' && inputs.action == 'audit'
  runs-on: ubuntu-latest
  
  steps:
    - name: Checkout
    - name: Setup Node.js
    - name: Install dependencies
    - name: Run audit (syntax/a11y/contrast/staleness)
    - name: Generate report
    - name: Upload artifacts
```

**Conditions:**

- Only runs on `workflow_dispatch` with `action=audit`
- Parameters: `scope` (all/syntax/accessibility/contrast/staleness)
- Outputs: Audit report, artifacts

### Job 2: Regenerate (PR/push)

**Current:** `readme-regen.yml` (automatic on PR/push)

**Consolidated Job Structure:**

```yaml
regenerate:
  if: |
    github.event_name == 'pull_request' ||
    (github.event_name == 'push' && github.ref == 'refs/heads/develop')
  runs-on: ubuntu-latest
  
  steps:
    - name: Checkout
    - name: Setup Node.js
    - name: Install dependencies
    - name: Identify impacted READMEs
    - name: Regenerate (dry-run on PR)
    - name: Commit (push only)
```

**Conditions:**

- Runs on PR/push to develop
- Dry-run on PR (no commits)
- Auto-commits on push
- Path filter: `**/*.md`, `.github/workflows/**`, `docs/`, `scripts/`

### Job 3: Maintain (workflow_dispatch)

**Current:** `readme-update.yml` (Mermaid fixes + staleness updates)

**Consolidated Job Structure:**

```yaml
maintain:
  if: github.event_name == 'workflow_dispatch' && inputs.action == 'maintain'
  runs-on: ubuntu-latest
  
  steps:
    - name: Checkout
    - name: Setup Node.js
    - name: Install dependencies
    - name: Run Mermaid diagram fixes
    - name: Run staleness updates
    - name: Generate report
    - name: Commit (if not dry-run)
```

**Conditions:**

- Only runs on `workflow_dispatch` with `action=maintain`
- Parameters: `scope` (all/mermaid/staleness), `dry_run` (true/false)
- Outputs: Update report, artifacts

---

## Testing Strategy

### Unit Tests

- Validate each job runs independently
- Test condition logic (correct job runs for inputs)
- Test path filters (files trigger correct jobs)

### Integration Tests

- Test PR workflow: trigger → dry-run → cleanup
- Test push workflow: trigger → commit → verify
- Test dispatch workflows: audit scenario, maintain scenario
- Test cross-job artifact sharing

### Manual Testing Checklist

**Scenario 1: Auto-regenerate on PR**

- [ ] Create PR with README change
- [ ] Verify regenerate job runs
- [ ] Verify dry-run (no commits on PR)
- [ ] Verify artifacts uploaded

**Scenario 2: Auto-regenerate on push**

- [ ] Push to develop with README change
- [ ] Verify regenerate job runs
- [ ] Verify commits added
- [ ] Verify artifacts uploaded

**Scenario 3: Manual audit**

- [ ] Dispatch with action=audit, scope=all
- [ ] Verify audit job runs (all 5 sub-jobs)
- [ ] Verify report generated
- [ ] Verify artifacts uploaded

**Scenario 4: Manual maintain**

- [ ] Dispatch with action=maintain, scope=all, dry_run=false
- [ ] Verify maintain job runs
- [ ] Verify commits added
- [ ] Dispatch with dry_run=true
- [ ] Verify no commits (preview only)

---

## Success Criteria

### Quantitative

- ✅ Reduce workflows from 3 to 1-2
- ✅ Eliminate ~44% code duplication (200 lines)
- ✅ Maintain or improve Actions minute usage (~35% savings)
- ✅ Maintain test coverage (target: >90%)

### Qualitative

- ✅ Clear job naming and organization
- ✅ Single source of truth for README validation
- ✅ Improved developer experience (one workflow vs. three)
- ✅ Zero regressions in existing functionality

---

## Deliverables

### Primary

1. `.github/workflows/documentation.yml` — Unified documentation workflow
2. Updated CHANGELOG.md — Phase 2 consolidation entry
3. Updated PROJECT_INDEX.md — Phase 2 completion status

### Secondary

1. Test suite — Integration tests for consolidated workflow
2. PATTERNS.md update — Document consolidation pattern
3. Archive plan — Old workflow file cleanup schedule

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| Breaking changes | Comprehensive integration tests | Implementer |
| Lost functionality | Line-by-line comparison of all jobs | Reviewer |
| Performance regression | Measure duration pre/post, abort if >15% slower | Reviewer |
| Condition logic errors | Extensive manual testing of each scenario | QA |

---

## Timeline & Effort

| Step | Duration | Effort | Status |
|------|----------|--------|--------|
| Step 1: Audit | 1-2h | Parallel | ✅ COMPLETE |
| Step 2: Design | 2-3h | Sequential | 🟡 IN PROGRESS |
| Step 3: Implement | 4-6h | Sequential | ⏳ READY |
| Step 4: Testing | 2-3h | Sequential | ⏳ READY |
| Step 5: Cleanup | 1-2h | Sequential | ⏳ READY |
| **TOTAL** | **10-16h** | — | — |

**Revised Effort:** 10-16 hours (down from 12-16 estimated)  
**Timeline:** 2-3 weeks at 5-7h/week

---

## Related Documentation

- **Project README:** `.github/projects/active/workflows-consolidation-2026-q3/README.md`
- **Execution Playbook:** `EXECUTION_PLAYBOOK.md`
- **Audit Report:** `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`
- **Testing Strategy:** `TESTING_STRATEGY.md`

---

## Status

- **Phase:** Implementation
- **Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227)
- **Branch:** `refactor/workflows-consolidation-phase-2`
- **Last Updated:** 2026-07-24 (Revised scope: 3 workflows instead of 5)

---

**Next Steps:**

1. Create `documentation.yml` consolidation
2. Implement and test all jobs
3. Create PR linking to Epic #1227
4. Request code review
5. Merge to develop and verify
