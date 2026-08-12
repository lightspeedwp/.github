# WooCommerce business website profile

## Scope

WooCommerce business websites that include service pages, brand pages, case studies, resources, team pages, enquiry forms, and a store catalogue or transactional checkout. Use this profile only when WooCommerce core is active and these non-shop pages support the ecommerce journey.

## Product posture

Yoast SEO Free may cover baseline metadata, schema, sitemaps and robots controls; WooCommerce SEO, Premium, Local SEO or other Yoast extensions may be relevant only when their current capabilities match the store requirements.

## Load with

- `references/configuration-reference.md` for settings and output decisions.
- `references/configuration-playbooks.md` for broader scenario strategy.
- `references/qa-checklists.md` before launch or delivery.
- `references/source-register.md` when evidence or current product status matters.

## Configuration priorities

1. Confirm site representation, organisation identity, merchant identity, and WooCommerce store context.
2. Decide which WooCommerce content types, product archives, attributes, supporting content types, and taxonomies deserve indexation.
3. Align titles, descriptions, canonicals, robots, sitemaps, breadcrumbs, social metadata, and schema.
4. Avoid duplicate product, attribute, filtered URL, and archive bloat.
5. Validate rendered output on representative URLs.

## Risk controls

- Mark exact admin paths and product entitlements as `needs live verification`.
- Avoid noindex/canonical/sitemap contradictions.
- Do not use schema customisation to compensate for poor or missing source data.
- Do not treat schema validity as a promise of rich-result visibility.

## QA focus

- Homepage metadata, canonical, Open Graph, schema, sitemap inclusion.
- Representative product, product category, product tag, attribute, page, post, archive, and taxonomy output.
- Robots.txt, llms.txt if enabled, XML sitemap index and child sitemaps.
- Breadcrumb output where active.
- Any redirects, custom canonicals, noindex decisions, and developer customisations.

## Output recommendation

Use `templates/yoast-configuration-report.md` for setup, `templates/yoast-audit-report.md` for an existing site, and `templates/launch-qa-checklist.md` for launch or migration validation.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
