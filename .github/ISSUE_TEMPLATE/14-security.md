---
name: "🔒 Security"
about: "Template for Security issues"
title: "security: {scope} - {short description}"
labels: ["type:security", "status:needs-triage", "priority:critical", "area:core", "meta:needs-changelog"]
recommended_branch: "security/"
file_type: issue-template
---

<!--
Thank you for reporting a security issue or proposing a security enhancement!
Please complete all sections for review, automation, and compliance.
-->

## Security Summary

<!--
Describe the vulnerability, improvement, or compliance requirement.
Include severity, impact, and context.
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
Key dates, releases, or phases for this security issue. Include any relevant deadlines or milestones.
-->

## Steps to Reproduce (if applicable)

<!--
List step-by-step instructions to reproduce the issue, if reporting a vulnerability.
-->

## Expected Behavior

<!--
Describe the secure or compliant behavior expected.
-->

## Environment

<!--
List relevant environment details (e.g., versions, plugins, hosting, config).
-->

## Screenshots / Evidence

<!--
Add screenshots, logs, or code snippets if helpful.
-->

## Acceptance Criteria

- [ ] Issue is reproducible and clearly documented
- [ ] Security improvement or fix is verified
- [ ] No adverse impact on other functionality
- [ ] Documentation/changelog updated if needed
- [ ] PR uses correct branch prefix (security/)
- [ ] PR description updated with relevant details
- [ ] Changelog entry prepared for PR (if applicable)
- [ ] Labels/types match org standards

## Additional Context

<!--
Add any other context, related issues, compliance docs, or references.
-->

---

## Definition of Ready (DoR)

- [ ] Security issue/context described
- [ ] Steps to reproduce, evidence, or impact provided
- [ ] Acceptance criteria listed
- [ ] Estimate added (if applicable)

## Definition of Done (DoD)

- [ ] Fix or improvement implemented and verified
- [ ] Documentation/changelog updated
- [ ] PR uses correct branch prefix (security/)
- [ ] Approved by at least one maintainer
- [ ] Security: no XSS, SQL injection, or other [OWASP Top 10](https://owasp.org/www-project-top-ten/) vulnerabilities introduced
- [ ] Branch deleted after merge
- [ ] Linked issue(s) updated with latest status and closed after merge,
- [ ] The related epic should not be closed, instead updated with a comment to reflect the closed issue

---
