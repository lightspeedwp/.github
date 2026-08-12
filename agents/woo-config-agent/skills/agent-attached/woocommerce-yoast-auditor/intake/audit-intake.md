# WooCommerce Yoast Audit Intake

## When to load

Load when the user has not provided enough context for a scoped WooCommerce Yoast audit.

## Smallest useful questions

Ask only what is needed:

1. Site URL and whether it is staging or production.
2. Audit scope: product metadata, product taxonomies, shop/archive output, WooCommerce SEO, schema output, migration readiness, launch QA or full WooCommerce SEO review.
3. Active WooCommerce, Yoast SEO, Yoast SEO Premium and Yoast WooCommerce SEO plugin stack if known.
4. Important products, product categories, product tags, attributes, shop pages or filtered archive URLs.
5. WooCommerce site type: catalogue-only, transactional store, subscription/membership store, marketplace-style catalogue, multilingual store, or migration/rebuild.
6. Required output: client report, internal report, table, QA checklist, developer handoff or evidence gap report.
7. Confirm whether this is report-only. Default to report-only.

## Routing note

If the user asks for setup, defaults or configuration strategy, route to `woocommerce-yoast-configuration` or the parent WooCommerce Configuration Agent instead of continuing intake here.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
