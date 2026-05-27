# Canonical Issue Fields

This file defines the canonical issue and PR field model used in this repository.

Source of truth:

- [`.github/issue-fields.yml`](../.github/issue-fields.yml)

## Scope

The canonical model is used for:

- `.github` governance and AI ops infrastructure work.
- WordPress block theme development work.
- WordPress block plugin development work.

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

## Project Field Mapping

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

These values are applied by the project metadata workflow:

- [`.github/workflows/project-meta-sync.yml`](../.github/workflows/project-meta-sync.yml)

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
- If a new canonical value is needed, add it to `.github/issue-fields.yml` first, then update this document.
