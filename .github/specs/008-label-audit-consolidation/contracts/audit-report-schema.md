# Audit Report Output Schema

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

**Version**: 1.0 | **Format**: Markdown (human-readable) + JSON appendix (machine-readable)

---

## Report Structure

### Header Section

```
# GitHub Label Audit Report

**Date**: YYYY-MM-DD  
**Repository**: lightspeedwp/.github  
**Auditor**: Claude Code / AI Agent  
**Scope**: Label governance analysis for PR templates, automation, and consistency  
**Methodology**: Comparison of canonical labels.yml, issue-types.yml, governance policy, documentation, and GitHub API
```

---

### Executive Summary

```markdown
## Executive Summary

**Audit Status**: [PASSED / PASSED WITH FINDINGS / CRITICAL FINDINGS]

**Key Metrics**:
- Total labels analyzed: [N]
- Labels in canonical file: [N]
- Findings identified: [N] (Critical: X, High: Y, Medium: Z, Low: W)
- Type labels (immutable): ✅ All 25 present and correct
- Governance policy gaps: [N] labels in policy but not canonical

**Critical Issues** (if any):
- [Issue 1]
- [Issue 2]

**Recommended Actions** (prioritized):
1. [Action 1 - why, impact]
2. [Action 2 - why, impact]
3. [Action 3 - why, impact]
```

---

### Label Inventory Section

```markdown
## Label Inventory by Family

### Status Family (20 labels)

| Label | Color | Canonical? | Policy? | Docs? | Workflows? | Current Use | Status |
|-------|-------|:----------:|:-------:|:-----:|:----------:|:-----------:|--------|
| status:needs-planning | BFD4F2 | ✅ | ❌ | ✅ | ✅ | Active | OK |
| status:in-progress | 1D76DB | ✅ | ❌ | ✅ | ✅ | Active | OK |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Summary**: 20/20 labels present, all documented, no duplicates, good governance coverage.

### Type Family (25 labels) - IMMUTABLE

| Label | Color | Issue Type | Status |
|-------|-------|:----------:|--------|
| type:task | 4393F8 | Task | ✅ OK |
| type:bug | 9F3734 | Bug | ✅ OK |
| ... | ... | ... | ... |

**Validation**: ✅ All 25 type labels present, correct colors, matching issue-types.yml. IMMUTABLE - no changes.

[Continue for each family...]

**Legend**:
- ✅ Present in indicated source
- ❌ Not present
- ⚠️ Inconsistency detected
- 🔒 Locked/immutable
```

---

### Findings Section

```markdown
## Findings Summary

**Total Findings**: [N]  
**Critical** (0) | **High** (X) | **Medium** (Y) | **Low** (Z)

### Finding Categories

#### 1. Missing Labels (Labels in GitHub API but not canonical)

| Label | Where Found | Impact | Recommendation |
|-------|-------------|--------|-----------------|
| [label] | GitHub API on X issues | [impact] | Add to labels.yml or remove from GitHub |

#### 2. Misnamed Labels (Different names across sources)

| Source Name | Canonical Name | Where Inconsistent | Impact | Fix |
|-------------|----------------|-------------------|--------|-----|
| type:documentation | type:docs | governance policy | Breaks governance checks | Update policy to use canonical name |

#### 3. Duplicate Labels (Consolidation opportunities)

| Duplicate | Should Consolidate To | Reason | Effort |
|-----------|----------------------|--------|--------|
| [label] | [canonical] | [why duplicate] | [effort to merge] |

#### 4. Governance Gaps (In policy but not implemented)

| Label in Policy | In Canonical? | In Use? | Impact | Action |
|-----------------|:-------------:|:-------:|--------|--------|
| type:maintenance | ❌ No | Unknown | Unknown labels may break governance | Clarify intent: add to canonical or remove from policy |

#### 5. Documentation Gaps (Missing from docs but in code)

| Label | Canonical? | Documented? | Affects | Recommendation |
|-------|:----------:|:-----------:|---------|-----------------|
| [label] | ✅ Yes | ❌ No | User guidance | Add to appropriate docs (LABEL_STRATEGY.md, etc.) |

#### 6. Workflow Analysis Results

| Workflow File | Purpose | Status | Gap Filled By | Recommendation |
|---------------|---------|--------|---------------|-----------------|
| issue-labeling-automation.yml | Auto-label issues | Archived | labeling.agent.js | Retire (superseded) |
| labeling-governance.yml | Enforce governance | Archived | labeling.yml | Analyze for re-enabling |

[Detailed findings with evidence...]
```

---

### Recommendations Section

