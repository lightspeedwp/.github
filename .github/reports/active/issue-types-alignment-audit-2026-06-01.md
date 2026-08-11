---
file_type: documentation
title: Issue Types Alignment Audit
description: Three-way mapping audit of all 29 issue types, 26 templates, and corresponding labels
created_date: "2026-06-01"
last_updated: "2026-06-01"
version: "1.0.0"
domain: "governance"
status: "active"
tags: [audit, labels, issue-types, templates]
---

# Issue Types Alignment Audit — 2026-06-01

## Executive Summary

Comprehensive audit of issue types (`.github/issue-types.yml`), GitHub templates (`.github/ISSUE_TEMPLATE/`), and type labels (`.github/labels.yml`) reveals **three critical alignment gaps**:

- **3 issue types without templates:** Chore, Question, Support (no matching template files)
- **2 new types added with templates:** Help, User Experience Feedback (newly defined)
- **1 orphaned label removed:** type:qa (no corresponding type or template)

**Alignment Status**: 26/29 types have templates (90%), 29/29 types have labels (100%)

---

## Audit Inventory

### Issue Types (29 total, per `.github/issue-types.yml`)

All 29 issue types now have corresponding type:* labels defined in `.github/labels.yml`.

| # | Issue Type | Label | Color | Template | Status |
|---|---|---|---|---|---|
| 1 | Task | type:task | 4393F8 | 01-task.md | ✅ |
| 2 | Bug | type:bug | 9F3734 | 02-bug.md | ✅ |
| 3 | Feature | type:feature | 3FB950 | 03-feature.md | ✅ |
| 4 | Design | type:design | AB7DF8 | 04-design.md | ✅ |
| 5 | Epic | type:epic | AB7DF8 | 05-epic.md | ✅ |
| 6 | Story | type:story | 4393F8 | 06-story.md | ✅ |
| 7 | Improvement | type:improve | 9198A1 | 07-improvement.md | ✅ |
| 8 | Refactor | type:refactor | 9198A1 | 09-code-refactor.md | ✅ |
| 9 | Build | type:build | 4393F8 | 10-build-ci.md | ✅ |
| 10 | Automation | type:automation | 4393F8 | 11-automation.md | ✅ |
| 11 | Testing | type:test | D29922 | 12-testing-coverage.md | ✅ |
| 12 | Performance | type:performance | D29922 | 13-performance.md | ✅ |
| 13 | Accessibility | type:a11y | DB61A2 | 14-a11y.md | ✅ |
| 14 | Security | type:security | 9F3734 | 15-security.md | ✅ |
| 15 | Compatibility | type:compatibility | 8D4821 | 16-compatibility.md | ✅ |
| 16 | Integration | type:integration | 8D4821 | 17-integration-issue.md | ✅ |
| 17 | Release | type:release | 3FB950 | 18-release.md | ✅ |
| 18 | Maintenance | type:maintenance | 9198A1 | 19-maintenance.md | ✅ |
| 19 | Documentation | type:documentation | 9198A1 | 20-documentation.md | ✅ |
| 20 | Research | type:research | 9198A1 | 21-research.md | ✅ |
| 21 | Chore | type:chore | 9198A1 | **MISSING** | ❌ |
| 22 | Audit | type:audit | 9198A1 | 22-audit.md | ✅ |
| 23 | Review | type:review | 4393F8 | 23-code-review.md | ✅ |
| 24 | AI Ops | type:ai-ops | 4393F8 | 24-ai-ops.md | ✅ |
| 25 | Content Modelling | type:content-modelling | AB7DF8 | 25-content-modelling.md | ✅ |
| 26 | Question | type:question | 5319E7 | **MISSING** | ❌ |
| 27 | Support | type:support | 0E8A16 | **MISSING** | ❌ |
| 28 | Help | type:help | 0E8A16 | 26-help.md | ✅ |
| 29 | User Experience Feedback | type:ux-feedback | 5319E7 | 08-user-experience-feedback.md | ✅ |

### Orphaned Labels (Removed)

