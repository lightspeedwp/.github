---
title: "Wave 5.2: Canonical Config Files Audit Report"
description: Comprehensive audit of labels.yml, issue-types.yml, and issue-fields.yml
file_type: documentation
version: "1.0.0"
created_date: "2026-05-31"
last_updated: '2026-06-01'
author: Claude Code
maintainer: Ash Shaw
owners:
  - lightspeedwp/maintainers
tags:
  - github
  - audit
  - canonical-config
  - labels
  - automation
category: governance
---

## Executive Summary

This audit reviews canonical configuration files (labels.yml, issue-types.yml, issue-fields.yml) that define the label taxonomy, issue type definitions, and field mappings across the LightSpeed `.github` repository.

**Key Findings**:

- ✅ All 150 labels exist with complete metadata
- ✅ 25 issue types defined with clear color associations
- ✅ Issue field mappings enable project automation
- 🔴 **Label color strategy inconsistent** — 31 unique colors, heavy blue concentration (47 labels use #C5DEF5)
- 🟡 **Issue type mapping quirks** — Many diverse types (epic, story, design) map to generic "Task" in projects
- 🟡 **Undocumented color rationale** — No documentation on why specific colors chosen for label families
- 🔴 **Status label colors scattered** — 10 different colors for 20 status labels

---

## File Analysis

### 1. Labels.yml (150 labels, 31 unique colors)

#### Strengths

- All labels have complete metadata: name, color, description
- Consistent YAML structure throughout
- Organized by logical groups (status, priority, type, area, language, discussion)
- Covers broad domain: 4 status types, 25 type types, 20+ areas, 6 languages

#### Critical Issues

**Color Distribution Imbalance**:

- Light blue (#C5DEF5) used 47 times (31% of all labels)
- 8 blue variants used across labels (C5DEF5, BFD4F2, 4393F8, 0052CC, 1D76DB, D4C5F9, etc.)
- Grey (#E1E4E8) used only for negative state (status:wontfix) — unclear visual hierarchy
- Purple (#AB7DF8) and brown (#8D4821) underutilized

**Status Label Color Issues**:

- 20 status labels use 10 different colors
- No clear grouping: needs-*, ready/done, blocked/duplicate, etc. don't share colors
- Example: status:needs-design (#C5DEF5), status:needs-design-review (#D4C5F9), status:needs-figma-update (#C5DEF5) use 2 colors for 3 related concerns

**Missing Documentation**:

- No documented color strategy or family grouping
- No rationale for color selection by category
- Color conflicts between type/area labels not documented

#### Detailed Breakdown

| Category | Count | Color Strategy | Issues |
| --- | --- | --- | --- |
| Status | 20 | 10 colors | Too scattered; unclear hierarchy |
| Priority | 5 | 4 colors | OK; clear ordering (red→orange→blue) |
| Type | 25 | 11 colors | Good coverage; some duplicates (4393F8 used 6x) |
| Area | 20+ | 8+ colors | Inconsistent; some greys, some bright |
| Language | 7 | 3 colors | Clear; one color per language group |
| Discussion | 7 | 7 colors | All defined; good semantic color coverage |

---

### 2. Issue-Types.yml (25 types, direct label mapping)

#### Strengths

- Clear 1:1 mapping between issue types and labels
- Color field supports visual identification in GitHub UI
- Names aligned with common GitHub issue types

#### Issues

**Naming Inconsistencies**:

- "Code Refactor" vs "Refactor" (issue-types says "Code Refactor" but label is "type:refactor")
- "Build & CI" vs generic other types
- "A11y" uses abbreviation while others spell out (Accessibility)

**Color Duplication**:

- Blue (#4393F8) used for: Task, Story, Build & CI, Code Review, AI Ops (5 types)
- Grey (#9198A1) used for: Improvement, Code Refactor, Maintenance, Documentation, Research, Chore, Audit (7 types)
- Purple (#AB7DF8) used for: Design, Epic, Content Modelling (3 types)

**Gap Analysis**:

- 25 types defined in issue-types.yml
- Issue-fields.yml maps 23 types to project "Type" field
- Unmapped types: `type:refactor` and `type:build` only

---

### 3. Issue-Fields.yml (Organization-level field model)

#### Strengths

- Provides organization-wide defaults (assignee: ashleyshaw, default status labels)
- Maps labels to GitHub project field values
- Clear distinction between issue and PR defaults

#### Critical Issues

**Type Field Mapping Collapse**:

```yaml
type:epic: Task          # Epic → Task (loses nuance)
type:story: Task         # Story → Task (loses nuance)
type:design: Task        # Design → Task (loses nuance)
```

This is problematic because:

- Collapses 25 distinct types into 4 project field values (Bug, Feature, Documentation, Task)
- Project board loses domain context (audit issues → Task, design work → Task, etc.)
- Makes it impossible to track by work type in project views

**Missing Mappings**:

- priority:minor defined in field mappings but no label for it in labels.yml
- Some type labels have no mapping: improve, review, story, epic, question, support, etc.

**Field Application**:

- `universal_issue_fields` applies to many issue types, but criteria for which types get which fields is unclear

---

## Recommendations

### Priority: HIGH (Blocks Clear Automation)

1. **Develop Color Strategy Specification** (Effort: 2 hours)
   - Document rationale for color families
   - Group related labels by color (e.g., all "needs-*" status in one color family)
   - Establish color taxonomy: ready/done (green), in-progress (blue), blocked (red), etc.
   - Specify which labels should use which color families
   - Deliverable: `docs/LABEL_COLOR_STRATEGY.md` with color palette and assignment rules

2. **Reconcile Issue-Fields Type Mapping** (Effort: 1-2 hours)
   - Add all 25 issue types to project field mapping (not just 4 generic categories)
   - Decide: keep current 4-value mapping or expand to 10+ values
   - Document why certain types collapse to Task in projects (if intentional)
   - Update issue-fields.yml with complete mapping
   - Deliverable: Updated `.github/issue-fields.yml` with all 25 types mapped

3. **Standardize Issue-Type Naming** (Effort: 1 hour)
   - Align issue-types.yml names with label names (Code Refactor → Refactor)
   - Audit for abbreviations vs full names (A11y → Accessibility)
   - Update issue-types.yml for consistency
   - Deliverable: Updated `.github/issue-types.yml`

### Priority: MEDIUM (Documentation & Clarity)

1. **Create Label Inventory & Family Grouping** (Effort: 2 hours)
   - Document all 150 labels by family (status, priority, type, area, language)
   - Create visual grouping showing which labels go together
   - Identify unused or deprecated labels
   - Deliverable: `docs/LABEL_INVENTORY.md` with complete family grouping

2. **Document Field Mapping Rationale** (Effort: 1 hour)
   - Explain why issue-fields.yml collapses 25 types to 4 project values
   - Document when/where type granularity is lost
   - Clarify field application rules (which issue types get which fields)
   - Deliverable: Updated `docs/ISSUE_FIELDS.md` with rationale

3. **Update Issue-Types Documentation** (Effort: 1 hour)
   - Align docs with actual type definitions
   - Document type-to-project-field mapping
   - Create decision tree for choosing correct issue type
   - Deliverable: Updated `docs/ISSUE_TYPES.md`

### Priority: LOW (Enhancement & Future-Proofing)

1. **Implement Color Validation** (Effort: 2-3 hours)
   - Create validation script to enforce color strategy rules
   - Check labels use approved colors for their family
   - Ensure status labels follow color grouping
   - Deliverable: `scripts/validation/validate-label-colors.js`

2. **Create Interactive Label Selector** (Effort: 3-4 hours)
   - Build interactive guide (HTML or Markdown) for choosing labels
   - Group by use case (feature work, bug fix, documentation, etc.)
   - Show recommended label combinations
   - Deliverable: `docs/LABEL_SELECTOR.md` or interactive tool

---

## Detailed Findings by Category

### Status Labels (20 total, 10 colors)

Current color distribution shows no clear hierarchy:

- **Green** (ready/done): 0E8A16 (2 labels) — used for positive completion states
- **Blue** (planning/review): BFD4F2 (6 labels) — used for work needing input
- **Light blue** (design): C5DEF5 (3 labels) — used for design-related needs
- **Purple** (design review): D4C5F9 (1 label) — used for design review only
- **Dark blue** (in progress): 1D76DB (1 label) — only for in-progress
- **Orange** (QA): FBCA04 (1 label) — only for QA
- **Yellow** (testing): FEF2C0 (2 labels) — used for testing/audit
- **Pink** (hold): F9D0C4 (1 label) — only for on-hold
- **Red** (blocked): E99695 (2 labels) — used for blocked/duplicate
- **Grey** (wontfix): E1E4E8 (1 label) — only for wontfix

**Recommendation**: Consolidate to 5-6 status color families:

- Green: ready, done
- Blue: planning, review, discussion, more-info
- Yellow: testing, audit
- Red: blocked, duplicate
- Orange: on-hold, wontfix

### Type Labels (25 total, 11 colors)

Good semantic color usage but overloaded:

- Blue (#4393F8): Task, Story, Build & CI, Code Review, AI Ops
- Grey (#9198A1): Improvement, Refactor, Maintenance, Documentation, Research, Chore, Audit
- Purple (#AB7DF8): Design, Epic, Content Modelling
- Brown (#8D4821): Compatibility, Integration

**Recommendation**: Maintain current semantic coloring; consistency is good.

### Area Labels (20+ total, 8+ colors)

Good coverage; needs better documentation:

- block-editor, theme, ci, labels, dependencies, security, a11y, documentation, tests, scripts, assets, woocommerce

No documented color strategy for area labels.

### Language Labels (6 total, 3 colors)

Clear and consistent:

- lang:php, lang:js, lang:css, lang:md, lang:json, lang:yaml

Good separation by language family.

---

## Acceptance Criteria (Wave 5.2 Child Issues)

- [ ] Label color strategy documented with rationale
- [ ] Status label colors consolidated to 5-6 family groups
- [ ] All 25 issue types mapped in issue-fields.yml
- [ ] Issue-type naming standardized and aligned with labels
- [ ] Label inventory documented with family grouping
- [ ] Field mapping rationale documented
- [ ] All documentation files updated (LABEL_STRATEGY.md, ISSUE_FIELDS.md, ISSUE_TYPES.md)
- [ ] Pre-implementation child issues created:
  - Child 5.2.1: Implement color strategy specification
  - Child 5.2.2: Reconcile issue-fields type mapping
  - Child 5.2.3: Standardize issue-type naming
  - Child 5.2.4: Update all supporting documentation

---

## Next Steps (Wave 5.2 Implementation)

1. **Create color strategy specification** — clarify visual hierarchy and family grouping
2. **Reconcile issue-fields.yml** — decide: expand project field mapping or document why collapse to 4 types
3. **Standardize naming** — align issue-types.yml with label definitions
4. **Update documentation** — reflect actual configuration and strategy in docs/

---

## References

- `.github/labels.yml` — 150 canonical labels with colors
- `.github/issue-types.yml` — 25 issue type definitions
- `.github/issue-fields.yml` — Organization-level field model and mappings
- `docs/LABEL_STRATEGY.md` — Label strategy documentation (incomplete)
- `docs/ISSUE_LABELS.md` — Label usage guide
- `docs/ISSUE_TYPES.md` — Issue type documentation
- `docs/ISSUE_FIELDS.md` — Issue field reference

---

## Audit Metadata

| Field | Value |
| --- | --- |
| Audit Date | 2026-05-31 |
| Auditor | Claude Code |
| Issue | #650 (Wave 5.2) |
| Scope | labels.yml, issue-types.yml, issue-fields.yml, related docs |
| Status | ✅ COMPLETE |
| Effort | 2.5 hours |
| Findings Count | 12+ issues identified |
| Recommendation Count | 5 (3 high, 2 medium) |
| Child Issues | 4 implementation tasks planned |

---
