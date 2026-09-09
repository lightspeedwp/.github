---
name: "🔍 Audit"
about: "Template for Audit issues"
title: "audit: {scope} - {short description}"
labels: ["type:audit", "status:needs-triage", "priority:normal", "area:core", "meta:no-changelog"]
recommended_branch: "audit/"
file_type: issue-template
---

<!--
Thank you for proposing an Audit!
Complete all sections below for clarity, compliance, and tracking.
-->

## Audit Summary

<!--
Describe the scope, goal, and type of audit (e.g., code, security, a11y, process).
-->

## Code Review Summary

<!-- Provide an overview of the code changes, the purpose of the review, and any relevant context or background information. -->

<!-- Describe the code/PR needing review, goals, and checklist. -->

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
Key dates, releases, or phases for this audit. Include any relevant deadlines or milestones.
-->

## Audit Checklist / Scope

<!--
List key items to be reviewed or tested.
Use checkboxes for each item.
-->

- [ ] Scope defined and agreed
- [ ] Areas/components listed
- [ ] Audit tools or standards referenced
- [ ] Risks and findings documented
- [ ] Remediation actions mapped
- [ ] PR description updated with relevant details
- [ ] Changelog entry prepared for PR (if applicable)
- [ ] Labels/types match org standards

## Findings / Risks

<!--
Summarize main audit findings and risks.
-->

## Remediation Actions

<!--
List actions, recommendations, or follow-up tickets.
-->

## Acceptance Criteria

- [ ] Audit scope and checklist completed
- [ ] Findings and risks documented
- [ ] Remediation actions assigned and tracked
- [ ] Documentation/changelog updated (if applicable)
- [ ] PR uses correct branch prefix (audit/)

## Additional Context

<!--
Add links, standards, references, or related issues.
-->

---

### Definition of Ready (DoR)

- [ ] Audit scope, checklist, and goals defined
- [ ] Areas/components listed
- [ ] Dependencies and standards mapped

### Definition of Done (DoD)

- [ ] Audit performed and findings documented
- [ ] Remediation actions assigned
- [ ] Documentation/changelog updated (if applicable)
- [ ] PR uses correct branch prefix (audit/)
- [ ] PR uses the correct PR template based on `type:audit` PR label or linked issue type or linked issue `type:audit` label
- [ ] Branch deleted after merge
- [ ] Linked issue(s) updated with latest status and closed after merge,
- [ ] The related epic should not be closed, instead updated with a comment to reflect the closed issue

---
