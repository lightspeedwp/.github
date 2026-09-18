# WooCommerce Gravity Forms Auditor to Configuration Contract

Contract version: `1.0`

## Purpose

Use this contract when `woocommerce-gravity-forms-auditor` identifies actionable WooCommerce Gravity Forms findings that require approved remediation by `woocommerce-gravity-forms-configuration`.

The auditor skill produces the handoff. The WooCommerce configuration skill accepts the handoff as evidence input, verifies the current WooCommerce and Gravity Forms state, prepares a reversible change plan, seeks approval where required, applies only approved changes, and reports validation results.

This contract keeps the LightSpeed workflow clean: read-only WooCommerce form audit evidence to contract handoff to verified change plan to approval to implementation to validation to retest.

## Boundary rules

### Auditor responsibility

The auditor must:
- Inspect read-only evidence only.
- Confirm or mark missing WooCommerce core and relevant extension evidence.
- Classify findings by severity, confidence, priority, effort, owner, and handoff need.
- Produce a configuration handoff for actionable WooCommerce Gravity Forms fixes.
- Preserve finding IDs from findings register to handoff and retest.
- Avoid test submissions, edits, activation/deactivation, settings changes, entry exposure, logging changes, payment checks, order checks, stock changes, account changes, or secret exposure.
- Label recommendations as `Platform requirement`, `LightSpeed recommendation`, `Client decision`, or `Missing evidence`.

The auditor must not:
- Perform configuration changes.
- Treat MCP write access as permission.
- Infer missing operational, legal, payment, privacy, security, sales, support, fulfilment, stock, or client approval decisions.
- Replace the configuration skill's current-state verification, change planning, approval, implementation, or validation work.

### Configuration responsibility

The configuration skill must:
- Treat the auditor handoff as intake evidence, not approval.
- Verify current WooCommerce and Gravity Forms state before planning changes.
- Preserve the original finding IDs in plans, changes, validation, and handoff notes.
- Identify missing required fields as readiness gaps.
- Produce a reversible change plan before write operations.
- Show before/after intent for settings that will change.
- Request approval for production-impacting, high-risk, payment, user-registration, privacy, retention, webhook, file-upload, notification overwrite, feed overwrite, cache, logging, analytics, role/capability, order-support, customer-account, product-context, stock wording, or WooCommerce extension-related changes.
- Validate after change and report results against the source finding IDs.

The configuration skill must not:
- Re-run a full audit.
- Produce formal audit reports, readiness scorecards, findings registers, or client-safe audit summaries.
- Apply changes when evidence or approval is missing.
- Overwrite settings without a change plan and approval where required.

## Handoff packet

Every auditor-to-configuration handoff must include these fields.

| Field | Required | Description |
|---|---:|---|
| `contract_version` | Yes | Contract version, starting at `1.0`. |
| `handoff_id` | Yes | Stable ID for this handoff packet. |
| `handoff_title` | Yes | Short human-readable remediation title. |
| `source_audit` | Yes | Audit name/date/source or report reference. |
| `source_skill` | Yes | Usually `woocommerce-gravity-forms-auditor`. |
| `target_skill` | Yes | Always `woocommerce-gravity-forms-configuration`. |
| `site_url` | Yes | WooCommerce site being audited/configured. |
| `environment` | Yes | `production`, `staging`, `local`, `development`, or `unknown`. |
| `woocommerce_context` | Recommended | Product, order, account, quote, stock, wholesale, payment, extension, or customer-support journey affected. |
| `findings_included` | Yes | List of finding IDs included in this handoff. |
| `affected_items` | Yes | Site/form/page/product/order/account/add-on/feed/notification/confirmation affected. |
| `confirmed_evidence` | Yes | Evidence summary with confidence. |
| `evidence_gaps` | Yes | Missing or unverified evidence. |
| `risk_level` | Yes | `Blocker`, `High`, `Medium`, `Low`, or `Info`. |
| `priority_group` | Yes | `Immediate`, `Next`, or `Later`. |
| `recommendation_label` | Yes | `Platform requirement`, `LightSpeed recommendation`, `Client decision`, or `Missing evidence`. |
| `proposed_remediation` | Yes | What should change, in implementation-neutral terms. |
| `required_capabilities` | Yes | Read/write MCP capabilities or manual access needed. |
| `required_addons_or_services` | No | Gravity Forms add-ons, WooCommerce extensions, SMTP, DNS, CRM, payment gateway, etc. |
| `approval_requirements` | Yes | Who must approve and why. |
| `change_risk_notes` | Yes | Production, privacy, payment, user, order, account, feed, notification, cache, or rollback risk. |
| `validation_steps` | Yes | Checks configuration must run after change. |
| `rollback_notes` | Yes | How to undo or recover. |
| `client_safe_summary` | No | Optional plain-language summary for client use. |
| `suggested_configuration_prompt` | Yes | Prompt to start the WooCommerce configuration skill safely. |

