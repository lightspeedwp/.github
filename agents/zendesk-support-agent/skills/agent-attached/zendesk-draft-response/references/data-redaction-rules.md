# Data Redaction Rules

Use these rules when turning real support context into examples, regression prompts, shared-agent setup notes, QA fixtures, screenshots, documentation, or pasted context that may be reused outside the live ticket.

## Default Rule

Keep live customer facts in the live support source. Do not copy real customer identities, credentials, private URLs, personal contact details, payment details, access tokens, or ticket-specific private evidence into bundled examples, smoke tests, shared instructions, or Memory.

## What to Redact

Always redact or replace:

- customer names, account names, company names, user names, email addresses, phone numbers, and personal addresses
- private domains, staging URLs, admin URLs, invoice links, payment links, and signed file URLs
- ticket IDs, order IDs, invoice IDs, subscription IDs, internal issue IDs, and case numbers when not required for the live task
- API keys, bearer tokens, passwords, auth headers, session IDs, cookies, reset links, and one-time codes
- screenshots or snippets that expose personally identifiable information, billing details, security findings, or private system paths
- internal staff names when the output will be used as synthetic evidence or reusable documentation

## Safe Replacements

Use stable placeholders that preserve the support meaning without leaking identity:

| Sensitive value | Replacement |
| --- | --- |
| real customer name | `Customer A` |
| real company/account | `Example Account` |
| real email | `customer@example.com` |
| real staff member | `Support Agent` |
| real ticket ID | `ZD-000000` |
| real domain | `example.com` |
| real admin/staging URL | `https://example.com/admin-redacted` |
| real invoice/order ID | `ORDER-000000` |
| real API key/token | `[REDACTED_TOKEN]` |

Keep product names, general issue behaviour, dates relative to the support sequence, and confirmed/non-confirmed evidence states when they are necessary to test the reply logic.

## Redaction Workflow

1. Copy only the minimum support context needed for the task.
2. Remove secrets first: tokens, passwords, cookies, auth headers, payment details, reset links, and one-time codes.
3. Replace customer and staff identities with generic placeholders.
4. Replace private URLs, domains, IDs, and contact details.
5. Preserve the support logic: latest customer ask, confirmed facts, uncertain facts, prior promises, risk flags, and safe next step.
6. Run `scripts/redact_context.py` on reusable examples or test prompts when a deterministic pass would help.
7. Review the redacted output manually before adding it to the skill, shared agent files, or regression prompts.

## Live Drafting Exception

When drafting a live customer reply inside Zendesk or Gmail, it is acceptable to use the customer name, product area, ticket details, and other relevant evidence available in that live thread. Do not unnecessarily remove details the customer needs to recognise their own issue.

This exception does not apply to bundled examples, training prompts, smoke tests, reusable templates, shared agent setup notes, public documentation, or Memory.

## Do Not Over-Redact

Avoid replacing every meaningful detail with vague text. A useful redacted support example should still show:

- what the customer asked
- what is confirmed
- what is not confirmed
- what support already promised
- what risk is present
- what the safe next step is

If redaction makes the support scenario impossible to understand, rewrite the scenario as synthetic data instead of preserving the original thread structure.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
