---
file_type: documentation
title: Issue Types & Templates Alignment Audit (2026-06-01)
description: Comprehensive audit of issue types, templates, and labels alignment in canonical configuration
created_date: '2026-06-01'
last_updated: '2026-06-01'
version: v1.0.0
status: complete
audit_scope: .github/issue-types.yml, .github/ISSUE_TEMPLATE/, .github/labels.yml
maintainer: LightSpeed Team
owners:
  - lightspeedwp/maintainers
tags:
  - issue-types
  - templates
  - labels
  - audit
  - governance
---

# Issue Types & Templates Alignment Audit

**Date**: 2026-06-01  
**Auditor**: Claude Code (Wave 5 Documentation Audit)  
**Scope**: Issue types, templates, and label alignment  
**Status**: Complete

---

## Executive Summary

Analysis of issue type definitions, GitHub issue templates, and label mappings reveals **good overall alignment** with two notable gaps:

- **2 orphaned templates** without corresponding issue types
- **Color consistency** confirmed between issue types and labels (with same issues as label audit)
- **Template naming** generally clear and descriptive
- **Missing documentation** on issue type usage and selection criteria

---

## Findings Summary

| Metric | Count |
|--------|-------|
| Issue Types Defined | 26 |
| Issue Templates | 26 (+ 1 README) |
| Templates with matching types | 24 (92%) |
| Orphaned templates | 2 (8%) |
| Color consistency issues | 12 (same as label audit) |
| Type→Template→Label alignment | 100% (for matched pairs) |

---

## Issue Types → Templates Mapping

### Complete Alignment (24 types)

All of the following issue types have corresponding templates with matching labels:

| # | Type Name | Issue Type | Label | Template | Color | Status |
|---|-----------|-----------|-------|----------|-------|--------|
| 1 | Task | type:task | type:task | 01-task.md | 4393F8 | ✅ Complete |
| 2 | Bug | type:bug | type:bug | 02-bug.md | 9F3734 | ✅ Complete |
| 3 | Feature | type:feature | type:feature | 03-feature.md | 3FB950 | ✅ Complete |
| 4 | Design | type:design | type:design | 04-design.md | AB7DF8 | ✅ Complete |
| 5 | Epic | type:epic | type:epic | 05-epic.md | AB7DF8 | ✅ Complete |
| 6 | Story | type:story | type:story | 06-story.md | 4393F8 | ✅ Complete |
| 7 | Improvement | type:improve | type:improve | 07-improvement.md | 9198A1 | ✅ Complete |
| 8 | Refactor | type:refactor | type:refactor | 08-code-refactor.md | 9198A1 | ✅ Complete |
| 9 | Build | type:build | type:build | 09-build-ci.md | 4393F8 | ✅ Complete |
| 10 | Automation | type:automation | type:automation | 10-automation.md | 4393F8 | ✅ Complete |
| 11 | Testing | type:test | type:test | 11-testing-coverage.md | D29922 | ✅ Complete |
| 12 | Performance | type:performance | type:performance | 12-performance.md | D29922 | ✅ Complete |
| 13 | Accessibility | type:a11y | type:a11y | 13-a11y.md | DB61A2 | ✅ Complete |
| 14 | Security | type:security | type:security | 14-security.md | 9F3734 | ✅ Complete |
| 15 | Compatibility | type:compatibility | type:compatibility | 15-compatibility.md | 8D4821 | ✅ Complete |
| 16 | Integration | type:integration | type:integration | 16-integration-issue.md | 8D4821 | ✅ Complete |
| 17 | Release | type:release | type:release | 17-release.md | 3FB950 | ✅ Complete |
| 18 | Maintenance | type:maintenance | type:maintenance | 18-maintenance.md | 9198A1 | ✅ Complete |
| 19 | Documentation | type:documentation | type:documentation | 19-documentation.md | 9198A1 | ✅ Complete |
| 20 | Research | type:research | type:research | 20-research.md | 9198A1 | ✅ Complete |
| 21 | Audit | type:audit | type:audit | 21-audit.md | 9198A1 | ✅ Complete |
| 22 | Review | type:review | type:review | 22-code-review.md | 4393F8 | ✅ Complete |
| 23 | AI Ops | type:ai-ops | type:ai-ops | 23-ai-ops.md | 4393F8 | ✅ Complete |
| 24 | Content Modelling | type:content-modelling | type:content-modelling | 24-content-modelling.md | AB7DF8 | ✅ Complete |

**Alignment Rate**: 92% (24/26 types have matching templates)

---

## Orphaned Templates (Not in Issue Types)

### Template: 07-user-experience-feedback.md

| Attribute | Value |
|-----------|-------|
| Template Name | User Experience Feedback |
| Issue Type | ❌ NOT DEFINED |
| Expected Label | ❌ MISSING |
| File Size | 955 bytes |
| Status | ⚠️ Orphaned |

