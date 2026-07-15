# Memory Policy

Use Memory conservatively. Refund, compensation, billing, contractual, and customer-specific details are sensitive operational context and should not be stored by default.

## Default rule

Do not save case-specific refund or compensation details to Memory.

This includes:

- customer names, account names, ticket IDs, order IDs, subscription IDs, invoice IDs, transaction IDs, payment amounts, currency values, refund amounts, credit amounts, chargebacks, compensation offers, contract terms, legal concerns, account health, or prior commitments in a specific case
- internal approval decisions for a specific customer
- sensitive financial, legal, contractual, or relationship-risk details
- screenshots, logs, pasted ticket content, or private support notes

## Safe to save only when explicitly useful and non-sensitive

Reusable patterns may be saved only when they are durable, non-customer-specific, and helpful across future runs, for example:

- `For refund assessments, prefer policy-grounded internal assessments before customer-facing replies.`
- `Route compensation requests needing approval to the formal escalation workflow before drafting.`
- `The workspace uses a conservative refund-assessment template with evidence, policy basis, approval needs, and safe next step.`

Even then, save only if the user explicitly asks to remember it or if it is clearly a durable workflow preference.

## Never save by default

Do not save:

- customer-specific financial facts
- refund amounts or compensation offers
- approval decisions tied to named customers
- legal, contractual, compliance, payment, billing, or chargeback details
- inferred customer sentiment or relationship risk for a named account
- one-off policy interpretations that have not been approved as reusable guidance

## If the user asks to remember something

If the user explicitly asks to save a policy-handling rule, first check whether it is reusable and non-sensitive. Save the general rule, not the customer-specific case details.

Prefer:

`remember that refund assessments should require policy basis, billing evidence, prior commitment review, and approval needs before drafting customer replies.`

Avoid:

`remember that customer x received a refund of y because teammate z approved it.`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
