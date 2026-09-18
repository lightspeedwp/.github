# Output contracts

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
