---
title: "Wave 3B Issue Specification"
description: "GitHub issue specification for Wave 3B: README & Mermaid Repair & Update"
created_date: "2026-05-28"
last_updated: "2026-05-28"
file_type: "issue-spec"
version: "v1.0"
status: "ready-to-create"
---

# Wave 3B: README & Mermaid Repair & Update

## Issue Body (Ready for GitHub)

### Title

Wave 3B: README & Mermaid Diagram Repair & Update

### Labels

- `type:enhancement`
- `area:documentation`
- `priority:high`
- `status:needs-triage`
- `comp:readme-mermaid`
- `wave:3b`

### Milestone

None (linked to Wave 3 Epic)

### Assignees

@claude (AI team member - Review & UX specialist)

### Related Issues

- Depends on: #512 (Wave 3A: README & Mermaid Diagram Discovery & Audit)
- Related to: next-issues-execution-plan.md (Wave 3 Roadmap)

### Description

Based on the audit report generated in **Wave 3A** (#512), this wave focuses on systematically repairing broken Mermaid diagrams and updating stale README content across the repository.

#### Objectives

- Fix all invalid Mermaid syntax errors identified in Wave 3A audit
- Add accessibility attributes to all Mermaid diagrams (accTitle, accDescr)
- Update README content that is >6 months stale (per frontmatter last_updated)
- Ensure WCAG 2.2 AA compliance for diagrams and documentation
- Validate all diagrams render correctly in GitHub

#### Deliverables

1. **Updated README files** (44 total, prioritized by Wave 3A findings)
   - ✅ HIGH (18 files): Root/core + feature folders with critical diagrams
   - ✅ MEDIUM (20 files): Sub-folder documentation
   - ✅ LOW (6 files): Test/config documentation

2. **Mermaid Diagram Fixes**
   - Fixed syntax errors (all diagrams validated)
   - Added accTitle attributes (accessibility)
   - Added accDescr attributes (WCAG compliance)
   - Tested rendering in GitHub Markdown preview

3. **Staleness Updates**
   - Updated last_updated frontmatter dates for all modified README files
   - Created/updated stale content with current information
   - Verified no README shows >6 months stale status

4. **Documentation Report**
   - repair-report.md: Summary of changes by priority tier
   - accessibility-audit.md: WCAG 2.2 AA compliance verification
   - mermaid-validation.md: Diagram syntax and rendering validation

### Acceptance Criteria

- [ ] All Mermaid syntax errors from Wave 3A audit report are fixed
- [ ] All 44 README files have validated Mermaid diagrams (syntax valid)
- [ ] 100% of diagrams have accTitle attributes for accessibility
- [ ] 100% of diagrams have accDescr attributes for WCAG compliance
- [ ] Frontmatter last_updated dates reflect actual modification dates
- [ ] Zero README files show >6 months stale (Wave 3A finding)
- [ ] All diagrams render correctly in GitHub Markdown preview
- [ ] README repairs documented in repair-report.md with change summary
- [ ] Accessibility validation report completed (accessibility-audit.md)
- [ ] Mermaid validation report completed (mermaid-validation.md)

### Definition of Done

1. Wave 3A audit report reviewed and categorized by priority
2. HIGH-priority diagrams repaired first (18 files)
3. MEDIUM-priority diagrams repaired second (20 files)
4. LOW-priority diagrams repaired last (6 files)
5. All repairs tested in GitHub preview
6. Accessibility attributes verified (accTitle, accDescr present)
7. WCAG 2.2 AA compliance confirmed
8. Frontmatter dates updated to reflect actual modification dates
9. Three deliverable reports generated and committed
10. Pull request opened with repair summary and linked to #512

### Success Metrics

- ✅ 100% of Mermaid diagrams in 44 README files are syntax-valid
- ✅ 100% diagram accessibility compliance (accTitle + accDescr)
- ✅ 100% of diagrams render correctly in GitHub preview
- ✅ Zero README files exceed 6-month staleness threshold
- ✅ Stakeholder review of repair report completed
- ✅ All acceptance criteria checked and verified
- ✅ Pull request merged to develop branch

### Notes & Constraints

- **Depends on**: Wave 3A must complete and provide audit report (#512)
- **No Code Changes**: This is documentation-only; no application code changes
- **Accessibility-First**: WCAG 2.2 AA compliance is non-negotiable
- **GitHub-Native**: All diagrams must render in GitHub Markdown (no external tools)
- **Parallel Work**: Can be executed in parallel with Wave 3A if audit report is shared early

### Owner & Effort

- **Owner**: Claude (AI Team - Review & UX Specialist)
- **Effort Estimate**: 4-6 hours
- **Dependencies**: #512 (Wave 3A audit report)
- **Related Epics**: next-issues-execution-plan.md#wave-3

### Resources

- [Wave 3A: README & Mermaid Diagram Discovery & Audit](https://github.com/lightspeedwp/.github/issues/512)
- [next-issues-execution-plan.md](.github/projects/active/next-issues-execution-plan.md)
- [workflow-coordination.md](.github/docs/workflow-coordination.md) - README Audit Workflow Contract
- [Wave 3 README Audit Scope](./next-issues-execution-plan.md#wave-3-readme-audit-scope)
- [Mermaid Diagram Guidelines](./instructions/mermaid.instructions.md)
- [WCAG 2.2 AA Standards](./instructions/a11y.instructions.md)
- [Markdown Standards](./instructions/documentation-formats.instructions.md)
