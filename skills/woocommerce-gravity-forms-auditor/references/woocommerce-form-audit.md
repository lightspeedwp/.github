# WooCommerce form audit

## Scope

Use this file when Gravity Forms supports WooCommerce product enquiry, quote request, product option, deposit, lead capture, stock or availability enquiry, B2B or wholesale enquiry, customer onboarding, order-related contact, customer account support, or customer-service flows.

## Audit checks

- Product enquiry forms capture product ID, title, SKU, URL, category, variation, and source page safely and reliably where relevant.
- Quote request forms capture quantity, variation/options, timeline, location, budget or target price where appropriate, and contact details without replacing checkout by accident.
- Stock or availability enquiry forms clearly separate customer interest from confirmed stock, back-order, reservation, or fulfilment promises unless integrated evidence proves otherwise.
- B2B or wholesale forms capture company details, approval signals, segmentation, consent, and routing without exposing unnecessary customer data.
- Order-related contact forms avoid collecting more order/customer data than needed and route support requests to the correct operational owner.
- Conditional product fields are understandable and tested by branch.
- Pricing fields are clear and not confused with WooCommerce cart/order/tax totals.
- Payment/deposit fields have explicit scope, add-on evidence, SSL/test-live awareness, and approval needs.
- Customer registration flows are high risk and require User Registration feed review.
- Do not position Gravity Forms as a checkout replacement unless scoped and approved separately.
- Order, tax, VAT, subscription, renewal, stock, shipping, fulfilment, and refund behaviour are WooCommerce architecture concerns unless explicitly form-scoped.
- Product page embeds are checked for duplicate forms, cache conflicts, missing dynamic product context, AJAX/product-template context, and mobile behaviour.
- Lead routing maps product/category/vendor/team/support owner to the right recipient.
- Notifications avoid sending sensitive order/customer details unnecessarily.
- Confirmations set clear expectations for quote response time, stock confirmation, next steps, and no-payment/no-reservation boundaries where relevant.

## Retest steps

- Verify product context on each product/page type.
- Verify routing for at least one representative product/category/support path.
- Verify notification and confirmation copy.
- Check mobile product page embed behaviour.
- Check quote request and stock/availability wording against the approved business process.
- For payment/deposit flows, route to configuration with sandbox validation requirements.
