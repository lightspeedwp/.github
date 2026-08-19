---
title: Issue Fields Specification
description: Canonical specification for GitHub organization issue fields, type mappings, and project automation configuration
file_type: documentation
version: v1.0.9
created_date: '2026-05-31'
last_updated: '2026-07-23'
authors:
  - LightSpeed Team
maintainer: LightSpeed Team
owners:
  - lightspeedwp/maintainers
license: GPL-3.0
tags:
  - issue-fields
  - canonical-config
  - project-automation
  - governance
domain: governance
status: active
stability: stable
---

# Issue Fields Specification

**Version**: v1.0.9
**Created**: 2026-05-31
**Owner**: LightSpeed Team
**Reference Config**: `.github/issue-fields.yml`

**Canonical Label Limits**:

- **Single-select field options**: Max 50 per field
- **Total project fields**: Max 50 per project
- **Organisation issue fields**: Max 25 per organisation

---

## Executive Summary

This document specifies the organization-level issue fields, type mappings, and project field configuration for LightSpeed repositories. It serves as the governance layer above the technical `.github/issue-fields.yml` file, explaining the rationale for all mappings and enabling consistent automation across projects.

**Key Outcomes**:

- All 32 issue types mapped to 10 project field values (preserves domain context)
- Eliminates collapse of domain-specific types to generic "Task"
- Enables project automation based on type for better reporting and workflow
- Maintains GitHub API compatibility with existing project views

---

## 1. Issue Type Taxonomy & Project Field Mapping

### 1.1 Complete Type Mapping (32 Types → 10 Project Fields)

| Issue Type | Project Field | Rationale |
| --- | --- | --- |
| `type:bug` | Bug | Critical issues requiring fix |
| `type:feature` | Feature | New functionality/capabilities |
| `type:improve` | Feature | Enhancement to existing feature |
| `type:enhancement` | Feature | Enhancement (alias for improve) |
| `type:documentation` | Documentation | Docs, guides, specifications |
| `type:task` | Task | Generic work without specific type |
| `type:design` | Design | Design artefacts/decisions |
| `type:ui` | Design | UI implementation/consistency |
| `type:a11y` | Design | Accessibility improvements |
| `type:chore` | Chore | General maintenance tasks |
| `type:refactor` | Chore | Code quality improvements |
| `type:maintenance` | Chore | System upkeep/updates |
| `type:release` | Release | Release management/deployment |
| `type:research` | Research | Investigation/discovery/POCs |
| `type:investigation` | Research | Issue diagnosis/root cause analysis |
| `type:automation` | Automation | Workflow automation/task automation |
| `type:test` | Automation | Test coverage/infrastructure |
| `type:ai-ops` | Automation | AI operations/agents/tooling |
| `type:ci` | Automation | CI/CD pipelines |
| `type:build` | Automation | Build system improvements |
| `type:integration` | Integration | External system integrations |
| `type:dependency` | Integration | Dependency updates/management |
| `type:compatibility` | Integration | Cross-platform compatibility |
| `type:epic` | Task | Parent issue grouping stories |
| `type:story` | Task | User-centred vertical slice |
| `type:review` | Task | Peer review/QA/validation |
| `type:audit` | Task | Security/code/process audits |
| `type:question` | Task | Clarification request/open question |
| `type:support` | Task | Support request/troubleshooting |
| `type:content-modelling` | Task | Content structure/CPTs/taxonomy |
| `type:performance` | Task | Performance optimization work |
| `type:security` | Task | Security issues/improvements |

**Total Coverage**: All 32 canonical types mapped to 10 project field values; 0 unmapped types

### 1.2 Type Category Groups

```
Feature Delivery (3 types)
├── type:feature → Feature
├── type:improve → Feature
└── type:enhancement → Feature

Quality & Maintenance (3 types)
├── type:chore → Chore
├── type:refactor → Chore
└── type:maintenance → Chore

Design & UX (3 types)
├── type:design → Design
├── type:ui → Design
└── type:a11y → Design

Technical Infrastructure (5 types)
├── type:automation → Automation
├── type:test → Automation
├── type:ai-ops → Automation
├── type:ci → Automation
└── type:build → Automation

Engagement & Analysis (2 types)
├── type:research → Research
└── type:investigation → Research

Integration & Connections (3 types)
├── type:integration → Integration
├── type:dependency → Integration
└── type:compatibility → Integration

Critical Issues (1 type)
└── type:bug → Bug

Delivery Management (1 type)
└── type:release → Release

Documentation (1 type)
└── type:documentation → Documentation

Unspecified Work (1 type)
└── type:task → Task

Security (1 type)
└── type:security → Task* (*routed as Task but tracked separately)
```

