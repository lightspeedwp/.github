---
name: "Maintenance"
about: "Propose routine hygiene, dependency bumps, CI updates, or other maintenance tasks"
title: "[Maintenance] Fix invalid JSON schema syntax before validator reset"
labels: [status:needs-triage, priority:important, type:maintenance, area:ci]
github_issue: "https://github.com/lightspeedwp/.github/issues/311"
github_parent: "https://github.com/lightspeedwp/.github/issues/285"
---

## Maintenance / Chore Summary

Fix invalid JSON syntax in active schema files, especially JavaScript-style
comments in `project-fields.schema.json`.

Parent epic: #285 (<https://github.com/lightspeedwp/.github/issues/285>).

## Steps / Checklist

- [ ] Identify schema files that fail strict JSON parsing.
- [ ] Remove comments or convert them to valid schema descriptions.
- [ ] Confirm schema files remain valid JSON.
- [ ] Documentation and changelog updated if needed.
- [ ] PR uses correct branch prefix `maintenance/` or `chore/`.

## Acceptance Criteria

- [ ] Active schema files parse as valid JSON.
- [ ] `validate:json:schemas` or replacement read-only check no longer fails on syntax.
- [ ] No schema meaning is lost without documentation.
- [ ] Approved by at least one maintainer.

## Additional Context

This issue fixes content syntax only. It does not redesign the validation
system.

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
