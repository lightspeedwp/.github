---
file_type: documentation
title: "Wave 5.3 Phase 2 Execution Plan"
description: "Implementation of consolidation recommendations from Wave 5.3 audits"
version: "v1.0.1"
created_date: "2026-05-31"
last_updated: "2026-06-01"
author: "Claude Code"
maintainer: "LightSpeedWP Team"
tags: ["documentation", "consolidation", "wave-5", "phase-2", "execution"]
status: active
stability: "stable"
domain: "governance"
---

# Wave 5.3 Phase 2 Execution Plan

**Parent Issue:** [#651](https://github.com/lightspeedwp/.github/issues/651) (Documentation Consolidation)
**Audit Phase Completed:** 2026-05-31
**Execution Phase Started:** 2026-05-31
**Executor:** Claude Code

---

## Overview

Phase 2 execution of Wave 5.3 consolidation recommendations. Implement immediate fixes and consolidations identified in the four audit reports ([#662](https://github.com/lightspeedwp/.github/issues/662), [#663](https://github.com/lightspeedwp/.github/issues/663), [#664](https://github.com/lightspeedwp/.github/issues/664), [#665](https://github.com/lightspeedwp/.github/issues/665)).

---

## Priority-Based Execution Sequence

### 🔴 CRITICAL - Fix Immediately (Day 1)

These are high-impact fixes with low risk of breaking changes.

#### Task 1: Fix duplicate footer in PULL_REQUEST_TEMPLATE/README.md

**From Issue [#663](https://github.com/lightspeedwp/.github/issues/663)**

- **File:** `.github/PULL_REQUEST_TEMPLATE/README.md`
- **Issue:** Footer repeats 3 times identically (lines 83-90)
- **Action:** Delete duplicate lines 85-90, keep single footer
- **Risk:** None (removing duplicates)
- **Status:** 🟡 Ready to implement
- **Effort:** 5 minutes

#### Task 2: Remove duplicate instruction file

**From Issue [#665](https://github.com/lightspeedwp/.github/issues/665)**

- **File:** `.github/instructions/file-organisation.instructions.md` (duplicate)
- **Action:**
  - Compare with `instructions/file-organisation.instructions.md`
  - If identical: delete `.github/` copy
  - If different: document difference and keep as override
- **Risk:** Low (keeping portable version, removing duplicate)
- **Status:** 🟡 Ready to implement
- **Effort:** 15 minutes

#### Task 3: Update broken references in BRANCHING_STRATEGY.md

**From Issue [#663](https://github.com/lightspeedwp/.github/issues/663)**

- **File:** `docs/BRANCHING_STRATEGY.md`
- **Issues:**
  - Line 283: `docs/LABELING.md` → `docs/LABELING.md#issue-labelling`
  - Line 284: `docs/LABELING.md` → decision pending
- **Action:** Fix ISSUE_LABELS reference, add note about PR_LABELS consolidation
- **Risk:** None (fixing broken references)
- **Status:** 🟡 Ready to implement
- **Effort:** 10 minutes

---

### 🟡 HIGH PRIORITY - Consolidate Content (Day 2-3)

#### Task 4: Consolidate or remove labeling.instructions.md

**From Issue [#664](https://github.com/lightspeedwp/.github/issues/664)**

- **File:** `instructions/labeling.instructions.md`
- **Issues:**
  - Duplicates label categories from LABELING.md
  - Incomplete coverage (no discussions, PR-specific rules, meta labels)
  - Creates maintenance burden

**Options:**
A) **Remove entirely** - LABELING.md is sufficient for all audiences
B) **Convert to quick reference** - 20-30 line cheat sheet with links to LABELING.md

**Recommendation:** Option A (remove) - LABELING.md comprehensive; agents can reference directly

- **Action:**
  - [ ] Review all references to labeling.instructions.md
  - [ ] Check if any agents or workflows depend on it
  - [ ] Update references to point to LABELING.md instead
  - [ ] Move file to archive or delete
- **Risk:** Low (LABELING.md coverage complete)
- **Status:** 🟡 Ready to implement
- **Effort:** 30 minutes

#### Task 5: Reduce label duplication in AUTOMATION.md

**From Issue [#664](https://github.com/lightspeedwp/.github/issues/664)**

- **File:** `docs/AUTOMATION.md`
- **Issue:** Section 4 duplicates LABELING.md sections on label requirements
- **Action:**
  - [ ] Move detailed label requirement rules to LABELING.md (already there)
  - [ ] Keep governance/policy framework in AUTOMATION.md
  - [ ] Update AUTOMATION.md section 4 to reference LABELING.md for specifics
  - [ ] Example: "See LABELING.md#Issue_Labelling for detailed requirements"
- **Risk:** Low (existing content preserved, just reorganized)
- **Status:** 🟡 Ready to implement
- **Effort:** 45 minutes

---

### 🟢 MEDIUM PRIORITY - Documentation Updates (Day 4)

#### Task 6: Fix internal duplication in instructions/issues.instructions.md

**From Issue [#662](https://github.com/lightspeedwp/.github/issues/662)**

- **File:** `instructions/issues.instructions.md`
- **Issues:**
  - Section content repeats twice (lines 52-60 repeat at 168-171)
  - Required frontmatter defined twice (lines 64-86 and 175-200)
  - Entire headers repeat
- **Action:**
  - [ ] Remove duplicate sections
  - [ ] Keep single authoritative version
  - [ ] Preserve formatting and structure
- **Risk:** None (removing duplicates within same file)
- **Status:** 🟡 Ready to implement
- **Effort:** 30 minutes

#### Task 7: Document archived instructions and ai/ folder

**From Issue [#665](https://github.com/lightspeedwp/.github/issues/665)**

- **Files:**
  - `.github/instructions/.archive/` (18 deprecated files)
  - `ai/` folder (7 files)
- **Actions:**
  - [ ] Create/update `.github/instructions/.archive/README.md` explaining archive purpose
  - [ ] List all archived files with deprecation dates
  - [ ] Add `ai/` folder documentation to CLAUDE.md (new section)
  - [ ] Create `ai/README.md` if not exists
- **Risk:** None (documentation only)
- **Status:** 🟡 Ready to implement
- **Effort:** 45 minutes

---

### 🔵 LOWER PRIORITY - Phase 2 Cleanup (Wave 5.4+)

These are larger reorganization efforts recommended for Phase 2 but deferred to Wave 5.4.

- Consolidate root-level .md files to `docs/` (GOVERNANCE.md, SUPPORT.md, DEVELOPMENT.md, BRANDING_*.md)
- Reduce branch naming duplication across 3 files (consolidate to BRANCHING_STRATEGY.md)
- Deduplicate template mapping table across 2 files
- Create label quick-reference (optional)

---

## Execution Checklist

### Critical Tasks

- [ ] Task 1: Fix PULL_REQUEST_TEMPLATE/README.md footer
- [ ] Task 2: Remove duplicate instruction file
- [ ] Task 3: Update broken references in BRANCHING_STRATEGY.md
- [ ] Commit and push Phase 1 fixes

### High Priority Tasks

- [ ] Task 4: Remove or consolidate labeling.instructions.md
- [ ] Task 5: Reduce AUTOMATION.md label duplication
- [ ] Commit and push Phase 2 consolidations

### Medium Priority Tasks

- [ ] Task 6: Fix duplication in instructions/issues.instructions.md
- [ ] Task 7: Document archive and ai/ folder
- [ ] Commit and push documentation updates

### Final Steps

- [ ] Create Wave 5.3 Phase 2 execution summary
- [ ] Update PR [#697](https://github.com/lightspeedwp/.github/issues/697) with Phase 2 completion status
- [ ] Prepare for Wave 5.4 (README audits)

---

## Implementation Guidelines

1. **Commit Strategy:**
   - Commit critical fixes first (Task 1-3)
   - Commit consolidations together (Task 4-5)
   - Commit documentation updates (Task 6-7)

2. **Testing:**
   - Verify all links point to existing files
   - Check that referenced anchors (#issue-labelling) exist
   - Run linting on modified .md files

3. **Documentation:**
   - Update last_updated dates
   - Add migration notes if files are renamed/moved
   - Cross-check all cross-references

4. **PR Strategy:**
   - Update PR [#697](https://github.com/lightspeedwp/.github/issues/697) to track Phase 2 progress
   - Keep all changes on `claude/lucid-feynman-OhK09` branch
   - Ready for merge after all tasks complete

---

## Success Criteria

- [ ] All critical broken references fixed
- [ ] No duplicate footer in PULL_REQUEST_TEMPLATE/README.md
- [ ] No duplicate instruction files in `.github/instructions/`
- [ ] Label duplication reduced in AUTOMATION.md
- [ ] No internal duplication in instructions/issues.instructions.md
- [ ] Archives and special folders documented
- [ ] All links verified to existing files
- [ ] Ready for Wave 5.4 README audit phase

---

**Status:** Ready to execute
**Estimated Duration:** 3-4 hours total
**Next Phase:** Wave 5.4 (README discovery and updates)
