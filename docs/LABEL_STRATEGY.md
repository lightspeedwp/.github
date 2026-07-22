---
title: Label Strategy & Governance
description: Comprehensive label strategy defining the taxonomy, colour families, assignment rules, and maintenance processes for 158 canonical labels
file_type: documentation
version: v1.0.2
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
  - labeling-strategy
  - governance
  - canonical-config
domain: governance
status: active
stability: stable
---

# Label Strategy & Governance

**Version**: v1.0.2
**Created**: 2026-05-31
**Owner**: LightSpeed Team
**Reference Config**: `.github/labels.yml`, `.github/labeler.yml`

---

## Executive Summary

This document establishes the comprehensive label strategy for the LightSpeed `.github` repository. It defines the taxonomy of 158 canonical labels, their organization into semantic families, colour assignments, and the rules for applying labels to issues and PRs.

**Strategic Goals**:

- Reduce colour fragmentation whilst maintaining semantic clarity
- Establish predictable, maintainable label assignment patterns
- Enable consistent automation across all repositories
- Support efficient triage, filtering, and reporting workflows
- Provide clear guidance for AI agents and humans creating issues/PRs

---

## 1. Label Taxonomy

### 1.1 Primary Categories (7 Core Families, 158 Labels)

The canonical labels are organized into seven core families, with supporting cross-cutting families documented in the inventory:

| Family | Count | Purpose | Key Labels |
| --- | --- | --- | --- |
| **Status** | 20 | Workflow state and blockers | needs-planning, ready, in-progress, needs-review, blocked |
| **Priority** | 4 | Urgency and impact | critical, important, normal, minor |
| **Type** | 32 | Work category/classification | bug, feature, documentation, task, design, chore, and 26 more |
| **Area** | 20+ | Component or domain | block-editor, theme, ci, labels, security, tests |
| **Language** | 7 | Programming/markup language | js, php, css, json, yaml, html, md |
| **Discussion** | 7 | Discussion/meta categories | announcement, showcase, community, feedback, support |
| **Meta** | 16 | Automation & process markers | has-pr, needs-changelog, blocked-by, duplicate |

**Total**: 158 labels across 7 core families

---

## 2. Label Family Definitions

### 2.1 Status Labels (20 Labels)

**Purpose**: Track work state through various lifecycle stages

**Workflow Stages**:

- **Planning Phase**: `status:needs-planning`, `status:needs-triage`
- **Ready Phase**: `status:ready`
- **Active Phase**: `status:in-progress`
- **Input/Blockers**: `status:needs-review`, `status:needs-design`, `status:needs-figma-update`, `status:needs-dev`, `status:needs-qa`
- **On Hold**: `status:on-hold`
- **Blocked**: `status:blocked`, `status:blocked-by`
- **Resolved**: `status:done`, `status:done-wontfix`, `status:duplicate`

**Assignment Rules**:

- Assign exactly one status label per issue (except `status:blocked-by` which supplements others)
- Update status as work progresses through lifecycle
- Use `status:blocked` when external factors prevent progress
- Use `status:needs-*` to indicate next required input

### 2.2 Priority Labels (4 Labels)

**Purpose**: Signal urgency and business impact

**Levels** (in descending urgency):

- `priority:critical` — Breaking issue, production down, release blocker
- `priority:important` — Important feature or significant bug; impacts many users
- `priority:normal` — Default; no special urgency; normal feature, moderate impact
- `priority:minor` — Nice-to-have enhancement; can be deferred; backlog items

**Assignment Rules**:

- Assign one priority label per issue (default: `priority:normal`)
- `priority:critical` reserved for production incidents only
- Use `priority:important` for planned quarterly work
- Use `priority:minor` for backlog items without committed timeline

### 2.3 Type Labels (32 Labels)

**Purpose**: Classify work by type and enable project automation

**Primary Types** (9 high-level):

- `type:bug` — Broken/incorrect behaviour
- `type:feature` — New capability or enhancement
- `type:documentation` — Docs, guides, specs
- `type:task` — Work without specific type
- `type:design` — Design artefacts/decisions
- `type:chore` — Maintenance, hygiene, housekeeping
- `type:test` — Testing, test coverage, QA
- `type:refactor` — Internal restructure, no UX change
- `type:automation` — Bots, actions, scripts, tooling

**Specialised Types** (16 additional):

- `type:epic`, `type:story` — Narrative/planning
- `type:audit`, `type:research`, `type:review` — Investigation/validation
- `type:security`, `type:a11y`, `type:performance`, `type:compatibility` — Quality attributes
- `type:integration`, `type:ai-ops`, `type:maintenance`, `type:improve` — Domain-specific
- `type:question`, `type:support`, `type:content-modelling` — Special workflows

**Assignment Rules**:

- Assign one primary type per issue
- Type labels drive project field automation (see `docs/ISSUE_FIELDS.md`)
- See `docs/ISSUE_TYPES.md` for detailed type decision tree

### 2.4 Area Labels (20+ Labels)

**Purpose**: Identify component, module, or domain

**Examples**:

- Code domains: `area:block-editor`, `area:theme`, `area:woocommerce`
- Infrastructure: `area:ci`, `area:security`, `area:dependencies`, `area:labels`
- Horizontal concerns: `area:a11y`, `area:documentation`, `area:quality`, `area:tests`, `area:scripts`

**Assignment Rules**:

- Assign area labels when work is localised to a component
- Multiple area labels allowed (e.g., a security fix to CI could have both `area:security` and `area:ci`)
- Not required for cross-cutting work

### 2.5 Language Labels (7 Labels)

**Purpose**: Identify primary programming language

