---
name: "🔧 Chore"
about: "Template for Chore issues"
title: "chore: {scope} - {short description}"
labels: ["type:chore", "status:needs-triage", "priority:minor", "area:core"]
recommended_branch: "chore/"
file_type: issue-template
---

<!--
Use this template for small housekeeping tasks that do not fit the Code Refactor or Maintenance templates:
label hygiene, repo/settings tweaks, file moves, documentation clean-ups, minor non-functional changes.
-->

## Chore Summary

<!-- Describe the housekeeping task. What needs to be cleaned up, moved, or tidied? -->

## Linked Stories/Tasks/PRs

<!--
List or link related stories, features, tasks, or sub-issues.
Use GitHub issue numbers (e.g., #12, #13).

Related epic: {related_epic}
Related issues: {related_issues}
Related pull requests: {related_pull_requests}

-->

## Milestones & Timeline

<!--
Key dates, releases, or phases for this chore. Include any relevant deadlines or milestones.
-->

## Scope / Affected Areas

<!-- List the files, labels, settings, or areas affected. -->

## Steps / Checklist

<!-- List any steps or checklist items for completion. Use checkboxes. -->

- [ ] Task is clearly defined and actionable
- [ ] Does not fit the Code Refactor or Maintenance templates
- [ ] Documentation updated if affected
- [ ] PR uses correct branch prefix (chore/)
- [ ] PR description updated with relevant details
- [ ] Changelog entry prepared for PR (if applicable)
- [ ] Labels/types match org standards

## Acceptance Criteria

<!-- Did the task achieve its intended outcome? Focus on results, not process. -->

- [ ] Task completed and verified in the affected areas
- [ ] No regressions introduced

## Additional Context

<!-- Add any other context, links, related issues, or dependencies. -->

---

## Definition of Ready (DoR)

- [ ] Task/goal described and scoped
- [ ] Confirms it does not fit the Code Refactor or Maintenance templates
- [ ] Acceptance criteria listed
- [ ] Estimate added (if applicable)

## Definition of Done (DoD)

- [ ] Affected files, labels, or settings updated and documented
- [ ] PR uses correct branch prefix (chore/)
- [ ] Branch deleted after merge
- [ ] Approved by at least one maintainer
- [ ] Issue is verified as completed
- [ ] Documentation/changelog updated if needed
- [ ] Linked issue(s) updated with latest status and closed after merge,
- [ ] The related epic should not be closed, instead updated with a comment to reflect the closed issue

---