---

## 2. Mapping Rationale

### 2.1 Why NOT Collapse to 4 Values?

The previous mapping (Bug, Feature, Documentation, Task) collapsed all types to 4 values:

**Problems with collapse**:

- **Loss of domain context** — Can't distinguish design work from chores in project views
- **Broken automation** — Workflows can't route based on type (e.g., security issues, accessibility work)
- **Poor reporting** — No visibility into which types consume effort (e.g., are we spending too much on research?)
- **Missed optimization** — Can't identify bottlenecks by type (e.g., feature slow? bug backlog growing?)

### 2.2 Why 10 Values (Instead of 32)?

With 10 project field values, we maintain meaningful distinctions without fragmenting project views:

**Grouping principles**:

1. **Preserve critical distinctions** (Bug vs. Feature vs. Documentation) — these must remain separate
2. **Group related workflows** (Design/UX/Accessibility work → Design)
3. **Balance practical limits** — GitHub recommends <20 project field options for usability
4. **Enable key automations** (Release, Research, Integration work need visibility)
5. **Keep security trackable** (routed as Task but labelled separately for filtering)

---

## 3. Project Field Configuration

### 3.1 Universal Project Fields

GitHub supports a maximum of 25 project fields per organisation (`max_issue_fields_per_org: 25`). Our current configuration uses 15 fields (5 universal + 10 specialised domain fields), leaving room for future expansion. Single-select fields may define up to 50 options (`single_select_max_options: 50`), and the project as a whole is capped at 50 total fields (`project_total_field_limit: 50`).

All organization issues support these fields:

| Field | Type | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| **Priority** | single_select | Critical, Important, Normal, Minor | No | Current importance level |
| **Effort** | single_select | XS, S, M, L, XL, XXL, XXXL | No | Relative sizing estimate |
| **Type** | single_select | Bug, Feature, Design, Chore, Automation, Research, Documentation, Integration, Release, Task | No | **Expanded mapping** — all 32 types covered |
| **Start date** | date | YYYY-MM-DD | No | Planned start date |
| **Target date** | date | YYYY-MM-DD | No | Expected completion date |

### 3.2 Custom Fields (Domain-Specific)

| Field | Type | Options | Default | Applies To |
| --- | --- | --- | --- | --- |
| **Domain** | single_select | Dotgithub Governance, WordPress Block Theme, WordPress Block Plugin, WooCommerce, Platform/CI | Dotgithub Governance | All issue types |
| **Delivery Track** | single_select | Governance, Product, Infrastructure, Release, Support | Governance | All issue types |
| **Team** | single_select | Core, AI Ops, Theme, Plugin, QA | AI Ops | All issue types |
| **Risk** | single_select | Low, Medium, High | Medium | High-effort or complex issues |
| **Customer Impact** | single_select | Low, Medium, High | Medium | External-facing changes |
| **Technical Impact** | single_select | Low, Medium, High | Medium | System-wide or cross-team changes |

### 3.3 Enabled Issue Types (GitHub Native)

These are the GitHub native issue types supported by the organization:

- Bug
- Feature
- Task
- Epic
- Maintenance
- Chore
- Research
- Support
- Documentation
- Release

All LightSpeed custom types (type:design, type:automation, etc.) are mapped to these native types in `.github/issue-fields.yml`.

---

## 4. Type Mapping Details

### 4.1 Critical Types (No Collapsing)

| Type | Project Field | Reasoning |
| --- | --- | --- |
| Bug | Bug | Critical issues; must be separately tracked and triaged |
| Feature | Feature | Core delivery work; enables roadmap and progress tracking |
| Documentation | Documentation | Essential for knowledge management and onboarding |
| Release | Release | Distinct workflow requiring release planning and coordination |

### 4.2 Grouped Types (By Domain)

**Design & UX Group** → Project Field: Design

