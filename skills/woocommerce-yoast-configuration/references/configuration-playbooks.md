# Configuration playbooks

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

Use these playbooks for site-type-specific Yoast configuration strategy. They are reusable starting points; final recommendations must cite refreshed source-register evidence and project-specific facts.

## Standard business website

- **Goal:** Clear service/entity metadata with lean indexable pages.
- **Recommended Yoast product mix:** Yoast SEO Free; verify Premium if redirects/internal linking are needed; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

## Local business website

- **Goal:** Accurate local entity and location trust signals.
- **Recommended Yoast product mix:** Yoast SEO Free/Premium plus Local SEO only if explicitly in scope and verified; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

## Blog or publisher website

- **Goal:** Consistent article metadata, author strategy and archive hygiene.
- **Recommended Yoast product mix:** Yoast SEO Free; Premium for internal linking/orphaned content if verified; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

## WooCommerce catalogue site

- **Goal:** Index useful products and curated categories without transactional clutter.
- **Recommended Yoast product mix:** Yoast SEO Free plus Yoast WooCommerce SEO; verify product data needs; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

## WooCommerce transactional store

- **Goal:** Product schema, product archives, canonical and conversion page hygiene.
- **Recommended Yoast product mix:** Yoast SEO Free/Premium plus Yoast WooCommerce SEO; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

## Multilingual or hreflang-sensitive site

- **Goal:** Avoid language/canonical conflicts and unsupported hreflang assumptions.
- **Recommended Yoast product mix:** Yoast plus multilingual plugin; verify Yoast responsibilities; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

## Site migration or redesign

- **Goal:** Preserve indexation, metadata, canonicals, redirects and sitemaps.
- **Recommended Yoast product mix:** Yoast Premium if redirect manager confirmed; otherwise server/plugin redirects; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

## Duplicate-content-heavy site

- **Goal:** Reduce index bloat from tags, filters, archives and thin pages.
- **Recommended Yoast product mix:** Yoast SEO Free plus WooCommerce SEO if ecommerce; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

## Poor content structure site

- **Goal:** Improve content-type taxonomy and internal linking signals.
- **Recommended Yoast product mix:** Yoast SEO Free; Premium for internal linking/orphaned content if verified; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

## Schema customisation site

- **Goal:** Extend Yoast schema safely without conflicts.
- **Recommended Yoast product mix:** Yoast SEO plus documented Schema API/aggregator path; verify current packaging and entitlements.
- **Configuration checklist:** site representation, search appearance, content types, taxonomies, archives, metadata templates, social metadata, schema, sitemaps, robots/meta robots, breadcrumbs.
- **Content-type decisions:** index only public, valuable content types; noindex thin/private/internal types.
- **Taxonomy decisions:** index curated landing-page taxonomies; noindex thin tags or duplicate archives.
- **Indexation decisions:** align robots meta, canonical and sitemap inclusion.
- **Schema decisions:** confirm expected graph pieces and avoid duplicate schema plugins.
- **Sitemap decisions:** include only canonical, indexable URLs.
- **WooCommerce decisions:** load WooCommerce reference if products, shop, product categories, tags, filters or variations exist.
- **Developer checks:** load developer API reference before custom canonicals, schema, sitemap, metadata or indexables work.
- **QA checks:** rendered source, sitemap URLs, robots.txt, llms.txt if enabled, JSON-LD graph, key templates, representative URLs, crawl samples.
- **Risks:** stale product claims, invented UI paths, accidental noindex, duplicate canonicals, invalid schema, sitemap pollution.
- **Sources:** use `references/source-register.md` rows matching this playbook before finalising.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
