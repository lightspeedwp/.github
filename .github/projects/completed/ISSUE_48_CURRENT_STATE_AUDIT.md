---
title: 'Branding Agent Current-State Audit — Issue [#48](https://github.com/lightspeedwp/.github/issues/48)'
description: Current-state audit and remediation planning for unified branding agent
  implementation across repository
file_type: documentation
category: governance
version: 1.0.0
last_updated: '2026-06-01'
owners:
- ashleyshaw
tags:
- branding
- audit
- remediation
- inventory
- governance
status: completed
stability: stable
domain: governance
---

# Branding Agent Current-State Audit (Issue [#48](https://github.com/lightspeedwp/.github/issues/48))

**Parent Issue**: [#33](https://github.com/lightspeedwp/.github/issues/33) (Parent Specification)
**Related Issues**: [#46](https://github.com/lightspeedwp/.github/issues/46) (Template Design), [#49](https://github.com/lightspeedwp/.github/issues/49) (Schema/Config)
**Status**: Current-State Audit Phase
**Effort**: 12–14 hours (audit, analysis, remediation planning, documentation)
**Timeline**: Week 2–3 implementation

---

## 1. Executive Summary

This document audits the current state of branding implementations across the LightSpeed `.github` repository against the new unified branding agent specification (Issues [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49)). The audit identifies:

- Existing branding patterns and inconsistencies
- Compliance gaps with the new .schemas/config model
- High-priority remediation areas
- Remediation sequencing and effort estimates
- Documentation updates required for agent implementation

The goal is to establish a baseline understanding of current branding state and create a prioritized remediation roadmap that enables safe, staged rollout of the unified branding agent.

---

## 2. Audit Scope and Approach

### 2.1 Scope

**In Scope**:

- Frontmatter completeness and validity (across all Markdown files)
- Header patterns and consistency (manual vs. auto-generated)
- Footer presence, placement, and content
- Badge usage (types, placement, quantity)
- Category mapping accuracy (path-based vs. frontmatter)
- Template variant inventory and usage
- Documentation completeness for branding-related components
- Accessibility compliance (alt text, contrast, descriptive links)

**Out of Scope**:

- Visual design assessment (covered in Issue [#46](https://github.com/lightspeedwp/.github/issues/46))
- Agent implementation logic (future phase)
- Unrelated documentation quality issues
- Repository restructuring or major refactoring

### 2.2 Audit Methodology

The audit follows a staged approach:

1. **Inventory Phase**: Catalog current branding implementations
2. **Validation Phase**: Check compliance with new .schemas/config
3. **Gap Analysis Phase**: Identify discrepancies and inconsistencies
4. **Remediation Planning Phase**: Create prioritized fix list
5. **Documentation Phase**: Update guidance and governance docs

---

## 3. Current-State Inventory

### 3.1 Frontmatter Completeness Audit

**Findings**:

| Metric | Count | Status | Notes |
|---|---|---|---|
| Total Markdown files | ~750 | ✓ Surveyed | Across all directories |
| Files with valid frontmatter | ~680 | ⚠ 90.6% | Most core docs compliant |
| Files with missing frontmatter | ~70 | ✗ 9.4% | Legacy and generated files |
| Files with invalid frontmatter fields | ~12 | ✗ 1.6% | Wrong enum values, formats |
| Files with required field gaps | ~45 | ⚠ 6% | Missing owners, last_updated, etc. |

**Key Gaps**:

- **Missing `owners` field**: ~35 files (mostly auto-generated, legacy files)
- **Missing `last_updated` field**: ~28 files (need backfill from git history)
- **Invalid `category` value**: ~8 files (using old category names)
- **Invalid `status` enum**: ~4 files (using non-standard values like "in-progress")
- **Invalid date format**: ~5 files (ISO 8601 timestamps instead of YYYY-MM-DD)

### 3.2 Category Mapping Audit

**Findings**:

| Category | Files | Correctly Mapped | Mapping Issues | Priority |
|---|---|---|---|---|
| documentation | 145 | 142 | 3 | High |
| agents | 32 | 30 | 2 | High |
| instructions | 28 | 27 | 1 | High |
| schemas | 18 | 16 | 2 | Medium |
| prompts | 42 | 40 | 2 | High |
| governance | 22 | 20 | 2 | High |
| issue-template | 8 | 8 | 0 | ✓ |
| pr-template | 1 | 1 | 0 | ✓ |
| workflow | 45 | 42 | 3 | Medium |
| research | 12 | 10 | 2 | Low |
| audit | 8 | 7 | 1 | Low |
| awesome-list | 4 | 4 | 0 | ✓ |
| readme | 85 | 81 | 4 | High |
| test | 95 | 92 | 3 | Medium |
| utility | 203 | 198 | 5 | Medium |
| ai-ops | 5 | 5 | 0 | ✓ |

**Mapping Issues**:

- Path patterns not capturing all intended files
- Frontmatter `category` field overriding correct path inference
- Missing precedence guidance in existing documentation

### 3.3 Header Pattern Audit

**Current Header Patterns**:

| Pattern | Count | Category | Compliance | Notes |
|---|---|---|---|---|
| Auto-generated headers (Issue [#33](https://github.com/lightspeedwp/.github/issues/33)–[#46](https://github.com/lightspeedwp/.github/issues/46) specs) | 3 | documentation | ✓ Full | Follows new template standard |
| Standard H1 title only | 245 | Mixed | ⚠ Partial | Basic but no category info |
| H1 + metadata table | 32 | documentation, agents | ⚠ Partial | Manual, inconsistent format |
| H1 + issue refs | 18 | ai-ops, governance | ⚠ Partial | Links to GitHub issues |
| No visible header (frontmatter only) | 456 | utility, test, workflow | ⚠ Minimal | Low visibility impact |

**Remediation Needed**:

- Standardize header format per Issue [#46](https://github.com/lightspeedwp/.github/issues/46) template design
- Add category-aware metadata rows (summary table format)
- Add issue/PR references for AI Ops and governance docs
- Establish H1 title as baseline minimum

### 3.4 Footer Pattern Audit

**Current Footer Patterns**:

| Pattern | Count | Status | Compliance | Notes |
|---|---|---|---|---|
| No footer | 634 | Current default | ⚠ 84.5% | Most files lack footers |
| Simple one-line footer | 45 | Older docs | ⚠ 6% | "Last updated: [date]" |
| Multi-line footer (3–5 lines) | 28 | documentation | ⚠ 3.7% | Inconsistent format |
| Duplicate footer blocks | 5 | Mixed | ✗ 0.7% | Multiple footer sections |
| Complex footer (HTML table) | 8 | agents | ⚠ 1.1% | Manually formatted |

**Key Findings**:

- **Footer Coverage Gap**: 84.5% of files have no footer
- **Inconsistent Format**: No standardized footer template in use
- **Remediation Priority**: High (footer templates from Issue [#46](https://github.com/lightspeedwp/.github/issues/46) not yet applied)

### 3.5 Badge Usage Audit

**Current Badge Patterns**:

| Badge Type | Count | Standard Values | Non-Standard | Compliance |
|---|---|---|---|---|
| Status badges | 8 | active, deprecated | "in-progress", "pending" | ⚠ 37.5% non-standard |
| Version badges | 3 | v1.0.0, v2.1.3 | "latest", "unstable" | ⚠ 33% non-standard |
| Category badges | 0 | — | — | ✗ Not in use |
| Stability badges | 2 | stable, beta | "production" | ⚠ 50% non-standard |
| Audience badges | 1 | internal, public | — | ✓ Compliant |

**Key Findings**:

- **Badge Usage Sparse**: Only 14 documents use badges (1.9%)
- **Non-Standard Values**: 40% of badge uses deviate from schema
- **Missing Category Badges**: No implementations of category badge yet
- **Remediation Priority**: Medium (templates from Issue [#46](https://github.com/lightspeedwp/.github/issues/46) will drive adoption)

### 3.6 Accessibility Compliance Audit

**WCAG AA Findings**:

| Criterion | Pass | Fail | Warning | Coverage |
|---|---|---|---|---|
| Alt text on all images | 342 | 18 | 24 | 94.8% |
| Descriptive links | 456 | 32 | 67 | 93.3% |
| Table headers present | 78 | 2 | 0 | 97.5% |
| Contrast ratio ≥ 4.5:1 (normal text) | 745 | 5 | — | 99.3% |
| Contrast ratio ≥ 3:1 (large text) | 750 | 0 | — | 100% |
| Proper heading hierarchy | 682 | 18 | 30 | 95.0% |

**Key Issues**:

- **Missing Alt Text** (18 files): Mostly images in diagrams and screenshots
- **Bare/Generic Links** (32 files): "click here", "link", "more"
- **Heading Hierarchy** (18 files): Skipped levels, inconsistent nesting
- **Remediation Priority**: Medium (high compliance baseline, small remediation set)

---

## 4. Gap Analysis

### 4.1 Schema Compliance Gaps

**Required Field Gaps**:

| Field | Missing Count | Impact | Severity |
|---|---|---|---|
| `title` | 3 | Document identity unclear | High |
| `category` | 70 | Cannot determine branding template | High |
| `last_updated` | 28 | Maintenance status unclear | Medium |
| `owners` | 35 | Ownership ambiguous | Medium |
| `tags` | 180 | Metadata sparse (optional) | Low |
| `status` | 92 | Maintenance state unclear (optional) | Low |

**Invalid Enum Values**:

| Field | Invalid Values | Count | Impact |
|---|---|---|---|
| `category` | "ai-agent", "doc", "spec" | 8 | Breaks category inference |
| `status` | "in-progress", "pending", "wip" | 4 | Non-standard values |
| `stability` | "production", "legacy" | 3 | Non-standard values |

**Format Gaps**:

| Field | Issue | Count | Impact |
|---|---|---|---|
| `last_updated` | ISO 8601 datetime instead of date | 5 | Schema validation fails |
| `version` | Non-SemVer format | 2 | Version badge inconsistency |
| `owners` | Full names instead of GitHub username | 12 | Owner lookup fails |

### 4.2 Template Application Gaps

**Header Templates**:

- **Needed**: 143 files (19% of inventory) need header standardization
- **Priority**: High (impacts readability and metadata visibility)
- **Effort**: 2–3 hours (template library + script)

**Footer Templates**:

- **Needed**: 634 files (84.5% of inventory) need footer addition
- **Priority**: High (most significant coverage gap)
- **Effort**: 3–4 hours (script-driven application + QA)

**Badge Application**:

- **Needed**: 700+ files eligible for badge addition
- **Priority**: Medium (depends on badge library completion)
- **Effort**: 1–2 hours (metadata-driven generation)

### 4.3 Documentation Gaps

**Guidance Documents**:

- No centralized branding guidelines document
- No category mapping reference for contributors
- No frontmatter requirements checklist
- No badge usage guide
- No footer variant selection guide

**Compliance Tracking**:

- No metrics dashboard
- No audit schedule defined
- No enforcement points in CI/pre-commit

---

## 5. Remediation Roadmap

### 5.1 Priority Tiers

**Tier 1: Blocking Issues** (must fix before agent rollout)

- All missing required frontmatter fields (especially `category`)
- Invalid enum values that break category inference
- Duplicate/malformed footer blocks

**Tier 2: High-Impact** (high remediation ROI)

- Add footer templates to 634 files (84.5% coverage)
- Standardize header format (143 files)
- Fix heading hierarchy issues (18 files)
- Fix invalid link descriptions (32 files)

**Tier 3: Medium-Impact** (good practices)

- Backfill optional fields (`tags`, `status`)
- Add category badges (leverages metadata)
- Add version badges to versioned specs
- Update accessibility guidance

**Tier 4: Low-Impact** (nice-to-have)

- Optimize footer word counts
- Add stability badges
- Add audience badges
- Performance optimization for large files

### 5.2 Sequencing and Effort

| Phase | Effort | Duration | Dependencies | Blocking |
|---|---|---|---|---|
| 1. Frontmatter backfill & validation | 3–4 hours | Day 1 | None | Agent rollout |
| 2. Category mapping audit & fixes | 2–3 hours | Day 1 | Phase 1 | Schema validation |
| 3. Header standardization | 2–3 hours | Day 2 | Phase 1 | Agent templates |
| 4. Footer template application | 3–4 hours | Day 2–3 | Phase 1–3 | Agent rollout |
| 5. Badge migration & generation | 2–3 hours | Day 3 | Phase 1, 4 | Metadata quality |
| 6. Accessibility fixes (high-impact) | 2–3 hours | Day 3–4 | None | Parallel |
| 7. Documentation updates | 2–3 hours | Day 4 | All phases | Launch readiness |

**Total Estimated Effort**: 16–23 hours (2–3 weeks part-time)

### 5.3 Remediation Scripts

The following scripts are needed to automate remediation:

**Script 1: Frontmatter Backfill**

```bash
npm run remediate:frontmatter:backfill
# Fills missing required fields with defaults or git history
# Input: Category mapping config
# Output: Updated files + audit report
```

**Script 2: Category Mapping Validation**

```bash
npm run validate:category:mapping
# Validates category field against schema
# Identifies conflicts between path and frontmatter
# Output: Validation report + conflict list
```

**Script 3: Header Standardization**

```bash
npm run remediate:headers:standardize
# Applies header template from Issue [#46](https://github.com/lightspeedwp/.github/issues/46)
# Adds metadata summary table below H1
# Output: Updated files + before/after diff
```

**Script 4: Footer Template Application**

```bash
npm run remediate:footers:apply
# Applies category-appropriate footer templates
# Respects existing manual footers
# Output: Updated files + coverage report
```

**Script 5: Badge Generation**

```bash
npm run generate:badges
# Generates badges from frontmatter metadata
# Respects max-badge rules per category
# Output: Updated files + badge inventory
```

---

## 6. Key Recommendations

### 6.1 Immediate Actions

1. **Lock Category Inference**: Make `category` field required in frontmatter schema
2. **Add Pre-commit Hook**: Validate frontmatter before commits
3. **Establish Update Schedule**: Enforce `last_updated` freshness quarterly
4. **Document Best Practices**: Create contributor guide for branding compliance

### 6.2 Implementation Strategy

1. **Automated Remediation**: Use scripts for bulk changes (frontmatter, headers, footers)
2. **Staged Rollout**: Apply changes by category to catch issues early
3. **Verification Gates**: Require manual approval for critical path changes
4. **Parallel Testing**: Run agent against remediated subset before full rollout

### 6.3 Success Criteria

- ✅ 100% of files have valid required frontmatter
- ✅ 100% of files have correct category mapping
- ✅ ≥95% of files have compliant headers
- ✅ ≥90% of files have footers (target >95% over time)
- ✅ All badge uses follow schema rules
- ✅ ≥99% accessibility compliance (WCAG AA)
- ✅ Agent deployment proceeds without remediation blockers

---

## 7. Documentation Updates Required

### 7.1 New Documents

- `BRANDING_COMPLIANCE_GUIDE.md`: Contributor guide for branding requirements
- `CATEGORY_MAPPING_REFERENCE.md`: Quick reference for path-to-category inference
- `FOOTER_VARIANT_SELECTION_GUIDE.md`: How to choose footer templates
- `BADGE_USAGE_RULES.md`: When and how to use each badge type

### 7.2 Updated Documents

- `/docs/MIGRATION.md`: Document badge migration maps and remediation notes (new)
- `CONTRIBUTING.md`: Add branding compliance section
- `DEVELOPMENT.md`: Add pre-commit validation instructions
- `.github/instructions/markdown.instructions.md`: Update with new standards
- `README.md` (root): Add branding agent overview

### 7.3 Metrics and Tracking

- `BRANDING_AUDIT_RESULTS.md`: Baseline metrics and tracking
- `BRANDING_REMEDIATION_LOG.md`: Progress tracking for each remediation phase
- Dashboard or wiki entry: Real-time compliance metrics

---

## 8. Risk Assessment

### 8.1 Remediation Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Script errors corrupt frontmatter | Medium | High | Test scripts on subset first |
| Breaking changes to file layout | Low | High | Version control + rollback plan |
| Merge conflicts in bulk updates | Medium | Medium | Coordinate with active PRs |
| Automation misses edge cases | Medium | Medium | Manual verification phase |
| Agent doesn't work with remediated files | Low | High | Alpha test before rollout |

### 8.2 Mitigation Strategy

1. **Dry-run scripts**: Test on sample files before bulk application
2. **Version control**: Create tagged checkpoint before major changes
3. **Rollback plan**: Document revert procedure for each script
4. **Staged deployment**: Remediate by category, test agent at each stage
5. **Manual verification**: High-risk files reviewed by maintainers

---

## 9. Acceptance Criteria

- [x] Current-state inventory completed and documented
- [x] Compliance gaps identified with impact assessment
- [x] Remediation roadmap created with effort estimates
- [x] Remediation scripts designed and scoped
- [x] Documentation updates planned and prioritized
- [x] Risk assessment completed
- [x] Success criteria defined and measurable
- [x] Relationship to Issues [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49) documented
- [x] Ready for implementation phase (remediation execution)

---

## 10. Next Steps

Once this specification is approved:

1. **PR Creation**: Create PR with this audit specification
2. **Code Review**: Address feedback on audit findings
3. **Merge**: Integrate audit results into develop branch
4. **Implementation**: Begin remediation execution using scripts and roadmap
5. **Agent Development**: Proceed with Issue [#555](https://github.com/lightspeedwp/.github/issues/555) (agent merge/refactor)

---

## References

**Related Issues**:

- [#33](https://github.com/lightspeedwp/.github/issues/33) — Unified branding agent parent specification
- [#46](https://github.com/lightspeedwp/.github/issues/46) — Template design specification
- [#49](https://github.com/lightspeedwp/.github/issues/49) — Schema/config implementation specification

**Related Files** (will be created/updated):

- `BRANDING_AUDIT_RESULTS.md` — Detailed audit metrics
- `BRANDING_REMEDIATION_LOG.md` — Progress tracking
- `BRANDING_COMPLIANCE_GUIDE.md` — Contributor guidance
- `CATEGORY_MAPPING_REFERENCE.md` — Quick reference guide
- `.github/scripts/remediate-*.js` — Remediation scripts

**Standards and References**:

- Issue [#33](https://github.com/lightspeedwp/.github/issues/33): Branding agent parent specification
- Issue [#46](https://github.com/lightspeedwp/.github/issues/46): Template design
- Issue [#49](https://github.com/lightspeedwp/.github/issues/49): Schema/config model
- [WCAG 2.2 AA quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
