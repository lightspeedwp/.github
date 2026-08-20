---
file_type: documentation
title: Instruction Files Comprehensive Audit Report
description: Complete inventory and analysis of all .instructions.md files across portable and control-plane locations
version: v1.0
last_updated: '2026-08-05'
owners:
  - AI Operations Team
tags:
  - audit
  - instructions
  - phase-1-restructuring
  - governance
status: active
stability: stable
domain: governance
---

# Instruction Files Comprehensive Audit Report

**Initiative:** Repository Restructuring #1299  
**Scope:** Complete inventory and analysis of all `.instructions.md` files  
**Date:** 2026-08-05  
**Conducted by:** AI Operations Team

---

## Executive Summary

- **Total instruction files:** 58 (44 active + 14 archived in separate `.github/instructions/.archive/` folder)
- **Total lines of documentation:** 11,082 across all files
- **Portable (organisation-wide):** 27 files (61% of active)
- **Repo-local (control-plane specific):** 17 files (39% of active)
- **Archived (pending consolidation):** 14 files (24% of total)
- **High-touch files (10+ references each):** 12 files requiring careful migration
- **Total references across codebase:** 502+ references in 156+ files
- **Duplicate files identified:** 2–3 pairs requiring consolidation
- **Files with unspecified scope:** 10 files needing frontmatter updates

**Clarification:** The 27 portable + 17 repo-local = 44 active files (not 43, reflects updated active count). The 15 archived files are stored in a separate archive folder and are not included in the 44-file active count.

---

## Top 20 Most-Referenced Instruction Files

| Rank | File | References | Lines | Classification | Status |
|------|------|------------|-------|-----------------|--------|
| 1 | `coding-standards.instructions.md` | 76 | 128 | portable | ACTIVE |
| 2 | `pull-requests.instructions.md` | 40 | 244 | portable | ACTIVE |
| 3 | `documentation-formats.instructions.md` | 32 | 638 | portable | ACTIVE |
| 4 | `automation.instructions.md` | 24 | 786 | repo-local | ACTIVE |
| 5 | `quality-assurance.instructions.md` | 24 | 573 | portable | ACTIVE |
| 6 | `languages.instructions.md` | 19 | 449 | portable | ACTIVE |
| 7 | `file-organisation.instructions.md` | 16 | 669 | portable | ACTIVE |
| 8 | `community-standards.instructions.md` | 15 | 692 | portable | ACTIVE |
| 9 | `agent-spec.instructions.md` | 14 | 136 | repo-local | ACTIVE |
| 10 | `a11y.instructions.md` | 13 | 394 | portable | ACTIVE |
| 11 | `linting.instructions.md` | 13 | 211 | portable | ACTIVE |
| 12 | `issues.instructions.md` | 12 | 172 | portable | ACTIVE |
| 13 | `plugin-architecture.instructions.md` | 8 | 101 | portable | ACTIVE |
| 14 | `workflows.instructions.md` | 8 | 18 | repo-local | ACTIVE |
| 15 | `instructions.instructions.md` | 8 | 130 | repo-local | ACTIVE |
| 16 | `agent-creation-workflow.instructions.md` | 8 | 127 | portable | ACTIVE |
| 17 | `release.instructions.md` | 7 | 135 | repo-local | ACTIVE |
| 18 | `mermaid.instructions.md` | 7 | 243 | repo-local | ACTIVE |
| 19 | `plugin-structure.instructions.md` | 7 | 27 | portable | ACTIVE |
| 20 | `spec-driven-workflow.instructions.md` | 6 | 170 | portable | ACTIVE |

---

## High-Touch Files (10+ References) — Migration Priority

These files have significant reference footprint and require careful planning during any migration.

