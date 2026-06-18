---
title: Label Color Strategy Specification
description: Accessible colour strategy for the canonical label set in .github/labels.yml
file_type: documentation
version: v1.1.0
created_date: '2026-05-31'
last_updated: '2026-06-18'
authors:
  - Claude Code
  - LightSpeed Team
maintainer: LightSpeed Team
owners:
  - lightspeedwp/maintainers
license: GPL-3.0
tags:
  - labels
  - color-strategy
  - governance
  - canonical-config
domain: governance
stability: stable
---

# Label Color Strategy Specification

**Version**: v1.1.0
**Created**: 2026-05-31
**Owner**: LightSpeed Team
**Status**: Active
**Coverage**: 158 canonical labels

## Executive Summary

This document defines the accessible colour palette used by the canonical label set in [`.github/labels.yml`](../.github/labels.yml). The palette is intentionally small so that workflow meaning stays consistent, automation stays predictable, and the repo remains WCAG 2.2 AA compliant.

Wave 5.2 remediation is complete. The colour audit identified the old palette as too fragmented and too light in several places; the live config now uses an AA-compliant palette and the supporting docs have been updated to match.

## 1. Canonical Palette

The current label set uses eight accessible colour families:

| Family | Hex | Typical Use |
| --- | --- | --- |
| Blue | `#0F448A` | Planning, review, general work, structural labels |
| Green | `#1D7232` | Ready, done, feature, release, live state |
| Yellow | `#7E6007` | QA, testing, audit, validation, performance |
| Red | `#810E18` | Blockers, bugs, security, critical risk |
| Orange | `#883D07` | On-hold, hotfix, compatibility, cautionary work |
| Purple | `#4D1A93` | Design, accessibility, clarification, feedback |
| Gray | `#4E575F` | Meta, maintenance, hygiene, stale/housekeeping |
| Teal | `#147169` | Infrastructure, automation, integration, external systems |

## 2. Assignment Rules

1. Keep one primary colour family per label family.
2. Use the same family for related labels so the taxonomy is easy to scan.
3. Prefer the canonical palette above when creating or updating labels.
4. Do not introduce ad hoc colours for one-off labels unless a new governance decision is logged.
5. If a new family is genuinely required, document the rationale and add it through the normal label governance flow.

### 2.1 Family Guidance

- `status:*` labels use Blue, Green, Yellow, Red, Orange, Purple, or Gray depending on lifecycle state.
- `priority:*` labels use Red, Orange, Blue, and Gray for descending urgency.
- `type:*` labels use the family that best matches the work category and review flow.
- `area:*`, `comp:*`, `lang:*`, `env:*`, `compat:*`, `cpt:*`, `ai-ops:*`, `contrib:*`, and `discussion:*` follow the same canonical palette so the colour system remains readable at scale.

## 3. Accessibility

All colours currently assigned in `.github/labels.yml` meet WCAG 2.2 AA contrast against white backgrounds.

- Colour is never the only workflow signal.
- Labels are always paired with descriptive text and automation context.
- The palette is built from dark enough tones to remain readable in GitHub's label chips.

## 4. Migration Status

- [x] Update `labels.yml` with colour assignments (Issue #683)
- [x] Update supporting documentation (Issue #685)
- [x] Close out the Wave 5.2 colour audit note and remediation tracking (PR #686)

## 5. Related Documentation

- [`docs/LABEL_STRATEGY.md`](./LABEL_STRATEGY.md)
- [`docs/LABEL_INVENTORY.md`](./LABEL_INVENTORY.md)
- [`docs/LABELING.md`](./LABELING.md)
- [`.github/labels.yml`](../.github/labels.yml)
- Issue #650: Wave 5.2 Audit (parent)
- Issue #683: Type Mapping Reconciliation (dependent)
- Issue #685: Supporting Documentation Updates (dependent)

## 6. Changelog

| Date | Change | Author |
| --- | --- | --- |
| 2026-06-18 | Replaced the stale palette with the current WCAG AA-safe canonical palette and marked Wave 5.2 remediation complete | LightSpeed Team |
| 2026-05-31 | Initial specification v1.0.0 | Claude Code |

**Document Status**: ✅ Active
**Last Updated**: 2026-06-18
**Owner**: LightSpeed Team
