---
name: "⚡ Performance"
about: "Report performance-related issues (speed, efficiency, resource usage) or propose optimizations."
title: "[Performance] <Short summary>"
labels: [type:performance, status:needs-triage, priority:normal, area:performance]
assignees: []
projects: []
milestone: ''
file_type: performance
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
Thank you for reporting a performance issue!
Please fill in as much of the template below as you can.
-->

## Describe the performance issue

<!--
A clear and concise description of the performance problem.
What is slow, laggy, or resource-intensive?
Are there specific actions, screens, plugins, or files affected?
-->

## Steps to reproduce the issue

<!--
Provide step-by-step instructions to reproduce the performance problem.
For example:
1. Go to '...'
2. Execute '...'
3. Monitor performance in '...'
-->

## Expected behavior

<!--
Describe what the expected performance should be.
What is the benchmark or target (e.g., load time, CPU usage)?
-->

## Screenshots or logs

<!--
Add relevant files, screenshots, error logs, or console output.
Paste or attach evidence of the issue if possible.
-->

## Environment

<!--
List all relevant environment details.
- OS: [e.g., Windows 10, macOS Big Sur]
- WordPress Version: [e.g. 6.4]
- PHP Version: [e.g. 8.1]
- Hosting Provider: [e.g. SiteGround, WP Engine, etc.]
- Other relevant details (e.g. traffic spikes, plugins, cache, CDN, memory, etc.)
-->

## Acceptance Criteria

<!--
List requirements for completion and verification.
Include benchmarks, tests, documentation, changelog, etc.
-->

- [ ] Performance issue is reproducible and clearly documented
- [ ] Performance meets expected benchmarks after fix
- [ ] No adverse impact on other functionality
- [ ] Documentation updated if needed
- [ ] Changelog entry prepared for PR if resolved
- [ ] PR uses correct branch prefix (perf/)
- [ ] Automated performance tests added/updated if relevant

## Additional Context

<!--
Add any other context, related issues, links, screenshots, diagrams, or references.
Are there deadlines, business impact, or related milestones?
Use correct branch prefix (perf/) for any PR.
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
Checklist items to ensure the performance issue is ready for work.
-->

- [ ] Performance issue and reproduction steps clear and well-defined
- [ ] Related logs/screenshots provided
- [ ] Acceptance criteria listed
- [ ] Estimate added (if relevant)
- [ ] Milestone or release assigned (if applicable)

### Definition of Done (DoD)

<!--
Checklist items to ensure the fix/update is complete and actionable.
-->

- [ ] Issue fixed and verified against benchmarks
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation updated (if needed)
- [ ] Automated performance tests added/updated (if relevant)
- [ ] PR uses correct branch prefix (perf/)
- [ ] No adverse impact on other functionality

---

## Directions & Next Steps

<!--
Instructions for contributors and maintainers.
-->

- Double-check all details, steps to reproduce, benchmarks, and references above.
- For any related PR, use the branch prefix `perf/` (see [Branching Strategy](../AUTOMATION_GOVERNANCE.md)).
- Reference this issue in your PR using keywords like `fixes #{issue_number}` for auto-closing.
- Tag a maintainer for review or triage if needed.
- See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
- For automation, labels, and issue types, review [AUTOMATION_GOVERNANCE.md](../AUTOMATION_GOVERNANCE.md).
