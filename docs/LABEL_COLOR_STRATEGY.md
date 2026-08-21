---
title: Label Color Strategy Specification
description: Comprehensive color strategy for the 150 canonical labels based on semantic meaning and workflow state
file_type: documentation
version: v1.1.3
created_date: '2026-05-31'
last_updated: '2026-08-21'
authors:
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
  - accessibility
  - wcag
domain: governance
stability: stable
---

# Label Color Strategy Specification

**Version**: v1.1.2
**Created**: 2026-05-31
**Updated**: 2026-06-19
**Owner**: LightSpeed Team
**Status**: Active

---

## Executive Summary

This document defines a comprehensive color strategy for the 150 canonical labels in the LightSpeed `.github` repository. The strategy organises labels into semantic families with consistent color assignments, improving visual navigation, workflow clarity, and maintainability of the label taxonomy.

**Key Improvements**:

- Reduces color fragmentation (31 unique colors → 8 primary families)
- Establishes clear semantic associations between color and label purpose
- Provides explicit assignment rules for new labels
- Ensures full WCAG 2.2 AA accessibility compliance (≥ 4.5:1 contrast ratio)
- Creates a maintainable, scalable foundation for label expansion

---

## 1. Color Families & Semantic Mapping

### 1.1 Primary Color Families (8 Families)

| Family | Hex Codes | Semantic Meaning | Label Categories | Count |
| --- | --- | --- | --- | --- |
| **Green (Ready/Done)** | `#1A7F37`, `#2A7A3B`, `#ABEBC6` | Positive completion, resolution, readiness | status:done, status:ready, type:enhancement (✓merged), design:approved | 18 |
| **Blue (Planning/Review)** | `#0969DA`, `#3467D3`, `#C5DEF5` | Discussion, collaboration, needs input | type:documentation, type:discussion, status:needs-review, area:ci, lang:* | 53 |
| **Yellow (Testing/Audit)** | `#D29922`, `#F2D06D`, `#FCE2B7` | Validation, testing, audit workflows | status:needs-testing, type:bug (when testing), type:audit | 24 |
| **Red (Blocked/Impediment)** | `#CF222E`, `#B91C1C`, `#FCE2E2` | Blockers, duplicates, critical issues | status:blocked, status:duplicate, priority:critical, type:security | 18 |
| **Orange (On-Hold/Deferred)** | `#9A6700`, `#D5A87B`, `#FDBF7C` | Delayed, deferred, rejected, wontfix | status:wontfix, status:on-hold, type:epic (when deferred), priority:minor | 16 |
| **Purple (Design Workflows)** | `#8957E5`, `#B4A7E8`, `#D89AF6` | Design, UX, accessibility | type:design, type:ui, type:a11y, design:* | 14 |
| **Gray (Meta/Infrastructure)** | `#57606A`, `#B1BAC4`, `#D0D7DE` | Process, meta, automation, infrastructure | meta:*, type:chore, domain:* | 11 |
| **Teal (Integration/External)** | `#007580`, `#0D7F6F`, `#9FE1E3` | External systems, integrations, dependencies | area:integration, area:external, type:dependency, platform:* | 16 |

**Total Coverage**: 150 labels across 8 families

---

## 2. Detailed Family Specifications

### 2.1 Green Family: Ready & Done (Positive Completion)

**Purpose**: Signal positive completion, readiness for next phase, or approved state

**Hex Codes** (in order of preference):

- `#1A7F37` — Primary (dark green, WCAG AA compliant — 5.3:1 against white)
- `#2A7A3B` — Secondary (deep forest green for standard labels)
- `#ABEBC6` — Tertiary (light mint — GitHub label background only, use with black text)

**Assignment Rules**:

- All `status:done*` labels → `#1A7F37`
- All `status:ready*` labels → `#1A7F37`
- Approved/accepted labels (design:approved, reviewed:accepted) → `#1A7F37`
- Enhancement/feature labels when merged → `#2A7A3B`

**Label Examples**:

- status:done (merged)
- status:ready-for-review
- status:ready-for-merge
- design:approved
- reviewed:approved

**Accessibility**: Primary and secondary meet WCAG AA (≥ 4.5:1) against white. Tertiary (`#ABEBC6`) is a GitHub label background colour — use black text only; do not use as a foreground text colour on white.

---

### 2.2 Blue Family: Planning & Review (Collaborative Input)

**Purpose**: Indicate discussion, planning, code review, or work awaiting input

**Hex Codes** (in order of preference):

- `#0969DA` — Primary (strong, readable blue — 5.1:1 against white)
- `#3467D3` — Secondary (slightly lighter, softer tone — 5.3:1 against white)
- `#C5DEF5` — Tertiary (very light blue — GitHub label background only, use with black text)

