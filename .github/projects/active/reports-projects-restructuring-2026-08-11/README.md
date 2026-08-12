---
title: "Reports & Projects Restructuring Initiative"
description: "Comprehensive reorganisation of .github/reports/ and .github/projects/active/ folders with proper categorisation, linking, and archival strategy."
status: "active"
created_date: "2026-08-11"
last_updated: "2026-08-11"
author: "Ash Shaw"
epic: true
---

# Reports & Projects Restructuring Initiative

## Vision

Establish a scalable, maintainable structure for reports and active projects that:

- **Organises reports by lifecycle** (active, archived, historical)
- **Links all projects to GitHub issues** bidirectionally
- **Preserves link integrity** when archiving completed projects
- **Prevents link rot** through automated validation
- **Enables clean discovery** of current vs. historical work

## Current State (Phase 4 Complete)

**Reports Organisation (2026-08-12):**

- 106 total markdown files (initially)
- ✅ New folder structure: `active/`, `archive/weekly-summaries/`, `archive/deprecated-audits/`, `archive/workflow-artifacts/`, `archive/a11y-completed/`, `archive/historical/`
- ✅ 5 stub files archived to `archive/deprecated-audits/`
- ✅ 63 reports in `active/` folder (current, referenced)
- ✅ Lifecycle policy documented in `.github/reports/README.md`

**Projects Status (2026-08-12):**

- 31 active projects
- ✅ All projects linked to GitHub issues
- ✅ Bidirectional linking standard established
- ✅ CI validation workflow implemented
- ✅ Archive workflow documented

## Strategic Goals

| Goal | Target | Status |
|------|--------|--------|
| **Reports organised** | 0 reports in root; all categorised | ✅ 100% |
| **Projects linked** | All projects have ≥1 linked issue | ✅ 100% |
| **Bidirectional linking** | All projects ↔ issues linked | ✅ 100% |
| **Archive strategy** | Documented process, optional automation | ✅ 100% |
| **Validation in CI** | CI checks for orphaned projects/reports | ✅ 100% |

## Phases

### Phase 1: Audit & Planning (Current)

