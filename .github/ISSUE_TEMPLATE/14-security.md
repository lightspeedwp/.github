---
name: "🔐 Security"
about: "Report vulnerabilities, security improvements, or compliance requirements"
title: "[Security] <Brief summary of the security issue>"
labels: [type:security, status:needs-triage, priority:critical, area:security]
assignees: []
projects: []
milestone: ''
type: security
references:
  - CONTRIBUTING.md
  - ISSUE_TYPES.md
  - PR_LABELS.md
  - AUTOMATION_GOVERNANCE.md
  - LightSpeed General Instructions
  - Coding Standards
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
- [ ] Approved by at least one maintainer

## Additional Context

<!--
Add any other context, related issues, compliance docs, or references.
-->

## References

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ISSUE_TYPES.md](../ISSUE_TYPES.md)
- [ISSUE_LABELS.md](../ISSUE_LABELS.md)
- [PR_LABELS.md](../PR_LABELS.md)
- [AUTOMATION_GOVERNANCE.md](../AUTOMATION_GOVERNANCE.md)
- [LightSpeed General Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
- [Coding Standards](../instructions/coding-standards.instructions.md)

---

### Definition of Ready (DoR)
- [ ] Security issue/context described
- [ ] Steps to reproduce, evidence, or impact provided
- [ ] Acceptance criteria listed
- [ ] Estimate added (if applicable)

### Definition of Done (DoD)
- [ ] Fix or improvement implemented and verified
- [ ] Documentation/changelog updated
- [ ] PR uses correct branch prefix (security/)
- [ ] Approved by at least one maintainer

---

## Directions & Next Steps

- Double-check all details, steps, and references above.
- For related PRs, use the branch prefix `security/` as per [Branching Strategy](../AUTOMATION_GOVERNANCE.md).
- Reference this issue in your PR using keywords like `fixes #{issue_number}`.
- Tag a maintainer for review or triage as needed.
- See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
- For automation, labels, and issue types, see [AUTOMATION_GOVERNANCE.md](../AUTOMATION_GOVERNANCE.md).
