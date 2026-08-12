# Webhook Lead Routing Example

Use when a Gravity Forms enquiry needs to send selected lead data to an external system through the Webhooks Add-On.

## Purpose

Send approved, minimised form data to a staging or production endpoint after submission, with conditional routing and redacted logs.

## Required capabilities

- Webhooks Add-On installed and active.
- Feed read access and preferably write access.
- Endpoint owner confirmation.
- Test endpoint or sandbox where possible.

## Recommended mapping

- Name.
- Email.
- Phone if required.
- Enquiry type.
- Message summary.
- Source page/campaign if approved.
- Consent marker if relevant.

## Safety notes

- Prefer selected fields instead of All Fields.
- Do not send uploaded files, IP addresses, hidden admin notes, or secrets unless explicitly approved.
- Redact headers and tokens in all outputs.
- Confirm external-system receipt before declaring success.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
