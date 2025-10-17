# **Changelog & Release Automation**
## *Client Delivery Workflow*

***Version:*** 1.1 • ***Last updated:*** 17 Oct 2025  
---

[Pull Request Changelog Content](#pull-request-changelog-content)  
[Semantic Versioning with Labels](#semantic-versioning-with-labels)  
[Automated Release Workflow on Merge](#automated-release-workflow-on-merge)  
[Label Enforcement & PR Validation](#label-enforcement-&-pr-validation)  
[Maintaining Consistent Labels](#maintaining-consistent-labels)  
[Putting It Together (Client Delivery)](#putting-it-together-client-delivery)  
[Example Configuration Files](#example-configuration-files)  
[Conclusion](#conclusion)

---

This blueprint outlines an automated system for changelog management and release generation tailored to **client delivery**. Every PR provides release-note-ready text; merges to `main` trigger a tagged release and changelog update.

## **Pull Request Changelog Content** {#pull-request-changelog-content}

Add a **`## Changelog`** section to every PR (via template). Use **Added/Changed/Fixed** style bullets, include links to issues, and keep language client-friendly.

**Example**

```md
# Changelog

## Added

- Implemented user login with OAuth support.

## Changed

- Updated database schema to include last_login.
```


## **Semantic Versioning with Labels** {#semantic-versioning-with-labels}

Apply exactly one of:
- `release:patch` — fixes & small changes  
- `release:minor` — backwards-compatible features  
- `release:major` — breaking changes

**Overrides**
- `BREAKING CHANGE:` in the PR body can force a **major** bump.
- (Optional) allow `Release-As: x.y.z` / `release:x.y.z` when you must pin a version.

## **Automated Release Workflow on Merge** {#automated-release-workflow-on-merge}

Main-only model: when a PR merges into `main`, the workflow:
1) calculates next version from labels (or `BREAKING CHANGE:`),  
2) extracts PR “Changelog” notes,  
3) updates `CHANGELOG.md`, creates a tag and a GitHub Release.

> See sample workflow in your original doc for `pull_request: [closed]` trigger, version calc, notes extraction, and release creation steps.

## **Label Enforcement & PR Validation** {#label-enforcement-&-pr-validation}
- CI checks require **exactly one** `release:*` label and a **Changelog** section.
- Fails if missing or ambiguous.

## **Maintaining Consistent Labels** {#maintaining-consistent-labels}
- Keep a single `.github/labels.yml` as the source of truth and sync labels via a simple Action/script.
- (Optional) use `.github/labeler.yml` to auto-label docs-only PRs or default `release:patch`.

## **Putting It Together (Client Delivery)** {#putting-it-together-client-delivery}
Repos should contain:
- `CHANGELOG.md` (Keep a Changelog style) updated automatically on every release.
- Workflows:
  - `changelog.yml` (release flow)
  - `pr-label-check.yml` (validations)
  - optional `labeler.yml` (auto-labels)
- Label set aligned org-wide (status, priority, release).

## **Example Configuration Files** {#example-configuration-files}
- (Optional) Release Drafter config if batching releases instead of releasing each merge.
- (Optional) “changelog style” documentation for contributors.

## **Conclusion** {#conclusion}
This approach gives clients clear, traceable releases with minimal manual work and consistent PR discipline across repos.
