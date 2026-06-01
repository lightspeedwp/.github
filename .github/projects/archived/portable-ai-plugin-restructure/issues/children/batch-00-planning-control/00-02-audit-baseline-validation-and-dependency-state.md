---
name: "Audit"
about: "Propose, conduct, or document a security, accessibility, code, or process audit."
title: "[Audit] Capture baseline validation, test, and dependency state"
labels: [status:needs-audit, priority:important, area:ci, area:core]
github_issue: "https://github.com/lightspeedwp/.github/issues/287"
github_parent: "https://github.com/lightspeedwp/.github/issues/282"
---

## Audit Summary

Capture the current validation and dependency baseline before restructuring,
including `npm ci`, validators, tests, coverage output, and dependency audit
results.

Parent epic: #282 (<https://github.com/lightspeedwp/.github/issues/282>).

## Audit Checklist / Scope

- [ ] Record current branch and commit.
- [ ] Run or document `npm ci`.
- [ ] Run `npm run validate:agents`.
- [ ] Run `npm run validate:workflows`.
- [ ] Run `npm run validate:json:schemas`.
- [ ] Run `npm test`.
- [ ] Run `npm audit` or capture existing vulnerability count.
- [ ] Note which commands are mutating or noisy.

## Findings / Risks

Known baseline risks: invalid JSON comments in schema files, mutating
validation commands, zero coverage output, and dependency vulnerabilities.

## Remediation Actions

- [ ] Convert findings into validation reset child issues.
- [ ] Keep raw command outputs or summaries in the active project folder.

## Acceptance Criteria

- [ ] Audit scope and checklist completed.
- [ ] Findings and risks documented.
- [ ] Remediation actions assigned and tracked.
- [ ] Documentation/changelog updated if applicable.
- [ ] PR uses correct branch prefix `audit/`.

## Additional Context

This issue should not fix the findings; it records the pre-migration baseline.

### Definition of Ready (DoR)

- [ ] Audit scope, checklist, and goals defined.
- [ ] Areas/components listed.
- [ ] Dependencies and standards mapped.

### Definition of Done (DoD)

- [ ] Audit performed and findings documented.
- [ ] Remediation actions assigned.
- [ ] Documentation/changelog updated if applicable.
- [ ] PR uses correct branch prefix `audit/`.
