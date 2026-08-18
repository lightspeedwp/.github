---
file_type: documentation
title: "Awesome GitHub Site - Phase 1"
description: "Phase 1 plan for the initial launchable version of the Awesome GitHub website."
version: "1.0.1"
created_date: "2026-06-03"
last_updated: "2026-06-03"
status: active
stability: stable
domain: governance
owners:
  - Ash Shaw
tags:
  - planning
  - phase-1
  - website
  - mvp
---

# Phase 1

## 3-Bullet Summary

- Value: ships a small but real site quickly so the project has a usable first outcome on GitHub Pages.
- Risks: overbuilding the information architecture, adding catalogue behaviour too early, and letting the page count expand beyond the MVP.
- Next step: define the 1-3 page shape, the Pages publishing path, and the custom domain before implementation starts.

## Scope

Phase 1 is intentionally narrow:

- Home
- Why this exists
- References or Sources
- GitHub Pages publishing setup
- DNS and HTTPS verification
- Custom `404` page

## Deliverables

- A compact site shell with top navigation and footer
- Clean, source-backed page copy
- Basic visual treatment that can be extended later
- A small validation checklist covering build and content consistency
- GitHub Actions publishing workflow for Astro
- Custom subdomain configuration for `github.lightspeedwp.agency`

## Acceptance Criteria

- The site can be built and served without phase 2 features.
- The core pages are complete and readable.
- The copy is aligned to the normalised briefing docs.
- The page structure is simple enough to extend in phase 2 without a rewrite.
- GitHub Pages is configured with a custom domain and HTTPS.
- A `404` page exists and is routed correctly on the published site.
