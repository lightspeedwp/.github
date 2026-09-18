---
title: Changelog Pre-Release Audit Checklist
description: Step-by-step process for finalizing and validating changelog entries before release
version: 1.0.0
date: 2026-09-17
---

# Changelog Pre-Release Audit Checklist

**Release Manager:** _________________  
**Release Date:** _________________  
**Target Version:** _________________

---

## Overview

This checklist ensures changelog entries meet quality standards before release:

- **250 character maximum** per entry
- **PR links** present and valid
- **Issue links** present where applicable
- **No implementation details** (technical jargon, code references)
- **User-focused language** (what customer/user gets, not how it was built)

**Current Status:** Use `node scripts/changelog-pre-release-validator.js` to generate baseline report

---

## Phase 1: Pre-Audit Preparation

- [ ] **1.1** Run baseline validation report:

  ```bash
  node scripts/changelog-pre-release-validator.js --changelog CHANGELOG.md --format text
  ```

  Save output to: `_baseline-report.txt`

- [ ] **1.2** Document baseline metrics:
  - Total entries: __________
  - Compliant entries: __________
  - Compliance %: __________
  - Critical issues: __________

- [ ] **1.3** Review CHANGELOG.md structure:
  - [ ] `[Unreleased]` section exists
  - [ ] Section headers present (Added, Changed, Fixed, etc.)
  - [ ] All entries formatted as markdown list items (`-`)

---

## Phase 2: Entry-by-Entry Audit

### Instructions

For each entry in the [Unreleased] section, complete the following checks:

| # | Entry Text | Length | ✓ PR Link | ✓ Issue Link | Impl Details? | Action | Status |
|---|---|---|---|---|---|---|---|
| 1 | | / 250 | [ ] | [ ] | [ ] | | |
| 2 | | / 250 | [ ] | [ ] | [ ] | | |
| 3 | | / 250 | [ ] | [ ] | [ ] | | |
| 4 | | / 250 | [ ] | [ ] | [ ] | | |
| 5 | | / 250 | [ ] | [ ] | [ ] | | |
| 6 | | / 250 | [ ] | [ ] | [ ] | | |
| 7 | | / 250 | [ ] | [ ] | [ ] | | |
| 8 | | / 250 | [ ] | [ ] | [ ] | | |

**Action codes:**

- `OK` — Entry compliant, no changes needed
- `EDIT` — Entry requires refactoring
- `ADD-LINK` — Entry needs issue link added
- `REWRITE` — Entry exceeds 250 chars or contains implementation details

---

## Phase 3: Detailed Refactoring

For each entry marked `EDIT` or `REWRITE`, complete one refactoring task:

### Task: Refactor Entry #_____

**Original entry:**

```
[paste full entry text here]
```

**Issues to fix:**

- [ ] Length: ____ chars (over by ____ chars)
- [ ] Missing PR link: ____
- [ ] Missing issue link: ____
- [ ] Implementation keywords: ____________________

**Refactoring instructions:**

1. **Identify the user impact** — What does the user/customer benefit from this change?

   *Answer:*

2. **Remove implementation details** — Delete technical jargon (code files, method names, framework-specific terms, library references):

   Original: ___________________________________________________________________

   Cleaned: ____________________________________________________________________

3. **Add PR link** if missing:

   ```
   [GitHub PR](https://github.com/lightspeedwp/.github/pull/NNNN)
   ```

4. **Add issue link** if missing (check related PR for linked issues):

   ```
   [GitHub Issue](https://github.com/lightspeedwp/.github/issues/NNNN)
   ```

5. **Refactored entry** (must be ≤ 250 chars):

   ```
   [new entry text with links]
   ```

6. **Verification:**
   - [ ] Length ≤ 250 chars: ____ chars
   - [ ] Contains PR link: [ ]
   - [ ] Contains issue link: [ ]
   - [ ] No implementation keywords: [ ]
   - [ ] User-focused language: [ ]

---

## Phase 4: Add Missing Issue Links

Some entries may have PR links but missing issue links. Follow this workflow:

### Task: Add Issue Link to Entry #_____

**Current entry:**

```
[entry text]
```

**Workflow:**

1. Extract PR number from entry:

   ```
   PR #: ____
   ```

2. Fetch PR details to find linked issues:

   ```bash
   gh pr view NNNN --json body,title,commits
   ```

