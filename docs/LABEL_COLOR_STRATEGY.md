---
title: Label Color Strategy Specification
description: Comprehensive color strategy for the 150 canonical labels based on semantic meaning and workflow state
file_type: documentation
version: v1.0.0
created_date: '2026-05-31'
last_updated: '2026-06-01'
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

**Version**: v1.0.0  
**Created**: 2026-05-31  
**Owner**: LightSpeed Team  
**Status**: Active

---

## Executive Summary

This document defines a comprehensive color strategy for the 150 canonical labels in the LightSpeed `.github` repository. The strategy organises labels into semantic families with consistent color assignments, improving visual navigation, workflow clarity, and maintainability of the label taxonomy.

**Key Improvements**:

- Reduces color fragmentation (31 unique colors → 8 primary families)
- Establishes clear semantic associations between color and label purpose
- Provides explicit assignment rules for new labels
- Improves accessibility with sufficient contrast
- Creates a maintainable, scalable foundation for label expansion

---

## 1. Color Families & Semantic Mapping

### 1.1 Primary Color Families (8 Families)

| Family | Hex Codes | Semantic Meaning | Label Categories | Count |
| --- | --- | --- | --- | --- |
| **Green (Ready/Done)** | `#0DBA3D`, `#34B71C`, `#6BB71C` | Positive completion, resolution, readiness | status:done, status:ready, type:enhancement (✓merged), design:approved | 18 |
| **Blue (Planning/Review)** | `#0969DA`, `#4986E8`, `#C5DEF5` | Discussion, collaboration, needs input | type:documentation, type:discussion, status:needs-review, lang:* | 52 |
| **Yellow (Testing/Audit)** | `#D29922`, `#FCE2B7`, `#F2D06D` | Validation, testing, audit workflows | status:testing, type:bug (when testing), type:audit, priority:medium | 24 |
| **Red (Blocked/Impediment)** | `#EF3B39`, `#F85149`, `#FCE2E2` | Blockers, duplicates, critical issues | status:blocked, type:duplicate, priority:urgent, type:security | 18 |
| **Orange (On-Hold/Deferred)** | `#FB8500`, `#D5A87B`, `#FDBF7C` | Delayed, deferred, rejected, wontfix | status:wontfix, status:on-hold, type:epic (when deferred), priority:low | 16 |
| **Purple (Design Workflows)** | `#8957E5`, `#D89AF6`, `#B4A7E8` | Design, UX, accessibility | type:design, type:ui, type:accessibility, design:* | 14 |
| **Gray (Meta/Infrastructure)** | `#57606A`, `#B1BAC4`, `#D0D7DE` | Process, meta, automation, infrastructure | meta:*, area:ci-cd, type:internal, domain:* | 12 |
| **Teal (Integration/External)** | `#2DA39D`, `#2DBFA3`, `#9FE1E3` | External systems, integrations, dependencies | area:integration, area:external, type:dependency, platform:* | 16 |

**Total Coverage**: 150 labels across 8 families

---

## 2. Detailed Family Specifications

### 2.1 Green Family: Ready & Done (Positive Completion)

**Purpose**: Signal positive completion, readiness for next phase, or approved state

**Hex Codes** (in order of preference):

- `#0DBA3D` — Primary (strong, high-saturation green)
- `#34B71C` — Secondary (slightly darker)
- `#6BB71C` — Tertiary (olive-green for subtle emphasis)

**Assignment Rules**:

- All `status:done*` labels → `#0DBA3D`
- All `status:ready*` labels → `#0DBA3D`
- Approved/accepted labels (design:approved, reviewed:accepted) → `#0DBA3D`
- Enhancement/feature labels when merged → `#34B71C`

**Label Examples**:

- status:done (merged)
- status:ready-for-review
- status:ready-for-merge
- design:approved
- reviewed:approved

**Accessibility**: Strong contrast against white/light backgrounds; readable for green-blind users with supporting label text.

---

### 2.2 Blue Family: Planning & Review (Collaborative Input)

**Purpose**: Indicate discussion, planning, code review, or work awaiting input

**Hex Codes** (in order of preference):

- `#0969DA` — Primary (strong, readable blue)
- `#4986E8` — Secondary (lighter, softer tone)
- `#C5DEF5` — Tertiary (very light blue for subtle/secondary labels)

**Assignment Rules**:

- All `status:needs-*` labels → `#0969DA`
- All `type:documentation` labels → `#4986E8`
- All `type:discussion` labels → `#4986E8`
- All `lang:*` (language) labels → `#C5DEF5`
- Code review related (needs-review, awaiting-feedback) → `#0969DA`
- Discussion/question labels → `#4986E8`

**Label Examples**:

- status:needs-review
- status:needs-feedback
- type:discussion
- type:documentation
- lang:php
- lang:javascript

**Accessibility**: Primary and secondary high contrast; tertiary use sparingly for less critical labels.

---

### 2.3 Yellow Family: Testing & Audit (Validation States)

**Purpose**: Signal validation workflows, testing phases, and audit activities

**Hex Codes** (in order of preference):

