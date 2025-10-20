---
name: "🧪 Testing Proposal"
about: "Propose, create, or refactor Playwright or other automated tests for this repository"
title: "[Test] <Brief description of the new, updated, or refactored test>"
labels: [status:needs-triage, priority:normal, type:test, area:testing]
assignees: []
projects: []
milestone: ''
type: test
references:
  - CONTRIBUTING.md
  - ISSUE_TYPES.md
  - PR_LABELS.md
  - AUTOMATION_GOVERNANCE.md
  - LightSpeed General Instructions
  - Coding Standards
  - HTML Templates
  - Pattern Development
  - PHP Block Instructions
  - Theme JSON
---

<!--
Thank you for proposing or updating automated tests!
Please complete all sections for review and automation.
-->

## Summary

<!--
Describe the purpose, scope, and workflow/feature/bug this test covers.
Specify if it's Playwright, unit, integration, E2E, or other.
-->

## Action

<!--
Indicate if this is a new test or a refactor.
-->
- **Action Type:** ☐ Create ☐ Refactor (select one)
- **Target File:** `<exact path to file to create or refactor>`

## Proposed Test Content

<!--
Paste or describe the test code, scenarios, and assertions.
Include key selectors, browser/device coverage, and edge cases.
If updating/refactoring, specify the changes and rationale.
-->

## Scope & Applicability

<!--
Define where and how this test will be used.
- Type: Main test file or specific scenario
- Affected Areas: e.g., Checkout flow, Login, UI regressions, API endpoints
- Audience: QA, Developers, Maintainers
-->

## Acceptance Criteria

- [ ] Test covers all required scenarios and edge cases
- [ ] Test is properly structured and follows conventions
- [ ] Change is documented in the project change log
- [ ] Test has been run and passes as expected
- [ ] Changelog entry prepared for PR if user-facing
- [ ] PR uses correct branch prefix (test/ or playwright/)
- [ ] Approved by at least one maintainer

## References

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [LightSpeed General Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
- [Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [HTML Templates](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/html-template.instructions.md)
- [Pattern Development](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/pattern-development.instructions.md)
- [PHP Block Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/php-block.instructions.md)
- [Theme JSON](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/theme-json.instructions.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ISSUE_TYPES.md](../ISSUE_TYPES.md)
- [ISSUE_LABELS.md](../ISSUE_LABELS.md)
- [PR_LABELS.md](../PR_LABELS.md)
- [AUTOMATION_GOVERNANCE.md](../AUTOMATION_GOVERNANCE.md)

---

### Definition of Ready (DoR)
- [ ] Purpose, scope, and audience defined
- [ ] Target file and action type specified
- [ ] Acceptance criteria listed
- [ ] Estimate added (if applicable)

### Definition of Done (DoD)
- [ ] All acceptance criteria met and verified
- [ ] Changelog entry prepared for PR
- [ ] Test passes all required scenarios and environments
- [ ] Documentation updated (if needed)
- [ ] PR uses correct branch prefix (test/ or playwright/)
- [ ] Approved by at least one maintainer

---

## Directions & Next Steps

- Double-check all sections and content above.
- For related PRs, use the branch prefix `test/` or `playwright/` as per [Branching Strategy](../AUTOMATION_GOVERNANCE.md).
- Reference this issue in your PR using keywords like `fixes #{issue_number}`.
- Tag a maintainer for review or triage as needed.
- See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
- For automation, labels, and issue types, see [AUTOMATION_GOVERNANCE.md](../AUTOMATION_GOVERNANCE.md).
