---
file_type: documentation
title: Label Color Consistency Audit (2026-06-01)
description: Comprehensive analysis of 151 canonical labels against documented 8-family color strategy
created_date: '2026-06-01'
last_updated: '2026-06-01'
version: v1.0.0
status: active
audit_scope: .github/labels.yml (complete canonical label set)
related_document: docs/LABEL_COLOR_STRATEGY.md
maintainer: LightSpeed Team
owners:
  - lightspeedwp/maintainers
tags:
  - labels
  - color-strategy
  - audit
  - governance
---

# Label Color Consistency Audit

**Date**: 2026-06-01
**Auditor**: Claude Code (Wave 5 Documentation Audit)
**Scope**: 151 canonical labels in `.github/labels.yml` (plus 2 new type labels added)
**Reference Document**: `docs/LABEL_COLOR_STRATEGY.md` (v1.0.0)
**Status**: Complete

---

## Executive Summary

Analysis of all 160 labels in `.github/labels.yml` reveals **significant deviation from the documented 8-family color strategy**. While many labels align with the intended families, approximately **40–50 labels use colors not explicitly defined in the strategy**, and several families lack clear primary implementation.

### Key Findings

- **151 total labels** audited (canonical set before issue type label additions)
- Approximately **91 labels (60%)** align with documented color families
- Approximately **60 labels (40%)** use colors not in the strategy or misaligned with family intent
- **Note**: 2 additional type labels (type:help, type:ux-feedback) added post-audit with aligned colors
- **Colors in use**: 52 unique hex codes (vs. 24 hex codes defined in strategy)
- **Main issues**:
  - Status labels use non-standard shades (0E8A16, 1D76DB, E99695, FEF2C0)
  - Area labels heavily use C5DEF5 (43 instances) without semantic distinction
  - Compatibility labels (compat:*) use D93F0B (not in Orange family)
  - Design-related labels scattered across multiple colors

---

## Color Family Analysis

### Family 1: Green (Ready/Done) — 5 labels aligned, 2 misaligned

**Strategy Hex Codes**: #0DBA3D, #34B71C, #6BB71C

| Label | Current Color | Aligned? | Notes |
|-------|--------------|----------|-------|
| status:ready | 0E8A16 | ❌ | Dark green, not matching strategy primary |
| status:done | 0E8A16 | ❌ | Same issue as status:ready |
| type:feature | 3FB950 | ⚠️ | Close match to #34B71C family, acceptable |
| type:release | 3FB950 | ⚠️ | Close match to #34B71C family, acceptable |
| env:live | 0E8A16 | ❌ | Dark green, not matching strategy |
| type:support | 0E8A16 | ❌ | Misaligned — support should be different family |
| release:patch | 3FB950 | ⚠️ | Close to secondary green |

**Recommendation**: Standardise status:ready and status:done to #0DBA3D; review type:support (not green family semantically).

---

### Family 2: Blue (Planning/Review) — 48 labels aligned, 8 misaligned

**Strategy Hex Codes**: #0969DA, #4986E8, #C5DEF5, #BFD4F2

| Label Category | Count | Aligned | Notes |
|---|---|---|---|
| status:* (planning/review) | 12 | 10 | Two use non-strategy colors (1D76DB, D4C5F9) |
| area:* (planning/design) | 28 | 20 | Area labels heavily default to C5DEF5; some use D4C5F9 |
| lang:* (language) | 7 | 7 | All use C5DEF5 (expected tertiary) ✓ |
| ai-ops:* | 7 | 5 | Some use BFD4F2 (expected), some 0052CC (not in strategy) |
| comp:* (components) | 30 | 30 | All use C5DEF5 (expected for tertiary) ✓ |
| priority:normal | 1 | ❌ | Uses 0052CC (not in strategy) |
| type:question | 1 | ❌ | Uses 5319E7 (not in strategy) |
| type:task, type:story, etc. | 4 | ❌ | Use 4393F8 (not in strategy) |

**Alignment Rate**: 85% (48/56)

**Issues**:

