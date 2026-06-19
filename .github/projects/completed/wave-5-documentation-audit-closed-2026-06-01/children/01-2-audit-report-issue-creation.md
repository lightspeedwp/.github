---
file_type: documentation
title: "Issue Creation Documentation Consolidation Audit"
description: "Complete audit of issue creation documentation identifying consolidation opportunities and duplicated content"
version: "v1.0.1"
created_date: "2026-05-31"
last_updated: "2026-06-01"
author: "Claude Code"
maintainer: "LightSpeedWP Team"
tags: ["documentation", "audit", "consolidation", "wave-5"]
status: completed
stability: "stable"
domain: "governance"
---

# Issue Creation Documentation Audit Report

**Parent Issue:** [#651](https://github.com/lightspeedwp/.github/issues/651) (Documentation Consolidation)
**Child Issue:** [#662](https://github.com/lightspeedwp/.github/issues/662) (Issue Creation Docs Consolidation)
**Audited:** 2026-05-31
**Auditor:** Claude Code

---

## Executive Summary

Audited 6 documentation files related to issue creation. Found:

- **Significant overlap** between `instructions/issues.instructions.md` and `docs/ISSUE_CREATION_GUIDE.md`
- **Internal duplication** within `instructions/issues.instructions.md` itself (content repeats)
- **Missing file** (`docs/LABELING.md` referenced in audit scope but does not exist)
- **Fragmented responsibility** across 4 active files covering similar ground

**Recommendation:** Consolidate into 2 canonical files (instructions + guide) and create a single reference for labels.

---

## Files Audited

| File | Path | Exists | Status | Role |
|------|------|--------|--------|------|
| Issue Creation Guide | `docs/ISSUE_CREATION_GUIDE.md` | ✅ | Active | High-level how-to |
| Issue Labels Guide | `docs/LABELING.md` | ❌ | Missing | Supposed label reference |
| Issue Types Reference | `docs/ISSUE_TYPES.md` | ✅ | Active | Canonical type definitions |
| Issue Templates README | `.github/ISSUE_TEMPLATE/README.md` | ✅ | Active | Template directory guide |
| Issue Instructions | `instructions/issues.instructions.md` | ✅ | Active | Official instructions (AI/agents) |
| Documentation Index | `docs/index.md` | ✅ | Empty | Placeholder |

---

## Detailed Findings

### 1. **`docs/ISSUE_CREATION_GUIDE.md`**

**Type:** Practical how-to guide
**Length:** ~165 lines
**Audience:** All contributors
**Quality:** Well-structured, clear formatting

**Scope Covered:**

- Search for duplicates before creating
- Choose correct issue template
- Fill out template thoroughly
- Set correct type and labels
- Write clear titles
- Reference issues/milestones/projects
- Submit and monitor
- Understand issue lifecycle (8 stages)
- Bulk issue creation via CLI
- Tips for excellent issues
- Sample issue template markdown

**Issues:**

- Repeats information already in `instructions/issues.instructions.md`
- References multiple external files (`.github/issue-types.yml`, `VERSIONING.md`, `FRONTMATTER_SCHEMA.md`)
- Label guidance is sparse—refers to section 4 but skimpy on actual label strategy

---

### 2. **`docs/LABELING.md`**

**Status:** ❌ **DEPRECATED & CONSOLIDATED**

Referenced in audit scope but this file was consolidated into `docs/LABELING.md` (see `instructions/DEPRECATED.md`).

**Key Finding:**

- `docs/LABELING.md` already contains the comprehensive labelling guide
- Includes "Issue Labelling" section (section 3) with all required information
- Label families, colors, automation rules already documented there
- References to the old `ISSUE_LABELS.md` should be updated to point to `LABELING.md`

**Recommendation:**
Instead of creating a new file, update all broken references to `ISSUE_LABELS.md` to point to `docs/LABELING.md#issue-labelling` instead.

---

### 3. **`docs/ISSUE_TYPES.md`**

**Type:** Reference guide
**Length:** ~179 lines
**Audience:** Contributors, maintainers, automation engineers
**Quality:** Comprehensive, well-maintained (last updated 2026-05-29)

**Scope Covered:**

- Purpose and use cases
- Quick reference of all 27 types
- Detailed comparison table (color, priority, key labels)
- Common requirements (DoR, DoD)
- Usage guidelines (how to choose, automation, colors)
- Best practices
- Suggested saved searches
- PR template guidance

**Issues:**

- Tightly scoped to types only—does not cover broader label strategy
- Detailed but dense—might be intimidating for new contributors
- No consolidated label reference (would reference that missing `ISSUE_LABELS.md`)

---

### 4. **`.github/ISSUE_TEMPLATE/README.md`**

**Type:** Directory overview
**Length:** ~116 lines
**Audience:** Contributors using templates
**Quality:** Clear, includes workflow diagram, good use of badges

**Scope Covered:**

- Quick start (clone, install, usage)
- Issue template workflow (visual Mermaid diagram)
- Template directory structure
- Template integration (references to related docs)
- Automation features
- Related documentation links
- Usage guidelines
- Maintained by automation team

**Issues:**

- Audience-focused (template users only) but references broader governance
- Diagram is helpful but static—doesn't link to actual template files
- Says "Available Templates" section but no actual list of templates

---

### 5. **`instructions/issues.instructions.md`**

**Type:** Official instructions (for AI agents/maintainers)
**Length:** ~247 lines
**Audience:** AI agents, maintainers, automation engineers
**Quality:** Authoritative but with duplication issues

**Critical Issues Found:**

1. **INTERNAL DUPLICATION:** Content duplicates within the file:
   - Section 1–2 covers Markdown templates with YAML frontmatter (**TWICE**: lines 52-60 and lines 168-171)
   - Section 2 defines required frontmatter (**TWICE**: lines 64-86 and lines 175-200)
   - Section 3 of the first half covers template choice (lines 90-95); Section 3 of the second half (line 204) duplicates Section 4's "Filling Out Issue Templates" (lines 99-106)
   - Entire "Issue Creation Instructions" header repeats (lines 161-166)

2. **Overlap with `docs/ISSUE_CREATION_GUIDE.md`:**
   - Both cover template selection
   - Both cover frontmatter requirements
   - Both cover label requirements
   - Both reference issue lifecycle

3. **Missing Labels Section:**
   - Instructs on label families but doesn't list them
   - References `LABEL_STRATEGY.md`, `ISSUE_LABELS.md` (missing!), `labels.yml`
   - No authoritative label reference in this file

**Scope Covered (Despite Duplication):**

- Markdown templates with YAML frontmatter (required)
- Required frontmatter fields
- Template selection
- Filling out templates
- Required labels and automation
- Label families
- Label assignment and enforcement
- Issue types and selection
- Related files (cross-references)

---

### 6. **`docs/index.md`**

**Type:** Placeholder
**Length:** ~10 lines
**Status:** Empty/incomplete
**Issues:** No actual index; just a redirect note

---

## Consolidation Matrix

| Current File | Content | Proposed Location | Action | Rationale |
|--------------|---------|-------------------|--------|-----------|
| `docs/ISSUE_CREATION_GUIDE.md` | Practical how-to guide | Keep (docs/) | Preserve | Good audience fit, clear structure |
| `docs/LABELING.md` | Deprecated; consolidated into LABELING.md | Update references | Fix broken links | Already exists at `docs/LABELING.md#issue-labelling`; redirect references there |
| `docs/ISSUE_TYPES.md` | Type definitions & reference | Keep (docs/) | Preserve | Comprehensive, well-maintained |
| `.github/ISSUE_TEMPLATE/README.md` | Template directory guide | Migrate to inline comments | Archive or migrate | Mostly metadata; can live in directory |
| `instructions/issues.instructions.md` | Official instructions | Refactor | Consolidate & fix | Remove internal duplication; keep authoritative core |
| `docs/index.md` | Empty index | Update or replace | Rebuild | Create proper index linking to all above |

---

## Key Overlaps Identified

### Overlap 1: Template & Frontmatter Guidance

**Files involved:**

- `docs/ISSUE_CREATION_GUIDE.md` (sections 2–3)
- `instructions/issues.instructions.md` (sections 1–2, duplicated twice)

**Content:** How to use Markdown templates with YAML frontmatter, required fields

**Consolidation:** Keep in both but clarify roles:

- **Guide:** User-friendly "why and how to fill out frontmatter"
- **Instructions:** Authoritative specification for agents/maintainers

---

### Overlap 2: Issue Lifecycle & Status

**Files involved:**

- `docs/ISSUE_CREATION_GUIDE.md` (section 8)
- `instructions/issues.instructions.md` (section 5, labeled "Issue Lifecycle and Automation")

**Content:** Stages of an issue from creation to closure

**Consolidation:** Link to one canonical source; avoid duplication

---

### Overlap 3: Label Requirements & Strategy

**Files involved:**

- `docs/ISSUE_CREATION_GUIDE.md` (section 4, sparse)
- `instructions/issues.instructions.md` (section 4–5, references missing files)
- `docs/ISSUE_TYPES.md` (type-focused, doesn't cover label families)
- Missing: `docs/LABELING.md` (should exist but doesn't)

**Content:** What labels are required, label families, one-hot rules

**Consolidation:** Redirect references to `docs/LABELING.md#issue-labelling` and do not recreate the deprecated file

---

### Overlap 4: Issue Template Selection

**Files involved:**

- `docs/ISSUE_CREATION_GUIDE.md` (section 2)
- `instructions/issues.instructions.md` (section 3)
- `.github/ISSUE_TEMPLATE/README.md` (general info)

**Content:** How to choose the right template

**Consolidation:** Single source of truth; link from others

---

## Missing Documentation

### Critical Gaps

1. **Broken references to `docs/LABELING.md`**
   - `instructions/issues.instructions.md` section 4 references deprecated file
   - File was consolidated into `docs/LABELING.md` (per `instructions/DEPRECATED.md`)
   - References should point to `docs/LABELING.md#issue-labelling` instead
   - Impact: High — broken links to deprecated location

2. **`docs/index.md`** (Empty)
   - Should be actual index with links
   - Currently just placeholder
   - Impact: Medium — documentation discoverability

3. **Clarify labeling documentation location**
   - All label families, colors, and automation rules are in `docs/LABELING.md`
   - Not in a separate ISSUE_LABELS.md (which was deprecated)
   - Update cross-references to point to consolidated guide
   - Impact: High — reducing confusion around document organization

---

## Recommendations for Consolidation

### Phase 1: Fix Immediate Duplication (Wave 5.3)

1. **Remove internal duplication in `instructions/issues.instructions.md`**
   - Delete repeated sections (content appears twice)
   - Keep authoritative version only
   - Preserve formatting and structure

2. **Update broken references to ISSUE_LABELS.md**
   - Locate all references to the deprecated `docs/LABELING.md`
   - Redirect them to `docs/LABELING.md#issue-labelling` instead
   - Note: The file was consolidated into `docs/LABELING.md` (see `instructions/DEPRECATED.md`)
   - Do NOT recreate the deprecated file

3. **Update `docs/index.md`**
   - Create actual documentation index
   - Link to all issue-related files (including `LABELING.md`)
   - Add brief descriptions and use cases

### Phase 2: Align & Link (Wave 5.3 or 5.4)

1. **Update cross-references**
   - Ensure all files link to `docs/LABELING.md#issue-labelling`
   - Verify no broken references
   - Use consistent link patterns

2. **Consolidate GitHub Template Directory**
   - Decide: keep `.github/ISSUE_TEMPLATE/README.md` or move to inline comments
   - Consider archiving if content can live elsewhere
   - Ensure templates themselves are well-documented

3. **Create label & type quick reference** (optional)
   - Single-page cheat sheet linking to detailed guides
   - Could live in `docs/QUICK_REFERENCE.md`
   - Useful for new contributors

### Phase 3: Update Automation (Post Wave 5)

1. **Wire automation to consolidated docs**
   - Ensure labeling agents reference correct canonical files
   - Update `labeler.yml` documentation
   - Confirm issue templates reference correct guides

---

## Statistics

| Metric | Count |
|--------|-------|
| Files audited | 6 |
| Files with duplicates | 1 (`instructions/issues.instructions.md`) |
| Missing files | 1 (`docs/LABELING.md`) |
| Empty files | 1 (`docs/index.md`) |
| Overlapping content areas | 4 |
| Total lines across all files | ~717 |
| Estimated deduplication savings | ~100 lines |

---

## Next Steps

1. **Phase 1 (Immediate):**
   - [ ] Fix `instructions/issues.instructions.md` duplication
   - [ ] Update all broken references to point to `docs/LABELING.md#issue-labelling`
   - [ ] Update `docs/index.md` with proper index

2. **Phase 2 (Follow-up):**
   - [ ] Verify all cross-references
   - [ ] Update broken links
   - [ ] Align terminology across files

3. **Handoff to Wave 5.3-5.4 execution issues:**
   - [#663](https://github.com/lightspeedwp/.github/issues/663) (PR docs consolidation)
   - [#664](https://github.com/lightspeedwp/.github/issues/664) (Labeling docs consolidation)
   - [#665](https://github.com/lightspeedwp/.github/issues/665) (File organization alignment)
   - [#666](https://github.com/lightspeedwp/.github/issues/666) (Update documentation index)

---

**Audit Completed:** 2026-05-31
**Auditor:** Claude Code
**Status:** Ready for implementation
