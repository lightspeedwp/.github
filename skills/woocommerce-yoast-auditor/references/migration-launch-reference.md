# Migration and Launch Reference

## When to load

Load for migrations, rebuilds, domain changes, permalink changes, launch QA, post-launch validation and completed-change checks.

## What it helps decide

Assess whether Yoast-related output is safe for launch or migration without taking over setup.

## Key checks

- Redirect risks: unresolved source URLs, missing redirect map, wrong targets, chains or loops where evidence exists.
- Canonical risks: old-domain canonicals, staging canonicals, mismatched canonical targets.
- Indexation risks: noindex on important pages, robots blocking important paths, HTTP header conflicts.
- Sitemap risks: disabled, broken, staging URLs, missing key content types, stale product/category coverage.
- Metadata carry-over: important titles/descriptions missing, duplicated or not migrated.
- Taxonomy/archive risks: unexpected indexation or noindex after structure changes.
- WooCommerce risks: product, category, variation and shop output after catalogue changes.
- Post-launch checks: live output, Search Console submission evidence where available, crawl checks and critical page sample.

## Routing notes

- Readiness, go/no-go and validation: `woocommerce-yoast-auditor`.
- Configuration implementation: `woocommerce-yoast-configuration`.
- Redirect rules, theme/schema code or risky technical changes: developer handoff.

## Output expectations

Include go/no-go summary, blockers, high-priority fixes, evidence gaps, post-launch validation steps and owner route.
