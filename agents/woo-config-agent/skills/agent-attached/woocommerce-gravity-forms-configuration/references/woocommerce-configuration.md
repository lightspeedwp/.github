# WooCommerce Configuration Agent scope

## Own inside this skill

Use this skill for WooCommerce-adjacent Gravity Forms work: product enquiry forms, B2B quote requests, lead capture, product option forms, customer onboarding, approved deposits/payments, conditional notifications, dynamic product context, and post-configuration QA.

## Default approach

- Do not treat Gravity Forms as a replacement for WooCommerce checkout unless explicitly scoped.
- Validate product, payment, tax, fulfilment, inventory, subscription, order, and customer-account implications before recommending changes.
- Use dynamic population for product ID, title, SKU, or URL only after validating parameter names, source, sanitisation expectations, and page context.
- Keep enquiry and quote workflows separate from actual order creation unless an approved integration exists.
- Use synthetic product and customer test data during QA.

## Route away

Route checkout architecture, cart customisation, order customisation, subscription logic, fulfilment, inventory, tax logic, payment gateway architecture, and legal/commercial terms to the WooCommerce specialist workflow unless the task is specifically a Gravity Forms enquiry, quote, registration, payment, or deposit form.

## High-risk operations

Treat payment/deposit feeds, order creation, customer account creation, tax-related wording, subscription-related wording, file uploads, and production embeds as high-risk. Do not promise payment, tax, fulfilment, subscription, or checkout behaviour that is not confirmed by evidence.
