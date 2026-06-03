---
file_type: documentation
title: "Issue Execution Plan - Awesome GitHub Site"
description: "Ordered issue plan for the Awesome GitHub website, covering the phase 1 MVP and the phase 2 expansion."
version: "1.0.0"
created_date: "2026-06-03"
last_updated: "2026-06-03"
status: active
stability: stable
domain: website
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

- Value: gives the website a strict delivery sequence so the first release stays small and useful.
- Risks: phase 2 material leaking into phase 1, unclear page ownership, and copy drift away from the source briefs.
- Next step: lock the phase 1 issue chain, then hold phase 2 as the expansion path after the MVP is stable.

## Delivery Order

### Phase 1

1. Source audit and scope lock
2. Phase 1 information architecture and page map
3. Phase 1 copy normalisation from the briefing docs
4. MVP site scaffold and page build
5. Validation and launch readiness

### Phase 2

1. Full information architecture and content model
2. Layout and browsing system expansion
3. Content migration and page population
4. Search or discovery enhancements
5. Visual polish, accessibility pass, and full launch validation

## Suggested Issue Structure

### Phase 1

- Parent: `Awesome GitHub Site - Phase 1 MVP`
- Child 1: `Source audit and scope lock`
- Child 2: `Information architecture and page map`
- Child 3: `Copy normalisation and content model`
- Child 4: `MVP site scaffold and page build`
- Child 5: `Validation and launch readiness`

### Phase 2

- Parent: `Awesome GitHub Site - Phase 2 Full Website`
- Child 1: `Full information architecture and content model`
- Child 2: `Category browsing and layout system`
- Child 3: `Content population and resource structure`
- Child 4: `Discovery, search, and supporting guides`
- Child 5: `Accessibility, polish, and launch validation`

## OpenSpec Notes

- Use the phase split above when preparing `/opsx:propose` inputs.
- Keep proposal files phase-specific so phase 1 can ship without waiting for phase 2 detail.
- Treat the normalised briefs in `briefs/` as the source of truth for the first planning pass.

## Acceptance Criteria

- Phase 1 is bounded to 1-3 pages and can be launched independently.
- Phase 2 expands the MVP without replacing the phase 1 structure.
- The source briefs are aligned to repo documentation standards.
- The active-project tracker reflects the new workstream.
