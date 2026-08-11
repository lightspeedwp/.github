---
title: "Project Documentation Index"
description: "Complete index of all documents in the Reports & Projects Restructuring project"
type: "index"
---

# Reports & Projects Restructuring — Documentation Index

## Quick Navigation

| Document | Purpose | Read Time | Status |
|----------|---------|-----------|--------|
| [README.md](./README.md) | Project overview, goals, timeline | 5 min | 📝 Active |
| [AUDIT_RESULTS.md](./AUDIT_RESULTS.md) | Complete audit findings & recommendations | 15 min | ✅ Complete |
| [PLANNING.md](./PLANNING.md) | Detailed phase-by-phase planning | 20 min | ✅ Complete |
| [LINKING_STANDARD.md](./LINKING_STANDARD.md) | Bidirectional linking patterns & templates | 10 min | ✅ Complete |
| [GITHUB_ISSUES_TO_CREATE.md](./GITHUB_ISSUES_TO_CREATE.md) | Complete list of GitHub issues to create | 5 min | 📋 Ready |
| [COMPREHENSIVE_AUDIT_PROMPT.md](./COMPREHENSIVE_AUDIT_PROMPT.md) | Reusable audit prompt for agents | 10 min | 🔄 Reference |

---

## Document Descriptions

### [README.md](./README.md)
**Owner:** Ash Shaw  
**Status:** 📝 Active

Main project entry point. Contains:
- Vision & strategic goals
- Current state snapshot
- 4-phase timeline
- Related issues (to be created)
- Key metrics & success criteria

**Start here if:** You're new to the project

---

### [AUDIT_RESULTS.md](./AUDIT_RESULTS.md)
**Status:** ✅ Complete

Complete inventory and analysis from 2026-08-11. Contains:
- Reports inventory (106 files, categorization, references)
- Active projects inventory (31 projects, linking status)
- Bidirectional linking analysis
- High-priority recommendations
- Archive candidates
- Reports that must be preserved

**Read this to:** Understand current state, see detailed findings

---

### [PLANNING.md](./PLANNING.md)
**Status:** ✅ Complete

Detailed phase-by-phase planning (Phases 1-4). Contains:
- Phase objectives, deliverables, tasks
- Timelines & milestones
- Success criteria for each phase
- Subtasks & assignments
- Git workflow (branch naming, PR process)
- Risk mitigation strategies

**Read this to:** Understand how work will be executed

---

### [LINKING_STANDARD.md](./LINKING_STANDARD.md)
**Status:** ✅ Complete

Bidirectional linking standard & templates. Contains:
- Project → Issue linking (templates & examples)
- Issue → Project linking (templates & examples)
- Status badges & patterns
- CI validation rules
- Implementation checklist
- FAQ

**Read this to:** Understand linking requirements, find templates

---

### [GITHUB_ISSUES_TO_CREATE.md](./GITHUB_ISSUES_TO_CREATE.md)
**Status:** 📋 Ready

