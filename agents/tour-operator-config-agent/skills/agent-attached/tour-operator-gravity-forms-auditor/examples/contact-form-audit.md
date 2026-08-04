# Example: basic contact form audit

## Scope

Single public contact form on `/contact/`; internal audit with client-safe summary.

## Evidence

- MCP preflight confirms Gravity Forms active, SMTP plugin present, form schema readable.
- Form has Name, Email, Message, Consent, and Submit fields.
- Admin notification exists but From Email uses `{Email:2}`.
- Honeypot enabled; no CAPTCHA field.

## Findings

| ID | Finding | Severity | Confidence | Recommended fix | Handoff item | Retest step |
|---|---|---|---|---|---|---|
| GF-AUD-001 | Notification From Email uses submitter email rather than domain-authorised address. | High | High | Use a domain mailbox as From and submitter email as Reply-To. | Yes | Review notification settings and approved test email result. |
| GF-AUD-002 | Form has visible labels and consent field; accessibility visual check not assessed. | Info | Medium | Review rendered page for focus/contrast before launch. | No | Inspect page screenshot or run front-end accessibility check. |

## Handoff item

Route GF-AUD-001 to the `tour-operator-gravity-forms-configuration` skill to update notification sender safely after approval.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
