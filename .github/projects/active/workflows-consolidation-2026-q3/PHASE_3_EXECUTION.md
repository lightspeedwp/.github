---
name: Phase 3 Execution Plan
title: Labeling & Metadata Workflows Consolidation (Phase 3)
description: Step-by-step execution guide for consolidating labeling workflows
metadata:
  phase: 3
  status: ready
  created: 2026-07-24
  effort_hours: 6-8
  timeline: weeks 9-10
---

# Phase 3: Labeling & Metadata Workflows Consolidation

## Executive Summary

**Phase 3 consolidates 4 labeling-related workflows into 2-3 streamlined workflows**, reducing complexity while maintaining all labeling and metadata governance functionality.

| Metric | Target |
|--------|--------|
| Workflows consolidated | 4 → 2-3 |
| Files deleted | 1-2 |
| Lines of duplication eliminated | ~180 |
| Estimated effort | 6-8 hours |
| Timeline | Weeks 9-10 |
| GHA minutes saved | ~20/week (~85/month) |

---

## Current State Analysis

### Workflows to Consolidate

| Workflow | Trigger | Purpose | Lines |
|----------|---------|---------|-------|
| `labeling.yml` | PR, issues | Core labeling rules | 250 |
| `dependabot-security-label.yml` | PR (Dependabot) | Add security label to Dependabot PRs | 85 |
| `issue-close-label-hygiene.yml` | Issue close | Remove in-progress labels when closing | 95 |
| `metadata-governance.yml` | PR, issues | Enforce milestone/capacity labels | 140 |

### Identified Overlaps & Issues

#### **Overlap 1: Labeling Logic Duplication**

- `labeling.yml` — Comprehensive labeling by branch/content patterns
- `dependabot-security-label.yml` — Standalone Dependabot-specific label
- `issue-close-label-hygiene.yml` — Cleanup on issue closure
- All use similar GitHub Actions patterns and label operations

**Consolidation Opportunity:**

- Merge `dependabot-security-label.yml` into `labeling.yml`
- Add Dependabot-specific job with condition: `dependabot` author check
- Merge `issue-close-label-hygiene.yml` as cleanup job in `labeling.yml`
- Keep `metadata-governance.yml` separate (different scope: milestones vs. labels)

---

#### **Redundancy: Separate Triggers**

- `labeling.yml` triggers on PR/issues events
- `dependabot-security-label.yml` also triggers on PR (overlapping trigger)
- `issue-close-label-hygiene.yml` triggers only on issue close
- Opportunity to consolidate into single workflow with conditional jobs

**Consolidation Opportunity:**

- Single workflow: `labeling-governance.yml`
- Job 1: Standard labeling rules (from `labeling.yml`)
- Job 2: Dependabot security labeling (from `dependabot-security-label.yml`)
- Job 3: Label cleanup on close (from `issue-close-label-hygiene.yml`)
- All conditional: skip if not applicable

---

## Consolidation Design

### New Workflow 1: `labeling-governance.yml`

**Purpose:** Consolidated labeling and label hygiene for PRs and issues

**Triggers:**

- `pull_request` for PR-specific labeling
- `issues` for issue labeling and cleanup
- `workflow_dispatch` for manual re-labeling

**Jobs:**

```yaml
jobs:
  label-pr:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      # From labeling.yml - apply labels based on branch/content
      - uses: actions/checkout@v7
      - name: Identify branch prefix
      - name: Apply label based on branch type
      - name: Apply additional content-based labels
  
  label-dependabot-security:
    if: github.event_name == 'pull_request' && github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      # From dependabot-security-label.yml
      - name: Add security label to Dependabot PR
        run: |
          gh pr edit "$PR_NUMBER" --add-label type:security,deps:automatic

  label-issue:
    if: github.event_name == 'issues' && github.event.action == 'opened'
    runs-on: ubuntu-latest
    steps:
      # From labeling.yml - apply issue labels
      - uses: actions/checkout@v7
      - name: Identify issue type
      - name: Apply issue type label
      - name: Apply priority label if mentioned

  cleanup-on-close:
    if: github.event_name == 'issues' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      # From issue-close-label-hygiene.yml
      - name: Remove in-progress labels
        run: |
          gh issue edit "$ISSUE_NUMBER" --remove-label status:in-progress,priority:urgent
      - name: Remove needs-review label
        run: |
          gh issue edit "$ISSUE_NUMBER" --remove-label status:needs-review
```

**Benefits:**

- Single labeling workflow instead of 2-3
- Consistent trigger handling across PR and issue labeling
- Automatic label cleanup on issue closure
- Reduced Actions runs per event

---

### Metadata Governance (No Change)

**Keep `metadata-governance.yml` separate** — different purpose (milestones/capacity labels vs. general labeling)

---

## Implementation Roadmap

### Phase 3.1: Create New Workflows (3-4 hours)

**Deliverables:**

1. Create `.github/workflows/labeling-governance.yml`
   - Copy labeling logic from `labeling.yml`
   - Add Dependabot job from `dependabot-security-label.yml`
   - Add cleanup job from `issue-close-label-hygiene.yml`
   - Create conditional job structure
   - Estimate: 2 hours

2. Document workflow structure and label rules
   - Create `docs/LABELING_GOVERNANCE.md`
   - Document all labels and their triggers
   - Estimate: 1-2 hours

**Success Criteria:**

- [ ] Consolidated workflow created
- [ ] All logic migrated from source workflows
- [ ] Workflows pass YAML linting
- [ ] No syntax errors

---

### Phase 3.2: Integration Testing (2-3 hours)

**Test Scenarios:**

