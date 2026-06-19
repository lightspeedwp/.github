---
file_type: documentation
title: "Awesome GitHub Site - Phase 2"
description: "Phase 2 plan for expanding the Awesome GitHub website into the full resource-style site."
version: "1.0.2"
created_date: "2026-06-03"
last_updated: "2026-06-03"
status: active
stability: stable
domain: governance
owners:
  - Ash Shaw
tags:
  - planning
  - phase-2
  - website
  - expansion
---

# Phase 2

## 3-Bullet Summary

- **Value:** Transforms the MVP into a comprehensive team onboarding and resource discovery platform ("One .GitHub to Rule Them All"), modelled on awesome-copilot.github.io with nine resource catalogue sections.
- **Risks:** Design debt from Phase 1 (cluttered navigation, broken links, weak logo); missing content governance can lead to inconsistency; discovery friction without proper filtering/search.
- **Next step:** Execute Phase 2a (homepage/navigation redesign) first to stabilise UX, then build catalogue structure in phases 2b–2c, complete with accessibility audit and content governance in phase 2d.

## Vision

Create a unified discovery and reference hub for LightSpeed's AI operations ecosystem—where teams can understand, onboard to, and effectively use agents, instructions, skills, hooks, plugins, workflows, tools, and learning resources.

## Scope

Phase 2 expands the MVP into a complete resource catalogue site:

- **9 section pages** — /agents/, /instructions/, /skills/, /hooks/, /plugins/, /workflows/, /tools/, /learning-hub/, /getting-started/
- **Redesigned homepage** — clearer structure, stronger visual hierarchy, improved navigation
- **Fixed navigation** — decluttered header, organised section menu, breadcrumb support
- **Fixed design issues** — resolve 404s, broken slides, padding inconsistencies, strengthen logo
- **Discovery flows** — filtering, tagging, search-like browsing across all sections
- **Content governance** — unified metadata model, contribution rules, maintenance cycle
- **Accessibility hardening** — WCAG AA compliance across all new pages and features
- **Footer preservation** — existing footer design remains unchanged

## Deliverables by Sub-Phase

### Phase 2a: Homepage & Navigation Redesign (Weeks 1–2)

- Homepage redesign (hero → value → sections → CTA)
- Header navigation overhaul with section dropdown
- Fix all 404 errors and broken links
- Logo refresh with stronger iconography
- Padding and spacing fixes across all pages
- **Output:** Stable, discoverable homepage with working navigation

### Phase 2b: Core Resource Catalogues (Weeks 3–4)

- Create `/agents/` hub and detail pages
- Create `/instructions/` hub and detail pages
- Create `/skills/` hub and detail pages
- Create `/hooks/` hub and detail pages
- Implement filtering and tagging on all hubs
- **Output:** Four fully functional resource catalogues

### Phase 2c: Extended Catalogues (Weeks 5–6)

- Create `/plugins/` hub and detail pages
- Create `/workflows/` hub and detail pages
- Create `/tools/` hub and detail pages
- Create `/learning-hub/` hub and detail pages
- Create `/getting-started/` onboarding guide
- Ensure consistency across all nine sections
- **Output:** Complete catalogue with all nine sections live

### Phase 2d: Validation & Launch (Week 7)

- Full WCAG AA accessibility audit
- Content governance documentation
- Mobile responsiveness testing
- Performance and link validation
- Final launch review and sign-off
- **Output:** Launch-ready site with all issues resolved

## Acceptance Criteria

- [ ] All 9 section pages are created and deployed
- [ ] Homepage is restructured with clearer information architecture
- [ ] Header navigation is decluttered and shows all sections
- [ ] All 404 errors and broken links are resolved
- [ ] Design refinements (padding, logo, spacing) are complete
- [ ] Content governance model is documented
- [ ] Site meets WCAG AA accessibility standards across all new pages
- [ ] Footer remains unchanged per design specification
- [ ] The phase 2 structure builds on the phase 1 MVP without replacing it
- [ ] Resource pages follow a consistent content model
- [ ] Navigation supports browsing by category, tag, and intent
- [ ] Phase 2 ships on the same GitHub Pages host and HTTPS configuration from phase 1
