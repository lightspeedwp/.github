# Yoast state comparison playbook

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this when comparing two or more Yoast-related evidence snapshots, such as before/after settings exports, pre/post-launch rendered output, crawl exports, plugin-update checks, migration checks, or month-on-month retained SEO QA.

## Purpose

Identify meaningful Yoast state changes without overstating impact. Separate expected improvements, intentional decisions, regressions, evidence gaps and unknowns.

## Load with

- `templates/yoast-state-comparison-report.md` for a deliverable.
- `references/audit-triage-model.md` for severity and priority.
- `references/decision-register-model.md` when a change requires sign-off.
- `references/conflict-resolution-playbook.md` when snapshots disagree.
- `references/rendered-output-qa-playbook.md` when comparing live output rather than settings.
- `references/settings-export-review-playbook.md` when comparing exported settings.

## Comparison inputs

Record each input with:

- Label: baseline, current, proposed, staging, live, pre-update, post-update, pre-migration, post-migration.
- Evidence type: settings export, copied admin settings, rendered HTML, HTTP headers, sitemap, robots.txt, llms.txt, schema JSON-LD, crawl export, Search Console observation, screenshot, code diff, plugin changelog.
- Source status: user-provided, live scan, current verified source, stale evidence, research target, inference.
- Collection date and environment.
- Access limitations.

## Comparison categories

| Category | Compare | Risk if changed unexpectedly |
|---|---|---|
| Indexation | noindex, nofollow, robots headers, sitemap inclusion | Pages may drop from search or low-value URLs may be exposed |
| Canonicals | canonical URL, canonical target changes, cross-domain changes | Consolidation signals may shift or conflict |
| Metadata | title templates, descriptions, per-page overrides | Search snippets and click-through may change |
| Social metadata | Open Graph and Twitter/X tags | Sharing previews may change |
| Schema | graph pieces, entity IDs, Product/Offer data, Breadcrumbs | Structured data validity or entity modelling may regress |
| Sitemaps | sitemap index, post type and taxonomy sitemaps, lastmod patterns | Discovery and QA expectations may change |
| Robots/llms.txt | allowed/disallowed paths, AI-facing source notes | Crawling or AI-consumer guidance may change |
| WooCommerce | product visibility, variations, offers, categories, filtered URLs | Ecommerce search output and duplicate content may change |
| Redirects | old/new URL coverage and status codes | Migration equity and user paths may break |
| Plugin capabilities | Free/Premium/WooCommerce SEO/AI Plus availability | Commercial or implementation assumptions may be wrong |

## Classification

Classify each difference as one of:

- `expected change` — matches an approved decision or release note.
- `intentional decision` — documented and approved by owner.
- `likely regression` — appears harmful and unsupported by a decision.
- `needs verification` — evidence is partial, stale or indirect.
- `environment difference` — caused by staging/live, auth, caching, CDN, robots or plugin state.
- `source mismatch` — settings and rendered output disagree.
- `not material` — visible change but unlikely to affect SEO output.

## Output rules

- Do not claim traffic/ranking impact. Describe likely configuration risk.
- Do not treat settings diffs as proof of rendered output.
- Prefer a small high-confidence list of material differences over a noisy full diff.
- Link each material difference to a recommended QA action.
- Create a decision record when accepting a risky change.

## QA checks

- Verify changed canonicals and meta robots in rendered source.
- Confirm sitemap inclusion/exclusion matches indexation choices.
- Confirm Product/ProductGroup/Offer schema on representative product types.
- Check robots.txt, llms.txt and HTTP headers directly.
- Compare staging and live separately when caching or environment rules differ.
- Re-run key checks after plugin/theme/cache/CDN changes.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