| Label | Notes | Status |
|---|---|---|
| type:qa | Removed; no corresponding type or template | ✅ Deleted |

---

## Critical Findings

### Finding 1: Missing Templates (HIGH)

**3 issue types lack corresponding templates:**

1. **Chore** (type:chore)
   - Issue type defined with color 9198A1
   - **No template file** despite being a common issue category
   - Automation: Issues can be tagged but no template guidance

2. **Question** (type:question)
   - Issue type defined with color 5319E7
   - **No template file** for Q&A submissions
   - Automation: No structured intake process

3. **Support** (type:support)
   - Issue type defined with color 0E8A16
   - **No template file** for support requests
   - Automation: No intake or triage workflow

**Root Cause:** These types were defined in the configuration but templates were never created or were removed.

**Impact:**

- Users cannot select these types from the template dropdown
- Manual type/label assignment required
- Inconsistent submission format for these categories
- No automated workflows can be triggered

### Finding 2: New Types Added (MEDIUM)

**2 new issue types now have templates:**

1. **Help** (type:help) — NEW
   - Template: 26-help.md
   - Color: 0E8A16 (green)
   - Status: ✅ Properly configured

2. **User Experience Feedback** (type:ux-feedback) — NEW
   - Template: 08-user-experience-feedback.md
   - Color: 5319E7 (purple)
   - Status: ✅ Properly configured

**Note:** These types were added to complete the alignment of existing templates with the type system.

### Finding 3: Label Cleanup (COMPLETE)

**Orphaned label removed:**

- `type:qa` — Deleted from labels.yml (no corresponding type or template)

---

## Color Consistency

All 29 issue types have matching colors between:

- `.github/issue-types.yml` (color field)
- Corresponding `type:*` label in `.github/labels.yml`

**Status:** ✅ 100% color alignment

---

## Template Numbering

Template files are now sequentially numbered 01-26 with no duplicates:

- Numbering fixed: `07-user-experience-feedback.md` renamed to `08-user-experience-feedback.md`
- Subsequent files renumbered (08→09, etc.)
- Result: Sequential order 01-26

**Status:** ✅ Sequential numbering verified

---

## Recommendations

### Phase 1: Create Missing Templates (HIGH Priority)

Create template files for the 3 types without templates:

1. **Chore Template** (`07-chore.md`)
   - Guidance: Maintenance tasks, refactoring, cleanup
   - Sections: Task description, scope, related issues

2. **Question Template** (`27-question.md`)
   - Guidance: Questions about usage, troubleshooting
   - Sections: Problem description, context, what you've tried

3. **Support Template** (`28-support.md`)
   - Guidance: Support requests, bug reports needing investigation
   - Sections: Environment, reproduction steps, error messages

### Phase 2: Update Documentation (MEDIUM Priority)

1. Update `docs/ISSUE_TYPES.md` to document all 29 types
2. Update `.github/ISSUE_TEMPLATE/README.md` with new help/ux-feedback templates
3. Verify `docs/index.md` lists all issue type documentation

### Phase 3: Validate Automation (LOW Priority)

1. Test unified labeling agent with new Help/UX Feedback types
2. Verify template selector shows all 26 templates
3. Confirm project type field assignments

---

## Validation Checklist

- [x] All 29 issue types have corresponding type:* labels
- [x] Color consistency verified across all types
- [x] Template numbering sequential (01-26)
- [x] Orphaned type:qa label removed
- [x] New Help and UX Feedback types added and configured
- [ ] Templates created for Chore, Question, Support (Phase 1)
- [ ] Documentation updated with all 29 types (Phase 2)
- [ ] Automation validation complete (Phase 3)

---

## Related Issues

- Closes #659 (Issue Types Alignment Audit)
- Related to #650 (Wave 5 Documentation Audit)
- Depends on #658 (Label Color Consistency Audit - completed)

---

**Generated:** 2026-06-01
**Audit Scope:** `.github/issue-types.yml` (29 types), `.github/ISSUE_TEMPLATE/` (26 templates), `.github/labels.yml` (29+ labels)
**Status:** Complete with phase-by-phase remediation plan
