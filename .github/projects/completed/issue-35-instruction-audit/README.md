---
title: "Issue [#35](https://github.com/lightspeedwp/.github/issues/35): Instruction File Audit & Scope Clarification — Summary"
description: "Audit findings for instruction files: organization-wide vs repo-local scope, overlapping guidance, and cross-linking improvements."
created_date: "2026-05-29"
file_type: documentation
---

# Issue [#35](https://github.com/lightspeedwp/.github/issues/35): Instruction File Audit & Scope Clarification — Summary

## Overview

This document summarizes the audit of instruction files across the LightSpeed `.github` repository (issue [#35](https://github.com/lightspeedwp/.github/issues/35)). The audit identified 36 instruction files, classified them by scope, and documented overlapping guidance and cross-linking opportunities.

**Status:** In Progress
**Branch:** `ai/audit-instruction-files-35`

---

## Audit Findings

### File Inventory

**Total instruction files:** 36
**Location:** `instructions/` (repository root level)

### Scope Classification

#### Organization-Wide Files (10)

These files are applicable to ALL LightSpeedWP projects and should be reusable across repositories:

1. **a11y.instructions.md** — WCAG 2.2 Level AA accessibility standards
2. **coding-standards.instructions.md** — Unified coding standards
3. **community-standards.instructions.md** — Community health and naming conventions
4. **documentation-formats.instructions.md** — Markdown, YAML, Mermaid standards
5. **issues.instructions.md** — Issue creation & labeling standards
6. **languages.instructions.md** — Language-specific coding standards (JS/TS, JSON, YAML, etc.)
7. **linting.instructions.md** — Linting rules and tool configurations
8. **plugin-structure.instructions.md** — WordPress plugin structure conventions
9. **pull-requests.instructions.md** — PR creation & labeling standards
10. **quality-assurance.instructions.md** — Testing and QA standards

**Action:** These files should have `scope: "organization-wide"` frontmatter field for discoverability.

#### Repo-Local Files (26)

These files are specific to this `.github` control-plane repository:

- agent-spec.instructions.md
- automation.instructions.md
- copilot-operations.instructions.md (stub - needs expansion)
- docs.instructions.md
- file-organisation.instructions.md (stub - needs expansion)
- hooks.instructions.md
- instructions.instructions.md
- labeling.instructions.md
- mermaid.instructions.md
- meta.instructions.md
- metrics.instructions.md
- multi-platform-skill-manifests.instructions.md
- planner.instructions.md
- project-meta-sync.instructions.md
- prompt.instructions.md
- readme.instructions.md
- release.instructions.md
- reporting.instructions.md
- self-explanatory-code-commenting.instructions.md
- spec-driven-workflow.instructions.md
- task-implementation.instructions.md
- tasksync.instructions.md
- template.instructions.md
- tools.instructions.md
- wordpress-project-planning.instructions.md
- workflows.instructions.md

**Action:** These files should have `scope: "repo-local"` frontmatter field.

---

## Completed Work

✅ **Expanded a11y.instructions.md** with comprehensive WCAG 2.2 AA guidance
✅ **Updated CLAUDE.md** with clarity on organization-wide vs repo-local files
✅ **Classified all 36 files** by scope and reusability
✅ **Created index/README** for instructions/ folder
✅ **Expanded stub files:** copilot-operations.instructions.md, file-organisation.instructions.md

---

## Remaining Work

### 1. Add Scope Markers to All Files

**Task:** Add frontmatter field to all 36 files:

- `scope: "organization-wide"` for org-wide files
- `scope: "repo-local"` for repo-local files

**Files:** All instruction files

**Note:** Requires careful frontmatter editing to avoid breaking YAML structure. Automated sed approach caused linting issues.

### 2. Add Cross-Linking to Related Files

**Task:** Add "See Also" or "Related Files" sections to overlapping files:

| Files | Overlap | Action |
| --- | --- | --- |
| documentation-formats.instructions.md (org-wide) | Markdown/documentation standards | Cross-link each file to the other |
| issues.instructions.md (org-wide) | GitHub workflows | Cross-link to pull-requests.instructions.md |
| pull-requests.instructions.md (org-wide) | GitHub workflows | Cross-link to issues.instructions.md |
| coding-standards.instructions.md (org-wide) | Code quality | Cross-link to linting.instructions.md, languages.instructions.md |
| linting.instructions.md (org-wide) | Language-specific linting | Cross-link to languages.instructions.md and coding-standards.instructions.md |

### 3. Fix Stub Files

**Task:** Expand brief/stub files with proper content:

| File | Status | Lines | Action |
| --- | --- | --- | --- |
| copilot-operations.instructions.md | ✅ Expanded | 25+ | Done |
| file-organisation.instructions.md | ✅ Expanded | 25+ | Done |
| prompt.instructions.md | Stub | 4 | Needs content |
| hooks.instructions.md | Stub | 4 | Needs content |
| labeling.instructions.md | Stub | 4 | Needs content |
| meta.instructions.md | Stub | 9 | Needs content |
| tools.instructions.md | Stub | 9 | Needs content |
| template.instructions.md | Stub | 10 | Needs content |
| readme.instructions.md | Stub | 10 | Needs content |
| mermaid.instructions.md | Partial | 10 | Needs expansion |

### 4. Verify Markdown Linting

**Task:** Ensure all files pass markdownlint-cli2 checks with consistent heading styles.

**Current Issue:** Some files use ATX-style headings (# heading) while linter expects Setext style (underlines). Consistency check needed.

---

## Benefits of This Audit

1. **Discoverability:** Organization-wide files marked with scope field make them discoverable for reuse across all repos
2. **Clarity:** Explicit scope markers distinguish portable assets from repo-specific governance
3. **Maintainability:** Cross-linking shows relationships between related files
4. **Completeness:** Expanded stub files provide complete guidance
5. **Consistency:** All files follow unified frontmatter and structure patterns

---

## CLAUDE.md Updates

The following changes were made to `CLAUDE.md`:

- **Line 25:** Clarified that `.github/instructions/` contains repo-local, control-plane-specific files
- **Lines 95-108:** Reorganized "Related Files" section into two categories:
  - Organization-wide instructions (reusable across all LightSpeedWP repos)
  - Repo-local instructions (specific to this .github control plane)

---

## Recommendation for Next Steps

1. **Commit Phase 1:** CLAUDE.md updates + a11y expansion + stub file expansions (✅ Done)
2. **Commit Phase 2:** Add scope markers to all 36 files with proper frontmatter validation
3. **Commit Phase 3:** Add cross-linking between related files
4. **Commit Phase 4:** Document migration complete with summary PR

---

## Related Issues

- Issue [#47](https://github.com/lightspeedwp/.github/issues/47) (Meta Agent) — Branding and metadata standardization
- Issue [#33](https://github.com/lightspeedwp/.github/issues/33) (Branding Agent) — Unified branding strategy
- Issue [#46](https://github.com/lightspeedwp/.github/issues/46) (Template Design) — Template standardization

---

*Audit completed: 2026-05-29*
*Branch: ai/audit-instruction-files-35*
