---
title: "Pull Request Creation Instructions"
description: "Canonical instructions for creating, labeling, and submitting Pull Requests in LightSpeedWP projects. Reference for templates, automation, and labeling strategy."
version: "1.1"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["pull requests", "templates", "frontmatter", "automation", "labels", "branching", "checklists"]
type: "instructions"
---

# LightSpeedWP Pull Request (PR) Creation Instructions

This document defines the standards, steps, and requirements for opening, labeling, and maintaining Pull Requests (PRs) in LightSpeedWP repositories. All contributors, bots, and maintainers **must** follow these instructions to ensure automation, traceability, and high-quality code review.

---

## 1. Use Markdown PR Templates with YAML Frontmatter

- All PR templates are Markdown (`.md`) files with a YAML frontmatter block, stored in:
  - `.github/PULL_REQUEST_TEMPLATE.md` (general/default)
  - `.github/PULL_REQUEST_TEMPLATE/*.md` (specific templates: feature, bugfix, chore, docs, release, etc.)
- **Do NOT use YAML form PR templates.** All automation and labeling requires Markdown-based templates.

See [docs/frontmatter/pr-templates.md](../../docs/frontmatter/pr-templates.md) for specifications.

---

## 2. Required PR Frontmatter Fields

Each PR template **must** begin with a YAML frontmatter block, for example:

```yaml
---
name: "Feature PR"
about: "New features or enhancements"
title: "feat: {short summary}"
labels: ["type:feature", "status:needs-review", "area:feature"]
---
```

**Required fields:**
- `name`: Short label for the template selector.
- `about`: Short description of template purpose.
- `title`: Default PR title (use `{short summary}` or similar).
- `labels`: Array of default labels for new PRs.

**Optional fields:**
- `assignees`: Default assignees.
- `projects`: Default project boards.

See [frontmatter instructions](./frontmatter.instructions.md) and [frontmatter schema](../../schema/frontmatter.schema.json) for validation.

---

## 3. Branch Naming Requirements

- **Follow the canonical branch naming pattern:**  
  `{type}/{scope}-{short-title}`
  - Examples: `feat/block-editor-colors`, `fix/theme-json-colors`, `docs/readme-update`
- **Allowed prefixes** map directly to PR type and automation:
  - `feat/`, `fix/`, `hotfix/`, `release/`, `refactor/`, `chore/`, `docs/`, `test/`, `perf/`, `ci/`, `build/`, `deps/`, `design/`, `a11y/`, `ux/`, `i18n/`, `ops/`, and more (see [BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md)).
- PRs from incorrectly named branches may be blocked by CI.

See [BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md) for full details and enforcement regex.

---

## 4. How to Open a Pull Request

### Step-by-Step

1. **Update your branch** (rebase/merge latest main or develop).
2. **Choose the correct PR template** when opening your PR. Templates are:
    - Bugfix, Feature, Chore, Docs, Build/CI, Refactor, Hotfix, Release, General, etc.
    - For template details, see `.github/PULL_REQUEST_TEMPLATE/*.md` and [docs/frontmatter/pr-templates.md](../../docs/frontmatter/pr-templates.md).
3. **Fill out all required fields** in the template:
    - **Linked issues:** Use `Closes #123` or similar.
    - **Description:** Clearly state *what* changed and *why*.
    - **Changelog section:** [Required for release automation.]
    - **Checklist:** Complete all items (tests, docs, a11y, linked issues, CI, etc.).

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
    - See [LABEL_STRATEGY.md](../../docs/LABEL_STRATEGY.md) and [PR_LABELS.md](../PR_LABELS.md).

6. **Assign milestones/projects** if applicable.

7. **Open the PR** and monitor CI, review, and status checks.

---

## 5. Labeling & Automation

- **Labeler automation:**  
  - `.github/labeler.yml` maps branch prefixes and file globs to labels.  
  - Branch prefix sets `type:*` and `status:needs-review`.
  - File paths set `area:*`, `comp:*`, `lang:*`, etc.
- **Workflows enforce:**
  - Only one `status:*`, one `priority:*`, one `release:*` at a time
  - Changelog label (`meta:needs-changelog`) is added if missing
  - PRs missing required labels cannot be merged; see [missing-labels.md](../SAVED_REPLIES/pull-requests/missing-labels.md)

