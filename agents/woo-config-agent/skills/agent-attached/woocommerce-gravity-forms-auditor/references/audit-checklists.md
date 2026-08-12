# Audit checklists

## WooCommerce Gravity Forms setup

- WooCommerce core is installed and active, or the missing evidence is called out clearly.
- Relevant WooCommerce extensions are identified when the form depends on deposits, wholesale, product options, subscriptions, memberships, quotes, CRM, payments, shipping, or account workflows.
- Gravity Forms is installed, active, and current enough for support.
- WordPress/PHP environment meets current support expectations.
- Licence/update visibility is known or marked missing.
- SMTP/transactional email plugin is present where WooCommerce enquiries or support notifications matter.
- Cache/CDN/script optimisation plugins are identified because product-page embeds and dynamic fields can be affected.
- Security/spam plugins are identified.
- Add-ons are inventoried and mapped to WooCommerce-related forms/feeds.
- Ownership, monitoring, unread/spam counts, and retainer responsibility are known for store-critical forms.

## Individual WooCommerce form structure

- Form status active/inactive matches expected use.
- Purpose is clear from title, description, embed location, fields, and WooCommerce business journey.
- Required fields are justified for the product, quote, support, account, wholesale, stock, payment, or customer journey.
- Field order follows the customer journey.
- Long forms use sections/pages where useful.
- Submit button text sets realistic expectations.

## Product, order, customer, and account context

- Product enquiry forms capture relevant product ID, title, SKU, variation, URL, category, quantity, and page source where needed.
- Quote request forms capture enough detail for sales follow-up without implying checkout, payment, tax, shipping, or confirmed pricing unless scoped.
- Stock or availability enquiry forms avoid unsupported stock guarantees.
- Order-support forms collect only necessary order/customer context and avoid exposing full order data unnecessarily.
- Customer account support forms never ask for passwords, payment-card details, or unnecessary credentials.
- B2B/wholesale forms include approval, segmentation, consent, and routing signals.
- Hidden fields and dynamic values are documented and verified where evidence allows.

## Field quality

- Use specific field types for email, phone, date, number, URL, consent, file upload, choice, product context, order number, and pricing-adjacent data.
- Avoid placeholder-only labels.
- Descriptions/instructions are clear and not excessive.
- Choices are concise, non-duplicated, and support reporting.
- Hidden fields and dynamic values are documented.

## Conditional logic

- Branches are understandable and testable.
- Required fields are not unreachable.
- Page/section/button logic has branch coverage.
- Conditional notifications/feeds/confirmations match submitted product, order, customer, quote, stock, or wholesale values.

## Confirmations

- Confirmation type is appropriate: text, page, or redirect.
- Message aligns with notification/user expectations.
- Quote, stock, support, and account confirmations make response times and next steps clear.
- Redirects avoid leaking personal data in query strings.
- Spam confirmation behaviour is understood.

## Notifications

- Admin notification exists and is enabled where needed.
- User autoresponder exists where expected.
- Recipients/routing are valid for sales, support, fulfilment, account, wholesale, product owner, or vendor workflows.
- From uses a domain-authorised address; Reply-To uses submitter email when appropriate.
- Product/order/customer context is preserved without exposing excessive sensitive data.
- Sensitive data and file URLs are limited.

## Feeds and WooCommerce-related integrations

- Active/disabled feeds are inventoried.
- Field mappings are complete.
- Conditions are explicit and testable.
- External service connection evidence is available without exposing secrets.
- Payment/User Registration feeds get high-risk handling.
- WooCommerce extension-related feeds are supported by confirmed extension evidence.

## Embeds

- Form appears on the expected product, category, account, support, quote, or customer-service page(s).
- Duplicate same-form embeds are flagged.
- Block/shortcode settings are reviewed.
- AJAX, theme, field values, product context, and dynamic population are documented.
- Cache/minification compatibility is considered.

## Spam controls

- Honeypot status known.
- Turnstile/reCAPTCHA/Akismet/Zero Spam status known where installed.
- Spam counts and false-positive signals reviewed without exposing personal data.
- Save and Continue/Partial Entries limitations reviewed.

## File uploads

- File upload fields are necessary for the WooCommerce journey.
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
- Order, account, and customer data is minimised and redacted in outputs.

## Performance/front-end behaviour

- Dynamic product/order/customer fields and conditional logic are cache-aware.
- CAPTCHA/Turnstile/reCAPTCHA scripts are not blocked.
- Multi-page/payment forms avoid unnecessary front-end conflicts.

## Maintenance readiness

- Form owner known.
- Active WooCommerce-related forms have purpose and page mapping.
- Stale/orphaned forms flagged.
- Critical product, quote, support, account, payment, and feed forms have notification/feed retest steps.
