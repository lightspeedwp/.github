---
name: "🔗 Refactoring"
about: "Template for Refactoring issues"
title: "refactor: {scope} - {short description}"
labels: ["type:refactor", "status:needs-triage", "priority:normal", "area:core", "meta:needs-changelog"]
recommended_branch: "refactor/"
file_type: issue-template
---

<!--
Thank you for reporting an integration issue!
Please fill in as much of the template below as you can.
-->

## Refactoring Summary

<!-- Provide a brief overview of the refactoring issue, including context, impact, and any relevant background information. -->

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
Key dates, releases, or phases for this refactoring issue. Include any relevant deadlines or milestones.
-->

## Safety Nets

<!-- Safety Nets and Approach -->

## Approach

<!-- Describe the approach taken for the refactoring, including any design decisions, patterns applied, and rationale for changes. -->

## Metrics / Benchmarks (if applicable)

<!-- Metrics and Benchmarks (if applicable) -->

## Verification

<!-- Verification steps -->

## Risk & Rollback

<!-- Risk & Rollback details -->

## Describe the refactoring issue

<!--
A clear and concise description of the refactoring issue.
What is not working, or what is failing to connect/work together?
Are there any error messages or failed scenarios?
-->

## Affected tools/platforms

<!--
List all affected tools, platforms, plugins, APIs, or services.
Include versions if possible.
-->

## Screenshots or logs

<!--
Add relevant files, screenshots, error logs, or console output.
If possible, paste or attach evidence of the issue.
-->

## Acceptance Criteria

<!--
List requirements for completion and verification.
-->

- [ ] Issue is reproducible and clearly documented
- [ ] Integration works as expected after fix
- [ ] No adverse impact on other integrations or core functionality
- [ ] Documentation updated if needed
- [ ] Changelog entry prepared for PR if resolved
- [ ] PR uses correct branch prefix (refactor/)
- [ ] Automated tests added/updated if needed
- [ ] PR description updated with relevant details
- [ ] Changelog entry prepared for PR (if applicable)
- [ ] Labels/types match org standards

## Additional Context

<!--
Add any other relevant information, external links, screenshots, related issues/PRs, deadlines, blockers, or notes.
For any PR, use correct branch prefix (fix/ or integration/).
-->

---

## Definition of Ready (DoR)

<!--
Checklist items to ensure the refactoring issue is ready for work.
-->

- [ ] Refactoring issue and context are clear and well-defined
- [ ] Steps to reproduce provided
- [ ] Related tools/platforms and versions listed
- [ ] Acceptance criteria listed
- [ ] Estimate added (if relevant)
- [ ] Milestone/release assigned (if applicable)
- [ ] Estimate added

## Definition of Done (DoD)

<!--
Checklist items to ensure the refactoring fix/update is complete.
-->

---

### Checklist (Global DoD / PR)

- [ ] All AC met and demonstrated
- [ ] Tests added/updated (unit/E2E as appropriate)
- [ ] Accessibility checklist completed (where relevant):
  - [ ] Semantic HTML and heading order verified
  - [ ] Keyboard navigation and visible focus states verified
  - [ ] ARIA used only where needed
  - [ ] Contrast and non-colour cues reviewed (WCAG 2.2 AA)
- [ ] Docs/readme/changelog updated (if user-facing)
- [ ] Security checklist completed (where relevant):
  - [ ] Untrusted input validated and sanitised
  - [ ] Output escaped for its rendering context
  - [ ] Privileged actions enforce nonce and capability checks
  - [ ] No secrets/sensitive data introduced; OWASP risks reviewed
- [ ] Code/design reviews approved
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation updated (if needed)
- [ ] Automated tests added/updated (if relevant)
- [ ] No adverse impact on other integrations or core functionality
- [ ] Linked issue(s) updated with latest status and closed after merge,
- [ ] PR uses correct branch prefix (refactor/)
- [ ] PR uses the correct PR template based on `type:refactor` PR label or linked issue type or linked issue `type:refactor` label
- [ ] Branch deleted after merge
- [ ] Linked issue(s) updated with latest status and closed after merge,
- [ ] The related epic should not be closed, instead updated with a comment to reflect the closed issue

---
