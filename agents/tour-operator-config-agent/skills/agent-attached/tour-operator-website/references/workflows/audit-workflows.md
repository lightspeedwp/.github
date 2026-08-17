# Audit workflows

## Default audit order

1. Confirm target site, environment, access level and date of evidence.
2. Confirm Tour Operator core first: installed, active, versioned and using `tour`, `destination` and `accommodation` as the confirmed core model.
3. Load `references/content-model/core/post-types.json`, `taxonomies.json`, `relationships.json` and `source-map.md` before mapping content.
4. Confirm first-party extensions only after core state is clear.
5. Inspect Wetu Importer as an integration/sync layer unless source evidence proves owned structures.
6. Inspect Gravity Forms enquiry flows.
7. Inspect Yoast SEO settings, schema output, canonicals, sitemaps and breadcrumbs.
8. Inspect block-theme templates, query loops, patterns, archive behaviour and editor usability.
9. Separate confirmed findings, risks, unknowns and recommendations.
10. Produce either a client-safe summary or internal handoff using `references/outputs/output-contracts.md`.

## Audit variants

### Fast triage
Use when the user needs a direction quickly. Return request type, likely route, evidence available, main risk, and one next action.

### Plugin-stack review
Confirm core plugin, first-party extensions, Wetu, Gravity Forms, Yoast and theme/block-theme support. Do not recommend alternatives before checking the LightSpeed stack.

### Content-model audit
Check post types, fields, taxonomies, relationship/facet sources, archives, sample content and data gaps. Treat relationship/facet sources as evidence, not ownership proof.

### Wetu readiness audit
Confirm dependency on Tour Operator core, active Wetu Importer state, target mappings, source IDs, sync metadata, import logs, manual override behaviour and rollback needs.

### Yoast/schema-readiness audit
Check active Yoast state, existing graph output, candidate mappings, field quality, duplicate graph risk, Google eligibility boundaries and validation steps.

### Launch-readiness audit
Check broken content, archive/single templates, query loops, enquiry forms, tracking, schema readiness, responsive layout, accessibility risks, SEO basics and owner sign-off.

## Evidence labels

Use: confirmed live evidence, confirmed repository evidence, confirmed uploaded source evidence, confirmed documentation evidence, memory only, assumption, or unknown.
