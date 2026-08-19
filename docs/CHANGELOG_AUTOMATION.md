---
title: "Changelog Automation & Integration"
description: "Complete guide to changelog management, automation workflows, and integration with release processes"
file_type: "documentation"
created_date: "2026-07-24"
last_updated: "2026-08-18"
version: "1.1"
owners: ["LightSpeed Team"]
tags: ["changelog", "automation", "release", "versioning"]
---

# Changelog Automation & Integration Guide

**Purpose:** Comprehensive guide to understanding and maintaining the changelog automation system, including contributor workflows, format standards, automation validation, and integration with semantic versioning and release processes.

---

## Table of Contents

1. [Overview](#overview)
2. [Standards & Format](#standards--format)
3. [Contributor Workflow](#contributor-workflow)
4. [Automation Architecture](#automation-architecture)
5. [Validation & Quality Gates](#validation--quality-gates)
6. [Release Integration](#release-integration)
7. [Troubleshooting](#troubleshooting)
8. [Related Documentation](#related-documentation)

---

## Overview

### What is the Changelog?

The changelog (`CHANGELOG.md`) is a **human-and-machine-readable record** of all notable changes to the project, formatted according to [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).

### Key Goals

- 📝 **Traceability:** Every change links to its PR and related issues
- 🎯 **Clarity:** Clear descriptions help users understand impact
- 🔄 **Automation:** Machine-readable format enables validation and release automation
- 📦 **Release Ready:** Provides raw material for release notes and GitHub Releases

### Automation Scope

The changelog automation system:

- ✅ Validates entry format and content on every PR
- ✅ Enforces required fields (PR links, proper em-dashes, length limits)
- ✅ Prevents section header corruption during merges
- ✅ Integrates with semantic versioning for releases
- ✅ Generates GitHub Releases with compiled release notes

### Implementation (Phase 4 Refactoring)

**Update (2026-07-30):** The changelog automation workflows were refactored in Phase 4 to use helper scripts instead of multiline shell logic. The changelog-management.yml workflow now uses:

- `report-changelog-action.sh` — Safely report changelog merge action status
- `.github/scripts/agents/changelog.agent.js` — Changelog validation and management

These helper scripts follow GitHub Actions best practices by avoiding direct shell control-flow in `run:` blocks. Functionality remains unchanged; only the internal implementation has been refactored. See [WORKFLOW-REFACTORING-GUIDE.md](./WORKFLOW-REFACTORING-GUIDE.md) for details.

### Phase 5A Integration (NEW)

**Added in v1.1 (2026-08-18):** Phase 5A introduces changelog validation as the first safety gate in the release orchestration pipeline.

**GATE 1: Changelog Validation** validates:
- ✅ CHANGELOG.md schema compliance (Keep a Changelog 1.1.0)
- ✅ [Unreleased] section exists
- ✅ Unreleased section has entries
- ✅ Entries follow format standards

```mermaid
flowchart TD
accTitle: Flowchart
    A["Release triggered<br/>on develop branch"] --> B["Run Phase 5A Gates"]
    B -->|"GATE 1"| C["Changelog Validation"]
    C --> D{["CHANGELOG.md<br/>exists?"]}
    D -->|"No"| Z1["❌ FAIL<br/>Missing CHANGELOG.md"]
    D -->|"Yes"| E{["Valid schema?<br/>Keep a Changelog 1.1.0"]}
    E -->|"No"| Z2["❌ FAIL<br/>Invalid schema"]
    E -->|"Yes"| F{["Has [Unreleased]<br/>section?"]}
    F -->|"No"| Z3["❌ FAIL<br/>Missing Unreleased"]
    F -->|"Yes"| G{["Unreleased has<br/>entries?"]}
    G -->|"No"| Z4["❌ FAIL<br/>Empty Unreleased"]
    G -->|"Yes"| H["✅ PASS<br/>Ready for release"]
    H --> I["Continue to GATE 2"]
    
    style C fill:#1b5e20,color:#fff
    style H fill:#2e7d32,color:#fff
    style Z1 fill:#b71c1c,color:#fff
    style Z2 fill:#b71c1c,color:#fff
    style Z3 fill:#b71c1c,color:#fff
    style Z4 fill:#b71c1c,color:#fff
accDescr: Visual diagram showing structure, relationships, and flow
```

**Why GATE 1 matters:**
- Prevents incomplete releases (missing notes, entries)
- Ensures changelog quality before release
- Blocks accidentally releasing without documentation
- Catches schema violations early

---

## Standards & Format

### Keep a Changelog 1.1.0 Specification

The `CHANGELOG.md` follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) standard, which defines:

#### Section Headers (in order)

```markdown
## [Unreleased]

### Removed
### Deprecated
### Added
### Changed
### Fixed
### Security

## [X.Y.Z] — YYYY-MM-DD

[Previous release notes...]
```

**Section Meanings:**

| Section | Purpose | Example |
|---------|---------|---------|
| **Removed** | Deleted user-facing functionality | "Removed support for Node 16" |
| **Deprecated** | Features marked for future removal | "Old config format deprecated; migrate to JSON" |
| **Added** | New user-facing features/capabilities | "New agent for site auditing" |
| **Changed** | Breaking changes or major modifications | "Updated js-yaml to 5.x with breaking API" |
| **Fixed** | Bug fixes affecting users | "Fixed section header corruption in changelog merge" |
| **Security** | Security vulnerabilities or hardening | "CVE-2024-1234: Fixed XSS in template rendering" |

#### Entry Format

Every entry follows this exact format:

```markdown
- **Title** — description ([PR #N](url), [#I](issue-url))
```

**Components:**

| Component | Required | Example | Rules |
|-----------|----------|---------|-------|
| Bullet | ✅ Yes | `-` | Single space after bullet |
| Bold Title | ✅ Yes | `**Feature Name**` | <60 chars, capitalize major words |
| Em-dash | ✅ Yes | ` — ` | Space before & after (U+2014, not `-`) |
| Description | ✅ Yes | "Description text" | 1-2 sentences, <150 chars |
| PR link | ✅ **REQUIRED** | `([PR #1234](url))` | Every entry needs a PR link |
| Issue link | Optional | `([#5678](url))` | Include only if applicable |

#### Entry Length Limits

```
Title:        <60 characters
Description:  <150 characters
Full entry:   <250 characters (total)
Sentences:    1-2 maximum
```

### Semantic Versioning (SemVer)

This project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html):

```
MAJOR.MINOR.PATCH

Example: 1.5.3
         ↓ ↓ ↓
       M N P

M (Major): Breaking changes → increment, reset N & P to 0
N (Minor): New backward-compatible features → increment, reset P to 0
P (Patch): Bug fixes → increment only
```

#### How Changelog Links to SemVer

- **Breaking changes** → `### Changed` or `### Removed` → **MAJOR** bump
- **New features** → `### Added` → **MINOR** bump
- **Bug fixes** → `### Fixed` → **PATCH** bump
- **Security fixes** → `### Security` → **PATCH** or **MAJOR** (depending on severity)

**Example:**

```markdown
## [1.5.0] — 2026-08-01

### Added
- New agent for site auditing

### Fixed
- Fixed section header corruption
```

This changelog entry indicates: `1.4.x` → `1.5.0` (minor bump for new feature).

---

## Contributor Workflow

### Step 1: Understand What Goes in Changelog

**✅ INCLUDE these changes:**

- New user-facing features
- Bug fixes affecting users
- Breaking changes (removed/changed APIs, config)
- Security vulnerabilities/fixes
- Deprecations (features marked for removal)

**❌ EXCLUDE these changes:**

- Internal refactoring
- Test-only changes
- Documentation-only updates
- CI/CD improvements (unless fixing broken shipping)
- Skill/agent scaffolding without substantive content
- Generated files

### Step 2: Create Your PR with Changes

When your PR includes a user-facing change:

1. **Make your code changes** (as normal)
2. **Update `CHANGELOG.md`** if your change is user-facing
3. **Add entry to `[Unreleased]` section** under the appropriate heading

### Step 3: Format Your Entry

Use the checklist: [`.github/CHANGELOG_CONTRIBUTOR_CHECKLIST.md`](../.github/CHANGELOG_CONTRIBUTOR_CHECKLIST.md)

**Good example:**

```markdown
- **Website Auditing Agent** — New multi-provider agent for PageSpeed and accessibility analysis. ([PR #1100](https://github.com/lightspeedwp/.github/pull/1100), [#1050](https://github.com/lightspeedwp/.github/issues/1050))
```

**Bad example (why):**

```markdown
- Added a new agent for auditing - this agent can check website performance and accessibility using PageSpeed Insights API and Lighthouse. It works with Claude, GitHub Copilot, and OpenAI and includes documentation.
```

- Uses hyphen (-) not em-dash (—)
- Too verbose (way over 150 chars)
- Missing PR link (required)
- Not in bold

### Step 4: Verify Your Entry

Run validation locally:

```bash
npm run validate:changelog
```

Expected output:

```
📋 CHANGELOG Validation Report

📊 Summary:
   Total Entries: 76
   Errors: 0
   Warnings: 0
✅ All entries valid!
```

### Step 5: Submit PR

Submit your PR with:

- ✅ Code changes
- ✅ CHANGELOG.md entry
- ✅ Entry passes validation
- ✅ Entry follows checklist

**CI will automatically validate** your changelog entry on PR submission.

---

## Automation Architecture

### Validation Pipeline

```
Developer commits CHANGELOG.md update
         ↓
PR created (changelog-validate.yml triggered)
         ↓
┌─ Validation Step 1: Format Check
│  └─ scripts/validation/changelog-rules.cjs
│     • Title <60 chars
│     • Description <150 chars
│     • PR link required
│     • Em-dash correctness
│     • Sentence count 1-2 max
│     • URL format validation
│     ↓ (PASS/FAIL)
│
├─ Validation Step 2: Integration Tests
│  └─ scripts/workflows/changelog/merge-entries.integration.test.cjs
│     • Section headers preserved
│     • No duplicate entries
│     • Entry format consistency
│     ↓ (PASS/FAIL)
│
├─ Validation Step 3: Schema Compliance
│  └─ scripts/validation/validate-changelog.cjs
│     • Conforms to changelog.schema.json
│     • Required sections present
│     • Proper YAML frontmatter
│     ↓ (PASS/FAIL)
│
└─ Validation Step 4: Structure Verification
   └─ grep checks for [Unreleased] header
      • [Unreleased] section exists
      • Section headers intact (### Added, ### Fixed, etc.)
      ↓ (PASS/FAIL)

All 4 steps PASS → CI GREEN → PR can merge
Any step FAILS → CI RED → Fix issues and push again
```

### CI Workflow: changelog-validate.yml

**Triggers:**

- Pull request with CHANGELOG.md changes
- Develop branch pushes with CHANGELOG.md changes

**Steps:**

1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Run format validation script
5. Run integration tests
6. Verify section header preservation
7. Report results

**Configuration:**

```yaml
on:
  pull_request:
    paths:
      - 'CHANGELOG.md'
  push:
    branches:
      - develop
    paths:
      - 'CHANGELOG.md'
```

### Merge Safety: Automated Deduplication

**Problem:** When two PRs both add changelog entries, they can create duplicates or section header corruption.

**Solution:** The `merge-entries.cjs` workflow:

1. Detects duplicate entries (same PR number)
2. Removes exact duplicates
3. **Preserves section headers** (← Fixed in Phase 1)
4. Merges new entries into appropriate sections
5. Validates result before write

**Workflow:** `.github/workflows/changelog-merge.yml` (internal, automated on develop merge)

---

## Validation & Quality Gates

### Validation Rules (7 Total)

| Rule | Type | Impact |
|------|------|--------|
| Format compliance | Hard Fail | Entry must be `- **Title** — desc (...)` |
| Em-dash usage | Hard Fail | Must use — (U+2014), not - (hyphen) |
| PR link required | Hard Fail | Every entry needs PR link |
| Title length | Warning | Warn if >60 chars |
| Description length | Warning | Warn if >150 chars |
| URL format | Warning | Warn if GitHub URLs malformed |
| Sentence count | Warning | Warn if >2 sentences |

### Running Validation Locally

```bash
# Validate all entries in [Unreleased]
npm run validate:changelog

# Run integration tests (section header preservation)
npm run test:integration

# Run full validation suite
npm run validate:all
```

### CI Quality Gates

**On Every PR with CHANGELOG.md changes:**

1. ✅ Format validation (7 rules)
2. ✅ Integration tests (3 scenarios)
3. ✅ Schema compliance
4. ✅ Structure verification

**All must PASS before merging** (required CI check).

---

## Release Integration

### How Changelog Flows into Release Process

```
[Unreleased] section in CHANGELOG.md
         ↓
Release workflow triggered (manual or scheduled)
         ↓
release.agent.js reads CHANGELOG.md
         ↓
Validates [Unreleased] has entries
         ↓
Creates release/vX.Y.Z branch
         ↓
Moves [Unreleased] entries to [X.Y.Z] — YYYY-MM-DD
         ↓
Commits VERSION bump + updated CHANGELOG.md
         ↓
Creates PR release/vX.Y.Z → main
         ↓
After merge, generates GitHub Release with:
  • Changelog sections (Added, Fixed, Changed, etc.)
  • Highlights (prioritized entries)
  • Breaking changes callout
  • Contributors list
  • Changelog compare link
```

### Release Workflow with Changelog

**Diagram:**

```
┌─ develop branch
│
├─ CHANGELOG.md has [Unreleased] entries
│
├─ Release Agent triggered (--scope=minor)
│  └─ Reads: CHANGELOG.md + VERSION file
│
├─ Creates: release/v1.5.0 branch
│  ├─ Updates VERSION → 1.5.0
│  ├─ Rolls [Unreleased] → [1.5.0] — 2026-08-01
│  ├─ Commits changes
│  └─ Pushes release branch
│
├─ Creates PR release/v1.5.0 → main
│  └─ CI gates run (lint, test, changelog validation)
│
├─ Merge PR to main
│
└─ After merge:
   ├─ Tag created: v1.5.0
   ├─ GitHub Release published with:
   │  ├─ Changelog entries
   │  ├─ Highlights
   │  ├─ Contributors
   │  └─ Full compare link
   └─ develop synced with main
```

### Changelog Pre-Release Checklist

Before running release agent, verify:

```bash
# 1. Changelog has unreleased entries
grep -A 5 "## \[Unreleased\]" CHANGELOG.md

# 2. Validate changelog format
npm run validate:changelog

# 3. Check VERSION file
cat VERSION

# 4. Run tests
npm test

# 5. Run linting
npm run lint:all
```

### Release Agent Changelog Handling

**File:** `.github/scripts/agents/release.agent.js`

**Operations:**

1. Validates `[Unreleased]` section exists and has entries
2. Rolls `[Unreleased]` → `[X.Y.Z] — YYYY-MM-DD` (dated section)
3. Creates new empty `[Unreleased]` section for next cycle
4. Commits `CHANGELOG.md` + `VERSION` update
5. Compiles GitHub Release notes from changelog

**If validation fails:**

```
Error: Changelog validation failed
  Reason: [Unreleased] section missing or empty
  Action: Add entries to [Unreleased] before release
```

---

## Automation Failure Scenarios & Recovery

### Scenario 1: PR Link Missing from Changelog Entry

**Symptom:**

```
CI Red: changelog-validate.yml failed
Error: Missing PR link. Required format: ([PR #1234](url))
```

**Fix:**

1. Add PR link to the entry
2. Push fix to same branch
3. CI re-runs automatically

**Example:**

```markdown
❌ BEFORE:
- **New feature** — Added amazing functionality

✅ AFTER:
- **New feature** — Added amazing functionality ([PR #1100](https://github.com/lightspeedwp/.github/pull/1100))
```

### Scenario 2: Section Header Destroyed During Merge

**Symptom:**

```
develop merge completed, but CHANGELOG.md is missing "### Fixed" header
Entries exist, but section organization is lost
```

**Prevention:** Phase 1 fix now prevents this. If it still occurs:

1. Run: `npm run test:integration`
2. If test fails, contact team
3. Revert merge and investigate `merge-entries.cjs`

### Scenario 3: Duplicate Entries After Merge

**Symptom:**

```
PR #1100 entry appears twice in CHANGELOG.md after merge
```

**Prevention:** Automated deduplication in `merge-entries.cjs`

**Manual Fix (if dedup fails):**

1. Find duplicate entries (same PR number)
2. Keep one, remove other
3. Run validation: `npm run validate:changelog`
4. Commit and push

### Scenario 4: Validation False Positive

**Symptom:**

```
npm run validate:changelog reports error, but entry looks correct
```

**Debug:**

```bash
# Check exact entry format
grep "### Added" -A 20 CHANGELOG.md | head -5

# Look for hidden characters
od -c CHANGELOG.md | grep -A 5 "Added"

# Validate em-dash (should be U+2014, not U+002D)
echo "Check for em-dash: should see U+2014"
od -c CHANGELOG.md | grep "M   —"
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: CI fails with "Missing PR link"

**Cause:** Entry doesn't include `([PR #N](url))`

**Solution:**

```markdown
# Add PR link:
- **Title** — description ([PR #1234](https://github.com/lightspeedwp/.github/pull/1234))
```

#### Issue: "Invalid em-dash"

**Cause:** Used hyphen (`-`) instead of em-dash (`—`)

**Solution:**

```markdown
# In most editors: Option+Shift+- (Mac) or Alt+0151 (Windows)
# Or copy-paste from this file: —
```

#### Issue: "Title too long (>60 chars)"

**Cause:** Title exceeds 60 character limit

**Solution:** Shorten title

```markdown
❌ BEFORE (72 chars):
- **This is a very long title that exceeds the maximum length** — description

✅ AFTER (45 chars):
- **Long title, shortened** — description
```

#### Issue: "Description too long (>150 chars)"

**Cause:** Description exceeds 150 character limit

**Solution:** Condense to 1-2 sentences

```markdown
❌ BEFORE (245 chars):
- **Feature** — This feature adds support for multi-provider testing including Claude, GitHub Copilot, and OpenAI with full configuration examples and documentation for all three providers plus troubleshooting guides.

✅ AFTER (115 chars):
- **Multi-provider testing** — Added support for Claude, Copilot, and OpenAI with full documentation. ([PR #1100](url))
```

#### Issue: Validation passes locally but fails in CI

**Cause:** Node.js version mismatch

**Solution:**

```bash
# Check local Node version
node --version  # Should be ≥20.19.0

# Update if needed
nvm install 20
nvm use 20
npm ci
npm run validate:changelog
```

#### Issue: Section headers missing after develop merge

**Cause:** Rare edge case in `merge-entries.cjs` deduplication

**Solution:**

1. Check: `grep "^### " CHANGELOG.md`
2. If headers missing, run integration test: `npm run test:integration`
3. If test fails, contact team
4. Manual fix: re-add missing section headers

---

## Related Documentation

### Internal References

- **[CHANGELOG Guidelines](./../.github/projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md)** — Detailed entry format rules
- **[Contributor Checklist](./../.github/CHANGELOG_CONTRIBUTOR_CHECKLIST.md)** — Pre-submission checklist
- **[Release Process](./RELEASE_PROCESS.md)** — Complete release workflow
- **[Project Plan](./../.github/projects/active/changelog-automation-hardening/PROJECT_PLAN.md)** — 4-phase hardening initiative

### External References

- **[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)** — Official changelog standard
- **[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)** — Official semver specification
- **[GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)** — How to create and manage releases

### Automation Scripts

- `scripts/validation/changelog-rules.cjs` — Format validation (7 rules)
- `scripts/workflows/changelog/merge-entries.cjs` — Merge & deduplicate entries
- `scripts/workflows/changelog/merge-entries.integration.test.cjs` — Merge validation tests
- `scripts/validation/validate-changelog.cjs` — Schema compliance
- `.github/scripts/agents/release.agent.js` — Release automation

### Workflow Files

- `.github/workflows/changelog-validate.yml` — CI validation on PRs & develop
- `.github/workflows/changelog-merge.yml` — Auto-dedup on develop merge
- `.github/workflows/release.yml` — Release workflow (manual/scheduled)

---

## Quick Reference

### Add Changelog Entry

```bash
# 1. Edit CHANGELOG.md
# 2. Add entry to [Unreleased] section
# 3. Format: - **Title** — description ([PR #N](url))
# 4. Validate locally
npm run validate:changelog
# 5. Push and wait for CI
```

### Format Quick Check

```bash
# Title: max 60 chars, bold, capitalize major words
- **Feature Name**

# Description: 1-2 sentences, max 150 chars, plain text
— This feature adds support for X. It improves Y.

# Links: PR required, issues optional
([PR #1234](https://github.com/lightspeedwp/.github/pull/1234), [#5678](https://github.com/lightspeedwp/.github/issues/5678))
```

### SemVer at a Glance

| Change | Type | Bump | Example |
|--------|------|------|---------|
| Breaking change | → Removed/Changed | MAJOR | `1.0.0` → `2.0.0` |
| New feature | → Added | MINOR | `1.0.0` → `1.1.0` |
| Bug fix | → Fixed | PATCH | `1.0.0` → `1.0.1` |
| Security fix | → Security | PATCH/MAJOR | `1.0.0` → `1.0.1` or `2.0.0` |

### Release Command

```bash
# Patch release (default)
node .github/scripts/agents/release.agent.js

# Minor release
node .github/scripts/agents/release.agent.js --scope=minor

# Major release
node .github/scripts/agents/release.agent.js --scope=major

# Dry run (preview only, no commits/tags)
node .github/scripts/agents/release.agent.js --scope=minor --dry-run
```

---

**Last Updated:** 2026-07-24  
**Maintained By:** Changelog & Release Engineering Team  
**Status:** Active  
**Stability:** Stable

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
