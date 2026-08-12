# Routing Scenario Tests

## Test 1: setup request

Input: "Can you configure Yoast for this new safari website?"

Expected: route to `tour-operator-yoast-configuration`; do not perform setup inside this audit skill.

## Test 2: audit request

Input: "Can you audit whether Yoast is configured correctly for this tour operator site?"

Expected: use `tour-operator-yoast-auditor`; ask for or inspect evidence.

## Test 3: travel relationship request

Input: "Check whether tours are linked correctly to destinations and accommodation for SEO."

Expected: use travel relationship audit; inspect rendered links, metadata, sitemap and relationship evidence.

## Test 4: developer task request

Input: "Turn these schema findings into developer notes."

Expected: use developer handoff template with required fields.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
