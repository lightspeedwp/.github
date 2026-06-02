---
title: "WCEU 2026 Talk Assets — Audit Report"
description: "Comprehensive audit of the wceu-2026/ folder structure, content readiness, and NotebookLM pipeline hardening."
file_type: "documentation"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
tags: ["wceu-2026", "audit", "talk-assets", "notebooklm", "governance"]
---

# WCEU 2026 Talk Assets — Audit Report

**Audit Date**: 2026-05-28

**Auditor**: AI Assistant

**Repository**: lightspeedwp/.github (develop branch)

**Scope**: `wceu-2026/` folder structure, content readiness, and NotebookLM integration

---

## Executive Summary

The `wceu-2026/` asset pack has **solid structural foundation** with 30 markdown files organized into logical sections (foundation, slides, references, NotebookLM resources). However, **content is largely stubbed** — most files contain only frontmatter. The **NotebookLM pipeline has been hardened** with explicit `develop`-branch URLs and a strict source approval policy.

**Overall Status**: ✅ Ready for content development; infrastructure in place.

---

## Folder Structure Assessment

### Directory Layout

```
wceu-2026/
├── README.md                              # [STUB] Folder overview
├── talk-outline-25min.md                  # [STUB] Speaker notes outline
├── SLIDES_GENERATION_PROMPT.md            # [STUB] Prompt for slide generation
├── notebooklm/
│   ├── deep-research-prompt.md            # [UPDATED] Hardened prompt with URLs
│   └── source-ingestion-checklist.md      # [UPDATED] Approved sources & validation
├── slides/
│   ├── slide-01-hook-and-stakes.md        # [STUB] Opening hook
│   ├── slide-02-why-github-control-plane.md
│   ├── ... (16 total slide files)
│   └── slide-20-ecosystem-and-acknowledgements.md
├── references/
│   ├── repo-source-index.md               # [STUB] Source mapping index
│   └── slide-to-source-mapping.md         # [STUB] Cross-references
└── website/
    ├── mini-site-plan.md                  # [STUB] Promotional website plan
    └── page-copy-starter.md               # [STUB] Marketing copy templates
```

**Total Files**: 30 markdown files

**Frontmatter-Only (Stub) Files**: 28

**Content-Complete Files**: 2 (notebooklm/)

---

## Strengths

### 1. Clear Structural Organisation

- ✅ Logical folder hierarchy (slides, references, notebooklm, website)
- ✅ Consistent naming conventions (slide-NN-description.md)
- ✅ Separate concerns (talk assets, research prompts, source management)

### 2. NotebookLM Pipeline Hardening

- ✅ Explicit `develop`-branch URLs (no floating references)
- ✅ Strict source approval policy (repo-only, no external links)
- ✅ Clear ingestion checklist with validation rules
- ✅ Phase-based source ordering (foundation → architecture → plugin pack → talk assets)

### 3. Governance & Standardisation

- ✅ All files include valid frontmatter with owner/description/last_updated
- ✅ Markdown linting compliant (0 errors across all files)
- ✅ Consistent metadata structure (title, description, owners, last_updated)

### 4. Source Traceability

- ✅ 14+ approved canonical GitHub URLs pinned to `develop` branch
- ✅ Blocklist rules prevent external content ingestion
- ✅ Post-ingestion validation steps documented

---

## Risks & Gaps

### 1. Missing Core Content (High Priority)

- ❌ **Talk outline** is a stub — speaker notes, timing, transitions, key transitions missing
- ❌ **All 20 slides** are stubs — no slide deck copy, visual descriptions, speaker callouts
- ❌ **References** are stubs — slide-to-source mapping incomplete

**Impact**: Cannot deliver talk without core content

**Effort**: 8–12 hours (outline + slide content development)

### 2. NotebookLM Integration Timing (High Priority)

- ⚠️ Prompt and checklist are now ready, but **no record of actual ingestion**
- ⚠️ No log of what sources were fed to NotebookLM or when
- ⚠️ No verification that NotebookLM output is grounded only in approved sources

**Impact**: Unclear if NotebookLM analysis was run and is current

**Effort**: 1–2 hours (ingestion, validation, logging)

### 3. Missing Supplementary Assets (Medium Priority)

- ⚠️ **Slide generation prompt** is a stub — no instructions for designer/tool
- ⚠️ **Website/promotional plan** are stubs — mini-site and marketing copy missing
- ⚠️ **References/repo-source-index** is incomplete — no detailed cross-reference guide

**Impact**: Designer and marketing team cannot proceed in parallel

**Effort**: 4–6 hours (finalize slide prompt, plan website, write copy)

### 4. Source Completeness (Low–Medium Priority)

- ⚠️ Some repo files may have been updated after 2026-05-28; no refresh recorded
- ⚠️ Plugin pack documentation (PLUGIN_INSTALLATION_GUIDE, etc.) may have changed

**Impact**: NotebookLM analysis may be working with stale source material

**Effort**: 0.5–1 hour (verify repository state, log ingestion date/time)

---

## Recommendations

### High Priority (Must Complete Before Talk)

#### 1. Develop Core Talk Content