Complete list of 7 GitHub issues to create. Contains:
- Master epic (Issue #1)
- Phase issues (Issues #2-5)
- Project-specific linking issues (Issues #6-7)
- Issue templates with full body text
- Summary table

**Use this to:** Copy/paste issue templates when creating in GitHub

---

### [COMPREHENSIVE_AUDIT_PROMPT.md](./COMPREHENSIVE_AUDIT_PROMPT.md)
**Status:** 🔄 Reference

Reusable prompt for agents to execute full audit cycle. Contains:
- Phase 1: Inventory & Analysis (detailed tasks)
- Phase 2: Prioritization & Structure Design
- Phase 3: Implementation Planning
- Output formats & success criteria

**Use this for:** Delegating audit work to agents; can be reused for future projects

---

## How to Use These Documents

### **Week 1 (Phase 1 — Audit & Planning)**
1. Read [README.md](./README.md) — understand project vision
2. Review [AUDIT_RESULTS.md](./AUDIT_RESULTS.md) — current state findings
3. Approve [PLANNING.md](./PLANNING.md) — agree on approach
4. Review [LINKING_STANDARD.md](./LINKING_STANDARD.md) — understand patterns
5. Create GitHub issues from [GITHUB_ISSUES_TO_CREATE.md](./GITHUB_ISSUES_TO_CREATE.md)

### **Weeks 2-3 (Phase 2 — Folder & Linking)**
1. Reference [PLANNING.md — Phase 2](./PLANNING.md#phase-2) — execution guide
2. Use [LINKING_STANDARD.md](./LINKING_STANDARD.md) — templates while linking projects
3. Follow git workflow from [PLANNING.md](./PLANNING.md#git-workflow)
4. Update GitHub issues with progress

### **Weeks 4-5 (Phase 3 — Archive Workflow)**
1. Reference [PLANNING.md — Phase 3](./PLANNING.md#phase-3) — design options
2. Implement chosen workflow
3. Create `.archive-status.md` files using pattern from [LINKING_STANDARD.md](./LINKING_STANDARD.md)
4. Test CI validation

### **Week 6 (Phase 4 — Cleanup & Documentation)**
1. Reference [PLANNING.md — Phase 4](./PLANNING.md#phase-4) — documentation updates
2. Update CLAUDE.md and `.github/reports/README.md`
3. Publish linking standard to `docs/`
4. Team communication & training

---

## Key Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Reports organized | ~25% | 100% | 🔴 0% |
| Projects linked | 93.5% | 100% | 🟡 93.5% |
| Reports in root | ~13 | 0 | 🔴 13 |
| Archive workflow | None | Documented | 🔴 None |
| CI validation | None | Active | 🔴 None |

---

## Quick Links

**GitHub Issues to Create:** [GITHUB_ISSUES_TO_CREATE.md](./GITHUB_ISSUES_TO_CREATE.md)

**Linking Templates:** [LINKING_STANDARD.md — Examples](./LINKING_STANDARD.md#examples)

**Folder Structure Plan:** [AUDIT_RESULTS.md — Appendix B](./AUDIT_RESULTS.md#appendix-b-archive-migration-commands-preview)

**Timeline Overview:** [PLANNING.md — Phase Overview](./PLANNING.md#phase-overview)

**Unlinked Projects:** 
- [openspec](./../openspec/) — Issue #6
- [markdown-audit-ci-optimization](./../markdown-audit-ci-optimization/) — Issue #7

---

## Support & Questions

**For questions about:** | **See document:**
---|---
Current state findings | AUDIT_RESULTS.md
Phase planning & timeline | PLANNING.md
Linking patterns & templates | LINKING_STANDARD.md
GitHub issues | GITHUB_ISSUES_TO_CREATE.md
Audit methodology | COMPREHENSIVE_AUDIT_PROMPT.md

---

## Document Maintenance

| Document | Last Updated | Owner | Review Date |
|----------|--------------|-------|-------------|
| README.md | 2026-08-11 | Ash | - |
| AUDIT_RESULTS.md | 2026-08-11 | Audit Agent | - |
| PLANNING.md | 2026-08-11 | Ash | 2026-08-15 |
| LINKING_STANDARD.md | 2026-08-11 | Ash | 2026-08-17 |
| GITHUB_ISSUES_TO_CREATE.md | 2026-08-11 | Ash | 2026-08-17 |
| INDEX.md | 2026-08-11 | Ash | 2026-08-17 |

**Next Review:** 2026-08-17 (end of Phase 1)

---

## Archive & Version Info

**Initiative:** Reports & Projects Restructuring  
**Initiated:** 2026-08-11  
**Target Completion:** 2026-09-21  
**Version:** 1.0  
**Scope:** Comprehensive restructuring of .github/reports/ and .github/projects/active/

---

**Last Updated:** 2026-08-11  
**Status:** 📋 Planning phase active
