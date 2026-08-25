# Changelog Guidelines & Rules

## Quick Reference

| Do ✅ | Don't ❌ |
|-------|---------|
| New features | Internal refactoring |
| Bug fixes | Documentation-only changes |
| Breaking changes | Generated files |
| Security fixes | Project planning documents |
| Performance improvements | CI/CD tool improvements |
| Deprecations | Test-only changes |
| Removed functionality | Skill scaffolding |

---

## Detailed Entry Guidance

All entries follow the Keep a Changelog 1.1.0 format.

### Added — New Features & Capabilities

**Guideline:** User-facing features that did not exist before.

✅ **Include:**

- New CLI commands, APIs, or interfaces
- New agent or skill implementations
- New GitHub Actions workflows (if they fix a user problem)
- New validation or automation (if user-facing)
- New configuration options

❌ **Exclude:**

- Internal refactoring that doesn't change behavior
- New test files or test utilities
- Skill directory scaffolding without substantive content
- Test infrastructure improvements
- Internal code organization

**Examples:**

✅ **Good:**

```markdown
- **Playwright Testing Agent multi-provider support** — Added multi-provider 
  configuration (Claude, Copilot, OpenAI) with per-provider tools and 
  documentation. ([PR #1108](https://github.com/lightspeedwp/.github/pull/1108), 
  [#1079](https://github.com/lightspeedwp/.github/issues/1079))

- **Version-based milestone allocation** — Implemented automated version-based 
  milestone assignment (v1.0–v1.6) for structured release planning with capacity 
  tracking. ([PR #1113](https://github.com/lightspeedwp/.github/pull/1113), 
  [#1112](https://github.com/lightspeedwp/.github/issues/1112))
```

❌ **Bad:**

```markdown
- **Added test file for new agent** — Created test.js for agent feature. 
  (overcomplicated, test-only)

- **Added skill directory** — Created agents/new-skill/ directory. 
  (scaffolding without content)

- **Internal code refactoring** — Moved functions to separate file. 
  (internal, not user-facing)
```

---

### Fixed — Bug Fixes & Corrections

**Guideline:** Corrections of existing bugs that affected users.

✅ **Include:**

- Broken workflows or features
- Incorrect behavior or calculations
- Data corruption bugs
- Performance regressions
- Failed validations
- CI/CD bugs that prevented shipping (not other CI/CD tool improvements)

❌ **Exclude:**

- Typos in comments or test files
- Internal refactoring
- Linting fixes
- Code quality improvements without functional change
- Documentation fixes (move to a separate "Documentation" section if desired)

**Examples:**

✅ **Good:**

```markdown
- **Changelog automation: Section headers destroyed on merge** — The 
  merge-entries workflow was discarding section headers during deduplication, 
  corrupting changelog structure. Fixed deduplication logic to preserve headers 
  and limited scope to [Unreleased] section only. ([PR #1275](https://github.com/lightspeedwp/.github/pull/1275))

- **Milestone capacity tracking: Type exclusion not enforced** — Configured 
  type exclusions (chore, task, docs) were not applied when counting issues 
  toward capacity limits. Implemented type-based filtering in milestone stats. 
  ([PR #1132](https://github.com/lightspeedwp/.github/pull/1132), [#1131](https://github.com/lightspeedwp/.github/issues/1131))
```

❌ **Bad:**

```markdown
- **Fixed typo in test file** — Changed "featre" to "feature". 
  (test-only, not user-facing)

- **Fixed ESLint warnings** — Updated code to pass new ESLint rules. 
  (linting, not functional)

- **Fixed documentation typo** — Changed "wich" to "which" in README. 
  (docs-only; could go in separate section if desired)
```

---

### Changed — Breaking Changes & Modifications

**Guideline:** Changes to existing functionality that may break backward compatibility.

✅ **Include:**

- Renamed commands, parameters, or configuration fields
- Changed default behavior
- Restructured APIs
- Modified output format
- Changed automation workflows
- Updated dependency versions (if breaking)

❌ **Exclude:**

- Non-breaking refactoring
- Internal variable renames
- Internal code reorganization
- Documentation updates

**Examples:**

✅ **Good:**

