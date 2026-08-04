# Example: WooCommerce customer support form audit

## Scope

Single customer support form on a WooCommerce site's `/contact/` or `/support/` page; internal audit with client-safe summary. The form supports customer enquiries, order-related questions, and product support without replacing WooCommerce account, order, refund, shipping, or checkout workflows.

## Evidence

- MCP preflight confirms WordPress, WooCommerce core, and Gravity Forms are active.
- Form schema includes Name, Email, Order Number, Enquiry Type, Message, Consent, and Submit fields.
- Admin notification exists but From Email uses `{Email:2}` instead of a domain-authorised mailbox.
- Honeypot enabled; no CAPTCHA or Turnstile evidence available.
- The form asks for an order number but does not request payment-card details, passwords, or full account credentials.

## Findings

| ID | Finding | Severity | Confidence | Recommended fix | Handoff item | Retest step |
|---|---|---|---|---|---|---|
| GF-AUD-001 | Notification From Email uses the submitter email rather than a domain-authorised address, creating a deliverability risk for WooCommerce support enquiries. | High | High | Use a domain mailbox as From and submitter email as Reply-To. Preserve order/product context in the notification. | Yes | Review notification settings and approved delivery evidence. |
| GF-AUD-002 | Order-support data collection appears limited to order number and message; no credential or payment-card collection was observed. | Info | Medium | Keep customer/order data collection minimal and client-safe. | No | Recheck schema if fields change. |

## Handoff item

Route GF-AUD-001 to `woocommerce-gravity-forms-configuration` to update notification sender safely after approval.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
