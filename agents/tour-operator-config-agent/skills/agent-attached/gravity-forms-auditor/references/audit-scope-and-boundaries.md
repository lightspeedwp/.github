# Audit scope and boundaries

## Covered scopes

- Whole-site Gravity Forms audit: inventory forms, global plugin/add-on posture, embeddings, notifications, spam/privacy/security posture, maintainability, and owner readiness.
- Single-form audit: review one named form plus related embeds, confirmations, notifications, feeds, spam/privacy controls, and retest requirements.
- Pre-launch audit: identify blockers before production use and produce go/no-go notes.
- Retainer health check: light recurring check for stale forms, unread/spam counts, broken notification risks, outdated versions, and ownership gaps.
- Troubleshooting audit: review evidence around a specific failure, such as lost leads, missing emails, feed failures, cache conflicts, or spam false positives.
- Accessibility-focused audit: review labels, required states, validation, keyboard path, field choices, and page evidence where available.
- Spam/security-focused audit: review honeypot, CAPTCHA/Turnstile/reCAPTCHA/Akismet/Zero Spam, file uploads, logs, permissions, and data exposure.
- WooCommerce enquiry audit: product/quote/enquiry forms, product context capture, routing, payment/deposit boundaries, and product page embeds.
- Tour operator enquiry audit: enquiry-first travel flows, travel dates, destinations, traveller count, budget, special interests, consent, partial entries, and routing.

## Exclusions and route-away rules

- Do not configure or change Gravity Forms; route to `gravity-forms-configuration` with a handoff.
- Do not draft legal privacy policies; route to legal/privacy review or the appropriate LightSpeed policy skill.
- Do not run whole-site accessibility, performance, security, or SEO audits unless Gravity Forms is the scoped subset.
- Do not design custom plugin code; route to WordPress/plugin development.
- Do not redesign WooCommerce checkout, tax, subscription, order, or account architecture unless the form flow is explicitly scoped and approved.
- Do not inspect full entry personal data unless the user confirms permission and it is necessary for the audit.
- Do not rely on generic blogs for audit criteria. Use official documentation or label LightSpeed recommendations.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
