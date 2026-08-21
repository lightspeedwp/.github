---
file_type: instructions
title: Pull Request Creation Instructions
description: Canonical instructions for creating, labeling, and submitting Pull Requests in LightSpeedWP projects. Reference for templates, automation, and labeling strategy.
scope: organization-wide
version: 1.3.3
last_updated: '2026-08-21'
owners:
  - lightspeedwp/maintainers
tags:
  - pull requests
  - templates
  - frontmatter
  - automation
  - labels
  - branching
  - checklists
---

# LightSpeedWP Pull Request (PR) Creation Instructions

You are a pull request quality partner. Follow our PR templates, branching, and labelling standards to open review-ready pull requests. Avoid YAML PR forms, missing required labels, or branches that break naming rules.

## Overview

Applies to all PR templates and submissions. Covers frontmatter, branching, templates, labelling, automation, and lifecycle expectations. Excludes issue creation (see `issues.instructions.md`).

## General Rules

- Use Markdown PR templates with required frontmatter; avoid YAML forms.
- Follow branch naming patterns and ensure one-hot label families (`status:*`, `priority:*`, `release:*`, `type:*`).
- Complete all template fields, checklists, and changelog sections.
- Keep PRs automation-ready; monitor CI and respond to reviews promptly.
- Maximise metadata completeness on every PR update. Populate all applicable
  metadata fields: labels, PR type, project fields, milestone, assignees,
  projects, linked issues, and dependency relationships.

## Detailed Guidance

- Follow the numbered sections below for templates, frontmatter, branch naming, opening steps, labelling, and review lifecycle.
- Align with labeler rules and release automation guidance.

## Examples

- **Good:** `feat/feature-name` branch using Feature template with required labels, linked issues, and completed checklist.
- **Avoid:** PRs from improperly named branches, missing labels, or empty template sections.

## Validation

- Ensure PR uses correct template with complete frontmatter.
- Verify labels meet required families and branch naming matches patterns.
- Confirm CI (lint/test/build) passes and checklists are completed.

This document defines the standards, steps, and requirements for opening, labeling, and maintaining Pull Requests (PRs) in LightSpeedWP repositories. All contributors, bots, and maintainers **must** follow these instructions to ensure automation, traceability, and high-quality code review.

---

## 1. Use Markdown PR Templates with YAML Frontmatter

- All PR templates are Markdown (`.md`) files with a YAML frontmatter block, stored in:
  - `.github/PULL_REQUEST_TEMPLATE.md` (general/default)
  - `.github/PULL_REQUEST_TEMPLATE/*.md` (specific templates: feature, bugfix, chore, docs, release, etc.)
- **Do NOT use YAML form PR templates.** All automation and labeling requires Markdown-based templates.

See [PR Creation Process](../docs/PR_CREATION_PROCESS.md) for specifications.

---

## 2. Required PR Frontmatter Fields

Each PR template **must** begin with a YAML frontmatter block, for example:

```yaml
---
title: "feat: {short summary}"
description: "New features or enhancements"
labels: ["type:feature", "status:needs-review", "area:feature"]
---
```

**Required fields:**

- `title`: Default PR title (use `{short summary}` or similar).
- `description`: Short description of template purpose.
- `labels`: Array of default labels for new PRs.

**Optional fields:**

- `assignees`: Default assignees.
- `projects`: Default project boards.

PR templates in this repository use repo-local frontmatter metadata. Keep the `description` field for PR template summaries and do not mirror the issue-template `about` field into PR templates.

See [frontmatter instructions](./documentation-formats.instructions.md) and [frontmatter schema](../.schemas/frontmatter.schema.json) for validation.

---

## 3. Branch Naming Requirements

- **Follow the canonical branch naming pattern:**
  `{type}/{scope}-{short-title}`
  - Examples: `feat/block-editor-colors`, `fix/theme-json-colors`, `docs/readme-update`
- **Allowed prefixes** map directly to PR type and automation:
  - `feat/`, `fix/`, `hotfix/`, `release/`, `refactor/`, `chore/`, `docs/`, `test/`, `perf/`, `ci/`, `build/`, `deps/`, `design/`, `a11y/`, `ux/`, `i18n/`, `ops/`, and more (see [BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md)).
