# Payment, donation and paid-event flows

Use this reference when a Gravity Forms request involves taking money, donations, deposits, paid event registration, simple order forms, recurring gifts, paid memberships, coupons, refunds, payment receipts, gateway troubleshooting, or payment-related notifications.

## Load with

- `references/feeds-payments-user-registration.md` for feed mechanics and multiple-feed limits.
- `references/conditional-dynamic-calculation-logic.md` for pricing fields, calculations, totals and conditional pricing.
- `references/notifications-confirmations-merge-tags.md` for receipt-style notifications and confirmations.
- `references/entry-data-lifecycle.md` for payment entry status, retention, export and file lifecycle.
- `references/analytics-conversion-and-attribution.md` only when conversion tracking is also in scope.

## Source posture

- Gravity Forms pricing fields can support order forms, quote generators, donation systems and event registration style use cases without a full ecommerce platform, but this does not make Gravity Forms a replacement for WooCommerce checkout, subscriptions, tax, fulfilment, stock, invoices, or accounting workflows.
- Stripe payment collection requires the official Stripe Add-On, compatible Gravity Forms/WordPress versions, SSL, a connected Stripe account, a compatible form, a payment feed, and test-mode validation before live use.
- Stripe supports one-time payments and recurring subscriptions, but subscription cancellation and lifecycle operations require clear operational ownership and are not a casual form-config edit.
- Multiple payment feeds are high risk because payment add-ons normally process only one payment feed per submission. Use mutually exclusive conditional logic and test every branch.
- Refunds, failed payments, disputes, cancellations, subscription status changes, and accounting reconciliation are payment-operations work. Gravity Forms can expose entry/payment status signals, but the gateway/admin system remains the payment source of truth.

## Preflight for any payment flow

Collect only what is needed to decide whether the form flow is safe:

1. Form purpose: donation, event fee, product/service order, deposit, membership, recurring gift, paid listing, or other.
2. Environment: staging/test or production, SSL status, cache/CDN status, and whether test submissions can be run.
3. Installed payment add-ons and active gateway connection: Stripe, PayPal Checkout, Square, Mollie, Authorize.Net, Coupons, or other.
4. Gateway mode: test/sandbox or live; never request or store API keys in skill files.
5. Pricing model: fixed amount, user-defined amount, quantity, options, coupons, taxes, shipping, recurring amount, trial, deposit, or conditional branch.
6. Confirmation behaviour: inline success, thank-you page, redirect, payment-pending message, payment-failed message.
7. Notification behaviour: admin alert, user receipt, finance/admin copy, failure notice, subscription/cancellation expectations.
8. Data handling: receipt data, personal data, billing fields, entry retention, gateway transaction ID handling, export needs.
9. Operational owner: who checks failed payments, refunds, disputes, and reconciliation.
10. Rollback path: disable feed, revert confirmation/notification, remove embed, restore previous form version, or gateway-side disablement.

## Safe field patterns

- Use visible labels for all payment and billing fields.
- Use Product fields for fixed choices, user-defined donation amounts, or membership tiers.
- Use Quantity for attendee counts or simple quantities; cap the quantity where operational capacity matters.
- Use Option fields for add-ons tied to a specific Product.
- Use Total fields where users must review the final amount before submitting.
- Use Coupon only when the Coupons Add-On is installed, the coupon scope is approved, and test cases cover valid, expired, invalid and over-discounted states.
- Avoid collecting unnecessary billing details in Gravity Forms when the gateway-hosted/payment element flow can handle sensitive payment details.

## Donation defaults

For donation forms:

- Prefer a small set of suggested fixed amounts plus an optional user-defined amount.
- Include clear donation-purpose copy and receipt expectations.
- Keep marketing opt-in separate from donation consent.
- Do not imply tax-deductibility, Gift Aid, nonprofit status, recurring billing, refundability, or campaign allocation unless approved source evidence exists.
- Treat recurring donations as subscription/payment architecture, not a minor form edit.

## Paid event defaults

For paid event forms:

- Confirm capacity, ticket inventory, cancellation/refund policy, attendee data needs, and whether WooCommerce/Event Tickets should own the workflow instead.
- Use quantity caps and branch tests for attendee counts.
- Separate attendee details from billing/payment details.
- Confirm whether the entry is considered a registration only after successful payment or also when payment is pending.
- Add handoff notes for on-site check-in/export if needed.

## Receipts and payment notifications

Receipt-style notifications are high-stakes customer communications. Before changing them:

- Read existing notifications and feed settings first.
- Use a domain-aligned From address and submitter Reply-To only where appropriate.
- Avoid sending full sensitive entry data.
- Include amount, transaction/reference status, next step, and support contact only if confirmed.
- Do not promise refunds, tax receipts, order fulfilment, tickets, or booking confirmation unless approved.
- Confirm whether payment success controls notification timing; do not assume all notifications wait for successful payment.

## Refund, cancellation and failure guardrails

The skill may prepare a review, not perform operational payment changes unless the MCP/payment tooling explicitly supports it and the user gives clear approval.

- Refunds: route to the gateway/admin owner unless a supported safe action is confirmed.
- Subscription cancellation: require gateway/add-on evidence, entry/payment status, customer identity verification, and explicit approval.
- Failed payments: check gateway logs, entry payment status, feed logs, validation errors, and confirmation wording before editing the form.
- Disputes/chargebacks: route to finance/payment operations; do not treat as form configuration.
- Test-mode payments: use gateway-provided test method guidance from official docs, never real card data.

## Validation checklist

For any payment, donation or paid-event change:

- Confirm add-on installed/active/licensed where visible.
- Confirm SSL and compatible Gravity Forms/WordPress versions.
- Confirm gateway connection mode and test/sandbox availability.
- Validate pricing fields and Total display.
- Validate conditional logic for every payment branch.
- Validate one payment feed per submission path.
- Run one success, one validation-failure and one declined/pending payment test where safe.
- Review entry payment status and feed result.
- Review admin notification, user receipt and confirmation copy.
- Confirm tracking event fires only on successful paid outcome if tracking is in scope.
- Record rollback and operational owner.

## Route away

Route away when the user needs:

- Full ecommerce checkout, tax, fulfilment, subscriptions or order architecture.
- Gateway account setup, merchant onboarding, PCI/legal/payment compliance advice, chargeback handling, or accounting reconciliation.
- Custom payment gateway development.
- Secure ticket inventory or seat management beyond simple capped registration.
- Legal wording for donation deductibility, refund policy, terms, or tax status.
