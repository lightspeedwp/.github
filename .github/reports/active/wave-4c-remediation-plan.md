---
title: "Wave 4C: Remediation Plan & Priority Matrix"
description: "Detailed remediation recommendations with effort estimates and priority levels"
file_type: "documentation"
version: "1.1"
created_date: "2026-05-29"
last_updated: "2026-05-29"
category: "governance"
---

# Wave 4C: Remediation Plan & Priority Matrix

## Overview

Based on the current-state audit (Issue #553), this document provides a detailed remediation plan for aligning all Markdown files with the unified branding agent schema defined in issues #33, #46, #48, #49.

---

## Critical Findings

### 1. Frontmatter Compliance Crisis (8.7% Compliant)

**Impact**: 851 files missing required frontmatter fields

**Required Fields** (Issue #49):

- `file_type`
- `title`
- `last_updated`

**Optional Fields**:

- `description`
- `version`
- `created_date`
- `owners`
- `tags`
- `category`
- `domain`
- `stability`
- `maintainer`
- `license`

**Recommended Action**:

1. Implement automated frontmatter validation in CI/CD (`.coderabbit.yml` path rules)
2. Create per-category frontmatter templates
3. Deploy automated remediation script for batch updates
4. Add pre-commit hook validation (already in `.husky/pre-push`)

**Effort Estimate**: 3-4 hours (script development + deployment)

---

## Category-Specific Remediation Plan

### HIGH PRIORITY

#### 1. Skills (696 files, 18.1% footer coverage)

**Issues**:

- Only 126 files (18.1%) have footers
- Bulk of repository (74% of scanned files)
- Critical for consistency

**Remediation**:

- [ ] Implement skills category footer template
- [ ] Deploy batch footer insertion script
- [ ] Validate with first 50 files before full run
- [ ] Add category-aware footer selection (Issue #46)

**Effort**: 2-3 hours
**Timeline**: Start after Wave 4D schema implementation
**Dependencies**: Issue #49 schema spec

---

#### 2. Frontmatter Compliance (All Categories)

**Issues**:

- 851 files (91.3%) missing required fields
- Blocks category-aware branding logic
- Schema validation currently fails

**Remediation**:

- [ ] Create category-specific frontmatter templates
- [ ] Build automated frontmatter filler script
- [ ] Deploy with sensible defaults per path/category
- [ ] Add CI validation to prevent regressions

**Effort**: 3-4 hours
**Timeline**: Phase 1 of remediation (parallel to Wave 4D)
**Dependencies**: Issue #49 schema definition

---

### MEDIUM PRIORITY

#### 3. Documentation Files (37 files, 81.1% footer coverage, 13.5% badge coverage)

**Status**: Already well-covered for footers, needs badge consistency

**Issues**:

- 30 of 37 have footers (good coverage)
- Only 5 of 37 have badges (low adoption)
- Mix of badge types and placements

**Remediation**:

- [ ] Define badge placement rules for documentation
- [ ] Implement documentation-specific badge template
- [ ] Add badges to 32 files missing them
- [ ] Validate badge scheme alignment with Issue #46

**Effort**: 1-2 hours
**Timeline**: Wave 4F remediation phase
**Dependencies**: Issue #46 template design

---

#### 4. Instructions (38 files, 97.4% footer coverage, 7.9% badge coverage)

**Status**: Excellent footer coverage, needs badges

**Issues**:

- 37 of 38 have footers (excellent)
- Only 3 of 38 have badges
- Consistent formatting already in place

**Remediation**:

- [ ] Add badges to 35 files
- [ ] Ensure footer format consistency (validate 37 existing)
- [ ] Apply instruction-category badge template

**Effort**: 0.5-1 hour
**Timeline**: Wave 4F remediation
**Dependencies**: Issue #46 badge template

---

### LOW PRIORITY

#### 5. Slides (26 files, 0% footer coverage)

**Status**: No footers currently - may be intentional for presentation format

**Decision Point**: Need to determine if slides should have footers

**Options**:

- A) Skip footers for slides (presentation format)
- B) Add minimal footers with slide deck metadata
- C) Add frontmatter only, no footers

**Recommended**: Option A (skip, assess later)

**Effort**: 0 hours (deferred)
**Timeline**: Post Wave 4F review
**Dependencies**: Issue #33 category definition clarification

