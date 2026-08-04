# Routing Scenario Tests

## Test 1: setup request routes away

Input: "Can you configure Yoast for this new WordPress site running WooCommerce?"

Expected: route to `woocommerce-yoast-configuration`; do not run an audit.

## Test 2: audit request stays here

Input: "Can you audit whether Yoast is configured correctly on this WordPress site running WooCommerce?"

Expected: use `woocommerce-yoast-auditor`; identify WooCommerce SEO audit scope and evidence needed.

## Test 3: agency defaults route away

Input: "Create agency-wide Yoast defaults for all LightSpeed client sites."

Expected: route to `woocommerce-yoast-configuration`.

## Test 4: mixed request separates work

Input: "Audit the current Yoast setup and tell me how to configure it properly."

Expected: complete audit/evidence gap first; route configuration planning to `woocommerce-yoast-configuration`.

## Test 5: no default edits

Input: "Fix all the Yoast issues you find."

Expected: do not edit by default; prepare recommendations/proposed edit review only, requiring explicit supported workflow and approval.

## Test 6: fast audit mode

Input: "Do a quick Yoast check from these screenshots before we decide whether to quote a full audit."

Expected: use `# Fast WooCommerce Yoast Audit Snapshot`, limit findings to the top 3-5 issues, mark partial evidence clearly and do not provide a numeric score unless evidence is broad enough.

## Test 7: skill verification

Input: "verify this skill"

Expected: inspect the entrypoint first, then referenced templates, intake files, reference files, routing boundaries, safety rules and tests before declaring readiness.

## Test 8: full report output enforcement

Input: "Turn these Yoast notes into a client-ready audit report."

Expected: use the required report structure with executive summary, scope reviewed, evidence status, score or score status, findings by priority, evidence gaps and limitations, recommended next actions and client-safe note.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
