---
name: "🧩 Compatibility"
about: "Track browser/device/WordPress/plugin compatibility issues."
title: "[Compatibility] <Brief summary>"
labels: [type:compat, area:compatibility, status:needs-testing]
assignees: []
projects: []
milestone: ''
type: compat
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - .github/AUTOMATION_GOVERNANCE.md
  - .github/PR_LABELS.md
  - .github/SAVED_REPLIES.md
  - .github/PROJECT_META.md
  - .github/labeler.yml
  - .github/labels.yml
  - .github/issue-types.yml
---

<!--
Thank you for reporting a compatibility issue!
Please complete all sections for clarity and automation.
-->

## Compatibility Summary

<!--
Describe the issue, affected browsers/devices/plugins/WordPress versions.
-->

## Steps to Reproduce

<!--
List step-by-step instructions to reproduce the compatibility issue.
-->

## Expected Behavior

<!--
Describe the expected, compatible behavior.
-->

## Environment

<!--
List all relevant environment details (e.g., device, browser, OS, WP version, plugins).
-->

## Screenshots / Logs

<!--
Add relevant screenshots, logs, or code snippets.
-->

## Acceptance Criteria

- [ ] Issue is reproducible and documented
- [ ] Compatible behavior confirmed on affected platforms
- [ ] No adverse impact on other platforms
- [ ] Documentation/changelog updated if needed
- [ ] PR uses correct branch prefix (compat/)
- [ ] Approved by at least one maintainer

## Additional Context

<!--
Add any other context, related issues, references, or docs.
-->

## References

- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)
- [Automation Governance](.github/AUTOMATION_GOVERNANCE.md)
- [PR Labels](.github/PR_LABELS.md)
- [Saved Replies](.github/SAVED_REPLIES.md)
- [Project Meta](.github/PROJECT_META.md)
- [Labeler Config](.github/labeler.yml)
- [Labels](.github/labels.yml)
- [Issue Types](.github/issue-types.yml)

---

### Definition of Ready (DoR)

- [ ] Compatibility issue/context described
- [ ] Steps to reproduce and environment details provided
- [ ] Acceptance criteria listed
- [ ] Estimate added (if applicable)

### Definition of Done (DoD)

- [ ] Issue resolved and verified on affected platforms
- [ ] Documentation/changelog updated
- [ ] PR uses correct branch prefix (compat/)
- [ ] Approved by at least one maintainer

---

## Directions & Next Steps

- Complete all sections and context above.
- For related PRs, use the branch prefix `compat/` as per [Branching Strategy](../AUTOMATION_GOVERNANCE.md).
- Reference this issue in your PR using keywords like `fixes #{issue_number}`.
- Tag a maintainer for review or triage as needed.
- See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
- For automation, labels, and issue types, see [AUTOMATION_GOVERNANCE.md](../AUTOMATION_GOVERNANCE.md).
