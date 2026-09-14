# Routing output quality checklist

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

Use this checklist when reviewing a route or embedded triage output before giving it to the user, especially in shared agents or ambiguous Zendesk cases.

## Optional lint check

For saved or pasted router responses, run the output linter during package maintenance:

```bash
python3 scripts/lint_router_output.py path/to/router-output.md
```

Use `--strict` when warnings should fail review. See `router-output-lint-examples.md` for synthetic pass/fail examples.

## Must pass

- The output chooses one primary workflow, not a menu of possibilities.
- The optional supporting workflow is either `none` or has a clear sequence after the primary step.
- The output separates the requested deliverable from later possible downstream work.
- The output does not claim Zendesk was checked when only pasted evidence was available.
- The output does not rely on personal Memory, private notes, or another teammate's connector access.
- The output does not route to `ticket-triage`.
- The output does not route to Linear, GitHub, Asana, product planning, or project workflows unless explicitly requested.
- The output names unknowns rather than guessing impact, cause, ownership, duplicate status, or priority.
- The output keeps severity and priority separate.
- The output describes a plain-language next action when the needed workflow is not attached.

## Routing-specific self-check

Before finalising a routing response, confirm:

1. What is the immediate support job?
2. What is the object of work: one ticket, one case, customer/account history, related tickets, repeated theme, Help Centre gap, or support handoff?
3. What deliverable did the user ask for?
4. Which canonical Zendesk-prefixed workflow owns that deliverable?
5. Is that workflow attached to the parent agent?
6. If not, what plain-language support action should be described instead of using any legacy alias?

## Embedded triage-specific self-check

Before finalising an embedded triage response, confirm:

1. Issue type is one allowed value from `triage-output-schema.yaml`.
2. Severity reflects impact and scope.
3. Priority reflects urgency and response pace.
4. Owner/team is the smallest capable support owner.
5. Duplicate risk is clearly separated from related or pattern risk.
6. Evidence bullets contain confirmed facts only.
7. Unknowns name the smallest missing Zendesk fields or context.
8. Recommended next step is practical and support-operational.

## Bad output patterns

Avoid these:

- "This should go to engineering" when evidence collection or support handoff is still needed.
- "Low priority" because the ticket has little evidence; use `Unknown` when evidence is thin.
- "Duplicate" because complaints sound similar; use duplicate/pattern review unless the underlying cause is confirmed.
- "Use Linear" because the ticket mentions a bug.
- "Ask the customer for everything again" when Zendesk already contains enough evidence for the next step.
- "Route to all relevant skills" instead of selecting the immediate primary workflow.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