---

#### 6. Plugins (47 files, 76.6% footer coverage)

**Status**: Good footer coverage, consistent

**Issues**:

- 36 of 47 have footers (good)
- 11 need footer addition

**Remediation**:

- [ ] Add footers to 11 missing files
- [ ] Validate footer consistency across 47 files

**Effort**: 0.5-1 hour
**Timeline**: Wave 4F remediation
**Dependencies**: Issue #46 plugin footer template

---

---

## Implementation Roadmap

### Phase 1: Schema & Configuration (Wave 4D)

**Duration**: 2-3 hours

Deliverables:

- [ ] Update `agent-config.schema.json` with category definitions
- [ ] Define required/optional frontmatter fields
- [ ] Create category-to-template mappings
- [ ] Build YAML config examples

**Blocked By**: None (ready to start)
**Unblocks**: Phase 2

---

### Phase 2: Remediation Scripts (Wave 4E/4F Prep)

**Duration**: 2-3 hours

Deliverables:

- [ ] Automated frontmatter filler script
- [ ] Category-aware footer insertion script
- [ ] Badge validation and insertion script
- [ ] Dry-run testing on sample directories

**Blocked By**: Phase 1
**Unblocks**: Phase 3

---

### Phase 3: Bulk Remediation (Wave 4F)

**Duration**: 3-5 hours

Phases:

1. **Frontmatter Pass** (1-2 hours):
   - Run filler script on all 932 files
   - Validate against schema
   - Manual review of edge cases

2. **Footer Pass** (1-2 hours):
   - Insert category-aware footers
   - 851 files to process
   - Validate consistency

3. **Badge Pass** (0.5-1 hour):
   - Insert category-aware badges
   - 918 files to validate
   - Spot-check visual consistency

4. **Validation Pass** (0.5-1 hour):
   - Run full schema validation
   - Check for regressions
   - Manual QA sampling

**Blocked By**: Phase 2
**Unblocks**: PR merge & Issue #19 closure

---

## Success Criteria

- [ ] 100% of files have required frontmatter fields (`file_type`, `title`, `last_updated`)
- [ ] 95%+ of files have appropriate footers (category-aware)
- [ ] Badge placement consistent within categories (per Issue #46 template)
- [ ] Zero regression in existing header/footer patterns
- [ ] Schema validation passes on 100% of files
- [ ] CI/CD updated to prevent non-compliant files from merging
- [ ] All changes merged to `develop` branch
- [ ] Issue #553 closed with evidence

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Script errors affecting 932 files | High | Dry-run mode, sample testing (50 files), rollback to commit |
| Frontmatter data loss | High | Backup before automation, manual validation |
| Inconsistent footer insertion | Medium | Template-driven, per-category validation |
| CI/CD disruption | Medium | Test validation in local environment first |

---

## Dependencies & Blockers

**Upstream (Must Complete First)**:

- Issue #33: Branding agent parent spec ✅ MERGED
- Issue #46: Template design ✅ MERGED
- Issue #48: Agent documentation ✅ MERGED
- Issue #49: Schema/config spec ✅ MERGED

**Parallel Work**:

- Issue #554 (Wave 4D): Schema implementation
- Issue #555 (Wave 4E): Agent merge/refactor

**Downstream (Will Unblock)**:

- Issue #556 (Wave 4F): Remediation & validation

---

## Effort Summary

| Task | Hours | Timeline |
|------|-------|----------|
| Audit completion | 0.5 | ✅ Done |
| Remediation plan | 1 | ✅ Done (this doc) |
| Schema/config (Wave 4D) | 2-3 | Ready |
| Remediation scripts (Prep) | 2-3 | Ready |
| Bulk remediation (Wave 4F) | 3-5 | Ready |
| **Total** | **9-12** | 1-2 days |

---

## Next Steps

1. ✅ **Issue #553 (This Issue)**: Complete & Close with audit report
2. **Issue #554 (Wave 4D)**: Implement schema & config
3. **Issue #555 (Wave 4E)**: Merge/refactor agent
4. **Issue #556 (Wave 4F)**: Execute remediation & validation

---

*Report generated: 2026-05-29*
*Wave 4C: Current-State Audit*
*Related: Issue #553, #554, #555, #556*