1. **Standard PR Labeling**
   - [ ] Create PR from `feat/` branch → labeled `type:feature`
   - [ ] Create PR from `fix/` branch → labeled `type:bug`
   - [ ] Create PR from `docs/` branch → labeled `type:documentation`
   - Estimate: 0.5 hours

2. **Dependabot PR Labeling**
   - [ ] Dependabot PR created → automatically labeled `type:security,deps:automatic`
   - [ ] Verify Dependabot-specific job runs
   - Estimate: 0.5 hours

3. **Issue Labeling**
   - [ ] New issue opened → labeled by issue type
   - [ ] Issue with priority mention → labeled `priority:*`
   - Estimate: 0.5 hours

4. **Label Cleanup on Close**
   - [ ] Close issue with `status:in-progress` → label removed
   - [ ] Close PR with `status:needs-review` → label removed
   - [ ] Verify cleanup job runs on close
   - Estimate: 0.5 hours

5. **Regression Testing**
   - [ ] All existing label rules still work
   - [ ] Label names unchanged
   - [ ] Trigger behavior consistent
   - [ ] Performance comparable to originals
   - Estimate: 0.5 hours

**Success Criteria:**

- [ ] All test scenarios passing
- [ ] No regressions in labeling behavior
- [ ] Comments and automation messages unchanged

---

### Phase 3.3: Deprecation & Cleanup (1 hour)

**Steps:**

1. **Disable Old Workflows**
   - Add `if: false` to every job in:
     - `dependabot-security-label.yml`
     - `issue-close-label-hygiene.yml`
   - Keep `labeling.yml` but move logic to new workflow
   - Commit: `chore(labels): disable legacy labeling workflows`

2. **Monitor for Issues** (24 hours)
   - Watch for any GitHub notification of missing workflow
   - Verify new workflow executes correctly
   - Check label application on test PRs/issues

3. **Delete Old Workflows**
   - Delete:
     - `.github/workflows/dependabot-security-label.yml`
     - `.github/workflows/issue-close-label-hygiene.yml`
     - Archive `labeling.yml` (consolidation into new workflow)
   - Commit: `refactor(labels): remove consolidated labeling workflows`

4. **Update Documentation**
   - [ ] Update `.github/workflows/README.md`
   - [ ] Update `docs/LABELING.md` if exists
   - [ ] Add entries to `CHANGELOG.md`

**Success Criteria:**

- [ ] All old workflows disabled/deleted
- [ ] No broken references
- [ ] Documentation updated

---

## Testing Checklist

### Pre-Implementation

- [ ] All source workflows backed up/committed
- [ ] YAML structure reviewed
- [ ] Helper scripts and utilities identified
- [ ] Dependencies documented

### New Workflow Creation

- [ ] `labeling-governance.yml` created
  - [ ] Standard labeling job migrated
  - [ ] Dependabot job added
  - [ ] Cleanup job migrated
  - [ ] Conditional logic correct
  - [ ] Triggers properly configured
  - [ ] YAML valid and formatted

### Integration Testing

- [ ] PR from `feat/` branch tests standard labeling
- [ ] Dependabot PR tests security label
- [ ] Issue creation tests issue labeling
- [ ] Issue closure tests label cleanup
- [ ] Manual dispatch tests available

### Regression Testing

- [ ] Old labeling behavior preserved
- [ ] Label names unchanged
- [ ] Trigger behavior consistent
- [ ] Performance within 20% of original

### Cleanup

- [ ] Old workflows disabled
- [ ] Monitor for 24 hours
- [ ] No errors or missing triggers reported
- [ ] Delete old workflow files
- [ ] Documentation updated

---

## Success Metrics

### Quantitative

- ✅ 3-4 workflows consolidated to 2 (33-50% reduction)
- ✅ ~180 lines of duplication eliminated
- ✅ ~20 GHA minutes/week savings (~85/month)
- ✅ All tests passing
- ✅ Code coverage >90% on new code

### Qualitative

- ✅ Labeling logic easier to understand
- ✅ Label maintenance centralized
- ✅ Dependabot handling unified
- ✅ Team confident in labeling workflows

### Operational

- ✅ No breaking changes to labeling behavior
- ✅ All labels applied consistently
- ✅ Cleanup happens automatically on close
- ✅ Dependabot integration seamless

---

## Rollback Plan

If issues occur during Phase 3:

### Immediate Actions

1. Stop work and preserve new workflow
2. Revert any commits to disabled old workflows
3. Restore old workflows to active state (remove `if: false`)
4. Document the failure

### Investigation

1. Review error logs from failed workflow runs
2. Identify missing logic or misconfiguration
3. Plan fixes before attempting again
4. Create follow-up issue

### Prevention

1. Add additional test coverage for edge case
2. Improve conditional logic if needed
3. Document the issue in workflow comments
4. Create follow-up issue for improved coverage

---

## Timeline

| Task | Est. Hours | Week |
|------|-----------|------|
| Create labeling-governance.yml | 2 | 9 |
| Documentation updates | 1 | 9 |
| Integration testing | 2.5 | 9-10 |
| Disable old workflows | 0.5 | 10 |
| Monitor (24h) | 0 | 10 |
| Delete old workflows | 0.5 | 10 |
| Update documentation | 1 | 10 |
| Code review & merge | 1 | 10 |
| **Total** | **~9 hours** | **9-10** |

---

## Related Issues & Documentation

- **Epic:** #1227 (GitHub Workflows Consolidation Initiative)
- **Phase 2:** Phase 2 Documentation Consolidation (completed)
- **Phase 1:** Phase 1A & 1B (completed)
- **Audit Report:** `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`
- **Project Index:** `projects/active/workflows-consolidation-2026-q3/README.md`

---

**Last Updated:** 2026-07-24  
**Status:** Ready for Implementation  
**Next Step:** Create GitHub issues and begin Phase 3.1

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