**Labels**: `lang:js`, `lang:php`, `lang:css`, `lang:json`, `lang:yaml`, `lang:html`, `lang:md`

**Assignment Rules**:

- Assign when file changes are language-specific
- Prefer most-changed language if multi-language change
- Omit if changes are platform/framework agnostic

### 2.6 Discussion Labels (7 Labels)

**Purpose**: Categorise GitHub Discussions (not applicable to issues/PRs)

**Labels**: `discussion:announcement`, `discussion:showcase`, `discussion:community`, `discussion:feedback`, `discussion:support`, `discussion:sponsorship`, `discussion:partnership`

**Assignment Rules**:

- Only apply to GitHub Discussions
- Exactly one per discussion (they're mutually exclusive)

### 2.7 Meta Labels (16 Labels)

**Purpose**: Track automation markers, blockers, and process state

**Common Meta Labels**:

- `meta:has-pr` — Issue with associated PR
- `meta:needs-changelog` — Change requires CHANGELOG entry
- `meta:blocked-by` — Blocked by another issue
- `meta:duplicate` — Duplicate of existing issue

**Assignment Rules**:

- Applied automatically by labeling workflows where possible
- Update as status changes (e.g., add `meta:has-pr` when PR created)
- Clear stale meta labels when conditions no longer apply

---

## 3. Colour Strategy

The complete color strategy is documented in [`docs/LABEL_COLOR_STRATEGY.md`](./LABEL_COLOR_STRATEGY.md). Key principles:

- **8 colour families** reduce cognitive load whilst maintaining semantic clarity
- Each family serves a specific semantic purpose (ready/done, blocked/urgent, testing, etc.)
- Colours are chosen for accessibility (WCAG 2.2 AA contrast minimum)
- Related labels within a family use consistent colours
- New labels default to established family colours, not ad-hoc selections

---

## 4. Labeling Workflows

### 4.1 Issue Creation

When creating an issue:

1. **Always assign**: Type label (required), Status label (defaults to `status:needs-triage` or `status:needs-planning`)
2. **Usually assign**: Priority label (defaults to `priority:normal`), Area label (if domain-specific)
3. **May assign**: Language label (if code-specific), Meta labels (if applicable)
4. **Never assign**: Discussion labels (issues only, not discussions)

**Automation**: The labeling workflow applies type and status labels automatically based on issue template selection. Teams may adjust priority/area as needed.

### 4.2 PR Creation

When creating a PR:

1. **Required**: Type label (bug-fix, feature, docs, etc.)
2. **Usually**: Area label (if domain-specific), Language label (if code-specific)
3. **May**: Meta labels like `meta:needs-changelog`
4. **Status**: PRs don't receive status labels (GitHub PR workflow handles state)

**Automation**: Labeling workflow applies type labels based on branch naming convention (e.g., `fix/*` → `type:bug`, `feat/*` → `type:feature`).

### 4.3 Label Maintenance

**Quarterly Review**:

- Audit label usage and identify deprecated labels
- Check color consistency and accessibility
- Document any new labels added during the quarter
- Retire unused labels (document retirement rationale)

**Monthly Triage**:

- Review issues with stale labels (e.g., `status:needs-review` >30 days without action)
- Validate meta labels align with actual state (e.g., `meta:has-pr` still true?)
- Update priority labels if context changes

---

## 5. Label Accessibility

All labels meet WCAG 2.2 AA contrast requirements:

- Foreground text: #FFFFFF (white) or #000000 (black) depending on background luminance
- Minimum contrast ratio: 4.5:1
- Colour is never the only indicator of meaning (always accompanied by label text)

---

## 6. Extending the Label System

### Adding a New Label

1. **Identify the family**: Does it belong to Status, Type, Area, Language, Meta, or Discussion?
2. **Choose a colour**: Use the colour family for its semantic purpose (see `LABEL_COLOR_STRATEGY.md`)
3. **Write description**: 1-2 sentences explaining when to use (not what it is)
4. **Update files**:
   - Add to `.github/labels.yml` with name, colour, description
   - Update `.github/labeler.yml` if it affects PR/branch labeling
   - Add reference to relevant documentation (ISSUE_TYPES.md, LABEL_INVENTORY.md, etc.)
5. **Validate**: Run `npm run validate:json` and linting checks
6. **Document**: Add to CHANGELOG.md and LABEL_INVENTORY.md

### Retiring a Label

1. **Document rationale**: Why is this label no longer useful?
2. **Migrate existing labels**: Reassign issues/PRs to replacement label if applicable
3. **Remove from configs**: Remove from `.github/labels.yml` and `.github/labeler.yml`
4. **Update documentation**: Add deprecation note to CHANGELOG.md and LABEL_INVENTORY.md
5. **Communicate**: Announce retirement to team and in relevant docs

---

## 7. Related Documentation

- [`docs/LABEL_COLOR_STRATEGY.md`](./LABEL_COLOR_STRATEGY.md) — Detailed colour assignments and justifications
- [`docs/LABEL_INVENTORY.md`](./LABEL_INVENTORY.md) — Complete inventory of all 158 labels by family
- [`docs/ISSUE_TYPES.md`](./ISSUE_TYPES.md) — Type definitions and decision tree
- [`docs/ISSUE_FIELDS.md`](./ISSUE_FIELDS.md) — Project field mappings and rationale
- [`.github/labels.yml`](../.github/labels.yml) — Canonical label definitions
- [`.github/labeler.yml`](../.github/labeler.yml) — Automated labeling rules
- [`docs/LABELING.md`](./LABELING.md) — General labeling guide and best practices

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
