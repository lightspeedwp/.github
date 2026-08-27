---
file_type: documentation
title: Changelog Contributor Checklist
description: Pre-submission checklist for changelog entries with format validation and compliance requirements
created_date: '2026-08-20'
last_updated: '2026-08-21'
status: active
tags:
  - changelog
  - contributor-guide
  - validation
owners:
  - lightspeedwp/maintainers
---

# Changelog Entry Checklist

Use this checklist when your PR includes changes worth documenting in CHANGELOG.md.

## Before You Start

- [ ] Your PR is ready for review
- [ ] You understand what a "user-facing change" is
- [ ] You've read [`CHANGELOG_GUIDELINES.md`](./projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md) for examples

## Entry Content

- [ ] Entry is **user-facing** (not internal refactor, docs-only, test-only)
- [ ] Entry fits **one approved section**: Added, Fixed, Changed, Removed, Deprecated, or Security
- [ ] Entry is **not redundant** with existing entries in [Unreleased]
- [ ] Entry describes **what changed**, not how you changed it

## Entry Format

- [ ] Entry starts with bullet: `-`
- [ ] Title is in bold: `**Title**`
- [ ] Em-dash separator (—) separates title from description: ` — `
- [ ] PR link is included: `([PR #1234](https://github.com/lightspeedwp/.github/pull/1234))`
- [ ] Issue link is included if applicable: `([#5678](https://github.com/lightspeedwp/.github/issues/5678))`
- [ ] No extra square brackets or formatting

## Entry Length

- [ ] Title is **<60 characters** (use: `echo "My Title" | wc -c`)
- [ ] Description is **<150 characters** (use: `echo "My description" | wc -c`)
- [ ] Description is **1-2 sentences maximum**
- [ ] Description **explains the why**, not the how

## Verification

- [ ] Entry is under the **correct section header** (### Added, ### Fixed, etc.)
- [ ] All referenced PR numbers are **correct and functional**
- [ ] All referenced issue numbers are **correct and functional**
- [ ] Links point to **GitHub URLs** (<https://github.com/>...)
- [ ] No **internal jargon** without explanation

## Pre-Submission

- [ ] Run validation: `npm run validate:changelog`
- [ ] All validation **passes** (no errors)
- [ ] All validation **warnings addressed**
- [ ] Entry **matches the examples** in CHANGELOG_GUIDELINES.md

## Example ✅ Good Entry

```markdown
- **Website Auditing Agent** — New multi-provider agent for PageSpeed and accessibility analysis. ([PR #1100](https://github.com/lightspeedwp/.github/pull/1100), [#1050](https://github.com/lightspeedwp/.github/issues/1050))
```

## Example ❌ Bad Entry

```markdown
- Added a new agent for auditing - this agent can check website performance and accessibility using PageSpeed Insights API and Lighthouse. It works with Claude, GitHub Copilot, and OpenAI and includes documentation.
```

**Why it's bad:**

- Uses hyphen (-) instead of em-dash (—)
- Too verbose (way over 150 chars for description)
- Doesn't include PR link (required)
- Title not in bold
- Multiple sentences in description (max 2)

---

## Questions?

- See [`CHANGELOG_GUIDELINES.md`](./projects/active/changelog-automation-hardening/CHANGELOG_GUIDELINES.md) for detailed rules
- See [`PROJECT_PLAN.md`](./projects/active/changelog-automation-hardening/PROJECT_PLAN.md) for the hardening initiative
- Reference <https://keepachangelog.com/en/1.1.0/> for the official standard

---

**Last Updated:** 2026-07-24
**Maintained By:** Changelog & Release Engineering Team

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
