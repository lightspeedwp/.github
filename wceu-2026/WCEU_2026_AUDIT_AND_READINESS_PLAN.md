---
title: "WCEU 2026 Talk Asset Pack Audit & Readiness Plan"
description: "Comprehensive audit of wceu-2026 folder structure, content readiness, and NotebookLM hardening plan for WordCamp Europe 2026 talk preparation"
created_date: "2026-05-28"
file_type: documentation
---

# WCEU 2026 Talk Asset Pack Audit & Readiness Plan

## Executive Summary

The `wceu-2026/` folder contains foundational assets for the WordCamp Europe 2026 talk on evolving LightSpeed's `.github` governance repository into an installable AI-ops plugin platform. This audit assesses folder structure, content completeness, NotebookLM prompt hardening, and source policy enforcement.

**Current Status**: Partial readiness — core assets present, NotebookLM prompts require hardening with explicit develop-branch URLs and comprehensive source ingestion guidance.

**Key Findings**:

- ✅ Slide-generation prompt (789 lines, detailed guidance)
- ✅ Talk outline stub (outline structure defined)
- ✅ Source index reference documents
- ⚠️ NotebookLM deep-research-prompt: frontmatter only (6 lines) — needs comprehensive content + develop URLs
- ⚠️ NotebookLM source-ingestion-checklist: frontmatter only (6 lines) — needs detailed source approval policy + develop URLs

**Effort Estimate**: 3–4 hours for hardening NotebookLM prompts, audit documentation, and source policy codification.

**Unblocks**: Talk preparation workflow, NotebookLM analysis phase, slide deck generation.

---

## Section 1: Folder Structure Audit

### Current Inventory

```
wceu-2026/
├── README.md (10 lines — minimal context)
├── SLIDES_GENERATION_PROMPT.md (789 lines — comprehensive ✅)
├── talk-outline-25min.md (6 lines — stub only)
├── notebooklm/
│   ├── deep-research-prompt.md (6 lines — stub only)
│   └── source-ingestion-checklist.md (6 lines — stub only)
├── references/
│   ├── repo-source-index.md
│   └── slide-to-source-mapping.md
└── slides/
    └── slide-NN-*.md (20 slides, structure defined)
```

### Strengths

1. **SLIDES_GENERATION_PROMPT is comprehensive**: 789 lines with detailed design system, slide-by-slide guidance, WCAG AA requirements, colour palettes, typography, and layout specifications.

2. **Slide structure exists**: 20 individual slide files with consistent naming (`slide-NN-description.md`), enabling modular generation and updates.

3. **Source index and mapping**: `references/` folder has placeholder files for canonical source sets and slide-to-source mappings.

4. **Clear ownership and frontmatter**: All files include YAML frontmatter with title, description, owners, and last_updated fields.

---

### Risks & Gaps

| Gap | Impact | Priority | Effort |
| --- | --- | --- | --- |
| **NotebookLM prompts are stubs** | Cannot run NotebookLM analysis for talk research without explicit prompts and source URLs | **Critical** | 2–3 hours |
| **No source approval policy** | Risk of NotebookLM ingesting external/non-approved sources (e.g., external blogs, outdated wikis) | **High** | 1 hour |
| **Talk outline incomplete** | Speaker script and timing guidance missing for talk delivery | **High** | 2–3 hours |
| **No canonical source set documented** | Unclear which internal sources are authoritative for NotebookLM ingestion | **High** | 1 hour |
| **Slide-to-source mapping stub** | No explicit mapping of slide content to canonical internal sources | **Medium** | 1 hour |
| **README is minimal** | Low discoverability for new contributors or external reviewers | **Low** | 30 mins |

---

## Section 2: NotebookLM Hardening Plan

### Current State

Both NotebookLM-related files are **stubs with frontmatter only**:

- `wceu-2026/notebooklm/deep-research-prompt.md` (6 lines)
- `wceu-2026/notebooklm/source-ingestion-checklist.md` (6 lines)

### Objective

Harden these files with:

