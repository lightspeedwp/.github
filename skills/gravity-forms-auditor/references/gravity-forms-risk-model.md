# Gravity Forms risk model

## Readiness score categories

Score each category as `Pass`, `Minor issue`, `Moderate issue`, `Major issue`, `Blocker`, or `Not assessed`, with confidence.

1. Operational readiness
2. Form structure and UX
3. Accessibility
4. Spam protection
5. Security and privacy
6. Notifications and deliverability
7. Add-ons, feeds, and integrations
8. Embedding and front-end behaviour
9. Data handling and retention
10. Maintainability

## Gravity Forms-specific risk patterns

- Missing or inactive Gravity Forms on a site expected to process forms: Blocker/High.
- Outdated Gravity Forms or unsupported PHP/WordPress environment: High/Medium depending on exposure and supportability.
- Missing licence visibility: Medium unless updates/support are blocked, then High.
- Broken form embeds or duplicate same-form embeds: High/Blocker when business-critical.
- Missing admin notification on a lead form: High.
- Unsafe From/Reply-To pattern: High when it can cause DMARC/SPF rejection or lost leads.
- Missing user confirmation: Medium/High depending on user expectation and transaction type.
- Overly long form without sections/pages: Medium; High for high-value conversion journeys.
- Placeholder-only labels or hidden instructions: Medium/High accessibility risk.
- Required fields hidden by conditional logic with no branch test evidence: High.
- Missing spam controls on public forms: Medium/High depending on exposure and current spam evidence.
- Insecure file uploads or broad file extensions: High/Blocker for sensitive uploads.
- Personal data overcollection or missing retention stance: High/Medium.
- Missing consent where marketing, sensitive data, or privacy commitments are involved: High/Medium.
- Payment feed risk, multiple payment feeds without clear conditions, live gateway uncertainty: Blocker/High.
- User Registration role/account creation risk: Blocker/High.
- Add-on/feed failure risk from disabled feeds, missing mappings, disconnected services, spam-blocked feeds, or background processing issues: High/Medium.
- Cache/minification conflicts with dynamic forms, AJAX, conditional logic, CAPTCHA, or payment fields: High/Medium.
- Logging privacy risk where logs are enabled long-term or expose personal data/secrets: High.

## Finding fields

Every finding must include finding title, evidence, affected form/page/add-on, severity, confidence, user impact, business impact, recommended fix, configuration handoff needed, suggested owner, and retest step.
