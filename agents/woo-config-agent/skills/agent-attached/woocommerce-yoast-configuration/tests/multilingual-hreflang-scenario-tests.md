# Multilingual and hreflang scenario tests

Use these scenarios to regression-test the multilingual Yoast workflow.

## Scenario 1: missing hreflang on translated pages

Input: rendered source for English and German pages shows self-canonicals, translated metadata, but no alternate-language links.

Expected behaviour:

- Do not blame Yoast automatically.
- Load `references/multilingual-hreflang-playbook.md`.
- Identify translation layer as required evidence.
- Classify as partial evidence from rendered source.
- Recommend verifying the translation plugin relationship and rendered alternate links.
- Use `templates/multilingual-seo-qa-report.md` if a report is requested.

## Scenario 2: canonical points to default language

Input: Afrikaans product page canonical points to English product page while both are indexable.

Expected behaviour:

- Treat as a high-risk canonical/hreflang conflict until proven intentional.
- Load WooCommerce reference as well as multilingual playbook.
- Ask for or infer the translation plugin and product relationship evidence.
- Separate SEO/admin action from developer or translation-plugin action.
- Require rendered-output QA after changes.

## Scenario 3: translated metadata copied from default language

Input: CSV contains English title and meta descriptions for French URLs.

Expected behaviour:

- Load `references/locale-metadata-governance.md` and bulk metadata governance if the batch is large.
- Classify rows as duplicate/default-language carryover.
- Do not approve import.
- Produce `templates/translated-metadata-approval-pack.md` when a deliverable is requested.

## Scenario 4: incomplete translations are indexable

Input: crawl shows `/de/` pages with English body copy, German URL structure, and indexable robots.

Expected behaviour:

- Do not solve only with Yoast metadata.
- Route to content owner/client decision: complete translation, noindex, redirect, or temporarily exclude.
- Create a decision log if the noindex/canonical/sitemap state changes.
- Mark commercial or legal claims as requiring client approval.

## Scenario 5: multilingual sitemap mismatch

Input: sitemap contains English and Spanish URLs, but crawl discovers Italian pages not in the sitemap.

Expected behaviour:

- Separate sitemap inclusion from indexability and hreflang correctness.
- Check translation state and content type inclusion per language.
- Recommend representative sitemap and rendered-output QA.
- Avoid claiming sitemap inclusion guarantees indexing.

## Scenario 6: locale-specific product metadata

Input: translated WooCommerce product pages have different prices/currencies and machine-translated descriptions.

Expected behaviour:

- Load WooCommerce reference, multilingual playbook, and locale metadata governance.
- Treat price, currency, availability, shipping and claims as high risk.
- Require business owner approval before metadata/schema-facing content is accepted.
- Require Product/ProductGroup/Offer rendered JSON-LD QA.

## Scenario 7: separate domains per language

Input: English site on `.com`, German site on `.de`, same brand, separate WordPress installs.

Expected behaviour:

- Treat as multilingual/portfolio hybrid.
- Do not assume one Yoast install controls all language relationships.
- Recommend per-domain rendered-output QA and cross-domain relationship evidence.
- Use client-safe language about signal alignment, not ranking promises.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
