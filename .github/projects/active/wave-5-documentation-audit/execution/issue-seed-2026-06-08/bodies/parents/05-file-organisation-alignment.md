## Overview

Audit repository file placement against `CLAUDE.md` boundaries and organisation standards, then define migration actions for misaligned assets.

## In-Scope

- Compare current placement with declared boundaries for `.github/`, root-level portable assets, and docs locations
- Identify misplaced agents/scripts/.schemas/docs assets
- Produce migration, validation, and rollback plans

## Out-of-Scope

- Executing all migrations in this parent issue
- Refactors that do not affect placement/compliance

## Current Problems

1. Legacy and current structures coexist in some areas.
2. Reusable vs GitHub-native boundaries are not consistently enforced.
3. Migration state is not fully documented.

## Acceptance Criteria

- [ ] Current vs expected placement map completed
- [ ] Misalignments documented with impact assessment
- [ ] Migration plan created with validation and rollback steps

## Deliverables

- Placement audit matrix
- Migration status report
- Migration execution plan

## Related Files

- `CLAUDE.md`
- `.github/`
- `agents/`
- `scripts/`
- `.schemas/`
- `workflows/`
- `instructions/`
