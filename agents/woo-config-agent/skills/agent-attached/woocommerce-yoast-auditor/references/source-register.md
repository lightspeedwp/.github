# Source Register

## When to load

Load when citations, source confidence, feature availability, product boundaries or maintenance review are needed.

## Use rules

- Prefer current site evidence first.
- Use official sources before secondary sources.
- Do not claim a source has been scanned unless `status` is `scanned`.
- If `status` is `pending_scan`, use the source as a starting point only and perform a fresh review before making product capability claims.
- Even when a source is marked `scanned`, re-check official sources when a claim is likely to be time-sensitive, pricing-specific, version-specific or affected by recent Yoast, Google, WordPress or Schema.org changes.

## Source entries

```json
[
  {
    "url": "https://wordpress.org/plugins/wordpress-seo/",
    "title": "Yoast SEO - Advanced SEO with real-time guidance and built-in AI - WordPress plugin",
    "date_accessed": "2026-07-03",
    "source_type": "official_wordpress",
    "product_scope": ["yoast seo free", "yoast seo premium context"],
    "feature_scope": ["plugin metadata", "metadata", "schema", "xml sitemaps", "canonical urls", "breadcrumbs", "llms.txt", "ai features context"],
    "status": "scanned",
    "audit_relevance": "Current public plugin-directory baseline for Yoast SEO plugin features, public plugin positioning, WordPress.org support context and version-adjacent audit framing.",
    "developer_handoff_relevance": "Use for plugin-directory context only; use Yoast developer documentation before recommending code-level customisation routes.",
    "confidence": "high",
    "notes": "Scanned on 2026-07-03. The page describes Yoast SEO features including real-time feedback, schema, canonical URLs, XML sitemaps, breadcrumbs, metadata support, technical SEO features and llms.txt management. Treat detailed capability differences between Free, Premium and add-ons as product-specific and verify against current official Yoast product pages before making exact claims."
  },
  {
    "url": "https://yoast.com/product/yoast-seo-premium-wordpress/",
    "title": "Yoast SEO Premium",
    "date_accessed": "2026-07-03",
    "source_type": "official_yoast",
    "product_scope": ["yoast seo premium", "yoast seo free upgrade context"],
    "feature_scope": ["premium product overview", "redirects", "internal linking", "social previews", "ai titles and descriptions", "technical seo", "schema", "xml sitemaps"],
    "status": "scanned",
    "audit_relevance": "Use as the current official Yoast Premium product context when an audit finding depends on whether Premium-level capabilities may be relevant.",
    "developer_handoff_relevance": "Use only for product capability context; use Yoast developer documentation before recommending implementation details.",
    "confidence": "high",
    "notes": "Scanned on 2026-07-03 after the older /wordpress/plugins/seo/ URL redirected to this Premium product page. The page describes Premium features such as redirects, internal linking suggestions, AI title/meta suggestions, social previews, technical SEO handling, XML sitemaps and schema markup. Do not infer that a client site has these features unless the active plugin stack confirms Premium is installed and licensed."
  },
  {
    "url": "https://yoast.com/product/yoast-woocommerce-seo/",
    "title": "Yoast WooCommerce SEO",
    "date_accessed": "2026-07-03",
    "source_type": "official_yoast",
    "product_scope": ["yoast woocommerce seo"],
    "feature_scope": ["product seo", "product schema", "woocommerce output", "product and category metadata", "canonicals", "breadcrumbs", "xml sitemaps", "filters and parameters", "ai product titles and descriptions"],
    "status": "scanned",
    "audit_relevance": "Current official product context for WooCommerce SEO audits where product, product-category, filter, breadcrumb, sitemap, canonical or structured-data findings may depend on the WooCommerce add-on.",
    "developer_handoff_relevance": "Use for product capability context only; route setup/defaults to woocommerce-yoast-configuration and code-level output changes to developer handoff.",
    "confidence": "high",
    "notes": "Scanned on 2026-07-03. The page describes WooCommerce-focused support for product/category titles and descriptions, structured data for price and stock, canonicals, breadcrumbs, XML sitemaps, filter/parameter handling and AI-assisted product/category metadata. Verify active plugin stack before treating these capabilities as available on a specific site."
  },
  {
    "url": "https://developer.yoast.com/",
    "title": "Yoast developer portal - The home of Yoast SEO APIs",
    "date_accessed": "2026-07-03",
    "source_type": "official_developer",
    "product_scope": ["yoast developer api", "yoast technical specifications"],
    "feature_scope": ["xml sitemaps", "seo tags", "canonical urls", "meta robots", "opengraph tags", "x tags", "schema.org markup", "rest api", "surfaces api", "metadata api", "schema api"],
    "status": "scanned",
    "audit_relevance": "Technical source for understanding Yoast output areas during audits and for validating whether a developer handoff should reference supported Yoast APIs or documented output behaviour.",
    "developer_handoff_relevance": "Primary source to scan before recommending Yoast API, filter, metadata or schema customisation routes.",
    "confidence": "high",
    "notes": "Scanned on 2026-07-03. The portal lists technical specifications for XML sitemaps, SEO tags, canonical URLs, meta robots, OpenGraph, X tags and Schema.org markup, plus REST, Surfaces, Metadata and Schema APIs. Open the specific subpage before making detailed API or hook claims."
  },
  {
    "url": "https://yoast.com/help/",
    "title": "Yoast help center",
    "date_accessed": "2026-07-03",
    "source_type": "official_yoast",
    "product_scope": ["yoast seo", "yoast add-ons", "yoast support"],
    "feature_scope": ["settings", "sitemaps", "breadcrumbs", "social metadata", "schema", "noindex", "redirects", "ai features", "support boundaries"],
    "status": "scanned",
    "audit_relevance": "Support and help-centre source for validating user-facing behaviour, settings terminology and troubleshooting references.",
    "developer_handoff_relevance": "Use for support-facing context; use Yoast developer documentation for code-level implementation details.",
    "confidence": "high",
    "notes": "Scanned on 2026-07-03. The help centre exposes topics including XML sitemap, AI features, schema, Yoast SEO settings, noindex and redirects, and notes that paid products get support while free plugins use WordPress support forums. Open specific help articles before making detailed configuration claims."
  },
  {
    "url": "https://developers.google.com/search/docs",
    "title": "Documentation to Improve SEO | Google Search Central | Google for Developers",
    "date_accessed": "2026-07-03",
    "source_type": "official_google",
    "product_scope": ["google search"],
    "feature_scope": ["crawlability", "indexing", "robots.txt", "sitemaps", "canonicals", "structured data", "metadata", "redirects", "site moves", "page experience", "ranking and search appearance"],
    "status": "scanned",
    "audit_relevance": "Primary search-behaviour reference for risk framing around crawlability, indexation, canonicals, robots, sitemaps, metadata, redirects, structured data and migration/search appearance issues.",
    "developer_handoff_relevance": "Use to frame expected search-safe output and QA checks; do not convert Google guidance into ranking guarantees.",
    "confidence": "high",
    "notes": "Scanned on 2026-07-03. The docs navigation covers Search Essentials, crawling and indexing, sitemaps, robots.txt, canonicalization, metadata, redirects, site moves, ranking/search appearance and structured data. Use specific Google subpages for detailed claims."
  },
  {
    "url": "https://schema.org/",
    "title": "Schema.org",
    "date_accessed": "2026-07-03",
    "source_type": "official_schema",
    "product_scope": ["structured data"],
    "feature_scope": ["schema vocabulary", "schema types", "schema properties", "structured data encodings", "validator", "release version"],
    "status": "scanned",
    "audit_relevance": "Reference source for schema vocabulary, type/property checks and structured-data terminology during schema QA.",
    "developer_handoff_relevance": "Use for schema vocabulary context; pair with Google Search Central and Yoast developer docs before recommending search-specific structured-data implementation details.",
    "confidence": "high",
    "notes": "Scanned on 2026-07-03. The homepage states Schema.org is a shared vocabulary for structured data and shows V30.0 dated 2026-03-19. Open specific type/property pages before making detailed schema property claims."
  }
]
```