3. Parse PR body for issue references (look for `closes #NNNN` or `fixes #NNNN`):

   ```
   Issue(s) found: #___, #___, #___
   ```

4. If no issues found, search for related issues by keyword:

   ```bash
   gh issue list --search "KEYWORD"
   ```

5. Add issue link to entry:

   ```markdown
   - [User-facing description](#NNNN, [Issue #NNNN](https://github.com/lightspeedwp/.github/issues/NNNN))
   ```

6. **Verification:**
   - [ ] Issue link is valid (returns GitHub issue page)
   - [ ] Issue is semantically related to the change
   - [ ] Entry length still ≤ 250 chars

---

## Phase 5: Final Validation

- [ ] **5.1** Run final validation report:

  ```bash
  node scripts/changelog-pre-release-validator.js --changelog CHANGELOG.md --format text
  ```

  Save output to: `_final-report.txt`

- [ ] **5.2** Document final metrics:
  - Total entries: __________
  - Compliant entries: __________
  - Compliance %: __________
  - Issues remaining: __________

- [ ] **5.3** Compliance gates:
  - [ ] Compliance ≥ 95% **OR** executive approval for < 95%
  - [ ] All error-level violations resolved
  - [ ] All warning-level violations reviewed
  - [ ] Zero entries with implementation details

- [ ] **5.4** Release decision:
  - [ ] **✓ APPROVED** — Proceed to version bump and release
  - [ ] **⚠ CONDITIONAL** — Approved with documented exceptions: ________________________
  - [ ] **✗ BLOCKED** — Cannot proceed; issues must be resolved first

---

## Phase 6: Release Handoff

- [ ] **6.1** Copy final validated CHANGELOG.md to release notes template

- [ ] **6.2** Generate release notes in GitHub:

  ```bash
  # Automated (planned for Phase 5):
  node agents/changelog/changelog.agent.js processChangelog ./CHANGELOG.md VERSION DATE
  ```

- [ ] **6.3** Verify release notes:
  - [ ] All entries appear correctly
  - [ ] PR links are clickable and valid
  - [ ] Issue links are clickable and valid
  - [ ] Formatting is consistent (em-dashes, capitalization)

- [ ] **6.4** Publish release to GitHub Releases

---

## Reference: Implementation Keyword Blocklist

The validator flags these keywords as implementation details (rewrite entry if present):

```
refactored, optimised, optimized, patched, implemented, deployed,
migrated, restructured, reorganised, reorganized, logic, algorithm,
framework, component, module, hook, middleware, REST API, GraphQL,
database, query, cache, transaction, service, endpoint, function,
class, method, refactor, update, fix, modify, change
```

If your entry needs one of these words, reframe it from the **user perspective**:

| ❌ Don't Say | ✅ Say Instead |
|---|---|
| "Refactored authentication logic" | "Improved login reliability and speed" |
| "Fixed database query performance" | "Faster data loading in reports" |
| "Updated REST API response format" | "Cleaner integration responses" |
| "Implemented caching mechanism" | "Faster page loads and reduced server load" |
| "Migrated to GraphQL" | "Simplified API with flexible queries" |

---

## Sign-Off

**Release Manager:** _________________________ **Date:** _________

**Release Lead:** _________________________ **Date:** _________

**QA Sign-off:** _________________________ **Date:** _________

---

## Appendix A: Automated Validation Script

**Location:** `scripts/changelog-pre-release-validator.js`

**Usage:**

```bash
# Text report (colored terminal output)
node scripts/changelog-pre-release-validator.js --changelog CHANGELOG.md --format text

# JSON report (for parsing by other tools)
node scripts/changelog-pre-release-validator.js --changelog CHANGELOG.md --format json
```

**Exit codes:**

- `0` — Compliance ≥ 95% (release approved)
- `1` — Compliance < 95% (release blocked, requires review)

---

## Appendix B: Related Resources

- **[Phase 5 Changelog Quality Audit Spec](../.github/specs/003-changelog-quality-audit/spec.md)** — Full specification with 7-week implementation roadmap
- **[Changelog Agent README](../agents/changelog/README.md)** — API reference and validation rules
- **[Keep a Changelog Standard](https://keepachangelog.com/en/1.1.0/)** — Format specification
- **[GitHub PR Template](.github/PULL_REQUEST_TEMPLATE/)** — Template structure for PR links

---

*Maintained by 🚀 LightSpeedWP Automation Team — Changelog Quality Assurance*

*Last updated: 2026-09-17*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_
