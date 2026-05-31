---
title: "Wave 5 Documentation Audit - Issue Index"
description: "Complete index of all parent and child issues for the Documentation Audit project"
version: "1.0.0"
created_date: "2026-05-31"
status: "ready-for-review"
---

# Wave 5 Documentation Audit — Issue Index

This directory contains all parent and child issues for the comprehensive documentation audit initiative. **GitHub issues have been created (#649–#673) and are ready for execution.**

## 📋 How to Use This Directory

1. **Review issue files** to understand the scope and requirements for each audit
2. **Check reference links** to navigate to related documentation and configuration files
3. **Track progress** by updating issue status in GitHub and referencing these files
4. **Access full details** by opening the corresponding GitHub issue (links in table below)

---

## 📁 Directory Structure

```
wave-5-documentation-audit/
├── INDEX.md (this file)
├── parents/
│   ├── 01-issue-templates-automation-audit.md
│   ├── 02-canonical-configs-audit.md
│   ├── 03-documentation-consolidation-audit.md
│   ├── 04-readme-mermaid-audit.md
│   └── 05-file-organization-audit.md
├── children/
│   ├── 01-1-template-inventory.md
│   ├── 01-2-template-automation-mapping.md
│   ├── 01-3-labeler-rules-audit.md
│   ├── 01-4-ai-instructions.md
│   ├── 02-1-labels-color-consistency.md
│   ├── 02-2-issue-types-mapping.md
│   ├── 02-3-issue-fields-config.md
│   ├── 02-4-config-relationships.md
│   ├── 03-1-issue-creation-docs.md
│   ├── 03-2-pr-creation-docs.md
│   ├── 03-3-labeling-docs.md
│   ├── 03-4-file-organization-alignment.md
│   ├── 03-5-update-index.md
│   ├── 04-1-discover-audit-readmes.md
│   ├── 04-2-validate-mermaid-syntax.md
│   ├── 04-3-accessibility-compliance.md
│   ├── 04-4-update-readmes.md
│   ├── 05-1-current-vs-planned.md
│   ├── 05-2-agent-script-locations.md
│   └── 05-3-migration-plan.md
└── templates/
    └── (reusable issue templates)
```

---

## 🎯 Issue Summary

### Parent Issues (5 total)

| Issue | Title | Type | Area | Effort | Status |
|-------|-------|------|------|--------|--------|
| [#649](https://github.com/lightspeedwp/.github/issues/649) | Issue Templates, Automation, & AI Agent Integration | Audit | automation, labels | M | open |
| [#650](https://github.com/lightspeedwp/.github/issues/650) | Canonical Config Files (labels, issue-types, issue-fields) | Audit | labels, automation | L | open |
| [#651](https://github.com/lightspeedwp/.github/issues/651) | Documentation Consolidation - Reduce Duplication | Audit | documentation | XL | open |
| [#652](https://github.com/lightspeedwp/.github/issues/652) | 44 README Files - Mermaid Diagrams & Accessibility | Audit | documentation, a11y | XL | open |
| [#653](https://github.com/lightspeedwp/.github/issues/653) | File Organization - Align with CLAUDE.md Boundaries | Audit | core | L | open |

### Child Issues by Parent

#### Parent #649: Issue Templates & Automation (4 children)

- [#654](https://github.com/lightspeedwp/.github/issues/654): Issue Template Inventory & Standardization (Audit, S)
- [#655](https://github.com/lightspeedwp/.github/issues/655): Issue Template → Automation Trigger Mapping (Audit, M)
- [#656](https://github.com/lightspeedwp/.github/issues/656): Issue Labeling Rules in labeler.yml (Audit, M)
- [#657](https://github.com/lightspeedwp/.github/issues/657): Clear AI Agent Instructions for Issue Creation (Task, M)

#### Parent #650: Canonical Configs (4 children)

- [#658](https://github.com/lightspeedwp/.github/issues/658): labels.yml Color Consistency & Strategy (Audit, M)
- [#659](https://github.com/lightspeedwp/.github/issues/659): Issue Types Alignment with Templates & Labels (Audit, M)
- [#660](https://github.com/lightspeedwp/.github/issues/660): Issue Fields Configuration vs. GitHub API (Audit, M)
- [#661](https://github.com/lightspeedwp/.github/issues/661): Canonical Config File Interdependencies (Task, L)

#### Parent #651: Documentation Consolidation (5 children)

- [#662](https://github.com/lightspeedwp/.github/issues/662): Issue Creation Docs - Consolidate (Audit, M)
- [#663](https://github.com/lightspeedwp/.github/issues/663): PR Creation Docs - Consolidate (Audit, M)
- [#664](https://github.com/lightspeedwp/.github/issues/664): Labeling Docs - Consolidate (Audit, M)
- [#665](https://github.com/lightspeedwp/.github/issues/665): File Organization vs. CLAUDE.md (Audit, M)
- [#666](https://github.com/lightspeedwp/.github/issues/666): Update Documentation Index (Task, M)

#### Parent #652: README & Mermaid Audit (4 children)

- [#667](https://github.com/lightspeedwp/.github/issues/667): Discover All 44 README Files (Audit, M)
- [#668](https://github.com/lightspeedwp/.github/issues/668): Validate Mermaid Diagram Syntax (Audit, L)
- [#669](https://github.com/lightspeedwp/.github/issues/669): Mermaid Accessibility Compliance (Audit, L)
- [#670](https://github.com/lightspeedwp/.github/issues/670): Fix & Refresh 44 README Files (Task, XL)

#### Parent #653: File Organization (3 children)

- [#671](https://github.com/lightspeedwp/.github/issues/671): Current vs. Planned File Organization (Audit, M)
- [#672](https://github.com/lightspeedwp/.github/issues/672): Agent & Script Files - Migration Status (Audit, M)
- [#673](https://github.com/lightspeedwp/.github/issues/673): File Organization Refactoring Plan (Task, L)

---

## 🔗 Reference Links Preserved

All issues include links to:

- **Configuration files:** `.github/labels.yml`, `issue-types.yml`, `labeler.yml`, `issue-fields.yml`
- **Documentation files:** All files in `docs/` with full GitHub URLs
- **Templates:** Issue, PR, and Discussion templates
- **Instructions:** All `.instructions.md` files across `instructions/`
- **Related issues:** #512, #513 (Wave 3 README audit)
- **Main reference:** CLAUDE.md

See each issue file for specific links.

---

## ✅ Pre-Creation Checklist

Before creating issues in GitHub, verify:

- [ ] All parent issue files exist in `parents/`
- [ ] All child issue files exist in `children/`
- [ ] All reference links are correct (can check by opening in GitHub)
- [ ] All issue titles are clear and specific
- [ ] All effort estimates are reasonable
- [ ] All parent-child relationships are documented
- [ ] All acceptance criteria are specific and measurable
- [ ] All deliverables are clear

---

## 📊 Statistics

- **Total Issues:** 25 (5 parents + 20 children)
- **Total Effort:** ~85-95 hours (if executed sequentially)
- **Expected Timeline:** 5-6 weeks (depending on team capacity)

**Effort Breakdown:**

- Audits: ~50-60 hours
- Implementation/fixes: ~25-35 hours

---

## 🚀 Next Steps

1. **Triage Phase** (Current)
   - Review all issue files in this directory
   - Prioritize which audits to execute first
   - Assign team members to issues
   - Verify reference links are correct

2. **Execution Phase**
   - Execute audits in parallel (can run simultaneously)
   - Document findings in GitHub issue comments
   - Consolidate findings across related audits

3. **Implementation Phase** (Follows completion of audits)
   - Create implementation issues based on audit findings
   - Fix issues identified in audits
   - Update documentation and configuration files
   - Verify changes work correctly (test automated labeling, etc.)

---

## 📝 GitHub Issues Created

✅ All 5 parent issues created (#649–#653)
✅ All 20 child issues created (#654–#673)
✅ Parent-child relationships established in GitHub
✅ All reference links included and preserved
✅ All effort estimates provided
✅ All acceptance criteria specified

**Status:** Issues ready for execution — see GitHub links in tables above

---

**Last Updated:** 2026-05-31  
**Created By:** Claude Code  
**For:** LightSpeed Team
