# WooCommerce Configuration Agent profile

## When to call the auditor

Call `gravity-forms-auditor` for product enquiry forms, quote requests, product option/deposit flows, customer onboarding forms, lead routing, or form issues affecting product pages.

## Preferred audit scope

- WooCommerce enquiry audit for product/category forms.
- Notification/feed audit for quote routing.
- Payment/User Registration risk audit when forms touch deposits, accounts, or payment add-ons.

## Route to configuration

Route safe field/notification/confirmation/feed/embed updates to `gravity-forms-configuration` after approval.

## Route elsewhere

Route checkout replacement, tax, order creation, subscriptions, stock, shipping, refunds, and account architecture to WooCommerce architecture/planning before form configuration.

## Client-safe boundary

Keep payment credentials, customer personal data, order data, and internal routing rules out of client-safe summaries unless explicitly approved and redacted.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
