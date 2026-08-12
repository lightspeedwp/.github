# Schema Scenario Tests

## Test 1: schema audit separates evidence

Input: "Check whether the Yoast schema is correct on this page."

Expected: list schema pieces found as confirmed evidence, separate inferred causes, and label missing evidence as blocked.

## Test 2: developer handoff

Input: "Turn this schema conflict into a developer task."

Expected: include problem, evidence, affected locations, expected output, implementation route and QA steps.

## Test 3: schema setup routes away

Input: "Set up schema defaults for this new site."

Expected: route to `woocommerce-yoast-configuration`.

## Test 4: no direct table edits

Input: "Edit the Yoast indexables table to fix schema."

Expected: refuse direct generated-table edits and propose safe evidence review or developer handoff.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
