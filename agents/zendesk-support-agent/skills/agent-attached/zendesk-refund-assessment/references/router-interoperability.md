# Router Interoperability

Use this reference when `zendesk-router-skill` recommends `zendesk-refund-assessment`, when the shared support desk agent is selecting a skill, or when this skill needs to route away.

## Intended relationship with `zendesk-router-skill`

- `zendesk-router-skill` is the ambiguity gateway for Zendesk-first support requests.
- This skill is the specialist workflow for refund, credit, compensation, goodwill, make-good, and policy-exception decision support.
- Clear refund or compensation assessment requests may invoke this skill directly; they do not need to be wrapped by the router.
- If the user's intended deliverable is unclear across multiple support workflows, route back to `zendesk-router-skill` with a compact note.

## Router-ready trigger

This skill is ready to receive a router handoff when the request includes any of:

- a customer asking for a refund, partial refund, credit, compensation, goodwill gesture, make-good, or exception
- uncertainty about whether a financial remedy is policy-supported
- concern that prior support wording may have created refund or compensation expectation risk
- a need to decide whether a customer-facing reply can be drafted safely without overcommitting
- a need to identify approval, escalation, or evidence gaps before deciding

## Direct invocation versus router invocation

Use this skill directly when the deliverable is clearly an internal refund or compensation assessment.

Use `zendesk-router-skill` when:

- the request could equally be triage, customer research, escalation, knowledge work, evidence collection, or reply drafting
- no remedy decision is present and the user only asks what workflow should happen next
- a teammate asks for routing rather than an assessment

## Canonical neighbouring skills

Use these canonical names in route-away guidance, examples, fixtures, and handoffs:

- `zendesk-router-skill`
- `zendesk-triage-router`
- `zendesk-evidence-collector`
- `zendesk-case-readiness-check`
- `zendesk-draft-response`
- `zendesk-help-center-grounding`
- `zendesk-customer-escalation`
- `zendesk-customer-research`
- `zendesk-evidence-quality-review`

Do not use legacy, non-prefixed aliases for triage, drafting, escalation, investigation, or knowledge workflows in shared-agent routing text.

## Router handoff payload

When returning to the router, keep the payload short:

```markdown
## Refund assessment router note
- Possible remedy issue:
- Confirmed support facts:
- Missing evidence:
- Why ownership is ambiguous:
- Candidate next workflows:
```

Do not perform broad Zendesk routing inside this skill. Name the ambiguity and hand it back.