- PRs from incorrectly named branches may be blocked by CI.

See [BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md) for full details and enforcement regex.

---

## 4. How to Open a Pull Request

### Step-by-Step

1. **Update your branch** (rebase/merge latest main or develop).
2. **Choose the correct PR template** when opening your PR. Templates are:
   - Bugfix, Feature, Chore, Docs, Build/CI, Refactor, Hotfix, Release, General, etc.
   - For template details, see `.github/PULL_REQUEST_TEMPLATE/*.md` and [PR Creation Process](../docs/PR_CREATION_PROCESS.md).
3. **Fill out all required fields** in the template:
   - **Linked issues:** Use `Closes #123` or similar.
   - **Description:** Clearly state *what* changed and *why*.
   - **Changelog section:** [Required for release automation.]
   - **Checklist:** Complete all items, including explicit accessibility and security checks.

4. **Write a clear title**
   Format: `[Type] Area/Component: Brief summary (Closes #issue)`
   Example: `[Feature] Block Patterns: Add new testimonial pattern (Closes #201)`

5. **Review and confirm labels**
   - Labels are auto-applied via frontmatter and `.github/labeler.yml` based on branch prefix and file paths.
   - **Minimum required labels:**
     - One `status:*` (e.g. `status:needs-review`)
     - One `type:*` (e.g. `type:feature`, `type:bug`, etc.)
     - One `priority:*` (e.g. `priority:normal`)
     - At least one `area:*` or `comp:*` if possible
     - One `release:*` (e.g. `release:patch`, `release:minor`, `release:major`)

