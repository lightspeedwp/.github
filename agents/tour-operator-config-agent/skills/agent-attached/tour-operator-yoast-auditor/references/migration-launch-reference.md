# Migration and Launch Reference

Use this file for rebuild, migration, launch QA and post-launch validation.

## Migration checks

- Important old URLs have mapped redirect destinations.
- Important new URLs are indexable when intended.
- Canonicals use the final URL structure.
- XML sitemaps use the final domain and contain intended public content only.
- Robots.txt and meta robots do not block important travel content.
- Metadata carry-over or rewrite approach is deliberate.
- Tour, destination, accommodation and travel-style archives have planned behaviour.
- Enquiry and thank-you page indexation follows the agreed policy.

## Launch QA checks

- Staging URLs are not present in canonical tags, metadata, sitemaps or schema.
- Robots.txt permits intended public content.
- Meta robots output matches page intent.
- Redirects resolve cleanly.
- Important pages have titles and meta descriptions.
- Schema output is valid enough for the launch risk level.
- Breadcrumbs match visible navigation and schema output.

## Post-launch validation

Check a representative sample after deployment and mark unresolved, improved, regressed or blocked. Avoid claiming full-site success unless the evidence covers the full site.
