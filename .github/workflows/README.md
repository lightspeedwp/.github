---
file_type: "documentation"
title: ".github Workflows Directory"
description: "Reusable GitHub Actions workflows and automation for the LightSpeed .github control plane"
version: "v1.0"
last_updated: '2026-06-01'
maintainer: "LightSpeed Team"
tags: ["workflows", "github-actions", "automation", "ci-cd"]
---

# .github Workflows Directory

This directory contains reusable GitHub Actions workflows used for automation, CI/CD, labeling, metrics collection, and community health across the LightSpeed organization.

## Workflow Categories

### Validation & Quality Checks

- **checks.yml** - Unified linting, testing, and validation workflow
- **validate.yml** - Frontmatter, JSON schema, and configuration validation
- **lint-and-links.yml** - Markdown linting and link validation
- **main-branch-guard.yml** - PR branch-name guard for `main`

### Automation & Labeling

- **labeling.yml** - Automatic issue and PR labeling based on paths and content
- **branding.yml** - Branding, frontmatter, and metadata automation

### Metrics & Reporting

- **metrics.yml** - Frontmatter coverage and quality metrics collection
- **reporting.yml** - Generate audit and status reports

### Release Management

- **release.yml** - Automated release orchestration and changelog generation
- **publish.yml** - Artifact publishing and distribution

## Usage

Workflows are triggered by:

1. **Pull Request Events** - Code quality checks on PR creation/update
2. **Push Events** - Validation and automation on push to branches
3. **Schedule** - Periodic metrics and reporting collection
4. **Manual Dispatch** - On-demand workflow execution via GitHub UI

## Configuration

Workflow behavior is configured via:

- **`.github/labeler.yml`** - Label matching rules
- **`.github/metrics/metrics.config.json`** - Metrics collection configuration
- **`.github/schemas/`** - JSON schemas for validation

## Best Practices

- Keep workflow files in source control
- Use workflow permissions minimally (read-only by default)
- Leverage reusable workflow blocks to reduce duplication
- Test workflows locally with `act` before committing
- Document non-obvious workflow logic inline

## Related Documentation

- [Automation Governance](../automation/AUTOMATION_GOVERNANCE.md) - Workflow standards and oversight
- [Labeling System](./labels.yml) - Label definitions and rules
- [Metrics Directory](../metrics/README.md) - Metrics collection and reporting

---

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
