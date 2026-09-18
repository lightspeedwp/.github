# Spam, security, and privacy audit

## Spam controls

- Honeypot: check enabled state and version-specific enhancements; review false-positive evidence when available.
- Turnstile: verify add-on, field/settings, keys status if safely visible, and page script compatibility.
- reCAPTCHA: verify add-on/type, thresholds, script loading risk, and accessibility/user friction.
- Akismet: verify add-on/service status and how spam entries are handled.
- Zero Spam: verify plugin active state, Gravity Forms support, REST/API settings only if safe, and privacy impact of optional third-party reputation services.
- Duplicate submissions: inspect duplicate prevention controls, submit button behaviour, cache/browser risks, and known duplicate-entry evidence.
- State validation: check whether unexpected submitted values, changed consent text, hidden fields, or stale cached markup create risks.

## Security controls

- File upload restrictions: allowed extensions, size/count limits, authenticated-user requirement where possible, secure file links, and exposure in notifications/confirmations.
- Payment data: do not inspect credentials. Verify feed/add-on presence, SSL, test/live awareness, and redacted payment status evidence only.
- REST/API exposure: verify status and capability exposure if connector permits; do not create API keys.
- Logs: read only safe/redacted logs. Flag long-term logging and sensitive data in logs.
- Admin permissions: inspect roles/capabilities where available; flag overly broad form/entry/export/settings access.

## Privacy controls

- Data minimisation: every personal or sensitive field needs a purpose.
- Consent: check explicit consent for marketing, data sharing, sensitive data, and terms acceptance where needed.
- Entry retention: inspect personal data settings, IP storage stance, export/erase support, and retention policy.
- Sensitive data: flag health, ID, payment, travel documents, children, special category data, or confidential files.
- Email exposure: flag `{all_fields}` or file links sent to users/external systems without clear need.

## LightSpeed recommendations

Label these as LightSpeed recommendations unless official docs require them: minimise external services, use domain-aligned From addresses, avoid full personal data in email, prefer clear retention policy, and keep logs temporary and redacted.
