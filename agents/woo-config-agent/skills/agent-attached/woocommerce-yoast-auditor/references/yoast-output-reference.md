# Yoast Output Reference

## When to load

Load for audits of rendered Yoast output, launch QA, metadata review, crawlability checks or completed-change validation.

## What it helps decide

Check whether observed output is safe, complete and consistent for the reviewed scope.

## Key checks

- Titles: unique, relevant, not truncated where visible evidence suggests a problem, aligned with page intent.
- Meta descriptions: present for important pages where useful, specific, non-duplicated and client-safe.
- Canonicals: present where expected and pointing to the intended canonical URL.
- Meta robots: important pages indexable unless there is a clear reason not to index.
- XML sitemaps: important content types and taxonomies included where intended.
- Robots.txt: does not block important content accidentally.
- llms.txt: review only where present or in scope; do not treat absence as an automatic issue.
- HTTP headers: review indexation-related headers when available.
- Breadcrumbs: match site hierarchy and do not create confusing taxonomy paths.
- Open Graph and Twitter/X: present and coherent for important shareable pages.
- Indexables: inspect read-only only; do not edit directly.
- Site connections and IndexNow: report evidence only; route setup to `woocommerce-yoast-configuration`.
- SEO/readability analysis: use as supporting evidence, not as the sole basis for risk.

## Output expectations

For each output issue, record URL/template, observed output, expected safe output, evidence source, confidence, risk and next route.
