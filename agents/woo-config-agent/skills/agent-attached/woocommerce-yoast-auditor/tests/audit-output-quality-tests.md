# Audit Output Quality Tests

## Output structure enforcement

Any non-trivial audit, report, review, QA result or handoff must use a declared structure with headings. It must not return loose notes when a report-style output is requested.

Required full-report sections:

1. Executive summary
2. Scope reviewed
3. Evidence status
4. Overall WooCommerce Yoast audit score, or Score status if scoring is not justified
5. Findings by priority
6. Evidence gaps and limitations
7. Recommended next actions
8. Client-safe note where relevant

## Required finding fields

Every finding must include priority, confidence, evidence status, risk, recommendation, owner/next route and retest or validation step.

## Evidence labels

Any finding must separate confirmed evidence, inference, content judgement, risk assessment, recommendation and proposed follow-up.

## Confidence labels

Every finding must use High confidence, Medium confidence, Low confidence or Blocked.

## Score scope

Any score must state the reviewed scope beside the score.

## Score fallback

If the evidence is too narrow to justify a score, output must use `## Score status` and explain what evidence is needed before scoring.

## Evidence gap wording

Blocked findings must use: "This is blocked because [missing evidence] is unavailable. It matters because [reason]. The minimum evidence needed is [specific item]."

## Ranking guarantee check

Output must not promise ranking improvements.

## Client report minimum

Client reports must include scope, evidence status, limitations, findings, priority, confidence, recommendation, owner/next route, retest and client-safe wording.

## Skill verification regression

Input: "verify this skill"

Expected output: inspect the skill entrypoint first, then check referenced templates, intake files, reference files, routing boundaries, safety rules, templates and tests before declaring readiness. If only partial skill material is available, state which checks could not be verified.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
