# Project Index: Repository Restructuring (2026-07-25)

**Project Slug:** `repo-restructuring-2026-07-25`  
**Owner:** Ash Shaw  
**Duration:** ~3–4 weeks  
**Status:** ✅ COMPLETE (Phases 1-3 Final)

---

## Core Documents

### 1. [README.md](./README.md)

**Overview of the entire project**

- Executive summary
- Quick links to phases
- Success criteria
- Current status

### 2. [SPECIFICATION.md](./SPECIFICATION.md)

**Project specification and architecture**

- Goals and outcomes
- Confirmed decisions
- Folder mapping (old → new)
- Dependency audit
- Phase roadmap
- What you do vs. what Claude does

### 3. [PREFLIGHT_CHECKLIST.md](./PREFLIGHT_CHECKLIST.md)

**Pre-flight validation before Phase 1**

- Environment checks (Node, npm, git)
- Repository integrity checks
- Test suite verification
- Validation script checks
- Backup protocol
- Sign-off confirmation

---

## Phase-Specific Documents

### Phase 0: Pre-Flight Validation

- **Status:** ✅ COMPLETE
- **Documents:**
  - [SPECIFICATION.md](./SPECIFICATION.md) — Project spec created
  - [PREFLIGHT_CHECKLIST.md](./PREFLIGHT_CHECKLIST.md) — Validation checklist created

### ✅ Phase 1: Agent Consolidation & Foundation (COMPLETE)

- **Status:** ✅ COMPLETE
- **Completion Date:** 2026-08-05
- **Key Work:**
  - Agents consolidated to root `agents/` (16 portable multi-file agents)
  - GitHub-native agents in `.github/agents/` (19 spec-based agents, two-tier structure)
  - File type frontmatter added to 64 agent files
  - Provider naming corrected (github-copilot → copilot)
- **PRs Merged:** #1537, #1538/1603
- **Key Commits:** 7311922ee (agent consolidation), 86f175995 (file_type), a2f491990 (two-tier structure)

### ✅ Phase 2: Portable Scripts Standardization (COMPLETE)

