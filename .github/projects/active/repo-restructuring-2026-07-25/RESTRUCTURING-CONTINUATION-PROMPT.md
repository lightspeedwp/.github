# Continuation Prompt: Repository Restructuring Initiative (PR #1384)

**Use this prompt to continue work in a new Claude Code session.**

---

## Project Context

### Active PR

- **URL:** <https://github.com/lightspeedwp/.github/pull/1384>
- **Branch:** `refactor/repo-restructuring-2026-07-25`
- **Base:** `develop`
- **Status:** Ready for review and Phase 1.A execution

### Project Documentation

All detailed documentation is in: **`.github/projects/active/repo-restructuring-2026-07-25/`**

Key files to reference:

- `README.md` — Project overview and quick start
- `SPECIFICATION.md` — Full specification and architecture
- `PREFLIGHT_CHECKLIST.md` — Pre-flight validation
- `PHASE-1A-MANUAL-MOVES.md` — Next execution phase (manual Finder moves)
- `PHASE-1B-PATH-UPDATES.md` — Claude automation prompt (Phase 1.B)
- `PHASE-1C-FINALIZATION.md` — Claude automation prompt (Phase 1.C)
- `PHASE-2-SCHEMA-CONSOLIDATION.md` — Claude automation prompt (Phase 2)
- `PHASE-3-VSCODE-SETUP.md` — Claude automation prompt (Phase 3)
- `PHASE-4-PLUGIN-ADOPTION.md` — Claude automation prompt (Phase 4)
- `PHASE-5-ROLLOUT.md` — Claude automation prompt (Phase 5)

---

## GitHub Issues Structure

### Create Parent Epic (if not exists)

**Epic Title:** Repository Restructuring Initiative (2026-07-25)

**Type:** Epic

**Description:**

```
Multi-phase repository restructuring initiative to optimize folder organization, 
consolidate schemas, enable VSCode multi-root workspace, and support phased plugin adoption.

Timeline: ~3–4 weeks (July 25 – September 9, 2026)
Owner: Ash Shaw
PR: #1384

Phases:
- Phase 0: Pre-flight validation ✅ COMPLETE
- Phase 1: Folder reorganization (manual + automated)
- Phase 2: Schema consolidation
- Phase 3: VSCode workspace setup
- Phase 4: Plugin adoption strategy
- Phase 5: Team rollout & communications

See: .github/projects/active/repo-restructuring-2026-07-25/ for full documentation
```

**Labels:**

- `type:epic`
- `area:infrastructure`
- `priority:high`
- `status:active`

**Milestone:** Q3 2026 Infrastructure (create if not exists)

**Assignees:** Ash Shaw

---

### Create Child Issues (Phase-Specific)

#### Issue 1: Phase 0 - Pre-flight Validation & Specification ✅

**Type:** Task

**Title:** Phase 0: Pre-flight Validation & Specification

**Description:**

```
Phase 0 of the repository restructuring initiative.

Status: ✅ COMPLETE

Tasks:
- [x] Create SPECIFICATION.md with full project spec
- [x] Create PREFLIGHT_CHECKLIST.md with validation steps
- [x] Create project README.md with overview
- [x] Create project INDEX.md with navigation

Documentation created and validation checklist ready.

See: .github/projects/active/repo-restructuring-2026-07-25/SPECIFICATION.md
See: .github/projects/active/repo-restructuring-2026-07-25/PREFLIGHT_CHECKLIST.md
```

**Labels:**

- `type:task`
- `status:done`
- `area:infrastructure`

**Related:** Linked to parent epic

**Timeline:** Started 2026-07-25, Completed 2026-07-26

---

#### Issue 2: Phase 1 - Folder Reorganization & Path Migration

**Type:** Task

**Title:** Phase 1: Folder Reorganization & Path Migration (1.A + 1.B + 1.C)

**Description:**

```
Phase 1 of the repository restructuring initiative.

Duration: ~4–6 days
Owner: Ash Shaw (1.A), Claude Code (1.B–1.C)

Subtasks:
- [ ] Phase 1.A: Manual folder moves via macOS Finder
  Owner: Ash Shaw
  Duration: 1–2 hours
  Doc: .github/projects/active/repo-restructuring-2026-07-25/PHASE-1A-MANUAL-MOVES.md

- [ ] Phase 1.B: Automated path reference updates
  Owner: Claude Code Agent
  Duration: 2–3 days
  Doc: .github/projects/active/repo-restructuring-2026-07-25/PHASE-1B-PATH-UPDATES.md
  Prompt: Copy from PHASE-1B-PATH-UPDATES.md and execute

- [ ] Phase 1.C: Folder finalization & documentation
  Owner: Claude Code Agent
  Duration: 1 day
  Doc: .github/projects/active/repo-restructuring-2026-07-25/PHASE-1C-FINALIZATION.md
  Prompt: Copy from PHASE-1C-FINALIZATION.md and execute

Folders being moved:
- scripts/ → .github/scripts/
- reports/ → .github/reports/
- projects/ → .github/projects/
- tmp/ → .github/tmp/
- memory/ → .github/memory/
- website/ → .github/website/

Schema consolidation:
- .schemas/ → schemas/ (visible root)
- schema/ → consolidated into schemas/

Success criteria:
✅ All 6 folders moved to .github/
✅ .schemas/ → schemas/ consolidated
✅ All path references updated
✅ npm run validate:* passes
✅ npm test passes
```

