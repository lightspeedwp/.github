---
title: "Wave 5 Documentation Audit - Issue Index"
description: "Complete index of all parent and child issues for the Documentation Audit project"
version: "1.0.0"
created_date: "2026-05-31"
status: "issues-created"
---

# Wave 5 Documentation Audit — Issue Index

This directory contains all parent and child issues for the comprehensive documentation audit initiative. All 29 issues have been created in GitHub (#649-#673).

## 📋 How to Use This Directory

1. **Review all issues** in this folder to verify content and links
2. **Check that all reference links** are correct and preserved
3. **Once approved:** Create issues in GitHub using the markdown files as templates
4. **Track progress:** Update this index as issues are created

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

| # | Title | GitHub # | Type | Area | Effort | Status |
|---|-------|----------|------|------|--------|--------|
| 1 | Issue Templates, Automation, & AI Agent Integration | #649 | Audit | automation, labels | M | needs-triage |
| 2 | Canonical Config Files (labels, issue-types, issue-fields) | #650 | Audit | labels, automation | L | needs-triage |
| 3 | Documentation Consolidation - Reduce Duplication | #651 | Audit | documentation | XL | needs-triage |
| 4 | 44 README Files - Mermaid Diagrams & Accessibility | #652 | Audit | documentation, a11y | XL | needs-triage |
| 5 | File Organization - Align with CLAUDE.md Boundaries | #653 | Audit | core | L | needs-triage |

### Child Issues by Parent

#### Parent 1: Issue Templates & Automation (4 children)
- 1.1: Issue Template Inventory & Standardization (#654, Audit, S)
- 1.2: Issue Template → Automation Trigger Mapping (#655, Audit, M)
- 1.3: Issue Labeling Rules in labeler.yml (#656, Audit, M)
- 1.4: Clear AI Agent Instructions for Issue Creation (#657, Task, M)

#### Parent 2: Canonical Configs (4 children)
- 2.1: labels.yml Color Consistency & Strategy (#658, Audit, M)
- 2.2: Issue Types Alignment with Templates & Labels (#659, Audit, M)
- 2.3: Issue Fields Configuration vs. GitHub API (#660, Audit, M)
- 2.4: Canonical Config File Interdependencies (#661, Task, L)

#### Parent 3: Documentation Consolidation (5 children)
- 3.1: Issue Creation Docs - Consolidate (#662, Audit, M)
- 3.2: PR Creation Docs - Consolidate (#663, Audit, M)
- 3.3: Labeling Docs - Consolidate (#664, Audit, M)
- 3.4: File Organization vs. CLAUDE.md (#665, Audit, M)
- 3.5: Update Documentation Index (#666, Task, M)

#### Parent 4: README & Mermaid Audit (4 children)
- 4.1: Discover All 44 README Files (#667, Audit, M)
- 4.2: Validate Mermaid Diagram Syntax (#668, Audit, L)
- 4.3: Mermaid Accessibility Compliance (#669, Audit, L)
- 4.4: Fix & Refresh 44 README Files (#670, Task, XL)

#### Parent 5: File Organization (3 children)
- 5.1: Current vs. Planned File Organization (#671, Audit, M)
- 5.2: Agent & Script Files - Migration Status (#672, Audit, M)
- 5.3: File Organization Refactoring Plan (#673, Task, L)

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

- **Total Issues:** 29 (5 parents + 24 children)
- **Total Effort:** ~90-100 hours (if executed sequentially)
- **Expected Timeline:** 5-6 weeks (depending on team capacity)

**Effort Breakdown:**
- Audits: ~50-60 hours
- Implementation/fixes: ~30-40 hours

---

## 🚀 Next Steps

1. **Review Phase** (Current)
   - Read through all issue files
   - Verify reference links are correct
   - Check for any missing information
   - Approve for GitHub creation

2. **Creation Phase**
   - Create all issues in GitHub
   - Link parent ↔ child relationships
   - Assign to team members

3. **Execution Phase**
   - Execute audits in parallel (can run simultaneously)
   - Consolidate findings
   - Create implementation issues based on findings

4. **Implementation Phase** (Follows completion of audits)
   - Fix issues identified in audits
   - Update documentation and configs
   - Verify automated labeling works correctly

---

## ✅ GitHub Issues Created

✅ All 5 parent issues created (#649-#653)
✅ All 24 child issues created (#654-#673)
✅ All reference links preserved in issue bodies
✅ All effort estimates and acceptance criteria included
✅ All labels applied correctly (type, area, priority)

**Status:** All issues successfully created in GitHub

---

**Last Updated:** 2026-05-31  
**Created By:** Claude Code  
**For:** LightSpeed Team
