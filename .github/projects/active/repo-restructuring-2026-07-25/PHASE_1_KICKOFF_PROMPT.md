# Phase 1 Kickoff Prompt — Repository Restructuring Implementation

**Status:** Ready for Phase 1 implementation  
**Date Created:** 2026-07-31  
**Target Execution:** 2026-08-02  
**Owner:** Ash Shaw  
**Support:** Claude Code

---

## Context & Background

You are implementing a comprehensive repository restructuring initiative for the LightSpeed `.github` control plane. This project aims to consolidate schemas, reorganize folder structure, and improve cross-project discoverability of reusable assets.

### Phase 0 Completion

✅ **Phase 0 (Planning)** is complete. You have:

- Reviewed and confirmed decisions from the 50-question framework
- Created detailed specifications and checklists
- Validated repository state and environment
- Established backup points
- Created GitHub tracking issues

### What You're About to Do

You're now executing **Phase 1: Folder Moves & Reference Updates** — the actual implementation of the restructuring plan.

---

## Phase 1 Overview: 4 Stages

### Stage 1: Folder Moves (Safe, Reversible)

**Duration:** ~1–2 hours  
**Risk:** Low (creating new locations, copying files)

Move these folders from root → `.github/`:

- `scripts/` → `.github/scripts/`
- `website/` → `.github/website/`
- `projects/active/` → `.github/projects/active/`

Consolidate schemas:

- Copy `schema/` → visible `schemas/` at root
- Archive old `.schemas/` and `schema/` locations

### Stage 2: Reference Updates (Critical)

**Duration:** ~2–3 hours  
**Risk:** Medium (must find all path references)

Update all references in:

- **npm scripts** (`package.json`)
- **Validation scripts** (`.github/scripts/validation/*.js`)
- **GitHub workflows** (`.github/workflows/*.yml`)
- **Documentation** (`docs/**/*.md`, `agents/`, `skills/`)
- **Instruction files** (`instructions/`, `.github/instructions/`)

### Stage 3: Validation & Testing

**Duration:** ~1–2 hours  
**Risk:** Low (verification only, no destructive changes yet)

Run full validation:

- All validation scripts (`npm run validate:*`)
- Full test suite (`npm test`)
- Manual verification of key paths
- Documentation link checks

### Stage 4: Cleanup & Finalization

**Duration:** ~30 min  
**Risk:** Low (archiving, not deleting)

Archive old locations:

- `.schemas/` → `.github/tmp/schema-archive/`
- `schema/` → `.github/tmp/schema-archive/`

Finalize:

- Commit cleanup changes
- Update CLAUDE.md with migration notes
- Prepare release notes

---

## Critical Documents to Reference

### Implementation Plan

**[SPECIFICATION.md](./SPECIFICATION.md)**

- Detailed folder-by-folder mapping
- Complete reference update checklist
- Dependency graph
- Risk mitigation strategies
- Rollback procedures

### Validation Requirements

**[PREFLIGHT_CHECKLIST.md](./PREFLIGHT_CHECKLIST.md)**

- Sections B (Repository State) and C (Environment) — verify you're ready
- Success criteria per phase
- Troubleshooting commands

### Decision Background

**[DECISIONS_FRAMEWORK-50-QUESTIONS.md](./DECISIONS_FRAMEWORK-50-QUESTIONS.md)**

- Why each decision was made
- Trade-offs considered
- Context for difficult choices

---

## Execution Checklist

### Before You Start

- [ ] Confirm you're on the `refactor/schema-consolidation-scripts-move` branch
- [ ] Git status is clean
- [ ] Backup branch and tag created (see PREFLIGHT_CHECKLIST.md > PART B)
- [ ] All tests pass locally
- [ ] You understand the 4 stages above

### Stage 1: Folder Moves

- [ ] Create `.github/scripts/` and copy all files from `scripts/`
- [ ] Create `.github/website/` and copy all files from `website/`
- [ ] Create `.github/projects/active/` and copy all folders from `projects/active/`
- [ ] Create visible `schemas/` folder at root
- [ ] Copy all files from `schema/` → `schemas/`
- [ ] Verify file counts match (use `find schemas -type f | wc -l`)

### Stage 2: Reference Updates

**Critical files to update:**

- [ ] `package.json` — Search/replace all `schema/` with `schemas/`
- [ ] `.github/scripts/validation/*.js` — Update all relative paths
- [ ] `.github/workflows/*.yml` — Update schema/script paths
- [ ] `docs/**/*.md` — Update all documentation links
- [ ] `agents/README.md`, `skills/README.md` — Update cross-references
- [ ] `.github/CLAUDE.md` — Add migration notes (see section below)

**Verification:**

- [ ] Grep for remaining references to old paths
- [ ] Run: `grep -r "schema/" . --exclude-dir=.git | wc -l` (should be 0)
- [ ] Run: `grep -r "\.schemas" . --exclude-dir=.git | wc -l` (should be 0)

