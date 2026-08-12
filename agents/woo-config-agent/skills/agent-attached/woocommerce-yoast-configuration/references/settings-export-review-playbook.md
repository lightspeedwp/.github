# Settings export review playbook

Use this file when a user provides a Yoast settings export, copied Yoast UI settings, option snippets, screenshots, CSV notes, or a partial configuration dump and asks for review, normalisation, risk classification, or a configuration plan.

## Goal

Turn imperfect configuration artefacts into a practical agency review without pretending the artefact proves rendered SEO output.

## Supported input types

- Yoast settings export JSON or copied settings text.
- WordPress option snippets, including partial `wpseo` option values.
- Screenshots or pasted notes from Yoast admin screens.
- Crawl/export rows that show titles, descriptions, canonicals, robots, schema or sitemap status.
- Client notes describing intended indexation, schema, WooCommerce or archive behaviour.

## Evidence boundary

A settings artefact can confirm intended configuration only when the setting name and value are visible. It does not prove what search engines see. Always separate:

1. Observed setting value.
2. Inferred setting meaning.
3. Expected rendered output.
4. Actual rendered output, if provided.
5. Missing QA evidence.

## Review workflow

1. Identify artefact type and access level.
2. Extract visible settings, values, plugin names and any timestamps or environment notes.
3. Map each visible setting to `references/configuration-reference.md` where possible.
4. Load the matching profile when site type is known.
5. Classify each item as safe, needs review, likely risky, blocking, not enough evidence, or out of scope.
6. Flag settings that require rendered-output QA rather than settings-only judgement.
7. Create decision records for changes to indexation, canonicals, schema, sitemaps, redirects, WooCommerce archive strategy or product mix.
8. Use `templates/settings-export-review.md` for the deliverable.

## Minimum review fields

For each finding capture:

- Setting group.
- Setting name or visible UI label.
- Observed value.
- Expected agency default, if known.
- Site scope: site, content type, taxonomy, post, term, product, archive, media or unknown.
- Evidence state.
- Risk level.
- Recommendation.
- Rendered-output QA needed.
- Source or artefact reference.

## Common risk patterns

| Pattern | Why it matters | Normal next action |
|---|---|---|
| Site-wide noindex or environment noindex left enabled | Can suppress indexing if live | Verify rendered meta robots and WordPress reading settings |
| Important content type excluded from search or sitemap | Can reduce discoverability | Confirm content type purpose, sitemap inclusion and rendered robots |
| Thin or utility taxonomy indexed | Can create duplicate or low-value archive pages | Review taxonomy strategy and crawl samples |
| Attachment URLs enabled unexpectedly | Can create thin media pages | Confirm media redirect behaviour and rendered URLs |
| Author/date archives indexed on a single-author site | Can create duplicate archives | Review site profile and archive strategy |
| Product tags indexed without content strategy | Often creates thin ecommerce archives | Review product taxonomy content and filtered URL behaviour |
| Canonical customisation noted but not rendered | Settings alone do not prove canonical output | Run rendered-output QA |
| Schema identity changed without source evidence | Can misrepresent organisation/person/entity data | Require approval and schema QA |
| AI-generated metadata accepted without review evidence | Can introduce unsupported claims | Require human review and claim check |

## What not to infer

Do not infer the following from a settings export alone:

- That Google has crawled, indexed, ignored or accepted the output.
- That a sitemap URL is reachable.
- That robots.txt or llms.txt currently renders as intended.
- That canonical, Open Graph, Twitter/X or schema output is conflict-free.
- That WooCommerce product schema is complete.
- That redirects work.
- That premium, WooCommerce SEO or AI Plus entitlements are active unless shown or verified.

## QA route

Use `references/rendered-output-qa-playbook.md` when the settings review needs proof from page source, HTTP headers, robots.txt, llms.txt, XML sitemaps, schema validators or Search Console.

## Maintenance

Update this file when Yoast export formats, UI labels, settings groups, agency defaults, or common audit artefacts change.
