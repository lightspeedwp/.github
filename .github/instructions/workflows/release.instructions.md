---
file_type: "instructions"
title: "Workflow: Release"
description: "Automate releases, versioning, changelog verification, and release publishing."
version: "v1.0"
apply_to: ".github/workflows/release.yml, release agent"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "./workflows.instructions.md"
  - "../agents/release.agent.js"
  - "https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages"
---

# Mission

Automate the release process, including test runs, changelog verification, semantic versioning, tagging, and publishing releases.

# Strategy

- Triggered on pushes to release/main branches.
- Validate and generate changelogs.
- Bump version numbers and publish GitHub Releases.
- Enforce changelog presence and validity.
- Notify maintainers of release outcomes.
- All core logic should move to `release.agent.js`.

# Agent Alignment

- Agent: `release.agent.js`
- Future: dry-run, preview, multi-branch, audit trail.

# References

- [GitHub Actions: Publishing Node.js Packages](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)

---