# **Changelog & Release Automation** 
## *Product Development Workflow*

***Version:*** 1.1 • ***Last updated:*** 17 Oct 2025  
---

[Pull Request Changelog Content](#pull-request-changelog-content)  
[Semantic Versioning & Release Labeling](#semantic-versioning--release-labeling)  
[Automated Release Workflow](#automated-release-workflow)  
[PR Label Enforcement & Checks](#pr-label-enforcement--checks)  
[Maintaining Labels & Config](#maintaining-labels-and-config-for-product-repos)  
[Differences for Product Development](#differences-for-product-development)  

---

This blueprint tailors the client workflow for **product** releases: clearer external-facing notes, consistent SemVer, and optional distribution steps (e.g., packaging/publishing).

## **Pull Request Changelog Content** {#pull-request-changelog-content}
Every PR must include a user-friendly **`## Changelog`** section written for end-users (avoid internal jargon). Group with **Added/Changed/Fixed** when helpful and link issues.

## **Semantic Versioning & Release Labeling** {#semantic-versioning--release-labeling}
Use `release:major|minor|patch`. If a PR includes **`BREAKING CHANGE:`**, treat as **major** even if labels say otherwise.

## **Automated Release Workflow** {#automated-release-workflow}
On merge to `main`, the Action:
- derives next SemVer from `release:*` label (with BREAKING override),
- extracts PR changelog text for notes,
- creates a tag + Release and updates `CHANGELOG.md`.

(Example workflow YAML in the original doc shows the full job, including permissions and steps for version calc and notes scraping.)

## **PR Label Enforcement & Checks**
- Require exactly one `release:*` label. CI fails if multiple or missing.

## **Maintaining Labels & Config for Product Repos**
- Keep `.github/labels.yml` in sync across repos.  
- Optionally default to `release:patch` via labeler; developers can raise to minor/major.

## **Differences for Product Development**
- If batching several PRs into one release, compute the bump from the **highest** significance since last tag.
- For continuous delivery, **release each merge** to maintain crisp, atomic notes.

