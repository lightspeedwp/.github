# Webhooks and Automation Feeds

Use this reference when a Gravity Forms workflow sends data to external systems through Webhooks, Zapier, Slack, CRM, marketing, Help Scout, Salesforce, HubSpot, custom APIs, or other automation feeds.

## Operating stance

Treat outbound automation as data disclosure and integration behaviour. Do not assume an external service, credential, endpoint, or field mapping exists. Do not expose secrets. Prefer read-only feed audit, draft mapping, sandbox test, and explicit approval before live writes.

## Capability and add-on checks

Before creating or editing automation feeds, confirm:

- The required add-on is installed, active, licensed, and connected.
- The active MCP connector can read existing feed settings.
- The current form fields and entry meta are available for mapping.
- Existing conditional logic and spam-handling behaviour.
- Whether the feed sends all fields or selected fields.
- Whether the external endpoint or integration is production, staging, or sandbox.
- Whether logs can be enabled temporarily and redacted after troubleshooting.

## Webhook feed rules

For Webhooks specifically, review:

- Request URL and whether it passes WordPress HTTP URL validation.
- Request method: GET, POST, PUT, PATCH, or DELETE.
- Request format: form encoded or JSON.
- Headers, without exposing API keys or bearer tokens.
- Body mode: All Fields vs selected field mapping.
- Merge tags in URL, headers, or body.
- Conditional logic that decides when the webhook runs.
- Retry/error handling expectations if the target service is unavailable.

Safe defaults:

- Prefer selected field mappings over All Fields.
- Avoid sending file URLs, notes, IP addresses, hidden routing fields, or consent text unless needed.
- Avoid DELETE webhooks unless a senior developer explicitly approves.
- Prefer POST JSON for structured lead handoff when supported by the target service.
- Use staging or test endpoints before production endpoints.

## Marketing and CRM feed rules

For marketing and CRM feeds:

- Confirm consent and lawful basis before adding contacts to lists.
- Map only required fields and approved segmentation fields.
- Keep competition entry, service enquiry, and newsletter opt-in consent separate.
- Document double opt-in or external confirmation behaviour when available.
- Do not assume HubSpot, Mailchimp, Salesforce, Zapier, or Slack is connected because the add-on is installed.

## Approval triggers

Require explicit approval before:

- Creating or changing live webhook, CRM, marketing, Slack, or Zapier feeds.
- Sending all fields to an external service.
- Sending uploaded-file URLs, IP addresses, hidden metadata, or sensitive text fields.
- Adding users to marketing lists.
- Changing production endpoints, authentication headers, request method, or request body.
- Enabling logs that may capture personal data or secrets.

## Validation checklist

Run or recommend:

- Test submission with non-sensitive test data.
- Confirm feed condition matched or deliberately skipped.
- Confirm outbound request success in logs or integration dashboard.
- Confirm only approved fields were sent.
- Confirm external system received expected values in the right record/list/channel.
- Confirm notification and confirmation still match the same routing logic.
- Disable temporary logging and redact evidence before handoff.

## Handoff notes

Record:

- Feed name and add-on type.
- External system and environment.
- Mapped fields, excluded fields, and reason.
- Consent source for marketing feeds.
- Conditional logic.
- Test entry ID if permitted, with personal data redacted.
- Remaining risks and owner for external-system verification.
