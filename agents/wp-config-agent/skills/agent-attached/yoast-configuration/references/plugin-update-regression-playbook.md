# Yoast plugin-update regression playbook

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

Use this when planning or reviewing Yoast SEO Free, Yoast SEO Premium, Yoast WooCommerce SEO, Yoast SEO AI Plus, WordPress, WooCommerce, theme or SEO-adjacent plugin updates.

## Purpose

Prevent silent regressions in metadata, canonicals, indexation, sitemaps, robots rules, llms.txt, breadcrumbs, schema, WooCommerce product output and developer customisations after updates.

## Load with

- `references/state-comparison-playbook.md` for before/after comparison.
- `templates/yoast-regression-test-report.md` for reporting.
- `templates/yoast-acceptance-criteria.md` for approval gates.
- `references/developer-api-reference.md` when custom code touches Yoast APIs or filters.
- `references/current-verification-playbook.md` if product packaging, UI paths or API behaviour is current-sensitive.

## Pre-update baseline

Capture a lightweight baseline before updates:

1. Plugin versions: Yoast SEO, Premium, WooCommerce SEO, AI Plus and SEO-adjacent plugins.
2. WordPress and WooCommerce versions.
3. Theme and custom plugin version/branch.
4. Representative URLs: homepage, service page, post, category, author archive, product, variable product, product category, filtered URL, sitemap, robots.txt, llms.txt.
5. Rendered output: title, description, canonical, meta robots, schema, breadcrumbs, Open Graph, HTTP headers.
6. Settings export or copied settings where available.
7. Any known approved decisions: noindex rules, canonical overrides, schema customisations, product archive strategy.

## Regression risk areas

| Area | Watch for | Suggested owner |
|---|---|---|
| Metadata presenters | Missing or duplicated title/description/social tags | SEO/configuration owner |
| Canonicals | Changed canonical targets, missing canonicals, staging domains | SEO + developer |
| Meta robots | Unexpected noindex/nofollow/noarchive/max-snippet changes | SEO/configuration owner |
| XML sitemaps | Missing sitemap index, unexpected URL inclusion/exclusion | SEO/configuration owner |
| Robots and llms.txt | Changed generated output or manual override conflicts | SEO + developer |
| Schema graph | Missing graph pieces, changed entity IDs, broken Product data | SEO + developer |
| WooCommerce output | ProductGroup/Offer/availability/review changes | Ecommerce + developer |
| Breadcrumbs | Changed breadcrumb path or duplicate breadcrumb schema | SEO/configuration owner |
| Custom filters | Deprecated hooks, removed filters, plugin conflicts | Developer |
| AI metadata | Unapproved generated title/description changes | Content/SEO owner |

## Acceptance rule

A Yoast-related update is acceptable only when:

- Material outputs match the baseline or have an approved decision.
- Regressions are triaged with severity, owner and next action.
- Current-sensitive claims were verified from current sources.
- Developer customisations were tested in rendered output, not just code review.
- WooCommerce representative product types were checked when ecommerce is in scope.

## Stop conditions

Pause release or require explicit approval if:

- Important pages become `noindex`.
- Canonicals point to the wrong domain or URL set.
- Sitemaps lose important content types unexpectedly.
- Product schema disappears or materially changes on transactional product pages.
- Robots.txt blocks important sections unexpectedly.
- A deprecated Yoast API/filter is newly introduced.
- Source evidence is stale and the decision is commercially or technically sensitive.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
