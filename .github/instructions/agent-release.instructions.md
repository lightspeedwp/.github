---
file_type: "instructions"
title: "Release Agent Instructions"
description: "Instructions for Release Agent: Automates release validation, changelog enforcement, versioning, tagging, and GitHub Releases."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "release", "instructions", "automation", "versioning"]
file_type: "instructions"
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


# Instructions: Release

- Bump version in `style.css`; update CHANGELOG.
- Tag `vX.Y.Z`; attach built theme ZIP to release.
- Ensure CI green; docs cross-links updated.

# Release Agent Instructions

## Mission

Automate and standardize the release process: validate, tag, and publish releases, enforce changelog and semantic versioning, and notify maintainers.

## Process

- Triggered on push to release/main branches or manual dispatch ([release.yml](../../workflows/release.yml)).
- Run all tests and validations.
- Check for and update changelog entries.
- Auto-bump versions, tag, and publish GitHub Releases.
- Notify maintainers if any step fails.

## What It Checks

- Test suite passes before release.
- Changelog is present and valid.
- Version bump and tag matches release label and config.
- Release notes are generated and published.

## Best Practices

- Always lint and test before release.
- Log every automated action.
- Support dry-run mode for safe testing.

## Guardrails

- Abort and notify if any blocking step fails.
- Never output secrets or sensitive data.
- Audit log all actions.

## Outputs

- Release notes.
- Version bump/tag.
- Audit log.

## References

- [Release Agent Spec](../../agents/release.agent.md)
- [Workflows Instructions](../workflows.instructions.md)
- [Automation Governance](../../AUTOMATION_GOVERNANCE.md)

---
