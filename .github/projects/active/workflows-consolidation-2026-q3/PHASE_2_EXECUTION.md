---
name: Phase 2 Execution Plan
title: Documentation Workflows Consolidation (Phase 2)
description: Step-by-step execution guide for consolidating documentation workflows
metadata:
  phase: 2
  status: active
  created: 2026-07-24
  effort_hours: 12-16
  timeline: weeks 5-8
---

# Phase 2: Documentation Workflows Consolidation

## Executive Summary

**Phase 2 consolidates 4 documentation-related workflows into 2 streamlined workflows**, reducing complexity and improving maintainability.

| Metric | Target |
|--------|--------|
| Workflows consolidated | 4 → 2 |
| Files deleted | 2 |
| Lines of duplication eliminated | ~150 |
| Estimated effort | 12-16 hours |
| Timeline | Weeks 5-8 |
| GHA minutes saved | ~40/week (~170/month) |

---

## Current State Analysis

### Workflows to Consolidate

| Workflow | Trigger | Purpose | Lines |
|----------|---------|---------|-------|
| `readme-regen.yml` | PR, push (develop) | Auto-regenerate README | 120 |
| `readme-update.yml` | dispatch, workflow_call | Manual README/Mermaid update | 85 |
| `readme-audit.yml` | dispatch | Audit README quality | 180 |
| `validate-mermaid-pr.yml` | PR | Validate Mermaid diagrams | 220 |

### Identified Overlaps & Issues

#### **Overlap 1: README Regeneration Duplication**

- `readme-regen.yml` — Auto-regenerates on file changes (PR/push)
- `readme-update.yml` — Manual dispatch for README updates
- Both use similar Node.js setup and npm scripts

**Consolidation Opportunity:**

- Merge into single workflow with conditional jobs
- Job 1: Auto-regen (triggered by PR/push on docs changes)
- Job 2: Manual update (triggered by dispatch)

---

#### **Overlap 2: Validation Scattered**

- `validate-mermaid-pr.yml` — Standalone Mermaid validation
- No dedicated docs structure validation
- Validation logic can be unified with readme-audit

**Consolidation Opportunity:**

- Create `docs-validation.yml` with validation jobs
- Job 1: Mermaid validation (from validate-mermaid-pr.yml)
- Job 2: README structure checks (reuse audit logic)

---

#### **Redundancy: readme-audit.yml**

- Manual dispatch only (low frequency)
- Could be incorporated into docs-maintenance.yml
- Provides comprehensive audit with multiple scopes

**Consolidation Opportunity:**

- Move to docs-maintenance.yml as scheduled/manual job
- Runs weekly + on-demand dispatch

---

## Consolidation Design

### New Workflow 1: `docs-validation.yml`

**Purpose:** Automated validation of documentation changes on PRs

**Triggers:**

- `pull_request` on docs-related files
- `pull_request` with `.md` file changes
- Manual dispatch for validation

**Jobs:**

```yaml
jobs:
  validate-mermaid:
    runs-on: ubuntu-latest
    steps:
      # From validate-mermaid-pr.yml
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - name: Identify changed files using git diff
        id: changed
        run: |
          # Derive changed files via git diff since pull_request.files is not 
          # always present (especially when PR title doesn't contain 'docs')
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            BASE="${{ github.event.pull_request.base.sha }}"
            HEAD="${{ github.event.pull_request.head.sha }}"
          else
            BASE="${{ github.event.before }}"
            HEAD="${{ github.sha }}"
          fi
          git diff --name-only "$BASE" "$HEAD" -- '*.md' '*.mdx' > /tmp/changed_files.txt
          echo "files=$(cat /tmp/changed_files.txt | tr '\n' ',')" >> "$GITHUB_OUTPUT"
      - name: Setup Node.js
      - name: Install dependencies
      - name: Check for Mermaid diagrams in changed files
        id: has_diagrams
        run: |
          CHANGED="${{ steps.changed.outputs.files }}"
          if grep -q '```mermaid' $CHANGED; then
            echo "result=true" >> "$GITHUB_OUTPUT"
          fi
      - name: Validate Mermaid diagrams
        if: steps.has_diagrams.outputs.result == 'true'
        run: npm run validate:mermaid-syntax && npm run validate:mermaid-accessibility
      - name: Validate colour contrast (WCAG 2.2 AA)
        if: steps.has_diagrams.outputs.result == 'true'
        run: npm run validate:mermaid-contrast
      - name: Post comment on PR
        if: github.event_name == 'pull_request' && steps.has_diagrams.outputs.result == 'true'
        run: |
          # Post validation results as PR comment

  validate-readme:
    runs-on: ubuntu-latest
    steps:
      # From readme-audit.yml (validation aspects)
      - uses: actions/checkout@v7
      - name: Validate README structure
      - name: Check frontmatter
      - name: Post comment on PR
