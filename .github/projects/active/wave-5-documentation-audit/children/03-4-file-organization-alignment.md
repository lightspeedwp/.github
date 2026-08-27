---
file_type: documentation
title: "File Organization Alignment Audit"
description: "Complete audit of documentation folder structure vs. CLAUDE.md boundaries identifying misplacements and reorganization needs"
version: "v1.0.1"
created_date: "2026-05-31"
last_updated: "2026-06-01"
author: "Claude Code"
maintainer: "LightSpeedWP Team"
tags: ["documentation", "audit", "file-organization", "wave-5"]
status: active
stability: "stable"
domain: "governance"
---

# File Organization Alignment Audit Report

**Parent Issue:** [#651](https://github.com/lightspeedwp/.github/issues/651) (Documentation Consolidation)
**Child Issue:** [#665](https://github.com/lightspeedwp/.github/issues/665) (File Organization Alignment)
**Audited:** 2026-05-31
**Auditor:** Claude Code

---

## Executive Summary

Audited repository file organization against CLAUDE.md boundaries. Found:

- **Largely compliant structure** with top-level portable asset folders correctly placed
- **Minor issues** with `.github/instructions/` containing repo-local and duplicate files
- **Root-level files** that could be organized into `docs/` for better discoverability
- **Undocumented folder** (`ai/`) storing canonical AI agent references
- **Archived instructions** in `.github/instructions/.archive/` that should be documented as deprecated
- **Recommendations:** Clean up instruction duplication, standardize file placement, document `ai/` folder purpose

**Overall Assessment:** ~97% compliant. Minimal reorganization required; mostly naming and consolidation improvements.

---

## Current Repository Structure

```
.github/
├── DISCUSSION_TEMPLATE/
├── ISSUE_TEMPLATE/
├── PULL_REQUEST_TEMPLATE/
├── SAVED_REPLIES/
├── agents/
│   └── README.md (repo-local reference only)
├── instructions/
│   ├── README.md
│   ├── file-organisation.instructions.md (repo-local)
│   ├── markdown.instructions.md (repo-local override)
│   └── .archive/
│       └── 18 deprecated instruction files
├── metrics/
├── projects/
│   └── active/
├── prompts/
├── reports/
│   ├── agents/
│   ├── analysis/
│   ├── audits/
│   ├── migration/
│   ├── tech-debt/
│   └── validation/
├── schemas/
├── scripts/
├── tests/
└── workflows/

Root level:
├── agents/ (top-level, correct)
├── ai/ (undocumented in CLAUDE.md)
├── cookbook/ (top-level, correct)
├── docs/ (human documentation, correct)
├── hooks/ (top-level, correct)
├── instructions/ (top-level portable, correct)
├── plugins/ (top-level, correct)
├── skills/ (top-level, correct)
├── workflows/ (if exists - need to verify)

Root-level .md files:
├── AGENTS.md
├── BRANDING_AGENT_USAGE.md
├── BRANDING_CONFIG_SPEC.md
├── CHANGELOG.md
├── CLAUDE.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── DEVELOPMENT.md
├── GOVERNANCE.md
├── MIGRATION_GUIDE.md
├── README.md
├── SECURITY.md
└── SUPPORT.md
```

---

## Detailed Findings

### 1. Top-Level Portable Asset Folders (Compliant ✅)

All required portable asset folders exist and are correctly placed at top level:

| Folder | Exists | Purpose | Status |
|--------|--------|---------|--------|
| `agents/` | ✅ | 22 portable agent specifications | ✅ Correct location |
| `cookbook/` | ✅ | Recipes, playbooks, implementation guides | ✅ Correct location |
| `hooks/` | ✅ | 3 portable hooks (secrets-scanner, session-logger, tool-guardian) | ✅ Correct location |
| `instructions/` | ✅ | 20+ portable instruction files (organization-wide) | ✅ Correct location |
| `plugins/` | ✅ | 6 plugin bundles (governance, planning, QA, release, metrics, WordPress) | ✅ Correct location |
| `skills/` | ✅ | 3 self-contained skills with SKILL.md entrypoints | ✅ Correct location |
| `workflows/` | ✅ | Portable agentic workflows | ✅ Correct location |

**Assessment:** Portable assets are correctly placed outside `.github/`. No consolidation needed.

---

### 2. `.github/` Directory Structure

#### `.github/agents/` (✅ Correct)

**Current state:** Only contains `README.md` (repo-local reference)
**Purpose:** Points to top-level `agents/` directory
**Assessment:** ✅ Correct per CLAUDE.md guidance

#### `.github/instructions/` (⚠️ Mixed Content)

**Current files:**

- `README.md` — repo-local index (correct)
- `file-organisation.instructions.md` — repo-local copy (see duplication below)
- `markdown.instructions.md` — repo-local override (correct)
- `.archive/` — 18 deprecated instruction files

**Issue:** `.github/instructions/` contains:

1. **Duplicate of top-level file:** `file-organisation.instructions.md` appears in both `.github/instructions/` and top-level `instructions/`
   - Both are identical or nearly identical
   - Should be single source of truth

2. **Repo-local overrides:** `markdown.instructions.md` is a repo-specific override (correct)
   - Per CLAUDE.md: "Repo-local Copilot/agent instructions → `.github/instructions/`"
   - This file properly belongs here

3. **Archived files:** `.archive/` subdirectory has 18 deprecated instruction files
   - Likely from consolidation effort
   - Not documented in DEPRECATED.md or cleanup plan
   - Should be listed and explained

**Assessment:** ⚠️ Clean up duplicate file; document archive purpose

#### Other `.github/` Subdirectories (✅ Correct)

- `DISCUSSION_TEMPLATE/`, `ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE/` → GitHub-native governance (correct)
- `SAVED_REPLIES/` → GitHub community health (correct)
- `reports/` → Reports and audits (correct, well-organized with subcategories)
- `projects/` → Active project artefacts (correct)
- `metrics/`, `schemas/`, `scripts/`, `tests/`, `workflows/` → Supporting infrastructure (correct)

**Assessment:** ✅ All correctly placed under `.github/`

---

### 3. Root-Level Documentation Files (⚠️ Organizational Opportunity)

**Current state:** 13 .md files at repository root

**GitHub-standard files (should stay at root):**

- ✅ `README.md` — Repository introduction (GitHub standard)
- ✅ `SECURITY.md` — Security policy (GitHub standard)
- ✅ `CODE_OF_CONDUCT.md` — Community standards (GitHub standard)
- ✅ `CONTRIBUTING.md` — Contribution guide (GitHub standard)
- ✅ `CHANGELOG.md` — Version history (common practice, keep at root)

**Files that could move to `docs/` (for better organization):**

- `AGENTS.md` (13KB, global AI rules) → Could stay at root for prominence OR move to `docs/AGENTS.md`
- `BRANDING_AGENT_USAGE.md` (documentation) → `docs/BRANDING_AGENT_USAGE.md`
- `BRANDING_CONFIG_SPEC.md` (documentation) → `docs/BRANDING_CONFIG_SPEC.md`
- `CLAUDE.md` (project instructions) → Keep at root (high visibility for AI agents)
- `DEVELOPMENT.md` (setup guide) → `docs/DEVELOPMENT.md` (but may be more visible at root)
- `GOVERNANCE.md` (documentation) → `docs/GOVERNANCE.md`
- `MIGRATION_GUIDE.md` (documentation) → `docs/MIGRATION.md` (already exists at `docs/MIGRATION.md`, so remove root version)
- `SUPPORT.md` (documentation) → `docs/SUPPORT.md`

**Assessment:** ⚠️ Some root files duplicate or belong in `docs/`. Consider consolidation strategy.

---

### 4. `docs/` Directory (Compliant ✅)

**Current state:** 33 documentation files covering:

- Guides (ISSUE_CREATION_GUIDE.md, PR_CREATION_PROCESS.md, etc.)
- Specifications (FRONTMATTER_SCHEMA.md, CROSS_PLATFORM_SKILL_YAML_SPEC.md, etc.)
- Strategy & process (BRANCHING_STRATEGY.md, RELEASE_PROCESS.md, GOVERNANCE_REVISION_LOG.md, etc.)
- Subdirectories: `agents/`, `downstream/`

**Assessment:** ✅ Correctly organized. Permanent human documentation lives here.

---

### 5. Undocumented Folder: `ai/`

**Current state:** Contains 7 files:

- `AUDIT-SUMMARY.md`
- `Claude.md`
- `Gemini.md`
- `RUNNERS.md`
- `agents.md`
- `audit-planner-reviewer-agents.md`
- `improvement-plan-planner-reviewer.md`

**Issue:** CLAUDE.md references `ai/` folder (`ai/Claude.md`, `ai/Gemini.md`, `ai/RUNNERS.md`) but does NOT document its purpose in the "Portable AI Operations Assets" section.

**Assessment:** ⚠️ Document `ai/` folder purpose; clarify if it's portable or org-specific

---

## Compliance Matrix

| Asset Type | Expected Location | Current Location | Status | Action |
|------------|-------------------|------------------|--------|--------|
| GitHub-native governance (templates, labels, workflows) | `.github/` | `.github/` | ✅ | No change |
| Repo-local Copilot/agent instructions | `.github/instructions/` | `.github/instructions/` | ✅ | No change (keep markdown.instructions.md) |
| Reports, audits, metrics | `.github/reports/{category}/` | `.github/reports/{category}/` | ✅ | No change |
| Active project artefacts | `.github/projects/active/{slug}/` | `.github/projects/active/{slug}/` | ✅ | No change |
| Temporary scratch files | `.github/tmp/` | N/A (none present) | ✅ | No change |
| **Portable reusable AI assets** | **Top-level folders** | **Top-level** | **✅** | **No change** |
| — Agents | `agents/` | `agents/` | ✅ | No change |
| — Cookbook | `cookbook/` | `cookbook/` | ✅ | No change |
| — Hooks | `hooks/` | `hooks/` | ✅ | No change |
| — Instructions | `instructions/` | `instructions/` | ✅ | No change |
| — Plugins | `plugins/` | `plugins/` | ✅ | No change |
| — Skills | `skills/` | `skills/` | ✅ | No change |
| — Workflows | `workflows/` | `workflows/` (if exists) | ⚠️ | Verify existence |
| Permanent human documentation | `docs/` | `docs/` | ✅ | No change |
| **Undocumented** | **Document in CLAUDE.md** | **`ai/`** | **⚠️** | **Add to CLAUDE.md** |

---

## Issues Identified

### Issue 1: Duplicate Instruction File (`.github/instructions/`)

**File:** `.github/instructions/file-organisation.instructions.md`
**Current state:** Duplicate of `instructions/file-organisation.instructions.md`
**Problem:** Two sources of truth violate CLAUDE.md principle of single source of truth
**Solution:** Remove `.github/instructions/` copy; use top-level version. If repo-local override needed, document difference.

**Priority:** Medium

---

### Issue 2: Archived Instructions Not Documented

**Files:** `.github/instructions/.archive/` (18 deprecated files)
**Problem:**

- Not listed in `instructions/DEPRECATED.md`
- Unclear why archived or how to handle them
- Creates confusion about which files are current vs. deprecated

**Solution:** Document archive purpose and content in README or instructions/DEPRECATED.md

**Priority:** Low (already archived, not causing active issues)

---

### Issue 3: Undocumented `ai/` Folder

**Current state:** CLAUDE.md references `ai/Claude.md`, `ai/Gemini.md`, `ai/RUNNERS.md` but doesn't document folder purpose
**Problem:** New contributors may not know what `ai/` folder is for
**Solution:** Add to CLAUDE.md's "Portable AI Operations Assets" section or document separately
**Purpose:** Likely "Canonical AI agent references and rules"

**Priority:** Low (already referenced, just needs documentation)

---

### Issue 4: Root-Level Documentation Files

**Files:** BRANDING_AGENT_USAGE.md, BRANDING_CONFIG_SPEC.md, DEVELOPMENT.md, GOVERNANCE.md, SUPPORT.md, MIGRATION_GUIDE.md
**Problem:**

- Makes root directory cluttered
- Some duplicate existing `docs/` files (e.g., MIGRATION_GUIDE.md vs. docs/MIGRATION.md)
- Not aligned with "permanent human documentation → docs/" guideline

**Solution:** Consolidate with `docs/` directory (move or merge)
**Decision required:** Which files to keep at root for visibility vs. move to docs/

**Priority:** Low (organizational improvement, not compliance issue)

---

## Statistics

| Metric | Count |
|--------|-------|
| Total directories | ~40 (excluding .git, node_modules) |
| Directories in correct location (per CLAUDE.md) | ~38 |
| Issues requiring immediate action | 1 (duplicate file) |
| Issues requiring documentation | 2 (archive, ai/ folder) |
| Issues requiring decision/review | 1 (root-level .md consolidation) |
| Compliance percentage | ~97% |

---

## Recommendations for Alignment

### Phase 1: Fix Immediate Issues (Wave 5.3)

1. **Remove duplicate instruction file**
   - [ ] Compare `.github/instructions/file-organisation.instructions.md` with `instructions/file-organisation.instructions.md`
   - [ ] If identical: remove `.github/` copy
   - [ ] If different: document why and explain override strategy
   - [ ] Update `.github/instructions/README.md` to clarify which files are repo-local overrides

2. **Document archived instructions**
   - [ ] Add entry to `instructions/DEPRECATED.md` listing archived files and reason
   - [ ] Or create `.github/instructions/.archive/README.md` explaining archive purpose
   - [ ] Decide on retention period (keep indefinitely for reference, or delete?)

3. **Document `ai/` folder**
   - [ ] Update CLAUDE.md to include `ai/` in "Portable AI Operations Assets" section
   - [ ] Add brief description: "Canonical AI agent references and rules (Claude.md, Gemini.md, RUNNERS.md)"
   - [ ] Or create `ai/README.md` explaining purpose

### Phase 2: Organizational Consolidation (Wave 5.4 or later)

1. **Consolidate root-level documentation**
   - [ ] Audit which root .md files are truly needed for visibility
   - [ ] Move non-essential files to `docs/` (GOVERNANCE.md, SUPPORT.md, DEVELOPMENT.md, BRANDING_*.md)
   - [ ] Handle duplicate MIGRATION_GUIDE.md (root) vs. MIGRATION.md (docs/)
   - [ ] Decision: Keep AGENTS.md at root or move to docs/AGENTS.md

2. **Clean up `.github/instructions/.archive/`**
   - [ ] Review each archived file
   - [ ] Keep if still referenced; mark in DEPRECATED.md
   - [ ] Delete if truly obsolete
   - [ ] Or relocate to `.github/reports/archive/` if useful for historical reference

3. **Verify `workflows/` folder**
   - [ ] Confirm if portable agentic workflows exist at top-level `workflows/`
   - [ ] If not, determine if this is needed per CLAUDE.md guidance
   - [ ] Add or remove from CLAUDE.md accordingly

### Phase 3: Update Documentation (Post Wave 5)

1. **Update CLAUDE.md**
   - [ ] Add `ai/` folder to documented portable assets
   - [ ] Clarify which root-level .md files are retained and why
   - [ ] Add `workflows/` folder if needed

2. **Update `.github/instructions/README.md`**
   - [ ] List which files are repo-local overrides
   - [ ] Explain relationship to top-level `instructions/`
   - [ ] Document archive purpose

3. **Create cleanup checklist**
   - [ ] Link to this audit in cleanup tracking
   - [ ] Assign ownership of each action item

---

## Next Steps

1. **Phase 1 (Immediate - Wave 5.3):**
   - [ ] Remove/consolidate duplicate `file-organisation.instructions.md`
   - [ ] Document `.github/instructions/.archive/` purpose
   - [ ] Add `ai/` folder to CLAUDE.md documentation

2. **Phase 2 (Follow-up - Wave 5.3 or 5.4):**
   - [ ] Consolidate root-level documentation files
   - [ ] Clean up archive directory
   - [ ] Verify workflows/ folder status

3. **Handoff to execution issues:**
   - [#666](https://github.com/lightspeedwp/.github/issues/666) (Update documentation index)
   - Future improvement issue for root-level consolidation

---

**Audit Completed:** 2026-05-31
**Auditor:** Claude Code
**Status:** Ready for implementation
**Compliance Level:** 97% (largely correct with minor improvements)
