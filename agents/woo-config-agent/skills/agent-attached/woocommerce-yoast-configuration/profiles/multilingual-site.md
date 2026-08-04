# Multilingual or hreflang-sensitive profile

## Scope

Sites with multiple languages, regional variants, translated content, hreflang requirements, and language-specific URLs.

## Product posture

Yoast can participate in metadata and canonicals, but multilingual behaviour depends heavily on the translation plugin and must be verified.

## Load with

- `references/multilingual-hreflang-playbook.md` for language relationships, hreflang, locale canonicals, language sitemaps, and multilingual output boundaries.
- `references/locale-metadata-governance.md` for translated metadata approval and risk classification.
- `references/configuration-reference.md` for settings and output decisions.
- `references/configuration-playbooks.md` for broader scenario strategy.
- `references/qa-checklists.md` before launch or delivery.
- `references/source-register.md` when evidence or current product status matters.

## Configuration priorities

1. Confirm site representation and organisation/person identity.
2. Decide which content types and taxonomies deserve indexation.
3. Align translated titles, descriptions, canonicals, robots, sitemaps, hreflang, breadcrumbs, social metadata, and schema.
4. Avoid duplicate archive bloat.
5. Validate rendered output on representative URLs.

## Risk controls

- Mark exact admin paths and product entitlements as `needs live verification`.
- Avoid noindex/canonical/sitemap/hreflang contradictions.
- Do not assume Yoast controls hreflang until the translation plugin or custom layer is confirmed.
- Do not import translated or AI-generated metadata without language owner approval and rendered-output QA.
- Do not use schema customisation to compensate for poor or missing source data.
- Do not treat schema validity as a promise of rich-result visibility.

## QA focus

- Homepage metadata, canonical, Open Graph, schema, sitemap inclusion, and rendered alternate-language links.
- Representative page/post/archive/taxonomy output.
- Robots.txt, llms.txt if enabled, XML sitemap index and child sitemaps.
- Breadcrumb output where active.
- Any redirects, custom canonicals, noindex decisions, and developer customisations.

## Output recommendation

Use `templates/multilingual-seo-qa-report.md` for multilingual QA, `templates/translated-metadata-approval-pack.md` for translated metadata approval, `templates/yoast-configuration-report.md` for setup, `templates/yoast-audit-report.md` for an existing site, and `templates/launch-qa-checklist.md` for launch or migration validation.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
