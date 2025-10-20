---
name: '🔗 Integration Issue'
about: Report issues related to integrating this WordPress project with other tools or platforms
title: '[Integration] <Short summary>'
labels: [status:needs-triage, priority:normal, type:integration, area:integration]
assignees: []
projects: []
milestone: ''
type: integration
references:
  - CONTRIBUTING.md
  - ISSUE_TYPES.md
  - PR_LABELS.md
  - AUTOMATION_GOVERNANCE.md
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

<!--
Link to org docs, standards, or other relevant resources.
Examples:
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ISSUE_TYPES.md](../ISSUE_TYPES.md)
- [ISSUE_LABELS.md](../ISSUE_LABELS.md)
- [AUTOMATION_GOVERNANCE.md](../AUTOMATION_GOVERNANCE.md)
- [CHANGELOG.md](../CHANGELOG.md)
- [LightSpeed General Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
- [Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [HTML Templates](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/html-template.instructions.md)
- [Pattern Development](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/pattern-development.instructions.md)
- [PHP Block Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/php-block.instructions.md)
- [Theme JSON](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/theme-json.instructions.md)
-->

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
