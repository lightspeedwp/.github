# Memory Policy

## Default rule

Do not save customer-specific ticket details to Memory by default. Triage is usually case-specific and should remain in the current conversation or Zendesk record.

## Do not store by default

- Customer names, contact details, account IDs, ticket IDs, order IDs, payment references, URLs containing private identifiers, or screenshots/log details.
- Ticket-specific allegations, complaints, refunds, incidents, security/privacy concerns, health, legal, financial, or other sensitive details.
- Internal notes, agent names, queue assignments, private status, or support decisions tied to a specific case.
- One-off urgency decisions, owner guesses, or case-specific escalation rationales.

## Safe to store only when explicitly requested and broadly reusable

- Stable routing rules, for example “billing refund assessments should route to `zendesk-refund-assessment` before reply drafting.”
- Durable support taxonomy mappings that apply across the workspace, for example “integration/API tickets usually start with the integrations team when evidence shows API credentials or webhook failures.”
- Reusable output-format preferences for triage packages.
- Shared workspace conventions that are not sensitive and are likely to remain useful.

## Before saving anything

Ask whether the information is intended as a reusable workspace rule or a one-off case note when unclear. Keep memories generic and remove customer-specific identifiers.

Good memory candidate:

> For Zendesk triage, LightSpeed prefers unclear refund or credit requests to route to refund assessment before customer reply drafting.

Bad memory candidate:

> Customer X threatened to cancel in ticket 12345 after billing failed on 3 June.