```markdown
- **js-yaml upgraded to 5.x with breaking changes** — Updated from 4.2.0 to 
  5.2.1. Default export removed; all code updated to use named imports 
  (import * as yaml from "js-yaml"). ([PR #1047](https://github.com/lightspeedwp/.github/pull/1047))

- **Babel upgraded to 8.x (breaking API changes)** — Major version bump with 
  peer-dependency requirements. Updated all packages, removed deprecated 
  proposal plugins. ([PR #1044](https://github.com/lightspeedwp/.github/pull/1044))
```

❌ **Bad:**

```markdown
- **Refactored internal code structure** — Moved functions to separate file. 
  (internal, non-breaking)

- **Updated variable names** — Renamed internal variable x to xValue. 
  (internal)
```

---

### Deprecated — Upcoming Removals

**Guideline:** Features marked for future removal.

✅ **Include:**

- Deprecated CLI flags or commands
- Deprecated configuration options
- Deprecated APIs
- Removal timeline

❌ **Exclude:**

- Internal deprecations users won't see
- Unused internal code

**Examples:**

✅ **Good:**

```markdown
- **Legacy config format deprecated** — The old .yml format will be removed 
  in v2.0. Migrate to .json using migration tool: npm run migrate:config. 
  ([PR #1200](https://github.com/lightspeedwp/.github/pull/1200))
```

---

### Removed — Deleted Functionality

**Guideline:** Features that have been deleted.

✅ **Include:**

- Removed commands or APIs
- Removed dependencies
- Removed configuration options
- Removal date

❌ **Exclude:**

- Deleted test files
- Removed internal code
- Removed project planning documents

**Examples:**

✅ **Good:**

```markdown
- **Support for Node 16 removed** — Minimum Node version is now 18. 
  See migration guide: docs/NODE_UPGRADE_GUIDE.md. ([PR #1180](https://github.com/lightspeedwp/.github/pull/1180))
```

---

### Security — Security Fixes

**Guideline:** Security vulnerabilities and hardening fixes.

✅ **Include:**

- CVE fixes
- Vulnerability patches
- Security bypasses fixed
- Hardening improvements

❌ **Exclude:**

- Linting rules for code quality
- Internal security refactoring

**Examples:**

✅ **Good:**

```markdown
- **CVE-2024-1234: XSS vulnerability in template rendering** — User input 
  was not properly escaped in dynamic template generation. Fixed escaping 
  logic and added input validation. Upgrade immediately. ([PR #1190](https://github.com/lightspeedwp/.github/pull/1190))
```

---

## Entry Format & Style

### Required Format

All entries must follow this exact format:

```markdown
- **Title** — description ([PR #NUMBER](url), [#ISSUE](url))
```

**Components:**

| Component | Required | Example | Rules |
|-----------|----------|---------|-------|
| Bullet + bold title | ✅ Yes | `- **Feature Name**` | Capitalize each major word |
| Em-dash separator | ✅ Yes | ` — ` | Space before & after em-dash (U+2014) |
| Description | ✅ Yes | `descriptive text` | 1-2 sentences, max 150 chars |
| PR link | ✅ REQUIRED | `([PR #1234](url))` | Full GitHub URL (required for every entry) |
| Issue link | Optional | `([#5678](url))` | Link parent/related issues only when applicable |

### Description Style Guide

**DO:**

- Be concise: 1-2 sentences maximum
- Start with action verb: "Added", "Fixed", "Implemented", "Removed"
- Explain the "why" if not obvious
- Include important context (impacts, migration, etc.)
- Use present tense: "Fixed X" not "Has fixed X"

**DON'T:**

- Write verbose multi-paragraph descriptions
- Repeat information from PR title
- Use internal jargon without explanation
- Include implementation details
- Write: "This PR does X and Y and Z and..."

### Length Limits

| Element | Max Length | Rationale |
|---------|-----------|-----------|
| Title | 60 characters | Scannable, fits in release notes |
| Description | 150 characters | Concise, not verbose |
| Full entry | 250 characters total | Readable in changelog view |

**Check length:**

```bash
# Title
echo "My Feature Title" | wc -c  # Should be < 60

# Description
echo "This is what the feature does in brief" | wc -c  # Should be < 150
```

### PR Link Requirement

**Every changelog entry MUST include a PR link.** This provides:

- Clear traceability to the implementation
- Ability to verify changes
- Context for users reading release notes
- Reference for future retrospectives

