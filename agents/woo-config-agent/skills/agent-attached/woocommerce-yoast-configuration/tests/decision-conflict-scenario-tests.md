# Decision and conflict scenario tests

Use these tests when updating decision logs, conflict handling, client-safe outputs, source freshness rules, or Yoast audit templates.

## Test 1: Client asks to index thin product tags

Input: Client wants all WooCommerce product tags indexed for "more SEO pages".

Expected behaviour:

- Load `references/conflict-resolution-playbook.md`, `references/decision-register-model.md`, `references/woocommerce-seo-reference.md`, and `templates/client-safe-summary.md` if producing client-facing output.
- Explain the duplicate/thin archive risk without promising rankings.
- Recommend review of tag quality, rendered canonical/meta robots, and sitemap inclusion before indexation.
- Create or recommend a decision record if the client overrides the safer default.

Failure conditions:

- Treats more indexed pages as automatically beneficial.
- Gives a firm Yoast UI path without verification.
- Omits QA for sitemap/noindex/canonical alignment.

## Test 2: Yoast product packaging claim conflicts across sources

Input: User asks whether a specific Premium feature is included and provides an old source.

Expected behaviour:

- Load `docs/current-verification-playbook.md`, `references/evidence-state-model.md`, `references/product-capability-matrix.md`, and `references/conflict-resolution-playbook.md`.
- Mark old source as stale or needs verification.
- Recommend current Yoast product page and/or WordPress.org verification before commercial claim.
- Avoid definitive pricing or entitlement claims unless current sources are actually checked.

Failure conditions:

- Makes a current packaging claim from stale source-register rows.
- Ignores source freshness.

## Test 3: Rendered output conflicts with settings export

Input: Settings export suggests a content type is noindexed, but rendered source shows `index, follow`.

Expected behaviour:

- Treat rendered output as current emitted state.
- Load `references/audit-triage-model.md` and `references/conflict-resolution-playbook.md`.
- Classify as high severity if indexation intent is materially wrong.
- Route developer/caching/plugin-conflict investigation if admin settings and output disagree.
- Recommend a troubleshooting note and decision record if implementation changes are required.

Failure conditions:

- Assumes settings export is authoritative.
- Fails to request or recommend rendered-source QA.

## Test 4: Organisation schema identity change

Input: Client wants to switch site representation from Person to Organisation.

Expected behaviour:

- Load `references/schema-reference.md`, `references/decision-register-model.md`, and `templates/yoast-decision-log.md`.
- Require evidence for organisation name, logo, URL, sameAs profiles, and approval owner.
- Explain schema validity versus Google display separately.
- Record QA for rendered JSON-LD and entity consistency.

Failure conditions:

- Treats the change as a purely cosmetic setting.
- Makes unsupported rich-result claims.

## Test 5: Client-safe summary from internal audit

Input: User asks to make a client-facing summary from an internal Yoast audit.

Expected behaviour:

- Load `templates/client-safe-summary.md` and `references/client-communication-guardrails.md` if present.
- Keep caveats plain-language and remove unsupported technical speculation.
- Preserve risks, owner and next action.
- Avoid exposing internal labels such as `research target` unless explaining that a source still needs verification.

Failure conditions:

- Sends internal uncertainty labels without translation.
- Promises rankings, rich results, indexing, crawl frequency or AI visibility.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
