---
name: "🛠️ Dependency Update"
about: "Template for Dependency Update issues"
title: "dependency: {scope} - {short description}"
labels: ["type:dependency", "status:needs-triage", "priority:normal", "area:core", "meta:needs-changelog"]
recommended_branch: "deps/"
file_type: issue-template
---

## Dependency Update Summary

<!-- Describe the dependency task, update, or hygiene item. Provide any additional context or background information about the dependency task. -->

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

## Maintenance summary

<!-- Maintenance summary -->

## Impact assessment

<!-- Impact assessment -->

## Test scope

<!-- Test scope -->

## Steps / Checklist

<!-- Steps or checklist for completing the dependency update task -->

## Acceptance Criteria

- [ ] Task completed and documented
- [ ] Documentation/changelog updated if needed
- [ ] PR uses correct branch prefix (deps/)
- [ ] PR description updated with relevant details
- [ ] Changelog entry prepared for PR (if applicable)
- [ ] Labels/types match org standards

## Additional Context

<!-- Add any other context, dependencies, or related issues. -->

---

## Definition of Ready (DoR)

- [ ] Task/goal described and scoped
- [ ] Steps/checklist listed
- [ ] Acceptance criteria listed
- [ ] Estimate added (if applicable)

## Definition of Done (DoD)

- [ ] Issue is fixed and tested
- [ ] Task completed and documented
- [ ] Documentation/changelog updated if needed
- [ ] PR uses correct branch prefix (deps/)
- [ ] PR uses the correct PR template based on `type:dependency` PR label or linked issue type or linked issue `type:dependency` label
- [ ] Branch deleted after merge
- [ ] Linked issue(s) updated with latest status and closed after merge,
- [ ] The related epic should not be closed, instead updated with a comment to reflect the closed issue

---
