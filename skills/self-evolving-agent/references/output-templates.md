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

## Machine-readable mutation proposal

Use JSON or JSONL when proposals need validation, handoff, comparison, or archive preparation.

```json
{
  "id": "mut-001",
  "type": "evaluation",
  "target": "references/evaluation-pack.md",
  "problem": "Current checks are too manual to reuse consistently.",
  "change": "Add a proposal schema and validator before approved updates are applied.",
  "evidence_quality": "inferred",
  "expected_benefit": "Improves repeatability and review quality for future mutation batches.",
  "risk_level": "low",
  "evaluation": {
    "method": "script",
    "command": "python scripts/validate_mutation_proposals.py --input mutation-proposals.jsonl"
  },
  "rollback": "Remove the proposal schema reference and validator script.",
  "verdict": "accept"
}
```

Validate records before applying them:

```bash
python scripts/validate_mutation_proposals.py --input mutation-proposals.jsonl
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


## Mutation decision record

```markdown
## Mutation decision: [id]

- Version: [new/proposed version]
- Parent: [previous version/source]
- Date: [YYYY-MM-DD]
- Owner: [person/team/unknown]
- Type: [taxonomy label]
- Approval level: [proposal/local package/connected edit/publication/permission change]
- Risk level: [low/medium/high/blocked]

### Summary
[One sentence]

### Evidence
- [confirmed/inferred/unverified/blocked] [source and note]

### Evaluation
- Method: [check/script/review]
- Result: [passed/partial/failed/not tested]

### Verdict
[accepted/revised/held/rejected]

### Rollback
[Practical restore path]
```

## Variant comparison

```markdown
| Criterion | Variant A | Variant B | Verdict note |
|---|---|---|---|
| Trigger accuracy | [pass/partial/fail] | [pass/partial/fail] | [note] |
| Routing discipline | [pass/partial/fail] | [pass/partial/fail] | [note] |
| Output usefulness | [pass/partial/fail] | [pass/partial/fail] | [note] |
| Safety boundaries | [pass/partial/fail] | [pass/partial/fail] | [note] |
| Maintainability | [pass/partial/fail] | [pass/partial/fail] | [note] |

Recommended variant: [A/B/revise both/hold]
Reason: [brief evidence-backed reason]
```

## Improvement backlog

```markdown
# Improvement backlog: [artefact]

## 3-point summary
- Value: [best remaining ready opportunity]
- Risk: [main reason not to keep adding instructions]
- Next step: [apply a bounded batch / test current version / gather feedback]

| ID | Status | Type | Target | Summary | Evidence quality | Risk | Evaluation |
|---|---|---|---|---|---|---|---|
| evo-backlog-001 | ready | evaluation | references/evaluation-pack.md | [change] | confirmed | low | [check] |

## Pause recommendation
[Use when no high-value ready candidates remain.]
```

## Quality gate report

```markdown
# Quality gate report: [artefact/version]

- Structure: passed / partial / failed
- Instruction quality: passed / partial / failed
- Safety boundaries: passed / partial / failed
- Script checks: passed / partial / failed
- Packaging: passed / partial / failed

## Commands run
- `[command]` → [result]

## Issues found
- [error/warning/none]

## Not tested
- [item and reason]

## Rollback
- [restore package/version/path]
```