- See [LABEL_STRATEGY.md](../docs/LABEL_STRATEGY.md) and [LABELING.md#pull-request-labelling](../docs/LABELING.md#pull-request-labelling).

1. **Assign milestones/projects** if applicable.

2. **Open the PR** and monitor CI, review, and status checks.

---

## 5. Labeling & Automation

- **Labeler automation:**
  - `.github/labeler.yml` maps branch prefixes and file globs to labels.
  - Branch prefix sets `type:*` and `status:needs-review`.
  - File paths set `area:*`, `comp:*`, `lang:*`, etc.
- **Workflows enforce:**
  - Only one `status:*`, one `priority:*`, one `release:*` at a time
  - Changelog label (`meta:needs-changelog`) is added if missing
  - PRs missing required labels cannot be merged; see [missing-labels.md](../.github/SAVED_REPLIES/pull-requests/missing-labels.md)

- **Release automation:**
  - PRs grouped and versioned based on `release:*` label ([release-label-guidance.md](../.github/SAVED_REPLIES/pull-requests/release-label-guidance.md))
  - Changelog section in PR description required ([changelog-required.md](../.github/SAVED_REPLIES/pull-requests/changelog-required.md))
  - Release workflow ([labeling.yml](../.github/workflows/labeling.yml)) automates changelog, labeling, and review steps.

### Metadata Completeness Default

- Treat metadata completeness as mandatory, not optional, during PR triage and updates.
- Always set or verify one-hot label families (`status:*`, `priority:*`, `type:*`, `release:*`) and relevant `area:*` or `comp:*` labels.
- Always set or verify milestone when the PR targets a release train or milestone bucket.
- Always set or verify project fields (for example `Status`, `Priority`, `Type`) when the PR is on a project board.
- Always set or verify relationships where applicable:
  - Linked issues using closing keywords (`Closes #123`) when true
  - Dependencies (`blocked by`, `depends on`) in PR body or linked issue graph
  - Parent feature or epic issue references
- If a metadata value cannot be inferred safely, leave it unchanged and record a short follow-up note describing what is missing.

---

## 6. PR Review & Lifecycle

- **Checklist must be completed** (tests, docs, linked issues, CI, and explicit accessibility/security checks).
- **Accessibility baseline:** Confirm semantic structure, keyboard/focus behaviour, and contrast/non-colour cues against WCAG 2.1 AA or higher.
- **Security baseline:** Confirm validation/sanitisation, context-specific escaping, nonce/capability checks where relevant, and OWASP risk review.
- **CI and all status checks must pass.**
- **Respond promptly to reviewer feedback**; see [awaiting-author.md](../.github/SAVED_REPLIES/pull-requests/awaiting-author.md)
- **Ready for review:** Mark as ready and ping reviewers; see [ready-for-review.md](../.github/SAVED_REPLIES/pull-requests/ready-for-review.md)
- **Draft PRs:** Use draft status for early feedback; see [draft-pr.md](../.github/SAVED_REPLIES/pull-requests/draft-pr.md)
- **Merge discipline:** Use squash & merge, delete branch, resolve all conversations; see [merge-discipline.md](../.github/SAVED_REPLIES/pull-requests/merge-discipline.md)

---

## 7. Reference Files and Checklists

- **Templates:**
  - [pull_request_template.md](../.github/pull_request_template.md)
  - [All PR templates](../.github/PULL_REQUEST_TEMPLATE/)
- **Labeling:**
  - [labeler.yml](../.github/labeler.yml)
  - [labels.yml](../.github/labels.yml)
  - [LABELING.md#pull-request-labelling](../docs/LABELING.md#pull-request-labelling)
- **Branching:**
  - [BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md)
- **Saved Replies:**
  - [Pull Request Saved Replies](../.github/SAVED_REPLIES/pull-requests/)
- **Frontmatter:**
  - [Frontmatter Schema Guide](../docs/FRONTMATTER_SCHEMA.md)
  - [Frontmatter Schema](../.schemas/frontmatter.schema.json)

---

## 8. Tips for Excellent PRs

- **Link all related issues with closing keywords.**
- **Add screenshots or recordings for UI/visual changes.**
- **Keep PRs focused and small; split large changes.**
- **Use clear, actionable commit messages.**
- **Update documentation when behavior changes.**
- **Use the correct template for your change type.**
- **Double-check all checklists before marking ready for review.**
- **Always follow org-wide [Coding Standards](../instructions/coding-standards.instructions.md).**

---

## 9. Common Saved Replies & Guidance

For maintainers and reviewers, reference these [Saved Replies](../.github/SAVED_REPLIES/pull-requests/) for standard feedback:

- [Code Review](../.github/SAVED_REPLIES/pull-requests/code-review.md)
- [Testing](../.github/SAVED_REPLIES/pull-requests/testing.md)
- [Changelog Required](../.github/SAVED_REPLIES/pull-requests/changelog-required.md)
- [Release Label Guidance](../.github/SAVED_REPLIES/pull-requests/release-label-guidance.md)
- [Missing Labels](../.github/SAVED_REPLIES/pull-requests/missing-labels.md)
- [Branch Naming](../.github/SAVED_REPLIES/pull-requests/branch-naming.md)
- [Merge Discipline](../.github/SAVED_REPLIES/pull-requests/merge-discipline.md)
- [Ready for Review](../.github/SAVED_REPLIES/pull-requests/ready-for-review.md)
- [Needs QA](../.github/SAVED_REPLIES/pull-requests/needs-qa.md)
- [Performance](../.github/SAVED_REPLIES/pull-requests/performance.md)
- [Security](../.github/SAVED_REPLIES/pull-requests/security.md)
- [Area Routing](../.github/SAVED_REPLIES/pull-requests/area-routing.md)
- [AI Assist](../.github/SAVED_REPLIES/pull-requests/ai-assist.md)
- [Closing Inactive PRs](../.github/SAVED_REPLIES/pull-requests/closing-inactive.md)
- ...and more.

---

## Related Files

- **[issues.instructions.md](./issues.instructions.md)** — Companion guide for issue creation and labeling; mirrors PR workflow patterns
- **[labeling.instructions.md](./labeling.instructions.md)** — Detailed label naming conventions and one-hot rules
- **[coding-standards.instructions.md](./coding-standards.instructions.md)** — Code quality standards referenced in PR templates

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