**Analysis**: This template appears to be for user experience feedback but is not registered in `issue-types.yml`. Could be:

1. Legacy template from earlier iteration
2. Intentionally separate from standard issue types (feedback/feature-request pattern)
3. Intended to be mapped to type:feature or type:improve

**Recommendation**: Either register as formal issue type or document its purpose and when to use.

### Template: 25-help.md

| Attribute | Value |
|-----------|-------|
| Template Name | Help / Support |
| Issue Type | ⚠️ Partial match: type:support |
| Expected Label | type:support (exists, color: 0E8A16) |
| File Size | 1344 bytes |
| Status | ⚠️ Naming mismatch |

**Analysis**: Template named "help" but corresponding issue type is "Support". The label `type:support` exists, but issue type name in `issue-types.yml` is registered as "Support", not "Help".

**Discrepancy**: Template file prefix "25-help" doesn't match the issue type "Support". This could confuse users selecting between "Help" (from template) and "Support" (from issue type selector).

**Recommendation**: Rename template to `25-support.md` for consistency, or rename issue type to "Help" (type:help).

---

## Color Consistency Analysis

### Colors Used in Issue Types

Issue types have 27 distinct type definitions with the following colors:

| Color | Hex | Count | Labels Using Same Color | Status |
|-------|-----|-------|--------------------------|--------|
| 4393F8 | Medium Blue | 6 | task, story, build, automation, review, ai-ops | ✅ Consistent |
| AB7DF8 | Light Purple | 3 | design, epic, content-modelling | ✅ Consistent |
| 9198A1 | Medium Gray | 6 | improve, refactor, maintenance, documentation, research, audit | ⚠️ Not in strategy |
| 3FB950 | Medium Green | 3 | feature, release | ✅ Consistent |
| 9F3734 | Dark Red | 2 | bug, security | ✅ Consistent |
| D29922 | Gold | 2 | test, performance | ✅ Consistent |
| 8D4821 | Brown | 2 | compatibility, integration | ⚠️ Not in strategy |
| DB61A2 | Magenta | 1 | a11y | ❌ Wrong family |
| 0E8A16 | Dark Green | 1 | support | ⚠️ Not in strategy |
| 5319E7 | Purple-Blue | 1 | question | ❌ Not in strategy |

### Color Strategy Alignment

