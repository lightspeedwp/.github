# Audit Scope Router

## When to load

Load when the request is broad, mixed, unclear, or asks whether something is an audit or configuration issue.

## What it helps decide

Choose the smallest useful audit mode and route setup/configuration work to `woocommerce-yoast-configuration`.

## Routing rules

- Existing setup, correctness, safety, readiness, client-ready review, launch QA, post-launch validation or developer handoff: keep in `woocommerce-yoast-auditor`.
- First-time setup, defaults, strategy, templates, configuration planning or implementation playbook: route to `woocommerce-yoast-configuration`.
- Mixed request: produce an evidence-backed audit or gap report, then hand configuration ownership to `woocommerce-yoast-configuration`.

## Scope selection

- Full WooCommerce SEO audit: use only when the user asks for full WooCommerce SEO review or evidence covers products, product taxonomies, shop/archive output, schema, sitemap/crawlability and launch/migration risks.
- Sampled audit: use when only a product, product-category or taxonomy sample is provided. State sample limits beside the score.
- Product/page-level audit: use for metadata, canonical, schema or indexation review of named URLs.
- Product taxonomy audit: use for categories, tags, product taxonomies, attributes, filtered archives or shop archives.
- WooCommerce audit: use when products, product categories, shop pages, variations, stock/price output or WooCommerce product schema are in scope.
- Schema audit: use when structured data, rich results, schema graph or schema customisations are in scope.
- Migration/launch audit: use when URLs, redirects, launch readiness, rebuilds or post-launch checks are in scope.

## Output expectations

Name the selected audit mode, reviewed scope, evidence available, evidence gaps, and next route. Do not convert an audit into a setup guide.
