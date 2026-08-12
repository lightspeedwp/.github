# Multilingual hreflang playbook

Use this playbook when a Yoast task involves translated content, regional variants, language switchers, hreflang, multilingual sitemaps, localised metadata, or a translation plugin such as WPML, Polylang, TranslatePress, Weglot, MultilingualPress, or a custom language setup.

## Scope

This playbook helps the agent separate what Yoast controls from what the multilingual layer controls.

Yoast may contribute metadata, canonicals, schema, breadcrumbs, XML sitemap entries, Open Graph data, and robots directives. The translation plugin, theme, custom code, or platform routing usually controls translated URL relationships, language switchers, hreflang links, translated slugs, and language-specific content availability.

## Minimum evidence

Classify the available evidence before recommending a fix:

| Evidence | What it can prove | What it cannot prove |
|---|---|---|
| Settings export | Yoast configuration intent | Rendered hreflang, live canonicals, translated metadata output |
| Screenshot | Partial admin or rendered state | Complete page relationships or sitemap consistency |
| Rendered source | Observed page-level output | Whether translation relationships are configured correctly in admin |
| Crawl export | Cross-page patterns and missing tags | Current plugin settings unless exported at same time |
| XML sitemap sample | Which URLs are submitted | Correct hreflang, canonical, or translated content quality |
| Translation plugin export | Language relationships and translation status | Yoast rendered output without source or crawl checks |
| Search Console international targeting or page indexing data | Google-observed signals | Cause of a Yoast or translation-plugin problem on its own |

## Intake questions

Ask only the questions that materially change the recommendation:

1. Which languages and/or regional variants exist?
2. Which translation or multilingual plugin controls language relationships?
3. Are languages in subdirectories, subdomains, separate domains, query parameters, or another structure?
4. Are translations complete, partial, machine-translated, or editorially approved?
5. Which content types and taxonomies are translated?
6. Are translated slugs, titles, meta descriptions, Open Graph fields, product data, and schema fields maintained separately?
7. Is there a current crawl, rendered source sample, sitemap sample, or translation-plugin export?
8. Is the goal configuration, QA, migration, troubleshooting, or client-safe explanation?

## Decision workflow

1. Identify the language architecture before discussing Yoast changes.
2. Establish the source of truth for language relationships: translation plugin, custom code, separate sites, or manual links.
3. Check whether each representative URL has the expected self-canonical, robots state, metadata, schema, and alternate language relationships.
4. Check whether translated URLs are present or intentionally absent from XML sitemaps.
5. Check whether untranslated or fallback URLs are indexable by mistake.
6. Check whether metadata is localised, duplicated, machine-generated, missing, or awaiting approval.
7. Separate Yoast configuration changes from translation-plugin, theme, server, and editorial tasks.
8. Produce either a multilingual QA report, a translated metadata approval pack, a remediation backlog, or a client-safe summary.

## Common multilingual Yoast risks

| Risk | Typical evidence | Likely owner | Safe next action |
|---|---|---|---|
| Missing or inconsistent hreflang | Rendered source or crawl export | Translation plugin / developer | Verify translation relationships and rendered alternate links |
| Canonical points to wrong language | Rendered source | Yoast setting, custom filter, translation plugin, developer | Compare canonical, URL language, and alternate-language group |
| Translated page noindexed unexpectedly | Rendered source, crawl, settings | WordPress admin or translation plugin | Confirm intended indexation per language before changing |
| Default-language metadata copied across translations | Crawl export, rendered source, spreadsheet | Content/editorial | Route to translated metadata approval pack |
| Incomplete translations are indexable | Translation export, crawl | Client/editorial | Decide noindex, redirect, complete translation, or exclude from sitemap |
| Sitemap includes orphan translated URLs | Sitemap/crawl | Translation plugin, Yoast, developer | Verify translation state and inclusion rules |
| Schema mixes languages | JSON-LD output | Yoast data source, theme, plugin, content | Check page entity fields and localised organisation/product data |
| Product variation URLs differ by language | WooCommerce crawl and product data | WooCommerce/admin/developer | Load WooCommerce reference and multilingual playbook together |

## Hreflang and canonical handling

Do not assume hreflang correctness from Yoast settings. Require rendered source or crawl evidence.

Use these checks for each representative language set:

- Each indexable language URL should normally self-canonical unless a deliberate consolidation decision is documented.
- Alternate-language tags should be reciprocal across the language set.
- Language and region codes should match the actual target audience and URL structure.
- Fallback or `x-default` should be documented when used.
- Noindex URLs should not be treated as valid indexable alternates without a deliberate decision.
- Redirecting URLs should not be used as final alternate targets.
- Canonical and hreflang should not send conflicting signals.

## Metadata localisation

Treat translated metadata as editorial content, not a mechanical copy operation.

Check:

- Title and meta description language.
- Search intent differences by language or region.
- Brand, product, event, location, and service names.
- Legal, pricing, delivery, availability, and claims that may differ by market.
- Social metadata and images where localised social sharing matters.
- AI-generated or machine-translated metadata approval status.

Route bulk translated metadata to `references/bulk-metadata-governance.md` and `templates/translated-metadata-approval-pack.md` when multiple rows need review.

## WooCommerce multilingual checks

When WooCommerce is present, also load `references/woocommerce-seo-reference.md`.

Check translated product URLs, product categories, product tags, attributes, brand fields, GTIN/identifier consistency, pricing/currency, availability, shipping/returns, review snippets, Product/ProductGroup output, and sitemap inclusion per language.

## Output rules

- Say which language/plugin evidence was available.
- Do not claim Yoast is responsible for hreflang until the implementation layer is confirmed.
- Separate Yoast/admin fixes from translation-plugin, developer, content, and client approval actions.
- Mark UI paths, plugin capability, and current Yoast/translation plugin behaviour as `needs live verification` unless verified in the current workflow.
- For client-facing notes, avoid saying "Google will" and use "this helps align signals" or "this reduces ambiguity" instead.
