# File upload request example

Use this pattern when a client needs supporting documents with an enquiry or support request.

## Default fields

- Name.
- Email address.
- Request type.
- Message.
- Optional supporting document.
- Privacy consent.

## Safety stance

- File Upload is high-risk.
- Narrow allowed extensions and max size.
- Avoid attaching uploaded files to notifications by default.
- Confirm upload retention and secure access before production.
- Do not collect passports, medical files, or financial documents unless the secure handling process is approved.

## Testing

- Submit an allowed small file.
- Submit a blocked extension.
- Submit an oversized file.
- Confirm useful validation messages.
- Confirm notification does not expose file unnecessarily.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
