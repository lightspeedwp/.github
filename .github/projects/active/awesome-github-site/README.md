---
file_type: documentation
title: "Awesome GitHub Site"
description: "Active project plan for the Awesome GitHub website, split into a launchable phase 1 MVP and a fuller phase 2 site."
version: "1.0.3"
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

- Value: turns the reference material into a conference-ready GitHub Pages site with a browsable WCEU 2026 talk section, then expands it into the fuller catalogue-style experience.
- Risks: phase creep, the `wceu-2026` tree mixing planning and public content, and a phase 2 structure that gets pulled into phase 1 too early.
- Next step: keep scanning the whole `wceu-2026` tree into page-by-page talk content, slide references, and accessibility guidance, then keep the Pages/DNS plan as the source of truth.

## Overview

`Awesome GitHub` is the working name for a GitHub-led website inspired by the structure and content discipline of `awesome-copilot`.

The delivery is intentionally split:

1. Phase 1 ships the conference-facing public site with the WCEU talk, slide index, slide subpages, and references.
2. Phase 2 expands that site into the full resource-style experience.

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

Expand the site into the full experience:

- resource catalogue pages
- category browsing
- richer navigation
- supporting guides and discovery flows
- accessibility and launch polish for the full site

## References

- [Phase 1 plan](phase-1/README.md)
- [Phase 2 plan](phase-2/README.md)
- [Issue execution plan](ISSUE_EXECUTION_PLAN.md)
- [Issue register](ISSUE_REGISTER.md)
- [Run log](RUN_LOG.md)
- [OpenSpec guide](openspec/README.md)
- [Mini site brief](briefs/mini-site-plan.md)
- [Page copy brief](briefs/page-copy-starter.md)
