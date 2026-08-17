# Example: WooCommerce product enquiry form audit

## Scope

Product enquiry form embedded on single product pages; audit product context capture, routing, spam, and notifications.

## Evidence

- Form schema includes hidden Product Name and Product URL fields populated by page embed values.
- Page evidence confirms same form appears once per product page.
- Recipient routing sends all enquiries to one inbox; no category/product owner routing.
- No payment/order feed detected.

## Findings

| ID | Finding | Severity | Confidence | Recommended fix | Handoff item | Retest step |
|---|---|---|---|---|---|---|
| GF-AUD-001 | Product context capture depends on hidden fields but dynamic field values were not verified on cached pages. | High | Medium | Validate embed field values and cache behaviour; preserve product ID/URL in notification. | Yes | Check submitted test metadata in staging or approved test. |
| GF-AUD-002 | Lead routing does not distinguish product/category ownership. | Medium | High | Add conditional routing only if product/category owner mapping is approved. | Yes | Verify representative product enquiries route correctly. |

## Handoff item

Prepare a configuration handoff for dynamic product context validation and optional routing rules. Do not replace WooCommerce checkout.

## Additional WooCommerce checks

Also verify product context capture, stock or availability wording where relevant, B2B/wholesale segmentation, order-related data minimisation, and quote/payment boundary wording.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
