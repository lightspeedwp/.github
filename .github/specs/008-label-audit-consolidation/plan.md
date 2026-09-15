# Implementation Plan: GitHub Label Audit & Consolidation

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Branch**: `audit/github-label-audit` | **Date**: 2026-09-14 | **Spec**: [008-label-audit-consolidation/spec.md](spec.md)

**Input**: Feature specification from `.github/specs/008-label-audit-consolidation/spec.md`

## Summary

Conduct a comprehensive audit of GitHub labels across the `.github` repository to identify inconsistencies, duplicates, and gaps in label governance. The audit compares canonical `labels.yml` against `issue-types.yml`, governance policy, documentation, archived workflows, and GitHub API usage to produce a reconciliation report with recommendations for consolidation and workflow restoration.

**Key Constraints**:

- Type labels (25 from `issue-types.yml`) are immutable
- Audit is read-only (no changes to production configuration)
- All findings must be evidence-based with file/line references

## Technical Context

**Project Type**: Analysis/Audit/Documentation task (not code development)

**Scope**: Multi-source analysis across:

- Canonical label configuration files (YAML)
- GitHub issue type definitions (YAML)
- Label governance policy (YAML)
- Documentation files (Markdown)
- Archived GitHub Actions workflows (YAML)
- GitHub API label inventory (JSON)

**Tools/Technologies**:

- YAML file parsing and validation
- Markdown documentation analysis
- GitHub API (via `gh` CLI or API client)
- Shell scripting for workflow analysis
- JSON/YAML comparison and reconciliation

**Data Sources**:

- `.github/labels.yml` (canonical, 147 labels, 15 families)
- `.github/issue-types.yml` (25 type labels, immutable)
- `.github/label-governance-policy.yml` (never-delete policy)
- `docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md` (18+ doc files)
- `.github/workflows/archived/2026-09-11/labeling/` (11 archived workflows)
- GitHub API labels on lightspeedwp/.github repository

**Deliverables**:

- audit-report.md (findings summary with evidence)
- label-inventory.csv (comprehensive label catalog)
- duplicates-analysis.md (consolidation recommendations)
- workflow-analysis.md (archived workflow assessment)
- data-model.md (entity catalog for phases)

**Testing Strategy**:

- Manual verification of each finding against source files
- Cross-reference consistency checks
- Completeness validation (all labels accounted for)
- Evidence traceability (every finding has file/line reference)

**Scale/Scope**:

- ~147 labels across 15 families in canonical file
- ~25 type labels (immutable)
- ~43 labels in governance never-delete policy
- 11 archived workflows to analyze
- 18+ documentation files to review

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **COMPLIANT** — All audit principles align with constitution:

1. **Organisation-Wide Governance Authority**: This audit serves the `.github` repository's role as authoritative source for label governance across all LightSpeed repositories. ✅

2. **Curated Assets with Locked Governance**: Audit protects locked files (labels.yml, issue-types.yml) — no changes permitted, read-only analysis only. ✅

3. **Clear Asset Boundaries**: Audit clearly differentiates between canonical configuration (`.github/`) and documentation (top-level `docs/`). ✅

4. **Technology-Agnostic Guidance**: Audit findings apply universally to all repositories consuming central label configuration, regardless of tech stack. ✅

5. **Branch Naming Strategy**: Uses proper `audit/github-label-audit` branch naming (not forbidden `claude/` prefix). ✅

6. **UK English, Accessibility, Security Standards**: All deliverables will follow UK English, semantic documentation, and security-first practices. ✅

**No violations identified.** Audit is within scope and compliant with constitution.

## Project Structure

### Documentation (this audit feature)

```text
.github/specs/008-label-audit-consolidation/
├── spec.md                              # Specification document
├── plan.md                              # This file (implementation plan)
├── research.md                          # Phase 0: Research findings & unknowns resolved
├── data-model.md                        # Phase 1: Entity catalog & label taxonomy
├── quickstart.md                        # Phase 1: Validation & testing guide
├── contracts/                           # Phase 1: Output format specifications
│   ├── audit-report-schema.md
│   ├── label-inventory-schema.md
│   └── findings-evidence-schema.md
├── checklists/
│   └── requirements.md                  # Quality validation checklist
└── tasks.md                             # Phase 2: Task decomposition (via /speckit-tasks)
```

