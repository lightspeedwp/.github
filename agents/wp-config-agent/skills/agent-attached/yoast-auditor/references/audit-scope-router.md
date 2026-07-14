# Audit Scope Router

## When to load

Load when the request is broad, mixed, unclear, or asks whether something is an audit or configuration issue.

## What it helps decide

Choose the smallest useful audit mode and route setup/configuration work to `yoast-configuration`.

## Routing rules

- Existing setup, correctness, safety, readiness, client-ready review, launch QA, post-launch validation or developer handoff: keep in `yoast-auditor`.
- First-time setup, defaults, strategy, templates, configuration planning or implementation playbook: route to `yoast-configuration`.
- Mixed request: produce an evidence-backed audit or gap report, then hand configuration ownership to `yoast-configuration`.

## Scope selection

- Full-site audit: use only when the user asks for full-site review or evidence covers all relevant content types.
- Sampled audit: use when only a page/product/taxonomy sample is provided. State sample limits beside the score.
- Page-level audit: use for metadata, canonical, schema or indexation review of named URLs.
- Taxonomy-level audit: use for categories, tags, product taxonomies, author/date archives or custom taxonomies.
- WooCommerce audit: use when products, product categories, shop pages, variations, stock/price output or ecommerce schema are in scope.
- Schema audit: use when structured data, rich results, schema graph or schema customisations are in scope.
- Migration/launch audit: use when URLs, redirects, launch readiness, rebuilds or post-launch checks are in scope.

## Output expectations

Name the selected audit mode, reviewed scope, evidence available, evidence gaps, and next route. Do not convert an audit into a setup guide.
