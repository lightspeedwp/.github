# Audit checklists

## Global Gravity Forms setup

- Gravity Forms installed, active, current enough for support.
- WordPress/PHP environment meets current support expectations.
- Licence/update visibility is known or marked missing.
- SMTP/transactional email plugin present where notifications matter.
- Cache/CDN/script optimisation plugins identified.
- Security/spam plugins identified.
- Add-ons inventoried and mapped to forms/feeds.
- Ownership, monitoring, unread/spam counts, and retainer responsibility known.

## Individual form structure

- Form status active/inactive matches expected use.
- Purpose is clear from title, description, embed location, and fields.
- Required fields are justified.
- Field order follows the user journey.
- Long forms use sections/pages where useful.
- Submit button text sets expectation.

## Field quality

- Use specific field types for email, phone, date, number, URL, consent, file upload, choice, and pricing data.
- Avoid placeholder-only labels.
- Descriptions/instructions are clear and not excessive.
- Choices are concise, non-duplicated, and support reporting.
- Hidden fields and dynamic values are documented.

## Conditional logic

- Branches are understandable and testable.
- Required fields are not unreachable.
- Page/section/button logic has branch coverage.
- Conditional notifications/feeds/confirmations match submitted values.

## Confirmations

- Confirmation type is appropriate: text, page, or redirect.
- Message aligns with notification/user expectations.
- Redirects avoid leaking personal data in query strings.
- Spam confirmation behaviour is understood.

## Notifications

- Admin notification exists and is enabled where needed.
- User autoresponder exists where expected.
- Recipients/routing are valid.
- From uses a domain-authorised address; Reply-To uses submitter email when appropriate.
- Sensitive data and file URLs are limited.

## Feeds

- Active/disabled feeds are inventoried.
- Field mappings are complete.
- Conditions are explicit and testable.
- External service connection evidence is available without exposing secrets.
- Payment/User Registration feeds get high-risk handling.

## Embeds

- Form appears on the expected page(s).
- Duplicate same-form embeds are flagged.
- Block/shortcode settings are reviewed.
- AJAX, theme, field values, and dynamic population are documented.
- Cache/minification compatibility is considered.

## Spam controls

- Honeypot status known.
- Turnstile/reCAPTCHA/Akismet/Zero Spam status known where installed.
- Spam counts and false-positive signals reviewed without exposing personal data.
- Save and Continue/Partial Entries limitations reviewed.

## File uploads

- File upload fields are necessary.
- Allowed extensions are restrictive.
- File size/count limits are appropriate.
- Uploaded file links are not exposed to non-admin recipients unless approved.
- Storage/retention/off-server handling is known.

## Privacy/data handling

- Personal data fields are justified.
- Consent exists where needed.
- IP storage stance known.
- Entry retention/export/erase settings known or marked missing.
- Sensitive data is not sent unnecessarily to email/external services.

## Performance/front-end behaviour

- Dynamic fields and conditional logic are cache-aware.
- CAPTCHA/Turnstile/reCAPTCHA scripts are not blocked.
- Multi-page/payment forms avoid unnecessary front-end conflicts.

## Maintenance readiness

- Form owner known.
- Active forms have purpose and page mapping.
- Stale/orphaned forms flagged.
- Critical forms have notification/feed retest steps.