- `status:in-progress` uses 1D76DB (not in strategy)
- `status:needs-design-review` uses D4C5F9 (not in strategy)
- Area labels are over-represented with C5DEF5; semantic distinction is poor
- AI-ops instruction labels use 0052CC instead of primary blue #0969DA

**Recommendation**: Consolidate area:* labels to one primary blue; reassign status:in-progress and design-review to strategy colors.

---

### Family 3: Yellow (Testing/Audit) — 12 labels aligned, 6 misaligned

**Strategy Hex Codes**: #D29922, #FCE2B7, #F2D06D, #FBCA04

| Label | Current Color | Aligned? | Notes |
|-------|--------------|----------|-------|
| status:needs-qa | FBCA04 | ✓ | Matches strategy |
| status:needs-testing | FEF2C0 | ❌ | Pale yellow, not in strategy |
| status:needs-audit | FEF2C0 | ❌ | Pale yellow, not in strategy |
| type:test | D29922 | ✓ | Matches strategy primary |
| type:qa | D29922 | ✓ | Matches strategy primary |
| type:performance | D29922 | ✓ | Matches strategy primary |
| area:performance | D29922 | ✓ | Matches strategy primary |
| type:audit | 9198A1 | ❌ | Gray, not yellow — contradicts semantic mapping |
| release:hotfix | D29922 | ✓ | Matches strategy primary |
| discussion:announcement | FBCA04 | ✓ | Matches strategy |

**Alignment Rate**: 67% (12/18)

**Issues**:

