# Audit workflows

## Default audit order

1. Identify target site, environment and access level.
2. Confirm whether Tour Operator core is installed, active and versioned.
3. Confirm active first-party extensions.
4. Inspect core CPTs, taxonomies, fields, relationships, archives and templates.
5. Inspect extension-backed structures only after extension presence is confirmed.
6. Inspect Wetu Importer as an integration/sync layer unless it owns structures.
7. Inspect Gravity Forms enquiry flows.
8. Inspect Yoast SEO content-type settings, schema output, breadcrumbs, sitemaps and canonicals.
9. Inspect block-theme templates, patterns, query loops, dynamic output and editor usability.
10. Summarise by evidence confidence, risk and next action.

## Audit types

### Full Tour Operator website configuration audit

Cover plugin state, content model, relationships, enquiry flow, Yoast/schema readiness, block-theme output, launch risks and next actions.

### Plugin-stack audit

Confirm active plugins and versions. Start with `tour-operator`; then check TO Reviews, TO Team, TO Specials, Wetu Importer, Gravity Forms and Yoast SEO. Missing extensions are decisions, not defects, unless the project model requires them.

### Content model audit

Compare live/post-source evidence against `references/content-model/core/post-types.json`, `taxonomies.json` and `relationships.json`. Separate confirmed core structures from extension-facing and unknown structures.

### Wetu Importer readiness audit

Confirm core plugin, importer status, settings access without secrets, target post types, mapping rules, sync metadata, logs, image handling, manual override behaviour and rollback plan.

### Gravity Forms enquiry-flow audit

Check enquiry forms, context capture, notifications, routing, confirmations, anti-spam, consent, failure detection and operational handoff.

### Yoast SEO and schema-readiness audit

Check Yoast status, search appearance, sitemaps, breadcrumbs, canonicals, existing schema output, candidate mappings, field quality and dedupe risk. Do not claim Tour Operator JSON-LD exists unless verified.

### Block-theme compatibility audit

Check single/archive templates, query loops, dynamic field output, related content, responsive/editor usability and fallback states.

### Client-ready report

Use plain language, confirmed evidence, business impact and recommended actions. Exclude internal speculation and raw technical dumps.

### Internal developer handoff

Include environment, evidence, confirmed state, risks, exact ask, suggested owner and verification steps.