### Stage 3: Validation

- [ ] `npm run validate:frontmatter` ✅ passes
- [ ] `npm run validate:agents` ✅ passes
- [ ] `npm run validate:plugins` ✅ passes
- [ ] `npm run validate:json` ✅ passes
- [ ] `npm test` ✅ all pass
- [ ] No broken documentation links

### Stage 4: Cleanup & Finalization

- [ ] Archive old locations to `.github/tmp/schema-archive/`
- [ ] Create git commit for cleanup
- [ ] Update CLAUDE.md with migration section (see below)
- [ ] Verify all files on correct paths
- [ ] Create final commit with summary

---

## CLAUDE.md Migration Note (Add This Section)

Add to CLAUDE.md > "Path Reference" section:

```markdown
### Path Reference: Repository Restructuring (2026-08-02)

During the 2026-08-02 repository restructuring, the following locations were moved:

| Asset | Old Path | New Path | Type |
| --- | --- | --- | --- |
| **Schema files** | `.schemas/` + `schema/` | `schemas/` | Consolidation |
| **Scripts** | `scripts/` | `.github/scripts/` | Move to .github |
| **Website** | `website/` | `.github/website/` | Move to .github |
| **Projects** | `projects/active/` | `.github/projects/active/` | Move to .github |

For script maintainers: If you reference schemas or scripts, use paths relative to your script location. Example: a validation script at `.github/scripts/validation/validate-frontmatter.js` should reference `../../../schemas/` (three levels up).

See [SPECIFICATION.md](./projects/active/repo-restructuring-2026-07-25/SPECIFICATION.md) for full migration details.
```

---

## Success Criteria — Phase 1 Complete

✅ All folder moves completed without data loss  
✅ All reference updates verified (no broken paths)  
✅ All validation scripts pass  
✅ All tests pass  
✅ No references to old paths remain  
✅ Old locations archived safely  
✅ Git history preserved  
✅ Team communicated  

---

## What to Do If Something Goes Wrong

### Quick Rollback

If at any point validation fails or you encounter a blocker:

```bash
# Revert to pre-restructure state
git reset --hard backup/pre-restructure-2026-07-31
# Or checkout the backup branch
git checkout backup/pre-restructure-2026-07-31
```

### Partial Rollback

If you've completed some stages successfully but Stage 3 (validation) fails:

1. **Don't panic** — all old folders still exist in Git
2. Identify what's broken in validation output
3. Fix the broken reference
4. Re-run validation
5. Continue to Stage 4

### Get Help

If you're stuck:

1. Review the relevant section in SPECIFICATION.md
2. Check the Troubleshooting section of PREFLIGHT_CHECKLIST.md
3. Look at the DECISIONS_FRAMEWORK to understand why things are where they are
4. Create an issue with `[PHASE-1-BLOCKER]` tag

---

## Timeline & Dependencies

**Phase 1 Duration:** 2–3 days (4 stages @ ~1 day each, can be paralleled)  
**Critical Path:** Folder moves → Reference updates → Validation → Cleanup  
**Blocker Path:** Cannot proceed to Stage 3 until Stage 2 is 100% complete

**Next Phase:** Phase 2 (Restructure agile adoption & discovery) begins after Phase 1 completion and team sign-off.

---

## Communication

### Team Notification Template

When Phase 1 is complete, notify:

```
Subject: ✅ Phase 1: Repository Restructuring Complete

Team,

Repository restructuring Phase 1 is complete. Key changes:
- Schema files consolidated to `schemas/` at root (visible, portable)
- Scripts moved to `.github/scripts/` (internal, repo-specific)
- Website moved to `.github/website/` (internal documentation site)
- Projects folder moved to `.github/projects/active/` (internal planning)

All validation passes. No breaking changes to development workflow.

Detailed history: see projects/active/repo-restructuring-2026-07-25/

Next: Phase 2 (Agile discovery & adoption) kicks off [DATE]
```

---

## Resources

- **Detailed Plan:** [SPECIFICATION.md](./SPECIFICATION.md)
- **Validation Checklist:** [PREFLIGHT_CHECKLIST.md](./PREFLIGHT_CHECKLIST.md)
- **Decision Background:** [DECISIONS_FRAMEWORK-50-QUESTIONS.md](./DECISIONS_FRAMEWORK-50-QUESTIONS.md)
- **Repo Rules:** [../../CLAUDE.md](../../CLAUDE.md)
- **Branch Strategy:** [../../docs/BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md)
- **Tracking Issues:** GitHub epic [#1438](https://github.com/lightspeedwp/.github/issues/1438)

---

## Go Time ✨

You're ready for Phase 1. Trust the plan, follow the stages, and validate frequently. The backup points are there if you need them — but you won't.

**Good luck! 🚀**

---

**Created by:** Claude Code  
**Date:** 2026-07-31  
**For:** Phase 1 Implementation Kickoff