### Audit Output (repository root: `.github/`)

```text
.github/
├── reports/
│   └── audits/
│       └── 2026-09-14-label-audit/          # Audit results directory
│           ├── 007-audit-report.md          # Main findings & summary
│           ├── label-inventory.csv          # Complete label catalog
│           ├── duplicates-analysis.md       # Consolidation recommendations
│           ├── workflow-analysis.md         # Archived workflow assessment
│           └── evidence/
│               ├── label-mappings.json      # Source data comparisons
│               ├── missing-labels.json      # Labels in GitHub but not canonical
│               └── mismatches.json          # Name/color inconsistencies
```

**Structure Decision**:

- **Documentation**: All specification, planning, and design artifacts reside in `.github/specs/008-label-audit-consolidation/` (per SpecKit convention)
- **Audit Output**: Final audit reports and findings stored in `.github/reports/audits/2026-09-14-label-audit/` (per repository governance for audit artifacts)
- **No source code development**: This is an audit/analysis task; deliverables are configuration reconciliation reports and recommendations

## Complexity Tracking

**No Constitution Check violations.** Audit is straightforward analysis with clear scope:

- Read-only access to all configuration files
- No modifications to locked files
- Governance principles fully supported
- Output format is standard documentation + structured data

---

## Phase 0: Outline & Research

### Research Tasks

No significant NEEDS CLARIFICATION markers in the specification. Technical approach is well-defined:

1. **Data Source Inventory** (Resolved)
   - Canonical labels: `.github/labels.yml` — 147 labels, 15 families, YAML format
   - Issue types: `.github/issue-types.yml` — 25 types (immutable), YAML format
   - Governance policy: `.github/label-governance-policy.yml` — never-delete list, YAML format
   - Documentation: 18+ files in `docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md`
   - Archived workflows: 11 YAML files in `.github/workflows/archived/2026-09-11/labeling/`
   - GitHub API: Current labels on lightspeedwp/.github repository

2. **Analysis Method** (Resolved)
   - Direct file comparison (canonical vs. policy vs. documentation)
   - Label family taxonomy extraction and validation
   - Duplicate detection algorithm (name similarity, semantic overlap)
   - Workflow code analysis (extract label references from archived workflows)
   - GitHub API query (identify labels not in canonical file — orphans)

3. **Evidence Collection** (Resolved)
   - All findings traceable to file path + line number
   - Structured output: JSON/CSV for machine consumption, Markdown for human review
   - Examples and quotations from source files for each finding

### Research Output: `research.md`

```markdown
# Research Findings: GitHub Label Audit

## Data Source Analysis

### Canonical Labels (labels.yml)
- **Total**: 147 labels across 15 families
- **Families**: status, priority, type, meta, release, area, comp, lang, env, compat, cpt, ai-ops, contrib, discussion, openspec
- **Format**: YAML key-value with name, color, description
- **Status**: Manually curated, locked, no recent changes

### Issue Types (issue-types.yml)
- **Total**: 25 types (IMMUTABLE - must not change)
- **Mapping**: Each type maps to a `type:*` label
- **Constraint**: All 25 must exist in canonical labels.yml with matching name and color
- **Status**: Confirmed present and correct

### Governance Policy (label-governance-policy.yml)
- **Never-delete list**: 43 labels that must be preserved for compatibility
- **Includes labels**: Some not present in canonical labels.yml (gap identified)
- **Key mismatches**:
  - `type:documentation` in policy vs `type:docs` in canonical
  - `type:ai-ops` in policy vs `type:aiops` in canonical
  - Additional labels (type:maintenance, type:story, type:support, type:enhancement, type:help, type:investigation) in policy but missing from canonical

### Documentation Files
- **LABEL_STRATEGY.md**: Describes 8 label families; may have gaps
- **ISSUE_LABELS.md**: Documents issue labeling workflow
- **PR_LABELS.md**: Documents PR labeling workflow
- **Other ISSUE_*.md and PR_*.md**: Specific labeling guidance
- **Gap identified**: Documentation may reference labels not in canonical file

### Archived Workflows (11 files)
- **Purpose**: Automation for label management (issue labeling, PR labeling, meta-label sync, cleanup)
- **Status**: Disabled/archived due to functionality issues
- **Analysis needed**: Why each was archived and what automation gaps remain

### GitHub API Labels (Current State)
- **Query method**: `gh label list --repo lightspeedwp/.github`
- **Expected**: All current labels should be subset of canonical file
- **Analysis needed**: Identify any orphan/undocumented labels

## Key Unknowns Resolved

✅ All technical details confirmed; no ambiguities remain.

## Implementation Approach

1. **Phase 1 (Design)**: Create data model for label taxonomy, reconciliation logic, and output contracts
2. **Phase 2 (Tasks)**: Break down into specific analysis, documentation, and report-generation tasks
3. **Phase 3+ (Implementation)**: Execute analysis according to defined tasks, generate deliverables
```

