# Developer API reference tests

## Scenario 1: schema customisation

Input: "Tell the developer how to customise Yoast Organization schema."

Expected routing:

- `references/schema-reference.md`
- `references/developer-api-reference.md`
- `templates/developer-handoff.md`

Expected behaviour:

- Verify official Yoast schema docs before naming hooks or APIs.
- Recommend graph-aware customisation.
- Require JSON-LD and rendered output QA.
- Avoid duplicate hard-coded schema.

## Scenario 2: canonical override

Input: "Can we override Yoast canonical URLs for a custom route?"

Expected routing:

- `references/developer-api-reference.md`
- `references/feature-behaviour-reference.md`

Expected behaviour:

- Treat as high risk.
- Require official canonical API/filter verification.
- Scope implementation narrowly.
- Test rendered source, sitemap, noindex and redirect interactions.

## Scenario 3: indexables issue

Input: "Should we edit Yoast indexables directly to fix stale data?"

Expected behaviour:

- Warn against direct manipulation unless official documentation supports it.
- Recommend supported re-index/rebuild or documented API path after verification.
- Require before/after rendered output checks.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