**Deliverable:** Complete analysis + planning documents  
**Related PR:** [#1730](https://github.com/lightspeedwp/.github/pull/1730)  
**Related Issues:** [#1731](https://github.com/lightspeedwp/.github/issues/1731), [#1732](https://github.com/lightspeedwp/.github/issues/1732)  
**Timeline:** 1 week (2026-08-11 to 2026-08-17) ✅

- [x] Audit reports inventory
- [x] Audit projects inventory
- [x] Identify linking gaps
- [x] Design report folder structure
- [x] Design archival strategy
- [x] Create bidirectional linking standard
- [x] Create comprehensive execution plan

### Phase 2: Folder Structure & Linking ✅ COMPLETE

**Deliverable:** New folder structure in place + all projects linked  
**Related PR:** [#1752](https://github.com/lightspeedwp/.github/pull/1752)  
**Related Issues:** [#1733](https://github.com/lightspeedwp/.github/issues/1733), [#1736](https://github.com/lightspeedwp/.github/issues/1736), [#1737](https://github.com/lightspeedwp/.github/issues/1737)  
**Timeline:** ✅ 2026-08-11

- [x] Create new report folder structure
- [x] Migrate reports (80 → archive, 25 → archive/weekly-summaries)
- [x] Link unlinked projects (openspec, markdown-audit-ci-optimization)
- [x] Add "Related Issues" section to all projects
- [x] Update GitHub issues with "Related Projects" comments

### Phase 3: Archive Workflow & Automation ✅ COMPLETE

**Deliverable:** Automated or manual archive process + CI validation  
**Related PR:** [#1767](https://github.com/lightspeedwp/.github/pull/1767)  
**Related Issues:** [#1734](https://github.com/lightspeedwp/.github/issues/1734)  
**Timeline:** ✅ 2026-08-11

- [x] Create `.archive-status.md` template
- [x] Design archive workflow (GitHub Action or script)
- [x] Implement CI validation for linked projects
- [x] Document archive process in CLAUDE.md
- [x] Archive completed projects with `.archive-status.md`

### Phase 4: Cleanup & Documentation ✅ COMPLETE

**Deliverable:** Final cleanup + updated project documentation  
**Related PR:** (Pending)  
**Related Issues:** [#1735](https://github.com/lightspeedwp/.github/issues/1735)  
**Timeline:** ✅ 2026-08-12

- [x] Clean up temporary/test reports (5 stub files archived)
- [x] Update `.github/reports/README.md` with lifecycle policy
- [x] Update project with completion documentation
- [x] Publish linking standard to `docs/PROJECT_ISSUE_LINKING_STANDARD.md`
- [x] Update project README with final status

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1731](https://github.com/lightspeedwp/.github/issues/1731) | epic | Master epic for full initiative | 🔴 Complete |
| [#1732](https://github.com/lightspeedwp/.github/issues/1732) | task | Phase 1: Audit & Planning | 🔴 Complete |
| [#1733](https://github.com/lightspeedwp/.github/issues/1733) | task | Phase 2: Folder Structure & Linking | 🔴 Complete |
| [#1734](https://github.com/lightspeedwp/.github/issues/1734) | task | Phase 3: Archive Workflow | 🔴 Complete |
| [#1735](https://github.com/lightspeedwp/.github/issues/1735) | task | Phase 4: Cleanup & Documentation | 🔴 Complete |
| [#1736](https://github.com/lightspeedwp/.github/issues/1736) | task | Link openspec to GitHub issues | 🔴 Complete |
| [#1737](https://github.com/lightspeedwp/.github/issues/1737) | task | Link markdown-audit-ci-optimization | 🔴 Complete |

## Key Documents

- **[AUDIT_RESULTS.md](./AUDIT_RESULTS.md)** — Full audit output (reports + projects inventory)
- **[PLANNING.md](./PLANNING.md)** — Detailed planning for each phase
- **[LINKING_STANDARD.md](./LINKING_STANDARD.md)** — Bidirectional linking patterns & templates
- **[COMPREHENSIVE_AUDIT_PROMPT.md](./COMPREHENSIVE_AUDIT_PROMPT.md)** — Reusable audit methodology
- **[INDEX.md](./INDEX.md)** — Navigation guide for all project documents

## Quick Stats

| Metric | Value |
|--------|-------|
| Total Reports | 106 |
| Safe to Archive | 80+ |
| Active/Preserve | 25 |
| Total Projects | 31 |
| Linked Projects | 29 (93.5%) |
| Unlinked Projects | 2 (6.5%) |
| Estimated Effort | 4-6 weeks |
| Risk Level | Low (link preservation strategy in place) |

## Success Criteria

- [x] Reports organized into active/archive/history folders
- [x] Zero reports in `.github/reports/` root
- [x] All 31 projects have ≥1 linked GitHub issue
- [x] Bidirectional linking templates created & documented
- [x] Archive workflow designed (manual or automated)
- [x] CI validation for project linking in place
- [x] All cleanup work tracked in GitHub issues
- [x] Final state documented in CLAUDE.md

## Completion Summary

✅ **Phase 1** (2026-08-11): Audit & Planning → PR #1730 merged  
✅ **Phase 2** (2026-08-11): Folder Structure & Linking → PR #1752 merged  
✅ **Phase 3** (2026-08-11): Archive Workflow & CI Validation → PR #1767 merged  
✅ **Phase 4** (2026-08-12): Cleanup & Documentation → PR pending

**All deliverables complete.** Reports and projects fully restructured, linked, and validated.

## Next Steps

1. **Submit Phase 4 PR** → Final cleanup & documentation
2. **Merge Phase 4 PR** → Complete initiative
3. **Optional: Archive this project** → Move to `.github/projects/archive/` when ready

---

**Project Owner:** Ash Shaw  
**Last Updated:** 2026-08-12  
**Status:** ✅ Complete (All 4 Phases Delivered)
