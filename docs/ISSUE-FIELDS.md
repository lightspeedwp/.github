# Canonical Issue Fields

Primary operations reference: [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md)

This document explains how LightSpeedWP defines and operates canonical GitHub issue/project fields.

Source of truth:

- [`.github/issue-fields.yml`](../.github/issue-fields.yml)

## Scope

The canonical model is used for:

- `.github` governance and AI ops infrastructure work.
- WordPress block theme development work.
- WordPress block plugin development work.

## Field Model Overview

The canonical YAML defines four layers:

- `defaults`: label defaults for issues and PRs.
- `project_field_mappings`: mapping from label families to project fields (`Status`, `Priority`, `Type`).
- `organization_issue_fields`: organization-level issue fields and limits.
- `project_fields`: project-only field behaviour (hidden fields and iteration setup).

## Canonical Defaults

Issues:

- Assignee: `ashleyshaw`
- Open status: `status:ready`
- Closed status: `status:done`
- Default priority: `priority:normal`
- Default type: `type:task`

PRs:

- Open status: `status:needs-review`
- Merged/closed status: `status:done`
- Default priority: `priority:normal`
- Default type: `type:chore`

## Project Field Mapping (Label -> Project Field)

Project field values are derived from labels using `project_field_mappings` in `.github/issue-fields.yml`.

Current synced fields:

- `Status`
- `Priority`
- `Type`

Canonical `Status` label mappings:

- `status:needs-triage` -> `Triage`
- `status:needs-planning` -> `Triage`
- `status:ready` -> `Ready`
- `status:in-progress` -> `In progress`
- `status:needs-review` -> `In review`
- `status:needs-qa` -> `In QA`
- `status:blocked` -> `Blocked`
- `status:on-hold` -> `On hold`
- `status:done` -> `Done`

Canonical `Priority` label mappings:

- `priority:critical` -> `Critical`
- `priority:important` -> `Important`
- `priority:normal` -> `Normal`
- `priority:minor` -> `Minor`

Canonical `Type` project mapping uses:

- `type:bug` -> `Bug`
- `type:feature` -> `Feature`
- `type:documentation` -> `Documentation`
- most other `type:*` values -> `Task`

These values are applied by the project metadata workflow:

- [`.github/workflows/project-meta-sync.yml`](../.github/workflows/project-meta-sync.yml)

## Organization Issue Fields (Native GitHub Fields)

The org model includes:

- Enabled issue types (for example `Bug`, `Feature`, `Task`, `Epic`, `Release`).
- Pinned fields per issue type (up to GitHub limit of `10`).
- Custom issue fields:
- `Domain` (`single_select`)
- `Delivery Track` (`single_select`)
- `Team` (`single_select`)
- `Effort` (`single_select`)
- `Start date` (`date`)
- `Target date` (`date`)
- `Risk` (`single_select`)
- `Customer Impact` (`single_select`)
- `Technical Impact` (`single_select`)
- `Spec Link` (`text`)

## Canonical Universal Fields (Apply To All Issue Types)

These fields are pinned for all issue types, including issues with no assigned type.

Issue types covered:

- Unassigned (no issue type)
- Task, Bug, Feature, Refactor, Build, Accessibility, Compatibility, Security, Release
- Maintenance, Performance, Testing, Epic, Automation, Review, Design, Story
- Improvement, Documentation, Integration, Research, Chore, Audit, AI Ops, Content Modelling

### 1) Priority

- Purpose: Current importance level assigned to the issue.
- Type: `single_select`
- Allowed values: `Urgent`, `High`, `Medium`, `Low`
- Scope: Applies to all issue types.

### 2) Start date

- Purpose: Date when work on the issue will begin.
- Type: `date`
- Scope: Applies to all issue types.
- Constraint: Organization-only issue field.

### 3) Target date

- Purpose: Expected completion date for the issue.
- Type: `date`
- Scope: Applies to all issue types.
- Constraint: Organization-only issue field.

### 4) Effort

- Purpose: Relative sizing estimate for implementation effort.
- Type: `single_select`
- Allowed values: `XS`, `S`, `M`, `L`, `XL`, `XXL`, `XXXL`
- Scope: Applies to all issue types.
- Constraint: Organization-only issue field.

## How To Use These Fields During Triage

- Set `Priority` on creation or first triage for every issue.
- Set `Start date` when work is scheduled to begin.
- Set `Target date` when there is a delivery expectation.
- Set `Effort` as a T-shirt size estimate before planning or assignment.
- Keep these issue fields aligned with labels and project fields during updates.

## Project Fields (Hidden/System + Iteration)

Enable hidden/system fields in project views:

- `Parent issue`
- `Sub-issue progress`
- `Linked pull requests`
- `Reviewers`
- `Type`

Iteration setup:

- Iteration field key: `Sprint`
- 2-week cadence
- auto-create new iterations
- breaks allowed between iterations

## Limits and Constraints

GitHub limits reflected in the canonical policy:

- `25` issue fields per organization
- `50` options per single select field
- `10` pinned issue fields per issue type
- `50` total fields per project (issue fields + system fields)

Issue fields are currently in public preview and may change.

## Profiles

The YAML also defines profile-specific label guidance:

- `dotgithub`
- `wordpress_block_theme`
- `wordpress_block_plugin`

Use these profiles when deciding `area:*` and `comp:*` labels so triage stays consistent across governance and WordPress delivery work.

## Operational Rules

- Keep one `status:*`, one `priority:*`, and one `type:*` label per issue.
- Closed issues should use `status:done`.
- Use profile guidance for `area:*` and `comp:*` labels where relevant.
- If a custom field is renamed, update `.github/issue-fields.yml`, this document, and validators in the same PR.
- Before deleting a custom field, migrate affected data/views first, then update canonical YAML/docs/validators.
- If a new canonical value is needed, update `.github/issue-fields.yml` first, then update this document.
