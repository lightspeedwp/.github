# Example: UTM lead capture form

## Purpose

Capture a lead enquiry while preserving campaign attribution in hidden fields without sending personal data to analytics tools.

## Recommended fields

- Name
- Email
- Phone, optional
- Service interest
- Message
- Consent
- Hidden: utm_source
- Hidden: utm_medium
- Hidden: utm_campaign
- Hidden: utm_content
- Hidden: utm_term
- Hidden: landing_page
- Hidden: referrer

## Configuration notes

- Use prefixed dynamic population parameter names such as `ls_utm_source` and `ls_utm_campaign`.
- Keep UTM fields optional because direct traffic and privacy tooling may strip parameters.
- Store attribution in the entry and CRM feed only when governance allows it.
- Do not include personal field values in GA4/GTM event parameters.
- Test with clean browser sessions and accepted/refused analytics consent states.

## QA

- Submit with full UTM query string.
- Submit without UTM parameters.
- Submit with validation errors and confirm no successful conversion event is counted.
- Confirm entry is created before tracking is considered valid.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
