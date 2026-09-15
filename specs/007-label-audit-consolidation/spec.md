# Feature Specification: GitHub Label Audit & Consolidation

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

**Feature Branch**: `audit/github-label-audit`

**Created**: 2026-09-14

**Status**: Draft

**Input**: Comprehensive audit of GitHub label taxonomy across `.github` repository, including analysis of canonical labels, issue types, governance policy, documentation, and archived labeling workflows.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audit Team Discovers Label Family Inconsistencies (Priority: P1)

As a GitHub governance administrator, I need to understand which labels exist in the system but are missing from the canonical `labels.yml` file, and which labels are documented in supporting files (governance policy, issue-types mapping) but have different names or implementations than what's in the canonical file.

**Why this priority**: This is the foundation for the entire audit. Without understanding what's missing and what's inconsistent, we cannot make informed decisions about consolidation or expansion. This directly blocks planning remediation steps.

**Independent Test**: Audit can be fully completed by comparing:

1. Current canonical `labels.yml` (147 labels across 15 families)
2. `issue-types.yml` (25 type labels with mappings)
3. `label-governance-policy.yml` (never-delete list)
4. All documentation files (`LABEL_*.md`, `ISSUE_*.md`, `PR_*.md`)
5. Archived workflow definitions
6. GitHub API labels currently in use on the repository

And delivering a reconciliation report showing:

- Missing labels (exist in GitHub but not in canonical file)
- Misnamed labels (e.g., `type:documentation` vs `type:docs`)
- Duplicate labels across families
- Labels referenced in workflows but not in canonical file

**Acceptance Scenarios**:

1. **Given** the canonical `labels.yml` has 147 labels across 15 families, **When** we compare against governance policy never-delete list, **Then** we identify which labels in the policy don't exist in canonical file or have different names
2. **Given** the `issue-types.yml` defines 25 type labels with specific mappings, **When** we cross-reference with labels.yml type family, **Then** we confirm all 25 type labels are present and identify any mismatches (e.g., `type:documentation` vs `type:docs`)
3. **Given** documentation files (LABEL_*.md, ISSUE_*.md, PR_*.md) describe labeling strategy and taxonomy, **When** we audit these against canonical file, **Then** we identify what's documented but not implemented
4. **Given** 11 archived workflows in `.github/workflows/archived/2026-09-11/labeling/`, **When** we analyze these workflows, **Then** we identify what labels they were trying to manage and why they were archived

---

### User Story 2 - Identify & Catalog Duplicate Labels (Priority: P2)

As an automation engineer, I need to identify all duplicate labels that should be consolidated (e.g., `type:documentation` should merge into `type:docs`), so we can plan a consolidation strategy that doesn't break existing automation or user workflows.

**Why this priority**: Once we know what's inconsistent, we need to identify duplicates that represent the same concept with different naming. This enables informed decisions about which labels to keep and which to retire.

**Independent Test**: Completed by creating a detailed catalog of:

- All label families with duplicates marked
- Suggested consolidation pairs (source → target)
- Impact analysis (which workflows/automations use each label)
- Migration strategy (renaming, aliasing, or deprecation timeline)

**Acceptance Scenarios**:

1. **Given** `type:documentation` exists in policy but `type:docs` is canonical, **When** we analyze usage, **Then** we identify which should be the source of truth and plan migration
2. **Given** area labels like `area:ai`, `area:agents`, `area:skills`, `area:instructions`, `area:prompts` might overlap conceptually, **When** we audit their definitions and usage, **Then** we determine if any should be consolidated or if they serve distinct purposes
3. **Given** multiple families might have labeling gaps, **When** we identify all labels across families that lack documentation or policy definition, **Then** we flag these as potential duplicates or policy issues

---

### User Story 3 - Audit Archived Labeling Workflows & Plan Restoration (Priority: P3)

As a DevOps/automation lead, I need to understand why 11 labeling workflows were archived, what they were meant to do, and whether they should be restored or replaced with improved implementations.

**Why this priority**: The workflows are archived because they're not working properly. Understanding their purpose and issues is critical for either fixing them or designing better solutions. This supports future automation improvements.

**Independent Test**: Completed by delivering:

- Analysis of each archived workflow (purpose, implementation, failure points)
- Root cause assessment (why each was archived)
- Recommendations (restore, rebuild, or retire)
- Implementation plan for restoring working workflow automation

**Acceptance Scenarios**:

1. **Given** 11 archived workflow files in `workflows/archived/2026-09-11/labeling/`, **When** we analyze each workflow's logic and failure points, **Then** we document what each was attempting to automate and why it failed
2. **Given** labeling automation is critical to issue/PR routing and release workflows, **When** we assess the archived workflows, **Then** we identify which automation gaps still exist and need to be filled
3. **Given** the unified labeling agent and workflow are meant to be the single source for labeling automation, **When** we review archived workflows, **Then** we confirm they're duplicates/obsolete or identify legitimate gaps in current automation

---

### Edge Cases

