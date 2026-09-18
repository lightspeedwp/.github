# Chatbot Launch Readiness Checklist

## Client

- Client: {{client.name}}
- Website: {{client.website_url}}
- Launch owner: {{launch.owner}}

## Launch Gate

| Requirement | Ready? | Notes |
|---|---|---|
| Approved source content exists and is current | {{gate.sources_ready}} | {{gate.sources_notes}} |
| Source exclusion list exists | {{gate.exclusions_ready}} | {{gate.exclusions_notes}} |
| Allowed topics are documented | {{gate.allowed_ready}} | {{gate.allowed_notes}} |
| Restricted topics are documented | {{gate.restricted_ready}} | {{gate.restricted_notes}} |
| Fallback response is approved | {{gate.fallback_ready}} | {{gate.fallback_notes}} |
| Escalation route is operational | {{gate.escalation_ready}} | {{gate.escalation_notes}} |
| Disclosure wording is approved | {{gate.disclosure_ready}} | {{gate.disclosure_notes}} |
| Lead capture fields are minimised | {{gate.lead_ready}} | {{gate.lead_notes}} |
| Privacy/log-retention questions are answered | {{gate.privacy_ready}} | {{gate.privacy_notes}} |
| Transcript review owner is named | {{gate.transcript_ready}} | {{gate.transcript_notes}} |
| Success metrics are defined | {{gate.metrics_ready}} | {{gate.metrics_notes}} |
| Real-question testing has passed | {{gate.testing_ready}} | {{gate.testing_notes}} |
| Rollback/disable process is defined | {{gate.rollback_ready}} | {{gate.rollback_notes}} |

## Launch Decision

- Decision: {{launch.decision}}
- Approved by: {{launch.approved_by}}
- Conditions: {{launch.conditions}}

> This document supports operational planning and is not legal advice. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser.