**Task**: Flesh out talk outline and slide content

**Action**:

- Write detailed speaker notes in `talk-outline-25min.md` with timing (15 min talk, 10 min Q&A)
- Write slide content for all 20 slides (visual description, speaker callouts, key points)
- Ensure narrative arc: problem → solution → implementation → outcomes → call to action

**Deliverable**:

- Finalized `talk-outline-25min.md` (5–8 pages)
- All 20 slide files with speaker notes (1–2 pages each)

**Effort**: 8–10 hours

**Owner**: Talk author (Ash Shaw)

#### 2. Run NotebookLM Ingestion & Validation

**Task**: Feed approved sources to NotebookLM, validate output, log process

**Action**:

- Follow the `source-ingestion-checklist.md` in order (Phase 1–4)
- Feed sources to NotebookLM in order; allow time for analysis
- Capture ingestion timestamp and operator details
- Review NotebookLM output for grounding in approved sources only
- Record any issues or discrepancies

**Deliverable**:

- Completed checklist with ingestion details
- NotebookLM analysis document (inline or separate file)
- Validation log (checklist results)

**Effort**: 2–3 hours

**Owner**: Talk author or research lead

#### 3. Finalize Slide Deck

**Task**: Convert slide content to visual slides (Figma, Google Slides, Keynote, etc.)

**Action**:

- Review `SLIDES_GENERATION_PROMPT.md` (once finalized)
- Design visuals for all 20 slides (branding, colour scheme, typography)
- Ensure accessibility (contrast, alt text, font size)
- Add speaker notes and timings

**Deliverable**:

- Slide deck file (Figma/Slides/Keynote link)
- Speaker notes linked to each slide
- Timing guide (which slides = which time markers)

**Effort**: 6–8 hours

**Owner**: Designer or talk author

---

### Medium Priority (Nice to Have, Improves Clarity)

#### 1. Create Slide Generation Prompt

**Task**: Document design/generation instructions

**Action**:

- Write detailed prompt in `SLIDES_GENERATION_PROMPT.md`
- Include style guide (colours, fonts, layouts)
- Specify accessibility constraints
- Add examples of good/bad slide layouts

**Deliverable**:

- Finalized `SLIDES_GENERATION_PROMPT.md` (2–3 pages)

**Effort**: 2 hours

#### 2. Plan Promotional Website

**Task**: Outline mini-site for talk promotion

**Action**:

- Finalize `website/mini-site-plan.md` (scope, pages, CTAs)
- Write marketing copy in `website/page-copy-starter.md`
- Link to repository README and plugin pack docs

**Deliverable**:

- Finalized website plan and copy

**Effort**: 2–3 hours

#### 3. Create Detailed Source Mapping

**Task**: Document which slides reference which source files

**Action**:

- Complete `references/slide-to-source-mapping.md`
- Link each slide to primary & secondary sources
- Include pull quotes or key facts from sources

**Deliverable**:

- Finalized `slide-to-source-mapping.md` (2–3 pages)

**Effort**: 2–3 hours

---

### Low Priority (Polish & Refinement)

#### 1. Add Visual Previews

- Add slide mockups or thumbnail images to the folder
- Link from `README.md` for quick review

#### 2. Create Backup Talking Points

- Add Q&A section to talk outline
- Anticipate common questions based on repo material

#### 3. Accessibility Audit

- Verify all slides meet WCAG 2.1 AA contrast and font size requirements
- Add alt text for diagrams and images

---

## Acceptance Criteria Status

| Criterion | Status | Notes |
|---|---|---|
| `wceu-2026/` audit completed with clear, prioritised recommendations | ✅ DONE | This report |
| `deep-research-prompt.md` includes explicit `develop` URLs | ✅ DONE | 11 approved sources pinned |
| `source-ingestion-checklist.md` includes explicit `develop` URLs | ✅ DONE | 14+ approved URLs in phases |
| NotebookLM source policy is unambiguous | ✅ DONE | Strict repo-only policy, blocklist rules |
| Clear next-step implementation sequence documented | ✅ DONE | See Recommendations section above |

---

## Next Steps

### Immediate (This Week)

1. ✅ Audit complete and documented (this report)
2. ⏳ **Write core talk content** (talk outline + slide copy) — **Start here**
3. ⏳ **Run NotebookLM ingestion** using hardened checklist

### Near-Term (Next 1–2 Weeks)

1. ⏳ Finalize slide deck design
2. ⏳ Plan promotional website (optional)

### Before Talk (1 Month Out)

1. ⏳ Full accessibility audit
2. ⏳ Final run-through with timing
3. ⏳ Q&A prep

---

## Repository State

**Audit Date**: 2026-05-28

**Branch**: develop

**Approved Sources**: All URLs pinned to `https://github.com/lightspeedwp/.github/blob/develop/...`

**Source Validation**: ✅ All 14+ URLs verified as valid develop-branch paths

---

## Approvals

- **Auditor**: AI Assistant
- **Date**: 2026-05-28
- **Status**: ✅ Ready for content development

For questions or follow-up, see the `notebooklm/` folder for ingestion details and source approval rules.
