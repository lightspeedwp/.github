---
file_type: "documentation"
title: ".github Workflows Directory"
description: "Active GitHub Actions workflows for the LightSpeed .github control plane"
version: "v2.0"
last_updated: '2026-09-18'
maintainer: "LightSpeed Team"
tags: ["workflows", "github-actions", "automation", "ci-cd"]
---

# .github Workflows Directory

This directory contains the active GitHub Actions workflows for this repository. Previous consolidation (2026-09-11) archived 71 superseded workflows under `archived/` and removed 7 placeholder stubs in Sep 2026.

## Active Workflows

### Branch & PR Governance

- **branch-name-validation.yml** - Enforces the `{type}/{scope}-{title}` branch naming strategy on push
- **branch-validation-metrics-aggregator.yml** - Aggregates branch validation metrics hourly and on validation completion
- **pr-template-routing.yml** - Routes PR templates and applies labels from the branch name

### Changelog

- **changelog-management.yml** - Gates PRs on `develop` for CHANGELOG updates and syncs entries on merge
- **changelog-validation.yml** - Scores CHANGELOG entry quality on PRs touching `CHANGELOG.md`

### Documentation & Specs

- **documentation.yml** - Regenerates impacted READMEs on PR/push to `develop`; audit and maintenance via manual dispatch
- **validate-specifications.yml** - Audits `.github/specs/`, validates the catalog, lints changed markdown, runs Bats tests

## Archived Workflows

Superseded workflows are preserved under `archived/2026-09-11/` with a manifest and restoration procedures. See `archived/INDEX.md`.

## Usage

Workflows are triggered by:

1. **Pull Request Events** - Code quality checks on PR creation/update
2. **Push Events** - Validation and automation on push to branches
3. **Schedule** - Periodic metrics collection
4. **Manual Dispatch** - On-demand workflow execution via GitHub UI

## Configuration

Workflow behavior is configured via:

- **`../labeler.yml`** - Label matching rules
- **`../metrics/README.md`** - Metrics collection and reporting

## Best Practices

- Keep workflow files in source control
- Use workflow permissions minimally (read-only by default)
- Leverage reusable workflow blocks to reduce duplication
- Test workflows locally with `act` before committing
- Document non-obvious workflow logic inline

---

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
