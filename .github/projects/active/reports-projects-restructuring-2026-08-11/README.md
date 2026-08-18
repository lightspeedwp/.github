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

## Current State

**Reports Audit Results (2026-08-11):**

- 106 total markdown files
- 10+ categories (partially organized)
- ~80 orphaned reports (0 references)
- 25 weekly summaries (completely orphaned)
- Key reports: wave-5-documentation-audit (33 refs), phase-1-audits (15+ refs)

**Projects Audit Results (2026-08-11):**

- 31 active projects
- 29/31 with issue links ✅
- 2/31 without issue links ⚠️ (openspec, markdown-audit-ci-optimization)
- All created within last 3 months (very active)
- 6 projects with external codebase references

## Strategic Goals

| Goal | Target | Status |
|------|--------|--------|
| **Reports organised** | 0 reports in root; all categorised | 0% |
| **Projects linked** | All projects have ≥1 linked issue | 93.5% |
| **Bidirectional linking** | All projects ↔ issues linked | 60% |
| **Archive strategy** | Documented process, optional automation | 0% |
| **Validation in CI** | CI checks for orphaned projects/reports | 0% |

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

### Phase 2: Folder Structure & Linking (Planned)

**Deliverable:** New folder structure in place + all projects linked  
**Related PR:** (Stacked on #1730)  
**Related Issues:** [#1733](https://github.com/lightspeedwp/.github/issues/1733), [#1736](https://github.com/lightspeedwp/.github/issues/1736), [#1737](https://github.com/lightspeedwp/.github/issues/1737)  
**Timeline:** 2 weeks (2026-08-18 to 2026-08-31)

- [ ] Create new report folder structure
- [ ] Migrate reports (80 → archive, 25 → archive/weekly-summaries)
- [ ] Link unlinked projects (openspec, markdown-audit-ci-optimization)
- [ ] Add "Related Issues" section to all projects
- [ ] Update GitHub issues with "Related Projects" comments

### Phase 3: Archive Workflow & Automation (Planned)

**Deliverable:** Automated or manual archive process + CI validation  
**Related PR:** (Stacked on Phase 2)  
**Related Issues:** [#1734](https://github.com/lightspeedwp/.github/issues/1734)  
**Timeline:** 2 weeks (2026-09-01 to 2026-09-14)

- [ ] Create `.archive-status.md` template
- [ ] Design archive workflow (GitHub Action or script)
- [ ] Implement CI validation for linked projects
- [ ] Document archive process in CLAUDE.md
- [ ] Archive completed projects with `.archive-status.md`

### Phase 4: Cleanup & Documentation (Planned)

**Deliverable:** Final cleanup + updated project documentation  
**Related PR:** (Stacked on Phase 3)  
**Related Issues:** [#1735](https://github.com/lightspeedwp/.github/issues/1735)  
**Timeline:** 1 week (2026-09-15 to 2026-09-21)

- [ ] Clean up temporary/test reports
- [ ] Update `.github/reports/README.md` with lifecycle policy
- [ ] Update CLAUDE.md with new structure reference
- [ ] Publish linking standard to `docs/`
- [ ] Update this project with completion status

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1731](https://github.com/lightspeedwp/.github/issues/1731) | epic | Master epic for full initiative | 🟢 Open |
| [#1732](https://github.com/lightspeedwp/.github/issues/1732) | task | Phase 1: Audit & Planning | ✅ Complete |
| [#1733](https://github.com/lightspeedwp/.github/issues/1733) | task | Phase 2: Folder Structure & Linking | ⏳ Planned |
| [#1734](https://github.com/lightspeedwp/.github/issues/1734) | task | Phase 3: Archive Workflow | ⏳ Planned |
| [#1735](https://github.com/lightspeedwp/.github/issues/1735) | task | Phase 4: Cleanup & Documentation | ⏳ Planned |
| [#1736](https://github.com/lightspeedwp/.github/issues/1736) | task | Link openspec to GitHub issues | 🟢 Open |
| [#1737](https://github.com/lightspeedwp/.github/issues/1737) | task | Link markdown-audit-ci-optimization | 🟢 Open |

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

- [ ] Reports organized into active/archive/history folders
- [ ] Zero reports in `.github/reports/` root
- [ ] All 31 projects have ≥1 linked GitHub issue
- [ ] Bidirectional linking templates created & documented
- [ ] Archive workflow designed (manual or automated)
- [ ] CI validation for project linking in place
- [ ] All cleanup work tracked in GitHub issues
- [ ] Final state documented in CLAUDE.md

## Next Steps

1. **Merge Phase 1 PR** → Complete planning & documentation
2. **Create Phase 2 PR** → Folder structure & linking (2026-08-18)
3. **Execute Phase 2** → Migrate reports & link projects
4. **Implement Phase 3** → Archive workflow + CI validation (2026-09-01)
5. **Complete Phase 4** → Cleanup & documentation (2026-09-15)

---

**Project Owner:** Ash Shaw  
**Last Updated:** 2026-08-11  
**Status:** 🔄 Active (Phase 1: Planning)
