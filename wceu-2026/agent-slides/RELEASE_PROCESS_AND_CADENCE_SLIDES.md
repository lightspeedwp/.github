---
title: "Release Process & Cadence Slide Deck Prompt"
description: "NotebookLM and design prompt for release workflows and scheduling"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Release Process & Cadence Slide Deck Prompt

## System Overview

The **Release Process & Cadence System** orchestrates the complete lifecycle from feature merge to published artifact. It enforces semantic versioning, maintains changelog completeness, validates release readiness, coordinates multi-platform distribution, and tracks release metrics and cadence.

**Operational scope**: Version governance, release planning, changelog maintenance, artifact publishing, release coordination.

**Owned by**: LightSpeed ops & engineering teams

## Key Components

1. **Release Planning** - Milestone definition, feature grouping, version planning
2. **Changelog Management** - Entry validation, format enforcement, completeness checks
3. **Release Validation** - Readiness checks (CI green, docs current, tests passing)
4. **Version Management** - SemVer enforcement, monotonic ordering, pre-release handling
5. **Artifact Publishing** - Multi-platform distribution (npm, GitHub Releases, mirrors)
6. **Cadence Tracking** - Release frequency metrics, velocity reporting

## Integration Points

- **Planner Agent**: Defines release milestones and windows
- **Release Agent**: Orchestrates version bumping and artifact distribution
- **Meta Agent**: Reports on release health and cadence
- **Changelog Validation**: Enforces Keep-a-Changelog format
- **Metrics System**: Tracks release frequency, time-to-release

## Use Cases & Examples

### Use Case 1: Feature Release (Planned Cadence)

Monthly release window; coordinated feature merge and release.

**Release flow:**

1. Milestone created: "v2.3.0 - Feature Release"
2. Planning agent identifies PRs targeting milestone
3. Deadline: all features must merge by release date
4. Changelog updated: each PR adds entry to "Unreleased" section
5. Release day: release.agent.js bumps version (1.2.0 → 1.3.0)
6. CHANGELOG.md updated: "Unreleased" → "v1.3.0 - 2026-06-01"
7. Release notes generated from changelog entries
8. GitHub Release created with artifacts
9. npm package published
10. Metrics updated: release cadence tracked

### Use Case 2: Hotfix Release (Unplanned Urgent)

Critical bug in production; expedited release needed.

**Release flow:**

1. Critical bug identified in production
2. Hotfix branch created from latest release tag
3. Fix merged to hotfix branch immediately
4. Changelog entry: `[HOTFIX] Critical: Fixed crash on login`
5. Release workflow triggered manually
6. Version bumped: 1.3.0 → 1.3.1 (patch)
7. Release notes: "Critical hotfix - deploy immediately"
8. GitHub Release marked as "This is a pre-release"
9. Fast-tracked artifact distribution
10. Notification sent to operations team

### Use Case 3: Release Planning & Roadmap

Quarterly planning; coordinating multiple features and releases.

**Release flow:**

1. Planning agent creates milestones: v1.3.0, v1.4.0, v1.5.0
2. Product team assigns features to milestones
3. Capacity planning: how many features fit per release?
4. Release windows defined: v1.3.0 (June), v1.4.0 (Sept)
5. Release agent tracks progress toward each milestone
6. Weekly metrics: how many features complete vs. planned?
7. If blocked: escalation to team lead
8. Release cadence maintained: predictable, monthly releases

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Release process manual, inconsistent versioning, unclear timeline
- Stakes: Version confusion, missed release dates, artifact quality issues

**Slide 02** - Release System Overview

- Planned releases: monthly or quarterly cadence
- Unplanned releases: hotfixes and emergency patches
- Automated validation: readiness checks, version enforcement
- Multi-platform publishing: npm, GitHub, plugin stores
- Metrics tracking: cadence, time-to-release, completeness

**Slide 03** - Release Planning & Milestones

- Milestones define release boundaries
- Feature assignment: which features go in which release?
- Capacity planning: realistic feature count per release
- Dates: target release dates (flexible vs. hard)
- Coordination: communicate dates to stakeholders

**Slide 04** - Semantic Versioning (SemVer)

- MAJOR (breaking changes): 2.0.0, 3.0.0
- MINOR (backwards-compatible features): 1.3.0, 1.4.0
- PATCH (bug fixes): 1.3.1, 1.3.2
- Pre-release (alpha/beta): 1.3.0-beta.1
- Metadata: 1.3.0+build.123
- Release agent enforces: no skipped versions, monotonic progression

**Slide 05** - Changelog Management

