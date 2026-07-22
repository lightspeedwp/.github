# Shared Agent Rollout and Acceptance Tests

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
