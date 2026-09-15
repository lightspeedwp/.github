# Live-site and WordPress admin inspection workflow

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

Use this workflow when the user asks for a live-site audit, admin review, WordPress MCP review, staging check, production check, or configuration verification for a Tour Operator website.

## Goal

Verify the effective site state before giving advice. Bundled references are useful defaults, but live-site evidence wins when it is current and source-backed.

## Minimum evidence snapshot

Capture these items before making recommendations:

1. Site and environment: live, staging, local, or unknown.
2. Access level: read-only, admin, repository, database, CLI, connector, or user-supplied screenshots/exports.
3. WordPress version, active theme, child theme, and block-theme status where available.
4. Active plugins and versions, starting with Tour Operator core.
5. Active first-party extensions: TO Reviews, TO Team, TO Specials, Wetu Importer.
6. Supporting plugins: Gravity Forms, Yoast SEO, FacetWP, SearchWP, WooCommerce, caching/security plugins if relevant.
7. Confirmed CPTs, taxonomies, field groups, relationship fields and archives.
8. Evidence freshness: inspection date and source.

## Safe inspection order

1. Confirm Tour Operator core is installed, active and versioned.
2. Compare effective registered post types against `references/content-model/core/post-types.json`.
3. Compare effective registered taxonomies against `references/content-model/core/taxonomies.json`.
4. Inspect relationship/facet behaviour against `references/content-model/core/relationships.json` and `references/content-model/core/facetwp-indexing-notes.md`.
5. Confirm first-party extensions before interpreting extension content.
6. Inspect Wetu Importer only as an integration unless source evidence proves owned structures.
7. Inspect Gravity Forms enquiry flows only after identifying the forms connected to Tour Operator CTAs.
8. Inspect Yoast content-type settings and schema output before proposing JSON-LD work.
9. Inspect block-theme templates, template parts, patterns and query loops for tour, destination and accommodation views.
10. Summarise confirmed state, conflicts with bundled defaults, risks, and the smallest next action.

## Read-only defaults

When tool access is read-only, produce an audit or implementation plan only. Do not imply changes were made.

When screenshots or pasted exports are the only evidence, label findings as `user-provided evidence` and call out anything that needs live verification.

## Live-site conflict handling

If live-site state conflicts with bundled references:

1. State the conflict.
2. Prefer live-site evidence for the current site.
3. Keep bundled references as the baseline model only.
4. Recommend a source review if the conflict looks like a plugin version change, local override, filter, mu-plugin, theme code, or stale bundled reference.
5. Do not silently update memory or bundled model files from one site without explicit scope.

## High-risk findings

Escalate these clearly:

- Tour Operator core inactive or missing on a Tour Operator site.
- Extension content exists but the related extension is inactive or unverified.
- Wetu imports may overwrite manually edited content without a recovery plan.
- Enquiry forms do not capture tour/destination/accommodation context.
- Notifications route to unknown, unmonitored, or single-person mailboxes.
- Yoast schema output duplicates custom schema or conflicts with visible content.
- Archive or single templates expose price, rating, availability or reviews without source evidence.
- FacetWP filters expose destinations, continents, facilities, brands or styles that do not match published content.

## Output expectation

Use a compact table unless the user asks for a full report:

| Area | Confirmed evidence | Risk | Recommendation | Confidence |
|---|---|---|---|---|

End with one of:

- Ready for implementation planning.
- Partially ready; verify listed gaps first.
- Not ready; resolve blocking evidence gaps first.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