- `type:design` — Design system, component design, layout work
- `type:ui` — UI implementation, visual consistency
- `type:a11y` — Accessibility improvements, compliance

*Rationale*: These are related to user-facing design work and often share stakeholders (designers, UX researchers).

**Quality & Maintenance Group** → Project Field: Chore

- `type:chore` — General maintenance tasks
- `type:refactor` — Code quality improvements (previously unmapped)
- `type:maintenance` — System upkeep, dependency updates

*Rationale*: All improve code quality and system health; often low priority but necessary.

**Automation & Infrastructure Group** → Project Field: Automation

- `type:automation` — Workflow automation, task automation
- `type:test` — Test coverage, test infrastructure
- `type:ai-ops` — AI operations, tooling, agent work
- `type:ci` — CI/CD pipelines, GitHub Actions
- `type:build` — Build system improvements (previously unmapped)

*Rationale*: All enable or improve development velocity and infrastructure reliability.

**Integration & Dependencies Group** → Project Field: Integration

- `type:integration` — External system integrations
- `type:dependency` — Dependency updates, version management
- `type:compatibility` — Compatibility improvements, cross-platform work

*Rationale*: All involve external systems or dependencies.

**Analysis & Exploration Group** → Project Field: Research

- `type:research` — Investigations, proof-of-concepts
- `type:investigation` — Issue diagnosis, root cause analysis

*Rationale*: Both are exploratory work with uncertain scope/duration.

### 4.3 Catch-All Type

| Type | Project Field | Reasoning |
| --- | --- | --- |
| Task | Task | Generic work items without more specific type; fallback for unclassified work |

---

## 5. Migration Path

### Phase 1: Configuration Update (Current)

- ✅ Document expanded mapping (this file)
- ✅ Update `.github/issue-fields.yml` with all 32 type mappings
- ✅ Verify no unmapped types (all 32 types now mapped)

### Phase 2: Validation (Issue #684 - Type Naming)

- Verify all 32 types are correctly used in existing issues
- Update type naming consistency across the repository
- Document any type aliases or deprecated types

### Phase 3: Documentation Updates (Issue #685)

- Update LABELING.md with new type mapping reference
- Create type selection guide for contributors
- Update project automation rules to leverage new type field values

---

## 6. Usage Examples

### 6.1 Issue Creation: Feature Request

```yaml
Issue Type: Feature
Type Label: type:feature
Project Field Type: Feature
Priority: High
Effort: L
Domain: WordPress Block Plugin
Delivery Track: Product
```

### 6.2 Issue Creation: Accessibility Improvement

```yaml
Issue Type: Feature (or Task)
Type Label: type:a11y
Project Field Type: Design
Priority: Medium
Effort: M
Domain: WordPress Block Plugin
Delivery Track: Product
Customer Impact: High
```

### 6.3 Issue Creation: Build System Improvement

```yaml
Issue Type: Chore
Type Label: type:build
Project Field Type: Automation
Priority: Normal
Effort: XL
Domain: Platform/CI
Delivery Track: Infrastructure
Technical Impact: High
```

---

## 7. Governance & Maintenance

### 7.1 Adding New Types

When adding a new issue type:

1. Add to `labels.yml` with appropriate color (per Color Strategy)
2. Determine project field mapping (use existing groups or create new group)
3. Update this document with rationale
4. Update `.github/issue-fields.yml` with mapping
5. Update type selection guidance for contributors

### 7.2 Changing Mappings

Mapping changes require:

1. **Analysis**: Document why the current mapping is insufficient
2. **Validation**: Check impact on existing issues and project views
3. **Coordination**: Notify relevant teams of changes
4. **Documentation**: Update this file and `.github/issue-fields.yml`
5. **Migration**: Plan for remapping existing issues if necessary

### 7.3 Review Cycle

This specification should be reviewed:

- Annually (or on schedule)
- When new type categories are introduced
- When project automation needs change
- When GitHub's issue type capabilities expand

---

## 8. Relationship to Other Specifications

- **Color Strategy** (`docs/LABEL_COLOR_STRATEGY.md`) — Defines color for each type label
- **Labeling Guide** (`docs/LABELING.md`) — Explains when to use each type label
- **Canonical Config** (`.github/issue-fields.yml`) — Technical implementation
- **Issue-Types** (`.github/issue-types.yml`) — GitHub native type definitions