1. **Explicit develop-branch URLs** for all canonical internal sources
2. **Comprehensive NotebookLM prompt** guiding analysis direction and constraints
3. **Source approval policy** defining allowed (repo-only) and prohibited (external) sources
4. **Ingestion checklist** validating sources before feeding into NotebookLM
5. **Source prioritization** defining ingestion order (foundation → architecture → plugin-pack → talk-specific)

### Proposed Content: `deep-research-prompt.md`

**Purpose**: Guide NotebookLM to analyse the talk direction, architecture evolution, and business case using only approved internal sources.

**Key Sections**:

1. **Analysis Objectives** — What NotebookLM should research and synthesize
2. **Canonical Source Set** — Curated list of approved internal documents with explicit develop-branch URLs
3. **Source Ingestion Order** — Priority ordering for feeding sources to NotebookLM
4. **Constraints & Guardrails** — Explicitly prohibit external sources, set scope boundaries
5. **Output Expectations** — What analysis NotebookLM should produce (e.g., key insights, narrative arc, gaps)
6. **Acceptance Criteria** — Validation checklist for NotebookLM output quality

**Proposed URLs to Include**:

- Foundation & Governance:
  - `https://github.com/lightspeedwp/.github/blob/develop/README.md`
  - `https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md`
  - `https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md`

- Architecture & Design:
  - `https://github.com/lightspeedwp/.github/blob/develop/docs/ARCHITECTURE.md`
  - `https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md`
  - `https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_PACK_ROADMAP.md`

- Plugin Pack & Adoption:
  - `https://github.com/lightspeedwp/.github/blob/develop/plugins/README.md`
  - `https://github.com/lightspeedwp/.github/blob/develop/plugins/PLUGIN_MANIFEST.json`
  - `https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_INSTALLATION_GUIDE.md`

- Talk-Specific Assets:
  - `https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/talk-outline-25min.md`
  - `https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/SLIDES_GENERATION_PROMPT.md`
  - `https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/references/repo-source-index.md`

### Proposed Content: `source-ingestion-checklist.md`

**Purpose**: Validation checklist ensuring only approved internal sources are used in NotebookLM analysis.

**Key Sections**:

1. **Source Category Definitions** — What counts as "approved" (develop-branch repo files) vs. "prohibited" (external links, outdated wikis, social media)
2. **Source Checklist** — Per-source validation items (branch verification, last-updated freshness, domain validation)
3. **Policy Enforcement** — How to validate sources before feeding to NotebookLM
4. **Approval Workflow** — Process for adding new sources to canonical set
5. **Prohibited Sources List** — Explicit "do not use" categories (external blogs, archived wikis, unverified external tools)

---

## Section 3: Folder Readiness Assessment

### Per-Category Checklist

