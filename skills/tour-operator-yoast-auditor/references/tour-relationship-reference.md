# Tour Relationship Reference

Use this file when the audit involves tours, destinations, accommodation, itineraries, travel styles, specials, reviews or enquiry journeys.

## What to inspect

- Tour pages: metadata, canonical, meta robots, schema, sitemap inclusion and internal links.
- Destination pages and archives: metadata, canonical, meta robots, sitemap inclusion and related tour links.
- Accommodation pages and archives: metadata, canonical, meta robots, sitemap inclusion and related tour links.
- Travel styles: archive metadata, canonical, indexation intent and related tour links.
- Itineraries: whether structured sections help users understand the tour and avoid duplicated metadata.
- Specials: whether seasonal or campaign pages point to relevant tours and have deliberate indexation.
- Reviews: whether review content supports relevant tours or destinations without unsupported claims.
- Enquiry paths: whether enquiry and thank-you pages have safe metadata and indexation behaviour.

## Common findings

- Important tours do not link back to their destination pages.
- Destination archives are indexable but have thin or generic metadata.
- Accommodation pages exist but are not connected to relevant tours.
- Travel-style archives duplicate each other or lack clear intent.
- Specials are public but not linked to the main relevant travel pages.
- Thank-you pages are included in sitemaps or indexable without clear intent.

## Owner routing

- Content/editorial: metadata wording, relationship copy, destination descriptions and itinerary clarity.
- Developer: missing rendered relationships, template output issues, link rendering, schema conflicts and risky redirects.
- `tour-operator-yoast-configuration`: metadata templates, schema setup, sitemap setup, breadcrumbs and canonical settings.
- `tour-operator-yoast-auditor`: evidence review, risk classification, report writing and post-change validation.
