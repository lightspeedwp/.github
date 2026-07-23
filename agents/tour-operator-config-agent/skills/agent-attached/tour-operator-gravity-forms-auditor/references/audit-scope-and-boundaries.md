# Audit scope and boundaries

## Covered scopes

- Whole-site Gravity Forms audit: inventory forms on WordPress websites running the Tour Operator plugin and relevant extension plugins, global plugin/add-on posture, embeddings, notifications, spam/privacy/security posture, maintainability, and owner readiness.
- Single-form audit: review one named form plus related embeds, confirmations, notifications, feeds, spam/privacy controls, and retest requirements.
- Pre-launch audit: identify blockers before production use and produce go/no-go notes.
- Retainer health check: light recurring check for stale forms, unread/spam counts, broken notification risks, outdated versions, and ownership gaps.
- Troubleshooting audit: review evidence around a specific failure, such as lost leads, missing emails, feed failures, cache conflicts, or spam false positives.
- Accessibility-focused audit: review labels, required states, validation, keyboard path, field choices, and page evidence where available.
- Spam/security-focused audit: review honeypot, CAPTCHA/Turnstile/reCAPTCHA/Akismet/Zero Spam, file uploads, logs, permissions, and data exposure.
- Tour operator enquiry audit: enquiry-first Tour Operator plugin flows, booking enquiries, accommodation enquiries, travel dates, destinations, traveller count, budget, special interests, consent, partial entries, and routing.
- Lead-generation audit: brochure downloads, quote requests, agent/trade enquiries, newsletter forms, contact forms, and support forms that feed the travel sales journey.

## Exclusions and route-away rules

- Do not configure or change Gravity Forms; route to the `tour-operator-gravity-forms-configuration` skill, with a handoff.
- Do not draft legal privacy policies; route to legal/privacy review or the appropriate LightSpeed policy skill.
- Do not run whole-site accessibility, performance, security, or SEO audits unless Gravity Forms is the scoped subset.
- Do not design custom plugin code; route to WordPress/plugin development.
- Do not design full booking engines, inventory systems, itinerary builders, or document-storage architecture unless the Gravity Forms subset is explicitly scoped and approved.
- Do not inspect full entry personal data unless the user confirms permission and it is necessary for the audit.
- Do not rely on generic blogs for audit criteria. Use official documentation or label LightSpeed recommendations.
