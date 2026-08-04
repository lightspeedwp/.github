# Template Contract Tests

## Purpose

Check that report templates still satisfy the `SKILL.md` output contract after edits.

## Required finding fields

Every audit finding table or handoff item in a report template must include these fields, either as columns or explicit item fields:

- Evidence status
- Priority
- Confidence
- Risk
- Recommendation
- Owner / next route
- Retest or validation step

## Scored template fallback

Every template with `## Overall WooCommerce Yoast audit score` must also include fallback wording that allows the assistant to replace the score section with `## Score status` when evidence is too narrow to justify scoring.

## Client-facing note

Every client-facing audit, launch, migration, WooCommerce or schema template must include a `## Client-safe note` that avoids ranking guarantees.

## Regression prompt

Input: "Check template contract after editing templates."

Expected output: list each checked template, pass/fail status, missing required fields, and any score/client-safe wording gaps.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
