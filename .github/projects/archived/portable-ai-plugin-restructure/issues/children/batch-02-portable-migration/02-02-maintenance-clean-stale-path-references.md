---
name: "Maintenance"
about: "Propose routine hygiene, dependency bumps, CI updates, or other maintenance tasks"
title: "[Maintenance] Clean stale path references before migration"
labels: [status:needs-triage, priority:normal, type:maintenance]
github_issue: "https://github.com/lightspeedwp/.github/issues/294"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Maintenance / Chore Summary

Fix known stale references so the migration starts from a less confusing
baseline.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Steps / Checklist

- [ ] Resolve references to missing `.github/instructions/_index.instructions.md`.
- [ ] Resolve references to `.github/automation/labels.yml`.
- [ ] Resolve `docs/HUSKY-PRECOMMITS.md` vs `docs/HUSKY_PRECOMMITS.md`.
- [ ] Resolve stale `GEMINI.md`, `CLAUDE.md`, `chatmodes`, and `collections` references.
- [ ] Remove tracked zero-byte macOS `Icon` metadata files if not required.
- [ ] Documentation and changelog updated if needed.
- [ ] PR uses correct branch prefix `maintenance/` or `chore/`.

## Acceptance Criteria

- [ ] Known stale references from the PRD appendix are fixed or documented as intentionally deferred.
- [ ] Link audit shows no new broken active links from these changes.
- [ ] PR uses correct branch prefix `maintenance/` or `chore/`.
- [ ] Approved by at least one maintainer.

## Additional Context

Keep this issue focused on cleanup. Do not move portable AI assets here.

## Definition of Ready (DoR)

- [ ] Task/goal described and scoped.
- [ ] Steps/checklist listed.
- [ ] Acceptance criteria listed.
- [ ] Estimate added if applicable.

## Definition of Done (DoD)

- [ ] Task completed and documented.
- [ ] Documentation/changelog updated if needed.
- [ ] PR uses correct branch prefix `maintenance/` or `chore/`.
- [ ] Approved by maintainer.
