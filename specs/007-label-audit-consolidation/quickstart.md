# Label Audit Quickstart: Validation & Testing Guide

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
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Purpose**: Verify audit completeness and validate findings before implementation  
**Audience**: GitHub administrators, automation engineers, governance teams

---

## Quick Start: Run Audit Validation

### Prerequisites

- ✅ GitHub CLI (`gh`) installed and authenticated
- ✅ Access to lightspeedwp/.github repository (push access not required)
- ✅ Bash shell environment
- ✅ `jq` for JSON processing (optional, for advanced queries)

### Environment Setup

```bash
# Verify access to repository
gh repo view lightspeedwp/.github

# Expected output: Repository information, confirming access
```

---

## Test 1: Verify Label Inventory Completeness

**Purpose**: Confirm audit has captured all labels

### Run Audit

Extract current GitHub labels:

```bash
gh label list --repo lightspeedwp/.github --json name,color,description > /tmp/github-labels.json

# Count total labels in GitHub
jq 'length' /tmp/github-labels.json
# Expected: Match the "total_labels" in audit report
```

### Validation

Compare GitHub API output against canonical file:

```bash
# Extract label count from canonical file
grep "^- name:" .github/labels.yml | wc -l
# Expected: 147

# Cross-check with audit report
# All labels in GitHub should appear in audit inventory OR be flagged as "ORPHAN"
```

**Pass Condition**:

- ✅ GitHub API label count matches canonical file count
- ✅ Every label in GitHub appears in audit inventory
- ✅ No unexpected orphan labels (unless flagged in audit findings)

---

## Test 2: Validate Type Labels (Immutable Set)

**Purpose**: Confirm 25 type labels are present and unchanged

### Extract Type Labels

From canonical file:

```bash
grep "^- name: type:" .github/labels.yml | sort
# Should output exactly 25 labels
# Should include: type:task, type:bug, type:feature, type:docs, etc.

grep "^- name: type:" .github/labels.yml | wc -l
# Expected: 25 (exactly, no more, no less)
```

From issue types:

```bash
grep "label: type:" .github/issue-types.yml | sort
# Should output exactly 25 labels

grep "label: type:" .github/issue-types.yml | wc -l
# Expected: 25
```

### Validation

Verify 1:1 mapping between issue-types.yml and labels.yml:

```bash
# Extract type labels from both files and compare
comm -23 <(grep "^- name: type:" .github/labels.yml | sed 's/.*: //' | sed 's/ *$//' | sort) \
         <(grep "label: " .github/issue-types.yml | sed 's/.*: //' | sed 's/ *$//' | sort)
# Expected: (empty output - no differences)
```

**Pass Condition**:

- ✅ Exactly 25 type labels in canonical file
- ✅ Exactly 25 type labels in issue-types.yml
- ✅ All 25 names match between files
- ✅ All 25 colors match between files
- ✅ No type labels were added/removed/renamed

---

## Test 3: Governance Policy Consistency

**Purpose**: Identify governance vs. canonical inconsistencies

### Extract Governance List

```bash
grep "^ *- " .github/label-governance-policy.yml | \
  sed 's/^ *- //' | sed 's/ *$//' | \
  sort > /tmp/policy-labels.txt

# Count governance protected labels
wc -l /tmp/policy-labels.txt
# Expected: 43 labels in policy
```

### Verify Against Canonical

```bash
# Extract labels from canonical file
grep "^- name:" .github/labels.yml | sed 's/.*: //' | sed 's/ *$//' | sort > /tmp/canonical-labels.txt

# Find labels in policy but NOT in canonical
comm -23 /tmp/policy-labels.txt /tmp/canonical-labels.txt
# Expected: Should identify mismatches like "type:documentation" vs "type:docs"

# Find labels in canonical but NOT in policy
comm -13 /tmp/policy-labels.txt /tmp/canonical-labels.txt
# Expected: Most labels (policy protects subset, not all)
```

**Pass Condition**:

