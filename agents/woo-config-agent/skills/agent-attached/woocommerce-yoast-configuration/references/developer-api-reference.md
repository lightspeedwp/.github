# Developer API reference

Use this file for developer handoffs, customisations, and code review. Do not invent hook names or code examples. Verify the official documentation before naming filters/actions or writing implementation advice.

## Developer posture

- Prefer documented Yoast APIs, filters, presenters, and schema graph extension points.
- Avoid direct edits to Yoast indexables or internal database tables as routine work.
- Treat deprecated filters/actions as legacy-only unless maintaining existing code.
- Label unverified snippets as pseudo-code.
- Require rendered output and regression tests after every change.

## API and feature reference

| API or feature | What it controls | Product scope | Official documentation URL | Example use case | Safe implementation notes | Testing requirement | Deprecation risk | Related filters/actions/APIs | Source confidence |
|---|---|---|---|---|---|---|---|---|---|
| Metadata API | Yoast metadata surfaces | Free/Premium/WooCommerce as applicable | <https://developer.yoast.com/customization/apis/metadata-api/> | Headless output, custom templates, metadata QA | Use documented API only; do not read/write internal tables directly | Rendered source/API output comparison | Medium; verify current docs | Metadata presenters, SEO tags | Needs source scan before client use |
| Schema API | Extends or modifies schema graph | Free/Premium/WooCommerce/add-ons | <https://developer.yoast.com/features/schema/api/> | Add custom graph data or adjust schema pieces | Use graph-aware extension points; avoid duplicate schema plugins | JSON-LD validation and Google tools where relevant | Medium; verify deprecations | Schema pieces, aggregator | Needs source scan before client use |
| Schema pieces | Individual graph pieces | Free/Premium/WooCommerce/add-ons | <https://developer.yoast.com/features/schema/pieces/> | Audit expected pieces per object type | Map each piece to required data before customising | Schema validators | Medium | Schema API, product schema | Needs source scan before client use |
| Schema aggregator API | Aggregates schema graph from multiple integrations | Free/Premium/add-ons | <https://developer.yoast.com/features/schema/schema-aggregator/api-reference/> | Integrate custom data sources | Verify plugin conflict risk and filter order | JSON-LD graph comparison | Medium/High | Schema aggregator filters | Needs source scan before client use |
| XML sitemap API | Customise sitemap entries/providers | Free/Premium/WooCommerce | <https://developer.yoast.com/features/xml-sitemaps/api/> | Exclude custom objects or add sitemap logic | Align with noindex/canonical decisions | Sitemap and robots meta checks | Medium | Sitemap functional spec | Needs source scan before client use |
| Canonical URL API | Customise canonical URLs | Free/Premium/WooCommerce | <https://developer.yoast.com/features/seo-tags/canonical-urls/api/> | Custom routing, paginated archives, headless pages | Avoid global overrides unless scoped and tested | Rendered canonical and sitemap checks | High | Canonical filters | Needs source scan before client use |
| Meta robots specification | Robots directives in metadata | Free/Premium/WooCommerce | <https://developer.yoast.com/features/seo-tags/meta-robots/functional-specification/> | Audit index/noindex/nofollow behaviour | Align with sitemap and robots.txt decisions | Rendered source and crawl checks | Medium | Robots presenters/filters where verified | Needs source scan before client use |
| Indexables | Internal Yoast architecture | Free/Premium/WooCommerce | <https://developer.yoast.com/features/indexables/technical-specification/> | Troubleshoot stale output/performance anomalies | Do not manipulate directly unless officially documented | Re-index/rebuild checks and rendered output | High | Indexables filters | Needs source scan before client use |
| Indexables filters | Advanced indexable behaviour hooks | Free/Premium/WooCommerce | <https://developer.yoast.com/features/indexables/indexables-filters/> | Advanced custom post type/archive handling | Treat as advanced; test upgrades | Rendered output and regression scenarios | High | Indexables specs | Needs source scan before client use |
| HTTP headers | SEO-relevant headers | Verify per product/version | <https://developer.yoast.com/features/http-headers/functional-specification/> | Audit headers affected by Yoast output | Check against server/CDN headers | Header inspection | Medium | Robots/canonical | Needs source scan before client use |
| Yoast SEO abilities | Abilities/analysis surfaces | Verify per product/version | <https://developer.yoast.com/features/yoast-seo-abilities/overview/> | Editor dashboards or custom quality workflows | Use official surfaces, not scraping UI | Editor/API comparison | Medium | Analysis scores | Needs source scan before client use |
| Analysis scores | SEO/readability analysis score surfaces | Verify per product/version | <https://developer.yoast.com/features/yoast-seo-abilities/analysis-scores/> | Reporting content quality state | Do not treat scores as ranking guarantees | Editor/API comparison | Medium | Yoast SEO abilities | Needs source scan before client use |
| Site connections | Verification and integrations | Verify per product/version | <https://developer.yoast.com/features/integrations/site-connections/> | Search engine/site verification workflows | Confirm which connection owns output | Rendered meta/header check | Low/Medium | Metadata output | Needs source scan before client use |
| IndexNow | IndexNow integration | Verify per product/version | <https://developer.yoast.com/features/integrations/indexnow/> | IndexNow troubleshooting or launch QA | Verify feature status and service support | Integration logs/output checks | Medium | Site connections | Needs source scan before client use |
| Deprecated filters/actions | Legacy API awareness | Free/Premium/WooCommerce | <https://developer.yoast.com/customization/yoast-seo/api-filter-actions-deprecations/> | Review legacy customisations before upgrade | Do not use deprecated APIs for new work | Upgrade test and deprecation scan | High | Filters/actions | Needs source scan before client use |

## Handoff workflow

1. Confirm the target output: title, description, canonical, robots, sitemap, schema graph, breadcrumb, HTTP header, site connection, analysis score, or WooCommerce product data.
2. Confirm whether the issue is configuration, source data, plugin conflict, custom code, theme output, cache/CDN, or migration artefact.
3. Verify the relevant official Yoast developer page before naming hooks, filters, classes, or APIs.
4. Recommend the narrowest customisation layer.
5. Require before/after rendered output tests.
6. Record upgrade/deprecation risk.

## Unsafe customisation guardrails

- Do not edit Yoast indexables or internal database tables directly as routine work.
- Do not hard-code schema JSON-LD beside Yoast output without checking duplicate/conflict risk.
- Do not globally override canonicals, robots, or sitemap filters without scoped tests.
- Do not rely on UI scraping for analysis or metadata state.
- Do not use deprecated filters/actions for new work unless there is no supported route and the risk is explicit.
