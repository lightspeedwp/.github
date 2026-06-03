---
file_type: documentation
title: "Issue Execution Plan - Awesome GitHub Site"
description: "Ordered issue plan for the Awesome GitHub website, covering the phase 1 MVP and the phase 2 expansion."
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
  - issues
  - website
  - opsx
---

# Issue Execution Plan

## 3-Bullet Summary

- Value: gives the website a strict delivery sequence so the public conference site stays useful, accessible, and deployable on GitHub Pages.
- Risks: phase 2 material leaking into phase 1, unclear page ownership, and copy drift away from the source and slide briefs.
- Next step: finish the WCEU content expansion pass first, then keep phase 2 as the broader resource-site path after the conference site is stable.

## Delivery Order

### Phase 1

1. GitHub Pages domain and DNS audit
2. Hosting runbook and repository settings alignment
3. Astro GitHub Actions publishing workflow
4. Conference talk page, slide index, and slide subpages
5. Accessibility guidance and references sweep for the full `wceu-2026` tree
6. Light/dark mode switcher and reusable shell polish
7. Validation and launch readiness

### Phase 2

#### Phase 2a: Homepage & Navigation Redesign (Weeks 1–2)

1. Fix cluttered header navigation
2. Redesign homepage structure (hero → value → sections → CTA)
3. Audit and resolve all 404 errors and broken links
4. Strengthen logo and visual identity
5. Fix padding, spacing, and design inconsistencies

#### Phase 2b: Core Resource Catalogues (Weeks 3–4)

1. Create `/agents/`, `/instructions/`, `/skills/`, `/hooks/` section pages
2. Implement consistent card-based hub layouts
3. Add filtering and tagging support
4. Build detail page patterns for each resource type

#### Phase 2c: Extended Catalogues (Weeks 5–6)

1. Create `/plugins/`, `/workflows/`, `/tools/`, `/learning-hub/`, `/getting-started/`
2. Ensure metadata consistency across all 9 sections
3. Implement discovery flows (filtering, search-like browsing)
4. Complete content population for all sections

#### Phase 2d: Validation & Launch (Week 7)

1. Full WCAG AA accessibility audit across all pages
2. Document content governance model and maintenance rules
3. Mobile responsiveness and performance validation
4. Final launch readiness review and sign-off

## Suggested Issue Structure

### Phase 1

- Parent: `Awesome GitHub Site - Phase 1 MVP and GitHub Pages Launch` (`#756`)
- Child 1: `Research GitHub Pages, custom subdomain, and HTTPS setup` (`#757`)
- Child 2: `Document the GitHub Pages publishing and DNS runbook` (`#758`)
- Child 3: `Configure Astro GitHub Pages publishing workflow` (`#759`)
- Child 4: `Build phase 1 pages and custom 404` (`#760`)
- Child 5: `Validate build, DNS, HTTPS, and routing` (`#761`)
- Follow-up task: expand the public site with WCEU talk subpages, slide references, and the theme switcher before re-opening phase 2 work.

### Phase 2

- Parent: `Awesome GitHub Site - Phase 2 Full Website` (`#762`)
- Child 1: `Add resource catalogue and category browsing` (`#763`)
- Child 2: `Improve discovery, navigation, and search` (`#764`)
- Child 3: `Document the full content model and governance` (`#765`)
- Child 4: `Accessibility and launch validation for the full site` (`#766`)

## OpenSpec Notes

- Use the phase split above when preparing `/opsx:propose` inputs or issue bodies.
- Keep proposal files phase-specific so phase 1 can ship without waiting for phase 2 detail.
- Treat the normalised briefs in `briefs/` as the source of truth for the first planning pass, then add Pages/DNS details in the issue bodies.
- Treat `wceu-2026/` as an audit target for accessibility, source references, slide-specific content, and talk-page navigation before adding new public routes.
- The full scan now feeds the public WCEU talk page, the slide index, and the slide subpages, so slide-by-slide references should stay aligned as new copy lands.

## Acceptance Criteria

- Phase 1 is bounded to 1-3 pages and can be launched independently.
- The public conference section now includes the talk page, slide index, and one page per slide.
- Phase 2 expands the MVP without replacing the phase 1 structure.
- The source briefs are aligned to repo documentation standards.
- The active-project tracker reflects the new workstream.
- The issue chain records the GitHub Pages setup steps, including custom domain, HTTPS, and `404` handling.
- The issue register captures the created GitHub issue URLs.
