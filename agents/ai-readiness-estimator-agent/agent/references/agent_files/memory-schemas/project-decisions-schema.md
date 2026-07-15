# project-decisions.yaml schema

Use this file for decisions that materially affect later estimates, routing, scope, or handoffs.

## Purpose

Preserve important decisions so later runs can rely on them without rediscovering the same commercial or delivery context.

## Recommended structure

```yaml
decisions:
  - project_key: string
    decision_id: string
    category: base_package | addon | exclusion | routing | commercial | governance | source
    value: string
    decision_status: confirmed | provisional
    rationale: string
    source: string
    updated_at: YYYY-MM-DD
```

## Field guidance

- `decision_id`: unique stable identifier for the decision entry.
- `category`: short classification for filtering and reuse.
- `value`: the decision outcome itself.
- `decision_status`: use `confirmed` only when grounded evidence supports relying on it.
- `rationale`: brief reason the decision was made.
- `source`: where the decision came from.
- `updated_at`: latest grounded update date.

## Save here when

- the decision will likely matter in future estimating or handoff work
- the decision changes routing, scope, exclusions, or confidence

## Do not save here

- guesses presented as final
- open questions that still need resolution
