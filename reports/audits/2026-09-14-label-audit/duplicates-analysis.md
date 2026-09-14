# Label Consolidation Analysis

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->
**Date**: 2026-09-14
**Focus**: Identifying and ranking label consolidation opportunities

## Overview

This report identifies **73** potential label consolidation candidates ranked by consolidation impact. This analysis supports governance planning for label taxonomy simplification and reduction.

### Consolidation Summary

| Impact Level | Count | Action |
|--------------|-------|--------|
| HIGH | 0 | Immediate consolidation recommended |
| MEDIUM | 28 | Review for consolidation during next cycle |
| LOW | 45 | Low priority, consolidate if convenient |

## Consolidation Candidates (Ranked by Impact)

### Medium Impact Candidates

These labels show moderate similarity and represent consolidation opportunities:

| Label 1 | Label 2 | Similarity | Recommendation |
|---------|---------|------------|----------------|
| lang:js | lang:json | 0.875 | Consider consolidation |
| status:needs-design | status:needs-testing | 0.872 | Consider consolidation |
| meta:needs-changelog | meta:no-changelog | 0.865 | Consider consolidation |
| status:needs-design | status:needs-dev | 0.857 | Consider consolidation |
| status:needs-dev | status:needs-review | 0.857 | Consider consolidation |
| area:ci | area:ai | 0.857 | Consider consolidation |
| status:needs-qa | status:needs-audit | 0.848 | Consider consolidation |
| release:minor | release:major | 0.846 | Consider consolidation |
| status:needs-design | status:needs-design-review | 0.844 | Consider consolidation |
| status:needs-design-review | status:needs-review | 0.844 | Consider consolidation |

## Consolidation Strategy

### Approach

1. **Preserve Immutable Labels**: Type labels (type:*) cannot be changed
2. **Preserve Governance Protected**: Labels in governance policy must be maintained
3. **Consolidate Similar Labels**: Within same family, merge similar naming/purpose

### Example Consolidation Patterns

- Abbreviations: `type:documentation` → `type:docs`
- Variant spellings: Different naming conventions unified
- Overlapping purposes: Related labels merged

## Evidence

- Full duplicate analysis: `evidence/duplicates-analysis.json`
- Canonical labels: `evidence/canonical-labels.json`

---
Generated by Claude Code | Session: audit/github-label-audit

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
