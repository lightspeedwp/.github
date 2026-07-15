# Example: support request form

Use for structured customer support intake where entries become support work, not public content.

## Recommended fields

- Name
- Email
- Company/account
- Website URL
- Issue type
- Urgency
- Description
- Screenshot/file upload, optional and restricted
- Consent/privacy acknowledgement

## Feeds

- Admin/support notification with Reply-To set to submitter.
- Help desk, Slack, webhook, or CRM feed only if the add-on is installed, connected, and approved.
- Conditional routing by issue type or urgency where tested.

## Guardrails

- Do not request passwords, API keys, licence keys, payment details, or private access credentials.
- Treat screenshots and uploads as potentially sensitive.
- Record retention and access owner before launch.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
