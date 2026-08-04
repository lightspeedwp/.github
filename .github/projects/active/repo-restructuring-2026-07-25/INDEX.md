# Project Index: Repository Restructuring (2026-07-25)

**Project Slug:** `repo-restructuring-2026-07-25`  
**Owner:** Ash Shaw  
**Duration:** ~3–4 weeks  
**Status:** In Progress (Phase 0 Complete)

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

### Phase 1.A: Manual Folder Moves

- **Status:** 🔜 READY TO EXECUTE
- **Document:** [PHASE-1A-MANUAL-MOVES.md](./PHASE-1A-MANUAL-MOVES.md)
- **Owner:** Ash Shaw (manual Finder operations)
- **Duration:** 1–2 hours
- **Tasks:**
  1. Backup current state
  2. Create `.github/` subdirectories
  3. Move folders using Finder
  4. Consolidate schemas
  5. Verify moves
  6. Stage changes in git
  7. Create commit

### Phase 1.B: Path Reference Updates

- **Status:** 🔜 READY TO EXECUTE
- **Document:** [PHASE-1B-PATH-UPDATES.md](./PHASE-1B-PATH-UPDATES.md)
- **Owner:** Claude Code Agent (automated)
- **Duration:** 2–3 days
- **Tasks:**
  1. Audit path references
  2. Update package.json
  3. Update workflows
  4. Update documentation
  5. Update script relative paths
  6. Validate all changes
  7. Create commit

### Phase 1.C: Folder Finalization

- **Status:** 🔜 READY TO EXECUTE
- **Document:** [PHASE-1C-FINALIZATION.md](./PHASE-1C-FINALIZATION.md)
- **Owner:** Claude Code Agent (automated)
- **Duration:** 1 day
- **Tasks:**
  1. Create README files
  2. Create .gitkeep files
  3. Create .gitignore files
  4. Update root .gitignore
  5. Update CLAUDE.md
  6. Verify structure
  7. Create commit

### Phase 2: Schema Consolidation

- **Status:** 🔜 READY TO EXECUTE
- **Document:** [PHASE-2-SCHEMA-CONSOLIDATION.md](./PHASE-2-SCHEMA-CONSOLIDATION.md)
- **Owner:** Claude Code Agent (automated)
- **Duration:** 2–3 days
- **Tasks:**
  1. Audit consolidated schemas
  2. Update validation scripts
  3. Update documentation
  4. Create migration guide
  5. Create commit

### Phase 3: VSCode Setup

- **Status:** 🔜 READY TO EXECUTE
- **Document:** [PHASE-3-VSCODE-SETUP.md](./PHASE-3-VSCODE-SETUP.md)
- **Owner:** Claude Code Agent (automated)
- **Duration:** 3–4 days
- **Tasks:**
  1. Create setup scripts (3 files)
  2. Create workspace definition
  3. Create VSCode settings
  4. Create setup documentation
  5. Create FAQ
  6. Test scripts locally
  7. Create commit

### Phase 4: Plugin Adoption

- **Status:** 🔜 READY TO EXECUTE
- **Document:** [PHASE-4-PLUGIN-ADOPTION.md](./PHASE-4-PLUGIN-ADOPTION.md)
- **Owner:** Claude Code Agent + Web team
- **Duration:** 3–4 days
- **Tasks:**
  1. Create plugin setup guides (3 files)
  2. Create adoption phases doc
  3. Document website updates
  4. Create testing guide
  5. Create troubleshooting guide
  6. Create commit

### Phase 5: Rollout & Communications

- **Status:** 🔜 READY TO EXECUTE
- **Document:** [PHASE-5-ROLLOUT.md](./PHASE-5-ROLLOUT.md)
- **Owner:** Ash Shaw + Team
- **Duration:** 3+ weeks
- **Tasks:**
  1. Merge to develop
  2. Create announcements
  3. Deploy website updates
  4. Monitor team adoption
  5. Support and FAQ
  6. Grace period management
  7. Cutover phase

---

## Supporting Documents

### Audit & Summary Documents

- [SCHEMA-AUDIT.md](./SCHEMA-AUDIT.md) — Created during Phase 2.A
- [PHASE-2-SUMMARY.md](./PHASE-2-SUMMARY.md) — Created at end of Phase 2
- [WEBSITE-UPDATE-REQUIREMENTS.md](./WEBSITE-UPDATE-REQUIREMENTS.md) — Created in Phase 4
- [SUPPORT-TRACKER.md](./SUPPORT-TRACKER.md) — Created during Phase 5

### Templates & Announcements

- [ANNOUNCEMENT-TEMPLATES.md](./ANNOUNCEMENT-TEMPLATES.md) — Created in Phase 5

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
4. [VSCode Workspace Setup](../../docs/vscode-workspace-setup.md) — New developer setup
5. [Plugin Setup Guides](../../docs/plugin-setup-*.md) — Plugin adoption

---

## Status Dashboard

| Phase | Status | Owner | Duration | Completion |
|-------|--------|-------|----------|------------|
| 0 | ✅ Complete | Ash | 1–2 days | 2026-07-26 |
| 1.A | 🔜 Ready | Ash | 1–2 hours | TBD |
| 1.B | 🔜 Ready | Claude | 2–3 days | TBD |
| 1.C | 🔜 Ready | Claude | 1 day | TBD |
| 2 | 🔜 Ready | Claude | 2–3 days | TBD |
| 3 | 🔜 Ready | Claude | 3–4 days | TBD |
| 4 | 🔜 Ready | Claude + Web | 3–4 days | TBD |
| 5 | 🔜 Ready | Ash + Team | 3+ weeks | TBD |

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
