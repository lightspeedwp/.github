# WooCommerce scenario tests

## Scenario 1: transactional store setup

Input: "Configure Yoast WooCommerce SEO for a transactional store with simple and variable products."

Expected routing:

- `intake/woocommerce-intake.md`
- `profiles/ecommerce-transactional.md`
- `references/woocommerce-seo-reference.md`
- `templates/yoast-woocommerce-report.md`

Expected behaviour:

- Ask or assume product type, identifiers, variations, stock, reviews, categories, tags and facets.
- Recommend representative Product/ProductGroup/Offer/AggregateOffer QA.
- Separate product data gaps from Yoast configuration issues.

## Scenario 2: catalogue site

Input: "Plan Yoast SEO for a WooCommerce catalogue where enquiries happen via forms."

Expected routing:

- `profiles/ecommerce-catalogue.md`
- `intake/woocommerce-intake.md`
- `references/woocommerce-seo-reference.md`

Expected behaviour:

- Treat product and category landing pages as content-led conversion pages.
- Check schema and Open Graph, but avoid unsupported transactional assumptions.

## Scenario 3: faceted navigation duplicate risk

Input: "Our WooCommerce filters are creating lots of URLs. What should Yoast do?"

Expected routing:

- `references/woocommerce-seo-reference.md`
- `references/feature-behaviour-reference.md`
- `references/qa-checklists.md`

Expected behaviour:

- Flag crawl/index bloat, canonical/noindex/sitemap alignment, and developer escalation where custom logic is required.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
