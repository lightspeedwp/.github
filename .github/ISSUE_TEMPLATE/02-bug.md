---
name: "🐛 Bug report"
about: Report a bug to help us improve this WordPress project
title: "[Bug] <Short description>"
labels: [status:needs-triage, priority:normal, type:bug, area:core]
assignees: []
projects: []
milestone: ""
file_type: bug
references:
  - CONTRIBUTING.md
  - ISSUE_TYPES.md
  - PR_LABELS.md
  - AUTOMATION_GOVERNANCE.md
---

<!--
Thank you for reporting a bug!
Please fill in as much of the template below as you can.
-->

## Describe the bug

<!--
A clear and concise description of what the bug is, including symptoms, error messages, or unexpected behavior.
-->

## To Reproduce

<!--
List step-by-step instructions to reproduce the bug.
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error
-->

## Expected behavior

<!--
Describe what you expected to happen instead.
-->

## Screenshots

<!--
If applicable, add screenshots to help explain your problem.
-->

## WordPress Environment

<!--
Provide as much information as possible:
- WordPress Version: [e.g. 6.4]
- PHP Version: [e.g. 8.1]
- Active Theme: [e.g. Twenty Twenty-Four 1.0]
- Other Active Plugins: [list relevant plugins and versions]
- Hosting Provider: [e.g. SiteGround, WP Engine, etc.]
- Site Language: [e.g. en_US]
- Multisite: [Yes/No]
- Any custom code snippets? [Yes/No]
-->

<details>
<summary>Site Health Info (recommended)</summary>
<!-- Copy site info to clipboard and paste details here. -->
</details>

## Device and Browser Info

<!--
Desktop:
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
Smartphone (if applicable):
- Device: [e.g. iPhone 12, Pixel 5]
- OS: [e.g. iOS 17, Android 14]
- Browser: [e.g. Safari, Chrome]
- Version: [e.g. 22]
-->

## Additional Context

<!--
Add any other context, screenshots, code snippets, or references to related issues/PRs.
Use correct branch prefix (fix/) for any related PR.
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

- [ ] Bug is reproducible and clearly described
- [ ] Steps to reproduce written
- [ ] Environment details provided
- [ ] Screenshots/logs included (if possible)
- [ ] Linked to existing issues/PRs (if any)
- [ ] Estimate added (if relevant)
- [ ] Ready for triage

### Definition of Done (DoD)

- [ ] Bug confirmed and reproducible
- [ ] Fix implemented and tested (all supported browsers/devices)
- [ ] Follows [WordPress coding standards](https://github.com/WordPress/wpcs-docs/)
- [ ] Documentation updated (if needed)
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] QA performed
- [ ] No adverse impact on performance or security
- [ ] Linked issue closed

---

## Directions & Next Steps

- Review that all reproduction steps, environment details, and screenshots (if any) are included.
- For any related PR, use the branch prefix `fix/` (see [Branching Strategy](../AUTOMATION_GOVERNANCE.md)).
- Reference this issue in your PR using keywords like `fixes #{issue_number}` for auto-closing.
- Tag a maintainer for review or triage if needed.
- See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md) for submission requirements.
- For automation, labels, and issue types, check [AUTOMATION_GOVERNANCE.md](../AUTOMATION_GOVERNANCE.md).
