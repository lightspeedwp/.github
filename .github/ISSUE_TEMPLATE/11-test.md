---
name: "🧪 Testing/Coverage"
about: "Template for Testing/Coverage issues"
title: "test: {scope} - {short description}"
labels: ["type:test", "status:needs-triage", "priority:normal", "area:core", "meta:needs-changelog"]
recommended_branch: "test/"
file_type: issue-template
---

<!--
Thank you for proposing or updating automated tests!
Please complete all sections for review and automation.
-->

## Testing / Coverage Summary

<!--
Describe the purpose, scope, and workflow/feature/bug this test covers.
Specify if it's unit, integration, or other.
-->

## Linked Stories/Tasks/PRs/Epic

<!--
List or link related stories, features, tasks, sub-issues or pull requests.
Use GitHub issue numbers (e.g., #12, #13).

Related epic: {related_epic}
Related issues: {related_issues}
Related pull requests: {related_pull_requests}
-->

## Milestones & Timeline

<!--
Key dates, releases, or phases for this testing/coverage issue. Include any relevant deadlines or milestones.
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
- [ ] PR description updated with relevant details
- [ ] Changelog entry prepared for PR (if applicable)
- [ ] Labels/types match org standards

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
- [ ] Branch deleted after merge
- [ ] Linked issue(s) updated with latest status and closed after merge,
- [ ] The related epic should not be closed, instead updated with a comment to reflect the closed issue

---
