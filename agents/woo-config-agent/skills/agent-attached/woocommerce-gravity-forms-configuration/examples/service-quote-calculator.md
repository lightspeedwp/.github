# Service Quote Calculator Example

Use when a client needs an indicative quote form rather than a final checkout/payment flow.

## Purpose

Collect service requirements, apply simple conditional logic, show an estimated total, and route the lead to sales. Treat the total as an estimate unless payment/tax/contract terms are separately approved.

## Required capabilities

- Gravity Forms active.
- Product, Option, Quantity, Number, and Total fields available if using pricing fields.
- Notification and confirmation edit access.
- Optional feed access for CRM routing.

## Recommended flow

1. Contact details.
2. Service category.
3. Conditional scope questions.
4. Optional add-ons.
5. Estimated total.
6. Consent and submit.

## Safety notes

- Do not connect to payment feeds unless explicitly scoped.
- Do not present calculated totals as final prices without approval.
- Test each conditional branch and pricing boundary.
- Record fields whose choices drive calculations.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