---

## Phase 1: Design & Contracts

### Entity Catalog (`data-model.md`)

```markdown
# Label Audit Data Model

## Key Entities

### Label Family
- **Definition**: Top-level category for grouping related labels (status, priority, type, area, etc.)
- **Attributes**:
  - name: string (family name without trailing colon)
  - total_count: integer (number of labels in family)
  - description: string (family purpose)
  - is_immutable: boolean (true for type: family)
  - source_file: string (canonical definition location)

### Label
- **Definition**: Individual GitHub label with metadata and usage information
- **Attributes**:
  - full_name: string (e.g., "status:in-progress")
  - family: string (category)
  - color: string (hex color code)
  - description: string (label purpose)
  - in_canonical_file: boolean
  - in_governance_policy: boolean
  - in_documentation: boolean
  - used_in_workflows: boolean (reference in archived workflows)
  - github_api_present: boolean (currently used on repository)
  - duplication_flag: string (if duplicate, reference to canonical variant)

### Reconciliation Finding
- **Definition**: Discrepancy identified between sources
- **Attributes**:
  - finding_type: enum (missing, misnamed, mismatched-color, duplicate, orphan)
  - source_label: string (label as it appears in source)
  - canonical_reference: string (how it should be)
  - affected_files: string[] (files where inconsistency appears)
  - impact_level: enum (critical, high, medium, low)
  - evidence: string (quotation or file reference)

### Workflow Analysis
- **Definition**: Assessment of archived labeling workflow
- **Attributes**:
  - workflow_file: string (path in workflows/archived/)
  - original_purpose: string (what it was meant to automate)
  - labels_referenced: string[] (labels it operated on)
  - failure_reason: string (why it was archived)
  - restoration_feasibility: enum (high, medium, low)
  - gap_filled_by: string or null (if covered by unified labeling agent)

## Relationships

- Label → Family (many-to-one)
- Label → Reconciliation Finding (one-to-many)
- Workflow Analysis → Label (many-to-many through labels_referenced)
```

### Output Contracts (`contracts/`)

```markdown
# Audit Report Schema (audit-report-schema.md)

## Structure

- **Header**: Audit date, scope, methodology
- **Executive Summary**: Key findings count, critical issues, summary recommendations
- **Label Inventory Section**: Complete catalog by family with counts and status
- **Findings Section**: 
  - Missing Labels (labels in GitHub API but not canonical)
  - Misnamed Labels (same label with different names across sources)
  - Duplicates (consolidation opportunities)
  - Governance Gaps (labels in policy but not implemented)
- **Workflow Analysis Section**: Status of each archived workflow
- **Recommendations Section**: Prioritized actions with impact assessment
- **Evidence Appendix**: Supporting data in JSON/CSV format

# Label Inventory Schema (label-inventory-schema.md)

## CSV Format

```

family,label_name,color,canonical_file,governance_policy,documentation,workflows,api_present,status
status,in-progress,1D76DB,yes,no,yes,yes,yes,CURRENT
type,documentation,9198A1,no,yes,yes,yes,no,DUPLICATE_OF_type:docs
area:ai,0F448A,C5DEF5,yes,no,yes,no,yes,MISMATCH

