# Repository evidence review workflow

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
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this workflow when a request depends on current repository code, uploaded source files, plugin branches, pull requests, or a claim that the bundled Tour Operator model needs updating.

## Purpose

Convert source evidence into safe skill decisions without letting guessed plugin behaviour enter the model.

## Minimum evidence snapshot

Capture:

- repository or uploaded file name;
- branch, tag, commit, version, or upload date when available;
- inspected files;
- symbols/classes/functions/config keys found;
- affected content types, taxonomies, fields, relationships or integrations;
- whether the evidence confirms registration, only references a relationship, or only documents intent;
- conflicts with bundled references;
- unresolved questions.

## Review order

1. Identify whether the evidence is core, extension, integration, theme, or support-plugin evidence.
2. Inspect registration code before usage code.
3. Confirm post types from explicit registration/configuration only.
4. Confirm taxonomies from explicit registration/configuration only.
5. Confirm fields from field schema/configuration, not from incidental display code alone.
6. Confirm relationships from relationship field definitions when available; treat FacetWP sources as indexing/linkage evidence only.
7. Confirm settings from option registration, settings pages, constants, or documented filters.
8. Confirm templates from block theme files, template registration, or active theme evidence.
9. Confirm schema output only from actual JSON-LD generation code or live output.
10. Record gaps before recommending model updates.

## Registration versus reference rule

Use these labels:

- `registration evidence`: the code registers or configures the entity directly.
- `field evidence`: the code defines a field, field type, field options or field visibility.
- `relationship evidence`: the code defines or indexes links between entities.
- `display evidence`: the code renders a value but may not define ownership.
- `planning evidence`: docs or comments describe desired behaviour but do not prove implementation.

Do not promote `display evidence`, `relationship evidence`, or `planning evidence` to ownership claims without registration evidence.

## Core model update path

Only update bundled core files when the evidence clearly belongs to Tour Operator core.

- Post type changes: update `references/content-model/core/post-types.json` and `source-map.md`.
- Taxonomy changes: update `references/content-model/core/taxonomies.json` and `source-map.md`.
- Relationship/facet changes: update `references/content-model/core/relationships.json`, `facetwp-indexing-notes.md`, and `source-map.md`.
- Field interpretation changes: update `field-usage-rules.md`.

Always add or update a `lastReviewed`, `sourceFile`, and `sourceConfidence` note.

## Extension update path

Only update extension files when the evidence comes from the extension itself or an authoritative source for that extension.

- Reviews: `references/content-model/extensions/to-reviews.json`.
- Team: `references/content-model/extensions/to-team.json`.
- Specials: `references/content-model/extensions/to-specials.json`.

Keep unknowns when extension code is not inspected. Do not copy core relationship assumptions into extension-owned models.

## Integration update path

For Wetu Importer, keep the integration model unless source evidence proves it registers durable post types, taxonomies, custom tables, scheduled jobs, logs, settings, or source IDs.

If source evidence proves stable structures, record:

- exact owner plugin;
- exact key or registration symbol;
- whether it writes to Tour Operator core post types;
- overwrite/manual-edit behaviour;
- rollback or resync risk.

## Conflict handling

When new source evidence conflicts with bundled references:

1. State the conflict.
2. Prefer the newest confirmed source evidence.
3. Mark the bundled reference as stale.
4. Update only the smallest affected file.
5. Keep the old assumption out of memory unless needed as a migration note.

## Output template

```markdown
## Repository evidence review

### Scope

### Files inspected

### Confirmed registration evidence

### Confirmed field evidence

### Confirmed relationship or indexing evidence

### Display or planning evidence only

### Conflicts with bundled model

### Safe model updates

### Do-not-promote assumptions

### Next verification step
```

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
