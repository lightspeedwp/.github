# Mutation Proposal Schema

Use this reference when a user wants mutation proposals that can be reviewed, compared, archived, or validated before any update is applied.

## Purpose

Make proposed skill, prompt, agent, or workflow changes portable and reviewable. A proposal record should be specific enough for another ChatGPT instance or teammate to understand the problem, decide whether the change is safe, and reproduce the evaluation path.

Use this schema before `references/archive-and-versioning.md`: proposals describe possible changes; archive records describe decisions already made.

## Required fields

Each proposal record must include:

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Stable short identifier such as `mut-001`. |
| `type` | string | One mutation taxonomy label from `SKILL.md`. |
| `target` | string | File, section, prompt, script, or workflow affected. |
| `problem` | string | Observed issue or gap. |
| `change` | string | Proposed alteration. |
| `evidence_quality` | string | `confirmed`, `inferred`, `unverified`, or `blocked`. |
| `expected_benefit` | string | Practical value if accepted. |
| `risk_level` | string | `low`, `medium`, `high`, or `blocked`. |
| `evaluation` | string or object | Scenario, checklist, script, or review method. |
| `rollback` | string | How to undo the change. |
| `verdict` | string | `accept`, `revise`, `hold`, or `reject`. |

## Optional fields

Use optional fields only when they improve review quality:

- `source`: user feedback, file, issue, doc, or conversation note.
- `approval_level`: `proposal`, `local_package`, `connected_edit`, `publication`, or `permission_change`.
- `dependencies`: related proposals that must be accepted first.
- `regression_checks`: list of behaviours that must remain intact.
- `notes`: concise caveats that do not belong in operational instructions.

## JSON example

```json
{
  "id": "mut-004",
  "type": "evaluation",
  "target": "references/evaluation-pack.md",
  "problem": "Scenario checks are manual and easy to omit.",
  "change": "Add machine-readable proposal validation before applying changes.",
  "evidence_quality": "inferred",
  "expected_benefit": "Makes future mutation review more repeatable and easier to audit.",
  "risk_level": "low",
  "evaluation": {
    "method": "script",
    "command": "python scripts/validate_mutation_proposals.py --input proposals.jsonl"
  },
  "rollback": "Remove the schema reference and validator script.",
  "verdict": "accept"
}
```

## Review rules

- Do not accept a proposal with `evidence_quality: blocked` unless the block is resolved first.
- Do not apply a proposal with `risk_level: high` unless the user has explicitly approved that risk and the evaluation path is clear.
- Treat `verdict: accept` as a recommendation unless the user has also approved the required action level.
- Keep proposal records separate from raw private notes, secrets, or customer-specific details.
