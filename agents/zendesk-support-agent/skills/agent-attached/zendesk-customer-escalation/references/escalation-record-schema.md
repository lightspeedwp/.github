# Escalation Record Schema

Use this schema when a shared agent needs consistent fields for copy-paste, QA review, automation, or conversion into Zendesk, Slack, Asana, Linear, GitHub, or email.

This is a planning schema, not a strict machine validator. Omit unknown fields only when they do not affect the escalation decision. For material unknowns, include them as evidence gaps.

## Core fields

```yaml
ticket_reference: ""
customer_or_account: ""
affected_product_or_workflow: ""
summary: ""
escalation_reason: ""
severity: "Critical | High | Medium"
urgency_basis: ""
recommended_owner_lane: "Engineering | Product | Security | Leadership | Support specialist"
supporting_lane: "optional"
decision_or_action_needed: ""
customer_impact: ""
customer_facing_commitment: ""
suggested_internal_checkpoint: ""
confidence: "Confirmed | Likely | Possible | Unknown"
```

## Source and access fields

```yaml
sources_checked:
  - source: "zendesk"
    result: "checked | not_found | unavailable | access_denied | not_applicable"
    notes: ""
  - source: "crm"
    result: "checked | not_found | unavailable | access_denied | not_applicable"
    notes: ""
  - source: "slack"
    result: "checked | not_found | unavailable | access_denied | not_applicable"
    notes: ""
  - source: "asana"
    result: "checked | not_found | unavailable | access_denied | not_applicable"
    notes: ""
  - source: "support_docs"
    result: "checked | not_found | unavailable | access_denied | not_applicable"
    notes: ""
```

## Evidence fields

```yaml
evidence_gathered:
  - type: "ticket_note | customer_message | internal_note | screenshot | log | reproduction | similar_ticket | support_doc | crm_context | slack_context | asana_task | other"
    source: "zendesk | crm | slack | asana | support_docs | pasted_user_context"
    timestamp: "optional"
    detail: ""
    confidence: "Confirmed | Likely | Possible | Unknown"

attempted_steps:
  - step: ""
    result: ""
    source: ""

reproduction_or_diagnostic_notes:
  environment: "optional"
  affected_user_or_site: "optional"
  versions_or_integrations: "optional"
  expected_behaviour: "optional"
  actual_behaviour: "optional"
  reproduction_steps:
    - "optional"

evidence_gaps:
  - gap: ""
    why_it_matters: "confidence | severity | urgency | ownership | customer wording | remediation"
    smallest_next_request: ""
```

## Example: Zendesk-only evidence-limited brief

```yaml
ticket_reference: "ZD-12345"
customer_or_account: "Example customer"
affected_product_or_workflow: "Checkout integration"
summary: "Customer reports checkout failures after enabling the integration. Zendesk evidence shows repeated failures after support configuration checks."
escalation_reason: "Support cannot confirm whether this is expected behaviour or an integration defect without engineering review."
severity: "High"
urgency_basis: "Customer cannot complete affected checkout workflow and support path has stalled. Commercial context is unknown."
recommended_owner_lane: "Engineering"
decision_or_action_needed: "Please confirm whether the checkout behaviour is a defect and advise the safest workaround or remediation path."
confidence: "Likely"
sources_checked:
  - source: "zendesk"
    result: "checked"
    notes: "Ticket history and internal notes reviewed."
  - source: "crm"
    result: "unavailable"
    notes: "Commercial and renewal context unavailable in this shared-agent run."
evidence_gaps:
  - gap: "CRM relationship context unavailable."
    why_it_matters: "urgency"
    smallest_next_request: "Ask account owner whether there is renewal, launch, or executive pressure."
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
