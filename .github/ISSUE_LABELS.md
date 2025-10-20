# .github/ISSUE_LABELS.md

## Purpose

Defines the org-wide standard for providing high‑signal, automated **Issue labeling** for review routing, release hygiene, and search, in LightSpeed projects. Use this reference to classify Issues consistently, apply correct labels, and align with org-wide automation and reporting.

## Label Families (Issues)

- **`status:*`** — blocked, duplicate, in-progress, needs-client-discussion, needs-design, needs-design-review, needs-dev, needs-discussion, needs-documentation, needs-figma-update, needs-loom-video, needs-more-info, needs-qa, needs-review, needs-testing, needs-triage, on-hold, ready, ready-for-deployment, scope-creep, wontfix.
- **`priority:*`** — critical, important, normal, minor.
- **`type:*`** — a11y, accessibility-audit, bug, chore, compliance, compat, content-import, content-management, deprecation, design, dev, documentation, feature, fix, improve, maintenance, missing-content, performance, qa, refactor, security, task, test, ui, usability, ux.
- **`area:*`** — analytics, block-visibility, cards, ci, content, cookie-policies, cta, dependencies, deployment, design-system, emails, forms, gallery, hero, i18n, infrastructure, integration, mega-menu, mobile-menu, modal, monitoring, navigation, plugins, post-format, search, seo, slider, testimonials, theme, woocommerce.
- **`comp:*`** — block-editor, block-json, block-patterns, block-styles, block-templates, color-palette, help-tabs, post-settings, section-styles, settings, site-editor, spacing, style-variations, template-parts, theme-json, typography, wp-admin.
- **Context labels:** `env:*`, `phase:*`, `page:*`, `issue:*`, `device:*`, `layout:*`, `theme:*`, `block:*`, `template:*`, `template-part:*`, `woo:*`, `to:*`, `size:*`.
- **Meta & release labels:** meta:has-pr, meta:needs-changelog, meta:no-issue-activity, meta:no-pr-activity, meta:stale, meta:duplicate, meta:triage, release:hotfix, release:major, release:minor, release:patch, release:rc, release:beta.
- **Contributor labels:** contrib:good-first-issue, contrib:help-wanted, contrib:discussion.

## Triage Workflow

1. Set Issue Type; link Parent Epic if applicable.
2. Add one `priority:*` and one `type:*`.
3. Add one of `area:*` or `comp:*`.
4. Set `status:needs-triage` → `status:ready`. Keep exactly one status.
5. Add context labels only if they help assignment or search (env, phase, page, device, etc.).

## Colour System

Labels use a consistent colour palette for rapid scanning and workflow automation. Colours are assigned by family and purpose:

- `#B60205` — Critical priority, blocking status, urgent issues.
- `#0E8A16` — Ready/approved status, live/production.
- `#1D76DB` — In-progress status.
- `#C5DEF5` — General area/component, design, content, and block labels.
- `#D4C5F9` — Type labels (bug, feature, test, security, compliance, documentation, maintenance, deprecation, accessibility-audit, QA).
- `#C2E0C6` — Analytics, monitoring, discussion, help-wanted, cards, testimonials, etc.
- `#F85149` — Major releases, release candidates.
- `#58A6FF` — Minor releases, beta releases.
- `#E1E4E8` — Meta, duplicate, device, stale, live, desktop, laptop, mobile, tablet, etc.
- `#BFD4F2` — CI, evaluations, needs triage, meta:triage.
- `#F9D0C4` — Dependencies, on-hold, multisite.
- `#D93F0B` — Integration, compatibility, broken-link, js-error, redirects, etc.
- `#006B75` — Deployment, infrastructure.
- `#FBCA04` — QA required.
- `#FEF2C0` — Testing needed.
- `#3FB950` — Patch releases.

Assign colours by family using the canonical palette. See `labels.yml` for authoritative mapping.

## Automations

- Intake defaults & one `status:*` enforced via workflow.
- Default `priority:normal` if none present.
- Status and priority labels drive automation and project field mapping.

## Usage Notes

- Keep exactly one `status:*` and one `priority:*` on issues.
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

## Branching Strategy Reference

Branch prefixes and Issue Types are tightly linked. See [Org-wide Branching Strategy](../docs/git-workflow/org-wide-branching-strategy.md) for conventions.  
Your branch prefix (e.g. `feat/`, `fix/`, `docs/`, etc.) determines which PR/issue template is used, the labels applied, and the automation that will run.  
Always use the correct prefix for your branch to ensure full automation and proper issue classification.

## Reference

- [CHANGELOG.md](../CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](../CONTRIBUTING.md): Contribution guidelines, templates, coding standards.
- [AUTOMATION_GOVERNANCE.md](./AUTOMATION_GOVERNANCE.md): Org-wide automation, branching, labeling, and release strategy.
- [Org-wide Issue Labels](./ISSUE_LABELS.md): Default labels and usage guidance.
- [Pull Request Labels](./PR_LABELS.md): PR classification and automation standards.
- [Issue Types YAML](./issue-types.yml): Machine-readable issue types for workflow and automation.
- [Canonical Label Definitions](./labels.yml): Label names, colours, and descriptions.
- [Automated Label Assignment Rules](./labeler.yml): Automation for applying labels based on file changes and branch patterns.

Use these resources to set the 'Type' field, apply companion labels, and ensure full alignment between documentation, label definitions, and automation.

*This Issue Labels standard extends the LightSpeed Projects/Issues/Labels strategy and supports org-wide label and workflow automation. All guidance here is directly reflected in labels.yml and labeler.yml for traceability and consistency.*