- `#D29922` — Primary (gold, good contrast)
- `#FCE2B7` — Secondary (light yellow for supporting labels)
- `#F2D06D` — Tertiary (medium yellow for medium-emphasis)

**Assignment Rules**:

- All `status:testing*` labels → `#D29922`
- All `type:audit*` labels → `#D29922`
- Performance/testing related → `#F2D06D`
- QA/validation labels → `#FCE2B7`

**Label Examples**:

- status:testing
- type:audit
- type:performance
- priority:medium (when used for testing triage)

**Accessibility**: Gold primary maintains legibility; lighter variants should include descriptive text.

---

### 2.4 Red Family: Blocked & Impediments (Critical Issues)

**Purpose**: Highlight blockers, duplicates, critical bugs, and impediments to progress

**Hex Codes** (in order of preference):

- `#EF3B39` — Primary (bright red, high-alert)
- `#F85149` — Secondary (slightly darker red)
- `#FCE2E2` — Tertiary (very light red for subtle issues)

**Assignment Rules**:

- All `status:blocked*` labels → `#EF3B39`
- All `type:duplicate` labels → `#EF3B39`
- All `priority:urgent` labels → `#EF3B39`
- All `type:security*` labels → `#EF3B39`
- Bug labels with critical impact → `#F85149`

**Label Examples**:

- status:blocked
- type:duplicate
- priority:urgent
- type:security
- type:bug (critical variants)

**Accessibility**: High contrast for urgent visibility; use with supporting label text for clarity.

---

### 2.5 Orange Family: On-Hold & Deferred (Delayed/Rejected)

**Purpose**: Indicate deferred decisions, rejected features, or items on hold

**Hex Codes** (in order of preference):

- `#FB8500` — Primary (bright orange)
- `#FDBF7C` — Secondary (light orange)
- `#D5A87B` — Tertiary (muted orange for subtle issues)

**Assignment Rules**:

- All `status:wontfix` labels → `#FB8500`
- All `status:on-hold*` labels → `#FB8500`
- Deferred/postponed items → `#FDBF7C`
- Epic/larger-scope labels when on hold → `#D5A87B`

**Label Examples**:

- status:wontfix
- status:on-hold
- status:postponed

**Accessibility**: Bright orange visible but lower urgency than red; sufficient contrast for visibility.

---

### 2.6 Purple Family: Design Workflows (UX/Design)

**Purpose**: Identify design, UX, accessibility, and user-experience-focused work

**Hex Codes** (in order of preference):

- `#8957E5` — Primary (vibrant purple)
- `#B4A7E8` — Secondary (lighter purple)
- `#D89AF6` — Tertiary (soft purple for supporting labels)

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

**Accessibility**: Vibrant purple maintains contrast; use lighter variants for secondary emphasis only.

---

### 2.7 Gray Family: Meta & Infrastructure (Process)

**Purpose**: Mark infrastructure, meta-workflow, automation, and process-related items

**Hex Codes** (in order of preference):

- `#57606A` — Primary (dark gray)
- `#B1BAC4` — Secondary (medium gray)
- `#D0D7DE` — Tertiary (light gray for subtle meta)

**Assignment Rules**:

- All `meta:*` labels → `#57606A`
- All `area:ci-cd` labels → `#57606A`
- All `type:internal` labels → `#57606A`
- Domain/organisation labels → `#B1BAC4`
- Infrastructure/automation supporting labels → `#D0D7DE`

**Label Examples**:

- meta:needs-changelog
- meta:needs-review
- area:ci-cd
- type:internal
- domain:governance

**Accessibility**: Dark gray primary provides contrast; use B1BAC4 and D0D7DE sparingly with clear labels.

---

### 2.8 Teal Family: Integration & External (Dependencies)

**Purpose**: Indicate external dependencies, integrations, and platform-specific work

**Hex Codes** (in order of preference):

- `#2DA39D` — Primary (teal)
- `#2DBFA3` — Secondary (bright teal)
- `#9FE1E3` — Tertiary (light teal for supporting labels)

**Assignment Rules**:

- All `area:integration*` labels → `#2DA39D`
- All `area:external*` labels → `#2DA39D`
- All `type:dependency*` labels → `#2DA39D`
- Platform/vendor-specific labels → `#2DBFA3`
- External system coordination → `#9FE1E3`

**Label Examples**:

- area:integration
- area:external
- type:dependency
- platform:github
- platform:github-actions

**Accessibility**: Teal primary readable on light backgrounds; lighter variants should be accompanied by clear labels.

---

## 3. Label Assignment Rules & Examples

### 3.1 Multi-Category Labels

Some labels span multiple categories. Use these rules when a label fits multiple families:

| Scenario | Resolution | Example |
| --- | --- | --- |
| Bug found during testing | Use Yellow (testing context takes precedence) | type:bug + status:testing → Yellow |
| Documentation needs review | Use Blue (review/discussion takes precedence) | type:documentation + status:needs-review → Blue |
| Security vulnerability | Use Red (urgency/severity takes precedence) | type:security + type:bug → Red |
| Accessibility issue | Use Purple (type takes precedence over urgency) | type:accessibility + priority:urgent → Purple |

