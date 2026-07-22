# Example: case that should route away

## Input pattern

Customer asks how to update the billing email on their account. No refund, credit, compensation, goodwill, make-good, or policy-exception request appears in the ticket.

## Expected routing

- Do not use `zendesk-refund-assessment`.
- Route to `zendesk-draft-response` if the user wants a routine support reply.
- Route to `zendesk-triage-router` if the user wants classification or owner routing.

## Safety note

Do not force refund assessment sections onto a routine support issue.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