```

**Benefits:**

- Single validation workflow for PR feedback
- Unified error reporting
- Reduced noise in workflow runs

---

### New Workflow 2: `docs-maintenance.yml`

**Purpose:** Scheduled and manual documentation maintenance

**Triggers:**

- `schedule` (weekly audit)
- `workflow_dispatch` (manual maintenance)
- `push` to develop (auto-regen README)

**Jobs:**

```yaml
jobs:
  regen-readme:
    if: |
      (github.event_name == 'pull_request' && github.base_ref == 'develop') ||
      (github.event_name == 'push' && github.ref == 'refs/heads/develop')
    runs-on: ubuntu-latest
    steps:
      # From readme-regen.yml
      - uses: actions/checkout@v7
      - name: Regenerate README (dry-run on PR, commit on push)
        run: |
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            node scripts/agents/meta.agent.js --dry-run --files "${{ env.CHANGED_FILES }}"
          else
            node scripts/agents/meta.agent.js --files "${{ env.CHANGED_FILES }}"
            git add -A
            git commit -m "chore(readme): regenerate impacted README files [skip ci]"
            git push
          fi

  audit-docs:
    if: github.event_name == 'schedule' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    steps:
      # From readme-audit.yml
      - uses: actions/checkout@v7
      - name: Run comprehensive README audit
      - name: Generate audit report
      - name: Post to discussion/issue
      
  manual-update:
    if: github.event_name == 'workflow_dispatch' && 
        github.event.inputs.action == 'update'
    runs-on: ubuntu-latest
    steps:
      # From readme-update.yml
      - uses: actions/checkout@v7
      - name: Manual README update
      - name: Update Mermaid diagrams
