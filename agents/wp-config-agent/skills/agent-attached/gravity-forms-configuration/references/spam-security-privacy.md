# Spam, security, and privacy

## Spam protection

Use layered controls on public forms. Options may include honeypot/enhanced honeypot, state validation awareness, reCAPTCHA, Cloudflare Turnstile, Akismet, Zero Spam, moderation, No Duplicates, rate-limiting at hosting/security layer, and content/routing checks. No single method catches all spam.

## Honeypot and enhanced honeypot

Use honeypot as a low-friction baseline where available. Check conflicts with aggressive caching, JavaScript optimisation, delayed scripts, hidden UI rendering, and custom themes. If false positives appear, inspect spam entries/logs before disabling.

## Turnstile and reCAPTCHA

Turnstile is available when the Cloudflare Turnstile Add-On is installed/configured. reCAPTCHA/CAPTCHA requires the relevant field/settings. Do not add either without confirming keys and privacy/UX acceptance.

## Duplicate submissions and No Duplicates

Use No Duplicates for unique email/account/contest flows. Avoid it for household/shared addresses, repeated support requests, or repeat enquiries unless the process demands it. Provide a clear error message.

## File upload security

- Allow only necessary extensions.
- Set size/count limits.
- Prefer authenticated uploads for sensitive files.
- Do not expose upload URLs to non-admins.
- Preserve secure download URLs and `.htaccess` protections.
- Avoid custom upload paths unless permissions and server rules are validated.
- Consider Dropbox/off-server workflows only after feed reliability and local residual-file handling are understood.

## Data minimisation and retention

Collect only data required for the stated purpose. Use Consent fields and clear descriptions where personal data is collected. Review Personal Data settings for export/erase support and retention. Retention changes require approval because they can delete or retain personal data unexpectedly.

## GDPR/POPIA-style operational notes

This skill can provide operational privacy prompts and configuration checks, not legal advice. Escalate legal/policy wording to the appropriate legal/privacy workflow.

## Sensitive data

Avoid collecting ID documents, medical data, precise travel documents, payment details outside payment fields, passwords outside approved User Registration flows, or secrets/API keys. Do not store credentials in skill files or notifications.

## Payment data handling

Use official gateway fields/add-ons. Do not ask forms to collect card details in ordinary text fields. Confirm SSL, gateway setup, test mode/live mode, and feed status.

## User registration risks

User creation can assign roles and grant access. Require explicit approval for role mappings, activation flow, password handling, duplicate email behaviour, and moderation.

## REST/API authentication risks

Do not expose REST keys, application passwords, webhook secrets, or authentication headers in chat output or skill files. Use redaction in handoffs.

## Recommended production defaults

Honeypot/layered spam enabled, domain-aligned From Email, Reply-To submitter, visible labels, consent for personal data, narrow file uploads, no unnecessary sensitive merge tags, tested notifications, tested confirmations, entry retention documented, and a named owner for monitoring.

## 2026 spam guidance updates

- Built-in honeypot protection can include multiple checks, including hidden-field behaviour, site-specific validation, and version-specific timing checks. Verify the active Gravity Forms version before relying on a specific honeypot behaviour.
- Multi-page forms can reduce automated submissions when earlier pages contain required fields and conditional next-button logic, but this is not a substitute for broader spam protection.
- For payment forms, place card/payment fields late in a multi-page journey and require earlier validation before the payment field is reachable.
- Save and Continue and Partial Entries need separate spam review because CAPTCHA-style controls may not protect draft or partial-entry creation in the same way as final submissions.
- When a submission is marked as spam, notifications and add-on feeds may not process; include this in false-positive troubleshooting.