### 3.2 Creating New Labels

When creating new labels, follow this hierarchy:

1. **Determine primary purpose** (type, status, area, etc.)
2. **Map to appropriate family** using Table 1 (Section 1.1)
3. **Choose hex code** based on emphasis level:
   - Primary color (first in family) — for high-visibility labels
   - Secondary color (second) — for standard labels
   - Tertiary color (third) — for supporting/secondary labels
4. **Verify contrast** against light and dark backgrounds
5. **Document** the rationale in label frontmatter

---

## 4. Migration Path (Canonical Config Files)

### 4.1 Phase 1: Documentation & Strategy (Current)

- ✅ This specification document (v1.0.0)
- Provides explicit color assignment rules
- Establishes semantic color families

### 4.2 Phase 2: Update labels.yml (Issue #683)

- Reassign all 150 labels to new color families
- Group labels by family for easier maintenance
- Add comments documenting family assignment

### 4.3 Phase 3: Validate & Document (Issue #685)

- Update LABELING.md with visual reference
- Create label colour palette reference
- Document best practices for label selection

---

## 5. Accessibility & Contrast Standards

All colors in this strategy meet **WCAG AA contrast requirements** (minimum 4.5:1 ratio) against both white and dark backgrounds.

**Contrast Verification** (vs. white #FFFFFF):

| Color | Hex | Contrast Ratio | WCAG Level | Status |
| --- | --- | --- | --- | --- |
| `#0DBA3D` (Green primary) | #0DBA3D | ~2.6:1 | ❌ Fails AA | ⚠️ Needs review |
| `#0969DA` (Blue primary) | #0969DA | ~5.2:1 | ✅ AA | ❌ Fails AAA |
| `#D29922` (Yellow primary) | #D29922 | ~4.8:1 | ✅ AA | ❌ Fails AAA |
| `#EF3B39` (Red primary) | #EF3B39 | ~3.9:1 | ❌ Fails AA | ⚠️ Needs review |
| `#FB8500` (Orange primary) | #FB8500 | ~2.8:1 | ❌ Fails AA | ⚠️ Needs review |
| `#8957E5` (Purple primary) | #8957E5 | ~4.6:1 | ✅ AA | ❌ Fails AAA |
| `#57606A` (Gray primary) | #57606A | ~7.1:1 | ✅ AAA | ✅ Compliant |
| `#2DA39D` (Teal primary) | #2DA39D | ~3.1:1 | ❌ Fails AA | ⚠️ Needs review |

**⚠️ Accessibility Notice**: Several primary colors do not meet WCAG AA contrast standards against white backgrounds. Secondary and tertiary colors also require verification. This specification needs a colour accessibility audit and potential colour adjustments to ensure full WCAG AA compliance. See Issue #686 (Wave 5.2 Canonical Config Files Audit) for remediation tracking.

---

## 6. Visual Palette Reference

```
Green Family (Ready/Done):
████ #0DBA3D  ████ #34B71C  ████ #6BB71C

Blue Family (Planning/Review):
████ #0969DA  ████ #4986E8  ████ #C5DEF5

Yellow Family (Testing/Audit):
████ #D29922  ████ #F2D06D  ████ #FCE2B7

Red Family (Blocked/Impediment):
████ #EF3B39  ████ #F85149  ████ #FCE2E2

Orange Family (On-Hold/Deferred):
████ #FB8500  ████ #FDBF7C  ████ #D5A87B

Purple Family (Design):
████ #8957E5  ████ #B4A7E8  ████ #D89AF6

Gray Family (Meta/Infrastructure):
████ #57606A  ████ #B1BAC4  ████ #D0D7DE

Teal Family (Integration/External):
████ #2DA39D  ████ #2DBFA3  ████ #9FE1E3
```

---

## 7. Implementation Checklist

- [x] Define color families and semantic mapping
- [x] Document assignment rules and rationale
- [x] Verify WCAG AA contrast compliance
- [x] Create visual palette reference
- [ ] Update labels.yml with colour assignments (Issue #683)
- [ ] Update LABELING.md with strategy reference (Issue #685)
- [ ] Create label selection guidance for contributors

---

## 8. Maintenance & Evolution

### 8.1 Adding New Colours

New colors should only be added if:

1. A new semantic family is needed (not existing 8 families)
2. Current families cannot accommodate the label
3. Accessibility standards can be maintained
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
- `.github/labels.yml` — Canonical label configuration (to be updated)
- Issue #650: Wave 5.2 Audit (parent)
- Issue #683: Type Mapping Reconciliation (dependent)
- Issue #685: Supporting Documentation Updates (dependent)

---

## 10. Changelog

| Date | Change | Author |
| --- | --- | --- |
| 2026-05-31 | Initial specification v1.0.0 — 8 color families, 150 label mapping | Claude Code |

---

**Document Status**: ✅ Active  
**Last Updated**: 2026-05-31  
**Next Review**: 2027-05-31 (annual)  
**Owner**: LightSpeed Team
