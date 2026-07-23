# Notifications, confirmations, and merge tags

## Difference

- **Confirmation**: the message, page, or redirect shown immediately after a successful submission.
- **Notification**: a message/event, commonly email, sent after submission to admins, submitters, or routed recipients.

## Notification defaults

- Use a domain-aligned From Email where possible.
- Use Reply-To for the submitter email rather than using the visitor's email as From.
- Avoid spaces/typos in recipients and check routing conditions.
- Do not attach uploaded files unless necessary.
- Do not include sensitive data in user autoresponders unless explicitly required.
- For important workflows, confirm SMTP/transactional email setup and test deliverability.

## Common notification types

1. Admin lead notification: concise summary, key fields, source URL, entry link if safe, Reply-To set to submitter.
2. User confirmation email: acknowledgement, next step, expected response timeframe, support contact, no sensitive details.
3. Routed notification: conditional Send To based on department, product, location, publication, or service area.
4. Add-on/API error notification: only if supported and useful for operational monitoring.

## Conditional notifications

Read existing notifications first. Preserve existing routing unless the change plan explicitly replaces it. Test at least one submission per branch.

## Confirmations

- **Text**: default safest option; use clear next steps.
- **Page**: useful for thank-you pages, conversion tracking, or richer instructions; verify target page exists.
- **Redirect**: useful for external flows but higher risk; check URL, query strings, tracking, privacy, and open redirect concerns.

## Conditional confirmations

Use conditional confirmations for routed lead journeys or payment/user-registration outcomes. Test each branch. Do not expose sensitive submitted values in a confirmation.

## Merge tags

Merge tags can insert submitted field values and metadata into notifications, confirmations, post content templates, and other settings. Not all merge tags work in every context, so verify context before use. Avoid personal/sensitive merge tags in URLs, redirects, user emails, and non-admin notifications.

## File upload cautions

Do not send upload URLs to non-admin recipients when files may be confidential. Prefer entry links for admins if permissions are controlled. Do not place file upload merge tags in public confirmations.

## Deliverability troubleshooting stance

Gravity Forms hands notifications to WordPress `wp_mail()`; delivery depends on WordPress, server, SMTP/transactional service, DNS, and recipient filtering. Troubleshoot notification settings first, then SMTP/logs/server/DNS.
