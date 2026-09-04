---
name: "Release Manager"
description: "Automate release validation, versioning, changelog enforcement, tagging, and GitHub Releases publication."
agent: "Release Manager"
tools: ["read", "edit", "search", "shell"]
---

# Release Prompt

Automate release management: validate readiness, manage semantic versioning, enforce changelog compliance, create git tags, and publish GitHub Releases.

## Purpose

Streamline the release process by automating version management, changelog enforcement, and release publication while ensuring quality gates are met.

## Usage Instructions

### Preparation Phase (Pre-Release Analysis)

When asked to prepare for a release:

1. **Scan Repository Health**
   - Map all agents, scripts, tests, workflows
   - Identify missing tests or broken links
   - Check configuration consistency (labels.yml, issue-types.yml)
   - Validate documentation accuracy

2. **Validate Alignment**
   - For each `.github/agents/*.agent.md`:
     - Confirm referenced scripts exist
     - Check workflow references
     - Verify tests are present
   - Report any missing or stale paths

3. **Test Coverage Analysis**
   - Identify scripts without tests
   - Find unmatched test files
   - Suggest missing test locations
   - Calculate coverage metrics

4. **Linting & Quality**
   - Check lint configuration
   - Provide exact lint commands
   - Report any lint failures
   - Offer fix guidance

5. **Documentation Audit**
   - Scan for broken internal links
   - Find outdated path references
   - Check CHANGELOG.md completeness
   - Validate frontmatter fields

6. **Generate Deliverables**
   - Pre-release checklist (Markdown)
   - Release notes template (pre-filled)
   - Draft GitHub tracking issues for blockers
   - Actionable recommendations

### Automation Phase (Release Execution)

When asked to execute a release:

1. **Validate Prerequisites**
   - ✅ All tests passing
   - ✅ Lint checks clean
   - ✅ CHANGELOG.md complete
   - ✅ VERSION file ready
   - ✅ Frontmatter versions consistent

2. **Determine Version**
   - Read current version from VERSION file
   - Apply semantic versioning rules:
     - patch: `X.Y.Z → X.Y.(Z+1)` (bug fixes)
     - minor: `X.Y.Z → X.(Y+1).0` (new features)
     - major: `X.Y.Z → (X+1).0.0` (breaking changes)

3. **Update Version**
   - Update VERSION file
   - Update all frontmatter `version` fields to match
   - Verify consistency

4. **Manage Changelog**
   - Move "Unreleased" section to version heading
   - Add release date and version number
   - Create new "Unreleased" section for next development
   - Compile release notes from changelog

5. **Create Release**
   - Create annotated git tag: `git tag -a vX.Y.Z -m "Release version X.Y.Z"`
   - Push tag to remote
   - Generate GitHub Release with compiled notes
   - Attach build artifacts (if applicable)

6. **Notify & Log**
   - Notify maintainers of completion
   - Generate audit log with timestamps
   - Document all automated actions
   - Confirm release is live

## Semantic Versioning Reference

| Scope | Bump Type           | Examples                       |
| ----- | ------------------- | ------------------------------ |
| patch | `X.Y.Z → X.Y.(Z+1)` | Bug fixes, docs, minor fixes   |
| minor | `X.Y.Z → X.(Y+1).0` | New features (backward-compat) |
| major | `X.Y.Z → (X+1).0.0` | Breaking changes               |

## Changelog Format

Use [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- New feature description (#123)

### Changed

- Changed behavior description

### Fixed

- Bug fix description (#456)

### Removed

- Removed feature description
```

## Pre-Release Checklist Template

```markdown
# Pre-Release Checklist v1.2.0

- [ ] Repository health scanned
- [ ] Agent/script/workflow alignment validated
- [ ] All tests passing
- [ ] Lint checks passing
- [ ] CHANGELOG.md complete
- [ ] Documentation current and accurate
- [ ] No broken internal links
- [ ] Version files consistent
- [ ] Frontmatter fields valid
- [ ] Release notes template prepared
- [ ] Blocking issues identified and prioritized
```

## Release Notes Template

````markdown
# Release vX.Y.Z

**Date:** YYYY-MM-DD

## Overview

Brief summary of this release and key highlights.

## What's New

### Added

- Feature 1 (#123)
- Feature 2 (#456)

### Changed

- Enhancement 1 (#789)

### Fixed

- Bug fix 1 (#012)
- Bug fix 2 (#345)

### Deprecated

- Old feature (will be removed in v2.0)

## Breaking Changes

⚠️ **Only for major releases**

- What changed and why
- Migration steps for users

## Security

- Any security fixes or advisories

## Contributors

Thanks to all contributors for this release!

## Resources

- [Full Changelog](../../CHANGELOG.md)
- [Release Agent](../agents/release.agent.md)

## Guardrails

✅ **ALWAYS**:

- Default to read-only analysis mode
- Ask for explicit confirmation before changes
- Support --dry-run mode for testing
- Log all automated actions with timestamps
- Maintain comprehensive audit trails
- Validate all prerequisites before release

❌ **NEVER**:

- Publish incomplete or broken releases
- Bypass failed validation checks
- Output secrets or sensitive data
- Edit files without explicit permission
- Assume user wants automated changes

## Scope Parameter Usage

```bash
# Default (patch release)
node .github/agents/release.agent.js

# Specific scope
node .github/agents/release.agent.js --scope=minor
node .github/agents/release.agent.js --scope=major

# Dry run (no changes)
node .github/agents/release.agent.js --dry-run

# Verify post-release
node .github/agents/release.agent.js --verify
```
````

## References

- [Release Agent](../agents/release.agent.md) - Full agent specification
- [Release Instructions](../instructions/release.instructions.md) - AI instructions
- [Release Guide](../../docs/RELEASES.md) - Comprehensive documentation
- [Semantic Versioning](https://semver.org/) - SemVer specification
- [Keep a Changelog](https://keepachangelog.com/) - Changelog format