---

## 9. Accessibility & Usability

### 9.1 Project Field Usability

With 10 project field values, the Type field remains:

- **Scannable** — Users can quickly distinguish types in project views
- **Meaningful** — Each value conveys distinct semantic information
- **Actionable** — Values can inform routing and automation decisions

### 9.2 Label vs. Project Field

Why both exist:

- **Labels** (`type:*`) — Used in issue workflows, automation, CLI (lightweight)
- **Project Fields** → Used for project views, reporting, GitHub UI (first-class citizen)

---

## 10. Changelog

| Date | Change | Author |
| --- | --- | --- |
| 2026-05-31 | Initial specification v1.0.0 — 32 type → 10 project field mapping | LightSpeed Team |

---

**Document Status**: ✅ Active
**Last Updated**: 2026-05-31
**Next Review**: 2027-05-31 (annual)
**Owner**: LightSpeed Team

---

## 11. Domain & Team Profiles

This specification applies to all LightSpeed domain areas:

- **dotgithub** — .github governance, automation, standards, release hygiene
- **wordpress_block_theme** — Gutenberg theme architecture, design tokens, templates
- **wordpress_block_plugin** — Block/plugin behaviour, editor UX, integrations

## 12. Project Field Features

The following project field features are enabled across all LightSpeed repositories:

- **Sub-issue progress** — Tracking child issue completion
- **Linked pull requests** — Connecting issues to PRs
- **Reviewers** — Assigning code reviewers
- **Sprint** — Iteration field for sprint planning
- **Priority** — Issue importance level (Critical, Important, Normal, Minor)
- **Effort** — Relative sizing (XS, S, M, L, XL, XXL, XXXL)
- **Type** — 10 semantic project fields (Bug, Feature, Design, Chore, Automation, Research, Documentation, Integration, Release, Task)
- **date** — Start and target dates
- **text** — Spec Link and other custom text fields
- **single_select** — Domain, Delivery Track, Team, Risk, Customer Impact, Technical Impact

Managed via `.github/workflows/project-meta-sync.yml` automation.

Current workflow contract:

**Project board fields** (via `project-meta-sync.yml`):

- Workflow writes `Status`, `Priority`, `Type`, `Effort`, `Start date`, and `Target date` to the project board
- `Start date` and `Target date` are only populated when kickoff metadata is present
- If labels arrive after creation, the sync workflow reprocesses the item and backfills `Type` and `Priority`

**Org-level issue fields** (via `metadata-governance.yml`):

- Infrastructure in place (`updateOrgIssueFields` function in `issue-pr-metadata.cjs`)
- Requires org admin to configure field ID mappings (issue #1145)
- Currently disabled pending field ID configuration
- When enabled, will write Domain, Delivery Track, Team, Risk, Customer Impact, Technical Impact directly to the issue

**Setup for org issue fields** (pending #1145):

1. Org admin queries for custom field IDs via GraphQL:

   ```graphql
   query {
     organization(login: "lightspeedwp") {
       customFields(first: 20) {
         nodes {
           id
           name
           projectNext {
             id
           }
         }
       }
     }
   }
   ```

2. Create mapping in `.github/issue-field-ids.yml` (example):

   ```yaml
   field_ids:
     Domain: "PVTF_<id1>"
     Delivery Track: "PVTF_<id2>"
     Team: "PVTF_<id3>"
   ```

3. Reference in `metadata-governance.yml` and enable the writer

Verification record: `.githu./.github/reports/audits/2026-06-07-private-project-issue-field-write-verification-879.md`.

**Note**: Org-level field writing is not yet implemented. The infrastructure (GraphQL mutations, field discovery) is pending development as part of issue #1145 (org issue-field writer infrastructure).

Default assignee: ashleyshaw

Status mappings:

- Open: status:ready
- In progress: status:in-progress
- Needs review: status:needs-review
- In QA: status:needs-qa
- Blocked: status:blocked
- On hold: status:on-hold
- Needs more info: status:needs-more-info
- Closed: status:done

Priority mappings:

- Critical: priority:critical
- Important: priority:important
- Normal: priority:normal
- Minor: priority:minor

Default priority: priority:normal

- Default type: type:task
- Status workflow values: status:needs-triage, status:needs-planning, status:needs-more-info

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
