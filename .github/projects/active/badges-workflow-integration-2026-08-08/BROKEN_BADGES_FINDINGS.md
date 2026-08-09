---
title: "Broken Badges Audit — Detailed Findings"
description: "Analysis of 12 broken badge links that were removed from VERSIONING.md"
file_type: "documentation"
status: "active"
created_date: "2026-08-08"
last_updated: "2026-08-09"
version: "v1.1.0"
authors: ["Ash Shaw", "Claude"]
tags: ["badges", "broken-links", "workflow-audit", "documentation"]
---

# Broken Badges Audit — Detailed Findings

**Incident:** 12 broken workflow badge links in `docs/VERSIONING.md`  
**Discovery:** Commit 427b7ed62 (2026-08-07)  
**Resolution:** Links removed (temporary fix) — this project provides permanent solution  
**Root Cause:** Workflows were renamed/deleted without updating documentation

---

## Executive Summary

The `docs/VERSIONING.md` file contained badge links to 12 non-existent GitHub Actions workflows. These badges returned 404 errors and caused CI validation failures on PR #1639. The broken links were removed (commit 427b7ed62), but this document identifies:

1. **What broke** — 12 specific workflow references
2. **Why it broke** — Root causes for each
3. **What it teaches us** — How to prevent recurrence
4. **What we're building** — Automated validation to catch this earlier

---

## Broken Badge Inventory

### Complete List: 11 Clearly Identified Broken Links

| Broken Reference | Expected Workflow | Status | Likely Reason | Priority |
|-----------------|-------------------|--------|-------|----------|
| `changelog-auto-update.yml` | `changelog-management.yml` | ❌ Not found | Renamed | High |
| `changelog-validate.yml` | `changelog-management.yml` or custom | ❌ Not found | Never existed | High |
| `issue-close-label-hygiene.yml` | `issue-labeling-automation.yml` | ❌ Not found | Renamed/consolidated | Medium |
| `linting.yml` | Part of `documentation.yml` or `checks.yml` | ❌ Not found | Consolidated | Medium |
| `metrics-summary.yml` | Workflow registry doesn't contain | ❌ Not found | Never existed | Low |
| `metrics.yml` | Workflow registry doesn't contain | ❌ Not found | Renamed or deleted | Low |
| `readme-audit.yml` | `docs-maintenance.yml` | ❌ Not found | Renamed | Medium |
| `readme-regen.yml` | No equivalent found | ❌ Not found | Never implemented | Medium |
| `readme-update.yml` | `docs-maintenance.yml` | ❌ Not found | Renamed | Medium |
| `testing.yml` | Part of `checks.yml` | ❌ Not found | Consolidated | Medium |
| `dependabot-security-label.yml` | Workflow removed | ❌ Not found | Deleted | Low |