- Keep-a-Changelog format (standardized)
- Sections: Added (features), Changed (modifications), Fixed (bugs), Removed (deprecations), Security (vulnerabilities), Deprecated
- Entry format: link to PR/issue, brief description
- Validation: release agent checks completeness before publishing
- Example: `- [#456] Fixed crash on login button click`

**Slide 06** - Release Readiness Validation

- Pre-release checks:
  - CI passing (all checks green)
  - Test coverage maintained (no regressions)
  - Documentation updated (version numbers, install instructions)
  - Changelog complete (all features documented)
  - Dependencies up-to-date (security patches)
- Blocking: if validation fails, release blocked until fixed

**Slide 07** - Release Workflows (Standard, Hotfix, Security)

- **Standard Release**: Planned feature release, monthly/quarterly
- **Hotfix Release**: Unplanned critical bug fix, expedited approval
- **Security Release**: Vulnerability patch, coordinated disclosure
- Each has different validation levels
- Each has different communication/notification

**Slide 08** - Multi-Platform Artifact Publishing

- **npm Registry**: JavaScript/Node.js packages
- **GitHub Releases**: Download assets, release notes
- **Plugin Stores**: WordPress.org, Packagist, etc.
- **Mirror Distribution**: Private mirrors for enterprise
- **Docker Registry**: Container images (if applicable)
- All publishing coordinated atomically (all-or-nothing)

**Slide 09** - Release Notes Generation

- Auto-extracted from CHANGELOG.md
- Formatted for multiple audiences:
  - **Developers**: Technical details, migration guides
  - **Product**: User-facing features, benefits
  - **Operations**: Deployment notes, downtime info
- Includes: breaking changes, upgrade instructions, known issues

**Slide 10** - Release Coordination & Communication

- **Announcement**: Release notes posted in Slack, email, GitHub
- **Stakeholder Notification**: ops team, support team, customers
- **Deployment Guidance**: step-by-step upgrade instructions
- **Rollback Plan**: if needed, how to downgrade
- **Post-Release**: monitoring, issue tracking

**Slide 11** - Version Rollback & Emergency Procedures

- Rollback triggers: critical bug, security issue discovered
- Process: tag previous version, publish as latest
- Communication: notify users of rollback
- Root cause analysis: prevent recurrence
- Prevention: automated testing to catch regressions

**Slide 12** - Release Cadence & Metrics

- **Release Frequency**: releases per month (target: 1-4)
- **Time-to-Release**: PR merge → artifact available (target: < 1 day)
- **Changelog Completeness**: % of merged PRs with changelog entries
- **Hotfix Rate**: hotfixes per month (lower is better)
- **Regression Rate**: bugs discovered post-release
- Trend analysis: improving vs. degrading cadence

**Slide 13** - Best Practices

- Keep releases focused: one major feature or bug fix per release
- Update CHANGELOG.md as you merge (not after release)
- Test release locally before publishing
- Have rollback plan ready
- Communicate release notes clearly
- Announce releases to affected users/teams

**Slide 14** - Troubleshooting

- **Version mismatch**: Check git tags, package.json version match
- **Changelog validation fails**: Ensure format matches Keep-a-Changelog
- **Release tests fail**: Fix failing tests, re-trigger release
- **Artifact publishing fails**: Check npm token, publish permissions

**Slide 15** - Close & Next Actions

- Release system ensures consistent, planned releases
- Contribute: Update CHANGELOG.md with your PRs
- Questions & feedback

## Evidence Anchors

- `.github/.github/workflows/release.yml` - Release workflow
- `.github/scripts/agents/release.agent.js` - Release orchestration logic
- `CHANGELOG.md` - Live changelog (Keep-a-Changelog format)
- `package.json` - Current version and npm metadata
- `docs/RELEASE_PROCESS.md` - Release process documentation
- `.github/scripts/agents/includes/changelogUtils.cjs` - Changelog utilities

## Design Notes

- **Visual theme**: Versioning and milestones (timeline, version progression, release cadence)
- **Color palette**: Use version colors (major=red, minor=blue, patch=green)
- **Key visuals**: SemVer explanation diagram, release timeline, changelog example, cadence trend chart
- **Accessibility**: Clear version labels; high contrast for timelines
- **Animations**: Consider version progression animation, release timeline reveal

## Quality Bar

- Show realistic release cadence (monthly/quarterly)
- Include actual changelog and release notes examples
- Validate against real CHANGELOG.md format
- Show SemVer decision tree
- Ensure all evidence references point to current develop branch
