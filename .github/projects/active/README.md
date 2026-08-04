# Active Projects Index

## LightSpeed `.github` Repository — Project Tracking

**Index Version:** 1.0  
**Last Updated:** 2026-07-26  
**Status:** Active Project Management  

---

## Overview

This directory tracks active projects, initiatives, and work in progress for the LightSpeed `.github` control plane. Each project is self-contained with its own scope, timeline, owner, and documentation.

---

## 📋 Active Projects

### 1. Repository Restructuring (2026-07-25)

**Status:** 🟡 Phase 0 Complete — Phase 1 Ready  
**Owner:** Ash Shaw  
**Duration:** ~3–4 weeks  
**Start Date:** 2026-07-25

**Overview:**  
Major restructuring of the `.github` repository to optimize folder organization, consolidate schemas, enable multi-project VSCode setup, and support phased plugin adoption.

**Key Deliverables:**

- ✅ Repository specification and decision documentation
- ✅ Automated developer setup scripts
- ✅ VSCode multi-root workspace configuration
- ✅ Comprehensive migration guide
- ✅ Plugin adoption roadmap
- ✅ Team support infrastructure

**Current Phase:**  
Phase 0 (Pre-flight validation) — COMPLETE

**Next Phase:**  
Phase 1.A (Manual folder moves via Finder)

**Status Dashboard:**

| Phase | Status | Duration |
|-------|--------|----------|
| 0 | ✅ Complete | 1–2 days |
| 1.A | 🔜 Ready | 1–2 hours |
| 1.B | 🔜 Ready | 2–3 days |
| 1.C | 🔜 Ready | 1 day |
| 2 | 🔜 Ready | 2–3 days |
| 3 | 🔜 Ready | 3–4 days |
| 4 | 🔜 Ready | 3–4 days |
| 5 | 🔜 Ready | 3+ weeks |

**Key Files:**

- [README.md](./repo-restructuring-2026-07-25/README.md) — Project overview
- [INDEX.md](./repo-restructuring-2026-07-25/INDEX.md) — Document index and navigation
- [SPECIFICATION.md](./repo-restructuring-2026-07-25/SPECIFICATION.md) — Full specification
- [PHASE-1A-MANUAL-MOVES.md](./repo-restructuring-2026-07-25/PHASE-1A-MANUAL-MOVES.md) — Next phase
- [PHASE-1B-PATH-UPDATES.md](./repo-restructuring-2026-07-25/PHASE-1B-PATH-UPDATES.md) — Claude automation

**Directory:** [`repo-restructuring-2026-07-25/`](./repo-restructuring-2026-07-25/)

---

## 📊 Project Status Overview

| Project | Status | Owner | Phase | Timeline |
|---------|--------|-------|-------|----------|
| **Repository Restructuring** | 🟡 Active | Ash Shaw | Phase 0→1 | Jul 25–Sep 9 |

---

## 🗂️ Project Structure

Each active project directory contains:

```
active/
└── {project-slug}-{date}/
    ├── README.md                  # Project overview & quick start
    ├── INDEX.md                   # Document index & navigation
    ├── SPECIFICATION.md           # Project specification
    ├── PREFLIGHT_CHECKLIST.md     # Pre-flight validation
    ├── PHASE-1-*.md              # Phase-specific documentation
    ├── PHASE-2-*.md
    ├── [etc.]
    └── [generated documents]      # Created during execution
        ├── AUDIT-RESULTS.md
        ├── SUMMARY.md
        └── [etc.]
```

---

## 🚀 How to Access a Project

### Quick Navigation

**Repository Restructuring:**

1. Open: [`repo-restructuring-2026-07-25/`](./repo-restructuring-2026-07-25/)
2. Start with: [`README.md`](./repo-restructuring-2026-07-25/README.md)
3. Navigate with: [`INDEX.md`](./repo-restructuring-2026-07-25/INDEX.md)

### By Role

**Project Owner (Ash Shaw):**

1. Open [`README.md`](./repo-restructuring-2026-07-25/README.md) for overview
2. Read [`SPECIFICATION.md`](./repo-restructuring-2026-07-25/SPECIFICATION.md) for full context
3. Execute phase instructions from PHASE-*.md files

**Claude Code Agent:**