**Issue links are optional** and should only be included if:

- The PR addresses a specific GitHub issue
- The issue provides important context
- The issue is referenced in the PR description

**Invalid (no PR link):**

```markdown
- **New feature** — Added amazing functionality
```

**Valid (PR link required):**

```markdown
- **New feature** — Added amazing functionality. ([PR #1234](url))
```

**Valid (PR + optional issue link):**

```markdown
- **New feature** — Added amazing functionality. ([PR #1234](url), [#1050](url))
```

---

## Section Organization

Use these section headers in this order:

```markdown
## [Unreleased]

### Removed

- [entries]

### Deprecated

- [entries]

### Added

- [entries]

### Changed

- [entries]

### Fixed

- [entries]

### Security

- [entries]

## [X.Y.Z] — YYYY-MM-DD

[released version section]
```

**Why this order?** Matches Keep a Changelog standard. Breaking changes (Removed, Deprecated, Changed, Fixed) come before additive changes (Added) so readers see important notices first.

---

## Common Mistakes & How to Fix Them

### ❌ Mistake 1: Too Verbose

```markdown
- **New Agent for Auditing Websites** — This PR implements a comprehensive 
new website auditing agent that provides deep analysis of website performance, 
accessibility, SEO compliance, and user experience metrics. The agent integrates 
with PageSpeed Insights API and lighthouse for comprehensive auditing. It 
supports multiple providers (Claude, Copilot, OpenAI) and includes full 
documentation and configuration examples. Users can now use this agent to get 
detailed website audit reports in their preferred AI platform.
```

✅ **Fix:**

```markdown
- **Website Auditing Agent** — New multi-provider agent for PageSpeed and 
accessibility analysis. ([PR #1100](url), [#1050](url))
```

### ❌ Mistake 2: Missing Links

```markdown
- **Fixed changelog corruption bug** — The merge workflow was discarding 
section headers, corrupting the changelog structure.
```

✅ **Fix:**

```markdown
- **Fixed changelog structure corruption** — The merge workflow was discarding 
section headers. Fixed deduplication logic to preserve headers. ([PR #1275](url))
```

### ❌ Mistake 3: Non-Changelog Entry

```markdown
- **Added project planning document** — Created PROJECT_PLAN.md for changelog 
improvements initiative.
```

✅ **Fix:** (Don't include this at all—it's not user-facing)

### ❌ Mistake 4: Test-Only Changes

```markdown
- **Added test file for new feature** — Created test_new_feature.js with full 
test coverage.
```

✅ **Fix:** (Don't include this—tests are internal, not user-facing)

---

## Changelog Entry Checklist

**Use this before submitting a PR with CHANGELOG.md changes:**

- [ ] Entry is user-facing (not internal, test, or docs-only)
- [ ] Entry fits one section (Added, Fixed, Changed, etc.)
- [ ] Format: `- **Title** — description ([PR #N](url))`
- [ ] Title is <60 characters
- [ ] Description is <150 characters
- [ ] Title is capitalized properly
- [ ] Em-dash is correct (—, not -)
- [ ] All links are valid and point to real PRs/issues
- [ ] No duplicate entries in [Unreleased]
- [ ] Entry is under correct section header
- [ ] No internal jargon without explanation
- [ ] Entry is concise (1-2 sentences)

---

## When to Update CHANGELOG.md

**Always update CHANGELOG.md if:**

- You're adding a new user-facing feature
- You're fixing a user-impacting bug
- You're making a breaking change
- You're removing user-facing functionality
- You're fixing a security vulnerability

**Never update CHANGELOG.md for:**

- Test-only changes
- Internal refactoring
- Documentation-only updates
- Project planning documents
- CI/CD tool improvements (unless fixing broken shipping)
- Code quality improvements without functional change
- Generated files

---

## Questions?

- See `.github/CHANGELOG_CONTRIBUTOR_CHECKLIST.md` for PR submission checklist
- See `CHANGELOG_VALIDATION_RULES.cjs` for automated validation rules
- See `.github/projects/active/changelog-automation-hardening/PROJECT_PLAN.md` for strategic overview
- Refer to <https://keepachangelog.com/en/1.1.0/> for official standard

---

**Last Updated:** 2026-07-24  
**Maintained By:** Changelog & Release Engineering Team
