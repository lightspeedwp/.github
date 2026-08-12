---
file_type: documentation
name: Phase 2 — Frontmatter Validation Audit & Remediation
description: Strategy for auditing and fixing 589 frontmatter validation errors
status: active
---

# Phase 2: Frontmatter Audit & Remediation

**Duration:** ~60 minutes  
**Status:** In Progress  
**Created:** 2026-08-10T18:26 CEST

---

## Overview

Audit and remediate 589 frontmatter validation errors across 1760 validated files.

### Summary Statistics

```
Total files in repo:       10,669
Files validated:            1,760
Files with errors:            589
Files with warnings:        1,725
Files skipped:              8,156
```

**Key Finding:** 1725 warnings are "missing recommended fields" (non-critical). Only 589 are true errors (invalid or missing required).

---

## Error Categories & Remediation Strategy

### Category 1: Discussion Templates (Missing Frontmatter)

**Files:** `.github/DISCUSSION_TEMPLATE/*.yml` (9 files)  
**Issue:** Files should have frontmatter per LightSpeed standards  
**Action:** Add minimal frontmatter block to each file

**Example:**

```yaml
---
file_type: discussion_template
name: "Announcements"
about: "Announcements for the community"
---

# (rest of file)
```

**Impact:** Low (all files are standard GitHub templates)  
**Priority:** Medium (standardization)

---

### Category 2: Old Project Files (Missing Required Fields)

**Files:** `.github/projects/active/*/*.md`  
**Issue:** Missing `file_type` and/or `description` fields in frontmatter  
**Examples:**

- `.github/EPIC_1670_PROJECT_SUMMARY.md`
- `.github/projects/active/github-actions-v7-upgrade-2026-08-09/PHASE_1_COMPLETION_SUMMARY.md`
- `.github/projects/active/github-projects-creation-system/SUMMARY.md`

**Action:** Add required `file_type: project` and `description` fields

**Example Fix:**

```yaml
---
file_type: project
name: "GitHub Actions v7 Upgrade"
description: "Phase 1 completion summary for GitHub Actions v7 upgrade initiative"
status: "completed"
---

# Content...
```

**Impact:** Low (documentation files, already versioned)  
**Priority:** Medium (consistency)

---

### Category 3: Invalid Status Values

**Issue:** Some files have `status: "In Progress"` (capitalized) instead of lowercase enum `active|deprecated|draft|experimental`

**Example:**

```yaml
# Invalid:
status: "In Progress"

# Valid:
status: "active"
```

**Action:** Update status values to match schema enum

**Impact:** Low (only affects files with explicit status)  
**Priority:** Low (cosmetic, doesn't affect functionality)

---

### Category 4: Files Legitimately Without Frontmatter

**Files:** ~8156 skipped files  
**Issue:** These are properly excluded (node_modules, .git, build outputs, etc.)  
**Action:** None — these are correct exclusions

**Impact:** None  
**Priority:** None

---

## Remediation Plan

### Phase 2A: Quick Wins (15 minutes)

**Priority 1 — Fix 9 Discussion Templates**

Add frontmatter to `.github/DISCUSSION_TEMPLATE/*.yml`:

1. `announcements.yml`
2. `contribution-help.yml`
3. `general.yml`
4. `ideas-feedback.yml`
5. `integrations.yml`
6. `showcase.yml`
7. `sponsorship.yml`
8. `support-lsx-design.yml`
9. `support-tour-operator.yml`

---

### Phase 2B: Project File Fixes (30 minutes)

**Priority 2 — Fix 15–20 project files missing `file_type` and `description`**

Identify all project files with missing required fields and add them.

**Pattern:** If it's in `.github/projects/active/`, it needs:

- `file_type: project`
- `description: "<one-line summary>"`

---

### Phase 2C: Status Value Cleanup (10 minutes)

**Priority 3 — Update status enum values**

Find all files with non-standard status values and update to schema enum:

- `active` — current, in-use
- `deprecated` — no longer used
- `draft` — work in progress
- `experimental` — testing

---

## Expected Outcome

**After Phase 2:**

```
Validated files:        1760
Remaining errors:       < 50
Error rate:             < 3%
```

**Acceptable remaining errors:**

- Old archived files (where frontmatter update isn't worth the effort)
- Files in excluded patterns that slipped through
- Legitimate exceptions documented in schema

---

## Commits

| Priority | Task | Files | Commit |
| --- | --- | --- | --- |
| P1 | Add discussion template frontmatter | 9 | TBD |
| P2 | Fix project file frontmatter | 15–20 | TBD |
| P3 | Update status enum values | TBD | TBD |

---

## Verification Steps

1. Run `npm run validate:frontmatter`
2. Check that errors < 50
3. Document remaining errors and rationale
4. Confirm all tests still pass: `npm test`

---

## Status

- ⏳ **Not Started:** Categories identified
- 🔄 **Ready to Execute:** Phase 2A (discussion templates)
- ⏹️ **Blocked:** None
- ✅ **Complete:** When error count < 50

---

**Updated:** 2026-08-10
