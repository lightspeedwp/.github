---
name: "🔗 Integration"
about: "Report or propose integration with external plugins, services, or APIs."
title: "[Integration] <Short summary>"
labels: [type:integration, status:needs-triage, priority:normal, area:integration]
assignees: []
projects: []
milestone: ''
type: integration
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
Thank you for reporting an integration issue!
Please fill in as much of the template below as you can.
-->

## Describe the integration issue

<!--
A clear and concise description of the integration issue.
What is not working, or what is failing to connect/work together?
Are there any error messages or failed scenarios?
-->

## Steps to reproduce the issue

<!--
Provide step-by-step instructions to reproduce the integration problem.
For example:
1. Go to '...'
2. Perform '...'
3. Notice the integration issue in '...'
-->

## Expected behavior

<!--
Describe the expected integration or workflow.
What should happen if the integration works correctly?
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
- [ ] PR uses correct branch prefix (fix/ or integration/)
- [ ] Automated tests added/updated if needed

## Additional Context

<!--
Add any other relevant information, external links, screenshots, related issues/PRs, deadlines, blockers, or notes.
For any PR, use correct branch prefix (fix/ or integration/).
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

<!--
Checklist items to ensure the integration issue is ready for work.
-->

- [ ] Integration issue and context are clear and well-defined
- [ ] Steps to reproduce provided
- [ ] Related tools/platforms and versions listed
- [ ] Acceptance criteria listed
- [ ] Estimate added (if relevant)
- [ ] Milestone/release assigned (if applicable)

### Definition of Done (DoD)

<!--
Checklist items to ensure the integration fix/update is complete.
-->

- [ ] Issue is fixed and tested
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation updated (if needed)
- [ ] Automated tests added/updated (if relevant)
- [ ] PR uses correct branch prefix (fix/ or integration/)
- [ ] No adverse impact on other integrations or core functionality

---

## Directions & Next Steps

<!--
Instructions for contributors and maintainers.
-->

- Double-check all sections, details, steps to reproduce, and references above.
- For any related PR, use the branch prefix `fix/` or `integration/` (see [Branching Strategy](../AUTOMATION_GOVERNANCE.md)).
- Reference this issue in your PR using keywords like `fixes #{issue_number}` for auto-closing.
- Tag a maintainer for review or triage if needed.
- See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
- For automation, labels, and issue types, review [AUTOMATION_GOVERNANCE.md](../AUTOMATION_GOVERNANCE.md).
