# Content-model maintenance workflow

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

Use this when updating the bundled source-backed model files from new uploaded source files, repository evidence, or live inspection.

## Update sequence

1. Identify the source package, date, branch/version if known, and files reviewed.
2. Separate post type JSON, taxonomy config PHP, relationship/facet code, extension code and integration code.
3. Update core files only from core evidence:
   - `references/content-model/core/post-types.json`
   - `references/content-model/core/taxonomies.json`
   - `references/content-model/core/relationships.json`
   - `references/content-model/core/source-map.md`
4. Update extension files only from extension-owned source evidence:
   - `references/content-model/extensions/to-reviews.json`
   - `references/content-model/extensions/to-team.json`
   - `references/content-model/extensions/to-specials.json`
5. Keep Wetu under `references/content-model/integrations/wetu-importer.json` unless code proves it owns stable content structures.
6. Update `field-usage-rules.md` and `facetwp-indexing-notes.md` when source behaviour affects template, filter or schema interpretation.
7. Validate every JSON file.
8. Run `references/validation/anti-drift-tests.md` before packaging.

## Source-confidence rules

- Use `confirmed uploaded source evidence` for fields, labels, settings and behaviour directly present in uploaded files.
- Use `confirmed repository evidence` only after current repository/code inspection.
- Use `unknown` for missing extension internals.
- Use `inferred` only where the inference is mechanically tied to a source, such as a taxonomy slug inferred from a config filename, and label it clearly.

## Do not do

- Do not copy relationship/facet references into core post type ownership.
- Do not turn WordPress.org marketing copy into field-level proof.
- Do not replace conservative extension placeholders with guesses.
- Do not claim JSON-LD support exists because schema mappings exist.
- Do not silently remove old source links; move deprecated links into a labelled section if needed.

## Maintenance output

```markdown
# Content-model update summary

## Sources reviewed
## Files changed
## Confirmed additions
## Changed or removed evidence
## Unknowns preserved
## Extension boundaries protected
## Validation results
## Anti-drift test notes
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
