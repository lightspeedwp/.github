# WooCommerce transactional profile

## Scope

Stores with cart, checkout, payment, stock, product variations, reviews, categories, filters, sale pricing, and transactional journeys.

## Product posture

Yoast SEO plus Yoast WooCommerce SEO is the main product mix to evaluate. Premium may add operational value for redirects and internal linking.

## Load with

- `references/configuration-reference.md` for settings and output decisions.
- `references/configuration-playbooks.md` for broader scenario strategy.
- `references/qa-checklists.md` before launch or delivery.
- `references/source-register.md` when evidence or current product status matters.

## Configuration priorities

1. Confirm site representation and organisation/person identity.
2. Decide which content types and taxonomies deserve indexation.
3. Align titles, descriptions, canonicals, robots, sitemaps, breadcrumbs, social metadata, and schema.
4. Avoid duplicate archive bloat.
5. Validate rendered output on representative URLs.

## Risk controls

- Mark exact admin paths and product entitlements as `needs live verification`.
- Avoid noindex/canonical/sitemap contradictions.
- Do not use schema customisation to compensate for poor or missing source data.
- Do not treat schema validity as a promise of rich-result visibility.

## QA focus

- Homepage metadata, canonical, Open Graph, schema, sitemap inclusion.
- Representative page/post/archive/taxonomy output.
- Robots.txt, llms.txt if enabled, XML sitemap index and child sitemaps.
- Breadcrumb output where active.
- Any redirects, custom canonicals, noindex decisions, and developer customisations.

## Output recommendation

Use `templates/yoast-configuration-report.md` for setup, `templates/yoast-audit-report.md` for an existing site, and `templates/launch-qa-checklist.md` for launch or migration validation.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
