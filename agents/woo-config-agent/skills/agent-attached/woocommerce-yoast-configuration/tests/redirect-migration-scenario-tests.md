# Redirect and migration scenario tests

Use these tests when changing redirect, migration, launch-control, Yoast Premium redirect-manager, sitemap, canonical or migration QA workflows.

## Scenario 1 - Redirect spreadsheet only

Input: user provides a redirect map spreadsheet with old URLs and destinations, but no crawl evidence.

Expected behaviour:

- Do not claim redirects are live.
- Classify rows with `references/redirect-map-decision-model.md`.
- Produce `templates/redirect-map-review.md` if a review is requested.
- Request or recommend rendered status-code QA for representative samples.

## Scenario 2 - Yoast Premium redirect manager proposed

Input: user wants to import 500 redirects through Yoast Premium.

Expected behaviour:

- Verify or mark Yoast Premium entitlement as needed before recommending the implementation route.
- Require backup/export, sample import, rollback and post-import QA.
- Flag server/CDN duplicate-rule risk.
- Route to `templates/migration-launch-seo-control-plan.md` when launch timing matters.

## Scenario 3 - Homepage catch-all redirect

Input: old URLs without equivalent content are mapped to the homepage.

Expected behaviour:

- Mark as risky or rejected unless there is a justified business case.
- Recommend content-owner review, 410/404, relevant destination, or monitor-only state.
- Avoid presenting homepage redirects as safe SEO cleanup.

## Scenario 4 - Redirect plus canonical conflict

Input: an old product URL redirects to a new URL, but the new page canonical points to a different product.

Expected behaviour:

- Use `references/conflict-resolution-playbook.md` and `references/redirect-migration-governance.md`.
- Classify as high risk or critical depending on product value.
- Require rendered-output QA and owner routing.

## Scenario 5 - Old URLs still in sitemap

Input: crawl shows redirected old URLs still present in XML sitemaps.

Expected behaviour:

- Flag sitemap inclusion mismatch.
- Route to Yoast configuration, sitemap, or developer/admin remediation as appropriate.
- Require post-change sitemap and rendered status-code checks.

## Scenario 6 - Domain migration launch control

Input: client is moving from old domain to new domain and asks if launch is ready.

Expected behaviour:

- Produce a migration launch SEO control plan.
- Include redirects, canonicals, robots/noindex, sitemaps, schema URLs, Search Console handoff and monitoring.
- Do not mark ready if high-value URL mapping, rollback, or live-blocking checks are missing.

## Scenario 7 - Multilingual redirect mismatch

Input: old English URLs redirect correctly but old Afrikaans URLs redirect to English equivalents.

Expected behaviour:

- Route to multilingual hreflang workflow and redirect governance.
- Mark wrong-language destination risk.
- Require locale-specific canonical, hreflang and sitemap QA.

## Scenario 8 - WooCommerce product retirement

Input: discontinued products are proposed for deletion with no redirects.

Expected behaviour:

- Check product replacement, category value, search demand/backlink evidence where available, and business approval.
- Accept 410/404 only when intentionally removed and no equivalent exists.
- Require product sitemap, schema and internal-link QA.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
