# Research pack output specification

Use this file when producing or refreshing Yoast configuration reference data from a deep research scan.

## Required sections

1. Executive summary
2. Product capability matrix
3. Configuration data model
4. Skill-ready configuration playbooks
5. Feature behaviour reference
6. Schema reference
7. WooCommerce SEO reference
8. Developer integration reference
9. Recommended future skill architecture
10. Source register and evidence notes

## Evidence labels

Use these labels consistently:

- `confirmed yoast documentation`: direct Yoast developer/help/product source.
- `product marketing claim`: Yoast product page or commercial packaging claim.
- `developer api behaviour`: Yoast developer API/filter/specification source.
- `google search behaviour`: Google Search Central source.
- `schema vocabulary`: Schema.org source.
- `wordpress core behaviour`: WordPress official source.
- `woocommerce behaviour`: WooCommerce official source.
- `inference`: reasoned from related sources; not directly stated.
- `unclear from available sources`: source scan did not answer the question.
- `needs live verification`: UI path, packaging, licence, changelog or rendered output must be checked.

## Product capability matrix columns

Use exactly these columns when asked for the full matrix:

| Capability | Yoast SEO Free | Yoast SEO Premium | Yoast WooCommerce SEO | Yoast SEO AI Plus | Configuration location | Default behaviour | SEO impact | Risk level | Notes | Sources |
|---|---|---|---|---|---|---|---|---|---|---|

## Configuration data model shape

```json
{
  "setting_group": "",
  "setting_name": "",
  "plugin_scope": ["free", "premium", "woocommerce", "ai_plus"],
  "wordpress_scope": ["site", "content_type", "taxonomy", "post", "term", "product", "archive"],
  "default_behaviour": "",
  "recommended_default": "",
  "when_to_change": "",
  "risk_if_wrong": "",
  "dependencies": [],
  "related_settings": [],
  "evidence_sources": []
}
```

## Playbook fields

For each playbook include: goal, recommended Yoast product mix, configuration checklist, content-type decisions, taxonomy decisions, indexation decisions, schema decisions, sitemap decisions, WooCommerce decisions where relevant, developer checks where relevant, QA checks, risks, and sources.

Required playbooks: standard business website, local business website, blog or publisher website, WooCommerce catalogue site, WooCommerce transactional store, multilingual or hreflang-sensitive site, site migration or redesign, duplicate-content-heavy site, client site with poor content structure, and client site requiring schema customisation.

## Feature reference fields

For each feature include: what it does, which plugin provides it, where it is configured, what output it changes, common mistakes, recommended QA checks, developer extension points, and sources.

Required features: titles, descriptions, canonicals, meta robots, XML sitemaps, robots.txt, llms.txt, HTTP headers, breadcrumbs, link attributes, schema, indexables, site connections, IndexNow, SEO analysis, readability analysis, AI features, WooCommerce product schema, WooCommerce archive behaviour, Duplicate Post, orphaned content, table of contents block, internal linking, and redirects where confirmed.

## Schema reference fields

For each schema piece include: schema piece name, source URL, plugin scope, when Yoast outputs it, required inputs, optional inputs, related WordPress or WooCommerce data, configuration dependency, customisation route, QA method, and risks or limitations.

Minimum pieces: AggregateOffer, Article, Breadcrumb, Comment, Event, HowTo, Image, LocalBusiness, Offer, Organization, Person, PostalAddress, Product, ProductGroup, Question, Recipe, Review, SearchAction, Video, WebPage, and WebSite.

## Source register requirements

Every scanned source must record page title, URL, accessed date, product/feature area, key facts, configuration relevance, developer relevance, limitations/dependencies/version notes, source classification, duplicate status, and confidence.