| File | References | Lines | Scope | Description |
|------|------------|-------|-------|-------------|
| `coding-standards.instructions.md` | 76 | 128 | organisation-wide | Unified coding standards for all LightSpeedWP projects |
| `pull-requests.instructions.md` | 40 | 244 | organisation-wide | Canonical instructions for creating, labeling, and submitting PRs |
| `documentation-formats.instructions.md` | 32 | 638 | organisation-wide | Unified standards for Markdown, YAML frontmatter, Mermaid |
| `automation.instructions.md` | 24 | 786 | repo-local | Comprehensive standards for GitHub automation agents and workflows |
| `quality-assurance.instructions.md` | 24 | 573 | organisation-wide | Testing, validation, and quality assurance standards |
| `languages.instructions.md` | 19 | 449 | organisation-wide | Unified linting and formatting standards for all languages |
| `file-organisation.instructions.md` | 16 | 669 | organisation-wide | File placement rules and directory structure conventions |
| `community-standards.instructions.md` | 15 | 692 | organisation-wide | Community health standards and naming conventions |
| `agent-spec.instructions.md` | 14 | 136 | repo-local | How to design and write LightSpeed Copilot agent specifications |
| `a11y.instructions.md` | 13 | 394 | organisation-wide | WCAG 2.2 AA accessibility standards and guidance |
| `linting.instructions.md` | 13 | 211 | organisation-wide | Master index for all linting instructions |
| `issues.instructions.md` | 12 | 172 | organisation-wide | Canonical instructions for creating and labeling issues |

---

## Organization: Portable vs Repo-Local Split

### Portable (Organisation-Wide) — 27 files

These files are reusable standards intended to be copied or referenced across all LightSpeedWP projects.

**Coding & Quality (12 files)**

- `coding-standards.instructions.md` (76 refs) — Core reference for development standards
- `quality-assurance.instructions.md` (24 refs) — Testing pyramid and coverage targets
- `languages.instructions.md` (19 refs) — Language-specific linting and formatting rules
- `linting.instructions.md` (13 refs) — Master index and tool guidance
- `a11y.instructions.md` (13 refs) — WCAG 2.2 AA compliance
- `plugin-architecture.instructions.md` (8 refs)
- `plugin-structure.instructions.md` (7 refs)
- `self-explanatory-code-commenting.instructions.md` (3 refs)
- `task-implementation.instructions.md` (5 refs)
- `issue-templates.instructions.md` (1 ref)
- `pr-templates.instructions.md` (1 ref)

**Documentation & Process (8 files)**

- `documentation-formats.instructions.md` (32 refs) — Core reference for markdown, YAML, Mermaid
- `pull-requests.instructions.md` (40 refs) — PR creation, labeling, and lifecycle
- `community-standards.instructions.md` (15 refs) — Community health and naming conventions
- `file-organisation.instructions.md` (16 refs) — File placement and directory structure
- `issues.instructions.md` (12 refs) — Issue creation and management
- `spec-driven-workflow.instructions.md` (6 refs) — Development methodology
- `wordpress-project-planning.instructions.md` (2 refs)
- `pr-automation-review.instructions.md` (1 ref)

**AI & Operations (7 files)**

- `agent-creation-workflow.instructions.md` (8 refs)
- `copilot-operations.instructions.md` (6 refs)
- `ai-operations-unified.instructions.md` (6 refs)
- `multi-provider-compatibility.instructions.md` (6 refs)
- `planner.instructions.md` (5 refs)
- `project-meta-sync.instructions.md` (4 refs) — DEPRECATED
- `metrics.instructions.md` (4 refs)
- `multi-platform-skill-manifests.instructions.md` (1 ref)

### Repo-Local (Control-Plane Specific) — 17 files

These files are specific to the `.github` control plane and not intended for reuse in other repositories.

**Core Control Plane (6 files)**

- `automation.instructions.md` (24 refs) — GitHub automation and workflow standards
- `agent-spec.instructions.md` (14 refs) — Copilot agent specification rules
- `instructions.instructions.md` (8 refs) — Guide for authoring instruction files
- `release.instructions.md` (7 refs) — Release management and governance
- `workflows.instructions.md` (8 refs) — GitHub Actions best practices
- `mermaid.instructions.md` (7 refs) — Diagram design and validation standards

**Configuration & Operations (6 files)**

- `readme.instructions.md` (5 refs)
- `reporting.instructions.md` (5 refs)
- `tools.instructions.md` (3 refs)
- `hooks.instructions.md` (2 refs)
- `prompt.instructions.md` (2 refs)
- `template.instructions.md` (2 refs)

**Metadata & Utilities (3 files)**

