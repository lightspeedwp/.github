# Audit scope and boundaries

## Covered scopes

- WooCommerce Gravity Forms setup audit: inventory forms used by the store, product/order/customer context, plugin/add-on posture, embeddings, notifications, spam/privacy/security posture, maintainability, and owner readiness.
- Single WooCommerce form audit: review one named product enquiry, quote request, stock/availability, B2B/wholesale, order-support, account-support, deposit/payment, customer onboarding, or product-page form plus related embeds, confirmations, notifications, feeds, spam/privacy controls, and retest requirements.
- WooCommerce pre-launch audit: identify blockers before production use and produce go/no-go notes for store-related form journeys.
- Retainer health check: light recurring check for stale WooCommerce-related forms, unread/spam counts, broken notification risks, outdated versions, and ownership gaps.
- Troubleshooting audit: review evidence around a specific WooCommerce form failure, such as lost enquiries, missing order-support emails, product-context loss, feed failures, cache conflicts, or spam false positives.
- Accessibility-focused audit: review labels, required states, validation, keyboard path, field choices, and page evidence where available for WooCommerce form journeys.
- Spam/security-focused audit: review honeypot, CAPTCHA/Turnstile/reCAPTCHA/Akismet/Zero Spam, file uploads, logs, permissions, and data exposure for WooCommerce form use.
- WooCommerce enquiry audit: product enquiry forms, quote request forms, stock or availability enquiry forms, B2B or wholesale forms, customer onboarding forms, customer account support forms, order-related contact forms, product context capture, routing, payment/deposit boundaries, extension-related form flows, and product page embeds.

## Exclusions and route-away rules

- Do not configure or change Gravity Forms; route approved WooCommerce form remediation to `woocommerce-gravity-forms-configuration` with a handoff.
- Do not use this skill for non-WooCommerce WordPress sites or generic forms that have no WooCommerce product, order, customer, account, quote, stock, payment, wholesale, or extension context.
- Do not draft legal privacy policies; route to legal/privacy review or the appropriate LightSpeed policy skill.
- Do not run whole-site accessibility, performance, security, or SEO audits unless WooCommerce Gravity Forms is the scoped subset.
- Do not design custom plugin code; route to WordPress/plugin development.
- Do not redesign WooCommerce checkout, tax, subscription, order, stock, shipping, refund, fulfilment, or account architecture unless the form flow is explicitly scoped and approved.
- Do not inspect full entry personal data unless the user confirms permission and it is necessary for the audit.
- Do not rely on generic blogs for audit criteria. Use official documentation or label LightSpeed recommendations.
