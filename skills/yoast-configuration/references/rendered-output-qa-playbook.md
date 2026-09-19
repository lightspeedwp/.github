# Rendered output QA playbook

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
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this file when the user provides rendered HTML, page-source excerpts, HTTP headers, robots.txt, llms.txt, XML sitemap URLs, schema JSON-LD, crawl exports, Search Console notes, or asks whether Yoast output is visible on the front end.

## Goal

Verify what a crawler, browser or validator can observe, and separate rendered evidence from Yoast settings, source-register claims and SEO interpretation.

## Evidence priority for output QA

1. Live rendered output or provided page source from the target URL.
2. HTTP headers from the target URL.
3. robots.txt, llms.txt and XML sitemap responses.
4. Structured data extracted from rendered source.
5. Crawl exports with timestamps.
6. Yoast settings exports or screenshots.
7. Source documentation explaining expected behaviour.

## Output checks

| Area | What to inspect | Common problem | QA method |
|---|---|---|---|
| Title | `<title>` and any duplicate title source | Multiple plugins or theme output | Compare rendered source with expected template |
| Description | `<meta name="description">` | Missing, duplicated, truncated or generic description | Inspect rendered head and crawl sample |
| Canonical | `<link rel="canonical">` | Self-canonical wrong, filtered URL canonical wrong, staging/live mismatch | Inspect rendered URL variants |
| Meta robots | `<meta name="robots">` and HTTP robots headers | Unexpected noindex, nofollow, max-snippet rules | Inspect rendered source and headers |
| Open Graph | `og:*` tags | Wrong image, title or URL | Inspect rendered head and sharing debugger if needed |
| Twitter/X | `twitter:*` tags | Missing card or stale image | Inspect rendered head |
| Schema | JSON-LD graph | Missing entity, wrong organisation/person, product offer gaps | Extract graph and validate relevant nodes |
| Breadcrumbs | Visible breadcrumbs and BreadcrumbList schema | Visible trail and schema disagree | Compare page UI and JSON-LD |
| XML sitemap | Sitemap index and child sitemaps | Missing post type, noindexed URLs included, old staging URLs | Fetch sitemap URLs and sample entries |
| robots.txt | Live robots.txt | Blocking important areas or relying on robots for noindex | Fetch robots.txt and compare with indexation rules |
| llms.txt | Live llms.txt | Overstated as Google ranking lever or stale content list | Fetch and label as non-Google AI consumer aid |
| HTTP headers | Link, X-Robots-Tag and cache/CDN headers | Header conflicts with meta robots or canonical strategy | Inspect headers from final URL |
| Redirects | Final URL and status chain | Canonical target differs from final URL | Check final status and rendered canonical |

## Review workflow

1. State URL, environment, timestamp if provided, and access level.
2. List observed outputs only; do not infer hidden settings unless supported.
3. Compare observed output with expected Yoast behaviour and site profile.
4. Identify conflicts between rendered output, settings artefacts, source documentation and client intent.
5. Classify each issue with `references/audit-triage-model.md` when severity or priority matters.
6. Use `references/conflict-resolution-playbook.md` when sources disagree.
7. Use `templates/rendered-output-qa-report.md` for a reusable deliverable.

## Rendered-output evidence states

- `observed current output`: directly visible in provided or live rendered evidence.
- `provided crawl evidence`: available from a crawl/export, but timestamp may matter.
- `settings-only expectation`: expected from a setting, not yet confirmed on output.
- `documentation expectation`: expected from Yoast/Google/WooCommerce docs, not yet confirmed on this site.
- `conflict`: two or more evidence types disagree.
- `missing evidence`: output not provided or not accessible.

## Common mistakes

- Treating a Yoast setting as proof of live output.
- Checking only one URL when template or taxonomy behaviour varies.
- Ignoring staging/live domain mismatches.
- Ignoring HTTP `X-Robots-Tag` when meta robots looks fine.
- Assuming schema vocabulary validity means Google rich-result eligibility.
- Assuming cached output reflects current settings.
- Treating robots.txt as the right way to remove indexed URLs.

## Minimum QA sample set

For normal WordPress sites:

- Homepage.
- One important page.
- One post.
- One category archive.
- One low-value archive or utility page.
- Sitemap index.
- robots.txt.
- llms.txt if enabled or discussed.

For WooCommerce sites add:

- One simple product.
- One variable product.
- One product category.
- One product tag if indexable.
- Shop page.
- One filtered/faceted URL where applicable.

## Maintenance

Update this file when Yoast output behaviour, Google validation tools, WooCommerce schema expectations, or agency QA standards change.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
