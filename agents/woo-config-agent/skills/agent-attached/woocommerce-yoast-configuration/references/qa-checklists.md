# QA checklists

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

Use this file when validating Yoast configuration, output, migrations, WooCommerce SEO, schema customisation, developer changes, or launch readiness.

## Universal Yoast QA

- [ ] Confirm Yoast product mix and active plugin versions if access allows.
- [ ] Confirm exact admin UI paths before client-facing instructions.
- [ ] Review homepage title, description, canonical, robots, Open Graph, Twitter/X, schema, sitemap inclusion.
- [ ] Review representative page, post, taxonomy archive, custom post type, and archive URLs.
- [ ] Check that indexable canonical URLs appear in XML sitemaps.
- [ ] Check that noindex URLs are excluded from XML sitemaps where Yoast controls inclusion.
- [ ] Check that canonicals do not point to noindex URLs, redirects, 404s, parameter traps, or staging URLs.
- [ ] Check robots.txt and server/CDN rules do not conflict with Yoast settings.
- [ ] Check llms.txt if enabled or requested; do not treat it as a Google ranking lever.
- [ ] Check schema graph for duplicate/conflicting entities.
- [ ] Check breadcrumbs if active in blocks, templates, theme code, or schema.
- [ ] Check social metadata for important share pages.

## Configuration QA

| Area | Checks | Evidence |
|---|---|---|
| Site representation | Organisation/person, logo, social profiles, WebSite/WebPage identity | Yoast settings, rendered schema |
| Search appearance | Title and description templates, content-type and taxonomy visibility | Settings and rendered source |
| Archives | Author/date/search/internal archives intentionally indexed or noindexed | Rendered source and sitemap |
| Media | Attachment URL handling checked | Attachment URL sample |
| Canonicals | Canonicals are self-referencing or intentionally consolidated | Rendered source/crawl |
| Meta robots | No accidental noindex/nofollow/noarchive/sitewide block | Rendered source/crawl |
| Sitemaps | Only intended canonical URLs included | Sitemap index and child sitemaps |
| Schema | Valid, non-duplicated, entity-appropriate graph | Schema validator/rendered JSON-LD |

## WooCommerce QA

- [ ] Product pages checked for title, description, canonical, robots, Open Graph, schema, breadcrumb.
- [ ] ProductGroup/variation behaviour checked on variable products.
- [ ] Offer/AggregateOffer output checked against price, sale price, stock, and availability.
- [ ] Product identifiers checked where available: SKU, GTIN, MPN, brand/manufacturer.
- [ ] Product categories intentionally indexed or noindexed based on content value.
- [ ] Product tags usually noindexed unless curated and valuable.
- [ ] Filtered/faceted URLs checked for crawl traps, canonical conflicts, and accidental sitemap inclusion.
- [ ] Out-of-stock, sale, variable, simple, grouped, and external products checked where relevant.

## Migration QA

- [ ] Old-to-new redirect samples pass and avoid chains.
- [ ] Old canonical URLs updated to live final URLs.
- [ ] Staging domains removed from metadata, canonicals, sitemaps, schema, Open Graph, and robots.
- [ ] Old noindex rules intentionally preserved or removed.
- [ ] New sitemap submitted only after launch output is correct.
- [ ] High-value old URLs checked in Search Console after launch.

## Developer customisation QA

- [ ] Official Yoast API/filter/source verified before implementation.
- [ ] Pseudo-code labelled if not source-confirmed.
- [ ] Rendered source before/after captured.
- [ ] Sitemap, canonical, robots, schema, and metadata regression tested.
- [ ] Plugin/theme update risk recorded.
- [ ] Deprecated filters/actions avoided for new work unless maintaining legacy code.

## Evidence confidence levels

- High: current official source plus rendered output or settings evidence.
- Medium: current official source but no live output evidence.
- Low: source-register target, inference, outdated evidence, screenshot-only, or unclear product version.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
