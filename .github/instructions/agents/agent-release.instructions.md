---
title: "Agent: Release"
description: "Spec for release.agent.js – automates releases, changelog, versioning, and publishing."
version: "v1.0"
apply_to: ".github/agents/release.agent.js, .github/workflows/release.yml"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "../../workflows/workflow-release.instructions.md"
  - "../../release-process.md"
---

# Mission

Automate the release lifecycle for LightSpeedWP projects, ensuring consistency, traceability, and minimal manual steps.

# Triggers

- Push to release/main branches
- Manual workflow dispatch (preview/dry-run)

# Inputs

- GitHub context (event, branch, commit)
- Changelog and version files (`CHANGELOG.md`, `package.json`, etc.)
- Release config (if any)

# Actions

- Run tests and validations
- Check or generate `CHANGELOG.md`
- Bump version numbers
- Tag and publish GitHub Releases
- Update `README.md` badges or version strings as needed
- Notify maintainers on outcomes

# Guardrails

- Block release if `CHANGELOG.md` is missing or invalid
- Dry-run/preview support for maintainers
- Enforce semantic versioning standards

# Outputs

- Published release (GitHub Release, npm, etc.)
- Updated changelog, README, version files
- Maintainer/report notifications
- Audit trail (logs, release summary)

# Integration

- Orchestrated by `.github/workflows/release.yml`
- Can be invoked by other workflows or as a CLI tool

# References

- [Workflow instructions](../../workflows/workflow-release.instructions.md)
- [Release Process](../../release-process.md)

---