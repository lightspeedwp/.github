# Automation Governance & Release Strategy

**LightSpeed Organisation — Community Health Defaults**  
_Last updated: 2025-10-10_

---

## Purpose

This document governs **automation for changelog enforcement, release creation, labelling, branching, and project sync** across all LightSpeed repositories. It is intended for inclusion in the `.github` (community health) repository and should be referenced in all repo-level README, CONTRIBUTING, and PR templates.

- **Scope:** All org repos (themes, plugins, blocks, docs, infra)
- **Audience:** Maintainers, contributors, CI/CD engineers, design/dev teams

---

## 1. Principles

- **Automate everything:** Changelogs, releases, labelling, project sync—avoid manual steps and ad-hoc local scripts unless explicitly allowed.
- **Use standard workflows:** Prefer reusable GitHub Actions, scripts, and org-wide config from this repo.
- **Keep a Changelog:** All changes must be traceable, user-facing, and formatted for automated extraction.
- **Semantic versioning:** Release versioning is driven by PR labels and workflow triggers.

---

## 2. Required Workflows & Files

### a. Changelog Enforcement & Compilation

- Every PR must add an entry under **Unreleased** in `CHANGELOG.md` (Keep a Changelog format).
- PR template must include a `## Changelog` section (see [PR Template](https://github.com/lightspeedwp/.github/blob/main/.github/PULL_REQUEST_TEMPLATE.md)).
- CI must fail PRs without valid changelog entries (see enforcement workflow).

### b. Release Automation

- When `develop` merges to `main` (or on release PR to main):
  1. Validate tests, build, changelog format.
  2. Determine next version (manual input or labels → semver).
  3. Move `Unreleased` to `vX.Y.Z (YYYY-MM-DD)` section, open a fresh Unreleased.
  4. Tag & create GitHub Release using compiled changelog.
  5. Attach built artefacts (ZIP, etc) if required.
  6. Optional: update stable tag, README, notify channels.

### c. Labelling & Project Sync

- Use Issue Forms/templates to auto-apply type labels (e.g., `Type: bug`, `Type: enhancement`).
- PRs must be auto-labelled via file globs and/or branch prefix (`feature/*` → `Type: enhancement`).
- Each PR must link its type/area/priority labels to the corresponding Project fields.
- On PR open/label change, add item to relevant Projects board and set status.
- On merge, auto-move item to Done and close linked issues.

### d. Branching Discipline

- Use `{type}/{scope}-{short-title}` branch names (see [Branching Strategy](https://github.com/lightspeedwp/.github/blob/main/.github/branching-strategy.md)).
- Enforce branch name patterns via CI.
- Squash merge only; delete branches post-merge.

---

## 3. Label & Issue Type Policy

- Labels are **routing signals** (status, priority, area/component, environment, compatibility).
- Use exactly one `status:*`, one `priority:*`, and one `area:*` or `comp:*` per item.
- Do _not_ use `type:*` labels—classification lives in the Issue Type field and Project.
- All labels should match org-wide colours and naming (see [Labels Guide](https://github.com/lightspeedwp/.github/blob/main/.github/labels-guide.md)).
- See [Issue Types Guide](https://github.com/lightspeedwp/.github/blob/main/.github/issue-types.md) for classification.

---

## 4. Changelog Format & Release Policy

**Changelog format:**  
```markdown
## [Unreleased]
### Added
- User-facing note. (#123, @author)

### Fixed
- Short, clear fix description.

### Changed
- Update details.

### Removed
- Deprecated or removed features.

<!-- If no changelog entry is needed (internal-only), apply the skip-changelog label. -->
```

- Changelog entries should be written for end-users (not just devs).
- The release workflow will extract changelog from PR bodies and labels.

**Release triggers:**
- PR labels (`release:patch`, `release:minor`, `release:major`) determine next version bump.
- If `BREAKING CHANGE:` is found in PR body/commit, force a major bump.
- Release workflow tags and publishes a new GitHub Release with compiled notes.

---

## 5. Recommended Actions & Example Configs

**Actions:**
- Changelog enforcement/compilation: `changelog-enforcer`, `release-please`, `changelog-ci`, `keep-a-changelog-new-release`.
- Release creation: `create-release`, `automatic-releases`, `git-release`, `release-please-action`.
- Label automation: `actions/labeler@v5`, custom scripts.
- Project sync: `actions/add-to-project@v1`, `titoportas/update-project-fields@v0.1.0`.

**Example configs:**  
- See [labels-issues-prs.yml](https://github.com/lightspeedwp/.github/blob/main/.github/workflows/labels-issues-prs.yml)
- See [project-meta-sync.yml](https://github.com/lightspeedwp/.github/blob/main/.github/workflows/project-meta-sync.yml)
- See [labeler.yml](https://github.com/lightspeedwp/.github/blob/main/.github/labeler.yml)

---

## 6. Project Field Alignment

- Ensure single-select fields in Projects match the values mapped from labels and branch prefixes:
  - **Status:** Triage, Ready, In progress, In review, In QA, Blocked, Done
  - **Priority:** Critical, Important, Normal, Minor
  - **Type:** Feature, Bug, Documentation, Task

---

## 7. Secrets & Permissions

- Use repo/org **Environments** for release tokens.
- Limit `GITHUB_TOKEN` permissions; prefer fine-grained PAT only when required.
- Ensure build artefacts are reproducible; no local-only release tooling.

---

## 8. Rollout Plan

1. Add labels, Issue/PR templates, and labeler config to `.github` repo.
2. Enable changelog enforcer, educate devs, iterate categories and enforcement.
3. Ship release workflow behind `workflow_dispatch` for dry-run testing.
4. Switch trigger to `develop → main` (or main-only), monitor and refine.

---

## References

- [GitHub Labels Guide](https://github.com/lightspeedwp/.github/blob/main/.github/labels-guide.md)
- [Issue Types Guide](https://github.com/lightspeedwp/.github/blob/main/.github/issue-types.md)
- [Branching Strategy](https://github.com/lightspeedwp/.github/blob/main/.github/branching-strategy.md)
- [PR Template](https://github.com/lightspeedwp/.github/blob/main/.github/PULL_REQUEST_TEMPLATE.md)
- [Project Templates](https://github.com/lightspeedwp/.github/tree/main/.github/project-templates/)
- [Labelling & Project Automation Workflows](https://github.com/lightspeedwp/.github/tree/main/.github/workflows/)
- [Org instructions for Copilot](https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot)

---

## How to use this document

- Reference this file in repo-level README, CONTRIBUTING, and PR templates.
- Link to it in project onboarding docs and contributor guides.
- Treat as the single source of truth for automation, changelog, release, and labelling policies.
- Update as automation or org-wide standards evolve; changes should be reviewed by maintainers.

---

_This file is maintained by the LightSpeed Tools & Automation team. For updates or questions, open an issue in the `.github` repo or contact #automation-support._