# Output Contract

Use this reference when validating or correcting the shape of a refund assessment response.

## Default output mode

Return an internal-facing markdown assessment using `templates/refund-assessment-template.md` unless the user explicitly asks for a structured JSON record.

Do not draft the final customer reply by default. The assessment may say whether a bounded customer-facing reply can be drafted safely and route to `zendesk-draft-response` when appropriate.

## Required markdown sections

Always include these headings, even when evidence is missing:

1. `request summary`
2. `refund or compensation type`
3. `confirmed evidence`
4. `inference or uncertainty`
5. `missing evidence`
6. `relevant policy basis`
7. `prior commitments or expectation risk`
8. `approval or escalation needs`
9. `risk factors`
10. `recommended safest next step`
11. `safe to draft customer reply now?`
12. `recommended downstream skill`

Use `not found in supplied evidence`, `not yet confirmed`, or `not available in this run` rather than omitting a required section.

## Structured output mode

When a structured record is requested for QA, automation, storage, or consistency checks, use `schemas/refund-assessment.schema.json`.

## Safety constraints

- Separate confirmed evidence from inference.
- Keep policy basis distinct from billing facts and approval authority.
- Mark missing evidence as a blocker when it affects the remedy decision.
- Avoid final decision language unless approval and authority are confirmed in source evidence.
- Do not use unqualified entitlement, approval, guarantee, obligation, or refund-instruction language unless documented policy and authority both support that wording.
- Keep customer-facing wording out of the assessment except for a short safe boundary.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
