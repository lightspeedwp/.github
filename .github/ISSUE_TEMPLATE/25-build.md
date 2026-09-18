---
name: "🏗️ Build"
about: "Template for Build issues"
title: "build: {scope} - {short description}"
labels: ["type:build", "status:needs-triage", "priority:normal", "area:core", "meta:needs-changelog"]
recommended_branch: "build/"
file_type: issue-template
---

## Build Summary

<!-- Briefly describe the build change, problem, or improvement. -->

## Linked Stories/Tasks/PRs/Epic

<!--
List or link related stories, features, tasks, or sub-issues.
Use GitHub issue numbers (e.g., #12, #13).

Related epic: {related_epic}
Related issues: {related_issues}
Related pull requests: {related_pull_requests}

-->

## Milestones & Timeline

<!--
Key dates, releases, or phases for this improvement. Include any relevant deadlines or milestones.
-->

## Steps / Checklist

<!-- List key steps, tasks, or requirements for the build    change. -->

- [ ] Task is clearly defined and actionable
- [ ] Automation/scripts referenced if applicable
- [ ] Documentation/changelog updated
- [ ] PR uses correct branch prefix (build/)
- [ ] PR description updated with relevant details
- [ ] Changelog entry prepared for PR (if applicable)
- [ ] Labels/types match org standards

## Acceptance Criteria

<!-- List requirements for completion and verification. Use checkboxes. -->

- [ ] Solution implemented and documented
- [ ] Build passes and is stable
- [ ] No regressions in build/deploy processes
- [ ] Branch prefix is correct (build)

## Additional Context

<!-- Add any extra information, links to scripts, configs, or logs. -->

---

## Definition of Ready (DoR)

- [ ] Build goal and scope defined
- [ ] Checklist prepared
- [ ] Estimate added

## Definition of Done (DoD)

- [ ] Issue is fixed and tested
- [ ] All build checklist and acceptance criteria completed
- [ ] Documentation/changelog updated
- [ ] Approved by at least one maintainer
- [ ] PR uses correct branch prefix (build/)
- [ ] PR uses the correct PR template based on `type:build` PR label or linked issue type or linked issue `type:build` label
- [ ] Branch deleted after merge
- [ ] Linked issue(s) updated with latest status and closed after merge,
- [ ] The related epic should not be closed, instead updated with a comment to reflect the closed issue

---
