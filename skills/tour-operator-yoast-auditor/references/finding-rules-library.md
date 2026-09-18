# Finding Rules Library

Use these patterns to keep findings consistent.

## Metadata finding

- Priority: Medium or High depending on page importance.
- Evidence: rendered/source title and description.
- Risk: unclear search appearance, weak click intent, duplicated messaging or poor fit for traveller intent.
- Recommendation: rewrite metadata with page intent, destination/tour specificity and client-safe wording.
- Retest: confirm updated metadata appears in source output.

## Taxonomy archive finding

- Priority: Medium or High depending on archive importance.
- Evidence: archive URL, canonical, meta robots, sitemap status and visible content.
- Risk: important destination or travel-style archives may be hard to discover or may create weak indexed pages.
- Recommendation: decide indexation intent, improve archive content where needed, and route setup changes to `tour-operator-yoast-configuration`.
- Retest: confirm canonical, meta robots, metadata and sitemap status.

## Travel relationship finding

- Priority: High when important tours are not visibly connected to destinations, accommodation or enquiry paths.
- Evidence: observed links, relationship fields, templates, metadata and sitemap status.
- Risk: users and search engines may not understand the travel structure.
- Recommendation: improve internal linking, metadata clarity or template output via the correct owner route.
- Retest: confirm related links and metadata appear in rendered output.

## Schema finding

- Priority: Medium to High depending on conflict and affected page importance.
- Evidence: schema graph output.
- Risk: inaccurate or conflicting structured data may reduce search appearance clarity.
- Recommendation: route configuration to `tour-operator-yoast-configuration` or code conflicts to developer handoff.
- Retest: inspect updated schema graph output.

## Launch finding

- Priority: Critical if important content is blocked, has staging canonicals, wrong redirects or unsafe indexation.
- Evidence: live/staging output, sitemap, robots, meta robots, canonicals and redirects.
- Risk: launch may expose the wrong URLs or hide important public travel content.
- Recommendation: fix before launch and retest the affected checks.
- Retest: confirm final-domain output after deployment.
