---
applyTo: ['.github/workflows/label-*.yml', '**/*.md']
description: "Org-wide labels & issue types; automate labels on PRs only."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Document how LightSpeed applies labels and issue types across repositories and automate labelling for pull requests.

# Strategy
- Maintain a central list of **default labels** (e.g. `bug`, `enhancement`, `documentation`, `priority`, `needs-review`). Apply these manually to issues for triage and signalling.
- Define **issue types** such as `feature request`, `task` and `defect` and use them consistently across projects.
- Avoid auto‑labelling issues; developers or triagers should apply labels based on context.

# Automation for Pull Requests
- Use a GitHub Actions workflow (e.g. `label-pr.yml`) to automatically apply labels to pull requests based on branch names, file paths or commit messages.
- Ensure the workflow only targets PRs (`pull_request` events) and does not run on issues.
- Keep the automation logic simple and maintainable (e.g. map prefixes like `fix/` to the `bug` label).

# References
- https://docs.github.com/en/actions/tutorials/manage-your-work/add-labels-to-issues
