# Chatbot Launch Readiness Checklist

## Client

- Client: {{client.name}}
- Website: {{client.website_url}}
- Package: {{package.name}}
- Launch owner: {{launch.owner}}
- Target launch date: {{launch.target_date}}

Use this checklist to confirm that all critical elements are ready before a chatbot goes live. It covers content approval, governance, escalation, logging, metrics and rollback preparedness.

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

## Post-Launch Review

| Review item | Owner | Timing | Notes |
|---|---|---|---|
| Transcript review | {{review.transcript_owner}} | {{review.transcript_timing}} | {{review.transcript_notes}} |
| Usage/cost review | {{review.usage_owner}} | {{review.usage_timing}} | {{review.usage_notes}} |
| Content gap review | {{review.content_owner}} | {{review.content_timing}} | {{review.content_notes}} |
| Escalation review | {{review.escalation_owner}} | {{review.escalation_timing}} | {{review.escalation_notes}} |

> This document supports operational planning and is not legal advice. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
