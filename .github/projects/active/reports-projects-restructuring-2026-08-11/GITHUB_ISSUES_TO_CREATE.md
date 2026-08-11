---
title: "GitHub Issues to Create — Reports & Projects Restructuring"
description: "Complete list of GitHub issues to create for the restructuring initiative"
type: "issues-list"
created_date: "2026-08-11"
---

# GitHub Issues to Create — Reports & Projects Restructuring

## Master Epic

### Issue #1: Reports & Projects Restructuring Initiative (EPIC)

**Type:** Epic  
**Title:** Reports & Projects Restructuring Initiative  
**Labels:** `type:epic`, `area:repos`, `priority:important`, `meta:needs-changelog`

**Body:**

```markdown
## Overview

Comprehensive restructuring of `.github/reports/` and `.github/projects/active/` folders to establish:
- Organized report lifecycle (active/archive/history)
- Bidirectional linking between projects and GitHub issues
- Automated validation and archival workflow
- Sustainable process for future work

## Current State
- 106 reports (partially organized)
- ~80 orphaned reports
- 31 active projects
- 2 unlinked projects (openspec, markdown-audit-ci-optimization)

## Target State
- All reports categorized & organized
- All projects linked to ≥1 GitHub issue
- Bidirectional linking standard established
- Archive workflow implemented
- CI validation for link integrity

## Timeline
- **Phase 1:** Audit & Planning (2026-08-11 to 2026-08-17)
- **Phase 2:** Folder Structure & Linking (2026-08-18 to 2026-08-31)
- **Phase 3:** Archive Workflow & Automation (2026-09-01 to 2026-09-14)
- **Phase 4:** Cleanup & Documentation (2026-09-15 to 2026-09-21)

## Related Project
- [.github/projects/active/reports-projects-restructuring-2026-08-11/](./.github/projects/active/reports-projects-restructuring-2026-08-11/)

## Sub-Issues
- See Phase issues below

---

Depends on completion of all 4 phases. Closes when all success criteria met.
```

---

## Phase Issues

### Issue #2: Phase 1 — Audit & Planning

**Type:** Task  
**Title:** Phase 1: Audit & Planning — Reports & Projects Structure  
**Parent Epic:** #1  
**Labels:** `type:task`, `area:repos`, `priority:important`

**Body:**

```markdown
## Overview
Complete comprehensive audit of `.github/reports/` and `.github/projects/active/` folders, design folder structure, and create detailed execution plan.

## Related Project
- [reports-projects-restructuring-2026-08-11](./.github/projects/active/reports-projects-restructuring-2026-08-11/)

## Deliverables
- [x] Audit reports inventory (106 files, categorization, references)
- [x] Audit projects inventory (31 projects, linking status)
- [x] Identify linking gaps (2 unlinked projects, 80 orphaned reports)
- [ ] Design report folder structure
- [ ] Design archive strategy
- [ ] Create bidirectional linking standard
- [ ] Create execution plan

## Definition of Done
- [ ] AUDIT_RESULTS.md reviewed & approved
- [ ] LINKING_STANDARD.md created & approved
- [ ] Report categorization plan documented
- [ ] Archive strategy documented
- [ ] Execution plan ready for Phase 2
- [ ] GitHub issues created for Phases 2-4

## Timeline
2026-08-11 to 2026-08-17 (1 week)

## Resources
- [AUDIT_RESULTS.md](./.github/projects/active/reports-projects-restructuring-2026-08-11/AUDIT_RESULTS.md)
- [PLANNING.md](./.github/projects/active/reports-projects-restructuring-2026-08-11/PLANNING.md)
```

### Issue #3: Phase 2 — Folder Structure & Linking

**Type:** Task  
**Title:** Phase 2: Folder Structure & Linking — Migrate Reports & Link Projects  
**Parent Epic:** #1  
**Labels:** `type:task`, `area:repos`, `priority:important`

**Body:**

