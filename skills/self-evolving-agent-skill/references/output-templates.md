# Output Templates

Use these templates when the user asks for a structured review, evolution proposal, or changelog.

## Quick skill improvement audit

```markdown
# Quick improvement audit: [artefact]

## 3-point summary
- Value: [highest-value improvement]
- Risk: [main regression, safety, or scope risk]
- Next step: [recommended mutation or decision]

## Current baseline
- [3-7 bullets on current structure, purpose, strengths, and known gaps]

## Improvement opportunities
| Priority | Mutation type | Target | Change | Expected value | Risk | Evidence quality |
|---:|---|---|---|---|---|---|
| 1 | [trigger/workflow/output/etc.] | [file/section] | [change] | [benefit] | [low/medium/high] | [confirmed/inferred/etc.] |

## Recommended decision
[accept/revise/hold/reject one mutation or a tightly related set]

## Do not apply yet
State that changes are not applied unless the user explicitly asks to proceed.
```

## Evolution brief

```markdown
# Evolution brief: [artefact]

## 3-point summary
- Value: [main improvement opportunity]
- Risk: [main safety or regression risk]
- Next step: [recommended action]

## Current baseline
- Version/source: [details]
- Purpose: [what it is meant to do]
- Known strengths: [bullets]
- Known gaps: [bullets]

## Improvement pressure
Primary pressure: [trigger accuracy/output quality/etc.]
Evidence: [source or user feedback]

## Recommended mutation
[Concise description]

## Evaluation plan
- Example/regression 1: [check]
- Example/regression 2: [check]
- Safety check: [check]

## Decision needed
[accept/revise/hold/reject, with reason]
```

## Candidate mutation table

```markdown
| ID | Type | Target | Change | Expected value | Risk | Evaluation | Verdict |
|---|---|---|---|---|---|---|---|
| mut-001 | workflow | SKILL.md > Workflow | [change] | [benefit] | [risk] | [test/check] | [accept/revise/hold/reject] |
```

## Changelog entry

```markdown
## [version] - YYYY-MM-DD

### Changed
- [mutation type] [summary of accepted change]

### Evidence
- [source or feedback]

### Evaluation
- [test/check performed and result]

### Safety and rollback
- Risk level: [low/medium/high]
- Rollback: [how to restore prior state]
```

## Review verdict

```markdown
Verdict: [accept / revise / hold / reject]

Reason: [one paragraph]

Required fixes before acceptance:
1. [fix]
2. [fix]

Regression checks:
- [pass/fail/not tested] [check]
- [pass/fail/not tested] [check]
```

## Skill archive register

```markdown
| Version | Parent | Date | Mutation type | Evidence | Evaluation | Verdict | Rollback |
|---|---|---|---|---|---|---|---|
| 1.1.0 | 1.0.0 | YYYY-MM-DD | workflow | [source] | [result] | accepted | [path/version] |
```
