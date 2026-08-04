# Example: donation payment form

Use this example for a simple donation form that may collect one-time donations through a confirmed payment add-on. Keep it in draft mode until the payment gateway, SSL, receipts, refund stance and test-mode validation are confirmed.

## Intended flow

1. Donor chooses a suggested amount or enters another amount.
2. Donor provides name and email for receipt/contact purposes.
3. Donor accepts donation consent and privacy wording.
4. Payment feed runs only when the amount is valid and gateway is confirmed.
5. User sees a clear confirmation without unsupported tax-deductibility or refund promises.
6. Admin/finance receives a limited notification.

## Guardrails

- Do not store gateway keys or secrets in the skill or example config.
- Do not imply charitable, tax, Gift Aid, nonprofit or deductible status unless approved.
- Do not enable recurring donations unless recurring payment operations are approved.
- Test successful, failed/declined and zero/invalid amount cases before launch.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
