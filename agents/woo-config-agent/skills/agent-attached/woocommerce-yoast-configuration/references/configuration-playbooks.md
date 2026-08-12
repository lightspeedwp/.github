# Configuration playbooks

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
