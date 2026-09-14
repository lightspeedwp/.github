# Output contracts

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

Use these formats when the user has not requested a different structure. Keep outputs evidence-labelled and practical.

## Default LightSpeed opening

For medium or long deliverables, start with three bullets:

```markdown
- Value:
- Risk:
- Next step:
```

Skip this only for very short answers, dense tables where it would add noise, or when the user requested a specific format.

## Fast triage

```markdown
## Fast triage

- Request type:
- Likely route:
- Evidence available:
- Main risk:
- One next action:
- Blocker question, if required:
```

## Audit report

```markdown
# Tour Operator audit report

## 1. Scope and evidence
## 2. Core plugin findings
## 3. Extension findings
## 4. Content model findings
## 5. Wetu/import findings
## 6. Gravity Forms findings
## 7. Yoast/schema findings
## 8. Block theme/template findings
## 9. Risks and gaps
## 10. Recommended next actions
## 11. Memory update candidates
```

## Content-model mapping

```markdown
# Content model mapping

## Scope
## Source confidence
## Confirmed core model
## Extension-facing references
## Relationships and facets
## Taxonomies
## Fields
## Unknowns
## Recommended updates
```

## Schema-readiness report

```markdown
# Schema-readiness report

## Scope
## Yoast dependency status
## Existing schema output
## Candidate mappings
## Field/data gaps
## Dedupe risks
## Google rich-result eligibility notes
## Validation workflow
## Developer handoff recommendation
```

## Acceptance test plan

Load `references/workflows/acceptance-test-planning.md` and `references/outputs/acceptance-criteria-library.md` before drafting detailed test coverage.

```markdown
# Acceptance test plan

## Scope
## Evidence and assumptions
## Affected content types/workflows
## Acceptance criteria
## Test matrix
## Blocked or unverified checks
## Go/no-go notes
```

Minimum QA matrix columns:

| ID | Area | Scenario | Expected result | Evidence required | Status | Notes |
|---|---|---|---|---|---|---|

## Implementation change log

```markdown
# Implementation change log

## Change summary
## Pre-change inspection
## Risk classification
## Change plan
## Changes made or guidance only
## Verification
## Rollback/manual recovery
## Evidence summary
## Handoff note
```

## Issue draft

Load `references/workflows/issue-handoff-workflow.md` and `references/outputs/issue-draft-templates.md` before drafting GitHub, Linear, Asana or internal issue handoffs.

```markdown
# [Area] Action-oriented issue title

## Summary
## Evidence
## Expected behaviour
## Actual behaviour or gap
## Scope
## Risk
## Proposed approach
## Acceptance criteria
## Verification steps
## Rollback or recovery note
## Unknowns / blockers
## Suggested labels
```

## Client-safe summary

Load `references/outputs/client-safe-language.md` before producing a client-facing summary, report, email-ready note or handoff.

```markdown
# Client summary

## What we checked
## What is working
## What needs attention
## Why it matters
## Recommended next steps
## Decisions needed
```

## Internal handoff

```markdown
# Internal handoff

## Site and environment
## Evidence reviewed
## Confirmed state
## Main findings
## Risks
## Technical unknowns
## Exact ask
## Suggested owner
## Verification steps
## Memory update candidates
```

## Content-model update summary

```markdown
# Content-model update summary

## Sources reviewed
## Files changed
## Confirmed additions
## Changed or removed evidence
## Unknowns preserved
## Extension boundaries protected
## Validation results
## Anti-drift test notes
```

## Structured finding register

Use `references/outputs/finding-register.schema.json` when a finding list needs to be copied into a tracker, spreadsheet, JSON handoff, Linear/GitHub issue prep, or repeatable QA register.

Minimum human-readable columns:

| ID | Area | Finding | Evidence label | Severity | Risk | Recommendation | Client-safe wording | Internal notes |
|---|---|---|---|---|---|---|---|---|

Rules:

- Keep client-safe wording separate from internal notes.
- Use `needs-verification` rather than filling gaps with assumptions.
- Use the evidence labels from `references/evidence/evidence-model.md`.
- Do not expose credentials, raw tool dumps, private customer data or unsupported commercial claims.
- Link findings back to content-model files, source files or live evidence whenever possible.

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