- ✅ All governance-protected labels are either:
  - Present in canonical file with matching name, OR
  - Documented in audit as intentional gap/duplicate
- ✅ No undocumented label name mismatches between policy and canonical
- ✅ 25 type labels from issue-types.yml all accounted for

---

## Test 4: Archived Workflow Analysis

**Purpose**: Verify all archived workflows have been analyzed

### Inventory Archived Workflows

```bash
ls -1 .github/workflows/archived/2026-09-11/labeling/
# Expected: 11 workflow files

ls -1 .github/workflows/archived/2026-09-11/labeling/ | wc -l
# Expected: 11
```

### Extract Labels Referenced in Each Workflow

Example for one workflow:

```bash
# Search for label names in workflow file
grep -o "type:[a-z-]*\|status:[a-z-]*\|area:[a-z-]*" \
  .github/workflows/archived/2026-09-11/labeling/issue-labeling-automation.yml | \
  sort | uniq

# Should return list of labels this workflow operated on
```

**Pass Condition**:

- ✅ All 11 archived workflows analyzed
- ✅ Labels referenced in each workflow are identified
- ✅ Workflow purpose documented in audit report
- ✅ Reason for archival explained (conflicts, obsolete, superseded, performance)
- ✅ Restoration recommendation provided for each workflow

---

## Test 5: Documentation Consistency

**Purpose**: Spot-check that documentation aligns with canonical labels

### Random Sample Check (3 families)

Choose 3 random families from [status, priority, type, area, meta, release, comp]:

**Example: status family**

```bash
# Count in canonical file
CANONICAL_COUNT=$(grep "^- name: status:" .github/labels.yml | wc -l)
echo "Canonical count: $CANONICAL_COUNT"

# Expected: 20 labels in status family
```

Check documentation:

```bash
# Search for family mentioned in docs
grep -n "status:" docs/LABEL_STRATEGY.md | head -5
# Should find references to status labels in strategy guide

# Read ISSUE_LABELS.md for labeling guidance
grep -i "status" docs/ISSUE_LABELS.md
# Should describe how status labels are used
```

**Pass Condition**:

- ✅ Documentation mentions all major label families
- ✅ Label counts in docs align with canonical file (or are clearly documented as snapshots from specific date)
- ✅ No major label families are completely missing from documentation
- ✅ Status transitions/workflows align with actual labels available

---

## Test 6: Audit Report Completeness

**Purpose**: Verify audit deliverables are present and well-formed

### File Inventory

```bash
# Verify audit report directory exists and contains expected files
ls -la .github/reports/audits/2026-09-14-label-audit/

# Expected files:
# - 007-audit-report.md (main report)
# - label-inventory.csv (human-readable)
# - label-inventory.json (machine-readable)
# - findings.json (structured findings)
# - workflow-analysis.json (workflow assessment)
# - evidence/ directory with supporting data
```

### Report Validation

```bash
# Check report header
head -50 .github/reports/audits/2026-09-14-label-audit/007-audit-report.md

# Should include:
# - Audit date
# - Repository (lightspeedwp/.github)
# - Scope statement
# - Methodology
# - Executive summary with findings count

# Verify required sections exist
grep "^## " .github/reports/audits/2026-09-14-label-audit/007-audit-report.md

# Expected sections:
# - Executive Summary
# - Label Inventory by Family
# - Findings Summary
# - Recommendations
# - Appendices
```

### Data Integrity Checks

```bash
# Verify CSV header
head -1 .github/reports/audits/2026-09-14-label-audit/label-inventory.csv

# Expected: family,label_name,color,description,in_canonical,...,status,notes

# Verify CSV row count matches canonical label count
wc -l .github/reports/audits/2026-09-14-label-audit/label-inventory.csv
# Expected: 148 lines (1 header + 147 labels)

# Validate JSON syntax
jq empty .github/reports/audits/2026-09-14-label-audit/label-inventory.json
# Expected: no error output (valid JSON)

# Verify JSON contains all families
jq '.families | keys' .github/reports/audits/2026-09-14-label-audit/label-inventory.json | wc -l
# Expected: 15 families
```

