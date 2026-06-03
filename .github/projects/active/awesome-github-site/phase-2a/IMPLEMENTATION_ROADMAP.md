---
file_type: documentation
title: "Phase 2a Implementation Roadmap"
description: "Step-by-step execution plan for Phase 2a (Homepage & Navigation Redesign)"
version: "1.0.0"
created_date: "2026-06-03"
last_updated: "2026-06-03"
status: active
stability: stable
domain: governance
owners:
  - Claude
tags:
  - phase-2a
  - implementation
  - roadmap
---

# Phase 2a Implementation Roadmap

## Overview

Phase 2a transforms the MVP conference site into a discoverable platform foundation by fixing design debt and establishing clean navigation patterns for Phase 2b–2c catalogue expansion.

## Timeline

- **Week 1–2:** Navigation overhaul, homepage redesign, 404 fixes
- **Deliverable:** Stable, discoverable homepage with working navigation

## Work Breakdown

### 1. Header Navigation Overhaul

**Current state:** 3 sections (Talk, Resources, Site) with 8 total links. Basic dropdown structure.

**Issues identified:**

- Navigation lacks clear hierarchy for Phase 2 catalogue sections
- No dropdown for "Resources" section
- Subtitle positioning unclear in responsive view
- No breadcrumb support infrastructure

**Tasks:**

- [ ] Audit current nav sections against Phase 2 catalogue structure
- [ ] Design dropdown menu for Resources/Catalogues sections
- [ ] Implement responsive mobile menu toggle
- [ ] Add breadcrumb component foundation
- [ ] Update nav styling for clearer visual hierarchy
- [ ] Test keyboard navigation and accessibility

### 2. Homepage Redesign

**Current structure:**

- Hero section with eyebrow, title, lede
- CTA buttons (3x)
- Stats section (3 metrics)
- Site sections card grid (4 cards)
- "How the site grows" explainer

**Phase 2a goals:**

- Clarify the dual-purpose positioning (conference + platform)
- Introduce Phase 2 catalogues in the value statement
- Update stats to reflect Phase 2 growth
- Restructure cards to show both Phase 1 and Phase 2 content

**Tasks:**

- [ ] Update hero section with Phase 2 positioning
- [ ] Revise CTA buttons to include catalogue entry points
- [ ] Update stats block with Phase 2 scope
- [ ] Redesign site sections grid to introduce catalogues
- [ ] Add "What's coming" section preview
- [ ] Validate messaging against awesome-copilot reference site

### 3. 404 Error & Broken Links Audit

**Current known issues:**

- `/wceu-2026/` exists but may have stale references
- Missing catalogue routes (`/agents/`, `/instructions/`, `/skills/`, etc.) will 404
- Slide reference links may be broken

**Tasks:**

- [ ] Generate 404 audit report with `npm run build`
- [ ] Fix all broken internal links in pages
- [ ] Create placeholder pages for Phase 2 catalogue routes
- [ ] Add custom 404 page with navigation suggestions
- [ ] Document 404 prevention process for future pages

### 4. Logo & Visual Identity Strengthening

**Current state:** Brand mark + text logo in header

**Phase 2a goals:**

- Strengthen brand mark design (if needed)
- Improve logo spacing and sizing in header
- Ensure consistent branding across all pages

**Tasks:**

- [ ] Review current logo against modern design standards
- [ ] Refine logo mark (visual refinement)
- [ ] Update CSS sizing and spacing
- [ ] Test logo rendering across responsive breakpoints
- [ ] Ensure sufficient contrast in light/dark modes

### 5. Padding, Spacing & Layout Fixes

**Issues to address:**

- Inconsistent section padding across pages
- Card grid spacing alignment
- Hero section padding in mobile view
- Footer spacing and alignment

**Tasks:**

- [ ] Audit global spacing scale (define if missing)
- [ ] Create consistent spacing tokens (if not present)
- [ ] Fix section padding (hero, footer, main sections)
- [ ] Standardize card grid gaps
- [ ] Test responsive layout on mobile/tablet/desktop

## Success Criteria

- [ ] Header navigation is decluttered and clearly shows section hierarchy
- [ ] Homepage messaging aligns Phase 1 (conference) and Phase 2 (platform) purposes
- [ ] No 404 errors on existing routes
- [ ] Placeholder routes for Phase 2 catalogues are in place
- [ ] Logo is visually strengthened and properly spaced
- [ ] All padding/spacing is consistent and responsive
- [ ] Custom 404 page is deployed
- [ ] All pages pass WCAG 2.2 AA accessibility checks
- [ ] Site builds and deploys cleanly to GitHub Pages

## Implementation Order

1. Header navigation redesign (foundation for all pages)
2. 404 audit and placeholder routes (prevent broken experience)
3. Logo strengthening and visual polish (brand consistency)
4. Padding/spacing fixes (UX consistency)
5. Homepage redesign (primary entry point)
6. Full accessibility audit and fixes

## Blockers & Dependencies

- No external dependencies identified
- All work is contained in `website/src/` directory
- Existing Astro 5.11 and Svelte 5.56 setup is stable

## Next Phase Gate

Before proceeding to Phase 2b (Core Catalogues), ensure:

- [ ] Phase 2a branch is reviewed and merged to develop
- [ ] Website builds cleanly with no errors
- [ ] All pages are accessible (WCAG AA)
- [ ] Home and navigation properly position Phase 2b catalogues