**Assignment Rules**:

- All `status:needs-*` labels → `#0969DA`
- All `type:documentation` labels → `#3467D3`
- All `type:discussion` labels → `#3467D3`
- All `lang:*` (language) labels → `#C5DEF5`
- All `area:ci` labels → `#C5DEF5` (Blue tertiary — CI is a planning/infrastructure workflow)
- Code review related (needs-review, awaiting-feedback) → `#0969DA`
- Discussion/question labels → `#3467D3`

**Label Examples**:

- status:needs-review
- status:needs-feedback
- type:discussion
- type:documentation
- area:ci
- lang:php
- lang:javascript

**Accessibility**: Primary and secondary meet WCAG AA against white. Tertiary (`#C5DEF5`) is a GitHub label background colour — use black text only.

---

### 2.3 Yellow Family: Testing & Audit (Validation States)

**Purpose**: Signal validation workflows, testing phases, and audit activities

**Hex Codes** (in order of preference):

- `#D29922` — Primary (gold — GitHub label background only; black text gives 8.3:1 ✓)
- `#F2D06D` — Secondary (light yellow — GitHub label background only, use with black text)
- `#FCE2B7` — Tertiary (pale amber — GitHub label background only, use with black text)

**Assignment Rules**:

- All `status:testing*` labels → `#D29922`
- All `type:audit*` labels → `#D29922`
- Performance/testing related → `#F2D06D`
- QA/validation labels → `#FCE2B7`

**Label Examples**:

- status:testing
- type:audit
- type:performance
- priority:normal (when used for testing triage)

**Accessibility**: All yellow family colours are GitHub label backgrounds — auto-selected black text provides ≥ 8:1 contrast. Do not use these colours as foreground text on white backgrounds.

---

### 2.4 Red Family: Blocked & Impediments (Critical Issues)

**Purpose**: Highlight blockers, duplicates, critical bugs, and impediments to progress

**Hex Codes** (in order of preference):

- `#CF222E` — Primary (dark danger red — 5.3:1 against white)
- `#B91C1C` — Secondary (deep crimson — 6.4:1 against white)
- `#FCE2E2` — Tertiary (very light red — GitHub label background only, use with black text)

**Assignment Rules**:

- All `status:blocked*` labels → `#CF222E`
- All `status:duplicate` labels → `#CF222E`
- All `priority:critical` labels → `#CF222E`
- All `type:security*` labels → `#CF222E`
- Bug labels with critical impact → `#B91C1C`

**Label Examples**:

- status:blocked
- status:duplicate
- priority:critical
- type:security
- type:bug (critical variants)

**Accessibility**: Primary and secondary meet WCAG AA against white. Tertiary is GitHub label background only.

---

### 2.5 Orange Family: On-Hold & Deferred (Delayed/Rejected)

**Purpose**: Indicate deferred decisions, rejected features, or items on hold

**Hex Codes** (in order of preference):

- `#9A6700` — Primary (dark amber — 5.0:1 against white)
- `#D5A87B` — Secondary (muted amber — GitHub label background only, use with black text)
- `#FDBF7C` — Tertiary (light orange — GitHub label background only, use with black text)

**Assignment Rules**:

- All `status:wontfix` labels → `#9A6700`
- All `status:on-hold*` labels → `#9A6700`
- Deferred/postponed items → `#FDBF7C`
- Epic/larger-scope labels when on hold → `#D5A87B`

**Label Examples**:

- status:wontfix
- status:on-hold
- status:postponed

**Accessibility**: Primary (`#9A6700`) meets WCAG AA against white. Secondary and tertiary are GitHub label backgrounds with black text only.

---

### 2.6 Purple Family: Design Workflows (UX/Design)

**Purpose**: Identify design, UX, accessibility, and user-experience-focused work

**Hex Codes** (in order of preference):

- `#8957E5` — Primary (vibrant purple — 4.6:1 against white)
- `#B4A7E8` — Secondary (lighter purple — GitHub label background only, use with black text)
- `#D89AF6` — Tertiary (soft purple — GitHub label background only, use with black text)

**Assignment Rules**:

- All `type:design*` labels → `#8957E5`
- All `type:ui` labels → `#8957E5`
- All `type:accessibility*` labels → `#8957E5`
- All `design:*` state labels → `#B4A7E8`
- UX-related, user feedback → `#D89AF6`

**Label Examples**:

- type:design
- type:ui
- type:accessibility
- design:approved
- design:pending-review

**Accessibility**: Primary meets WCAG AA against white. Secondary and tertiary are GitHub label backgrounds with auto-selected black text.

---

### 2.7 Gray Family: Meta & Infrastructure (Process)

