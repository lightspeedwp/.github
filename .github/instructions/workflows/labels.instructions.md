---
title: "Workflow: Labels"
description: "Org-wide labels & issue types; automate labels on PRs only."
version: "v1.0"
apply_to: ".github/workflows/label-*.yml, all repositories"
last_updated: "2025-10-19"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot"
---

# Mission

Document how LightSpeed applies labels and automates labelling for pull requests.

# Strategy

- Maintain a central list of **default labels** (e.g. `bug`, `enhancement`, `documentation`, `priority`, `needs-review`). Apply these manually to issues for triage and signalling.
- Avoid auto‑labelling issues; developers or triagers should apply labels based on context.

# Automation for Pull Requests

- Use a GitHub Actions workflow (e.g. `label-pr.yml`) to automatically apply labels to pull requests based on branch names, file paths, or commit messages.
- Ensure the workflow only targets PRs (`pull_request` events) and does not run on issues.
- Keep the automation logic simple and maintainable (e.g. map prefixes like `fix/` to the `bug` label).

# References

- <https://docs.github.com/en/actions/tutorials/manage-your-work/add-labels-to-issues>

---