```markdown
## Overview
Restructure `.github/reports/` folder, migrate 80+ reports to appropriate locations, and link all 31 projects to GitHub issues.

## Related Project
- [reports-projects-restructuring-2026-08-11](./.github/projects/active/reports-projects-restructuring-2026-08-11/)

## Deliverables
- [ ] Create new folder structure (active/, archive/*, etc.)
- [ ] Migrate 25 weekly summaries → `archive/weekly-summaries/`
- [ ] Migrate 40+ deprecated audits → `archive/deprecated-audits/`
- [ ] Migrate workflow artifacts → `archive/workflow-artifacts/`
- [ ] Organize active reports by category
- [ ] Zero reports in root (except README.md)
- [ ] Link openspec to issues
- [ ] Link markdown-audit-ci-optimization (determine status)
- [ ] Add "Related Issues" to all 31 projects
- [ ] Update issues with "Related Projects" comments

## Subtasks
- [ ] Create folder structure
- [ ] Migrate weekly summaries (25 files)
- [ ] Migrate deprecated audits (40+ files)
- [ ] Migrate other reports (workflow, a11y, historical)
- [ ] Link openspec project
- [ ] Link markdown-audit-ci-optimization
- [ ] Update all project READMEs
- [ ] Update related GitHub issues

## Definition of Done
- [ ] All reports migrated & organized
- [ ] All 31 projects have ≥1 linked issue
- [ ] All linking standard patterns used correctly
- [ ] GitHub preview validates all links
- [ ] PR reviewed & merged to develop
- [ ] Zero reports in root

## Timeline
2026-08-18 to 2026-08-31 (2 weeks)

## Resources
- [PLANNING.md — Phase 2](./.github/projects/active/reports-projects-restructuring-2026-08-11/PLANNING.md#phase-2)
```

### Issue #4: Phase 3 — Archive Workflow & Automation

**Type:** Task  
**Title:** Phase 3: Archive Workflow & Automation — Design & Implement  
**Parent Epic:** #1  
**Labels:** `type:task`, `area:repos`, `priority:normal`

**Body:**

```markdown
## Overview
Design and implement archive workflow for completed projects. Create CI validation for project linking. Optional: Implement automated report aging.

## Related Project
- [reports-projects-restructuring-2026-08-11](./.github/projects/active/reports-projects-restructuring-2026-08-11/)

## Deliverables
- [ ] Archive workflow documented (manual process or GitHub Action)
- [ ] `.archive-status.md` template created & documented
- [ ] CI validation for linked projects implemented
- [ ] First completed project archived with template
- [ ] CLAUDE.md updated with archive process
- [ ] Team documentation & guidelines created

## Design Options
1. **Manual Archive** (Simple, low effort) — Recommended start
2. **Automated Archive** (Medium effort, optional)
3. **Archive-on-Tag** (Advanced, future)

## Subtasks
- [ ] Design archive workflow (choose option)
- [ ] Create `.archive-status.md` template
- [ ] Implement CI validation workflow
- [ ] Dry-run on completed project
- [ ] Test link preservation
- [ ] Document in CLAUDE.md
- [ ] Team training

## Definition of Done
- [ ] Archive workflow documented & tested
- [ ] CI validation in place & working
- [ ] First project successfully archived
- [ ] `.archive-status.md` template used
- [ ] CLAUDE.md updated
- [ ] Team trained on process

## Timeline
2026-09-01 to 2026-09-14 (2 weeks)

## Resources
- [PLANNING.md — Phase 3](./.github/projects/active/reports-projects-restructuring-2026-08-11/PLANNING.md#phase-3)
```

### Issue #5: Phase 4 — Cleanup & Documentation

**Type:** Task  
**Title:** Phase 4: Cleanup & Documentation — Finalize Restructuring  
**Parent Epic:** #1  
**Labels:** `type:task`, `area:repos`, `priority:normal`

**Body:**

