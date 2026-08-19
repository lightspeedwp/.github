---
title: "Script Organization Architectural Issue"
description: "Identify and resolve conflict between current script placement (.github/scripts/) and portability requirements"
date: "2026-08-04"
category: "workflow-testing"
status: "open"
type: "architecture"
priority: "medium"
relates_to: ["issue #1438 (Phase 1 restructuring)"]
---

# Script Organization Architectural Issue

**Status:** Open | **Priority:** Medium | **Scope:** Architectural Review

---

## The Conflict

### Current State (Post-Phase 1 Restructuring)

Scripts were moved to `.github/scripts/`:
- `.github/scripts/workflows/release/trigger-telemetry.cjs`
- `.github/scripts/validation/validate-changelog.cjs`
- `.github/scripts/agents/release.agent.js`
- etc.

### Design Principle (CLAUDE.md, Line 42)

> Do **not** place reusable assets under `.github/`—use the matching top-level folder instead.

### The Problem

1. **Location Conflict:** Scripts are in `.github/scripts/` (violates portability principle)
2. **Missing Structure:** No `scripts/` folder defined in "Portable AI operations assets" (lines 30-40)
3. **Reusability Blocked:** If scripts need to be used in other repos, they're in the wrong location
4. **Fragmentation Risk:** Scripts continue to spread across multiple locations

---

## Evidence

### CLAUDE.md: Portable Assets (Lines 30-40)

```yaml
| Folder | Purpose |
| --- | --- |
| `ai/` | Canonical AI agent references |
| `agents/` | Portable agent specifications |
| `schemas/` | JSON schema definitions |
| `cookbook/` | Recipes, playbooks, guides |
| `hooks/` | Portable hooks and guardrails |
| `instructions/` | Portable instruction files |
| `plugins/` | Installable plugin bundles |
| `skills/` | Self-contained skills |
| `workflows/` | Portable agentic workflows |
```

**Notable:** NO `scripts/` folder for reusable scripts

### CLAUDE.md: Repository Boundaries (Line 311)

```
| Reports, audits, metrics | `.githu./.github/reports/{category}/` |
```

### Phase 1 Restructuring (Lines 50-54)

```
| **Scripts** | `scripts/` | `.github/scripts/` | Move to .github |
```

**Decision:** Moved to `.github/` (seemingly permanent)

---

## Questions to Resolve

1. **Design Intent:** Are scripts meant to be portable across repos?
   - If YES → Move to root `scripts/` + add to portable assets list
   - If NO → Document why `.github/scripts/` is final + update CLAUDE.md

2. **Current Scripts:** Which are `.github`-specific vs. reusable?
   - `.github/scripts/workflows/release/trigger-telemetry.cjs` — Release workflow-specific
   - `.github/scripts/validation/validate-changelog.cjs` — Reusable? 
   - `.github/scripts/agents/` — Reusable?

3. **Phase 1 Rationale:** Was moving scripts to `.github/scripts/` a permanent design decision or interim consolidation?
   - Check [issue #1438](https://github.com/lightspeedwp/.github/issues/1438) for context

---

## Options

### Option A: Scripts Stay in `.github/` (Current)

**Decision:** `.github/scripts/` is the permanent location

**Actions Needed:**
1. ✓ Update CLAUDE.md to explain rationale
2. ✓ Add note: "Scripts are control-plane-specific, not reusable"
3. ✓ Document which scripts are `.github`-only
4. ✓ Update line 42 guidance if scripts are not reusable

**Risk:** Limits reusability if scripts later need to be shared

---

### Option B: Move Reusable Scripts to Root (Recommended)

**Decision:** Create `scripts/` folder for portable scripts

**Actions Needed:**
1. ✓ Audit scripts in `.github/scripts/` → classify as portable vs. control-plane-specific
2. ✓ Create `scripts/` folder structure:
   ```
   scripts/
   ├── validation/          (reusable: changelog, frontmatter, etc.)
   ├── workflows/           (reusable: workflow utilities)
   ├── agents/              (reusable: agent utilities)
   └── README.md            (purpose and usage guide)
   ```
3. ✓ Move portable scripts to root `scripts/`
4. ✓ Keep `.github/`-specific scripts (e.g., GitHub Actions runners) in `.github/scripts/`
5. ✓ Add `scripts/` to CLAUDE.md portable assets list
6. ✓ Update all relative path references

**Benefit:** Clear separation of concerns + enables reuse across repos
**Effort:** High (requires path updates across codebase)

---

### Option C: Hybrid Approach

**Decision:** Keep scripts in `.github/` but clearly separate portable vs. specific

**Structure:**
```
.github/scripts/
├── portable/              (reusable across repos)
│   ├── validation/
│   ├── workflows/
│   └── agents/
└── control-plane/         (github-only, non-reusable)
    ├── runners/
    └── github-specific/
```

**Benefit:** Clear organization without moving files
**Risk:** Still violates "no reusable under `.github/`" principle

---

## Recommendation

**Option B (Move Reusable Scripts to Root)** aligns with:
- ✓ CLAUDE.md design principles (line 42)
- ✓ Organization-wide reusability goals
- ✓ Portable assets structure

**But requires:**
- Detailed audit of which scripts are truly reusable
- Phase 2 migration plan (don't redo Phase 1 hastily)
- Relative path updates across codebase

---

## Related Issues

- **Phase 1 Restructuring:** [#1438](https://github.com/lightspeedwp/.github/issues/1438) — Check decision rationale
- **Current Work:** Release workflow testing ([#1453](https://github.com/lightspeedwp/.github/issues/1453))

---

## Next Steps

1. **Clarify Intent** — Confirm whether scripts are meant to be reusable
2. **Audit Scripts** — List all scripts and classify by portability
3. **Review Phase 1** — Understand why `.github/scripts/` was chosen
4. **Decide Strategy** — Choose Option A, B, or C
5. **Document Decision** — Update CLAUDE.md with clear guidance

---

**Discovered During:** Release workflow fix verification  
**Raised By:** Architecture review (2026-08-04)  
**Status:** Open for team decision
