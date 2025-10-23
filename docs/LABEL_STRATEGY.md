---
_Note: This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [docs/VERSIONING.md](VERSIONING.md) and [.github/FRONTMATTER-SCHEMA.md](../.github/FRONTMATTER-SCHEMA.md)._
---

# LightSpeed GitHub Labelling Strategy

This document describes how LightSpeed uses GitHub labels to power automation, search, workflow routing, and community management across all repositories—including issues, pull requests (PRs), and discussions.

---

## 1. Purpose & Principles

- **Clarity & Automation:** Labels provide high-signal metadata for automation, project boards, and contributors.
- **Consistency:** All repositories follow a shared, canonical taxonomy (see `.github/labels.yml`).
- **Discoverability:** Labels make it easy to filter, search, and report on work across code, docs, and community.
- **Community Engagement:** Dedicated labels for discussions and non-code topics ensure inclusive collaboration.

---

## 2. Label Families & Categories

- **Status:** `status:*` — workflow progression (e.g. `needs-triage`, `in-progress`, `needs-review`, `blocked`)
- **Priority:** `priority:*` — urgency and scheduling (`critical`, `important`, `normal`, `minor`)
- **Type:** `type:*` — nature of work (`bug`, `feature`, `docs`, `test`, `refactor`, `performance`, `security`, etc.)
- **Area/Component:** `area:*`, `comp:*` — codebase/product area (e.g., `area:ci`, `comp:block-editor`)
- **Context:** `phase:*`, `env:*`, `device:*`, etc.
- **Meta:** `meta:*` — release hygiene, automation, triage, changelog, and workflow signals
- **Contributor:** `contrib:*` — contributor workflow (`good-first-issue`, `help-wanted`)
- **Discussion/Community:** `community`, `showcase`, `announcement`, `feedback`, `support`, `sponsorship`, `partnership`

---

## 3. Issue Labelling

### A. Automated & Manual Application

- **Templates and Forms:** Issue templates auto-assign `type:*`, `priority:*`, and initial status labels.
- **Manual Curation:** Triage and maintainers may adjust labels for clarity, routing, or as issue status changes.

### B. Minimum Required Labels per Issue

- **One** `status:*` (e.g., `status:needs-triage`, then progressing to `status:ready`, `status:in-progress`, `status:needs-review`, etc.)
- **One** `priority:*` (e.g., `priority:normal`)
- **One** `type:*` (e.g., `type:bug`, `type:feature`)
- **At least one** `area:*` or `comp:*` (e.g., `area:ci`, `comp:block-editor`)
- **Contextual/meta labels** as needed (`phase:6`, `meta:needs-changelog`, `contrib:good-first-issue`)

### C. Issue Automation

- **Labeler:** `.github/labeler.yml` auto-applies labels based on file paths, branch prefixes, and patterns.
- **Workflow Enforcement:** Issues must have required labels before work can begin or before closing.
- **Project Board Sync:** Labels map to project fields for auto-triage, status tracking, and reporting.
- **Changelog/Release:** Meta and release labels (`meta:needs-changelog`, `release:*`) trigger automation for changelog generation and versioning.

---

## 4. Pull Request (PR) Labelling

### A. Automated & Manual Application

- **Branch Prefix Mapping:** PR branch names (e.g., `feat/`, `fix/`, `docs/`) auto-assign `type:*` and `status:needs-review`.
- **File Path Matching:** PRs touching specific files/folders auto-get `area:*`, `comp:*`, or language labels.
- **PR Templates:** Prompt for changelog entries, release labels, and linked issues.

### B. Minimum Required Labels per PR

- **One** `status:*` (automatically set to `status:needs-review` on open)
- **One** `type:*` (matched to branch prefix: `feat/` → `type:feature`, etc.)
- **One** `priority:*` (derived from branch or set manually, e.g., `priority:normal`)
- **At least one** `area:*` or `comp:*`
- **Release:** `release:patch`, `release:minor`, or `release:major` as required
- **Meta:** `meta:needs-changelog`, `meta:triage` as needed

### C. PR Automation

- **Labeler:** `.github/labeler.yml` applies labels based on branch and file changes.
- **Changelog Enforcement:** PRs missing changelog/release labels block merges; workflows auto-add `meta:needs-changelog` if absent.
- **Status Transition:** Only one `status:*` at a time (e.g., `needs-review` → `needs-qa` → `ready-for-deployment`)
- **Release Workflow:** Labels guide automated changelog compilation and semantic versioning after merge.

---

## 5. Discussion Labelling

### A. Community & Discussion-Specific Labels

- **community:** For social, networking, or open-ended topics
- **showcase:** User projects, demos, "Show & Tell" threads
- **announcement:** Official news and team updates
- **feedback:** Suggestions, general ideas, and user experience comments
- **support:** “How do I…”, setup, troubleshooting, or help requests that aren’t confirmed bugs
- **sponsorship:** Funding, GitHub Sponsors, and financial topics
- **partnership:** Collaboration, business, or outreach threads

### B. How to Use

- Apply at creation or via moderator assignment.
- Encourage users to select a label when starting a new discussion.
- Use labels to filter, moderate, and prioritize community engagement.

---

## 6. Automation, Workflow, and Agents

- **Labeler Config:**  
  `.github/labeler.yml` auto-applies labels based on:
  - Branch prefixes (e.g., `feat/`, `fix/`)
  - File paths/globs (e.g., `src/blocks/**` → `area:block-editor`)
- **Workflow Enforcement:**  
  - CI fails if required labels are missing or conflicting.
  - Status and priority labels drive automation in project boards and release gating.
- **Project Board Sync:**  
  - Labels map to project fields for triage, status, priority, and reporting.
- **Changelog & Release:**  
  - Meta and release labels trigger workflows for changelog entries and semantic version bumps.
- **Bots/Agents:**  
  - Use labels to assign reviewers, escalate support, route discussions, or automate notifications.

---

## 7. Best Practices

- Keep **exactly one** `status:*` and `priority:*` label per issue/PR.
- Use the most specific `area:*`, `comp:*`, or context label for filtering.
- Update labels as work progresses or if scope changes.
- Use discussion/community labels to keep conversations organized and welcoming.
- Review and clean up labels quarterly, removing unused or redundant entries.

---

## 8. References

- [Canonical labels and colors](../.github/labels.yml)
- [Labeler rules](../.github/labeler.yml)
- [Issue Labels Guide](../.github/ISSUE_LABELS.md)
- [PR Labels Guide](../.github/PR_LABELS.md)
- [Automation Governance](../.github/AUTOMATION_GOVERNANCE.md)
- [Issue Types Guide](../.github/ISSUE_TYPES.md)
- [Discussions Guide](DISCUSSIONS.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions)

---

*For suggestions or changes, open a PR or discussion in the `.github` repository.*