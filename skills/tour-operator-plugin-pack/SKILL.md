---
name: tour-operator-plugin-pack
description: 'Use this skill for LightSpeedWP Tour Operator website audits, plugin-stack

  reviews, source-backed core content model interpretation, Tour Operator CPT,

  taxonomy, field and relationship mapping, first-party extension analysis,

  Wetu Importer integration checks, Gravity Forms enquiry-flow audits, Yoast SEO

  and JSON-LD/schema readiness, block-theme compatibility review, safe hands-on

  configuration or implementation planning, client-ready reporting, internal

  developer handoff, and recurring project-memory continuation.'
---

# Tour Operator Plugin Pack

## Scope

Use this skill for LightSpeed Tour Operator website work centred on the first-party `tour-operator` plugin stack.

Prioritise:

- Tour Operator website audits and plugin-stack reviews.
- Source-backed core content model interpretation.
- CPT, taxonomy, field, relationship, archive and template mapping.
- First-party extensions: TO Reviews, TO Team and TO Specials.
- Wetu Importer as an integration/sync layer.
- Gravity Forms enquiry workflows that support tour operator leads.
- Yoast SEO and future JSON-LD/schema readiness.
- Block-theme templates, patterns, query loops and editor usability.
- Safe implementation planning, client-safe summaries, internal handoff and project memory.

Do not treat this as a generic WordPress, travel, SEO, ecommerce, booking or marketing skill.

## Source hierarchy

Use sources in this order:

1. Fresh live-site evidence from connected tooling.
2. Confirmed repository/code evidence.
3. Bundled source-backed references in this skill, especially the core content model files.
4. Confirmed internal documentation and project rules.
5. User-provided current context.
6. Project memory.
7. Clearly labelled assumptions.

Fresh verified evidence overrides memory and older documentation. If sources conflict, state the conflict and prefer the newest verified source.

## Core content model first

Before giving Tour Operator content model advice, check the source-backed core references:

- `references/content-model/core/post-types.json`
- `references/content-model/core/taxonomies.json`
- `references/content-model/core/relationships.json`
- `references/content-model/core/source-map.md`

These files are built from uploaded Tour Operator core JSON/PHP source files and are the first packaged source of truth for core post types, taxonomies and relationship/facet sources.

Confirmed core post types from the uploaded model are:

- `tour`
- `destination`
- `accommodation`

Do not treat Reviews, Team, Specials, Vehicles, Wetu structures, departures, bookings, checkout, payments, availability engines or activity entities as core-owned unless separate source evidence proves it.

Relationship/facet sources are evidence, not proof that every referenced entity is core-owned. For example, `destination_to_review`, `destination_to_special`, `destination_to_vehicle` and `destination_to_activity` must remain extension-facing or unknown until registration evidence is confirmed.

## Operating rules

- Start with the LightSpeedWP Tour Operator core plugin before suggesting alternatives.
- Separate core plugin behaviour from first-party extension behaviour.
- Read before writing.
- Audit before implementation.
- Ask at most one focused blocker question when required.
- Do not invent slugs, fields, settings, taxonomies, relationships, templates, schema output or plugin behaviour.
- Use exact keys only when confirmed by live inspection, source code, bundled references or supplied project material.
- Treat Wetu Importer as a sync/integration layer unless source evidence proves it owns stable content structures.
- Keep UK English and LightSpeed delivery standards.
- Prefer minimal, maintainable changes that preserve the first-party stack.

## Evidence labels

Label material claims using one of:

- Confirmed live evidence
- Confirmed repository evidence
- Confirmed source-backed reference
- Confirmed documentation evidence
- Confirmed project rule
- Memory only
- Assumption
- Unknown

## Task routing

For broad or unclear requests, choose the smallest useful route:

- Fast triage
- Full website audit
- Plugin-stack review
- Source-backed content-model mapping
- CPT/taxonomy/field/relationship audit
- Wetu Importer readiness or integration audit
- Gravity Forms enquiry-flow audit
- Yoast SEO and schema-readiness audit
- Block-theme compatibility audit
- Launch-readiness audit
- Implementation planning
- Developer handoff
- Client-safe summary
- Memory update summary

## Default audit order

Unless the user asks for a narrower task:

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

## Write-safety rules

Use implementation workflows only when the user clearly asks for changes.

Every implementation workflow must include:

1. Pre-change inspection.
2. Risk classification.
3. Change plan.
4. Execution steps.
5. Verification steps.
6. Rollback or manual recovery note.
7. Evidence summary.
8. Handoff note.

Never claim a change was made unless connected tooling confirms it. If tooling cannot execute the change, provide implementation guidance only.

## JSON-LD and Yoast rules

LightSpeed has not yet added JSON-LD support to the Tour Operator plugin.

Treat Yoast JSON-LD work as planning, audit, validation and developer handoff unless repository or live-site evidence proves implementation exists.

When handling schema work:

- Check whether Yoast SEO is active and versioned.
- Inspect current Yoast schema output before proposing custom additions.
- Prefer extending Yoast's graph where feasible.
- Avoid disconnected duplicate schema graphs.
- Use stable node IDs.
- Separate Schema.org correctness from Google rich-result eligibility and AI/search discoverability assumptions.
- Validate with Schema.org Validator and Google Rich Results Test where appropriate.

## Reference navigation

Load reference files only when relevant:

- `references/workflows/audit-workflows.md` for audit variants and sequence.
- `references/workflows/implementation-workflows.md` for change planning, verification and rollback.
- `references/workflows/gravity-forms-tour-operator-workflows.md` for enquiry-flow checks.
- `references/workflows/jsonld-yoast-workflow.md` for JSON-LD/Yoast planning.
- `references/workflows/block-theme-tour-operator-patterns.md` for template and pattern checks.
- `references/outputs/output-contracts.md` for report formats.
- `references/evidence/evidence-model.md` for confidence and conflict rules.
- `references/evidence/source-links.md` for retained source URLs.
- `references/content-model/README.md` for content-model navigation.
- `references/content-model/core/post-types.json` for confirmed core post types and fields.
- `references/content-model/core/taxonomies.json` for confirmed core taxonomy configs.
- `references/content-model/core/relationships.json` for confirmed FacetWP relationship/facet sources.
- `references/content-model/core/source-map.md` for source-to-reference mapping.
- `references/content-model/extensions/*.json` for conservative extension models.
- `references/content-model/integrations/wetu-importer.json` for Wetu integration checks.
- `references/schema/jsonld-yoast-schema-map.json` for schema candidate mapping.

## Memory rules

Read memory for recurring project/site work. Update memory only with concise durable facts: client/site, live/staging URLs, approved plugin stack, confirmed active extensions, block-theme status, enquiry workflow decisions, Yoast/SEO decisions, schema-readiness status, current blockers, implementation decisions, unresolved risks, last verified date and evidence source.

Never store credentials, secrets, raw tool dumps, full content-model JSON, long reports, speculative assumptions or private client data that is not needed for future delivery.

Fresh live evidence overrides memory.

## Output rules

Keep outputs practical, source-aware and evidence-labelled. Separate scope, evidence, confirmed findings, unknowns, risks, next actions and memory update candidates. Keep client-safe summaries free of internal speculation.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
