---
title: Labeling Strategy & Governance
description: Label taxonomy, automation rules, and governance for LightSpeed repositories.
file_type: documentation
version: v1.1.1
last_updated: '2026-08-21'
author: LightSpeed Team
maintainer: LightSpeed Team
owners:
  - lightspeedwp
tags:
  - labels
  - automation
  - governance
  - colours
  - accessibility
  - validation
---

# GitHub Labelling & Automation

This document describes how LightSpeed uses GitHub labels to power automation, search, workflow routing, and community management across all repositories—including issues, pull requests (PRs), and discussions.

---

## Table of Contents

1. [Purpose & Principles](#purpose--principles)
2. [Label Categories & Families](#label-categories--families)
3. [Issue Labelling](#issue-labelling)
4. [Pull Request Labelling](#pull-request-labelling)
5. [Discussion Labelling](#discussion-labelling)
6. [Automation & Agent Integration](#automation--agent-integration)
7. [Pre-Creation Label Validation (Phase 3)](#pre-creation-label-validation-phase-3)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Purpose & Principles

- **Clarity & Automation:** Labels provide high-signal metadata for automation, project boards, and contributors.
- **Consistency:** All repositories follow a shared, canonical taxonomy (see `.github/labels.yml`).
- **Discoverability:** Labels make it easy to filter, search, and report on work across code, docs, and community.
- **Community Engagement:** Dedicated labels for discussions and non-code topics ensure inclusive collaboration.
- **One-hot principle:** Only one value per label group (e.g., one `priority:*`, one `status:*`).

---

## Colour Strategy

All label colours derive from the canonical 8-family palette defined in [`docs/LABEL_COLOR_STRATEGY.md`](./LABEL_COLOR_STRATEGY.md). Each family has a primary (WCAG AA ≥ 4.5:1 against white), a secondary, and a light tertiary for label backgrounds.

| Family | Semantic use | Primary | Secondary | Tertiary |
| --- | --- | --- | --- | --- |
| **Green** | Ready / Done | `#1A7F37` | `#2A7A3B` | `#ABEBC6` |
| **Blue** | Planning / Review | `#0969DA` | `#3467D3` | `#C5DEF5` |
| **Yellow** | Testing / Audit | `#D29922` | `#F2D06D` | `#FCE2B7` |
| **Red** | Blocked / Impediment | `#CF222E` | `#B91C1C` | `#FCE2E2` |
| **Orange** | On-Hold / Deferred | `#9A6700` | `#D5A87B` | `#FDBF7C` |
| **Purple** | Design / UX | `#8957E5` | `#B4A7E8` | `#D89AF6` |
| **Gray** | Meta / Infrastructure | `#57606A` | `#B1BAC4` | `#D0D7DE` |
| **Teal** | Integration / Deps | `#007580` | `#0D7F6F` | `#9FE1E3` |

Tertiary pastels are used as GitHub label backgrounds only (GitHub renders black text on light backgrounds automatically). Primary and secondary colours pass WCAG 2.2 AA (≥ 4.5:1) for use as foreground text on white.

---

## Label Categories & Families

All canonical labels use a family prefix. The organisation recognises the following label families:

### Status Labels (`status:*`)

Indicate the current progress or state of an issue or PR:

- `status:needs-triage` — New, not yet reviewed
- `status:ready` — Clear requirements, ready to work
- `status:in-progress` — Someone is actively working
- `status:needs-review` — Waiting for review/approval
- `status:blocked` — Blocked by another issue or dependency
- `status:done` — Completed and closed
- `status:wontfix` — Intentionally closed as not actionable

**Rule:** Each issue and PR has exactly one `status:*` label.

### Priority Labels (`priority:*`)

Indicate urgency and scheduling priority:

- `priority:critical` — Production/launch-blocking issue or severe defect
- `priority:important` — Must-do, high-impact work
- `priority:normal` — Standard feature or improvement (default)
- `priority:minor` — Nice-to-have, deferred work

**Rule:** Each issue and PR has exactly one `priority:*` label.

### Type Labels (`type:*`)

Classify the nature of the work:

- `type:bug` — Unexpected behaviour or error
- `type:feature` — New functionality
- `type:improve` — Enhancement to existing functionality or UX
- `type:enhancement` — Enhancement to existing capability
- `type:chore` — Maintenance, cleanup, tooling, or refactoring
- `type:documentation` — Documentation improvements
- `type:test` — Test suite additions or fixes
- `type:refactor` — Code quality improvements, no behaviour change
- `type:performance` — Performance optimisation
- `type:security` — Security-related changes
- `type:a11y` — Accessibility improvements
- `type:design` — Design-related work
- `type:release` — Release-related tasks
- `type:ci` — CI/CD pipeline work
- `type:automation` — Workflow automation and tooling
- `type:dependency` — Dependency management and updates

**Rule:** Each issue and PR has exactly one `type:*` label. For PRs, it's automatically assigned from the branch prefix; for issues, it's assigned from issue templates or manually. See `.github/labels.yml` for the full list of canonical type values.

### Area & Component Labels

**Area labels (`area:*`):** Indicate the high-level system or domain:

- `area:ci` — CI/CD pipelines and automation
- `area:dependencies` — Package and dependency management
- `area:documentation` — Docs, guides, examples
- `area:quality` — Quality validation and QA controls
- `area:a11y` — Accessibility standards
- `area:performance` — Performance optimisation
- Other areas as needed

**Component labels (`comp:*`):** For WordPress-specific or product areas:

- `comp:block-editor` — Gutenberg editor integration
- `comp:block-json` — Block JSON schema
- `comp:theme-json` — Theme JSON features
- `comp:templates` — Template system
- `comp:patterns` — Block pattern library
- Others as relevant to your projects

**Rule:** At least one `area:*` or `comp:*` label per issue/PR.

### Context Labels

Provide additional context:

- **Environment:** `env:live` (production), `env:staging`, `env:prototype` (sandbox/dev)
- **Compatibility:** `compat:wordpress`, `compat:php`, `compat:woocommerce`, `compat:gutenberg`, `compat:rtl`, `compat:multisite`
- **Language/Format:** `lang:php`, `lang:js`, `lang:css`, `lang:html`, `lang:md`, `lang:json`, `lang:yaml`
- Others as defined per project

### Meta & Release Labels (`meta:*`, `release:*`)

For release hygiene and workflow signals:

- `meta:needs-changelog` — Requires a CHANGELOG.md entry (enforced on PRs)
- `meta:no-changelog` — Explicitly no changelog needed (internal-only changes)
- `meta:has-pr` — Issue has a linked PR
- `meta:no-issue-activity` — No activity for 30+ days
- `meta:stale` — Marked for cleanup/archival
- `meta:dependabot-security` — Security update from Dependabot
- `release:patch` — Patch version bump required
- `release:minor` — Minor version bump required
- `release:major` — Major version bump required
- `release:hotfix` — Hotfix release required

**Rule:** Never apply both `meta:needs-changelog` and `meta:no-changelog` on the same PR.

### Contributor & Community Labels

**Contributor labels (`contrib:*`):**

- `contrib:good-first-issue` — Suitable for new contributors
- `contrib:help-wanted` — Needs community input or volunteers
- `contrib:discussion` — Topic for community discussion

**Discussion labels (`discussion:*`):**

- `discussion:community` — Social, networking, or open-ended topics
- `discussion:showcase` — User projects, demos, "Show & Tell"
- `discussion:announcement` — Official news and team updates
- `discussion:feedback` — Suggestions, UX feedback, ideas
- `discussion:support` — Help requests, troubleshooting (non-bug)
- `discussion:sponsorship` — Funding, GitHub Sponsors
- `discussion:partnership` — Collaboration, business, outreach

---

## Issue Labelling

### Required Labels per Issue

Every issue must have:

- **One** `status:*` (e.g., `status:needs-triage`, then progressing to `status:ready`, `status:in-progress`, etc.)
- **One** `priority:*` (e.g., `priority:normal`)
- **One** `type:*` (e.g., `type:bug`, `type:feature`)
- **At least one** `area:*` or `comp:*` (e.g., `area:ci`, `comp:block-editor`)
- **Contextual labels** as needed (`phase:6`, `meta:needs-changelog`, `contrib:good-first-issue`)

### Application Methods

- **Automated:** Issue templates auto-assign initial labels (`type:*`, `priority:*`, `status:needs-triage`)
- **Manual curation:** Triage and maintainers adjust labels as issue status changes or scope evolves
- **Labeler rules:** `.github/labeler.yml` can auto-apply labels based on file paths, branch prefixes

### Automation & Enforcement

- The unified labeling agent enforces one-hot rules (exactly one status, one priority, one type)
- The agent removes non-canonical labels or migrates them to canonical equivalents
- Project board auto-triage uses status labels to organize work
- Changelog and release labels (`meta:needs-changelog`, `release:*`) drive release automation

---

## Pull Request Labelling

### Required Labels per PR

Every PR must have:

- **One** `status:*` (automatically set to `status:needs-review` on open)
- **One** `type:*` (automatically matched from branch prefix: `feat/` → `type:feature`, `fix/` → `type:bug`, etc.)
- **One** `priority:*` (derived from branch prefix or set manually; defaults to `priority:normal`)
- **At least one** `area:*` or `comp:*`
- **Release label:** `release:patch`, `release:minor`, or `release:major` (required for shipping PRs)
- **Meta labels:** `meta:needs-changelog` or `meta:no-changelog` (enforced; cannot have both)

### Branch Prefix Mapping

PR branch names automatically assign `type:*` labels:

**Core prefixes:**

- `feat/` → `type:feature`
- `fix/` → `type:bug`
- `hotfix/` → `type:bug` + `release:hotfix`
- `refactor/` → `type:refactor`
- `perf/` → `type:performance`
- `docs/` → `type:documentation`
- `test/` → `type:test`
- `chore/` → `type:chore`
- `ci/` → `type:ci` + `area:ci`
- `deps/` → `type:dependency` + `area:dependencies`
- `security/` → `type:security`
- `a11y/` → `type:a11y`
- `build/` → `type:build`

**Optional prefixes** (as needed for your projects):

- `proto/`, `ds/`, `api/`, `schemas/` — Product/design system
- `content/`, `seo/`, `config/`, `migrate/` — Client/project specific

### Changelog Policy

- **User-facing changes** must have `meta:needs-changelog` (a CHANGELOG.md entry is required for merge)
- **Internal-only changes** (refactoring, testing, CI) can use `meta:no-changelog` to skip changelog requirement
- **Never apply both** `meta:needs-changelog` and `meta:no-changelog` on the same PR

### Automation & Enforcement

- Labeler automatically applies labels based on branch name and file changes
- Changelog validation blocks merges if a user-facing PR lacks a changelog entry or required label
- Status transitions follow one-hot rules (only one status at a time)
- Release labels guide automated changelog compilation and semantic versioning

---

## Discussion Labelling

### Purpose

Discussion labels organize community conversations by topic, making it easy for users to find relevant threads and for moderators to filter and prioritize.

### Available Labels

- `discussion:community` — Social, networking, or open-ended topics
- `discussion:showcase` — User projects, demos, "Show & Tell"
- `discussion:announcement` — Official news and team updates
- `discussion:feedback` — Suggestions, UX feedback, general ideas
- `discussion:support` — "How do I…" setup, troubleshooting, help requests (non-bug)
- `discussion:sponsorship` — Funding, GitHub Sponsors, financial topics
- `discussion:partnership` — Collaboration, business, outreach

### Best Practices

- Encourage users to select a label when starting a new discussion
- Apply or update labels when moderating to keep threads organized
- Use labels to filter discussions when reviewing or responding
- A discussion can have multiple labels if it spans categories

---

## Automation & Agent Integration

### Unified Labelling Agent

All labelling, status enforcement, type assignment, and standardisation are handled by the **unified labelling agent** (`.github/scripts/agents/labeling.agent.js`) and **labelling workflow** (`.github/workflows/labeling.yml`).

**How it works:**

1. Triggered on issue/PR creation, edits, and label changes
2. Reads canonical configuration from `.github/labels.yml`, `.github/labeler.yml`, and `.github/issue-types.yml`
3. Applies automatic labels based on:
   - Branch prefixes (PRs only)
   - File path changes
   - PR body front matter
   - Content heuristics
4. Enforces one-hot rules (exactly one status, priority, type)
5. Removes non-canonical labels and migrates legacy labels
6. Generates reports for monitoring and debugging

### Agent Utilities

The agent orchestrates reusable utility modules in `scripts/agents/includes/`:

| Utility | Responsibility |
| --- | --- |
| `label-lookup.js` | Fetch canonical labels, build alias maps, find standard labels |
| `labeler-utils.js` | Apply labeler rules based on file/branch patterns |
| `label-sync.js` | Sync repository labels with canonical configuration |
| `status-enforcer.js` | Enforce one-hot status, priority, type labels |
| `label-reporting.js` | Build labelling and standardisation reports |
| `type-lookup.js` | Load issue types and find matches from titles/bodies |
| `label-heuristics.js` | Suggest labels from issue/PR content |

### Configuration Files

- `.github/labels.yml` — Canonical label definitions, colours, and aliases
- `.github/labeler.yml` — File/branch-based label rules
- `.github/issue-types.yml` — Canonical issue type definitions

All automation reads from these files; there is no hardcoded label logic in agents or workflows.

---

## Pre-Creation Label Validation (Phase 3)

To prevent bare labels and invalid label combinations, all issues and PRs are validated by an automated validation workflow after creation.

### How It Works

1. **Trigger:** Validation runs on issue/PR `opened`, `edited`, `labeled`, `unlabeled`, and PR `synchronize` events (after creation)
2. **Script:** `scripts/validation/validate-labels-before-creation.cjs` enforces 5 rules
3. **Workflow:** `.github/workflows/validate-issue-labels.yml` posts guidance on failure
4. **Outcome:** Valid labels pass silently; invalid labels receive a helpful error comment with corrected examples

### Validation Rules

| Rule | Requirement | Example ✅ | Example ❌ |
|------|-------------|-----------|-----------|
| **Rule 1: Existence** | Label must exist in canonical set (.github/labels.yml) | `type:bug` | `type:bugfix` |
| **Rule 2: Family Prefix** | Label must have family prefix (type:, status:, priority:, etc.) | `status:needs-triage` | `needs-triage` |
| **Rule 3: One-hot per Family** | Only one label per family (except meta:, comp:, lang:) | `type:bug`, `status:ready` | `type:bug`, `type:feature` |
| **Rule 4: Required Families** | All issues/PRs must have a `type:*` label | `type:documentation` | (no type:) |
| **Rule 5: Warnings** | Common mistakes flagged with suggestions | `type:bug` (after correction) | `bug` (bare, triggers warning) |

### Validation in Practice

**✅ Valid labels** (all rules pass):

```
type:bug
status:needs-triage
priority:critical
area:ci
meta:needs-changelog
```

**❌ Invalid labels** (caught by validation):

```
bug                    # ❌ Rule 2 (missing type: prefix)
feature                # ❌ Rule 2 (missing type: prefix)
type:bug, type:feature # ❌ Rule 3 (multiple type: labels)
status:ready           # ❌ Rule 4 (missing type:*)
urgent                 # ❌ Rule 2 (bare label, not in canonical set)
```

### Error Messages & Fixes

When validation fails, the workflow posts a comment with:

1. **Issue description** — What's wrong and why
2. **Valid examples** — Copy-paste ready label combinations
3. **Documentation link** — This page and other resources
4. **Canonical label reference** — Link to `.github/labels.yml` (158 total labels)

**Example error comment:**

> **⚠️ Label Validation Failed**
>
> **Labels on this issue:** `bug, feature, ci`
>
> **Issues:**
>
> - Label 'bug' missing required family prefix. Use one of: type:, status:, priority:, area:, meta:, release:, lang:, env:, compat:, comp:
> - Label 'feature' missing required family prefix. Use one of: type:, status:, priority:, area:, meta:, release:, lang:, env:, compat:, comp:
> - Label 'ci' missing required family prefix. Use one of: type:, status:, priority:, area:, meta:, release:, lang:, env:, compat:, comp:
>
> **How to fix:**
>
> 1. Use only canonical labels with family prefixes: `type:`, `status:`, `priority:`, `area:`, `meta:`, etc.
> 2. Check the [canonical labels](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) (158 total)
> 3. Each family allows ONE label (except `meta:` and `comp:` which allow multiple)
> 4. All issues/PRs must have a `type:*` label
>
> **Valid Examples:**
>
> ```
> type:bug, status:needs-triage, priority:critical, area:ci
> type:feature, priority:normal, area:documentation
> type:task, status:ready, area:automation
> ```

### Re-running Validation

If you receive a validation error:

1. **Remove bare labels** (bug, feature, urgent, ci, docs, etc.)
2. **Add family prefix** (type:bug, area:ci, priority:urgent → priority:critical, etc.)
3. **Edit the issue/PR** to apply corrected labels
4. **Validation re-runs automatically** when labels change

---

## Best Practices

1. **Keep exactly one `status:*` and `priority:*`** on every issue/PR.
2. **Use the most specific `area:*` or `comp:*`** for filtering and reporting.
3. **Update labels as work progresses** or if scope changes.
4. **Trust automation:** Let the labelling agent handle most label application; only manually adjust when needed.
5. **Refer to `.github/labels.yml`** as the source of truth for canonical labels.
6. **Use discussion labels** to keep conversations organised and welcoming.
7. **Review and clean up labels quarterly,** removing unused or redundant entries.
8. **Always provide `meta:needs-changelog` or `meta:no-changelog`** on PRs before merging.

---

## Troubleshooting

### Label Validation Errors

**"Label 'X' missing required family prefix"**

- The label isn't prefixed (e.g., `bug` instead of `type:bug`)
- **Fix:** Edit the issue/PR and apply canonical labels with family prefix (type:, status:, priority:, area:, etc.)
- **Reference:** See [Validation Rules](#validation-rules) above and `.github/labels.yml` for all 158 canonical labels

**"Label 'X' not found in canonical set"**

- The label doesn't exist in `.github/labels.yml` (typo or custom label)
- **Fix:** Use a canonical label from the 158-label set; custom labels are not allowed
- **Reference:** [Canonical labels](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml)

**"Multiple labels from family 'Y' found: [a, b]"**

- You applied more than one label from the same family (e.g., `type:bug` AND `type:feature`)
- **Fix:** Keep only one label per family (except meta:, comp:, lang: which allow multiples)
- **Reference:** [Validation Rules](#validation-rules) — one-hot per family

**"Missing required 'type:\*' label for classification"**

- The issue/PR has no `type:*` label (e.g., missing `type:bug`, `type:feature`, `type:task`)
- **Fix:** Add a `type:*` label that matches the work type
- **Reference:** [Type Labels](#type-labels-type) — choose the correct type for your issue/PR

**Validation failed but I don't see a comment**

- The issue/PR might not have raised a validation event yet
- **Fix:** Edit the issue/PR and save (even without label changes) to trigger validation re-run
- **Alternative:** Remove and re-apply labels to trigger the workflow

### Missing or Incorrect Labels?

- Check `.github/labels.yml` for missing/typo entries
- Verify branch prefix or file pattern matches in `.github/labeler.yml`
- Run `node scripts/agents/includes/check-template-labels.js` to validate issue/PR templates
- Use `scripts/validation/validate-labels-before-creation.cjs` to test labels locally

### Label Not Applied as Expected?

- Review labeler workflow logs in the PR/issue activity
- Check if the labelling workflow is enabled and up-to-date
- Verify the labelling agent has access to read/write labels
- Run the pre-creation validation script to check if labels are canonical

### Want to Add a New Label or Modify Rules?

1. Update `.github/labels.yml` with the new canonical definition
2. Update `.github/labeler.yml` if you need automatic application rules
3. Update this documentation to describe the new label
4. Create a PR and reference issue #636
5. **Note:** New labels must follow the family-prefix naming convention (e.g., `area:newarea`, not `newarea`)

### Non-Canonical Labels Appearing?

- The labelling agent automatically migrates old labels to canonical equivalents
- If a label persists, check `.github/label-governance-policy.yml` for exceptions
- Open an issue if a label should be migrated or removed
- Run `scripts/validation/validate-labels-before-creation.cjs` to test label canonicality

---

## References

- [Canonical Labels Config](../.github/labels.yml)
- [Label Colour Strategy](./LABEL_COLOR_STRATEGY.md)
- [Labeler Rules](../.github/labeler.yml)
- [Issue Types Config](../.github/issue-types.yml)
- [Labelling Workflow](../.github/workflows/labeling.yml)
- [Labelling Agent](../.github/scripts/agents/labeling.agent.js)
- [Issue Creation Standards](../instructions/issues.instructions.md)
- [PR Creation Standards](../instructions/pull-requests.instructions.md)

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