```markdown
## Overview
Final cleanup, documentation updates, validation, and team communication to complete the restructuring initiative.

## Related Project
- [reports-projects-restructuring-2026-08-11](./.github/projects/active/reports-projects-restructuring-2026-08-11/)

## Deliverables
- [ ] `.github/reports/README.md` updated with lifecycle policy
- [ ] `docs/LINKING_STANDARD.md` published (public reference)
- [ ] `CLAUDE.md` updated with new structure
- [ ] `.github/projects/active/` reference page created
- [ ] Final validation of all links
- [ ] Team training & communication
- [ ] Initiative marked complete

## Subtasks
- [ ] Update report folder README
- [ ] Update CLAUDE.md
- [ ] Publish linking standard to docs/
- [ ] Validate all links in structure
- [ ] Create team communication/documentation
- [ ] Conduct final review
- [ ] Mark project as complete

## Definition of Done
- [ ] All documentation updated
- [ ] Linking standard published
- [ ] Final validation passed (0 broken links)
- [ ] Team trained & aligned
- [ ] Initiative closed with success summary

## Timeline
2026-09-15 to 2026-09-21 (1 week)

## Resources
- [PLANNING.md — Phase 4](./.github/projects/active/reports-projects-restructuring-2026-08-11/PLANNING.md#phase-4)
```

---

## Project-Specific Linking Issues

### Issue #6: Link openspec to GitHub Issues

**Type:** Task  
**Title:** Link openspec project to GitHub issues  
**Parent Epic:** #1  
**Labels:** `type:task`, `area:openspec`, `priority:important`

**Body:**

```markdown
## Overview
The openspec project is active and referenced (8 external refs) but lacks GitHub issue links. This issue tracks adding proper linking to related work.

## Related Projects
- [openspec](./.github/projects/active/openspec/)
- [reports-projects-restructuring-2026-08-11](./.github/projects/active/reports-projects-restructuring-2026-08-11/)

## Tasks
- [ ] Review openspec folder structure
- [ ] Identify related specs (agent-tool-permission-alignment, test-coverage-implementation)
- [ ] Create or link to relevant GitHub issues
- [ ] Add "Related Issues" section to `.github/projects/active/openspec/README.md`
- [ ] Add "Related Projects" comment to each linked issue
- [ ] Validate all links work

## Definition of Done
- [ ] openspec linked to ≥1 GitHub issue
- [ ] Related Issues table in README with valid links
- [ ] All issues updated with "Related Projects" comment
- [ ] Links validate in GitHub preview

## Related
- Phase 2 of reports-projects-restructuring-2026-08-11
```

### Issue #7: Determine Status & Link markdown-audit-ci-optimization

**Type:** Task  
**Title:** Determine status of markdown-audit-ci-optimization project  
**Parent Epic:** #1  
**Labels:** `type:task`, `area:ci`, `priority:normal`

**Body:**

```markdown
## Overview
The markdown-audit-ci-optimization project was created 2026-07-24 but is stale (no updates in 2+ weeks) and lacks GitHub issue links. Determine if completed/archived or reactivate & link.

## Related Projects
- [markdown-audit-ci-optimization](./.github/projects/active/markdown-audit-ci-optimization/)
- [reports-projects-restructuring-2026-08-11](./.github/projects/active/reports-projects-restructuring-2026-08-11/)

## Tasks
- [ ] Review project folder & documentation
- [ ] Determine project status (active/completed/blocked?)
- [ ] If active: create issue & link to project
- [ ] If completed: create archive issue
- [ ] If blocked: identify blocker issue & link

## Definition of Done
- [ ] Status determined & documented
- [ ] Action taken (linked or archived)
- [ ] Related issues updated

## Related
- Phase 2 of reports-projects-restructuring-2026-08-11
```

---

## Summary

| Issue | Type | Purpose | Phase | Status |
|-------|------|---------|-------|--------|
| #1 | Epic | Master coordination | All | 🔴 TBD |
| #2 | Task | Phase 1 audit & planning | 1 | 🟢 In Progress |
| #3 | Task | Phase 2 folder + linking | 2 | ⏳ Planned |
| #4 | Task | Phase 3 archive workflow | 3 | ⏳ Planned |
| #5 | Task | Phase 4 cleanup & docs | 4 | ⏳ Planned |
| #6 | Task | Link openspec | 2 | ⏳ Planned |
| #7 | Task | Link/archive markdown-audit | 2 | ⏳ Planned |

**Total Issues to Create:** 7  
**Labels to Use:** type:*, area:*, priority:*, meta:* (see [CLAUDE.md](../../../CLAUDE.md) for canonical labels)

---

**Created:** 2026-08-11  
**Status:** Ready to create  
**Next Step:** Create all 7 issues in GitHub and link them to this project
