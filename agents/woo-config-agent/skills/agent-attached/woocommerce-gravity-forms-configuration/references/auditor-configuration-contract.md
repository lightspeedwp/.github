# WooCommerce Gravity Forms Auditor -> Configuration Contract

## Purpose

Use this contract when `woocommerce-gravity-forms-auditor` identifies actionable Gravity Forms findings that require approved remediation by `woocommerce-gravity-forms-configuration`.

The auditor skill produces the handoff. The configuration skill accepts the handoff as evidence input, verifies the current site state, prepares a change plan, seeks approval where required, applies only approved changes, and reports validation results.

## Boundary rules

### Auditor responsibility

The auditor must:
- Inspect read-only evidence only.
- Classify findings by severity, confidence, priority, effort, owner, and handoff need.
- Produce a configuration handoff for actionable fixes.
- Avoid test submissions, edits, activation/deactivation, settings changes, entry exposure, logging changes, or secret exposure.
- Label recommendations as `Platform requirement`, `LightSpeed recommendation`, `Client decision`, or `Missing evidence`.

The auditor must not:
- Perform configuration changes.
- Treat MCP write access as permission.
- Infer missing operational, legal, payment, privacy, or client approval decisions.

### Configuration responsibility

The configuration skill must:
- Treat the auditor handoff as intake evidence, not approval.
- Verify current site state before planning changes.
- Preserve the original finding IDs.
- Identify missing required fields as readiness gaps.
- Produce a reversible change plan before write operations.
- Request approval for production-impacting, high-risk, payment, user-registration, privacy, retention, webhook, file-upload, notification overwrite, feed overwrite, cache, logging, or analytics changes.
- Validate after change and report results against the source finding IDs.

The configuration skill must not:
- Re-run a full audit.
- Produce formal audit reports, scorecards, or client-safe audit summaries.
- Apply changes when evidence or approval is missing.
- Overwrite settings without showing before/after intent.

## Handoff packet

Every auditor-to-configuration handoff must include:

| Field | Required | Description |
|---|---:|---|
| `contract_version` | Yes | Contract version, starting with `1.0`. |
| `handoff_id` | Yes | Stable ID for this handoff packet. |
| `handoff_title` | Yes | Short human-readable remediation title. |
| `source_audit` | Yes | Audit name/date/source or report reference. |
| `source_skill` | Yes | Usually `woocommerce-gravity-forms-auditor`. |
| `target_skill` | Yes | Usually `woocommerce-gravity-forms-configuration`. |
| `site_url` | Yes | Site being audited/configured. |
| `environment` | Yes | Production, staging, local, or unknown. |
| `findings_included` | Yes | List of finding IDs included in this handoff. |
| `affected_items` | Yes | Site/form/page/add-on/feed/notification/confirmation affected. |
| `confirmed_evidence` | Yes | Evidence summary with confidence. |
| `evidence_gaps` | Yes | Missing or unverified evidence. |
| `risk_level` | Yes | Blocker, High, Medium, Low, or Info. |
| `priority_group` | Yes | Immediate, Next, or Later. |
| `recommendation_label` | Yes | Platform requirement, LightSpeed recommendation, Client decision, or Missing evidence. |
| `proposed_remediation` | Yes | What should change, in implementation-neutral terms. |
| `required_capabilities` | Yes | Read/write MCP capabilities or manual access needed. |
| `required_addons_or_services` | No | Gravity Forms add-ons, SMTP, DNS, CRM, payment gateway, etc. |
| `approval_requirements` | Yes | Who must approve and why. |
| `change_risk_notes` | Yes | Production, privacy, payment, user, feed, notification, cache, or rollback risk. |
| `validation_steps` | Yes | Checks configuration must run after change. |
| `rollback_notes` | Yes | How to undo or recover. |
| `client_safe_summary` | No | Optional plain-language summary for client use. |
| `suggested_configuration_prompt` | Yes | Prompt to start the configuration skill safely. |

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
   - Preserve IDs and affected items.
3. `Verified current state`
   - What was confirmed through MCP/export/screenshots/manual evidence.
4. `Readiness gaps`
   - Missing evidence or approvals.
5. `Proposed change plan`
   - Before/after intent, affected settings, risk, owner, approval needed.
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

"Use `woocommerce-gravity-forms-configuration` to prepare a remediation plan for the attached auditor handoff. Treat the handoff as evidence, verify current site state first, preserve finding IDs, do not make changes until the change plan and approval requirements are confirmed, and return validation steps mapped to the original findings."
