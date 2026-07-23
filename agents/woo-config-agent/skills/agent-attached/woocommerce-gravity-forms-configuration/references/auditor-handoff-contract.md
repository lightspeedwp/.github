# Auditor Handoff Contract

Accept handoffs from `woocommerce-gravity-forms-auditor` as remediation input, not as permission to make changes.

This configuration skill must accept the canonical handoff packet produced by `woocommerce-gravity-forms-auditor` v0.2.1+ and may also accept the older normalised flat handoff shape for backwards compatibility.

## Canonical auditor handoff fields

Prefer these fields when the handoff comes from `woocommerce-gravity-forms-auditor` configuration handoff output:

| Canonical field | Required | Configuration interpretation |
|---|---:|---|
| `handoff_title` | yes | Human-readable title for the remediation packet. |
| `source_audit` | yes | Source audit report title, date, site, environment, and output location when available. |
| `findings_included` | yes | Stable auditor finding IDs to preserve in all change plans, validation reports, and handoff notes. |
| `target_form_page_addon` | yes | Target site, form, page, notification, confirmation, feed, add-on, or embed details. |
| `proposed_remediation` | yes | Recommended configuration outcome; verify before turning into a change plan. |
| `required_mcp_capabilities` | yes | Read/write capabilities needed; if missing, produce manual steps or a capability gap. |
| `required_addons` | yes | Add-ons or third-party plugins required; use an empty list when none are needed. |
| `approval_requirements` | yes | Production, payment, user-registration, privacy, client, or other approvals needed. |
| `risk_level` | yes | Auditor risk level; map to change-risk approval rules before writes. |
| `validation_steps` | yes | Post-change validation and retest requirements. |
| `rollback_notes` | yes | Rollback considerations to preserve in the change plan. |
| `suggested_configuration_prompt` | yes | Suggested prompt or implementation brief for this skill. |
| `excluded_findings` | no | Findings intentionally excluded from this remediation packet. |
| `evidence_redaction_notes` | no | Sensitive evidence removed or locations requiring approved access. |

## Legacy normalised handoff fields

Also accept older handoffs with these fields and normalise them into the canonical shape before planning remediation:

- `source_audit_title`
- `audit_date`
- `site_url`
- `environment`
- `auditor_skill_version`
- `finding_id`
- `finding_title`
- `affected_object`
- `evidence`
- `severity`
- `confidence`
- `user_impact`
- `business_impact`
- `recommended_remediation`
- `required_gravity_forms_capability`
- `required_mcp_capability`
- `required_addons`
- `approval_required`
- `suggested_validation_steps`
- `rollback_consideration`
- `client_safe_notes`
- `internal_notes`
- `open_questions`

## Normalisation rules

1. Treat the handoff as a starting point, not verified current state.
2. Re-check current site state through MCP before planning writes.
3. Lower confidence if the handoff evidence is stale or cannot be verified.
4. Do not apply changes directly from the handoff.
5. Produce a change plan first.
6. Ask for explicit approval before consequential changes.
7. Preserve every original auditor finding ID in the change plan, validation report, and final handoff note.
8. If required MCP capabilities are missing, produce manual implementation steps or a capability gap instead of guessing.
9. If required add-ons are missing or unverified, recommend install/licence/configuration checks but do not assume availability.
10. If the finding involves payments, user registration, file uploads, webhooks, retention, entry exports, or production embeds, treat it as high risk.
11. Missing canonical required fields are readiness gaps. Ask for or reconstruct the smallest missing field from provided evidence; do not infer approval, add-on availability, rollback safety, or validation success.
12. When a legacy handoff supplies `approval_required: true`, convert it into a specific `approval_requirements` list before proceeding.

## Accepted canonical handoff example

```yaml
handoff_title: "Notification sender remediation - Example Client"
source_audit: "Gravity Forms audit - Example Client, 2026-07-03, staging, https://example.com"
findings_included:
  - "GF-AUD-014"
target_form_page_addon: "Contact form ID 3, Admin Notification"
proposed_remediation: "Use a domain-aligned From address and map submitter email to Reply-To."
required_mcp_capabilities:
  - "read form notifications"
  - "update notifications"
required_addons: []
approval_requirements:
  - "Confirm recipient mailbox and From/Reply-To pattern before production change."
risk_level: "High"
validation_steps:
  - "Read current notification settings before editing."
  - "Validate notification settings after change."
  - "Run approved synthetic submission testing if the environment permits."
rollback_notes:
  - "Record previous From and Reply-To values before updating."
suggested_configuration_prompt: "Using woocommerce-gravity-forms-configuration, prepare an approval-first change plan for GF-AUD-014. Do not apply changes until approved."
excluded_findings: []
evidence_redaction_notes:
  - "Email addresses redacted in auditor evidence."
```

## Accepted legacy handoff example

```yaml
source_audit_title: "Gravity Forms audit - Example Client"
audit_date: "2026-07-03"
site_url: "https://example.com"
environment: "staging"
auditor_skill_version: "woocommerce-gravity-forms-auditor v0.2.0"
finding_id: "GF-AUD-014"
finding_title: "Admin notification uses submitter email as From address"
affected_object:
  form_id: 3
  form_title: "Contact"
  notification: "Admin Notification"
evidence:
  - "From Email is mapped to {Email:2}."
  - "Reply-To is empty."
severity: "high"
confidence: "high"
user_impact: "Customer replies may fail or reach the wrong mailbox."
business_impact: "Lead-response reliability is reduced."
recommended_remediation: "Use a domain-aligned From address and map submitter email to Reply-To."
required_gravity_forms_capability: "gravityforms_edit_forms"
required_mcp_capability: "read form notifications and update notifications"
required_addons: []
approval_required: true
suggested_validation_steps:
  - "Read current notification settings before editing."
  - "Run approved synthetic submission testing if the environment permits."
rollback_consideration: "Record previous From and Reply-To values before updating."
client_safe_notes: "Improve notification deliverability by aligning the sender address with the site domain."
internal_notes: "Check SMTP plugin and DNS alignment separately if delivery still fails."
open_questions:
  - "Which mailbox should receive admin leads?"
```

## Output expectation

After accepting a handoff, produce an auditor handoff intake first when evidence is incomplete or multi-finding. Produce a remediation change plan before any write operation. Never treat an auditor handoff as approval to execute.
