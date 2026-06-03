---
file_type: documentation
title: "Awesome GitHub Site"
description: "Active project plan for the Awesome GitHub website, split into a launchable phase 1 MVP and a fuller phase 2 site."
version: "1.0.4"
created_date: "2026-06-03"
last_updated: "2026-06-03"
status: active
stability: stable
domain: governance
owners:
  - Ash Shaw
tags:
  - planning
  - website
  - github
  - opsx
  - open-spec
---

# Awesome GitHub Site

## 3-Bullet Summary

- **Value:** Phase 1 (WCEU conference site) ✓ complete and live. Phase 2 transforms it into a team onboarding and resource discovery platform with 9 catalogues (agents, instructions, skills, hooks, plugins, workflows, tools, learning-hub, getting-started).
- **Risks:** Inheriting Phase 1 design debt (cluttered navigation, 404s, weak logo); content governance missing until Phase 2d; large scope requires strict sub-phase sequencing.
- **Next step:** Execute Phase 2a (homepage/navigation redesign and debt fixes), validate before proceeding to Phase 2b–2c (catalogue sections).

## Overview

`Awesome GitHub` is a GitHub-led resource discovery platform inspired by `awesome-copilot`, serving as "One .GitHub to Rule Them All" for LightSpeed's AI operations ecosystem.

The delivery is split into two phases:

1. **Phase 1** ✓ Complete — Conference-facing site with WCEU 2026 talk, slides, references, and GitHub Pages setup.
2. **Phase 2** (in progress) — Full resource catalogue platform with 9 sections, improved UX, and team onboarding support.

## Project Inputs

- Reference site: `awesome-copilot`
- Source repository for reference structure: `github/awesome-copilot/website`
- Source briefs:
  - `briefs/mini-site-plan.md`
  - `briefs/page-copy-starter.md`

## Project Outputs

- Phase 1 planning and issue sequence
- Phase 2 expansion planning and issue sequence
- Normalised source briefs aligned to repo conventions
- Execution tracker updates in `next-issues-execution-plan.md`
- GitHub Pages hosting plan with DNS and HTTPS steps
- WCEU 2026 talk page, slide index, and per-slide content pages
- Accessibility guidance derived from the full `wceu-2026` audit and reference material
- Light/dark mode switcher in the shared shell

## Hosting Model

- Canonical public URL: `github.lightspeedwp.agency`
- GitHub Pages target domain underneath: `lightspeedwp.github.io`
- Publishing source: GitHub Actions
- Site generator: Astro
- Required Pages features: custom domain, HTTPS, and a branded `404` page
- Not in scope: Jekyll, submodules, or branch-based Pages publishing

## Phase Split

### Phase 1

Build the conference-facing version of the site:

- Home
- Why this exists
- WCEU 2026 talk page
- WCEU 2026 slides index
- WCEU 2026 slide subpages
- full `wceu-2026` tree scan for accessibility, references, and slide content
- References or Sources
- GitHub Pages setup and DNS verification
- HTTPS enablement after certificate issuance
- Custom `404` page for missing routes
- Light and dark mode switcher in the shared shell
- Accessibility guidance surfaced from the slide and audit folders

### Phase 2

Transform the site into a comprehensive team onboarding and resource discovery platform:

#### Phase 2a: Homepage & Navigation Redesign (Weeks 1–2)

- Redesign homepage (hero → value → sections → CTA)
- Fix cluttered header navigation with section dropdown menu
- Resolve all 404 errors and broken links
- Strengthen logo with appropriate iconography
- Fix padding, spacing, and visual inconsistencies

#### Phase 2b: Core Resource Catalogues (Weeks 3–4)

- `/agents/` — AI agents and capabilities
- `/instructions/` — Role and behaviour documents
- `/skills/` — Reusable automation tasks
- `/hooks/` — Pre-commit and workflow guardrails

#### Phase 2c: Extended Catalogues (Weeks 5–6)

- `/plugins/` — WordPress and development plugins
- `/workflows/` — Portable agentic workflows
- `/tools/` — Supporting utilities and helpers
- `/learning-hub/` — Educational content
- `/getting-started/` — Team onboarding guide

#### Phase 2d: Validation & Launch (Week 7)

- Full WCAG AA accessibility audit and fixes
- Content governance documentation and validation
- Mobile responsiveness testing across all sections
- Final launch readiness review

## References

- [Phase 1 plan](phase-1/README.md)
- [Phase 2 plan](phase-2/README.md)
- [Issue execution plan](ISSUE_EXECUTION_PLAN.md)
- [Issue register](ISSUE_REGISTER.md)
- [Run log](RUN_LOG.md)
- [OpenSpec guide](openspec/README.md)
- [Mini site brief](briefs/mini-site-plan.md)
- [Page copy brief](briefs/page-copy-starter.md)
