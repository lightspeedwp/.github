# WooCommerce Gravity Forms risk model

## Readiness score categories

Score each category as `Pass`, `Minor issue`, `Moderate issue`, `Major issue`, `Blocker`, or `Not assessed`, with confidence.

1. WooCommerce operational readiness
2. Gravity Forms structure and UX
3. Accessibility
4. Spam protection
5. Security and privacy
6. Notifications and deliverability
7. Add-ons, feeds, and WooCommerce-related integrations
8. Embedding and front-end behaviour
9. Data handling and retention
10. Product/order/customer context handling
11. Maintainability

## WooCommerce Gravity Forms-specific risk patterns

- Missing or inactive WooCommerce core on a site expected to use this auditor: route away or mark scope invalid.
- Missing or inactive Gravity Forms on a WooCommerce site expected to process store-related forms: Blocker/High.
- Outdated Gravity Forms, WooCommerce, or unsupported PHP/WordPress environment: High/Medium depending on exposure and supportability.
- Missing licence visibility: Medium unless updates/support are blocked, then High.
- Broken product-page, quote, account-support, order-support, or wholesale form embeds: High/Blocker when business-critical.
- Missing product ID, SKU, variation, product URL, quantity, or page source on a product enquiry or quote form: High/Medium depending on journey.
- Missing admin notification on a product enquiry, quote request, stock enquiry, order-support, account-support, or wholesale lead form: High.
- Unsafe From/Reply-To pattern: High when it can cause DMARC/SPF rejection or lost WooCommerce enquiries.
- Missing user confirmation: Medium/High depending on user expectation and transaction type.
- Quote, stock, or availability wording that implies confirmed checkout, reservation, shipping, tax, or payment where not integrated: High/Medium.
- Overly long form without sections/pages: Medium; High for high-value conversion journeys.
- Placeholder-only labels or hidden instructions: Medium/High accessibility risk.
- Required fields hidden by conditional logic with no branch test evidence: High.
- Missing spam controls on public product, quote, support, wholesale, or account forms: Medium/High depending on exposure and current spam evidence.
- Insecure file uploads or broad file extensions: High/Blocker for sensitive uploads.
- Personal data overcollection or missing retention stance: High/Medium, especially where order, customer, or account data is collected.
- Missing consent where marketing, sensitive data, account data, or privacy commitments are involved: High/Medium.
- Payment feed risk, multiple payment feeds without clear conditions, live gateway uncertainty: Blocker/High.
- User Registration role/account creation risk: Blocker/High.
- Add-on/feed failure risk from disabled feeds, missing mappings, disconnected services, spam-blocked feeds, unsupported WooCommerce extension assumptions, or background processing issues: High/Medium.
- Cache/minification conflicts with dynamic forms, AJAX, product context, conditional logic, CAPTCHA, or payment fields: High/Medium.
- Logging privacy risk where logs are enabled long-term or expose personal data/secrets: High.

## Finding fields

Every finding must include finding title, evidence, affected WooCommerce form/page/product/order/customer/account/add-on/feed context, severity, confidence, user impact, business impact, recommended fix, configuration handoff needed, suggested owner, and retest step.
