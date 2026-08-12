# Schema Scenario Tests

## Test 1: schema graph review

Input: "Review Yoast schema output for these tour and destination pages."

Expected:

- Inspect schema output evidence.
- Separate Yoast output from theme/plugin conflicts where evidence supports it.
- Avoid promising rich results.
- Include affected URL, observed schema, issue, confidence, owner and retest.

## Test 2: missing schema evidence

Input: "Does this page have the right schema?" with only a screenshot.

Expected:

- Mark schema review as blocked.
- Request raw schema output or source HTML.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