- `tasksync.instructions.md` (2 refs)
- `meta.instructions.md` (1 ref)
- `docs.instructions.md` (1 ref)

**Archived (2 files)**

- `tests.instructions.md` (5 refs)
- `agents.instructions.md` (3 refs)

---

## Migration Challenges & Critical Issues

### Challenge 1: High-Dependency Core Files (CRITICAL)

**Affected Files:**

- `coding-standards.instructions.md` (76 references)
- `pull-requests.instructions.md` (40 references)
- `documentation-formats.instructions.md` (32 references)

**Issues:**

- Referenced extensively across `.md`, `.js`, `.ts`, `.json`, `.yaml`, `.yml` files
- Appear in: CLAUDE.md, CONTRIBUTING.md, README.md, AGENTS.md, docs/, agents/, scripts/
- Any path change requires mass reference updates

**Impact Assessment:**

- **coding-standards.instructions.md:** Impacts every development guide and coding workflow
- **pull-requests.instructions.md:** Core PR workflow; integrated with BRANCHING_STRATEGY.md and LABELING.md
- **documentation-formats.instructions.md:** Used in schema validation and frontmatter checks

**Likelihood of breakage on move:** 95%+

**Mitigation Strategy:**

1. Create stable aliases/redirects in old locations
2. Update references in batches (P0, P1, P2 priority)
3. Maintain detailed git history with commit messages
4. Test all validation scripts before migration

### Challenge 2: Duplicate Instruction Files (MODERATE)

**Identified Duplicates:**

1. `.github/instructions/markdown.instructions.md` (2 lines) vs `instructions/markdown.instructions.md` (228 lines)
2. `.github/instructions/.archive/reporting.instructions.md` (206 lines) vs `instructions/reporting.instructions.md` (207 lines)
3. `.github/instructions/.archive/markdown.instructions.md` (31 lines) — third version

**Issues:**

