# QA Checklists

Use these checks after configuration changes, launch changes, migration work or remediation.

## Rendered-output checks

- Page title renders as expected.
- Meta description renders as expected.
- Canonical tag is present and points to the approved URL.
- Robots directives match the approved decision.
- Schema JSON-LD is present where expected and valid enough for the intended use.
- Breadcrumb output matches visible navigation intent.
- Social metadata exists for key pages where required.

## Sitemap checks

- XML sitemap index loads.
- Important destination, tour, accommodation and guide URLs appear where expected.
- Noindex URLs are not listed unless there is a documented plugin behaviour reason.
- Redirected URLs are removed from submitted sitemap sets.
- Translated sitemaps are checked separately where relevant.

## Redirect checks

- Old URL responds with the intended status.
- Target URL is live and indexable where intended.
- No avoidable chains or loops exist.
- Canonical on the target does not contradict the redirect plan.
- Internal links are updated where practical.

## Taxonomy checks

- Strategic archives have useful intro copy.
- Thin archives are improved, consolidated or excluded from index.
- Archive title and description templates do not create duplicates.
- Destination and travel-style archives are sampled on mobile and desktop.

## Launch checks

- Robots rules allow intended crawling.
- Sitemap URLs are current.
- Key canonical tags are correct.
- Important redirects work.
- Tracking and Search Console evidence are separated from Yoast evidence.
