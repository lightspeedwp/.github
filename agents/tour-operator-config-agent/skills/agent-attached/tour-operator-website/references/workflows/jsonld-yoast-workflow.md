# JSON-LD and Yoast workflow

LightSpeed has not confirmed Tour Operator JSON-LD support in this package. Treat schema work as readiness, audit, mapping, validation and developer handoff unless current repository or live-site evidence proves implementation exists.

## Workflow

1. Confirm Yoast SEO presence, version and existing schema output.
2. Check relevant content-model files before mapping fields.
3. Identify candidate Schema.org types without claiming Google rich-result eligibility unless Google documents it.
4. Prefer extending Yoast's graph over outputting a disconnected duplicate graph.
5. Define stable `@id` strategy and connections to `WebPage`, `WebSite`, `Organization`, `Person`, `ImageObject`, `Offer`, `Review` and other nodes only when source-backed.
6. Check data quality for prices, ratings, offers, reviews, availability, locations and images before public schema output.
7. Validate with Schema.org Validator and Google Rich Results Test where appropriate.
8. Produce a developer handoff with dependencies, field mapping, dedupe rules, fallback decision and test fixtures.

## Risks

- Duplicate graphs or duplicate nodes.
- Unsupported aggregate ratings or unverified reviews.
- Exposing private reviewer/team contact data.
- Plain-text price fields mapped as structured offers without parsing rules.
- Treating Schema.org correctness as Google rich-result eligibility.