1. Find the phase-specific PHASE-*.md file
2. Copy the prompt section
3. Execute in Claude Code
4. Review results and commit

**Team Members:**

1. Wait for Phase 5 (rollout announcement)
2. Follow setup instructions from docs/
3. Ask questions in GitHub issues

---

## 📈 Project Metrics

### Repository Restructuring (2026-07-25)

**Documentation Created:**

- 10+ phase-specific documents
- 20+ supporting documents
- 40+ sections of detailed guidance

**Scope:**

- 7 folders being reorganized
- 50+ files requiring path updates
- 1+ week of team time (distributed)

**Success Criteria:**

- ✅ Phase 0 complete (pre-flight validation)
- ⏳ Phase 1 ready (folder moves)
- ⏳ Phases 2–5 waiting (schema→plugin→rollout)

---

## 🔄 Project Lifecycle

### Active Project States

**🟡 In Progress**  
Active work ongoing, phases in execution

**🟢 Planning**  
Pre-work phase, gathering requirements (not currently active)

**🟠 Blocked**  
Awaiting dependencies or decisions (none currently)

**✅ Complete**  
All phases finished, team operating under new structure

**⚪ Archived**  
Completed and moved to archived projects

---

## 📝 Creating New Projects

When starting a significant initiative:

### 1. Create Project Directory

```bash
mkdir -p .github/projects/active/{project-slug}-{YYYY-MM-DD}/
```

Example: `repo-restructuring-2026-07-25/`

### 2. Create Core Documents

- `README.md` — Project overview, quick start, status dashboard
- `INDEX.md` — Document index and navigation guide
- `SPECIFICATION.md` — Goals, decisions, architecture
- `PREFLIGHT_CHECKLIST.md` — Pre-work validation (if applicable)
- `PHASE-*.md` — Phase-specific documentation (one per phase)

### 3. Add to Active Projects Index

Update `.github/projects/active/README.md` (this file):

```markdown
### N. Project Name (YYYY-MM-DD)

**Status:** 🟡 Phase X  
**Owner:** Person Name  
**Duration:** Estimated timeline  
**Start Date:** YYYY-MM-DD

[Brief description]

**Key Files:**
- [README.md](...) — Overview
- [INDEX.md](...) — Navigation
- [SPECIFICATION.md](...) — Specification

**Directory:** [`project-slug-date/`](./project-slug-date/)
```

### 4. Reference in Global Index

Add entry to status table at top of this file.

---

## 🔗 Related Documents

### Repository-Wide

- [CLAUDE.md](../../CLAUDE.md) — Repository governance and organization
- [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md) — Git workflow and branch rules
- [AGENTS.md](../../AGENTS.md) — Global AI operations governance

### Project Planning

- [Repository Restructuring Project](./repo-restructuring-2026-07-25/README.md) — Current major initiative
- [Archived Projects](../archived/README.md) — Completed initiatives

---

## 📞 Support & Questions

### For Project Owners

- Review project README.md for complete context
- Check SPECIFICATION.md for decisions and rationale
- Reference PHASE-*.md files for execution guidance

### For Team Members

- Check Phase 5 documentation for rollout information
- Ask questions in GitHub issues with appropriate labels
- Contact Ash Shaw for critical blockers

### For Future Maintainers

- This index shows active projects only
- See `../archived/` for completed projects
- Project documents are self-contained and portable

---

## 🎯 Success Indicators

**Repository Restructuring Project (Current):**

- ✅ Specification created and decision-locked
- ⏳ Phase 0 validation in progress
- ⏳ Phase 1–5 awaiting execution
- Expected: Full team adoption by September 2026

---

## 📋 Checklist: Creating New Projects

When starting a new project:

- [ ] Create project directory with slug and date: `{type}-{date}/`
- [ ] Create README.md with overview and quick start
- [ ] Create INDEX.md with document navigation
- [ ] Create SPECIFICATION.md with goals and decisions
- [ ] Create PHASE-*.md documents for each phase
- [ ] Add project entry to this index (README.md)
- [ ] Add status table entry
- [ ] Add directory link
- [ ] Brief team on project (if applicable)
- [ ] Begin Phase 0 or Phase 1

---

**Index Version:** 1.0  
**Last Updated:** 2026-07-26  
**Next Review:** After Repository Restructuring Phase 1 completion  
**Maintained By:** Ash Shaw