## Handoff readiness

Before configuration planning, classify the handoff as:

- `Ready for configuration planning`: enough evidence to verify state and draft a change plan.
- `Partially ready`: useful evidence exists but one or more fields must be confirmed before writes.
- `Not ready`: missing target form/page/environment/risk/approval/evidence needed for safe planning.

A partially ready handoff may still produce a manual investigation plan, but must not proceed to writes.

## Configuration intake response

When receiving a handoff, `woocommerce-gravity-forms-configuration` must respond with:

1. `Handoff intake status`
   - Ready, partially ready, or not ready.
2. `Source findings`
   - Preserve IDs and affected WooCommerce/form items.
3. `Verified current state`
   - What was confirmed through MCP/export/screenshots/manual evidence.
4. `Readiness gaps`
   - Missing evidence or approvals.
5. `Proposed change plan`
   - Before/after intent, affected settings, WooCommerce risk, owner, approval needed.
6. `Approval checkpoint`
   - Clear decision required before changes.
7. `Validation plan`
   - Retest steps mapped to original finding IDs.
8. `Rollback plan`
   - How to reverse or recover.

## Post-change validation report

After approved changes, configuration must return:

| Field | Required | Description |
|---|---:|---|
| `source_handoff_id` | Yes | Original handoff ID. |
| `finding_ids` | Yes | Original finding IDs addressed. |
| `changes_applied` | Yes | Evidence-labelled summary of changes. |
| `changes_not_applied` | Yes | Deferred, blocked, or rejected changes. |
| `validation_results` | Yes | Pass/fail/limited checks. |
| `remaining_risk` | Yes | Any unresolved risk. |
| `rollback_status` | Yes | Whether rollback path remains available. |
| `recommended_retest` | Yes | Prompt or notes for `woocommerce-gravity-forms-auditor` retest. |

## Required prompt handoff format

Use this format when handing from audit to configuration:

> Use `woocommerce-gravity-forms-configuration` to prepare a remediation plan for the attached WooCommerce Gravity Forms auditor handoff. Treat the handoff as evidence, verify current site state first, preserve finding IDs, do not make changes until the change plan and approval requirements are confirmed, and return validation steps mapped to the original findings.

## Minimum JSON shape

```json
{
  "contract_version": "1.0",
  "handoff_id": "wc-gf-audit-handoff-001",
  "handoff_title": "Fix unreliable WooCommerce support form notifications",
  "source_audit": {
    "title": "WooCommerce Gravity Forms Fast Audit",
    "date": "2026-07-03",
    "source_skill": "woocommerce-gravity-forms-auditor"
  },
  "source_skill": "woocommerce-gravity-forms-auditor",
  "target_skill": "woocommerce-gravity-forms-configuration",
  "site_url": "https://example.com",
  "environment": "staging",
  "woocommerce_context": "order support form",
  "findings_included": ["GF-001", "GF-002"],
  "affected_items": [
    {
      "type": "form",
      "name": "Order Support Form",
      "id": "unknown",
      "page_url": "https://example.com/contact/"
    }
  ],
  "confirmed_evidence": [
    {
      "finding_id": "GF-001",
      "summary": "Admin notification exists but From/Reply-To alignment is not verified for the WooCommerce order support journey.",
      "confidence": "Medium"
    }
  ],
  "evidence_gaps": [
    "SMTP plugin status not verified",
    "DNS alignment not verified"
  ],
  "risk_level": "High",
  "priority_group": "Immediate",
  "recommendation_label": "LightSpeed recommendation",
  "proposed_remediation": [
    "Verify notification recipients, From address, Reply-To, and conditional routing.",
    "Confirm SMTP or transactional email configuration before relying on the WooCommerce support form."
  ],
  "required_capabilities": [
    "read form notifications",
    "read plugin list",
    "update form notification settings"
  ],
  "required_addons_or_services": [
    "SMTP or transactional email plugin/service"
  ],
  "approval_requirements": [
    "Approval required before changing live notification recipients or From/Reply-To values."
  ],
  "change_risk_notes": [
    "Incorrect notification settings can lose WooCommerce enquiries or expose order-support details to the wrong recipient."
  ],
  "validation_steps": [
    "Confirm updated notification settings.",
    "Run approved test submission only after permission.",
    "Confirm admin and user notification receipt if scoped."
  ],
  "rollback_notes": [
    "Record current notification settings before changes.",
    "Restore previous recipients and From/Reply-To values if delivery fails."
  ],
  "suggested_configuration_prompt": "Use woocommerce-gravity-forms-configuration to verify current state and prepare a remediation change plan for findings GF-001 and GF-002. Do not apply changes until approved."
}
```