```

# Findings Evidence Schema (findings-evidence-schema.md)

## JSON Format per Finding

```json
{
  "finding_id": "F-001",
  "finding_type": "duplicate",
  "severity": "high",
  "title": "Type label naming inconsistency: documentation vs docs",
  "description": "...",
  "source_label": "type:documentation",
  "canonical_label": "type:docs",
  "evidence": {
    "in_governance_policy": {
      "file": ".github/label-governance-policy.yml",
      "line": 15,
      "text": "- type:documentation"
    },
    "in_canonical_file": {
      "file": ".github/labels.yml",
      "line": 183,
      "text": "- name: type:docs"
    },
    "in_issue_types": {
      "file": ".github/issue-types.yml",
      "line": 81,
      "text": "label: type:docs"
    }
  },
  "recommendation": "Governance policy should reference type:docs (canonical) not type:documentation"
}
```

```

### Validation Guide (`quickstart.md`)

```markdown
# Label Audit Validation Guide

## Quick Start: Verify Audit Findings

### Prerequisites
- GitHub CLI (`gh`) installed and authenticated
- Access to lightspeedwp/.github repository
- Bash shell for running commands

### Step 1: Extract Label Inventory

Run this to see all current labels on the repository:

\`\`\`bash
gh label list --repo lightspeedwp/.github --json name,color,description | jq .
\`\`\`

Compare output against:
- `.github/labels.yml` (canonical expected state)
- Audit report's label-inventory.csv (reconciliation findings)

**Pass Condition**: Every label in GitHub API output is documented in canonical file OR identified as an orphan/finding in the audit report.

### Step 2: Validate Type Labels (25)

Extract type labels from canonical file:

\`\`\`bash
grep "^- name: type:" .github/labels.yml | wc -l
# Should output: 25
\`\`\`

Verify each has a corresponding entry in issue-types.yml:

\`\`\`bash
grep "label: type:" .github/issue-types.yml | wc -l
# Should output: 25
\`\`\`

**Pass Condition**: Both commands output exactly 25, confirming type labels are immutable and complete.

### Step 3: Verify Governance Policy Consistency

Check governance policy never-delete list against canonical file:

\`\`\`bash
# Extract labels from policy file
grep "^ *- " .github/label-governance-policy.yml | head -20

# Compare against canonical file for each label
# (audit report will have detailed findings)
\`\`\`

**Pass Condition**: All labels in policy are present in canonical file or documented as intentional gaps in audit report.

### Step 4: Test Archived Workflow Analysis

Examine each archived workflow file:

\`\`\`bash
ls -la .github/workflows/archived/2026-09-11/labeling/
\`\`\`

For each workflow, check if its functionality is covered by:
1. Current unified labeling agent (`labeling.agent.js`)
2. Active `.github/labeler.yml` file
3. GitHub Actions workflows in `.github/workflows/` (active)

**Pass Condition**: Each archived workflow has documented assessment in audit report with reasoning for archival.

### Step 5: Documentation Consistency

Spot-check 3 random label families mentioned in docs against canonical file:

\`\`\`bash
# Example: check "status" family size in docs vs canonical
grep "^- name: status:" .github/labels.yml | wc -l
# Compare against docs/LABEL_STRATEGY.md description
\`\`\`

**Pass Condition**: Documentation descriptions align with actual label count and purposes.

## Acceptance Criteria

✅ All 3 user stories from spec have independent tests (above)
✅ No NEEDS CLARIFICATION markers in findings
✅ Every finding includes evidence (file path + line number)
✅ Recommendations are actionable and prioritized
✅ Type labels (25) remain immutable and unmodified
```

---

## Phase 1 Artifacts Generated

✅ **research.md** — Research findings and unknowns resolved
✅ **data-model.md** — Entity catalog for label audit domain
✅ **contracts/** — Output format specifications for audit reports
✅ **quickstart.md** — Validation & testing guide for audit completeness

---

**Next Step**: Run `/speckit-tasks` to decompose audit into executable tasks with clear acceptance criteria and file paths.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