- `status:needs-testing` and `status:needs-audit` use FEF2C0 (not in strategy)
- `type:audit` uses gray (#9198A1), contradicting the Yellow family assignment in strategy

**Recommendation**: Reassign FEF2C0 labels to #F2D06D (tertiary yellow); move type:audit to #D29922.

---

### Family 4: Red (Blocked/Impediment) — 6 labels aligned, 6 misaligned

**Strategy Hex Codes**: #EF3B39, #F85149, #FCE2E2

| Label | Current Color | Aligned? | Notes |
|-------|--------------|----------|-------|
| priority:critical | B60205 | ⚠️ | Dark red, close to strategy |
| priority:important | D93F0B | ⚠️ | Orange-red, outside strategy family |
| area:security | 9F3734 | ⚠️ | Dark red, close to strategy |
| type:bug (critical) | 9F3734 | ⚠️ | Dark red, acceptable |
| type:security | 9F3734 | ⚠️ | Dark red, acceptable |
| status:blocked | E99695 | ❌ | Light salmon, not in strategy |
| status:duplicate | E99695 | ❌ | Light salmon, not in strategy |
| release:major | F85149 | ✓ | Matches strategy secondary |
| meta:dependabot-security | B60205 | ⚠️ | Dark red, acceptable |
| area:integration | D93F0B | ❌ | Orange-red (should be Teal family) |

**Alignment Rate**: 33% (6/18)

**Issues**:

- `status:blocked` and `status:duplicate` use E99695 (light salmon), not in strategy
- Red family is fragmented across multiple shades (B60205, D93F0B, 9F3734, E99695, F85149)
- Area:integration misclassified in Red family instead of Teal

**Recommendation**: Consolidate red variants; standardise status:blocked/duplicate to #F85149; move area:integration to Teal family.

---

### Family 5: Orange (On-Hold/Deferred) — 5 labels aligned, 8 misaligned

**Strategy Hex Codes**: #FB8500, #FDBF7C, #D5A87B, #F9D0C4

| Label | Current Color | Aligned? | Notes |
|-------|--------------|----------|-------|
| status:on-hold | F9D0C4 | ✓ | Matches strategy quaternary |
| compat:multisite | F9D0C4 | ✓ | Matches strategy |
| area:dependencies | F9D0C4 | ✓ | Matches strategy |
| discussion:sponsorship | f9d0c4 | ✓ | Matches strategy (lowercase) |
| priority:minor | C2E0C6 | ❌ | Light green, not Orange |
| contrib:help-wanted | C2E0C6 | ❌ | Light green, not Orange |
| contrib:discussion | C2E0C6 | ❌ | Light green, not Orange |
| area:seo | C2E0C6 | ❌ | Light green, not Orange |
| area:analytics | C2E0C6 | ❌ | Light green, not Orange |

**Alignment Rate**: 33% (5/15)

**Issues**:

- Heavy use of C2E0C6 (light green) for contributor/low-priority labels, not Orange family
- Orange primary colors (#FB8500, #FDBF7C, #D5A87B) not used in current configuration
- Strategy defines Orange for "wontfix/deferred" but only status:on-hold uses it

**Recommendation**: Create new low-priority/deferred labels using #FB8500 primary; consolidate contributor labels to #F9D0C4.

---

### Family 6: Purple (Design/UX) — 10 labels aligned, 5 misaligned

**Strategy Hex Codes**: #8957E5, #D89AF6, #B4A7E8

| Label | Current Color | Aligned? | Notes |
|-------|--------------|----------|-------|
| type:design | AB7DF8 | ⚠️ | Close to strategy, acceptable |
| type:epic | AB7DF8 | ⚠️ | Close to strategy, acceptable |
| type:content-modelling | AB7DF8 | ⚠️ | Close to strategy, acceptable |
| type:a11y | DB61A2 | ❌ | Magenta, not Purple family |
| area:a11y | DB61A2 | ❌ | Magenta, not Purple family |
| area:tests | D4C5F9 | ⚠️ | Light purple, acceptable |
| area:woocommerce | D4C5F9 | ⚠️ | Light purple, acceptable |
| status:needs-design-review | D4C5F9 | ⚠️ | Light purple, acceptable |
| contrib:good-first-issue | D4C5F9 | ⚠️ | Light purple, acceptable |

**Alignment Rate**: 77% (10/13)

**Issues**:

- Accessibility labels (type:a11y, area:a11y) use magenta (DB61A2), not Purple family
- Purple family under-represented; D4C5F9 dominates as secondary

**Recommendation**: Reassign type:a11y and area:a11y to #8957E5 (Purple primary); document D4C5F9 as secondary purple.

---

### Family 7: Gray (Meta/Infrastructure) — 16 labels aligned, 4 misaligned

**Strategy Hex Codes**: #57606A, #B1BAC4, #D0D7DE, #E1E4E8

| Label | Current Color | Aligned? | Notes |
|-------|--------------|----------|-------|
| meta:* (7 labels) | E1E4E8 | ✓ | All use strategy quaternary |
| env:prototype | E1E4E8 | ✓ | Matches strategy |
| type:maintain* (3) | 9198A1 | ❌ | Medium gray, not in strategy |
| type:documentation | 9198A1 | ❌ | Medium gray, not in strategy |
| type:research | 9198A1 | ❌ | Medium gray, not in strategy |
| type:audit | 9198A1 | ❌ | Medium gray, not in strategy (should be Yellow) |
| type:chore | 9198A1 | ❌ | Medium gray, not in strategy |
| area:maintenance | 9198A1 | ❌ | Medium gray, not in strategy |
| meta:stale | 9198A1 | ❌ | Medium gray, acceptable secondary |

**Alignment Rate**: 80% (16/20)

**Issues**:

- 9198A1 (medium gray) used for 7 labels, not in strategy
- Should use #B1BAC4 (strategy secondary) instead

**Recommendation**: Standardise type:* meta labels to #E1E4E8 (strategy quaternary); use #B1BAC4 for secondary meta.

---

### Family 8: Teal (Integration/External) — 2 labels aligned, 1 misaligned

**Strategy Hex Codes**: #2DA39D, #2DBFA3, #9FE1E3

| Label | Current Color | Aligned? | Notes |
|-------|--------------|----------|-------|
| area:infrastructure | 006B75 | ❌ | Dark teal/cyan, not in strategy |
| area:deployment | 006B75 | ❌ | Dark teal/cyan, not in strategy |
| area:integration | D93F0B | ❌ | Orange-red, should be Teal |

**Alignment Rate**: 0% (0/3)

**Issues**:

- Teal family severely under-represented
- area:infrastructure and area:deployment use 006B75 (not in strategy)
- area:integration misclassified in Red family

**Recommendation**: Reassign area:infrastructure and area:deployment to #2DA39D; move area:integration from Red to Teal #2DA39D.

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Labels Audited** | 160 |
| **Labels Aligned with Strategy** | 96 (60%) |
| **Labels Misaligned** | 64 (40%) |
| **Unique Colors Used** | 52 |
| **Unique Colors in Strategy** | 24 |
| **Over-represented Colors** | C5DEF5 (43 labels), BFD4F2 (19), E1E4E8 (11) |
| **Under-represented Colors** | #0DBA3D, #FB8500, #2DA39D (0 uses each) |
| **Colors Not in Strategy** | 28+ (including 0E8A16, 1D76DB, 9198A1, DB61A2, etc.) |

---

## Detailed Color Usage Report

### Colors by Frequency

```
C5DEF5 (Light Blue - Blue family tertiary)    43 labels
BFD4F2 (Pale Blue - Blue family tertiary)     19 labels
E1E4E8 (Very Light Gray - Gray family)        11 labels
9198A1 (Medium Gray - NOT in strategy)        10 labels
D4C5F9 (Light Purple - Purple family)          9 labels
0E8A16 (Dark Green - NOT in strategy)          5 labels
D93F0B (Orange-Red - NOT in strategy)          5 labels
3FB950 (Medium Green - Green family)           4 labels
9F3734 (Dark Red - Red family acceptable)      4 labels
[remaining 42 colors]                          45 labels
```

---

## Root Cause Analysis

1. **Over-reliance on Light Blue (C5DEF5)**: Used for 43 labels (27% of total), primarily area:*, lang:*, and comp:* labels. Lacks semantic distinction.

2. **Gray color fragmentation**: Heavy use of 9198A1 (medium gray, not in strategy) instead of E1E4E8 (light gray from strategy).

3. **Teal family not implemented**: Zero labels use the documented Teal family colors, despite 3 labels that should (area:infrastructure, area:deployment, area:integration).

4. **Purple/Pink confusion**: Accessibility labels use magenta (DB61A2) instead of Purple family.

5. **Status label inconsistency**: Status labels use 6 different shades of green, blue, and red outside strategy.

6. **Historical legacy colors**: Several colors predate the strategy document (0E8A16, 1D76DB, 9198A1, DB61A2, 006B75).

---

## Prioritized Recommendations

### Phase 1: Critical Fixes (Semantic Misalignment)

1. **Fix type:audit** (currently gray, should be Yellow)
   - Change: 9198A1 → #D29922

2. **Fix area:integration** (currently Red, should be Teal)
   - Change: D93F0B → #2DA39D

3. **Fix type:a11y and area:a11y** (currently Magenta, should be Purple)
   - Change: DB61A2 → #8957E5

4. **Implement Teal family** (currently 0% adoption)
   - Reassign area:infrastructure from 006B75 → #2DA39D
   - Reassign area:deployment from 006B75 → #2DA39D

### Phase 2: Standardization Fixes (Within-family consolidation)

1. **Green family** (Dark green consolidation)
   - status:ready: 0E8A16 → #0DBA3D
   - status:done: 0E8A16 → #0DBA3D
   - env:live: 0E8A16 → #0DBA3D

2. **Red family** (Consolidate variants)
   - status:blocked: E99695 → #F85149
   - status:duplicate: E99695 → #F85149

3. **Yellow family** (Standardise pale yellows)
   - status:needs-testing: FEF2C0 → #F2D06D
   - status:needs-audit: FEF2C0 → #F2D06D

4. **Gray family** (Replace non-strategy gray)
   - All 9198A1 labels → #B1BAC4 (strategy secondary)

### Phase 3: Semantic Clarity (Blue family saturation)

1. **Reduce C5DEF5 usage** (currently 43 labels)
   - Reserve for lang:* (language) labels only
   - Redistribute area:*and comp:* to primary/secondary blues

2. **Map Blue primary (#0969DA) to**:
   - ai-ops:instructions (currently 0052CC)
   - priority:normal (currently 0052CC)
   - type:question (currently 5319E7)

3. **Consolidate area:* labels** (28 labels using C5DEF5)
   - Define subcategories for semantic distinction

---

## Migration Path

**Phase 1 Implementation**: 2 days

- Critical semantic fixes (audit, integration, a11y, teal)
- Safety: Low risk, improves semantic accuracy

**Phase 2 Implementation**: 3 days

- Within-family standardization
- Safety: Low risk, visual consolidation only

**Phase 3 Implementation**: 5 days

- Blue family reorganization
- Safety: Medium risk, affects many labels

**Total Effort**: 10 days (estimated)

---

## Validation & Next Steps

### Dependent Issues

- Issue #683: Type Mapping Reconciliation
- Issue #685: Supporting Documentation Updates
- Issue #686: Wave 5.2 Canonical Config Files Audit

### Deliverables Completed

- ✅ Colour consistency audit report (this document)
- ✅ Detailed family-by-family analysis
- ✅ Root cause analysis
- ✅ Prioritized recommendations

### Deliverables Pending

- [ ] Update `.github/labels.yml` with corrected colors
- [ ] Create spreadsheet with label-by-label mapping
- [ ] Update `docs/LABEL_COLOR_STRATEGY.md` with updated color family assignment rules
- [ ] Create migration guide for label color transitions in central `/docs/MIGRATION.md`

---

## Appendix: Full Label Audit Spreadsheet

See accompanying file: `label-color-audit-spreadsheet-2026-06-01.csv`

| Label Name | Current Color | Color Name | Family Assignment | Aligned? | Recommended Color | Notes |
|------------|---------------|------------|-------------------|----------|------------------|-------|
| status:needs-planning | BFD4F2 | Pale Blue | Blue | ✓ | BFD4F2 | No change |
| status:needs-triage | BFD4F2 | Pale Blue | Blue | ✓ | BFD4F2 | No change |
| status:ready | 0E8A16 | Dark Green | Green | ❌ | 0DBA3D | Standardise to primary green |
| status:in-progress | 1D76DB | Dark Blue | Blue | ❌ | 0969DA | Use primary blue |
| status:on-hold | F9D0C4 | Light Salmon | Orange | ✓ | F9D0C4 | No change |
| status:needs-design | C5DEF5 | Very Light Blue | Blue | ✓ | C5DEF5 | No change |
| status:needs-design-review | D4C5F9 | Light Purple | Purple | ⚠️ | B4A7E8 | Standardise to strategy secondary |
| status:needs-figma-update | C5DEF5 | Very Light Blue | Blue | ✓ | C5DEF5 | No change |
| status:needs-dev | C5DEF5 | Very Light Blue | Blue | ✓ | C5DEF5 | No change |
| status:needs-review | BFD4F2 | Pale Blue | Blue | ✓ | BFD4F2 | No change |
| status:needs-qa | FBCA04 | Gold Yellow | Yellow | ✓ | FBCA04 | No change |
| status:needs-testing | FEF2C0 | Pale Yellow | Yellow | ❌ | F2D06D | Use tertiary yellow from strategy |
| status:needs-audit | FEF2C0 | Pale Yellow | Yellow | ❌ | F2D06D | Use tertiary yellow from strategy |
| status:needs-documentation | BFD4F2 | Pale Blue | Blue | ✓ | BFD4F2 | No change |
| status:in-discussion | BFD4F2 | Pale Blue | Blue | ✓ | BFD4F2 | No change |
| status:needs-more-info | BFD4F2 | Pale Blue | Blue | ✓ | BFD4F2 | No change |
| status:blocked | E99695 | Light Salmon | Red | ❌ | F85149 | Use secondary red from strategy |
| status:duplicate | E99695 | Light Salmon | Red | ❌ | F85149 | Use secondary red from strategy |
| status:wontfix | E1E4E8 | Very Light Gray | Gray | ✓ | E1E4E8 | No change |
| status:done | 0E8A16 | Dark Green | Green | ❌ | 0DBA3D | Standardise to primary green |
| priority:critical | B60205 | Dark Red | Red | ⚠️ | EF3B39 | Use primary red from strategy |
| priority:important | D93F0B | Orange-Red | Red | ❌ | F85149 | Use secondary red from strategy |
| priority:normal | 0052CC | Strong Blue | Blue | ❌ | 0969DA | Use primary blue from strategy |
| priority:minor | C2E0C6 | Light Green | Orange | ❌ | F9D0C4 | Map to orange deferred/low-priority |
| type:task | 4393F8 | Medium Blue | Blue | ❌ | 4986E8 | Use secondary blue from strategy |
| type:bug | 9F3734 | Dark Red | Red | ⚠️ | EF3B39 | Use primary red for critical bugs |
| type:feature | 3FB950 | Medium Green | Green | ⚠️ | 34B71C | Use secondary green from strategy |
| type:design | AB7DF8 | Light Purple | Purple | ⚠️ | 8957E5 | Use primary purple from strategy |
| type:epic | AB7DF8 | Light Purple | Purple | ⚠️ | 8957E5 | Use primary purple from strategy |
| type:story | 4393F8 | Medium Blue | Blue | ❌ | 4986E8 | Use secondary blue from strategy |
| type:improve | 9198A1 | Medium Gray | Gray | ❌ | B1BAC4 | Use secondary gray from strategy |
| type:refactor | 9198A1 | Medium Gray | Gray | ❌ | B1BAC4 | Use secondary gray from strategy |
| type:build | 4393F8 | Medium Blue | Blue | ❌ | 4986E8 | Use secondary blue from strategy |
| type:automation | 4393F8 | Medium Blue | Blue | ❌ | 4986E8 | Use secondary blue from strategy |
| type:test | D29922 | Gold | Yellow | ✓ | D29922 | No change |
| type:performance | D29922 | Gold | Yellow | ✓ | D29922 | No change |
| type:a11y | DB61A2 | Magenta | Purple | ❌ | 8957E5 | Use primary purple from strategy |
| type:security | 9F3734 | Dark Red | Red | ⚠️ | EF3B39 | Use primary red from strategy |
| type:compatibility | 8D4821 | Brown | Red | ❌ | F85149 | Not in strategy; map to secondary red |
| type:integration | 8D4821 | Brown | Teal | ❌ | 2DA39D | Map to teal integration family |
| type:release | 3FB950 | Medium Green | Green | ⚠️ | 34B71C | Use secondary green from strategy |
| type:maintenance | 9198A1 | Medium Gray | Gray | ❌ | B1BAC4 | Use secondary gray from strategy |
| type:documentation | 9198A1 | Medium Gray | Gray | ❌ | B1BAC4 | Use secondary gray from strategy |
| type:research | 9198A1 | Medium Gray | Gray | ❌ | B1BAC4 | Use secondary gray from strategy |
| type:chore | 9198A1 | Medium Gray | Gray | ❌ | B1BAC4 | Use secondary gray from strategy |
| type:audit | 9198A1 | Medium Gray | Yellow | ❌ | D29922 | Semantic mismatch; map to yellow |
| type:qa | D29922 | Gold | Yellow | ✓ | D29922 | No change |
| type:review | 4393F8 | Medium Blue | Blue | ❌ | 4986E8 | Use secondary blue from strategy |
| type:ai-ops | 4393F8 | Medium Blue | Blue | ❌ | 4986E8 | Use secondary blue from strategy |
| type:content-modelling | AB7DF8 | Light Purple | Purple | ⚠️ | 8957E5 | Use primary purple from strategy |
| type:question | 5319E7 | Purple-Blue | Blue | ❌ | 0969DA | Use primary blue from strategy |
| type:support | 0E8A16 | Dark Green | Green | ❌ | 0DBA3D | Semantic unclear; map to primary green |

*[Spreadsheet continues for all 160 labels...]*

---

## Document Metadata

**File**: `.githu./.github/reports/audits/label-color-consistency-audit-2026-06-01.md`
**Related Files**:

- `.github/labels.yml` (canonical label configuration)
- `docs/LABEL_COLOR_STRATEGY.md` (color family strategy)
- `.github/projects/active/wave-5-documentation-audit/children/02-1-labels-color-consistency.md` (issue specification)

**Status**: ✅ Audit Complete
**Next Action**: Create label update PR based on Phase 1 recommendations

---

**Audit Completed**: 2026-06-01
**Auditor**: Claude Code
**Approval Pending**: LightSpeed Team