- **Release automation:**  
  - PRs grouped and versioned based on `release:*` label ([release-label-guidance.md](../SAVED_REPLIES/pull-requests/release-label-guidance.md))
  - Changelog section in PR description required ([changelog-required.md](../SAVED_REPLIES/pull-requests/changelog-required.md))
  - Release workflow ([labeling.yml](../workflows/labeling.yml)) automates changelog, labeling, and review steps.

---

## 6. PR Review & Lifecycle

- **Checklist must be completed** (tests, docs, a11y, linked issues, etc.).
- **CI and all status checks must pass.**
- **Respond promptly to reviewer feedback**; see [awaiting-author.md](../SAVED_REPLIES/pull-requests/awaiting-author.md)
- **Ready for review:** Mark as ready and ping reviewers; see [ready-for-review.md](../SAVED_REPLIES/pull-requests/ready-for-review.md)
- **Draft PRs:** Use draft status for early feedback; see [draft-pr.md](../SAVED_REPLIES/pull-requests/draft-pr.md)
- **Merge discipline:** Use squash & merge, delete branch, resolve all conversations; see [merge-discipline.md](../SAVED_REPLIES/pull-requests/merge-discipline.md)

---

## 7. Reference Files and Checklists

- **Templates:**  
  - [pull_request_template.md](../pull_request_template.md)  
  - [All PR templates](../PULL_REQUEST_TEMPLATE/)
- **Labeling:**  
  - [labeler.yml](../labeler.yml)  
  - [labels.yml](../labels.yml)  
  - [PR_LABELS.md](../PR_LABELS.md)
- **Branching:**  
  - [BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md)
- **Saved Replies:**  
  - [Pull Request Saved Replies](../SAVED_REPLIES/pull-requests/)
- **Frontmatter:**  
  - [frontmatter.instructions.md](./frontmatter.instructions.md)
  - [docs/frontmatter/pr-templates.md](../../docs/frontmatter/pr-templates.md)

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

For maintainers and reviewers, reference these [Saved Replies](../SAVED_REPLIES/pull-requests/) for standard feedback:

- [Code Review](../SAVED_REPLIES/pull-requests/code-review.md)
- [Testing](../SAVED_REPLIES/pull-requests/testing.md)
- [Changelog Required](../SAVED_REPLIES/pull-requests/changelog-required.md)
- [Release Label Guidance](../SAVED_REPLIES/pull-requests/release-label-guidance.md)
- [Missing Labels](../SAVED_REPLIES/pull-requests/missing-labels.md)
- [Branch Naming](../SAVED_REPLIES/pull-requests/branch-naming.md)
- [Merge Discipline](../SAVED_REPLIES/pull-requests/merge-discipline.md)
- [Ready for Review](../SAVED_REPLIES/pull-requests/ready-for-review.md)
- [Needs QA](../SAVED_REPLIES/pull-requests/needs-qa.md)
- [Performance](../SAVED_REPLIES/pull-requests/performance.md)
- [Security](../SAVED_REPLIES/pull-requests/security.md)
- [Area Routing](../SAVED_REPLIES/pull-requests/area-routing.md)
- [AI Assist](../SAVED_REPLIES/pull-requests/ai-assist.md)
- [Closing Inactive PRs](../SAVED_REPLIES/pull-requests/closing-inactive.md)
- ...and more.

---

## 10. References and Further Reading

- [PR Creation Process Guide](../../docs/PR_CREATION_PROCESS.md)
- [Label Strategy](../../docs/LABEL_STRATEGY.md)
- [Frontmatter PR Templates Guide](../../docs/frontmatter/pr-templates.md)
- [Label Definitions](../labels.yml)
- [Labeler Automation Rules](../labeler.yml)
- [PR Labels](../PR_LABELS.md)
- [Branching Strategy](../BRANCHING_STRATEGY.md)
- [pull_request_template.md](../pull_request_template.md)
- [All PR Templates](../PULL_REQUEST_TEMPLATE/)
- [Frontmatter Schema](../../schema/frontmatter.schema.json)
- [Frontmatter Instructions](./frontmatter.instructions.md)
- [Saved Replies](../SAVED_REPLIES/pull-requests/)

---

**For questions or clarifications:**  
- Start with [CONTRIBUTING.md](../CONTRIBUTING.md)
- Ask in [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions)
- Contact a maintainer.

---