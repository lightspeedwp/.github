# Configuration Reference

Use this reference for general Yoast SEO setup decisions on WordPress sites.

## Core areas

- Search appearance for content types, taxonomies and archives.
- Title and meta templates.
- Social metadata defaults.
- XML sitemap inclusion.
- Robots and noindex settings.
- Canonical behaviour.
- Breadcrumb settings.
- Schema settings and graph output.
- `llms.txt` and related AI-facing metadata where supported.

## Safe defaults

- Keep important public pages indexable unless there is a clear duplicate, quality or privacy reason.
- Exclude low-value utility pages, test pages and internal thank-you pages from index where appropriate.
- Keep media attachment pages disabled or non-indexable unless intentionally used.
- Avoid global noindex changes without approval and rendered-output QA.
- Use consistent title and meta templates but review key pages manually.

## Tour operator considerations

- Prioritise destinations, tours, accommodation and guide pages in metadata QA.
- Treat travel-style pages as strategic only when they have unique copy and strong internal links.
- Exclude thin tags and accidental archives unless improved.
- Keep enquiry pages clear, indexable or non-indexable according to campaign intent and privacy needs.

## Approval boundaries

Require explicit approval for changes that affect indexation, canonical targets, XML sitemap inclusion, redirects, schema output or bulk metadata.
