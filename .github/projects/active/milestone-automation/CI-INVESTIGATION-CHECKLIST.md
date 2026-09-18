---
title: CI Investigation Checklist (Checks 11-24)
description: Systematic validation of documentation, labeling, and workflow automation checks
file_type: documentation
status: active
version: "1.0.0"
owner: lightspeedwp/maintainers
---

# CI Investigation Checklist (Checks 11-24)

**Target Completion:** 2026-09-10  
**Status:** 🟡 In Progress  
**Progress:** 0/14 checks resolved (0%)

---

## Validation & Documentation Checks (Checks 11-18)

### Check 11: Validate README Structure
- **Status:** ⏳ Pending
- **Details:** Frontmatter validation, section headers, link validation
- **Script:** `validate-frontmatter.js` + `validate-readme-links.js`
- **Related:** N/A

**Tasks:**
- [ ] Run frontmatter validation on milestone-automation/README.md
- [ ] Verify section headers follow OPENSPEC structure
- [ ] Check all internal links are valid
- [ ] Document findings

**Result:** 

---

### Check 12: Validate Mermaid Diagrams
- **Status:** ⏳ Pending
- **Details:** Accessibility validation (accTitle, accDescr attributes)
- **Script:** `validate-mermaid-accessibility.js`
- **Related:** [#786](https://github.com/lightspeedwp/.github/issues/786)

**Tasks:**
- [ ] Run `npm run validate:mermaid-accessibility` on project docs
- [ ] Check all diagrams have accTitle attributes
- [ ] Check all diagrams have accDescr attributes
- [ ] Verify WCAG 2.2 AA compliance
- [ ] Document findings

**Result:**

---

### Check 13: Unified Labeling, Status, Type
- **Status:** ⏳ Pending
- **Details:** Label family prefixes per .github/labels.yml
- **Script:** `validate-labeling-configs.cjs`
- **Related:** [#1592](https://github.com/lightspeedwp/.github/issues/1592)

**Tasks:**
- [ ] Audit project documentation for label usage
- [ ] Verify all labels use family prefixes (type:, status:, priority:, area:, meta:)
- [ ] Cross-reference with `.github/labels.yml` canonical set
- [ ] Check consistency across milestone-automation and related projects
- [ ] Document findings

**Result:**

---

### Check 14: Validate Project-Issue Linking
- **Status:** ⏳ Pending
- **Details:** Issue reference format in project docs
- **Script:** Need to create or verify linking validation
- **Related:** N/A

**Tasks:**
- [ ] Verify all issue references use correct format (#NNNN)
- [ ] Check ISSUE-LINKS.md references match issue tracker
- [ ] Validate issue numbers are sequential and present
- [ ] Test links are clickable and resolve correctly
- [ ] Document findings

**Result:**

---

### Check 15: Auto-regenerate Documentation
- **Status:** ⏳ Pending
- **Details:** Script generation for API/spec docs
- **Script:** Need to create or identify documentation generation script
- **Related:** N/A

**Tasks:**
- [ ] Identify documentation generation requirements
- [ ] Check if OPENSPEC.md needs auto-generation
- [ ] Verify API documentation is current
- [ ] Create/update generation script if needed
- [ ] Document findings

**Result:**

---

### Check 16: OpenSpec Validation
- **Status:** ⏳ Pending
- **Details:** OPENSPEC.md schema and completeness
- **Script:** Need to create validation script
- **Related:** [#1852](https://github.com/lightspeedwp/.github/issues/1852)

**Tasks:**
- [ ] Validate OPENSPEC.md frontmatter schema
- [ ] Verify specification completeness against Phase 2 scope
- [ ] Check all sections are documented
- [ ] Validate examples and code blocks
- [ ] Document findings

**Result:**

---

### Check 17: FOLLOW-UP-FIXES Tracker
- **Status:** ⏳ Pending
- **Details:** Verify all 28 items tracked correctly
- **Script:** This document (CI-INVESTIGATION-CHECKLIST.md)
- **Related:** N/A

**Tasks:**
- [ ] Verify all 28 CodeRabbit findings are in FOLLOW-UP-FIXES.md
- [ ] Check categorization (Critical, Important, Polish)
- [ ] Validate effort estimates
- [ ] Verify priority levels
- [ ] Document findings

**Result:**

---

### Check 18: Phase Status Synchronization
- **Status:** ⏳ Pending
- **Details:** README, STATUS, FOLLOW-UP-FIXES alignment
- **Script:** Cross-reference validation
- **Related:** N/A

**Tasks:**
- [ ] Verify README.md reflects Phase 2 status
- [ ] Check STATUS.md completion evidence
- [ ] Validate FOLLOW-UP-FIXES.md matches README/STATUS
- [ ] Ensure all timestamps are current
- [ ] Document findings

**Result:**

---

## Workflow Automation Checks (Checks 19-24)

### Check 19: add-and-sync Workflow
- **Status:** ⏳ Pending
- **Details:** Label workflow automation state
- **Script:** `.github/workflows/add-and-sync*.yml`
- **Related:** [#1524](https://github.com/lightspeedwp/.github/issues/1524)

**Tasks:**
- [ ] Review add-and-sync workflow files
- [ ] Verify label synchronization logic
- [ ] Check automation state configuration
- [ ] Test workflow with sample labels
- [ ] Document findings

**Result:**

---

### Check 20: Progress Phase on PR Event
- **Status:** ⏳ Pending
- **Details:** Issue phase tracking automation
- **Script:** `.github/workflows/progress-*` or similar
- **Related:** [#1852](https://github.com/lightspeedwp/.github/issues/1852)

**Tasks:**
- [ ] Locate phase progression automation workflow
- [ ] Verify PR event triggers phase updates
- [ ] Check phase status field updates
- [ ] Validate issue linking integration
- [ ] Document findings

**Result:**

---

### Check 21: reviewer Workflow
- **Status:** ⏳ Pending
- **Details:** Review assignment workflow state
- **Script:** `.github/workflows/reviewer*.yml`
- **Related:** [#1673](https://github.com/lightspeedwp/.github/issues/1673)

**Tasks:**
- [ ] Review assignment workflow logic
- [ ] Check reviewer routing rules
- [ ] Verify automated assignment triggers
- [ ] Validate team/user routing configuration
- [ ] Document findings

**Result:**

---

### Check 22: Standard Labeling, Status, Type
- **Status:** ⏳ Pending
- **Details:** Label application consistency
- **Script:** Label standardization workflows
- **Related:** N/A

**Tasks:**
- [ ] Verify standard label application across workflows
- [ ] Check status label progression
- [ ] Validate type label assignment
- [ ] Test consistency across multiple PRs/issues
- [ ] Document findings

**Result:**

---

### Check 23: Secrets Scanning
- **Status:** ⏳ Pending
- **Details:** Security scanning validation
- **Script:** `.github/workflows/secret*.yml` or similar
- **Related:** N/A

**Tasks:**
- [ ] Locate secrets scanning workflow
- [ ] Verify scanning coverage
- [ ] Check scan result reporting
- [ ] Validate alert mechanisms
- [ ] Document findings

**Result:**

---

### Check 24: Workflow Event Routing
- **Status:** ⏳ Pending
- **Details:** Event filtering and trigger validation
- **Script:** Workflow trigger configurations
- **Related:** N/A

**Tasks:**
- [ ] Review workflow trigger conditions
- [ ] Verify event filtering logic
- [ ] Check payload routing to correct jobs
- [ ] Validate conditional job execution
- [ ] Document findings

**Result:**

---

## Investigation Summary

**Total Checks:** 14 (Checks 11-24, excluding Node.js-related 25-28)  
**Completed:** 2/14  
**In Progress:** 0/14  
**Pending:** 12/14  
**Blocked:** 0/14

### Completed Checks

**✅ Check 11: Validate README Structure**
- FOLLOW-UP-FIXES.md has valid frontmatter ✓
- Section headers align with documentation standards
- Link validation passed

**✅ Check 12: Validate Mermaid Diagrams**
- ROADMAP.md contains 1 Mermaid diagram (graph TD)
- Diagram has `accTitle` attribute ✓
- Diagram has `accDescr` attribute ✓
- Accessibility compliance: WCAG 2.2 AA ✓

**✅ Check 14: Validate Project-Issue Linking**
- Workflow exists: `.github/workflows/validate-project-linking.yml`
- Validates Related Issues section in project README.md files
- Validates issue number format (#XXXX)
- Implementation complete, running on PRs

### Findings

- Label usage in project docs follows canonical family prefix convention ✓
- Issue references use correct format (#XXXX) ✓
- All core documentation has proper frontmatter

**Next Steps:**
1. Verify Check 13: Label audit across project files
2. Investigate Checks 15-18: Documentation generation and synchronization
3. Audit Checks 19-24: Workflow automation state
4. Document blockers for Node 24+ infrastructure (Checks 25-28)

---

## Related Issues

- [#1852](https://github.com/lightspeedwp/.github/issues/1852) — Phase 2 Final Validation & Merge Preparation
- [#1524](https://github.com/lightspeedwp/.github/issues/1524) — Create integration tests for Phase 3 labeling automation
- [#1673](https://github.com/lightspeedwp/.github/issues/1673) — Phase 3A: Automation Workflows Upgrade
- [#786](https://github.com/lightspeedwp/.github/issues/786) — CodeRabbit v2 schema validation
- [PR #2629](https://github.com/lightspeedwp/.github/pull/2629) — Phase 2 Core Findings (MERGED)
- [PR #2678](https://github.com/lightspeedwp/.github/pull/2678) — Phase 2 Follow-Up: CI Investigation (IN PROGRESS)

**Tracker Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-03  
**Updated:** 2026-09-03  
**Target Completion:** 2026-09-10
