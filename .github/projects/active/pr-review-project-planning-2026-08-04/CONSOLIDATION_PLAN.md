---
name: Restructuring Project Consolidation Plan
description: Detailed steps to consolidate repository restructuring projects under one canonical slug
metadata:
  created: 2026-08-04
  owner: eleshar
  status: planning
---

# Repository Restructuring Project Consolidation Plan

## Current State

### Two Project Locations with Different Slugs

| Location | Slug | Content | Status |
|----------|------|---------|--------|
| `.github/projects/active/repository-restructuring-phase-1/` | `repository-restructuring-phase-1` | Phase 1 completion status doc | Canonical per CLAUDE.md:312 |
| `projects/active/repo-restructuring-2026-07-25/` | `repo-restructuring-2026-07-25` | Four documentation files (PHASE_1_KICKOFF_PROMPT.md, DECISIONS_FRAMEWORK-50-QUESTIONS.md, etc.) | Needs migration |

### CLAUDE.md References

- **Line 64:** `./projects/active/repo-restructuring-2026-07-25/` (reference path — third variant)
- **Line 312:** `.github/projects/active/{slug}/` (canonical rule)

## Decision Required: Canonical Slug

Choose one of the following approaches:

### Option A: Consolidate to `.github/projects/active/repository-restructuring-phase-1/`

**Rationale:**

- Already canonical per CLAUDE.md:312
- Consistent with GitHub-native governance location
- Clearer naming (includes phase identifier)

**Steps:**

1. Move four files from `projects/active/repo-restructuring-2026-07-25/` to `.github/projects/active/repository-restructuring-phase-1/`
2. Update all relative links in moved files (from `../../../` to `../../`)
3. Update CLAUDE.md line 64 to reference `.github/projects/active/repository-restructuring-phase-1/`
4. Delete empty `projects/active/repo-restructuring-2026-07-25/` directory
5. Verify lint-and-links passes

### Option B: Consolidate to `.github/projects/active/repo-restructuring-2026-07-25/`

**Rationale:**

- Shorter, date-focused slug
- Matches existing file naming pattern

**Steps:**

1. Move `PHASE-1-COMPLETION-STATUS.md` from `.github/projects/active/repository-restructuring-phase-1/` to `.github/projects/active/repo-restructuring-2026-07-25/`
2. Update all relative links (bidirectional)
3. Delete empty `.github/projects/active/repository-restructuring-phase-1/` directory
4. Update CLAUDE.md line 64 reference
5. Verify lint-and-links passes

### Option C: Keep Both, Fix Links Only

**Rationale:**

- Minimal disruption
- Preserves current structure

**Drawbacks:**

- Does not address the duplication root cause
- Future maintenance risk
- Does not align with "one agreed slug" principle from eleshar's analysis

## Associated Work

### Fix MD032 Violations (Prerequisite)

Before moving files, resolve Markdown list formatting violations:

1. **CLAUDE.md** — Add blank lines around lists (MD032)
2. **`.github/projects/active/repository-restructuring-phase-1/PHASE-1-COMPLETION-STATUS.md`** — Add blank lines around lists

These gate the `Check Links` workflow; they must be resolved first.

### Update Issue #1448 Description

Once agreed slug is chosen, update issue description with:

- Final slug decision
- Execution priority
- Success criteria

## Success Criteria

1. ✅ Single canonical slug chosen and documented
2. ✅ All four files in correct location under canonical slug
3. ✅ All relative links corrected
4. ✅ MD032 violations resolved
5. ✅ `lint-and-links` workflow passes
6. ✅ `CLAUDE.md` references updated (line 64)
7. ✅ Issue #1448 closed

## Timeline

- **Phase 1 (Planning):** Today — Get @eleshar approval on slug choice
- **Phase 2 (Execution):** Once approved — Create child issues and begin work

## Related Issues & PRs

- Issue #1448: Fix broken relative links in repo-restructuring project docs
- PR #1449: docs: fix broken relative links (closed, unmerged)
