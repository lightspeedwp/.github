# QA Rubric

Score each validation output from 1 to 5 against these checks.

| Area | Check | Pass condition |
|---|---|---|
| Trigger fit | Validator is the right skill | The request is about checking or reviewing an asset |
| Standards accuracy | Official WordPress rules are applied first | Findings match the documented asset behavior |
| Severity ordering | Findings are prioritized well | Breaking issues are listed before polish issues |
| Fix quality | Guidance is actionable | Suggested fixes are concrete and minimal |
| Boundary discipline | The validator does not over-generate | Build work is routed to another skill when needed |
| Style scope review | Style outputs are checked at the right level | Block styles stay block-scoped and section styles stay section-scoped |
| Confidence handling | Unknowns are marked | The output does not overclaim certainty |

## Minimum Acceptance Standard

- no invalid asset is marked pass
- no unverified area is presented as confirmed
- no conflict with official WordPress rules is ignored
- findings include a concrete fix or a concrete unanswered question
