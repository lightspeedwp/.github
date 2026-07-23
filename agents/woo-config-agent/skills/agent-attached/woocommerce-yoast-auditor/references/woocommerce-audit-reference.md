# WooCommerce Audit Reference

## When to load

Load only for WordPress sites running WooCommerce core and WooCommerce extension plugins, including product, product category, product variation or shop-page audit requests.

## What it helps decide

Assess product discoverability, duplicate-content risk and product structured data output without becoming a WooCommerce SEO setup guide.

## Key checks

- Product metadata: titles, descriptions, slugs, social metadata and canonical output for important products.
- Product schema: Product/ProductGroup, Offer, AggregateOffer, price, stock, variation and identifier signals where available.
- Product identifiers: SKU, GTIN, MPN, brand or other identifiers where relevant to the store.
- Variations: canonical, schema and duplicate-risk handling for variable products.
- Product categories and tags: indexation, metadata, sitemap inclusion, canonicals and duplicate content.
- Shop page: metadata, canonical, breadcrumbs and indexation status.
- Filtered URLs/faceted navigation: noindex/canonical risk, duplicate paths and crawl traps.
- Product sitemaps: inclusion of important products and exclusion of non-public content.
- Breadcrumbs and social sharing: output should help users and not misrepresent product hierarchy.

## Routing notes

- Audit existing WooCommerce SEO output: `woocommerce-yoast-auditor`.
- Configure WooCommerce SEO defaults, templates or schema settings: `woocommerce-yoast-configuration`.
- Theme/plugin code changes affecting schema output: developer handoff.

## Output expectations

Include product page findings, product archive findings, schema findings, duplicate-content/canonical risks, evidence gaps, recommendations and owner route.
