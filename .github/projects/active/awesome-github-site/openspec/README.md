---
file_type: documentation
title: "OpenSpec Proposal Guide - Awesome GitHub Site"
description: "Guide for turning the Awesome GitHub phase plans into `/opsx:propose` inputs."
version: "1.0.1"
created_date: "2026-06-03"
last_updated: "2026-06-03"
status: active
stability: stable
domain: governance
owners:
  - Ash Shaw
tags:
  - openspec
  - opsx
  - issues
  - website
---

# OpenSpec Proposal Guide

## Purpose

This folder exists to support the issue proposal workflow for the Awesome GitHub site.

Use it after the planning docs are approved and the phase split is locked.

The issue chain should capture the GitHub Pages setup steps explicitly:

1. Confirm custom subdomain and DNS target.
2. Document repository settings and publishing source.
3. Configure Astro publishing through GitHub Actions.
4. Add the custom `404` page.
5. Validate DNS, HTTPS, and routing.

## Expected Order

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

## Inputs

- `../phase-1/README.md`
- `../phase-2/README.md`
- `../ISSUE_EXECUTION_PLAN.md`
- `../ISSUE_REGISTER.md`
- `../briefs/mini-site-plan.md`
- `../briefs/page-copy-starter.md`

## Notes

- Keep phase 1 and phase 2 proposal files separate.
- Use the normalised briefs as the initial source for `/opsx:propose` or GitHub issue bodies.
- Update `./RUN_LOG.md` after each proposal run.
