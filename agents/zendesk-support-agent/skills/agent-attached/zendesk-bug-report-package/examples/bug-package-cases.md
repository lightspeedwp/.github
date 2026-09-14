# Bug package examples

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

These examples are anonymised and synthetic. Do not treat them as real Zendesk evidence.

## 1. Strong bug-package case with clear reproduction detail

### Input summary

Ticket says an admin at Example Retail cannot save product inventory after upgrading plugin version 4.2.1. Support reproduced on staging using the customer's steps. Error appears in browser console. Clearing cache does not help.

### Output pattern

```markdown
# Bug package: inventory save fails after plugin 4.2.1 update

## Readiness
ready

Reason: support reproduced the behaviour on staging with clear steps, environment details, and a console error. Root cause is not confirmed.

## Problem statement
An admin user cannot save product inventory updates after upgrading to plugin 4.2.1. Support reproduced the save failure on staging using the customer's steps.

## Affected context
- Ticket/source: Zendesk ticket supplied by user
- Requester/account: Example Retail admin
- Product/surface: product inventory editor
- Environment: staging; plugin 4.2.1; browser/version supplied in ticket
- Frequency/scope: confirmed once on staging; production scope unknown

## Expected behaviour
- Inventory quantity should save and persist after clicking Save.
- Source/confidence: documented/product expectation; exact docs not reviewed.

## Actual behaviour
- Confirmed: support observed save failure on staging.
- Support-observed: console error appeared during reproduction.
- User-reported: customer says the issue started after upgrading to 4.2.1.
- Inferred: upgrade timing may be relevant, but the release is not confirmed as cause.

## Reproduction clues or steps
1. Log in as admin.
2. Open Products -> Inventory.
3. Change quantity and click Save.
4. Page shows a save failure and the value does not persist.

Missing reproduction detail: production confirmation, whether other roles are affected, server logs around the failed save.

## Recommended next action
Hand off to engineering/product.

Exact ask for recipient: confirm whether plugin 4.2.1 can cause inventory save failures in this editor path and advise a safe workaround or fix path.

## Caution notes
- Do not claim plugin 4.2.1 caused the issue yet.
- Do not claim multiple customers are affected without linked evidence.
```

## 2. Weak evidence case that should request more detail first

### Input summary

Customer writes: "The dashboard is broken again. Please fix it." No screenshot, browser, user role, steps, account context, or timestamp.

### Output pattern

```markdown
## Readiness
not ready

Reason: the report is too vague to identify the surface, actual behaviour, environment, reproduction path, or impact.

## Recommended next action
Request more reproduction detail before creating a bug package.

Recommended destination/skill: `zendesk-triage-router` for first-pass routing, or `zendesk-draft-response` if the user wants customer-facing wording.

Minimum evidence request:
- Which dashboard/page is affected?
- What exact action did the customer take?
- What happened versus what they expected?
- Screenshot or short screen recording.
- Browser/device, user role, timestamp, and whether the issue happens for other users.

Caution: do not describe this as a confirmed bug yet.
```

## 3. Bug-shaped issue that should route to escalation instead

### Input summary

A payment flow is failing for a strategic account during a launch campaign. The customer says they are losing orders, has executive visibility, and needs immediate intervention. There is a screenshot and one failed checkout timestamp, but reproduction is incomplete.

### Routing result

```markdown
This should route to `zendesk-customer-escalation` as the primary workflow. The dominant need is urgent cross-functional intervention and customer risk, not only defect packaging.

Use this bug package as supporting evidence only:
- Confirmed: screenshot of checkout failure and one timestamp.
- User-reported: customer says orders are being lost during launch campaign.
- Missing: payment gateway logs, affected order count, reproduction steps, environment details.

Recommended next action: prepare an escalation brief with the exact ask for engineering/payment owner, then collect reproduction and logs in parallel.
```

## 4. Product behaviour unclear; package must stay conservative

### Input summary

Customer reports that exports do not include archived records. There is no documentation confirming whether archived records should be included. Support can reproduce the export excluding archived records.

### Output pattern

```markdown
## Readiness
partially ready

Reason: support confirmed the current behaviour, but expected behaviour is unclear and may be product design rather than a defect.

## Problem statement
Exports currently exclude archived records. The customer expects archived records to be included, but product documentation confirming the intended behaviour has not been found.

## Expected behaviour
- Unknown. Customer expects archived records in exports, but this is not yet confirmed as intended product behaviour.
- Source/confidence: user expectation.

## Actual behaviour
- Confirmed: support reproduced that archived records are excluded from export output.
- User-reported: customer says this makes compliance reporting incomplete.
- Inferred: product clarification is needed before classifying as a defect.

## Recommended next action
Hand off to product for expected-behaviour clarification before engineering defect work.

Exact ask: confirm whether archived records should be included in exports, and if not, whether the UI/help text should make that limitation explicit.

Caution: do not call this a bug until expected behaviour is confirmed.
```

## 5. Case that should route away to another Zendesk skill

### Input summary

Customer asks for a refund because a feature does not meet their needs. No malfunction is reported; the issue is policy and customer communication.

### Routing result

```markdown
Route away from `zendesk-bug-report-package`.

Reason: this is refund/policy/customer communication work, not a defect package.

Recommended destination/skill: use the relevant billing/policy workflow if available, or `zendesk-draft-response` if the user needs a customer-facing reply. Use `zendesk-customer-research` if prior commitments or account context matter.
```

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
