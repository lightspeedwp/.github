---
name: "Test Coverage"
about: "Propose, add, or expand tests (unit, integration, E2E)."
title: "[Test Coverage] Fix misleading coverage reporting and noisy import side effects"
labels: [status:needs-triage, priority:normal, type:test]
github_issue: "https://github.com/lightspeedwp/.github/issues/316"
github_parent: "https://github.com/lightspeedwp/.github/issues/285"
---

## Summary

Clean up the test signal for the simplified validation layer by fixing or
documenting zero coverage reporting and noisy import-time side effects.

Parent epic: #285 (<https://github.com/lightspeedwp/.github/issues/285>).

## Action

- **Action Type:** Refactor
- **Target File:** `.jest.config.cjs`, validator tests, or replacement validation test files.

## Proposed Test Content

Add focused tests for the new validators where practical. If coverage remains
out of scope during the reset, document that decision explicitly.

## Scope & Applicability

- Type: unit tests for validation scripts.
- Affected areas: plugin, skill, structure, frontmatter, and link validators.
- Audience: maintainers and CI.

## Acceptance Criteria

- [ ] Test covers all required scenarios and edge cases for new validators.
- [ ] Test is properly structured and follows conventions.
- [ ] Change is documented in the project change log.
- [ ] Test has been run and passes as expected.
- [ ] Coverage output is meaningful or intentionally disabled with rationale.
- [ ] PR uses correct branch prefix `test/`.
- [ ] Approved by at least one maintainer.

### Definition of Ready (DoR)

- [ ] Purpose, scope, and audience defined.
- [ ] Target file and action type specified.
- [ ] Acceptance criteria listed.
- [ ] Estimate added if applicable.

### Definition of Done (DoD)

- [ ] All acceptance criteria met and verified.
- [ ] Changelog entry prepared for PR.
- [ ] Test passes all required scenarios and environments.
- [ ] Documentation updated if needed.
- [ ] PR uses correct branch prefix `test/`.
- [ ] Approved by at least one maintainer.
