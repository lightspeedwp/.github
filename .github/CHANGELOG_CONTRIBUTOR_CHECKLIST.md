---
title: Changelog Contributor Checklist
description: Pre-submission validation checklist for changelog entries
last_updated: '2026-08-27'
---

# Changelog Contributor Checklist

Before submitting a pull request with changelog modifications, verify your entry against this checklist.

## Entry Format Checklist

- [ ] **Starts with bullet point** — Entry begins with `- `
- [ ] **Bold title** — Title wrapped in `**...**` (e.g., `**Feature Name**`)
- [ ] **Em-dash separator** — Uses `—` (not `-` or `--`) between title and description
- [ ] **Title < 60 chars** — Keep title concise
- [ ] **Description < 150 chars** — Keep description brief and clear
- [ ] **PR link included** — Format: `([PR #1234](https://github.com/lightspeedwp/.github/pull/1234))`
- [ ] **Correct section** — Entry in proper category (Added/Changed/Fixed/Removed/Deprecated/Security)

## Structure Checklist

- [ ] **[Unreleased] section exists** — Required at top of file
- [ ] **No duplicate sections** — Each category appears once per version
- [ ] **Proper version format** — Uses `## [X.Y.Z] - YYYY-MM-DD` format
- [ ] **Sections ordered correctly** — Added, Fixed, Changed, Removed, Deprecated, Security
- [ ] **Dates are valid** — Use YYYY-MM-DD format (e.g., 2026-08-27)

## File Integrity Checklist

- [ ] **File not empty** — Changelog contains entries
- [ ] **UTF-8 encoding** — No corrupted characters
- [ ] **Balanced brackets** — All `[]` and `()` properly matched
- [ ] **No truncation** — File ends cleanly, no incomplete entries
- [ ] **Markdown links valid** — All `[text](url)` properly formatted

## Content Checklist

- [ ] **Describes user-facing change** — End-users understand what changed
- [ ] **No internal jargon** — Avoid implementation details
- [ ] **Links to PR/issue** — Provides traceability
- [ ] **Consistent with style** — Matches existing entries' tone and format

## Running Validation

Automated validation catches many issues:

```bash
# Validate locally before commit
npm run validate:changelog

# Or use pre-commit hook (automatic on git commit)
git commit -m "docs: Add changelog entry for PR #2394"
```

## Example Entry

```markdown
- **AI Write Protection** — Prevent invalid changelog commits with pre-commit hook validation ([PR #2394](https://github.com/lightspeedwp/.github/pull/2394))
```

## Need Help?

- **[Changelog Guidelines](./.github/projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md)** — Detailed format rules
- **[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)** — Official specification
- **[Changelog Safety Audit Docs](./docs/CHANGELOG_AUTOMATION.md)** — Complete automation documentation

---

_Generated as part of Phase 2: Write Protection & Audit Logging (Issue #2382)_