**Pass Condition**:

- ✅ All required audit files present in output directory
- ✅ CSV file well-formed with correct column headers
- ✅ JSON files valid and parseable
- ✅ Row/element counts match expected totals (147 labels, 15 families, 11 workflows)
- ✅ No missing sections in main report

---

## Test 7: Evidence Traceability

**Purpose**: Verify every finding has source evidence

### Sample Finding Verification

```bash
# Extract one finding from audit report
# Example: "Finding F-001: Type label naming inconsistency"

# Check that evidence section includes:
# 1. File path
# 2. Line number
# 3. Exact text/context from source

grep -A 20 "F-001" .github/reports/audits/2026-09-14-label-audit/007-audit-report.md

# Should show:
# - Source 1: .github/label-governance-policy.yml, line 15, text: "- type:documentation"
# - Source 2: .github/labels.yml, line 183, text: "- name: type:docs"
# - Source 3: .github/issue-types.yml, line 81, text: "label: type:docs"
```

**Pass Condition**:

- ✅ Every finding has ≥1 evidence source
- ✅ Evidence includes file path + line number
- ✅ Evidence includes exact text or clear quote from source
- ✅ All line numbers are accurate (can verify by opening file)
- ✅ No findings without supporting evidence

---

## Test 8: Recommendations Actionability

**Purpose**: Verify recommendations are clear and implementable

### Sample Recommendation Review

```bash
# Extract Recommendations section
sed -n '/^## Recommendations/,/^## [^R]/p' \
  .github/reports/audits/2026-09-14-label-audit/007-audit-report.md

# Each recommendation should specify:
# 1. Clear action (what to do)
# 2. File/path to modify
# 3. Specific change (line number, current text, new text)
# 4. Effort estimate (minimal/low/medium/high)
# 5. Owner/responsible party
# 6. Impact analysis (why this matters)
```

**Pass Condition**:

- ✅ Each recommendation has specific action ("Update X in Y to change Z")
- ✅ File paths and line numbers are correct and verifiable
- ✅ Effort estimates are realistic
- ✅ Recommendations are prioritized by impact
- ✅ High-impact recommendations have detailed rationale

---

## Acceptance Criteria Summary

### All Tests Must Pass

| Test | Condition | Status |
|------|-----------|--------|
| Label Inventory | GitHub API matches canonical file | ✅ |
| Type Labels (25) | All 25 present, unchanged, immutable | ✅ |
| Governance Policy | Gaps/inconsistencies identified and documented | ✅ |
| Archived Workflows | All 11 analyzed with findings/recommendations | ✅ |
| Documentation | Consistency checked, gaps identified | ✅ |
| Report Completeness | All required files present, well-formed | ✅ |
| Evidence Traceability | Every finding has source file + line + quote | ✅ |
| Recommendations | Actionable, prioritized, implementable | ✅ |

### Overall Audit Success

✅ **AUDIT PASSED** when:

- All 8 tests above pass
- No critical findings left unresolved
- No high-priority recommendations without implementation plan
- All deliverables complete and evidence-based

---

## Next Steps

Once audit validation is complete:

1. **Review Findings** → Schedule team review of audit findings
2. **Approve Recommendations** → Governance decision on which recommendations to implement
3. **Implement Changes** → Create implementation tickets for high-priority recommendations
4. **Plan Workflow Restoration** → Prioritize archived workflows for rebuilding/restoration

---

## Reference

- **Audit Report**: `.github/reports/audits/2026-09-14-label-audit/007-audit-report.md`
- **Canonical Labels**: `.github/labels.yml`
- **Issue Types**: `.github/issue-types.yml`
- **Governance Policy**: `.github/label-governance-policy.yml`
- **Archived Workflows**: `.github/workflows/archived/2026-09-11/labeling/`

---

**Validation Run Timestamp**: To be filled in when audit validation is executed

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