**Purpose**: Mark infrastructure, meta-workflow, automation, and process-related items

**Hex Codes** (in order of preference):

- `#57606A` — Primary (dark gray — 6.4:1 against white)
- `#B1BAC4` — Secondary (medium gray — GitHub label background only, use with black text)
- `#D0D7DE` — Tertiary (light gray — GitHub label background only, use with black text)

**Assignment Rules**:

- All `meta:*` labels → `#57606A`
- All `area:ci` labels → `#C5DEF5` (Blue tertiary — CI is in the Blue family)
- All `type:chore` labels → `#57606A`
- Domain/organisation labels → `#B1BAC4`
- Infrastructure/automation supporting labels → `#D0D7DE`

**Label Examples**:

- meta:needs-changelog
- meta:stale
- type:chore
- area:maintenance

**Accessibility**: Primary meets WCAG AAA against white. Secondary and tertiary are GitHub label backgrounds with black text.

---

### 2.8 Teal Family: Integration & External (Dependencies)

**Purpose**: Indicate external dependencies, integrations, and platform-specific work

**Hex Codes** (in order of preference):

- `#007580` — Primary (deep teal — 5.6:1 against white)
- `#0D7F6F` — Secondary (forest teal — 4.9:1 against white)
- `#9FE1E3` — Tertiary (light teal — GitHub label background only, use with black text)

**Assignment Rules**:

- All `area:integration*` labels → `#007580`
- All `area:external*` labels → `#007580`
- All `type:dependency*` labels → `#007580`
- Platform/vendor-specific labels → `#0D7F6F`
- External system coordination → `#9FE1E3`

**Label Examples**:

- area:integration
- area:external
- type:dependency
- platform:github
- platform:github-actions

**Accessibility**: Primary and secondary meet WCAG AA against white. Tertiary is GitHub label background only.

---

## 3. Label Assignment Rules & Examples

### 3.1 Multi-Category Labels

Some labels span multiple categories. Use these rules when a label fits multiple families:

| Scenario | Resolution | Example |
| --- | --- | --- |
| Bug found during testing | Use Yellow (testing context takes precedence) | type:bug + status:testing → Yellow |
| Documentation needs review | Use Blue (review/discussion takes precedence) | type:documentation + status:needs-review → Blue |
| Security vulnerability | Use Red (urgency/severity takes precedence) | type:security + type:bug → Red |
| Accessibility issue | Use Purple (type takes precedence over urgency) | type:a11y + priority:critical → Purple |

### 3.2 Creating New Labels

When creating new labels, follow this hierarchy:

1. **Determine primary purpose** (type, status, area, etc.)
2. **Map to appropriate family** using Table 1 (Section 1.1)
3. **Choose hex code** based on emphasis level:
   - Primary color (first in family) — for high-visibility labels (WCAG AA compliant)
   - Secondary color (second) — for standard labels
   - Tertiary color (third) — GitHub label backgrounds only (do not use as text on white)
4. **Verify contrast** against light and dark backgrounds
5. **Document** the rationale in label frontmatter

---

## 4. Migration Path (Canonical Config Files)

### 4.1 Phase 1: Documentation & Strategy (Completed)

- ✅ This specification document (v1.1.0)
- ✅ WCAG 2.2 AA accessibility audit and color remediation
- ✅ Provides explicit color assignment rules
- ✅ Establishes semantic color families

### 4.2 Phase 2: Update labels.yml (Issue #683)

- ✅ Reassign all 150 labels to new color families
- ✅ Replace WCAG AA non-compliant colors
- Add comments documenting family assignment

### 4.3 Phase 3: Validate & Document (Issue #685)

- Update LABELING.md with visual reference
- Create label colour palette reference
- Document best practices for label selection

---

## 5. Accessibility & Contrast Standards

All **primary and secondary** colors in this strategy meet **WCAG 2.2 AA** requirements (minimum 4.5:1 ratio) against white backgrounds. Tertiary colours are designated GitHub label backgrounds only and rely on GitHub's auto-selected black text for accessibility.

### 5.1 Primary Color Contrast Verification (vs. white #FFFFFF)

| Color | Hex | Contrast Ratio | WCAG Level | Status |
| --- | --- | --- | --- | --- |
| `#1A7F37` (Green primary) | #1A7F37 | 5.3:1 | ✅ AA | ✅ Compliant |
| `#0969DA` (Blue primary) | #0969DA | 5.1:1 | ✅ AA | ✅ Compliant |
| `#D29922` (Yellow primary) | #D29922 | Label bg only* | ✅ Label use | ✅ Black text 8.3:1 |
| `#CF222E` (Red primary) | #CF222E | 5.3:1 | ✅ AA | ✅ Compliant |
| `#9A6700` (Orange primary) | #9A6700 | 5.0:1 | ✅ AA | ✅ Compliant |
| `#8957E5` (Purple primary) | #8957E5 | 4.6:1 | ✅ AA | ✅ Compliant |
| `#57606A` (Gray primary) | #57606A | 6.4:1 | ✅ AAA | ✅ Compliant |
| `#007580` (Teal primary) | #007580 | 5.6:1 | ✅ AA | ✅ Compliant |

