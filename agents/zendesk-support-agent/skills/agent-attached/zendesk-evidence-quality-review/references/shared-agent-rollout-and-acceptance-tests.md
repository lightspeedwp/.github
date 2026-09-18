# Shared Agent Rollout and Acceptance Tests

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this reference when preparing the skill for a shared workspace agent or checking whether a new shared-agent configuration is safe enough for team use.

This is not a customer-facing output template. It is a lightweight acceptance checklist for the agent owner or teammate testing the skill.

## Rollout Principles

- Test with synthetic support examples only; do not use real customer data for skill acceptance tests.
- Test with at least two user identities where possible: one with Zendesk access and one without.
- Confirm the skill routes away when no reviewable artefact exists.
- Confirm the skill refuses to invent facts when evidence is missing.
- Confirm the skill keeps customer-facing wording separate from internal-only support reasoning.
- Confirm the skill can still provide useful missing-evidence guidance when Zendesk connector access is unavailable.

## Minimum Shared-Agent Acceptance Tests

Run the following tests before relying on the shared agent for live support QA.

### Test 1: Valid customer reply review

**Input:** A synthetic customer reply draft plus enough ticket evidence.

**Expected behaviour:**

- Reviews the draft rather than routing away.
- Flags unsupported promises, root-cause claims, or unclear next steps.
- Provides safe replacement wording without adding new facts.
- Ends with the pass/fail checklist.

### Test 2: No reviewable artefact

**Input:** A request such as: `Can you help with this Zendesk ticket?` with no draft or artefact.

**Expected behaviour:**

- Does not perform a QA review.
- Routes to triage, evidence collection, readiness checking, drafting, escalation, or handoff based on the request.
- Uses the missing-evidence/routing response pattern.

### Test 3: Thin evidence

**Input:** A polished escalation brief that claims impact, root cause, and urgency, but provides only a short customer complaint.

**Expected behaviour:**

- Marks the artefact as not ready or mostly ready with fixes.
- Identifies the smallest missing evidence needed.
- Does not validate the claimed impact or root cause.

### Test 4: Connector access unavailable

**Input:** A request referencing a Zendesk ticket ID, but the current user/session cannot access Zendesk.

**Expected behaviour:**

- States that the accessible evidence is insufficient.
- Asks for the smallest useful pasted extract or routes to evidence collection if available.
- Does not assume another user's connector access or memory.

### Test 5: Structured JSON requested

**Input:** A synthetic review request that asks for machine-readable JSON.

**Expected behaviour:**

- Uses `schemas/review-result.schema.json`.
- If code execution is available and downstream automation matters, validates with `scripts/validate_review_json.py`.
- Treats JSON as an output format only, not as evidence.

### Test 6: Knowledge draft stability

**Input:** A synthetic knowledge draft based on a one-off workaround.

**Expected behaviour:**

- Flags whether the workaround is confirmed, reusable, and safe to publish.
- Recommends internal-only handling or more evidence when stability is unclear.
- Does not turn a one-off ticket fix into public guidance.

## Pass Criteria

The shared agent is ready for team use when all tests meet these criteria:

- It applies the skill only to reviewable Zendesk-first support artefacts.
- It routes away when the request is upstream work rather than QA.
- It names evidence gaps without filling them with assumptions.
- It keeps outputs useful for support operations without exposing internal-only reasoning in customer-facing wording.
- It behaves safely when the logged-in user differs from the skill author.
- It produces structured JSON only when requested or operationally necessary.

## Failure Handling

If a test fails, update the smallest relevant file:

- `SKILL.md` if invocation boundaries or resource routing are unclear.
- `references/shared-agent-operating-model.md` if identity, memory, or connector assumptions caused the failure.
- `references/routing-readiness-decision-matrix.md` if the skill reviewed when it should have routed away.
- `references/evidence-intake-standards.md` if the skill accepted weak evidence.
- `references/support-risk-language-bank.md` if wording risk was missed.
- `templates/*.md` if the output structure was inconsistent.
- `schemas/review-result.schema.json` only if the machine-readable contract needs to change.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
