---
file_type: documentation
title: "Wave 5 Audit [#654](https://github.com/lightspeedwp/.github/issues/654) Findings"
description: "Template Inventory and Standardisation Audit findings"
version: "1.2.2"
created_date: "2026-05-31"
last_updated: "2026-06-01"
language: "en-GB"
status: active
stability: "stable"
domain: "governance"
owners:
  - lightspeedwp/maintainers
tags:
  - audit
  - templates
  - documentation
  - wave-5
issue_number: 654
audit_type: "Template Inventory & Standardisation"
audit_status: "complete"
completion_date: "2026-05-31"
category: "audit"
---

# Issue [#654](https://github.com/lightspeedwp/.github/issues/654) Audit Findings: Template Inventory & Standardisation

## Quick Summary

- **26 templates inventoried** across `.github/ISSUE_TEMPLATE/`
- **100% frontmatter compliance** (all required fields present and consistent)
- **1 critical issue** (duplicate numbering: 07-improvement + 07-user-experience-feedback)
- **2 type mapping gaps** (Chore template missing; User Experience Feedback and Help/Support have ambiguous types)

---

## Complete Findings

Full audit details are documented in **[GitHub Issue [#654](https://github.com/lightspeedwp/.github/issues/654)](<https://github.com/lightspeedwp/.github/issues/654>)**.

### Key Metrics

| Metric | Value | Status |
|---|---|---|
| Total Templates Inventoried | 26 | ✅ |
| Frontmatter Compliance | 26/26 (100%) | ✅ |
| Direct Type Mappings | 24/26 (92%) | ⚠️ |
| Critical Issues | 1 | 🔴 |
| Medium Issues | 2 | 🟡 |
| Low Issues | 1 | 🟡 |

### Critical Issues

1. **Duplicate File Numbering** (High Priority)
   - Files: `07-improvement.md` and `07-user-experience-feedback.md`
   - Impact: Breaks naming convention; confusing ordering
   - Fix: Rename + cascade renumber 18 subsequent files (M effort)

### Type Mapping Issues

1. **Chore** (Medium Priority)
   - Status: Defined in `issue-types.yml` but no dedicated template
   - Current: Workaround uses `18-maintenance.md`
   - Fix: Create dedicated template or update config (S-M effort)

2. **User Experience Feedback** (Medium Priority)
   - Status: No explicit issue_type mapping
   - Candidate Types: Support, Design, Improvement
   - Fix: Clarify purpose and add frontmatter mapping (S effort)

3. **Help/Support** (Medium Priority)
   - Status: `25-help.md` could map to Support or Question
   - Fix: Add explicit issue_type to frontmatter (S effort)

---

## Recommendations

### Phase 1: Fix Numbering (Blocking)

Address the duplicate `07` prefix:

- Rename `07-user-experience-feedback.md` → `08-user-experience-feedback.md`
- Cascade all subsequent files +1 (08→09, 09→10, ... 25→26)

### Phase 2: Clarify Type Mappings

- Add `issue_type` frontmatter field to ambiguous templates
- Document intended use for User Experience Feedback
- Decide: Chore template or consolidate with Maintenance?

### Phase 3: Update Documentation

- Update `config.yml` with comments linking to canonical docs
- Update AI instructions to reference standardised templates
- Add template usage guide to `.github/ISSUE_TEMPLATE/README.md`

---

## Related Issues

- **[#655](https://github.com/lightspeedwp/.github/issues/655):** Template → Automation Trigger Mapping (depends on numbering fixes)
- **[#656](https://github.com/lightspeedwp/.github/issues/656):** Issue Labeling Rules in labeler.yml (depends on type clarification)
- **[#657](https://github.com/lightspeedwp/.github/issues/657):** Clear AI Agent Instructions for Issue Creation (uses template standards)

---

**Audit Date:** 2026-05-31
**Audit Status:** ✅ Complete
**Full Details:** [GitHub Issue [#654](https://github.com/lightspeedwp/.github/issues/654)](<https://github.com/lightspeedwp/.github/issues/654#issuecomment-4587414901>)
