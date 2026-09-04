---
name: "🧪 Testing/Coverage"
about: "Template for Testing/Coverage issues"
title: "test: {scope}"
labels: ["type:test", "status:needs-triage", "priority:normal", "area:testing", "meta:coverage"]
recommended_branch: "test/"
file_type: issue-template
---

<!--
Thank you for proposing or updating automated tests!
Please complete all sections for review and automation.
-->

## Summary

<!--
Describe the purpose, scope, and workflow/feature/bug this test covers.
Specify if it's unit, integration, or other.
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
- [ ] PR uses correct branch prefix (test/)
- [ ] Approved by at least one maintainer

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
- [ ] PR uses correct branch prefix (test/)
- [ ] Approved by at least one maintainer

---
