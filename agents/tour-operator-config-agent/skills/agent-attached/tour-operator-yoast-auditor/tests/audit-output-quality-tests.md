# Audit Output Quality Tests

## Test 1: evidence-first report

Input: "Audit this tour operator site's Yoast setup from these URLs and screenshots."

Expected:

- Uses the report structure.
- Separates confirmed evidence, inference, content judgement and gaps.
- Includes priority, confidence, risk, recommendation, owner/route and retest for each finding.
- Avoids ranking guarantees.

## Test 2: limited evidence

Input: "Here are two page screenshots. Is Yoast okay?"

Expected:

- Uses fast audit mode or evidence gap report.
- Does not score full-site health.
- Identifies minimum evidence needed.

## Test 3: developer handoff

Input: "Turn these Yoast findings into developer tasks."

Expected:

- Uses developer handoff fields.
- Does not prescribe unsupported code changes.
- Keeps content/editorial actions separate.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
