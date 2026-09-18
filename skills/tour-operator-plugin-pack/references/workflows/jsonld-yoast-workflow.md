# JSON-LD and Yoast workflow

LightSpeed has not yet added JSON-LD support to the Tour Operator plugin. Treat this as planning, audit, validation and developer handoff unless implementation is verified from code or live output.

## Workflow

1. Confirm Yoast SEO is installed, active and versioned.
2. Inspect current Yoast schema output.
3. Identify the page/content type and source-backed Tour Operator fields.
4. Map candidate Schema.org types from `references/schema/jsonld-yoast-schema-map.json`.
5. Decide whether the content should be the main entity of the page or a related entity.
6. Define stable `@id` strategy.
7. Reuse Yoast graph nodes where appropriate.
8. Avoid duplicate Organization, Person, ImageObject, BreadcrumbList, WebSite and WebPage output.
9. Separate Schema.org correctness from Google rich-result eligibility.
10. Validate with Schema.org Validator and Google Rich Results Test where appropriate.

## Handoff requirements

Include scope, non-goals, dependencies, content-type mapping, field-to-property mapping, Yoast graph strategy, node IDs, dedupe rules, fallback decision, validation checklist, risks and open questions.