- **Status:** ✅ COMPLETE
- **Completion Date:** 2026-08-05
- **Key Work:**
  - 117 portable scripts migrated to root `scripts/`
  - Path references updated across 26 files (np scripts, workflows, docs)
  - Phase 2B Batches 1-3 completed (PRs #1504, #1518, #1528)
  - Phase 2C validation: 1,120 tests passing, 0 regressions
  - Phase 2C.X remediation: 8 workflows updated, 20 docs corrected
- **PRs Merged:** #1504, #1518, #1528
- **Key Commits:** 5085cb41a (Phase 2B complete), d0ea51e94 (Phase 2C.X remediation)
- **Issues Closed:** #1461, #1464, #1465

### ✅ Phase 3: File Migrations & Governance (COMPLETE)

- **Status:** ✅ COMPLETE
- **Completion Date:** 2026-08-05
- **Key Work:**
  - **Phase 3A:** 27 portable instruction files migrated to root `instructions/` with 502+ reference updates
  - **Phase 3C:** Two-tier agent structure implemented (Tier 1: .github/agents/, Tier 2: agents/) with 788+ reference updates
  - **Phase 3D:** Reports consolidated in `.github/reports/` and `.github/projects/active/`
- **PRs Merged:** #1582 (3A), #1583 (3C), #1581 (3D)
- **Key Commits:** 37b1ea11b (Phase 3A), a2f491990 (Phase 3C), 5bbe023c5 (Phase 3D)
- **Issues Closed:** #1543 (3C), #1544 (3D)

### Phase 4: Schema Consolidation (Next)

- **Status:** 🔜 PLANNED (Phase 4+)
- **Document:** [PHASE-2-SCHEMA-CONSOLIDATION.md](./PHASE-2-SCHEMA-CONSOLIDATION.md)
- **Objective:** Complete schema consolidation from 3 locations → 1 canonical (`.schemas/`)
- **Note:** Phase 1-3 now complete; Phase 4 will focus on schema finalization

### Phase 5: Rollout & Communications (Next)

- **Status:** 🔜 PLANNED (Post-Phase 4)
- **Document:** [PHASE-5-ROLLOUT.md](./PHASE-5-ROLLOUT.md)
- **Note:** Core restructuring complete; Phase 5 focuses on team adoption & final communications

---

## Supporting Documents

### Audit & Summary Documents

- [COMPLETION_REPORT_PHASES_1-3.md](./COMPLETION_REPORT_PHASES_1-3.md) — ✅ Phases 1-3 final completion report
- [INSTRUCTION_FILES_AUDIT_2026-08-05.md](./INSTRUCTION_FILES_AUDIT_2026-08-05.md) — Phase 1 instruction audit (58 files)
- [SCHEMA_AUDIT_REPORT.md](./SCHEMA_AUDIT_REPORT.md) — Phase 1 schema audit (25 core schemas)
- [PHASE-3A-STATUS.md](./PHASE-3A-STATUS.md) — Phase 3A status and progress
- [WEBSITE-UPDATE-REQUIREMENTS.md](./WEBSITE-UPDATE-REQUIREMENTS.md) — Phase 4 handoff doc

---

## Document Quick Links

| Document | Purpose | Status | Updated |
|----------|---------|--------|---------|
| README.md | Project overview | ✅ Created | 2026-07-26 |
| SPECIFICATION.md | Project spec | ✅ Created | 2026-07-26 |
| PREFLIGHT_CHECKLIST.md | Pre-flight validation | ✅ Created | 2026-07-26 |
| PHASE-1A-MANUAL-MOVES.md | Folder moves (manual) | ✅ Created | 2026-07-26 |
| PHASE-1B-PATH-UPDATES.md | Path updates (automated) | ✅ Created | 2026-07-26 |
| PHASE-1C-FINALIZATION.md | Folder finalization | ✅ Created | 2026-07-26 |
| PHASE-2-SCHEMA-CONSOLIDATION.md | Schema audit & updates | ✅ Created | 2026-07-26 |
| PHASE-3-VSCODE-SETUP.md | VSCode automation | ✅ Created | 2026-07-26 |
| PHASE-4-PLUGIN-ADOPTION.md | Plugin guides & website | ✅ Created | 2026-07-26 |
| PHASE-5-ROLLOUT.md | Rollout & communications | ✅ Created | 2026-07-26 |
| SCHEMA-AUDIT.md | Schema consolidation audit | 🔜 Created in Phase 2.A | — |
| PHASE-2-SUMMARY.md | Phase 2 completion summary | 🔜 Created in Phase 2 | — |
| WEBSITE-UPDATE-REQUIREMENTS.md | Website handoff doc | 🔜 Created in Phase 4 | — |
| ANNOUNCEMENT-TEMPLATES.md | Team announcements | 🔜 Created in Phase 5 | — |
| SUPPORT-TRACKER.md | Adoption tracking | 🔜 Created in Phase 5 | — |

---

## Execution Roadmap

```
Phase 0: Pre-Flight (Days 1–2)
├── ✅ Create SPECIFICATION.md
├── ✅ Create PREFLIGHT_CHECKLIST.md
└── ⏳ Run preflight checks & sign-off

Phase 1: Folder Reorganization (Days 3–7)
├── 1.A: Manual folder moves (1–2 hours)
├── 1.B: Path updates (2–3 days)
└── 1.C: Finalization (1 day)

Phase 2: Schema Consolidation (Days 8–10)
├── 2.A: Audit schemas
├── 2.B: Update validation scripts
└── 2.C: Update documentation

Phase 3: VSCode Setup (Days 11–14)
├── Create setup scripts
├── Create workspace file
└── Create documentation

Phase 4: Plugin Adoption (Days 15–18)
├── Create plugin guides
└── Document website updates

Phase 5: Rollout (Weeks 4–8+)
├── Merge to develop
├── Team announcements
├── Monitor adoption
└── Manage grace period
```

---

## Quick Access by Role

### Ash Shaw (Project Owner)

**Start here:**

1. [README.md](./README.md) — Overview
2. [SPECIFICATION.md](./SPECIFICATION.md) — Decisions & confirmation
3. [PREFLIGHT_CHECKLIST.md](./PREFLIGHT_CHECKLIST.md) — Phase 0 validation
4. [PHASE-1A-MANUAL-MOVES.md](./PHASE-1A-MANUAL-MOVES.md) — Manual work
5. [PHASE-5-ROLLOUT.md](./PHASE-5-ROLLOUT.md) — Communications & support

### Claude Code Agent

**Start here:**

1. [PHASE-1B-PATH-UPDATES.md](./PHASE-1B-PATH-UPDATES.md) — Copy prompt, execute
2. [PHASE-1C-FINALIZATION.md](./PHASE-1C-FINALIZATION.md) — Copy prompt, execute
3. [PHASE-2-SCHEMA-CONSOLIDATION.md](./PHASE-2-SCHEMA-CONSOLIDATION.md) — Copy prompt, execute
4. [PHASE-3-VSCODE-SETUP.md](./PHASE-3-VSCODE-SETUP.md) — Copy prompt, execute
5. [PHASE-4-PLUGIN-ADOPTION.md](./PHASE-4-PLUGIN-ADOPTION.md) — Copy prompt, execute

### Team Members (Developers)

**Start here:**

1. [README.md](./README.md) — Quick overview
2. [PHASE-1A-MANUAL-MOVES.md](./PHASE-1A-MANUAL-MOVES.md) — Understand what's happening
3. [MIGRATION.md](../../docs/MIGRATION.md) — Path updates for your workflow
4. [Plugin Setup Guides](../../docs/plugin-setup-*.md) — Plugin adoption

---

## Status Dashboard

| Phase | Status | Owner | Duration | Completion |
|-------|--------|-------|----------|------------|
| 0 | ✅ Complete | Ash | 1–2 days | 2026-07-26 |
| 1 | ✅ Complete | Claude | ~3 days | 2026-08-05 |
| 2 | ✅ Complete | Claude | ~4 days | 2026-08-05 |
| 3 | ✅ Complete | Claude | ~2 days | 2026-08-05 |
| 4 | 🔜 Planned | Claude | 2–3 days | TBD |
| 5 | 🔜 Planned | Ash + Team | 3+ weeks | TBD |

**Phases 1-3 COMPLETE:** Aug 6, 2026 ✅

---

## How to Use This Index

1. **Find what you're looking for:** Use the quick links above
2. **Check the current phase:** See status dashboard
3. **Copy prompts for Claude:** Each phase document has copy-paste prompts
4. **Track progress:** Update status as phases complete
5. **Access supporting docs:** Reference phase documents for detailed guidance

---

**Index Version:** 1.0  
**Last Updated:** 2026-07-26  
**Next Review:** After Phase 0 completion
