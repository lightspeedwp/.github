---
title: "Release Agent Slide Deck Prompt"
description: "NotebookLM and design prompt for generating Release Agent presentation slides"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Release Agent Slide Deck Prompt

## Agent Overview

The **Release Agent** automates versioning, changelog management, and release pipeline orchestration across the lightspeedwp/.github ecosystem. It enforces semantic versioning discipline, maintains release documentation, and orchestrates multi-platform artifact generation and distribution.

**Operational scope**: Repository-wide version governance, changelog maintenance, release readiness validation, artifact lifecycle management.

**Owned by**: LightSpeedWP ops & engineering teams

## Key Capabilities

1. **Semantic Versioning** - Automatic version bumping following SemVer with patch/minor/major classification
2. **Changelog Automation** - Keep-a-Changelog format enforcement and entry validation
3. **Release Validation** - Pre-release checks for readiness (CI green, tests passing, docs current)
4. **Multi-Platform Artifacts** - Generate platform-specific release bundles (npm, GitHub Releases, plugin pack mirrors)
5. **Release Notes Generation** - Automatic extraction and formatting from changelog entries
6. **Version Rollback Guards** - Prevent invalid version progressions and enforce monotonic ordering

## Integration Points

- **Upstream**: Planner Agent (roadmap & milestone definitions), Reviewer Agent (code quality gates)
- **Downstream**: All agents (consume versioned artifacts), CI/CD pipelines (trigger on release tags)
- **Governance**: CHANGELOG.md (source of truth), package.json (npm version), git tags (release markers)

## Use Cases & Examples

### Use Case 1: Feature Release

A new feature set is complete, merged to develop, and ready for release.

**Release Agent workflow:**

1. Detect merged feature PRs with `type:feature` labels
2. Validate CHANGELOG.md entries exist for all features
3. Auto-bump minor version (1.2.0 → 1.3.0)
4. Generate release notes from changelog
5. Create GitHub Release with artifacts
6. Tag release in git
7. Publish npm package if applicable

### Use Case 2: Hotfix Release

Critical bug discovered in production; urgent release needed.

**Release Agent workflow:**

1. Detect `type:hotfix` label on PR
2. Verify bug fix + CHANGELOG entry
3. Auto-bump patch version (1.3.0 → 1.3.1)
4. Expedited validation (skip non-critical checks)
5. Generate hotfix release notes
6. Fast-track artifact distribution
7. Notify stakeholders of critical release

### Use Case 3: Security Release

Vulnerability discovered; must patch all supported versions.

**Release Agent workflow:**

1. Detect `type:security` label + vulnerability ID
2. Validate fix is backported to support branches
3. Release patch versions for all active branches
4. Generate security advisory
5. Notify security mailing list
6. Coordinate disclosure timeline

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Manual release management error-prone and time-consuming
- Stakes: Version drift, incomplete changelogs, missed platforms, delayed critical fixes

**Slide 02** - Release Agent Role

- Orchestrates versioning, documentation, validation, and artifact distribution
- Enforces SemVer discipline across all packages and plugins

**Slide 03** - Semantic Versioning Model

- MAJOR for breaking changes
- MINOR for backwards-compatible features
- PATCH for bug fixes
- Pre-release & build metadata support

**Slide 04** - Changelog Governance

- Keep-a-Changelog 1.1.0 format
- Enforced sections (Added, Changed, Fixed, Removed, Security, Deprecated)
- Entry linking to PRs and issues
- Validation rules and schema

**Slide 05** - Version Validation

- Pre-release readiness checks: CI green, tests passing, docs current
- Monotonic version ordering enforcement
- Invalid progression prevention

**Slide 06** - Release Workflows

- Standard release (feature/bug/performance)
- Hotfix release (critical bug, expedited)
- Security release (vulnerability, coordinated disclosure)

**Slide 07** - Multi-Platform Artifacts

- npm package publishing
- GitHub Releases with download assets
- Plugin pack distribution mirrors
- Docker image builds (if applicable)

**Slide 08** - Release Notes Generation

- Auto-extract from CHANGELOG.md
- Format for multiple audiences (devs, product, operators)
- Include breaking changes and migration guides
- Link to full changelog

**Slide 09** - Integration with Planner Agent

- Planner defines milestones & release windows
- Release Agent consumes roadmap for version planning
- Feedback loop: actual vs. planned release cadence

**Slide 10** - Integration with Reviewer Agent

- Reviewer validates code quality on all PRs
- Release Agent blocks releases if Reviewer checks fail
- Release-blocking label support

**Slide 11** - Adoption Patterns

- First release: manual initialization, then automated
- Continuous deployment model with tagged releases
- Coordinated multi-repository release trains

**Slide 12** - Metrics & Transparency

- Release frequency (commits per week → releases per month)
- Time-to-release (PR merge → artifact availability)
- Changelog completeness (coverage of merged PRs)
- Version health (monotonic, SemVer compliance)

**Slide 13** - Lessons & Anti-Patterns (optional)

- Anti-pattern: Silent hotfixes without version bump
- Anti-pattern: Changelog entries after release
- Lesson: Changelog discipline prevents confusion
- Lesson: Automated validation catches human errors

**Slide 14** - Roadmap & Adoption (optional)

- Current: Standard release workflows (feature/bug/hotfix/security)
- Near-term: Release train orchestration (synchronized multi-repo releases)
- Future: Automated backport-and-release for security fixes

**Slide 15** - Close & Next Actions

- Release Agent is operational on all packages
- Contribute: Submit PRs with CHANGELOG entries
- Questions & feedback

## Evidence Anchors

- `CHANGELOG.md` - Live changelog following Keep-a-Changelog format
- `.github/workflows/` - Release workflow definitions
- `AGENTS.md` - Release Agent responsibility specification
- `docs/RELEASE_PROCESS.md` - Release process documentation
- `package.json` - Current version and npm metadata
- `.github/labels.yml` - Release-related labels (type:release, type:hotfix, type:security, etc.)
- `scripts/agents/includes/changelogUtils.cjs` - Changelog parsing and validation utilities

## Design Notes

- **Visual theme**: Automation & consistency (gears, pipelines, version badges)
- **Color palette**: Use ops/automation colors from brand guide
- **Key visuals**: Version progression diagram, release workflow flowchart, changelog entry examples
- **Accessibility**: All diagrams include alt text; high contrast for version numbers and tags
- **Animations**: Consider workflow step-by-step reveal on "Slide 06 - Release Workflows"

## Quality Bar

- Distinguish "implemented now" vs "roadmap/future"
- Flag any claims about release frequency or automation that vary by repository
- Include confidence levels (high/medium/low) for each capability
- Validate examples against actual repository release history
- Ensure all evidence references point to current develop branch files
