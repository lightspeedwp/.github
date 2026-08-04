# Example: WooCommerce order support notification failure audit

## Scope

Troubleshoot a complaint that admin emails are not arriving from a WooCommerce order support form. The audit reviews notification settings, product/order support context, and available delivery evidence without sending tests or changing settings.

## Evidence

- Entry metadata shows recent order-support entries exist.
- Admin notification is enabled.
- Recipient includes a trailing space and From Email uses a free-mail submitter merge tag.
- Submitted entry metadata includes an order number field but does not expose full order records in the audit output.
- SMTP plugin exists but delivery logs were not accessible through read-only MCP.

## Findings

| ID | Finding | Severity | Confidence | Recommended fix | Handoff item | Retest step |
|---|---|---|---|---|---|---|
| GF-AUD-001 | Notification configuration has avoidable deliverability risks: recipient whitespace and unsafe From Email. | High | High | Remove whitespace, use domain-authorised From, set submitter email as Reply-To, and preserve order-support context in the email body. | Yes | Approved test submission and SMTP log/mailbox confirmation. |
| GF-AUD-002 | SMTP delivery evidence unavailable, so mail-stack status is not confirmed. | Medium | Medium | Request safe mail log evidence or SMTP plugin access for retest. | No | Review delivery logs after approved configuration change. |

## Handoff item

Route GF-AUD-001 to `woocommerce-gravity-forms-configuration`. Keep GF-AUD-002 as a limitation until safe mail log evidence is available.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