**Labels:**

- `type:task`
- `status:in-progress` (or `status:ready` if PR not merged)
- `area:infrastructure`
- `priority:high`

**Related:** Child of parent epic

**Timeline:** Estimated 2026-07-26 to 2026-08-01

---

#### Issue 3: Phase 2 - Schema Consolidation & Validation

**Type:** Task

**Title:** Phase 2: Schema Consolidation & Validation

**Description:**

```
Phase 2 of the repository restructuring initiative.

Duration: 2–3 days
Owner: Claude Code Agent

Tasks:
- [ ] Audit consolidated schemas/ folder
- [ ] Update validation scripts (reference new paths)
- [ ] Update documentation with new paths
- [ ] Create migration guide (docs/MIGRATION.md)

Success criteria:
✅ Schema audit complete
✅ All validation scripts updated
✅ npm run validate:* passing
✅ All tests passing
✅ Migration guide created

Prompt: Copy from .github/projects/active/repo-restructuring-2026-07-25/PHASE-2-SCHEMA-CONSOLIDATION.md
```

**Labels:**

- `type:task`
- `status:ready`
- `area:infrastructure`

**Related:** Child of parent epic, depends on Phase 1

**Timeline:** Estimated 2026-08-02 to 2026-08-04

---

#### Issue 4: Phase 3 - VSCode Workspace Setup & Documentation

**Type:** Task

**Title:** Phase 3: VSCode Workspace Setup & Documentation

**Description:**

```
Phase 3 of the repository restructuring initiative.

Duration: 3–4 days
Owner: Claude Code Agent

Deliverables:
- [ ] Create .github/scripts/setup-vscode-workspace.sh (main setup)
- [ ] Create .github/scripts/setup-git-hooks.sh (git hooks)
- [ ] Create .github/scripts/install-vscode-extensions.sh (extensions)
- [ ] Create .github/lightspeed-dev.code-workspace (workspace file)
- [ ] Create .github/.vscode/settings.json (shared settings)
- [ ] Create .github/.vscode/extensions.json (recommended extensions)
- [ ] Create docs/vscode-workspace-setup.md (setup guide)
- [ ] Create docs/faq.md (frequently asked questions)
- [ ] Test setup scripts locally

Success criteria:
✅ Setup scripts created and tested
✅ VSCode workspace file valid
✅ Documentation complete
✅ Developers can run setup in <10 minutes

Prompt: Copy from .github/projects/active/repo-restructuring-2026-07-25/PHASE-3-VSCODE-SETUP.md
```

**Labels:**

- `type:task`
- `status:ready`
- `area:infrastructure`
- `area:developer-experience`

**Related:** Child of parent epic, depends on Phase 2

**Timeline:** Estimated 2026-08-05 to 2026-08-08

---

#### Issue 5: Phase 4 - Plugin Adoption Strategy & Website Updates

**Type:** Task

**Title:** Phase 4: Plugin Adoption Strategy & Website Updates

**Description:**

```
Phase 4 of the repository restructuring initiative.

Duration: 3–4 days
Owner: Claude Code Agent + Web Team

Deliverables:
- [ ] Create docs/plugin-setup-claude-code.md
- [ ] Create docs/plugin-setup-github-copilot.md
- [ ] Create docs/plugin-comparison.md
- [ ] Create docs/plugin-adoption-phases.md
- [ ] Create docs/plugin-testing.md
- [ ] Create docs/vscode-plugin-troubleshooting.md
- [ ] Document website update requirements
  - Onboarding routing by tier
  - Getting started guides
  - Documentation rendering
  - References section
  - Cookbook integration

Success criteria:
✅ Plugin setup guides created
✅ Adoption timeline documented
✅ Website requirements documented
✅ Handoff to web team complete

Prompt: Copy from .github/projects/active/repo-restructuring-2026-07-25/PHASE-4-PLUGIN-ADOPTION.md

Note: Website updates require handoff to web team (github.lightspeedwp.agency)
```

