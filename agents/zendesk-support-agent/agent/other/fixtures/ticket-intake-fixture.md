# Ticket Intake Fixture

## Intake

- Ticket ID: 123456
- Customer: Example Merchant
- Summary: Checkout fails after plugin update.
- Issue type: payments / checkout
- Current state: customer blocked after update, evidence incomplete

## Validation target

- Primary deliverables:
  - triage summary
  - investigation
  - customer reply
  - support handoff
  - escalation brief
  - documentation-worthiness review
  - bug package
- Expected templates:
  - `templates/agent-triage-summary-template.md`
  - `templates/agent-investigation-template.md`
  - `templates/agent-customer-reply-template.md`
  - `templates/agent-handoff-template.md`
  - `templates/agent-escalation-template.md`
  - `templates/agent-documentation-review-template.md`
  - `templates/agent-bug-package-template.md`
- Expected examples:
  - `examples/templates/agent-triage-summary.example.md`
  - `examples/templates/agent-investigation.example.md`
  - `examples/templates/agent-customer-reply.example.md`
  - `examples/templates/agent-handoff.example.md`
  - `examples/templates/agent-escalation.example.md`
  - `examples/templates/agent-documentation-review.example.md`
  - `examples/templates/agent-bug-package.example.md`
- Expected profile: `profiles/default-support-profile.yaml`
- Expected schema: `schemas/ticket-intake-fixture.schema.json`

## Expected use

- Use this fixture for template, routing, evidence-format, and profile-aware output validation only.
- Keep the fixture as generalized sample input, not as live customer evidence.
- Do not copy fixture details into Memory.
- Do not add customer-specific identifiers beyond this generalized sample.

## Fixture safety rules

- Keep names, IDs, and issue details generalized.
- Do not add real ticket URLs, account identifiers, or private customer context.
- Use this fixture to validate output shape and contract alignment, not to simulate authoritative business data.
