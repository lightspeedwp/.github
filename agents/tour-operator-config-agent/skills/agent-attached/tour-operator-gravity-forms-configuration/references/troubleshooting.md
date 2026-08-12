# Troubleshooting

## First checks

1. Run system/site preflight.
2. Confirm Gravity Forms version, WordPress version, PHP version, licence visibility, and add-on status.
3. Read the target form, notifications, confirmations, feeds, and page embed.
4. Check logs if available, enabling temporary logging only when needed.
5. Reproduce with safe test data.
6. Separate form configuration issues from WordPress/server/email/cache/theme/plugin issues.

## Common issues

### Not receiving notifications

Check notification enabled state, recipient typos/spaces, valid domain-aligned From Email, Reply-To, routing conditions, spam folder, SMTP/transactional email plugin, DNS/SPF/DMARC, and Gravity Forms logs. Remember Gravity Forms passes mail to WordPress `wp_mail()`; delivery occurs after that handoff.

### Form not submitting

Check required fields, validation messages, spam controls, JavaScript errors, optimisation/defer plugins, cached pages, nonce/state validation, hidden UI rendering, and theme/plugin conflicts.

### Duplicate submissions

Check double-click behaviour, slow confirmation, browser refresh, gateway callbacks, No Duplicates settings, custom JS, and retries. Add clearer submit state or duplicate controls only after evidence.

### JavaScript conflicts

Check browser console, no-conflict mode where appropriate, theme scripts, page builders, popups/hidden tabs, delayed scripts, and cache/minification exclusions.

### Feed debugging

Read feed settings, conditions, logs, add-on status, external API credentials/connection, background processing, and error notifications. Do not retry high-risk feeds blindly.

### Payment feed issues

Use gateway test mode, check product/pricing fields, payment field, feed condition, webhook/callback, currency, SSL, and gateway logs. Escalate before live payment changes.

### REST API errors

Check REST API setting, authentication method, API keys/application passwords, permissions, route availability, content type, and whether the MCP app wraps REST or PHP API.

### PHP compatibility / memory / execution time

Check system requirements, PHP version, memory limit, max upload size, execution time, and host logs. Escalate hosting-level remediation outside this skill.

### File upload errors

Check allowed extensions, file size, upload directory permissions, server upload limits, `.htaccess`, secure download rules, off-server feed status, and antivirus/security plugins.

### Spam false positives

Review spam entries/logs, active anti-spam plugins, Turnstile/reCAPTCHA keys, honeypot conflicts, caching/JS optimisation, IP reputation services, and false-positive patterns. Do not disable all spam controls without approval.

### Accessibility warnings

Identify the exact field and warning. Fix labels, placeholders, descriptions, field grouping, hidden labels, contrast, focus, or custom HTML. Document if a warning is accepted rather than fixed.

## Escalation path

Escalate to WordPress configuration for site/plugin/capability issues, ecommerce/platform owners for cart, payment-platform, fulfilment, or inventory architecture, hosting for server/email/cache/PHP issues, legal/privacy for policy wording, accessibility specialists for whole-site or audited compliance issues, and custom development for unsupported behaviours requiring code.
