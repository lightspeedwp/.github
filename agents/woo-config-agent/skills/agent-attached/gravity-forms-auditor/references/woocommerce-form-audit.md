# WooCommerce form audit

## Scope

Use this file when Gravity Forms supports WooCommerce product enquiry, quote request, product option, deposit, lead capture, onboarding, or customer-service flows.

## Audit checks

- Product enquiry forms capture product ID/title/URL safely and reliably.
- Quote request forms capture quantity, variation/options, timeline, location, and contact details without replacing checkout by accident.
- Conditional product fields are understandable and tested by branch.
- Pricing fields are clear and not confused with WooCommerce cart/order/tax totals.
- Payment/deposit fields have explicit scope, add-on evidence, SSL/test-live awareness, and approval needs.
- Customer registration flows are high risk and require User Registration feed review.
- Do not position Gravity Forms as a checkout replacement unless scoped and approved separately.
- Order, tax, VAT, subscription, renewal, stock, shipping, and refund behaviour are WooCommerce architecture concerns unless explicitly form-scoped.
- Product page embeds are checked for duplicate forms, cache conflicts, missing dynamic product context, and mobile behaviour.
- Lead routing maps product/category/vendor/team to the right recipient.
- Notifications avoid sending sensitive order/customer details unnecessarily.

## Retest steps

- Verify product context on each product/page type.
- Verify routing for at least one representative product/category.
- Verify notification and confirmation copy.
- Check mobile product page embed behaviour.
- For payment/deposit flows, route to configuration with sandbox validation requirements.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
