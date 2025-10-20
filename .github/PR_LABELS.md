# .github/PR_LABELS.md

## Purpose

Defines the org-wide standard for providing high‑signal, automated **PR labeling** for review routing, release hygiene, and search, in LightSpeed projects.  Use this reference to classify PRs consistently, apply correct labels, and align with org-wide automation and reporting.

## How labels are applied

1) **Paths → labels** via `.github/labeler.yml` (map to `area:*`, `comp:*`, `block:*`, `template:*`, `woo:*`, `to:*`, etc.).  
2) **Branch prefixes → status** on PR open: `feat/`, `fix/`, `docs/`, `chore/`, `build/` → add `status:needs-review`.

### Optional branch→type mapping (for Projects)

When the Project **Type** field is present, workflows may map PR branches to **Type**: `feat/`→`Feature`, `fix/`→`Bug`, `docs/`→`Documentation`, `chore/|build/`→`Task`.

## Usage notes

- Keep exactly one `status:*` and one `priority:*` on PRs.
- Use `status:needs-*` to drive automation (e.g., `status:needs-qa` moves to In QA).
- Prefer Project fields for Status/Priority/Area/Theme; use labels to echo for visibility/search.
- See `labels.yml` for the full canonical list and colour mapping.

## Release & Changelog Process

### Meta Labels & Release Hygiene

- **Meta labels** such as `meta:needs-changelog`, `meta:duplicate`, and `meta:triage` provide workflow signals:
    - `meta:needs-changelog`: Indicates an issue/PR must be included in the changelog.
    - `meta:duplicate`: Used to aggregate or report duplicate issues, separate from lifecycle status.
    - `meta:triage`: Flags issues needing further triage actions, but does not replace status labels.

- **Release labels** (`release:patch`, `release:minor`, `release:major`, `release:rc`, `release:beta`) determine the release type. Each PR must have exactly one release label to automate version bumping and changelog grouping.

### Changelog Automation

- When a PR is opened, if no changelog label is present, the workflow adds `meta:needs-changelog`.
- PRs and issues with `meta:needs-changelog` are included in automated changelog generation.
- Changelog sections are grouped based on release and type labels (e.g., features, fixes, documentation).
- When a PR is merged, the release workflow parses labels to determine changelog placement and version bump.

### Contributor Guidance

- Always set the appropriate meta and release labels before merging a PR.
- If your PR does **not** affect the changelog, use a skip label (`meta:no-changelog`).
- Only one `status:*` and one `release:*` label per PR/issue.
- Use the PR/issue template to document relevant changelog entries.

**See [Canonical Label Definitions](./labels.yml) and [Automated Label Assignment Rules](./labeler.yml) for automation details.**

## Changelog hygiene

- On PR open, if no changelog marker exists, add `meta:needs-changelog`.  
- Remove after updating changelog/README (or apply `meta:no-changelog` if internal‑only).

## Status rules (PRs)

- Keep **exactly one** `status:*`. Workflow adds `status:needs-review` if none; fails if multiple are present.

## Reference

- [Org-wide Issue Labels](./ISSUE_LABELS.md): Full list of default labels and usage guidance.
- [Pull Request Labels](./PR_LABELS.md): Standards for PR classification and automation.
- [Issue Types YAML](./issue-types.yml): Machine-readable list of all issue types for workflow and script automation.
- [Canonical Label Definitions](./labels.yml): Source of truth for all label names, colours, and descriptions.
- [Automated Label Assignment Rules](./labeler.yml): Automation for applying labels based on file changes and branch patterns.

Use these resources to set the 'Type' field, apply companion labels, and ensure full alignment between documentation, label definitions, and automation.

*This PR Labels standard extends the LightSpeed Projects/Issues/Labels strategy and supports org-wide label and workflow automation. All guidance here is directly reflected in labels.yml and labeler.yml for traceability and consistency.*