```markdown
## Recommendations (Prioritized by Impact)

### Priority 1: Critical Governance Alignment

**Recommendation 1.1**: Update governance policy to use canonical label names
- **Issue**: Governance policy references type:documentation (canonical: type:docs) and type:ai-ops (canonical: type:aiops)
- **Impact**: Breaks governance enforcement and compliance tracking
- **Action**: Update .github/label-governance-policy.yml lines [X] to reference canonical names
- **Effort**: Minimal (simple find-replace)
- **Owner**: @ashley

**Recommendation 1.2**: Clarify deprecated labels in governance policy
- **Issue**: Policy protects labels (type:maintenance, type:story, type:support, etc.) not in canonical file
- **Impact**: Prevents cleanup of actually-orphaned labels; causes confusion
- **Action**: Either add to canonical OR document as intentionally deprecated
- **Effort**: Low (decision + documentation)
- **Owner**: @ashley + team consensus

### Priority 2: Operational Improvements

**Recommendation 2.1**: Document currently undocumented labels
- **Issue**: [List any labels found in canonical but not documented]
- **Action**: Add to LABEL_STRATEGY.md and relevant LABEL_*.md files
- **Effort**: Low (documentation only)

**Recommendation 2.2**: Audit archived workflows for restoration candidates
- **Issue**: 11 workflows archived; some may contain valuable functionality
- **Action**: Prioritize workflow analysis; identify which should be restored to unified agent
- **Effort**: Medium (analysis + potential rebuilding)

### Priority 3: Future Improvements

**Recommendation 3.1**: Implement automated label validation in CI
- **Action**: Add workflow to validate PR labels against canonical file + governance rules
- **Benefit**: Prevents future orphan labels, catches governance violations early

**Recommendation 3.2**: Consolidate labeling workflows
- **Action**: Unify archived workflows into single, well-tested labeling agent
- **Benefit**: Reduced complexity, better maintainability
```

---

### Evidence Appendix

```markdown
## Appendix A: Detailed Evidence by Finding

### Finding F-001: Type Label Naming Inconsistency

**Evidence**:

**Source 1**: Governance Policy
- File: `.github/label-governance-policy.yml`
- Line: 15
- Content: `- type:documentation`

**Source 2**: Canonical Labels
- File: `.github/labels.yml`
- Line: 183
- Content: `- name: type:docs`

**Source 3**: Issue Types
- File: `.github/issue-types.yml`
- Line: 81-83
- Content: 
  ```yaml
  - name: Documentation
    color: 9198A1
    label: type:docs
  ```

**Conclusion**: Governance policy uses non-canonical name. Canonical source is type:docs.

[Continue for each finding...]

```

---

### Appendix B: Label Family Tallies

```markdown
## Appendix B: Label Family Breakdown

| Family | Count | Canonical | Policy | Docs | Orphans | Status |
|--------|-------|:---------:|:------:|:----:|:-------:|--------|
| status: | 20 | 20 | 0 | ✅ | 0 | ✅ Complete |
| priority: | 4 | 4 | 0 | ✅ | 0 | ✅ Complete |
| type: | 25 | 25 | 8* | ✅ | 0 | ⚠️ Policy gaps |
| area: | 28 | 28 | 0 | ✅ | 0 | ✅ Complete |
| comp: | 15 | 15 | 0 | ✅ | 0 | ✅ Complete |
| lang: | 7 | 7 | 0 | ✅ | 0 | ✅ Complete |
| env: | 3 | 3 | 0 | ✅ | 0 | ✅ Complete |
| compat: | 6 | 6 | 0 | ✅ | 0 | ✅ Complete |
| cpt: | 2 | 2 | 0 | ✅ | 0 | ✅ Complete |
| ai-ops: | 7 | 7 | 0 | ✅ | 0 | ✅ Complete |
| contrib: | 3 | 3 | 0 | ✅ | 0 | ✅ Complete |
| discussion: | 7 | 7 | 0 | ✅ | 0 | ✅ Complete |
| meta: | 4 | 4 | 0 | ✅ | 0 | ✅ Complete |
| release: | 4 | 4 | 0 | ✅ | 0 | ✅ Complete |
| openspec: | 10 | 10 | 0 | ✅ | 0 | ✅ Complete |
| **TOTAL** | **147** | **147** | **8** | **✅** | **0** | ✅ **Complete** |

* Policy references 8 type: labels not in canonical (duplicates/naming mismatches)
```

---

### Appendix C: Raw Data (JSON)

```markdown
## Appendix C: Machine-Readable Data

All findings, label metadata, and reconciliation data are provided in JSON format in accompanying files:

- `label-inventory.json` — Complete label catalog with all metadata
- `findings.json` — Structured finding records (F-001, F-002, etc.)
- `workflow-analysis.json` — Assessment of archived workflows
- `governance-alignment.json` — Policy vs. canonical reconciliation

These JSON files enable programmatic processing and integration with other tools.
```

---

## Output Format Contract

**Deliverable**: Single Markdown file with embedded JSON/CSV data  
**File name**: `007-audit-report.md`  
**Location**: `.github/reports/audits/2026-09-14-label-audit/`

**Size**: Comprehensive (typically 50-100+ pages when printed)  
**Audience**: GitHub administrators, automation engineers, governance teams

**Required Sections**: All sections above must be present  
**Optional Sections**: Additional analysis as warranted by findings

**Sign-Off**: Report must include date, auditor name/ID, and confirmation that all findings are evidence-based.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
