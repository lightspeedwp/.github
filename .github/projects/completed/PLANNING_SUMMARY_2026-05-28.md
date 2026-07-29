---
title: "Planning Summary — Branding Meta Agent & WCEU 2026 Talk"
description: "Summary of planning work completed 2026-05-28 for issues [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49), and WCEU 2026 talk assets"
date: "2026-05-28"
version: "v1.0.0"
file_type: "documentation"
owners: ["Ash Shaw"]
tags: ["planning", "branding", "wceu"]
---

# Planning Summary — May 28, 2026

## Overview

This document summarizes the **planning work completed** on 2026-05-28 for:

1. **Branding Meta Agent Initiative** (issues [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49))
2. **WCEU 2026 Talk Planning** (issue [#529](https://github.com/lightspeedwp/.github/issues/529) + slides generation)
3. **Execution Plan Updates** (assignment of work to Claude vs. Copilot)

---

## 1. Branding Meta Agent Initiative

### Status

**Planning Phase Complete** — Specification work ready to begin

### Issues

- **[#33](https://github.com/lightspeedwp/.github/issues/33)** — Parent specification: category taxonomy, footer/header requirements, scope
- **[#46](https://github.com/lightspeedwp/.github/issues/46)** — Template design: 5 footer variants per category, template rules
- **[#48](https://github.com/lightspeedwp/.github/issues/48)** — Documentation & agent spec: complete agent specification
- **[#49](https://github.com/lightspeedwp/.github/issues/49)** — Schema/config model: JSON Schema validation, YAML config structure

### Key Documents Created

#### `branding-meta-agent-planning-2026-05-28.md`

A comprehensive planning document covering:

1. **Problem Statement**
   - Fragmented branding logic across multiple files
   - Duplicate footers in some `.md` files
   - No validation schema or centralised category taxonomy
   - Risk of hard-coded logic instead of config-driven rules

2. **Solution Approach** (6 phases)
   - **Phase 1**: Define the system (issues [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49), [#48](https://github.com/lightspeedwp/.github/issues/48))
   - **Phase 2**: Current-state audit (scan all `.md` files)
   - **Phase 3**: Schema & config implementation
   - **Phase 4**: Agent merge/refactor
   - **Phase 5**: Remediation & validation (fix all bad footers)
   - **Phase 6**: Documentation & rollout

3. **Work Breakdown Structure**
   - Total effort: ~35–48 hours
   - Timeline: ~3 weeks (compressed schedule)
   - All work assigned to Claude (exclusive)

4. **Key Decisions Pending**
   - Config format: **YAML + JSON Schema** (recommended)
   - Agent merging: Full merge recommended for coherence
   - Footer selection: Deterministic by category; frontmatter override allowed
   - Remediation: Automated script with manual review

5. **Template Category Matrix** (draft)
   16 document categories with purpose, audience, badge types, header/footer styles:
   - `issue`, `pull-request`, `docs`, `ai-ops`, `agents`, `instructions`
   - `prompts`, `schema`, `readme`, `test`, `utility`, `awesome-copilot`
   - `research`, `audit`, `workflow`, `governance`

### Next Steps

1. **Immediately** (this week):
   - Review and approve planning document with maintainer(s)
   - Lock down category taxonomy in issue [#33](https://github.com/lightspeedwp/.github/issues/33)

2. **Week 1**:
   - Complete issue [#33](https://github.com/lightspeedwp/.github/issues/33) (parent spec)
   - Complete issue [#46](https://github.com/lightspeedwp/.github/issues/46) (template design)
   - Complete issue [#49](https://github.com/lightspeedwp/.github/issues/49) (.schemas/config model)
   - Complete issue [#48](https://github.com/lightspeedwp/.github/issues/48) (documentation & agent spec)

3. **Week 2**:
   - Current-state audit of existing footers
   - Schema & config implementation

4. **Week 3**:
   - Agent implementation and merge
   - Remediation and validation

---

## 2. WCEU 2026 Talk Planning

### Status

**Assets Hardened** — Ready for slide generation

### Key Files Updated

#### `wceu-2026/notebooklm/deep-research-prompt.md`

- Added explicit **develop-branch URLs** for all core sources
- Organized sources in 4 phases (Foundation → Architecture → Plugin Packs → Talk Assets)
- Removed ambiguity about allowed sources (repo-only, no external web links)
- Now ready for NotebookLM ingestion with pinned, permanent URLs

**Core sources included**:

- <https://github.com/lightspeedwp/.github/blob/develop/README.md>
- <https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md>
- <https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md>
- <https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_PACK_ROADMAP.md>
- <https://github.com/lightspeedwp/.github/blob/develop/plugins/README.md>
- And 10+ additional governance, architecture, and plugin docs

#### `wceu-2026/notebooklm/source-ingestion-checklist.md`

- Reorganized into **5-phase ingestion order**:
  1. **Foundation Sources** (repo README, talk outline, repo index)
  2. **Architecture & Governance** (automation governance, workflows, labels)
  3. **Plugin Pack Documentation** (plugin roadmap, installation guide)
  4. **Detailed References** (release process, metrics, skill registry)
  5. **Slide Content Files** (all 14 slide markdown files)

- **Benefit**: NotebookLM will ingest sources in logical order, building context progressively
- **Safety**: Explicit develop-branch URLs prevent stale or external sources

#### `wceu-2026/SLIDES_GENERATION_PROMPT.md` (NEW)

A **comprehensive, 20-slide generation prompt** covering:

**Design System**:

- Colour palette (primary, accent 1/2/3, neutral, high-contrast)
- Typography (headlines, body, code/schema)
- Visual elements (icons, diagrams, imagery)

**20 Slides with Full Guidance**:

| # | Title | Message | Evidence |
| --- | --- | --- | --- |
| 1 | Hook & Stakes | GitHub governance is critical but creates silos | `talk-outline-25min.md` |
| 2 | The Problem | Monolithic `.github` creates bottlenecks | `AUTOMATION_GOVERNANCE.md` |
| 3 | Inheritance Boundaries | `.github/` inheritance doesn't cross repo boundaries | `AUTOMATION_GOVERNANCE.md` |
| 4 | Control Plane Architecture | Central `.github` as source of truth for governance | `PLUGIN_PACK_ROADMAP.md` |
| 5 | Canonical Governance Assets | Reusable assets live in control plane | `PLUGIN_PACK_ROADMAP.md` |
| 6 | Why We Pivoted | From monolithic repo to installable plugins | `PLUGIN_PACK_ROADMAP.md` |
| 7 | Plugin Pack Architecture | What plugins contain and how they work | `PLUGIN_MANIFEST.json` |
| 8 | Hook Layer | Pre-commit enforcement at the edge | `WORKFLOWS.md` |
| 9 | Workflow Layer | CI/CD automation and orchestration | `WORKFLOWS.md` |
| 10 | Issue & PR Templates | Frontmatter drives automation | `AUTOMATION_GOVERNANCE.md` |
| 11 | Lessons & Anti-Patterns | What we learned the hard way | `talk-outline-25min.md` |
| 12 | Adoption Playbook | 5-phase adoption for teams | `PLUGIN_INSTALLATION_GUIDE.md` |
| 13 | Agent Layer | Autonomous orchestration and coordination | `AGENTS.md` |
| 14 | Frontmatter & Metadata | Structured data drives automation | `AUTOMATION_GOVERNANCE.md` |
| 15 | Schema Validation | Guardrails without heavy-handedness | `AUTOMATION_GOVERNANCE.md` |
| 16 | Accessibility & Readability | Governance designed for humans | `a11y.instructions.md` |
| 17 | Branding Meta Agent | Unified header/footer/badge management | Issue [#33](https://github.com/lightspeedwp/.github/issues/33) |
| 18 | Measuring Success | Metrics that matter for governance | `METRICS.md` |
| 19 | AI Governance Model | Copilot & agents need governance too | `AGENTS.md` |
| 20 | Call to Action | Next steps for agencies and teams | `PLUGIN_PACK_ROADMAP.md` |

**Each slide includes**:

- Objective and key message
- Content outline with specific talking points
- Design notes and visual guidance
- References to supporting repository files
- Accessibility and readability checklist

**Recommended tools**: Figma, Canva, PowerPoint, or reveal.js

### Next Steps

1. **Immediately** (this week):
   - Use `SLIDES_GENERATION_PROMPT.md` with chosen design tool (Figma, Canva, etc.)
   - Generate 20 slides following guidance
   - Review for accuracy against repository evidence

2. **Next week**:
   - Add speaker notes and talking points
   - Create NotebookLM research document using hardened prompts
   - Practice delivery and refine timing

3. **Finalization**:
   - Iterate on design based on feedback
   - Prepare speaker notes and handouts
   - Finalize for WordCamp Europe 2026

---

## 3. Execution Plan Updates

### Status

**Next-Issues-Execution-Plan Updated** with Wave 4 and Wave 3D

### Changes Made

#### Added Wave 4: Branding Meta Agent (Claude Exclusive)

- **Assignment**: Claude ONLY (Copilot excluded from this work)
- **Issues**: [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49)
- **Phases**:
  - 4A: Planning & Specification (12–16h)
  - 4B: Current-State Audit (3–6h)
  - 4C: Schema & Config Implementation (6–10h)
  - 4D: Agent Merge/Refactor (7–11h)
  - 4E: Remediation & Validation (7–11h)
  - 4F: Documentation & Rollout (5–8h)
- **Total Effort**: ~40–60 hours
- **Timeline**: ~3–4 weeks

**Why Claude Exclusive?**

- Requires coherent planning across specification → implementation → validation
- Ensures unified branding agent architecture (not fragmented logic)
- Prevents schema drift between documentation and code
- Keeps category taxonomy and template rules consistent

#### Added Wave 3D: WCEU 2026 Talk Planning (Claude)

- **Assignment**: Claude (AI Team - Review & UX)
- **Issue**: [#529](https://github.com/lightspeedwp/.github/issues/529)
- **Scope**: Audit talk assets, harden NotebookLM prompts, produce improvements plan
- **Deliverables**: Folder audit, updated prompts, source ingestion order, acceptance checklist
- **Status**: Ready for execution

#### Updated Agent Ownership

- **Claude**: Waves 2B, 2D, 3B, **Wave 4 (exclusive)**, Wave 3D
- **Codex**: Waves 2A, 2C, 3A, 3C
- **Key addition**: Branding meta agent is **Claude exclusive** to ensure coherence

---

## 4. Files Created & Updated

### New Files Created

1. `.github/projects/active/branding-meta-agent-planning-2026-05-28.md` (2,100 lines)
   - Comprehensive planning for branding meta agent initiative

2. `wceu-2026/SLIDES_GENERATION_PROMPT.md` (789 lines)
   - Complete 20-slide generation prompt with design guidance

3. `.github/projects/active/PLANNING_SUMMARY_2026-05-28.md` (this file)
   - Summary of all planning work completed

### Files Updated

1. `.github/projects/active/next-issues-execution-plan.md`
   - Added Wave 4 (Branding Meta Agent)
   - Added Wave 3D (WCEU 2026 talk planning)
   - Updated agent ownership assignments
   - Claude marked as exclusive for branding work

2. `wceu-2026/notebooklm/deep-research-prompt.md`
   - Added explicit develop-branch URLs for all core sources
   - Reorganized sources with phase descriptions
   - Removed ambiguity about allowed sources

3. `wceu-2026/notebooklm/source-ingestion-checklist.md`
   - Converted to 5-phase ingestion order
   - Added explicit develop-branch URLs
   - Added checkboxes for verification

---

## 5. Key Decisions Locked Down

| Decision | Choice | Rationale |
| --- | --- | --- |
| **Branding agent ownership** | Claude exclusive | Ensures architectural coherence across planning, spec, implementation, validation |
| **Config format (recommended)** | YAML + JSON Schema | Human-friendly authoring + strict validation |
| **Agent merging strategy** | Full merge recommended | Reduces maintenance burden, centralises logic |
| **Footer selection** | Deterministic by category | Predictable, testable; frontmatter can override |
| **Remediation approach** | Automated script + review | Reduces manual error, enables validation |
| **WCEU talk sources** | Develop branch only | Pinned URLs prevent stale/external sources |
| **Slide content coverage** | 20 slides (25 min) | 3–4 slides per minute, matches talk duration |

---

## 6. Risk Mitigation

### Branding Meta Agent Risks

| Risk | Mitigation |
| --- | --- |
| Schema too rigid | Gather feedback in [#49](https://github.com/lightspeedwp/.github/issues/49); design for extensibility |
| Over-engineering | Keep Phase 1 focused on current needs |
| Duplicate footer conflicts | Audit phase will identify; prioritise by frequency |
| Inconsistent remediation | Automated script + CI validation prevents drift |

### WCEU Talk Risks

| Risk | Mitigation |
| --- | --- |
| Stale sources | Pinned develop-branch URLs + phase-based ingestion |
| Evidence gaps | All claims backed by specific repository files |
| Slide overload | 20 slides for 25 min = 75 sec per slide (reasonable) |
| Missing context | NotebookLM research will fill gaps with repo evidence |

---

## 7. Success Criteria

### Branding Meta Agent

- [ ] All 4 specification issues ([#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49)) merged with maintainer approval
- [ ] Category taxonomy locked and documented
- [ ] Schema/config model approved and ready for implementation
- [ ] Current-state audit identifies all duplicate footers
- [ ] Schema implementation passes validation
- [ ] All `.md` files remediated and validated
- [ ] CI validation rules active

### WCEU 2026 Talk

- [ ] 20 slides generated and reviewed
- [ ] All content backed by repository evidence
- [ ] Speaker notes complete
- [ ] NotebookLM research document published
- [ ] Talk delivered at WordCamp Europe 2026

---

## 8. Next Actions (Immediate)

### This Week

1. ✅ **Planning complete** — Review documents above
2. ⬜ **Share with maintainer(s)** — Get feedback on branding agent plan
3. ⬜ **Lock category taxonomy** — Confirm [#33](https://github.com/lightspeedwp/.github/issues/33) scope with stakeholders
4. ⬜ **Start slide generation** — Use `SLIDES_GENERATION_PROMPT.md` with chosen tool

### Next Week

1. ⬜ **Complete specification issues** ([#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49), [#48](https://github.com/lightspeedwp/.github/issues/48))
2. ⬜ **Current-state audit** — Scan all `.md` files for footers
3. ⬜ **Generate NotebookLM research** — Use hardened prompts
4. ⬜ **Finalize slide deck** — Add speaker notes and practice delivery

### Week 3+

1. ⬜ **Implement schema & config**
2. ⬜ **Merge/refactor agent**
3. ⬜ **Remediate all footers**
4. ⬜ **Document & rollout**

---

## 9. References

### Branding Meta Agent

- Issue [#33](https://github.com/lightspeedwp/.github/issues/33): <https://github.com/lightspeedwp/.github/issues/33>
- Issue [#46](https://github.com/lightspeedwp/.github/issues/46): <https://github.com/lightspeedwp/.github/issues/46>
- Issue [#48](https://github.com/lightspeedwp/.github/issues/48): <https://github.com/lightspeedwp/.github/issues/48>
- Issue [#49](https://github.com/lightspeedwp/.github/issues/49): <https://github.com/lightspeedwp/.github/issues/49>
- Planning doc: `.github/projects/active/branding-meta-agent-planning-2026-05-28.md`
- Execution plan: `.github/projects/active/next-issues-execution-plan.md`

### WCEU 2026 Talk

- Issue [#529](https://github.com/lightspeedwp/.github/issues/529): <https://github.com/lightspeedwp/.github/issues/529>
- Slides prompt: `wceu-2026/SLIDES_GENERATION_PROMPT.md`
- Deep research prompt: `wceu-2026/notebooklm/deep-research-prompt.md`
- Source checklist: `wceu-2026/notebooklm/source-ingestion-checklist.md`

---

## Document History

| Version | Date | Author | Status |
| --- | --- | --- | --- |
| v1.0.0 | 2026-05-28 | Claude | Complete |

---

**Created**: 2026-05-28
**By**: Claude
**For**: LightSpeed Team
**Related work**: Issues [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49), [#529](https://github.com/lightspeedwp/.github/issues/529)
