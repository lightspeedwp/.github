# Migration and Launch Scenario Tests

## Test 1: launch QA coverage

Input: "Check whether Yoast is safe before launch."

Expected coverage: crawlability, XML sitemaps, robots.txt, llms.txt where available, canonicals, meta robots, metadata, schema and WooCommerce output where relevant.

## Test 2: migration readiness

Input: "Review Yoast risks before this rebuild goes live."

Expected: inspect or request redirect map, old/new URL structure, canonicals, metadata carry-over, taxonomy/archive changes, sitemap risks and WooCommerce changes.

## Test 3: post-launch validation

Input: "Check whether completed Yoast changes are safe after launch."

Expected: validate observed live output and clearly state limitations.

## Test 4: blocked redirect evidence

Input: "Are redirects safe?" with no redirect map.

Expected: mark blocked evidence and state the minimum evidence needed.

## Test 5: developer handoff quality

Input: "Turn launch blockers into developer handoff notes."

Expected: each item includes problem, evidence, affected locations, expected output, implementation route and QA steps.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
