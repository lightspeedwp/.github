# Add-ons, feeds, and integrations audit

## Add-on inventory

Record installed/active official add-ons and third-party plugins, including payment, User Registration, marketing, CRM, Webhooks, Zapier, Slack, Dropbox, Partial Entries, Save and Continue, Advanced Post Creation, Gravity Wiz/Gravity Perks, GravityKit, Zero Spam, and analytics-related add-ons.

## Feed criteria

- Active and disabled feeds are listed.
- Feed purpose is clear.
- Required mappings are complete.
- Conditional logic is explicit and branch-testable.
- External service connection state is known without exposing secrets.
- Background processing/cron risks are noted when feeds are delayed.
- Spam entries do not process feeds; include this in troubleshooting.
- Logs, if reviewed, are redacted and temporary.

## High-risk feed patterns

- Payment feeds: one payment feed per submission constraints, conditional logic, test/live mode, SSL, payment add-on availability, receipt/refund wording, and gateway account state.
- User Registration feeds: username/email requirements, role assignment, activation, password handling, account update feeds, privilege escalation risk.
- Webhooks: endpoint URL, method, headers, selected fields, authentication, secrets, retry/failure logging, and data minimisation.
- Marketing/CRM feeds: opt-in evidence, consent, mapped fields, duplicate contact behaviour, and external processor/data transfer notes.
- Advanced Post Creation: post status, taxonomy/custom fields, media handling, public publishing, and moderation owner.
- Partial Entries/Save and Continue: draft personal data, retention, spam coverage limits, and consent expectations.

## Third-party cautions

Gravity Wiz/Gravity Perks, GravityKit, Zero Spam, and similar plugins are useful only when installed, active, supported, and licensed where needed. Do not recommend dependency-heavy add-ons without a clear risk/ROI note.