| Asset | Status | Notes | Next Action |
| --- | --- | --- | --- |
| **README.md** | ⚠️ Minimal | Placeholder only; needs brief overview + folder structure | Expand with folder map + quick-start |
| **SLIDES_GENERATION_PROMPT.md** | ✅ Complete | 789 lines, comprehensive | Ready for use |
| **talk-outline-25min.md** | ⚠️ Stub | Outline structure defined; content missing | Add speaker script + timing notes |
| **deep-research-prompt.md** | ⚠️ Stub | Frontmatter only; critical for NotebookLM | Harden with URLs + comprehensive prompt |
| **source-ingestion-checklist.md** | ⚠️ Stub | Frontmatter only; critical for source validation | Add checklist + approval policy |
| **references/repo-source-index.md** | ? Unknown | Inventory of canonical sources | Create with develop-branch URLs |
| **references/slide-to-source-mapping.md** | ? Unknown | Maps slides to supporting sources | Create after source-index.md |
| **slides/*.md** | ✅ Stubbed | 20 slide files present; structure defined | Content generation via SLIDES_GENERATION_PROMPT |

---

## Section 4: Implementation Roadmap

### Phase 1: NotebookLM Hardening (Critical) — Estimated 2–3 hours

1. **Write `deep-research-prompt.md`**:
   - Define analysis objectives for talk research
   - Curate canonical source list with develop-branch URLs
   - Establish source ingestion order
   - Document constraints and output expectations

2. **Write `source-ingestion-checklist.md`**:
   - Define source approval categories
   - Create per-source validation checklist
   - Document policy enforcement workflow
   - List prohibited sources explicitly

3. **Create `references/repo-source-index.md`**:
   - Canonical list of approved internal sources
   - All URLs use develop-branch (`/blob/develop/`)
   - Organized by category (governance, architecture, plugins, talk-specific)

4. **Validate URLs**:
   - Verify all develop-branch links are current
   - Check that resources exist and contain relevant content
   - Document any stale or missing references

### Phase 2: Talk Outline Completion (High) — Estimated 2–3 hours

1. **Complete `talk-outline-25min.md`**:
   - Add speaker script with key messages
   - Include timing per section (25 minutes total)
   - Reference slide numbers for transitions
   - Add speaker notes and talking points

2. **Create slide-to-source mapping**:
   - Document which canonical sources support each slide
   - Enable speaker to reference source material during Q&A

### Phase 3: Folder Polish (Low) — Estimated 1 hour

1. **Expand `README.md`**:
   - Add folder structure overview
   - Quick-start guide for NotebookLM workflow
   - Link to key assets (prompts, checklists, outlines)
   - Add contributor guidelines

---

## Section 5: Success Criteria & Acceptance

### Phase 1 Acceptance (NotebookLM Hardening)

- ✅ `deep-research-prompt.md` includes 10+ explicitly documented canonical sources with develop-branch URLs
- ✅ `source-ingestion-checklist.md` provides clear source validation policy with examples
- ✅ `references/repo-source-index.md` created with authoritative source list
- ✅ All develop-branch URLs are verified and current
- ✅ Source policy explicitly prohibits external sources and defines approval workflow
- ✅ NotebookLM team can run analysis using hardened prompts without ambiguity

### Phase 2 Acceptance (Talk Outline)

- ✅ `talk-outline-25min.md` includes speaker script with timing notes
- ✅ Slide-to-source mapping created in `references/slide-to-source-mapping.md`
- ✅ Outline ready for speaker practice and delivery

### Phase 3 Acceptance (Folder Polish)

- ✅ `README.md` expanded with folder structure and quick-start
- ✅ All files follow consistent frontmatter/formatting standards
- ✅ Folder ready for handoff to talk preparation team

---

## Section 6: Related Issues & Dependencies

**Parent Issue**: [#529](https://github.com/lightspeedwp/.github/issues/529) — Audit talk assets and harden NotebookLM prompts

**Related Issues**:

- [#533](https://github.com/lightspeedwp/.github/issues/533) — Slide deck generation workflow (depends on this audit)
- [#536](https://github.com/lightspeedwp/.github/issues/536) — README and Mermaid maintenance (can leverage slides-generation patterns)

**Cross-Repository Dependencies**:

- `lightspeedwp/wp-docs` — May contain reference documentation for WordPress context
- `lightspeedwp/[plugin-repos]` — Example plugin implementations for talk demonstration

---

## Section 7: Conclusion

The `wceu-2026/` folder has strong foundational structure with the SLIDES_GENERATION_PROMPT providing comprehensive design guidance. However, **critical gaps exist in NotebookLM prompt hardening and source policy enforcement**.

**Immediate Priority**: Harden `deep-research-prompt.md` and `source-ingestion-checklist.md` with explicit develop-branch URLs and comprehensive source validation policy. This unblocks the NotebookLM analysis phase and ensures talk research is grounded in authoritative internal sources.

**Timeline**: Phase 1 (NotebookLM hardening) should complete in 2–3 hours. Phases 2–3 (outline completion and folder polish) can proceed in parallel or as follow-up work.

**Next Action**: Proceed to write comprehensive NotebookLM prompts with develop-branch URLs per Section 4 roadmap.
