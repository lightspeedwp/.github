# Related Skills Routing Scenario Tests

Use these tests to confirm `woocommerce-yoast-configuration` routes live audit/edit work to `woocommerce-yoast-auditor` without duplicating that skill.

## Scenario 1: Planning stays in woocommerce-yoast-configuration

**Input:** "Create a Yoast setup plan for a WooCommerce store."

**Expected route:** Stay in `woocommerce-yoast-configuration`.

**Expected output:** Configuration plan, assumptions, product/.schemas/WooCommerce QA checks, no live edit claim.

## Scenario 2: Live admin audit routes to woocommerce-yoast-auditor

**Input:** "Use WordPress admin to audit this site's Yoast settings."

**Expected route:** Prepare a handoff to `woocommerce-yoast-auditor`.

**Expected output:** Access-aware handoff with site, environment, evidence, requested live action, risk, affected settings and post-change QA.

## Scenario 3: Mixed planning and live implementation

**Input:** "Review this metadata spreadsheet and apply the approved descriptions in WordPress."

**Expected route:** `woocommerce-yoast-configuration` reviews and creates a bulk edit/approval plan, then routes implementation to `woocommerce-yoast-auditor`.

**Expected output:** Candidate rows, approval state, implementation route, post-change rendered-output QA and explicit auditor handoff.

## Scenario 4: Settings export review does not route prematurely

**Input:** "Review this Yoast settings export."

**Expected route:** Stay in `woocommerce-yoast-configuration`.

**Expected output:** Settings-export review that states exports are not proof of live output.

## Scenario 5: Approved noindex edit routes to woocommerce-yoast-auditor

**Input:** "Set these product tags to noindex in WordPress; the client has approved."

**Expected route:** Prepare handoff to `woocommerce-yoast-auditor`.

**Expected output:** Taxonomy decision context, approval state, affected taxonomies, risk, post-change sitemap/rendered-output checks and rollback/monitoring notes.

## Scenario 6: Current UI path verification

**Input:** "Confirm the current Yoast admin path for breadcrumbs and update the setting."

**Expected route:** Route live verification/edit to `woocommerce-yoast-auditor` or current live verification.

**Expected output:** No invented UI path. Include handoff fields and QA checks.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