**Labels:**

- `type:task`
- `status:ready`
- `area:infrastructure`
- `area:plugins`
- `area:documentation`

**Related:** Child of parent epic, depends on Phase 3

**Timeline:** Estimated 2026-08-09 to 2026-08-12

---

#### Issue 6: Phase 5 - Rollout & Team Communications

**Type:** Task

**Title:** Phase 5: Rollout & Team Communications

**Description:**

```
Phase 5 of the repository restructuring initiative (ongoing support phase).

Duration: 3+ weeks (from merge through stabilization)
Owner: Ash Shaw (communications), Team (feedback)

Activities:
- [ ] Week 1: Merge PR to develop + team announcements
  - Create Slack announcement
  - Create GitHub release notes
  - Create email to stakeholders
  - Deploy website updates

- [ ] Week 2–3: Grace period & support
  - Monitor GitHub issues with [restructuring-help] label
  - Track adoption metrics
  - Update FAQ based on questions
  - Provide support to team members

- [ ] Week 4+: Cutover phase
  - Remove old path deprecations
  - Build failures enforce new paths
  - Final announcement of completion

Success criteria:
✅ Team aware of changes
✅ Support infrastructure working
✅ >80% team adoption achieved
✅ Feedback integrated
✅ Old paths removed after grace period

Prompt: Copy from .github/projects/active/repo-restructuring-2026-07-25/PHASE-5-ROLLOUT.md

Milestone: Complete by September 9, 2026
```

**Labels:**

- `type:task`
- `status:ready`
- `area:infrastructure`
- `area:team`
- `area:documentation`

**Related:** Child of parent epic, depends on Phase 4

**Timeline:** Estimated 2026-08-15 onwards

---

## Linking Issues

After creating the issues:

1. **Link child issues to parent epic:**

   ```bash
   gh issue edit {PARENT_EPIC_NUMBER} --add-project "Repository Restructuring 2026-07-25"
   ```

2. **Create "depends on" relationships** (if your GitHub setup supports it):
   - Phase 1 depends on Phase 0 (already complete)
   - Phase 2 depends on Phase 1
   - Phase 3 depends on Phase 2
   - Phase 4 depends on Phase 3
   - Phase 5 depends on Phase 4

---

## Current Status (Continuation Point)

### Completed ✅

- Phase 0: Pre-flight validation & specification
- PR #1384: Created with all Phase 0–5 documentation
- Branch renamed to follow governance: `refactor/repo-restructuring-2026-07-25`
- Markdown linting fixed (0 errors)

### Next Steps

1. **Create GitHub issues** (use structure above)
2. **Phase 1.A (Manual):** Follow PHASE-1A-MANUAL-MOVES.md in project docs
   - User: Ash Shaw
   - Duration: 1–2 hours
   - Task: Move 6 folders via macOS Finder
3. **Phase 1.B–5 (Automation):** Copy prompts from phase documents
   - User: Claude Code
   - Duration: 2–3 weeks total
   - Task: Execute each phase prompt in sequence

---

## Quick Reference

### For New Session

1. **Checkout branch:** `git checkout refactor/repo-restructuring-2026-07-25`
2. **Project docs:** `.github/projects/active/repo-restructuring-2026-07-25/`
3. **PR status:** <https://github.com/lightspeedwp/.github/pull/1384>
4. **Phase 1.A:** Manual moves (Ash Shaw, 1–2 hours)
5. **Phase 1.B onwards:** Copy prompts from PHASE-*.md files

### Commands

```bash
# View project structure
ls -la .github/projects/active/repo-restructuring-2026-07-25/

# Open project README
cat .github/projects/active/repo-restructuring-2026-07-25/README.md

# View next phase prompt (Phase 1.B)
cat .github/projects/active/repo-restructuring-2026-07-25/PHASE-1B-PATH-UPDATES.md
```

---

## Questions or Issues?

- **For context:** See `.github/projects/active/repo-restructuring-2026-07-25/`
- **For decisions:** See `SPECIFICATION.md` in project docs
- **For phase execution:** Copy prompt from corresponding PHASE-*.md file
- **For governance:** See `CLAUDE.md` (branch naming, PR merge protocol)

---

**Ready to continue?**

1. Copy this prompt into a new Claude Code session
2. Create the GitHub issues using the structure above
3. Begin Phase 1.A (manual folder moves) per PHASE-1A-MANUAL-MOVES.md
4. Execute subsequent phases using copy-paste prompts from PHASE-*.md files

**Estimated Timeline:** Phase 1 complete by Aug 1, full completion by Sep 9, 2026.

🚀 Ready to execute!