- What happens when a label exists in GitHub but nowhere in our documentation (orphan labels)?
- How are labels that were accidentally created (typos, test labels) identified and marked for cleanup?
- What if workflows reference labels that no longer align with the current taxonomy?
- How do we handle labels that exist but have zero usage (dormant labels)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST identify and catalog all labels currently defined in the canonical `labels.yml` file, organized by family, with counts and descriptions
- **FR-002**: System MUST extract all type labels from `issue-types.yml` and verify each has a corresponding entry in `labels.yml` with matching name and color
- **FR-003**: System MUST compare canonical labels against the `label-governance-policy.yml` never-delete list and identify:
  - Labels in the policy that don't exist in canonical file
  - Labels with name mismatches between files (e.g., `type:documentation` vs `type:docs`)
  - Labels with different color assignments
- **FR-004**: System MUST audit all documentation files (`docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md`) against canonical labels and identify:
  - Labels mentioned in docs that aren't in canonical file
  - Discrepancies between documented behavior and actual label definitions
  - Documentation gaps for labels that exist in canonical file
- **FR-005**: System MUST analyze all 11 archived workflow files in `.github/workflows/archived/2026-09-11/labeling/` and extract:
  - Purpose/intent of each workflow
  - Labels referenced in each workflow
  - Apparent failure points or design issues
  - Relationships to the current unified labeling agent
- **FR-006**: System MUST query GitHub API to identify labels currently in use on the `.github` repository that may not be in the canonical file (orphan/undocumented labels)
- **FR-007**: System MUST identify potential duplicate labels (multiple labels that represent the same concept with different naming conventions)
- **FR-008**: System MUST preserve the immutability of `type:*` family (exactly 25 labels from `issue-types.yml` must not change)
- **FR-009**: System MUST NOT edit locked configuration files (`labels.yml`, `issue-types.yml`, `label-governance-policy.yml`) - audit only
- **FR-010**: System MUST document assumptions about which labels can be consolidated vs. which must be preserved due to existing automation

### Key Entities

- **Label Families**: status, priority, type, meta, release, area, comp, lang, env, compat, cpt, ai-ops, contrib, discussion, openspec (and any others discovered during audit)
- **Type Labels**: 25 labels that map to GitHub issue types (immutable - defined in `issue-types.yml`)
- **Canonical Labels**: The 147 labels currently defined in `.github/labels.yml`
- **Governance Policy**: The never-delete label list and related rules in `label-governance-policy.yml`
- **Archived Workflows**: 11 workflow files that were disabled due to non-functional status
- **Documentation**: All files describing label taxonomy and labeling strategy
- **GitHub API Labels**: Current labels in use on the repository (retrieved via API)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Audit report identifies all missing labels (those in GitHub but not in canonical file) with 100% accuracy
- **SC-002**: Audit report identifies all label mismatches (different names/colors between files) with 100% accuracy
- **SC-003**: All 25 type labels from `issue-types.yml` are verified as present and correct in canonical file with no changes recommended
- **SC-004**: Audit report identifies ALL duplicate/overlapping labels across families, ranked by consolidation impact and usage frequency
- **SC-005**: All 11 archived workflows are analyzed with documented findings (purpose, issues, recommendations) for each
- **SC-006**: Audit identifies 0 (zero) discrepancies between canonical `labels.yml` and its documented purpose as "single source of truth"
- **SC-007**: Audit creates a prioritized roadmap for label family expansion, cleanup, and workflow restoration
- **SC-008**: All audit findings can be traced to specific files/sections (quotable evidence)

## Assumptions

- The canonical `labels.yml` file is considered final and the baseline for this audit (no recommendations to change existing labels unless duplicates are identified)
- The 25 type labels in `issue-types.yml` are immutable and must not be changed as part of this audit
- The `label-governance-policy.yml` never-delete list contains labels that may not be in the canonical file, and this is intentional (represents labels that must be preserved for historical or compatibility reasons)
- Archived workflows were disabled due to conflicts, performance issues, or obsolescence rather than planned retirement
- GitHub API has labels currently assigned to issues/PRs that represent the true system state of labels in use
- Documentation files (LABEL_*.md, ISSUE_*.md, PR_*.md) reflect intended labeling strategy even if implementation gaps exist
- The unified labeling agent (`labeling.agent.js` / `labeling.yml`) is the current and future canonical source for label automation
- Future work will address workflow restoration and label expansion, but this audit focuses on analysis and documentation
- No label merging or deletion will occur as part of this audit (read-only analysis)
- The repository structure and conventions follow UK English spelling and LightSpeed coding standards (from CLAUDE.md)

## Phase Outcome

This specification results in a **comprehensive audit report** documenting:

1. Complete label inventory and family taxonomy
2. All mismatches and inconsistencies between files
3. Identified duplicate/overlapping labels (with consolidation recommendations)
4. Analysis of archived workflows and automation gaps
5. Prioritized roadmap for label governance improvements
6. Documented evidence for all findings (with file/line references)

The audit itself makes no changes to the production label configuration. It serves as the foundation for a future consolidation and workflow restoration task.

## Clarifications

### Session 2026-09-14

- Q: Should the audit identify and consolidate exactly 5-10 duplicate labels, or is that range just an estimate? → A: Find ALL possible duplicate/overlapping labels and report them ranked by consolidation impact. This gives the governance team complete visibility rather than artificially limiting analysis.

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