*Yellow primary is used exclusively as a GitHub label background colour. GitHub auto-selects black text (8.3:1 contrast ✓). Do not use `#D29922` as foreground text on white.

### 5.2 Secondary & Tertiary Color Guidance

**Secondary colors** (dark variants):

- `#2A7A3B` (Green) 4.75:1 ✓, `#3467D3` (Blue) 5.3:1 ✓, `#B91C1C` (Red) 6.4:1 ✓, `#0D7F6F` (Teal) 4.9:1 ✓

**Tertiary colors** (light pastels) — **GitHub label backgrounds only**:

- Use exclusively as label chip backgrounds; GitHub auto-selects black text for all light colours
- Do NOT use as foreground text colours on white backgrounds
- Examples: `#ABEBC6`, `#C5DEF5`, `#FCE2B7`, `#FCE2E2`, `#FDBF7C`, `#D89AF6`, `#D0D7DE`, `#9FE1E3`

---

## 6. Visual Palette Reference

```
Green Family (Ready/Done):
████ #1A7F37  ████ #2A7A3B  ████ #ABEBC6

Blue Family (Planning/Review):
████ #0969DA  ████ #3467D3  ████ #C5DEF5

Yellow Family (Testing/Audit):
████ #D29922  ████ #F2D06D  ████ #FCE2B7

Red Family (Blocked/Impediment):
████ #CF222E  ████ #B91C1C  ████ #FCE2E2

Orange Family (On-Hold/Deferred):
████ #9A6700  ████ #D5A87B  ████ #FDBF7C

Purple Family (Design):
████ #8957E5  ████ #B4A7E8  ████ #D89AF6

Gray Family (Meta/Infrastructure):
████ #57606A  ████ #B1BAC4  ████ #D0D7DE

Teal Family (Integration/External):
████ #007580  ████ #0D7F6F  ████ #9FE1E3
```

---

## 7. Implementation Checklist

- [x] Define color families and semantic mapping
- [x] Document assignment rules and rationale
- [x] WCAG 2.2 AA accessibility audit and color remediation
- [x] Create visual palette reference
- [x] Update labels.yml with colour assignments (Issue #683)
- [ ] Update LABELING.md with strategy reference (Issue #685)
- [ ] Create label selection guidance for contributors

---

## 8. Maintenance & Evolution

### 8.1 Adding New Colours

New colors should only be added if:

1. A new semantic family is needed (not existing 8 families)
2. Current families cannot accommodate the label
3. All new primary/secondary colors must meet WCAG AA (≥ 4.5:1 against white)
4. Owner team approves the addition

### 8.2 Deprecating Colours

Deprecated colours (not in this spec) will be gradually migrated to this strategy through:

1. Issue #683: Reassignment of existing labels
2. Gradual phase-out in new label creation
3. Documentation of old→new mapping for auditability

### 8.3 Review Cycle

This specification should be reviewed annually or when:

- New label categories are introduced
- Accessibility standards change
- GitHub's colour palette capabilities expand
- User feedback indicates confusion

---

## 9. Related Documentation

- [LABELING.md](./LABELING.md) — Comprehensive labeling guide
- [ISSUE_FIELDS.md](./ISSUE_FIELDS.md) — Issue field mapping
- `.github/labels.yml` — Canonical label configuration
- Issue #650: Wave 5.2 Audit (parent)
- Issue #683: Type Mapping Reconciliation (dependent)
- Issue #685: Supporting Documentation Updates (dependent)

---

## 10. Changelog

| Date | Change | Author |
| --- | --- | --- |
| 2026-06-19 | v1.1.2 — Correct Blue and Gray label family count totals: Blue 52→53, Gray 12→11 (Gemini review follow-up #994) | LightSpeed Team |
| 2026-06-18 | v1.1.1 — Correct `area:ci` classification: moved from Gray family to Blue family in Table 1 and Section 2.2; removed from Gray family label examples in Section 2.7 (Gemini review follow-up #992) | LightSpeed Team |
| 2026-06-18 | v1.1.0 — WCAG 2.2 AA audit: replace 7 non-compliant primary/secondary colors; add tertiary guidance; update accessibility table | LightSpeed Team |
| 2026-05-31 | v1.0.0 — Initial specification: 8 color families, 150 label mapping | LightSpeed Team |

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
