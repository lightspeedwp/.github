---
file_type: "instructions"
title: "Release Agent Instructions"
description: "Instructions for Release Agent: Automates release validation, changelog enforcement, versioning, tagging, and GitHub Releases."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "release", "instructions", "automation", "versioning"]
type: "instructions"
---

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