**Note:** The referenced "12 broken badges" in commit 427b7ed62 may refer to the removal of 33 total badge *instances* in BRANCHING_STRATEGY.md (PR #1609) plus additional removals from VERSIONING.md. The 11 broken *workflow references* are clearly documented above. Investigation in #1655 (Phase 4) should verify the exact count and source of the "12" figure.

---

## Detailed Analysis by Category

### Category 1: Renamed Workflows (High Confidence)

#### 1.1 `changelog-auto-update.yml` → `changelog-management.yml`

**Status:** Clear mismatch

**Analysis:**

- Old name: `changelog-auto-update.yml` (suggests auto-update function)
- Current name: `changelog-management.yml` (broader scope)
- Confidence: **High** — workflow exists with similar purpose

**Evidence:**

- Exists in `.github/workflows/changelog-management.yml`
- Handles changelog creation, validation, and updates
- Auto-update is one of its functions

**Impact:**

- Badge would work if name were corrected
- No functionality loss, just naming

**Recommendation:**

- Update reference to `changelog-management.yml`
- Add validation to prevent future mismatches

---

#### 1.2 `issue-close-label-hygiene.yml` → Issue Labeling Workflow

**Status:** Likely consolidated into existing workflow

**Analysis:**

- Old name: `issue-close-label-hygiene.yml` (very specific)
- Possible matches:
  - `issue-labeling-automation.yml` (exists)
  - `manage-blocking-status-labels.yml` (exists)
  - `labeling-governance.yml` (unknown)

**Confidence:** Medium — multiple possible mappings

**Evidence:**

- Issue labeling is now centralized in automation workflows
- The specific "close label hygiene" function likely merged into broader automation

**Impact:**

- Badge references outdated workflow name
- Underlying workflow probably exists under different name

**Recommendation:**

- Audit issue-labeling-automation.yml to confirm
- Update reference if match found
- Document consolidation

---

#### 1.3 `readme-audit.yml` → `docs-maintenance.yml`

**Status:** Renamed (high confidence)

**Analysis:**

- Old name: `readme-audit.yml` (specific function)
- Current name: `docs-maintenance.yml` (broader scope)
- Confidence: **High**

**Evidence:**

- `docs-maintenance.yml` exists and handles README auditing
- Name change reflects broader documentation maintenance role

**Impact:**

- Badge would work with corrected name
- No functionality change

**Recommendation:**

- Update reference to `docs-maintenance.yml`
- Add to "renamed workflows" category

---

#### 1.4 `readme-update.yml` → `docs-maintenance.yml`

**Status:** Renamed (high confidence)

**Analysis:**

- Similar to readme-audit.yml
- Old name suggests specific update function
- Likely consolidated with audit into `docs-maintenance.yml`

**Confidence:** **High**

**Recommendation:**

- Update reference to `docs-maintenance.yml`
- Consider if both "audit" and "update" functions exist separately

---

### Category 2: Consolidated Workflows (Medium Confidence)

#### 2.1 `linting.yml`

**Status:** Functionality integrated into existing workflows

**Analysis:**

- No workflow named `linting.yml` exists
- Linting functionality likely in:
  - `documentation.yml` (handles docs linting)
  - `checks.yml` (handles general linting and validation)

**Confidence:** Medium

**Evidence:**

- `checks.yml` exists and is comprehensive
- `documentation.yml` includes linting jobs
- Consolidation is consistent with workflow evolution

**Impact:**

- Badge should reference one of the existing workflows
- Functionality is covered, just under different name

**Recommendation:**

- Determine which workflow (documentation.yml or checks.yml) should be referenced
- Add as split reference (2 badge links) if both relevant

---

#### 2.2 `testing.yml`

**Status:** Functionality in `checks.yml`

**Analysis:**

- No workflow named `testing.yml`
- Testing is a core job in `checks.yml`

**Confidence:** **High**

**Evidence:**

- `checks.yml` includes comprehensive testing jobs
- Testing was likely moved to central checks workflow

**Impact:**

- Reference should be `checks.yml`
- Functionality preserved

**Recommendation:**

- Update reference to `checks.yml`

---

### Category 3: Never Existed (Low Confidence, High Impact)

#### 3.1 `changelog-validate.yml`

**Status:** Referenced but never implemented

**Analysis:**

- No workflow with this name exists
- Possible intentions:
  - Separate validation workflow (never created)
  - Function in `changelog-management.yml` (already exists)

**Confidence:** Medium

**Evidence:**

- No trace in git history
- Changelog validation happens in `changelog-management.yml`

**Impact:**

- This represents a feature gap or misplaced documentation

**Recommendation:**

- Verify if validation workflow was ever planned
- If planned but not implemented, create as separate issue
- If never intended, remove reference

---

#### 3.2 `metrics-summary.yml` & `metrics.yml`

**Status:** Not implemented or removed

**Analysis:**

- Neither workflow exists
- Possible states:
  - Planned but never created
  - Created and deleted without updating docs
  - Wrong names for existing metrics workflows

**Confidence:** Low

**Evidence:**

- No existing metrics workflows in current repo
- No clear alternatives

**Impact:**

- Metrics functionality may be missing
- Or metrics may be in different repo

**Recommendation:**

- Audit metrics infrastructure
- If workflows should exist, create as separate issue
- If not needed, document decision

---

#### 3.3 `readme-regen.yml`

**Status:** Not implemented

**Analysis:**

- No workflow to auto-regenerate README
- Likely planned but not implemented

**Confidence:** **High** (based on absence)

**Evidence:**

- README in current repo is manually maintained
- No automation for README generation

**Impact:**

- Feature gap if README regeneration is needed
- If not needed, documentation is out of date

**Recommendation:**

- Clarify if README regeneration is desired
- If yes, create as separate feature request
- If no, remove reference

---

#### 3.4 `dependabot-security-label.yml`

**Status:** Removed workflow

**Analysis:**

- Workflow was deleted
- Functionality may be:
  - In another workflow now
  - No longer needed

**Confidence:** Medium

**Evidence:**

- Git history shows removal
- No clear replacement exists

**Impact:**

- Security labeling may have been discontinued
- Or moved to different workflow

**Recommendation:**

- Check git history for deletion
- Verify if functionality is needed
- Create issue if re-implementation needed

---

## Root Cause Analysis

### Why Did This Happen?

#### Root Causes

1. **No automated validation**
   - Badges in documentation were not validated against actual workflows
   - Breaking changes (workflow renames) were not detected
   - Documentation became out of sync gradually

2. **Lack of documentation governance**
   - No process for updating badge references when workflows change
   - No owner for "keep badges in sync" task
   - No automation to catch mismatches

3. **Workflow consolidation without doc updates**
   - Multiple workflows were consolidated (linting, testing, readme)
   - Documentation references were not updated in parallel
   - "Delete old reference" was missed

4. **Abandoned or incomplete workflows**
   - Some workflows were planned but never implemented (metrics, readme-regen)
   - Documentation referenced them anyway
   - No cleanup process

---

## Impact Assessment

### What Happened As a Result

1. **CI validation failures** — PR #1639 failed CI checks due to broken badge links
2. **Documentation became unreliable** — Users couldn't trust badge links
3. **Manual cleanup required** — Badges were removed instead of fixed
4. **Loss of functionality** — Documentation status is no longer visible

### What Could Happen If Not Fixed

1. **Recurrence** — Without automation, this will happen again
2. **Growing divergence** — More workflows → more badges → more breaks
3. **Reduced documentation quality** — Users lose trust in documentation
4. **Support burden** — Manual fixing becomes routine task

---

## How This Project Prevents Recurrence

### Solution: Automated Workflow Health Checks

**New Workflow:** `badges-health-check.yml`

```yaml
name: Badge Health Check
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  check-badges:
    runs-on: ubuntu-latest
    steps:
      - name: Validate all badge links
        run: |
          # 1. Scan all Markdown files for badge links
          # 2. Extract workflow names from badge URLs
          # 3. Verify each workflow exists in .github/workflows/
          # 4. Report broken links
          # 5. Create issue if breaks found
```

**Benefits:**

- ✅ Catches broken badges automatically
- ✅ Weekly validation prevents silent failures
- ✅ Early warning before docs are published
- ✅ Clear issue creation for manual review

---

## Recommendations

### Immediate Actions (This Project)

1. **Create badge schema** — List all 42 workflows with official definitions
2. **Create validation workflow** — Check health weekly
3. **Create discovery workflow** — Auto-detect new/deleted workflows
4. **Create governance doc** — Document update process

### Future Enhancements

1. **Auto-fix simple cases** — Update broken references automatically
2. **Slack notifications** — Alert team of broken badges
3. **Deprecation path** — Planned workflow deletions should warn
4. **Migration guide** — When consolidating, create explicit mapping

---

## Lessons Learned

### Documentation Badges Are Critical

- Badge links must be validated
- Broken badges erode user trust
- Broken badges can cause CI failures

### Automation Over Manual Processes

- Manual tracking of 42 workflows doesn't scale
- Validation must be automatic and regular
- Discovery must happen in workflows, not documentation

### Consolidation Requires Documentation Updates

- When workflows are consolidated, update all references
- Don't just delete old references—document the consolidation
- Create mapping for users

---

## Appendix: Current Workflow Inventory

**Total workflows:** 42  
**Badged in VERSIONING.md:** 12 (now removed)  
**Currently referenced:** 0

### Workflows That Should Have Badges

**High Priority (critical to repo function):**

- checks.yml
- documentation.yml
- changelog-management.yml
- main-branch-guard.yml
- release.yml

**Medium Priority (frequently used):**

- issue-labeling-automation.yml
- docs-maintenance.yml
- docs-validation.yml
- labeling-governance.yml
- pr-labeling.yml

**Lower Priority (background tasks):**

- actions-minute-savings-watch.yml
- cleanup-branches.yml
- flaky-test-detection.yml
- awesome-github-site.yml
- ... (26 more)

---

## Appendix: Remediation Checklist

### For This Project

- [ ] Create badge schema with all 42 workflows
- [ ] Implement weekly health check
- [ ] Implement workflow discovery
- [ ] Document governance process
- [ ] Create initial badge set for key docs
- [ ] Validate all badge URLs

### For Team

- [ ] When creating new workflow: add to schema
- [ ] When renaming workflow: update schema
- [ ] When deleting workflow: create issue
- [ ] When updating docs: refresh badges

---

## Document Metadata

- **Created:** 2026-08-08
- **Last Updated:** 2026-08-08
- **Status:** Ready for implementation planning
- **Related:** AUDIT_AND_PLAN.md, PROJECT_README.md

---

*This audit provides the complete context needed to build automated badge health checks and prevent future link rot.*
