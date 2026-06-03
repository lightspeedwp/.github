---
file_type: documentation
title: "Awesome GitHub Site"
description: "Active project plan for the Awesome GitHub website, split into a launchable phase 1 MVP and a fuller phase 2 site."
version: "1.0.1"
created_date: "2026-06-03"
last_updated: "2026-06-03"
status: active
stability: stable
domain: website
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

- Value: turns the reference material into a small, shippable GitHub Pages site first, then expands it into the fuller catalogue-style experience.
- Risks: phase creep, copy that stays too talk-specific, and a phase 2 structure that gets pulled into phase 1 too early.
- Next step: run the phase 1 issue chain first, using the normalised briefs in `briefs/` and the Pages/DNS plan below as the source of truth.

## Overview

`Awesome GitHub` is the working name for a GitHub-led website inspired by the structure and content discipline of `awesome-copilot`.

The delivery is intentionally split:

1. Phase 1 ships a compact 1-3 page MVP.
2. Phase 2 expands that MVP into the full resource-style site.

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

## Hosting Model

- Canonical public URL: `github.lightspeedwp.agency`
- GitHub Pages target domain underneath: `lightspeedwp.github.io`
- Publishing source: GitHub Actions
- Site generator: Astro
- Required Pages features: custom domain, HTTPS, and a branded `404` page
- Not in scope: Jekyll, submodules, or branch-based Pages publishing

## Phase Split

### Phase 1

Build the smallest useful version of the site:

- Home
- Why this exists
- References or Sources
- GitHub Pages setup and DNS verification
- HTTPS enablement after certificate issuance
- Custom `404` page for missing routes

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
