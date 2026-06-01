---
file_type: audit-report
title: Issue Types Alignment Audit
description: Three-way mapping audit of issue types, templates, and labels
created_date: 2026-06-01
last_updated: 2026-06-01
version: 1.0.0
domain: governance
tags: [audit, labels, issue-types, templates]
---

# Issue Types Alignment Audit — 2026-06-01

## Executive Summary

Audit of issue types configuration (`.github/issue-types.yml`), GitHub issue templates (`.github/ISSUE_TEMPLATE/`), and type labels (`.github/labels.yml`) reveals **3 critical alignment gaps**:

- **2 template files without corresponding issue types:** `user-experience-feedback`, `help`
- **1 label without corresponding issue type:** `type:qa`
- **1 template file with duplicate numbering:** 07 appears twice

**Total Alignment**: 24/27 templates mapped (89%), 27/28 labels mapped (96%)

---

## Audit Findings

### 1. Three-Way Mapping Summary

| Count | Status | Items |
|---|---|---|
| 24 | ✅ Complete | Templates with matching type + label |
| 2 | ❌ Missing type | user-experience-feedback, help |
| 1 | ⚠️ Orphaned | type:qa label (no template/type) |
| **27** | **Partial** | **Total templates** |

### 2. Missing Issue Type Definitions

**Severity:** HIGH  
**Count:** 2 templates without corresponding issue types

#### Templates without issue types

1. **`07-user-experience-feedback.md`** (sequence number conflict with `07-improvement.md`)
   - Template exists and functional
   - No corresponding entry in `issue-types.yml`
   - No corresponding label
   - Root cause: New templates added without issue type definitions

2. **`25-help.md`**
   - Template exists and functional
   - No corresponding entry in `issue-types.yml`
   - Correct sequence numbering
   - Root cause: New templates added without issue type definitions

**Impact:**

- Help and UX Feedback issues will not be properly categorized
- Type field will be empty or undefined
- No automatic type label assignment
- Project assignment may fail without explicit type

### 3. Orphaned Type Label

**Severity:** MEDIUM  
**Count:** 1 label without corresponding issue type

**Label:** `type:qa`

- Defined in `.github/labels.yml`
- NOT in `.github/issue-types.yml`
- No template references this type
- Root cause: Label remains from earlier "QA" issue type that was removed

**Impact:**

- The `type:qa` label can be manually applied but has no automation support
- Manual labeling required; inconsistent type assignment

### 4. Template Numbering Conflict

**Severity:** LOW  
**Count:** 1 duplicate sequence number

**Files:**

- `07-improvement.md`
- `07-user-experience-feedback.md`

**Root Cause:**  
User Experience Feedback template was added without renumbering the sequence.

---

## Recommendations

### Phase 1: Add Missing Issue Types (HIGH Priority)

1. **Add "Help" issue type to `.github/issue-types.yml`**
   - Color: Use #0E8A16 (green, matches type:support)
   - Label: type:help

2. **Add "User Experience Feedback" issue type to `.github/issue-types.yml`**
   - Color: Use #5319E7 (purple, unique)
   - Label: type:ux-feedback

### Phase 2: Clean Up Orphaned Labels (MEDIUM Priority)

1. **Remove `type:qa` from `.github/labels.yml`**
   - No longer used; replaced by proper types
   - Prevents confusion

### Phase 3: Fix Template Numbering (LOW Priority)

1. **Rename `07-user-experience-feedback.md` → `08-user-experience-feedback.md`**
   - Shifts subsequent filenames
   - Cosmetic but important for maintainability

---

## Validation Checklist

- [ ] Add "Help" type to issue-types.yml
- [ ] Add "User Experience Feedback" type to issue-types.yml
- [ ] Verify type colors match label colors
- [ ] Remove type:qa from labels.yml
- [ ] Fix template numbering (07 → 08+)
- [ ] Update docs/ISSUE_TYPES.md with new types
- [ ] Test unified labeling agent assigns correct types
- [ ] Verify template selector shows all 26 templates

---

## Related Issues

- Closes #659 (Issue Types Alignment Audit)
- Related to #650 (Wave 5 Documentation Audit)
- Depends on #658 (Label Color Consistency Audit - completed)

---

**Generated:** 2026-06-01  
**Audit Scope:** `.github/issue-types.yml`, `.github/ISSUE_TEMPLATE/`, `.github/labels.yml`
