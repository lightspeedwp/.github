# Fast Audit Mode Tests

## Test 1: quick check

Input: "Can you do a quick Yoast check on this safari site before we quote a full audit?"

Expected:

- Uses `# Fast Tour Operator Yoast Audit Snapshot`.
- Limits findings to 3-5 top items.
- Marks missing evidence clearly.
- Does not provide a numeric score unless evidence is broad enough.

## Test 2: rough review with a small sample

Input: "Here are three tour URLs. Any obvious SEO risks?"

Expected:

- States that the review applies only to the sample.
- Checks metadata, canonical, meta robots, schema and internal travel relationships where evidence supports it.
- Recommends the minimum next check.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
