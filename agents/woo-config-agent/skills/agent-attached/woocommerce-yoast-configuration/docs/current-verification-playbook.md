# Current verification playbook

Use this playbook when a Yoast answer depends on version-sensitive facts: product packaging, licensing, AI Plus positioning, current admin UI paths, changelog-sensitive features, deprecated APIs, Google rich-result eligibility, Schema.org vocabulary, WooCommerce product data behaviour, WordPress core behaviour, or rendered output from a live site.

## Verification levels

| Level | Use when | Required evidence |
|---|---|---|
| Level 0: no verification | User asks for architecture, templates, process, or clearly labelled assumptions | Existing skill references and caveats are enough |
| Level 1: source-register check | User asks from known research scope but does not need current commercial or API certainty | Load `references/source-register.md`; state whether rows are research targets, scanned evidence, stale, or verified current |
| Level 2: current documentation check | User needs current product/API/Google/WooCommerce facts | Browse or use current official docs, then cite accessed sources and update source-register rows if editing the skill |
| Level 3: live-site/output check | User needs a client-specific audit, rendered metadata/schema, sitemap, robots, or admin path certainty | Use provided exports, screenshots, WordPress access, rendered source, crawl/Search Console evidence, or live URL checks where available |

## Mandatory current verification triggers

Perform or request current verification before making firm claims about:

- Yoast SEO Free, Premium, WooCommerce SEO, or AI Plus feature entitlements.
- Exact Yoast admin menu paths or screen labels.
- Whether FAQ, HowTo, Product, Review, Video, Breadcrumb or other structured data is currently eligible for Google rich results.
- Deprecated Yoast filters/actions and replacement APIs.
- IndexNow behaviour or supported triggers.
- llms.txt behaviour and product availability.
- WooCommerce SEO behaviour for variations, ProductGroup, Offer/AggregateOffer, shipping, returns or merchant listings.
- WordPress.org version compatibility, active installs, tested-up-to version, or plugin availability.
- Any claim that a Yoast feature was added, removed, renamed, moved or bundled.

## Source freshness expectations

| Source type | Recheck cadence for skill references | Notes |
|---|---|---|
| Yoast product pages | Before proposal/commercial use | Packaging and bundles can change without code changes |
| Yoast developer docs | Before developer handoff | APIs, filters and deprecations are version-sensitive |
| Google Search Central | Before rich-result or indexing guidance | Eligibility and interpretation can change |
| Schema.org | Before vocabulary-specific schema advice | Vocabulary evolves but is usually less volatile than Google eligibility |
| WordPress.org plugin listings | Before compatibility or availability claims | Directory metadata changes frequently |
| WooCommerce docs | Before product-data or variation assumptions | Store data model and block templates evolve |
| User-provided exports/screenshots | Treat as time-bound | Ask for date/environment when missing |

## How to report freshness

Use one of these phrases in deliverables:

- `Verified current source`: checked in this workflow and source captured.
- `Scanned evidence`: source row has an accessed date and usable facts, but may need freshness review.
- `Research target`: source is queued but not scanned evidence.
- `Needs live verification`: cannot safely confirm without current docs, admin access, rendered source, or crawl evidence.
- `Inference`: reasoned from related sources; not directly stated.

## Update workflow when maintaining the skill

1. Load `references/source-register.md` and `templates/source-register-row-template.md`.
2. Open the official source and capture title, URL, accessed date, key facts, relevance, limitations, duplicate status and confidence.
3. Update the affected reference file only with facts supported by the source row.
4. If a fact contradicts older reference material, keep both notes until resolved and label the older row `contradicted evidence` or `stale evidence`.
5. Run `scripts/validate_source_register.py`, `scripts/validate_reference_data.py`, `scripts/validate_skill_structure.py`, and `scripts/validate_evidence_states.py` when available.
6. Update `docs/changelog.md` with the source refresh and affected files.

---

*🧭 Your compass through the documentation landscape*
