# Audit Intake

## When to load

Load when the user has not provided enough context for a scoped Yoast audit.

## Smallest useful questions

Ask only what is needed:

1. Site URL and whether it is staging or production.
2. Audit scope: configuration review, content metadata, taxonomy archives, WooCommerce SEO, schema output, migration readiness, launch QA or full-site review.
3. Active Yoast plugin stack if known.
4. Important pages, post types, products or taxonomies.
5. Site type: standard business, local business, publisher/blog, ecommerce catalogue, transactional ecommerce, multilingual, migration/rebuild.
6. Required output: client report, internal report, table, QA checklist, developer handoff or evidence gap report.
7. Confirm whether this is report-only. Default to report-only.

## Routing note

If the user asks for setup, defaults or configuration strategy, route to `yoast-configuration` instead of continuing intake here.