```

**Benefits:**

- All maintenance tasks in single workflow
- Scheduled audit prevents documentation drift
- Manual maintenance easily accessible

---

## Implementation Roadmap

### Phase 2.1: Create New Workflows (4-5 hours)

**Deliverables:**

1. Create `.github/workflows/docs-validation.yml`
   - Copy validation logic from `validate-mermaid-pr.yml`
   - Extract README validation from `readme-audit.yml`
   - Create conditional job structure
   - Estimate: 2 hours

2. Create `.github/workflows/docs-maintenance.yml`
   - Copy auto-regen logic from `readme-regen.yml`
   - Copy audit logic from `readme-audit.yml`
   - Copy manual update logic from `readme-update.yml`
   - Create conditional job structure with proper scheduling
   - Estimate: 2 hours

3. Extract shared utilities (if needed)
   - Identify common helpers
   - Create `scripts/docs/helpers.js` if reusable logic exists
   - Estimate: 1 hour

**Success Criteria:**

- [ ] Both new workflows created
- [ ] All logic migrated from source workflows
- [ ] Workflows pass YAML linting
- [ ] No syntax errors

---

### Phase 2.2: Integration Testing (4-5 hours)

**Test Scenarios:**

1. **docs-validation.yml**
   - [ ] Mermaid validation on PR with diagram changes
   - [ ] README validation on PR with README changes
   - [ ] Both validations run when both file types changed
   - [ ] Proper error messages posted to PR
   - [ ] Manual dispatch triggers validation
   - Estimate: 2 hours (create test PRs, verify outputs)

2. **docs-maintenance.yml**
   - [ ] README auto-regen on push to develop
   - [ ] README creates PR when changes detected
   - [ ] Manual update dispatches correctly
   - [ ] Audit job runs on schedule
   - [ ] Audit report generates correctly
   - Estimate: 2 hours (test dispatch, verify scheduling)

3. **Regression Testing**
   - [ ] All existing validation checks still work
   - [ ] No changes to comment format/content
   - [ ] Error messages unchanged
   - [ ] Performance comparable to original workflows
   - Estimate: 1 hour

**Success Criteria:**

- [ ] All test scenarios passing
- [ ] No regressions in documentation workflow behavior
- [ ] Comments and reports format unchanged

---

### Phase 2.3: Deprecation & Cleanup (2-3 hours)

**Steps:**

1. **Disable Old Workflows** (in this order)
   - **Method:** Add `if: false` to every job in:
     - `validate-mermaid-pr.yml`
     - `readme-regen.yml`
     - `readme-update.yml`
     - `readme-audit.yml`
   - **Note:** GitHub Actions doesn't support workflow-level `if` conditions, so each job must have `if: false` added individually
   - Commit: "chore(docs): disable legacy workflows during Phase 2"

2. **Monitor for Issues** (24-48 hours)
   - Watch for any GitHub notification of missing workflows
   - Ensure no critical workflows fail
   - Verify new workflows execute correctly

3. **Delete Old Workflows**
   - Delete:
     - `.github/workflows/validate-mermaid-pr.yml`
     - `.github/workflows/readme-regen.yml`
     - `.github/workflows/readme-update.yml`
     - `.github/workflows/readme-audit.yml`
   - Commit: "refactor(docs): remove consolidated documentation workflows"
   - Update `.github/workflows/README.md` to reflect new structure

4. **Update Documentation**
   - [ ] Update `.github/workflows/README.md`
   - [ ] Create/update `docs/DOCUMENTATION_WORKFLOWS.md`
   - [ ] Add entries to `CHANGELOG.md`

**Success Criteria:**

- [ ] All old workflows disabled/deleted
- [ ] No broken references to old workflows
- [ ] Documentation updated
- [ ] Changes committed and pushed

---

## Testing Checklist

### Pre-Implementation

- [ ] All source workflows backed up/committed
- [ ] YAML structure of source workflows reviewed
- [ ] All helper scripts and utilities identified
- [ ] Dependencies documented

### New Workflow Creation

- [ ] `docs-validation.yml` created
  - [ ] Mermaid validation job migrated
  - [ ] README validation job added
  - [ ] Conditional logic correct
  - [ ] Triggers properly configured
  - [ ] YAML valid and formatted

- [ ] `docs-maintenance.yml` created
  - [ ] Auto-regen job migrated
  - [ ] Audit job migrated
  - [ ] Manual update job migrated
  - [ ] Scheduling correct
  - [ ] YAML valid and formatted

### Integration Testing

- [ ] Create test PR with Mermaid diagram changes
  - Verify: docs-validation.yml triggers mermaid job
  - Verify: Proper comment posted to PR

- [ ] Create test PR with README changes
  - Verify: docs-validation.yml triggers readme job
  - Verify: Proper comment posted to PR

- [ ] Create test PR with both changes
  - Verify: Both jobs run
  - Verify: Both comments posted

- [ ] Test manual dispatch
  - Verify: docs-maintenance.yml responds to dispatch
  - Verify: Selected job runs

- [ ] Test push to develop
  - Verify: readme-regen job triggers
  - Verify: README updated/PR created if needed

- [ ] Verify scheduling
  - [ ] Audit scheduled correctly
  - [ ] No schedule conflicts

### Regression Testing

- [ ] Old validation behavior preserved
- [ ] Error messages unchanged
- [ ] Comment format unchanged
- [ ] No missing validation checks
- [ ] Performance within 20% of original

### Cleanup

- [ ] Old workflows disabled (if: false)
- [ ] Monitor for 24-48 hours
- [ ] No errors or missing triggers reported
- [ ] Delete old workflow files
- [ ] Documentation updated

---

## Success Metrics

### Quantitative

- ✅ 4 workflows consolidated to 2 (50% reduction)
- ✅ ~150 lines of duplication eliminated
- ✅ ~40 GHA minutes/week savings (~170/month)
- ✅ All tests passing
- ✅ Code coverage >90% on new code

### Qualitative

- ✅ Documentation validation easier to understand
- ✅ Maintenance tasks centralized
- ✅ Scheduling conflicts resolved
- ✅ Team confident in doc workflows

### Operational

- ✅ No breaking changes to doc workflow behavior
- ✅ Error messages unchanged
- ✅ Comment format consistent
- ✅ Manual maintenance easily discoverable

---

## Rollback Plan

If issues occur during Phase 2:

### Immediate Actions

1. Stop work and don't delete old workflows yet
2. Revert any commits to new workflows
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
4. Create follow-up issue for improved validation

---

## Timeline

| Task | Est. Hours | Week |
|------|-----------|------|
| Create docs-validation.yml | 2 | 5 |
| Create docs-maintenance.yml | 2 | 5 |
| Extract shared utilities | 1 | 5 |
| Integration testing | 4 | 5-6 |
| Disable old workflows | 0.5 | 6 |
| Monitor (24-48h) | 0 | 6 |
| Delete old workflows | 0.5 | 6 |
| Update documentation | 1.5 | 6 |
| Code review & merge | 1.5 | 7 |
| **Total** | **~14 hours** | **5-7** |

---

## Related Issues & Documentation

- **Epic:** #1227 (GitHub Workflows Consolidation Initiative)
- **Related PRs:** (to be created)
- **Audit Report:** `.github/reports/workflows/WORKFLOWS-CONSOLIDATION-AUDIT.md`
- **Project Index:** `projects/active/workflows-consolidation-2026-q3/README.md`

---

**Last Updated:** 2026-07-24  
**Status:** Ready for Implementation  
**Next Step:** Create GitHub issues and begin Phase 2.1

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
