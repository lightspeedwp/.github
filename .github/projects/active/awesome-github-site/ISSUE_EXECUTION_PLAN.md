---
file_type: documentation
title: "Issue Execution Plan - Awesome GitHub Site"
description: "Ordered issue plan for the Awesome GitHub website, covering the phase 1 MVP and the phase 2 expansion."
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
  - issues
  - website
  - opsx
---

# Issue Execution Plan

## 3-Bullet Summary

- Value: gives the website a strict delivery sequence so the first release stays small, useful, and deployable on GitHub Pages.
- Risks: phase 2 material leaking into phase 1, unclear page ownership, and copy drift away from the source briefs.
- Next step: lock the phase 1 Pages setup chain, then hold phase 2 as the expansion path after the MVP is stable.

## Delivery Order

### Phase 1

1. GitHub Pages domain and DNS audit
2. Hosting runbook and repository settings alignment
3. Astro GitHub Actions publishing workflow
4. MVP site scaffold, pages, and custom `404`
5. Validation and launch readiness

### Phase 2

1. Full information architecture and content model
2. Resource catalogue and category browsing
3. Search, discovery, and navigation refinement
4. Accessibility, content, and metadata expansion
5. Visual polish and full launch validation

## Suggested Issue Structure

### Phase 1

- Parent: `Awesome GitHub Site - Phase 1 MVP and GitHub Pages Launch` (`#756`)
- Child 1: `Research GitHub Pages, custom subdomain, and HTTPS setup` (`#757`)
- Child 2: `Document the GitHub Pages publishing and DNS runbook` (`#758`)
- Child 3: `Configure Astro GitHub Pages publishing workflow` (`#759`)
- Child 4: `Build phase 1 pages and custom 404` (`#760`)
- Child 5: `Validate build, DNS, HTTPS, and routing` (`#761`)

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

## Acceptance Criteria

- Phase 1 is bounded to 1-3 pages and can be launched independently.
- Phase 2 expands the MVP without replacing the phase 1 structure.
- The source briefs are aligned to repo documentation standards.
- The active-project tracker reflects the new workstream.
- The issue chain records the GitHub Pages setup steps, including custom domain, HTTPS, and `404` handling.
- The issue register captures the created GitHub issue URLs.