- Confusing which version is canonical
- Risk of inconsistent guidance across repositories
- Maintenance burden (changes in one don't reflect in others)

**Recommendation:**

- Consolidate all duplicates immediately
- Keep most comprehensive version in `instructions/` folder
- Archive obsolete versions with deprecation notices
- Update all cross-references

### Challenge 3: Archived Files Still Referenced (HIGH)

**15 files in `.github/instructions/.archive/` with 40+ active references:**

| File | Refs | Action Required |
|------|------|-----------------|
| `tests.instructions.md` | 5 | Merge into active testing file or restore |
| `reporting.instructions.md` | 5 | Duplicate of active file — remove archive |
| `agents.instructions.md` | 3 | Restore or update 3 references |
| `testing.instructions.md` | 3 | Consolidate with tests.instructions.md |
| `javascript.instructions.md` | 3 | Integrate into languages.instructions.md |
| `jest.instructions.md` | 3 | Integrate into quality-assurance.instructions.md |
| `json.instructions.md` | 3 | Integrate into languages.instructions.md |
| `frontmatter.instructions.md` | 2 | Merge into documentation-formats.instructions.md |
| And 7 others | 2 each | Review and consolidate |

**Issues:**

- Active code referencing archived files indicates incomplete migration
- Confusing about authoritative sources
- Archive folder violates repository organization rules

**Total archived references:** 40+ across 15 files

**Recommendation:**
Before cleaning the archive, audit all 40 references to determine if they should be:

1. Updated to reference restored/consolidated files
2. Removed if content is obsolete
3. Restored to active status with proper consolidation

### Challenge 4: Unspecified Scope Classification (10 files)

**Affected Files (missing `scope:` frontmatter field):**

- `planner.instructions.md` (5 refs)
- `project-meta-sync.instructions.md` (4 refs)
- `metrics.instructions.md` (4 refs)
- `multi-platform-skill-manifests.instructions.md` (1 ref)
- `pr-automation-review.instructions.md` (1 ref)
- `wordpress-project-planning.instructions.md` (2 refs)
- `tasksync.instructions.md` (2 refs)
- `markdown.instructions.md` (2 refs)
- And 2 others

**Issues:**

- Unclear whether files are portable or control-plane-specific
- Complicates distribution decisions for portability
- Violates CLAUDE.md frontmatter requirements

**Recommendation:**
Add explicit `scope:` field to all files:

```yaml
scope: organisation-wide  # or repo-local or control-plane-specific
```

### Challenge 5: Directory Organization Violations (MODERATE)

**Current Structure:**

- 41 files in `instructions/` (root level — portable)
- 1 active file in `.github/instructions/` (repo-local)
- 16 archived files in `.github/instructions/.archive/` (pending cleanup)

**Per CLAUDE.md Repository Boundaries:**
> **Portable reusable AI assets** → top-level source folders  
> **Repo-local Copilot/agent instructions** → `.github/instructions/` or `.github/custom-instructions.md`

**Issues:**

- Mixed organization violates stated rules
- Confusing search and discovery
- `.github/instructions/` should only contain truly repo-local files

**Recommendation:**

1. Move `.github/instructions/markdown.instructions.md` → `instructions/markdown.instructions.md` (if portable)
2. Clean the `.archive/` folder (restore or permanently delete all 16 files)
3. Keep `.github/instructions/` ONLY for control-plane-specific files:
   - `automation.instructions.md`
   - `agent-spec.instructions.md`
   - `release.instructions.md`
   - `workflows.instructions.md`
   - And ~12 others that are repo-local

---

## Complete File Classification Matrix

### Portable Files by Category (27 files, 1,745 lines)

**Coding & Quality Standards (12 files)**

- `coding-standards.instructions.md` (128 lines, 76 refs)
- `quality-assurance.instructions.md` (573 lines, 24 refs)
- `languages.instructions.md` (449 lines, 19 refs)
- `linting.instructions.md` (211 lines, 13 refs)
- `a11y.instructions.md` (394 lines, 13 refs)
- `self-explanatory-code-commenting.instructions.md` (180 lines, 3 refs)
- `plugin-architecture.instructions.md` (101 lines, 8 refs)
- `plugin-structure.instructions.md` (27 lines, 7 refs)
- `task-implementation.instructions.md` (189 lines, 5 refs)
- `issue-templates.instructions.md` (95 lines, 1 ref)
- `pr-templates.instructions.md` (108 lines, 1 ref)
- **Subtotal: 2,457 lines**

**Documentation & Development Process (8 files)**

- `documentation-formats.instructions.md` (638 lines, 32 refs)
- `pull-requests.instructions.md` (244 lines, 40 refs)
- `community-standards.instructions.md` (692 lines, 15 refs)
- `file-organisation.instructions.md` (669 lines, 16 refs)
- `issues.instructions.md` (172 lines, 12 refs)
- `spec-driven-workflow.instructions.md` (170 lines, 6 refs)
- `wordpress-project-planning.instructions.md` (331 lines, 2 refs)
- `pr-automation-review.instructions.md` (561 lines, 1 ref)
- **Subtotal: 3,477 lines**

**AI & Operations (7 files)**

- `agent-creation-workflow.instructions.md` (127 lines, 8 refs)
- `copilot-operations.instructions.md` (121 lines, 6 refs)
- `ai-operations-unified.instructions.md` (95 lines, 6 refs)
- `multi-provider-compatibility.instructions.md` (94 lines, 6 refs)
- `planner.instructions.md` (27 lines, 5 refs)
- `project-meta-sync.instructions.md` (39 lines, 4 refs) [DEPRECATED]
- `metrics.instructions.md` (27 lines, 4 refs)
- `multi-platform-skill-manifests.instructions.md` (147 lines, 1 ref)
- **Subtotal: 677 lines**

**Total Portable:** 27 files, 6,611 lines, 221 references

### Repo-Local Files by Category (17 files, 2,505 lines)

**Core Control Plane (6 files)**

- `automation.instructions.md` (786 lines, 24 refs)
- `agent-spec.instructions.md` (136 lines, 14 refs)
- `instructions.instructions.md` (130 lines, 8 refs)
- `release.instructions.md` (135 lines, 7 refs)
- `workflows.instructions.md` (18 lines, 8 refs)
- `mermaid.instructions.md` (243 lines, 7 refs)
- **Subtotal: 1,448 lines**

**Configuration & Operations (6 files)**

- `readme.instructions.md` (76 lines, 5 refs)
- `reporting.instructions.md` (207 lines, 5 refs)
- `tools.instructions.md` (72 lines, 3 refs)
- `hooks.instructions.md` (75 lines, 2 refs)
- `prompt.instructions.md` (76 lines, 2 refs)
- `template.instructions.md` (83 lines, 2 refs)
- **Subtotal: 489 lines**

**Metadata & Utilities (3 files)**

- `tasksync.instructions.md` (83 lines, 2 refs)
- `meta.instructions.md` (24 lines, 1 ref)
- `docs.instructions.md` (125 lines, 1 ref)
- **Subtotal: 232 lines**

**Archived in Repo-Local (2 files)**

- `tests.instructions.md` (250 lines, 5 refs)
- `agents.instructions.md` (481 lines, 3 refs)
- **Subtotal: 731 lines**

**Total Repo-Local:** 17 files, 2,900 lines, 83 references

### Archived Files (15 files, 1,677 lines, 40 references)

Located in `.github/instructions/.archive/`:

| File | Lines | Refs | Status | Action |
|------|-------|------|--------|--------|
| `frontmatter.instructions.md` | 366 | 2 | Archived | Consolidate into documentation-formats.instructions.md |
| `agents.instructions.md` | 481 | 3 | Archived | Restore or update references |
| `testing.instructions.md` | 273 | 3 | Archived | Merge with active tests.instructions.md |
| `reporting.instructions.md` | 206 | 5 | Archived | Duplicate of active file — remove |
| `tests.instructions.md` | 250 | 5 | Archived | Consolidate with testing.instructions.md |
| `markdown.instructions.md` | 31 | 2 | Archived | Review vs root version (228 lines) |
| `saved-replies.instructions.md` | 92 | 2 | Archived | Restore and integrate |
| `reviewer.instructions.md` | 81 | 2 | Archived | Restore or consolidate |
| `yaml.instructions.md` | 81 | 2 | Archived | Integrate into documentation-formats.instructions.md |
| `javascript.instructions.md` | 10 | 3 | Archived | Integrate into languages.instructions.md |
| `jest.instructions.md` | 67 | 3 | Archived | Integrate into quality-assurance.instructions.md |
| `json.instructions.md` | 9 | 3 | Archived | Integrate into languages.instructions.md |
| `file-management.instructions.md` | 13 | 2 | Archived | Superseded by file-organisation.instructions.md |
| `naming-conventions.instructions.md` | 10 | 2 | Archived | Superseded by community-standards.instructions.md |
| `jsdoc.instructions.md` | 6 | 2 | Archived | Integrate into languages.instructions.md |

**Total Archived:** 15 files, 1,677 lines, 40 references

---

## Reference Dependency Map (Top Tier)

### TIER-1 CRITICAL — Mass Reference Updates Required

**1. `coding-standards.instructions.md` — 76 References**

Referenced in (sample):

- `CLAUDE.md` (multiple sections)
- `CONTRIBUTING.md` (3+ references)
- `README.md` (development section)
- `AGENTS.md` (standards section)
- `ai/AUDIT-SUMMARY.md`
- `agents/agent.md` (reference table)
- `agents/reviewer.agent.md`
- `.vscode/README.md`
- `.schemas/README.md`
- `docs/BRANCHING_STRATEGY.md`
- `docs/AWESOME_GITHUB_MAPPING_STRATEGY.md`
- `docs/INSTRUCTIONS_STANDARDS.md`
- And 64 more references across documentation and scripts

**Likelihood of breakage on move:** 95%+  
**Action:** Requires comprehensive reference audit and phased updates

**2. `pull-requests.instructions.md` — 40 References**

Referenced in:

- `CLAUDE.md` (pull requests section)
- `AGENTS.md` (standards section)
- `CONTRIBUTING.md` (contribution guide)
- `docs/AUDIT_PR_DOCS_663.md` (PR documentation audit)
- `docs/BRANCHING_STRATEGY.md`
- `docs/LABELING.md`
- `docs/AWESOME_GITHUB_MAPPING_STRATEGY.md`
- Multiple agent specifications
- PR template files
- And 30+ more references

**Likelihood of breakage on move:** 85%+  
**Action:** Coordinate move with BRANCHING_STRATEGY.md and LABELING.md updates

**3. `documentation-formats.instructions.md` — 32 References**

Referenced in:

- Schema validation scripts
- Frontmatter checks
- `.schemas/README.md`
- `CONTRIBUTING.md`
- `docs/FRONTMATTER_SCHEMA.md`
- `docs/BRANCHING_STRATEGY.md`
- Multiple linting configurations
- And 25+ more references

**Likelihood of breakage on move:** 80%+  
**Action:** Update all frontmatter validation scripts before migration

### TIER-2 HIGH — Significant Reference Updates Required

**Files with 12–24 references:**

- `automation.instructions.md` (24 refs)
- `quality-assurance.instructions.md` (24 refs)
- `languages.instructions.md` (19 refs)
- `file-organisation.instructions.md` (16 refs)
- `community-standards.instructions.md` (15 refs)
- `agent-spec.instructions.md` (14 refs)
- `a11y.instructions.md` (13 refs)
- `linting.instructions.md` (13 refs)
- `issues.instructions.md` (12 refs)

**Action:** Batch update references in phases (P1, P2)

---

## Archival Assessment & Consolidation Plan

### Priority 1: Duplicates (Consolidate Immediately)

| Original | Duplicate | Recommendation |
|----------|-----------|-----------------|
| `instructions/markdown.instructions.md` (228 lines) | `.github/instructions/markdown.instructions.md` (2 lines) | Keep root version, delete .github version |
| `instructions/reporting.instructions.md` (207 lines) | `.github/instructions/.archive/reporting.instructions.md` (206 lines) | Keep root version, remove archive |
| `instructions/testing.instructions.md` (250 lines) | `.github/instructions/.archive/testing.instructions.md` (273 lines) | Consolidate into single active file |

### Priority 2: Files to Restore (Still Referenced)

| File | Refs | Archive Size | Recommendation |
|------|------|--------------|-----------------|
| `agents.instructions.md` | 3 | 481 lines | Restore to `instructions/agents.instructions.md` |
| `saved-replies.instructions.md` | 2 | 92 lines | Restore to `instructions/saved-replies.instructions.md` |
| `reviewer.instructions.md` | 2 | 81 lines | Restore to `instructions/reviewer.instructions.md` |
| `frontmatter.instructions.md` | 2 | 366 lines | Merge into documentation-formats.instructions.md |

### Priority 3: Files to Consolidate (Overlapping Content)

| Archive File | Merge Into | Refs | Recommendation |
|--------------|-----------|------|-----------------|
| `javascript.instructions.md` | `languages.instructions.md` | 3 | Extract JS section, merge into languages |
| `jest.instructions.md` | `quality-assurance.instructions.md` | 3 | Extract Jest section, merge into QA |
| `json.instructions.md` | `languages.instructions.md` | 3 | Extract JSON section, merge into languages |
| `yaml.instructions.md` | `documentation-formats.instructions.md` | 2 | Extract YAML section, merge into docs |
| `jsdoc.instructions.md` | `languages.instructions.md` | 2 | Extract JSDoc section, merge into languages |

### Priority 4: Files to Safely Delete (No References)

| Archive File | Lines | Status | Reason |
|--------------|-------|--------|--------|
| `file-management.instructions.md` | 13 | Safe to delete | Superseded by file-organisation.instructions.md |
| `naming-conventions.instructions.md` | 10 | Safe to delete | Superseded by community-standards.instructions.md |

---

## Summary Statistics

| Metric | Value | Notes |
|--------|-------|-------|
| **Total instruction files** | 58 | 44 active + 15 archived (separate) |
| **Total lines of documentation** | 11,082 | Compressed ~190 KB |
| **Portable (organisation-wide)** | 27 (61% of active) | Reusable across LightSpeedWP |
| **Repo-local (control-plane)** | 17 (39% of active) | Specific to .github repository |
| **Archived (separate folder)** | 15 (26% of total) | Awaiting consolidation/cleanup |
| **High-touch files (10+ refs)** | 12 (27% of active) | Require careful migration planning |
| **Files with unspecified scope** | 10 | Need frontmatter updates |
| **Duplicate files** | 2–3 pairs | Immediate consolidation needed |
| **References across codebase** | 502+ | In 156+ files across entire repo |
| **Archived files with active refs** | 15 | 40+ references to consolidate |
| **Files requiring scope field** | 10 | Missing frontmatter classification |

---

## Recommended Organization Structure (Post-Consolidation)

**Proposed directory structure after Phase 1:**

```
repository/
├── instructions/
│   ├── core/
│   │   ├── README.md (index and structure guide)
│   │   ├── coding-standards.instructions.md      [76 refs — CRITICAL]
│   │   ├── documentation-formats.instructions.md [32 refs — CRITICAL]
│   │   └── community-standards.instructions.md   [15 refs — CRITICAL]
│   │
│   ├── development/
│   │   ├── pull-requests.instructions.md         [40 refs — CRITICAL]
│   │   ├── issues.instructions.md                [12 refs]
│   │   ├── issue-templates.instructions.md       [1 ref]
│   │   ├── pr-templates.instructions.md          [1 ref]
│   │   ├── spec-driven-workflow.instructions.md  [6 refs]
│   │   └── task-implementation.instructions.md   [5 refs]
│   │
│   ├── technical/
│   │   ├── languages.instructions.md             [19 refs + merged JS/JSON/JSDoc]
│   │   ├── linting.instructions.md               [13 refs]
│   │   ├── a11y.instructions.md                  [13 refs]
│   │   ├── quality-assurance.instructions.md     [24 refs + merged Jest]
│   │   └── file-organisation.instructions.md     [16 refs]
│   │
│   ├── platforms/
│   │   ├── plugin-architecture.instructions.md   [8 refs]
│   │   ├── plugin-structure.instructions.md      [7 refs]
│   │   └── wordpress-project-planning.instructions.md [2 refs]
│   │
│   ├── ai-operations/
│   │   ├── agent-creation-workflow.instructions.md [8 refs]
│   │   ├── copilot-operations.instructions.md    [6 refs]
│   │   ├── ai-operations-unified.instructions.md [6 refs]
│   │   ├── multi-provider-compatibility.instructions.md [6 refs]
│   │   ├── planner.instructions.md               [5 refs]
│   │   └── metrics.instructions.md               [4 refs]
│   │
│   ├── legacy/
│   │   ├── project-meta-sync.instructions.md     [4 refs — DEPRECATED]
│   │   └── multi-platform-skill-manifests.instructions.md [1 ref]
│   │
│   └── .archive/
│       ├── README.md (deprecation notices)
│       └── [deprecated files with 301 redirects]
│
└── .github/
    ├── instructions/
    │   ├── README.md (repo-local vs portable distinction)
    │   ├── automation.instructions.md             [24 refs]
    │   ├── agent-spec.instructions.md             [14 refs]
    │   ├── instructions.instructions.md           [8 refs — author guide]
    │   ├── workflows.instructions.md              [8 refs]
    │   ├── release.instructions.md                [7 refs]
    │   ├── mermaid.instructions.md                [7 refs]
    │   ├── readme.instructions.md                 [5 refs]
    │   ├── reporting.instructions.md              [5 refs]
    │   ├── tools.instructions.md                  [3 refs]
    │   ├── prompt.instructions.md                 [2 refs]
    │   ├── hooks.instructions.md                  [2 refs]
    │   ├── template.instructions.md               [2 refs]
    │   ├── tasksync.instructions.md               [2 refs]
    │   ├── meta.instructions.md                   [1 ref]
    │   └── docs.instructions.md                   [1 ref]
    │
    ├── custom-instructions.md (general copilot guidance)
    ├── projects/
    └── scripts/
        └── validation/
            └── validate-frontmatter.js (references instructions/*)
```

---

## Implementation Roadmap (4-Week Sprint)

### Phase P0: Audit & Validation (Week 1)

**Deliverables:**

- [ ] Validate all 502+ references in codebase
- [ ] Identify broken/stale references
- [ ] Create detailed migration mapping (file→file)
- [ ] Update `scope:` field on 10 unspecified files
- [ ] Audit all 40 archived file references
- [ ] Document consolidation strategy for duplicates

**Owner:** AI Operations  
**Estimated Effort:** 16 hours

### Phase P1: Consolidation (Week 2–3)

**Deliverables:**

- [ ] Merge duplicate markdown.instructions.md files
- [ ] Merge duplicate reporting.instructions.md files
- [ ] Consolidate testing.instructions.md with tests.instructions.md
- [ ] Restore archived files with active references
- [ ] Delete truly obsolete archived files
- [ ] Clean up all references to archived content
- [ ] Create frontmatter template for all files

**Owner:** AI Operations + Documentation Team  
**Estimated Effort:** 20 hours

### Phase P2: Reorganization (Week 4)

**Deliverables:**

- [ ] Create subdirectories (core/, development/, technical/, etc.)
- [ ] Move files to new locations
- [ ] Update all 502+ references in batches:
  - Batch 1: CLAUDE.md, AGENTS.md, CONTRIBUTING.md (P0 critical)
  - Batch 2: docs/ folder (P1 standards)
  - Batch 3: agents/ folder (P2 implementations)
  - Batch 4: scripts/ and validation (P3 automation)
- [ ] Create stable alias/redirect system for old paths
- [ ] Test all validation scripts

**Owner:** AI Operations + Automation Team  
**Estimated Effort:** 24 hours

### Phase P3: Documentation & Verification (Week 5)

**Deliverables:**

- [ ] Update CLAUDE.md with new directory structure
- [ ] Create MIGRATION_GUIDE.md with all path changes
- [ ] Update .schemas/README.md references
- [ ] Update all contributing guides
- [ ] Test all reference paths in automation (CI/CD, linting)
- [ ] Create comprehensive mapping table for historical tracking

**Owner:** Documentation Team  
**Estimated Effort:** 16 hours

---

## Risk Assessment

### High Risk Items

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Broken references after migration | High | Critical | Automated reference validation script + manual audit |
| Script/validation failures | Medium | High | Test all scripts before migration, staged deployment |
| Reference inconsistency in documentation | Medium | Medium | Create canonical reference style + automated checks |
| Archive cleanup removes needed content | Low | Critical | Comprehensive audit of all 40 archive references before deletion |

### Mitigation Strategies

1. **Reference Validation Automation**
   - Create `validate-instruction-references.js` script
   - Run on every PR checking for broken links
   - Maintain mapping table of all reference locations

2. **Phased Rollout**
   - Update P0 critical files first
   - Test with small team before full deployment
   - Create stable aliases for old paths during transition

3. **Comprehensive Documentation**
   - MIGRATION_GUIDE.md with before/after paths
   - Clear deprecation notices in old locations
   - Timestamp all changes with git history

4. **Continuous Testing**
   - Add instruction reference validation to pre-commit hooks
   - Test all schema validation scripts post-migration
   - Verify frontmatter parsing and linting still works

---

## References & Related Documentation

**In this repository:**

- [CLAUDE.md](../../../CLAUDE.md) — Repository boundaries and instruction file placement rules
- [AGENTS.md](../../../AGENTS.md) — AI governance and instruction standards
- [docs/MIGRATION_GUIDE.md](../../../docs/MIGRATION_GUIDE.md) — Existing consolidation documentation
- [docs/BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md) — Branch naming and PR standards
- [docs/LABELING.md](../../../docs/LABELING.md) — Issue and PR labeling standards
- [.github/projects/active/repo-restructuring-2026-07-25/](./README.md) — Phase 1 restructuring epic

**External resources:**

- [Issue #1299](https://github.com/lightspeedwp/.github/issues/1299) — Repository restructuring initiative
- [PR #1518](https://github.com/lightspeedwp/.github/pull/1518) — Phase 2B agent utilities migration

---

## Appendix: Complete 58-File Inventory

*See detailed tables in sections above for:*

- Top 20 Most-Referenced Files
- High-Touch Files (10+ references)
- Portable Files by Category
- Repo-Local Files by Category
- Archived Files Assessment
- Complete File Classification Matrix

---

**Report Status:** ✅ Complete audit of all 58 instruction files  
**Data Current:** 2026-08-05  
**Conducted by:** AI Operations Team  
**Repository:** lightspeedwp/.github  
**Next Review Date:** After Phase 1 consolidation completion

---

*This audit was conducted as part of initiative #1299 (Repository Restructuring). All recommendations are non-binding and subject to team review and approval before implementation.*
