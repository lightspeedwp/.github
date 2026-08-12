# WooCommerce SEO reference

Use this file for WooCommerce catalogue, transactional store, product schema, product archives, product variations, faceted navigation, filtered URLs, and duplicate-content decisions.

## Evidence posture

- Treat Yoast WooCommerce SEO as a distinct workflow.
- Verify current product boundaries with the Yoast WooCommerce SEO product page and developer schema plugin docs before commercial claims.
- Validate WooCommerce data dependencies with official WooCommerce documentation where needed.
- Do not assume Product schema validity guarantees Google product rich results.
- Record product data gaps separately from Yoast configuration faults.

## Product mix decision

| Situation | Product posture | Notes |
|---|---|---|
| Small catalogue, no transactions | Yoast SEO Free may cover general metadata; evaluate WooCommerce SEO if product .schemas/social/product archive control matters | Verify product schema needs |
| Transactional WooCommerce store | Evaluate Yoast WooCommerce SEO alongside Yoast SEO base plugin | Product data and variation output matter |
| Store with frequent product URL changes | Consider Premium only if redirects/internal linking/orphaned content provide operational value | Verify packaging |
| Store with AI-assisted metadata workflow | Consider AI Plus only after verifying current entitlement, data policy, review process, and approval workflow | Do not publish generated metadata without human QA |

## Configuration areas

| Area | What to check | Recommended default posture | Risk if wrong | QA |
|---|---|---|---|---|
| Product page metadata | Title, description, social metadata, canonical, robots state | Unique product titles; manual descriptions for high-value products; careful templates for large catalogues | Duplicate snippets, wrong product information, accidental noindex | Rendered source and search preview |
| Product schema | Product/ProductGroup/Offer/AggregateOffer/AggregateRating/Review pieces | Complete product data; verify identifiers, pricing, stock, reviews and variation structure | Invalid or incomplete structured data | Schema validator and Google tools where relevant |
| Product identifiers | SKU, GTIN, MPN, brand/manufacturer where supported | Capture from WooCommerce/product data model and verified Yoast WooCommerce SEO docs | Weak product matching and merchant-data mismatch | Product data audit |
| Variations | Variation price, availability, identifiers, canonical and ProductGroup behaviour | Verify variable product output before launch | Duplicate or invalid variation schema | Test representative products |
| Product categories | Index only useful category landing pages | Build unique content for indexable categories; noindex thin duplicate categories | Thin archive index bloat | Crawl, rendered source, sitemap |
| Product tags | Usually noindex unless curated and valuable | Avoid indexing tag archives by default | Thin duplicate archives | Sitemap and robots meta check |
| Attributes | Brand/size/colour/material attributes may create archive/facet surfaces | Index only if curated and useful | Parameter/archive bloat | Crawl sample parameter URLs |
| Shop page | Store landing page metadata and canonical | Configure intentionally as primary catalogue/store page | Weak primary store page or duplicate listing page | Rendered source and breadcrumb path |
| Faceted navigation | Filtered URLs, parameters, canonicals, robots, crawl traps | Do not index arbitrary filter combinations unless curated | Crawl bloat and duplicate content | Crawl samples, canonical checks, robots rules |
| Open Graph product sharing | Product image/title/description output | Use product-specific social image and description where important | Poor social sharing and mismatched product snippets | Social debugger checks |
| XML sitemaps | Products, product categories, product tags and product attributes | Include canonical indexable URLs only | Sitemaps full of noindex/duplicate URLs | Sitemap inspection and spot crawl |

## Product data dependency checklist

- [ ] SKU present and stable where used operationally.
- [ ] GTIN/MPN/brand/manufacturer captured where required by the business or merchant workflows.
- [ ] Product title and short/long description unique enough for search snippets.
- [ ] Product image, gallery, and alt text reviewed.
- [ ] Price, sale price, currency, stock, and availability accurate.
- [ ] Reviews and ratings reflect real WooCommerce data.
- [ ] Shipping, returns, subscriptions, bookings, bundles, and custom product types reviewed where applicable.

## Archive and duplicate-content posture

- Product categories: index curated landing pages with useful copy and product selection.
- Product tags: default to noindex unless they are maintained landing pages.
- Attributes: treat as faceted surfaces unless deliberately designed as landing pages.
- Filtered URLs: default to noindex/canonical handling or exclusion from crawl/index strategy unless curated.
- Search result pages: generally avoid indexing internal search results.
- Pagination: verify canonicals and crawl behaviour with rendered output.

## Representative QA set

1. Simple product.
2. Variable product with in-stock and out-of-stock variations.
3. Sale product.
4. Product category with content.
5. Product category without content.
6. Product tag archive.
7. Shop page.
8. Filtered/faceted URL.
9. Out-of-stock product.
10. Product with reviews/ratings.

## How WooCommerce SEO differs from base Yoast

Base Yoast handles general WordPress metadata, schema graph, canonicals, robots and sitemaps. Yoast WooCommerce SEO must be verified for WooCommerce-specific product schema, variation handling, identifiers, product archive behaviour, and product sharing enhancements.

## Escalate to developer handoff when

- Product schema conflicts with another plugin or theme output.
- Custom product types do not map cleanly to expected schema.
- Variations, identifiers, stock, or offers are generated from custom fields or external systems.
- Faceted navigation requires custom canonical/robots logic.
- Sitemap inclusion/exclusion requires code-level customisation.
