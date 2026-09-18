# Source Priorities

## Priority order

1. User-provided files and explicit instructions
2. Current agent-creator SKILL.md
3. Approved LightSpeed references in this pack
4. Connected internal sources explicitly authorised for the task
5. Current public web sources when freshness is required
6. Model knowledge for stable background only

## Conflict handling

Prefer the highest-priority current source. If trusted sources conflict, flag the conflict and require human review.

## Validator

Checked by `scripts/validate-source-priority-consistency.py`.
