# WooCommerce Configuration Agent profile

## When to call the auditor

Call `woocommerce-gravity-forms-auditor` for WordPress websites running WooCommerce core when Gravity Forms supports product enquiry forms, quote requests, product option/deposit flows, stock or availability enquiries, B2B or wholesale forms, customer onboarding forms, customer account support forms, order-related support forms, lead routing, payment/user-registration feed risk, WooCommerce extension-related form flows, or product page embeds.

## Preferred audit scope

- WooCommerce enquiry audit for product/category forms.
- Quote request audit for product, quantity, variation, pricing-boundary, and sales routing checks.
- Notification/feed audit for product, category, sales, vendor, account, order support, or customer-service routing.
- Payment/User Registration risk audit when forms touch deposits, accounts, customer onboarding, payment add-ons, or WooCommerce extension flows.
- Order-related support audit when forms collect order numbers, customer details, screenshots, or support routing data.

## Route to configuration

Route safe WooCommerce Gravity Forms field, notification, confirmation, feed, embed, product-context, quote, enquiry, customer-account, order-support, and approved extension-related updates to `woocommerce-gravity-forms-configuration` after approval.

## Route elsewhere

Route checkout replacement, tax, order creation, subscriptions, stock, shipping, refunds, fulfilment, and account architecture to WooCommerce architecture/planning before form configuration.

## Client-safe boundary

Keep payment credentials, customer personal data, order data, account data, and internal routing rules out of client-safe summaries unless explicitly approved and redacted.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