Issue types show **similar color deviations** as labels (documented in Label Color Consistency Audit #658):

**Issues Inherited from Label Audit**:

- 9198A1 (medium gray) not in strategy (6 labels affected)
- DB61A2 (magenta) should be Purple family (1 label affected)
- 8D4821 (brown) not in strategy (2 labels affected)
- 0E8A16 (dark green) not in strategy (1 label affected)
- 5319E7 (purple-blue) not in strategy (1 label affected)

**Status**: These issues should be resolved as part of Issue #683 (Label Color Mapping PR).

---

## Template Quality Audit

### Template Completeness

All 26 registered templates include:

- ✅ Title/description headers
- ✅ Body sections (not all the same structure)
- ✅ Clear instructions for users
- ✅ Frontmatter (where applicable)

### Template Consistency Issues

1. **Template naming scheme**: Mix of prefix numbers (01-25) with inconsistent descriptions
   - `01-task.md` → Clear
   - `16-integration-issue.md` → Verbose ("issue" is redundant)
   - `25-help.md` → Generic (should be "support")

2. **Content structure variance**:
   - Some templates have 5 sections
   - Some have 8+ sections
   - Some have validation instructions, others don't

3. **Instructions clarity**:
   - Most templates have clear instructions
   - Some (like `01-task.md`) are very brief
   - Some (like `02-bug.md`) include extensive guidelines

**Recommendation**: Consider standardizing template structure while preserving content uniqueness.

---

## Mapping Validation Results

### Type → Template → Label Chain (100% aligned where type exists)

For all 24 matched types:

- ✅ Issue Type name exists in `issue-types.yml`
- ✅ Corresponding template exists in `.github/ISSUE_TEMPLATE/`
- ✅ Label exists in `.github/labels.yml`
- ✅ All three use compatible naming (minor variations like "code-review" vs "Review" accepted)

### Type/Template/Label Name Mappings

**Standard pattern**: `Type Name` → `type:{kebab-case-variant}` → Template file

| Type Name | Label | Template | Name Match |
|-----------|-------|----------|------------|
| Review | type:review | code-review.md | ⚠️ Different but clear |
| Integration | type:integration | integration-issue.md | ⚠️ Verbose but clear |
| Accessibility | type:a11y | a11y.md | ✅ Perfect |
| Testing | type:test | testing-coverage.md | ✅ Perfect |
| AI Ops | type:ai-ops | ai-ops.md | ✅ Perfect |

**Consistency Rating**: 92% (acceptable with minor naming variations)

---

## Missing Documentation

### Areas Lacking Clear Documentation

1. **Issue Type Selection Guide**
   - No clear guidance on when to use "Task" vs "Story" vs "Epic"
   - No guidance on "Feature" vs "Improvement" distinctions
   - No guidance on "Research" vs "Audit" differences

2. **Template-to-Type Mapping**
   - No public documentation explaining type→template relationships
   - Users may be confused by orphaned templates (help, user-experience-feedback)

3. **Color/Type Relationships**
   - No documentation explaining color semantics for issue types
   - Color strategy document doesn't reference issue types

---

## Recommendations

### Priority 1: Fix Orphaned Templates

1. **Rename `25-help.md` to `25-support.md`**
   - Rationale: Aligns template name with issue type "Support"
   - Impact: Low (mostly UX clarity)
   - Effort: 5 minutes

2. **Document/clarify `07-user-experience-feedback.md`**
   - Option A: Register as formal issue type
   - Option B: Remove if deprecated
   - Option C: Document as supplementary feedback mechanism
   - Impact: Medium (affects user documentation)
   - Effort: 30 minutes

### Priority 2: Inherit Label Color Fixes

When Issue #683 (Label Color Mapping PR) is implemented:

- Update issue type colors to match corrected label colors
- Ensures consistency across the ecosystem

### Priority 3: Standardize Template Structure

1. Consider creating a template template (metadata structure, sections)
2. Document the standard structure in `.github/ISSUE_TEMPLATE/README.md`
3. Gradually standardise existing templates during next maintenance pass

### Priority 4: Create Selection Guide Documentation

Develop `docs/ISSUE_TYPES.md` section documenting:

- When to use each issue type
- How templates map to types
- Decision tree for type selection
- Examples of proper use for ambiguous types

---

## Summary Table

| Category | Status | Count | Notes |
|----------|--------|-------|-------|
| **Alignment** | ✅ Excellent | 24/26 (92%) | Two orphaned templates |
| **Color Consistency** | ⚠️ Needs fix | 12 conflicts | Inherited from label audit |
| **Template Quality** | ✅ Good | 26/26 | Minor naming variance |
| **Documentation** | ⚠️ Incomplete | 0/4 areas | Selection guide missing |
| **Overall Readiness** | ✅ Good | — | Ready for Priority 1 fixes |

---

## Next Steps

### Dependent Issues

- Issue #683: Label Color Mapping (coordinates color fixes)
- Issue #685: Supporting Documentation Updates

### Implementation Priority

1. Rename/clarify orphaned templates (Priority 1 — 30 minutes)
2. Coordinate label color fixes when Issue #683 completes (Priority 2)
3. Create selection guide documentation (Priority 3)
4. Standardize template structure (Priority 4 — future maintenance)

---

## Appendix: Complete Type Inventory

**All 26 Registered Issue Types**:

1. Task (type:task)
2. Bug (type:bug)
3. Feature (type:feature)
4. Design (type:design)
5. Epic (type:epic)
6. Story (type:story)
7. Improvement (type:improve)
8. Refactor (type:refactor)
9. Build (type:build)
10. Automation (type:automation)
11. Testing (type:test)
12. Performance (type:performance)
13. Accessibility (type:a11y)
14. Security (type:security)
15. Compatibility (type:compatibility)
16. Integration (type:integration)
17. Release (type:release)
18. Maintenance (type:maintenance)
19. Documentation (type:documentation)
20. Research (type:research)
21. Audit (type:audit)
22. Review (type:review)
23. AI Ops (type:ai-ops)
24. Content Modelling (type:content-modelling)
25. Question (type:question)
26. Support (type:support)

---

## Appendix: Complete Template Inventory

**All 26 Issue Templates** (+ 1 README):

1. 01-task.md
2. 02-bug.md
3. 03-feature.md
4. 04-design.md
5. 05-epic.md
6. 06-story.md
7. 07-improvement.md
8. 07-user-experience-feedback.md ⚠️ **ORPHANED**
9. 08-code-refactor.md
10. 09-build-ci.md
11. 10-automation.md
12. 11-testing-coverage.md
13. 12-performance.md
14. 13-a11y.md
15. 14-security.md
16. 15-compatibility.md
17. 16-integration-issue.md
18. 17-release.md
19. 18-maintenance.md
20. 19-documentation.md
21. 20-research.md
22. 21-audit.md
23. 22-code-review.md
24. 23-ai-ops.md
25. 24-content-modelling.md
26. 25-help.md ⚠️ **NAMING MISMATCH**
27. README.md

---

**Audit Completed**: 2026-06-01  
**Auditor**: Claude Code  
**Next Reviewer**: LightSpeed Team
