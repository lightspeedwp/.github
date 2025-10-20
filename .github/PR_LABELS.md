# .github/PR_LABELS.md

## Purpose

Defines the org-wide standard for providing high‑signal, automated **PR labeling** for review routing, release hygiene, and search, in LightSpeed projects. Use this reference to classify PRs consistently, apply correct labels, and align with org-wide automation and reporting.

## Branch Prefixes

Use one of the following branch prefixes for every PR. This ensures correct label and template automation:

| Prefix      | Purpose                       | Maps to Type / Label      |
|-------------|------------------------------|---------------------------|
| feat/       | New feature or enhancement   | feature                   |
| fix/        | Bugfix or regression         | bug                       |
| docs/       | Documentation changes        | documentation             |
| chore/      | Maintenance/hygiene tasks    | chore                     |
| build/      | Build/CI/automation changes  | build / ci                |
| refactor/   | Internal code refactoring    | refactor                  |
| test/       | Add or update tests          | test                      |
| perf/       | Performance improvements     | performance               |
| ci/         | CI/CD or workflow changes    | ci                        |
| release/    | Release prep/deployment      | release                   |
| hotfix/     | Emergency production fix     | hotfix / bug              |
| design/     | Design changes/assets        | design                    |
| research/   | Technical spike/research     | research                  |

For the full contribution workflow, see [CONTRIBUTING.md](../CONTRIBUTING.md).

## PR Templates & Usage

LightSpeed uses dedicated PR templates for different types of work.
Select the appropriate template when opening a PR to ensure correct initial labels, required fields, and automation triggers.

- [Bugfix PR](./PULL_REQUEST_TEMPLATES/pr_bug.md) — use for defect/regression fixes.
- [Feature PR](./PULL_REQUEST_TEMPLATES/pr_feature.md) — use for new features or enhancements.
- [Chore PR](./PULL_REQUEST_TEMPLATES/pr_chore.md) — use for hygiene, config, or formatting changes.
- [Docs PR](./PULL_REQUEST_TEMPLATES/pr_docs.md) — use for documentation updates.
- [Build/CI PR](./PULL_REQUEST_TEMPLATES/pr_ci.md) — use for pipeline or release automation changes.
- [Dependencies/Maintenance PR](./PULL_REQUEST_TEMPLATES/pr_dep_update.md) — use for routine dependency or maintenance updates.
- [Hotfix PR](./PULL_REQUEST_TEMPLATES/pr_hotfix.md) — use for urgent production fixes.
- [Release PR](./PULL_REQUEST_TEMPLATES/pr_release.md) — use for release preparation and deployment.
- [Refactor PR](./PULL_REQUEST_TEMPLATES/pr_refactor.md) — use for internal code improvements.

How to choose:
- Use the correct branch prefix (`fix/`, `feat/`, `chore/`, etc.) and select the matching PR template.
- Each template ensures proper labels, changelog entries, and automation.
- If unsure, use the [General PR Template](./pull_request_template.md).

See the template files for required fields, checklists, and changelog categories.

## How labels are applied

1) **Paths → labels** via `.github/labeler.yml` (map to `area:*`, `comp:*`, `block:*`, `template:*`, `woo:*`, `to:*`, etc.).
2) **Branch prefixes → status** on PR open: `feat/`, `fix/`, `docs/`, `chore/`, `build/` → add `status:needs-review`.

### Optional branch→type mapping (for Projects)

When the Project **Type** field is present, workflows may map PR branches to **Type**: `feat/`→`Feature`, `fix/`→`Bug`, `docs/`→`Documentation`, `chore/|build/`→`Task`.

## Usage Notes

- Keep exactly one `status:*` and one `priority:*` on PRs.
- Use `status:needs-*` to drive automation (e.g., `status:needs-qa` moves to In QA).
- Prefer Project fields for Status/Priority/Area/Theme; use labels to echo for visibility/search.
- See `labels.yml` for the full canonical list and colour mapping.

## Release & Changelog Process

### Meta Labels & Release Hygiene

- **Meta labels** such as `meta:needs-changelog`, `meta:duplicate`, and `meta:triage` provide workflow signals:
    - `meta:needs-changelog`: Indicates an issue/PR must be included in the changelog.
    - `meta:duplicate`: Used to aggregate or report duplicate issues, separate from lifecycle status.
    - `meta:triage`: Flags issues needing further triage actions, but does not replace status labels.

- **Release labels** (`release:patch`, `release:minor`, `release:major`, `release:rc`, `release:beta`) determine the release type. Each PR must have exactly one release label to automate version bumping and changelog grouping.

### Changelog Automation

- When a PR is opened, if no changelog label is present, the workflow adds `meta:needs-changelog`.
- PRs and issues with `meta:needs-changelog` are included in automated changelog generation.
- Changelog sections are grouped based on release and type labels (e.g., features, fixes, documentation).
- When a PR is merged, the release workflow parses labels to determine changelog placement and version bump.

### Contributor Guidance

- Always set the appropriate meta and release labels before merging a PR.
- If your PR does **not** affect the changelog, use a skip label (`meta:no-changelog`).
- Only one `status:*` and one `release:*` label per PR/issue.
- Use the PR template to document relevant changelog entries.

**See [Canonical Label Definitions](./labels.yml) and [Automated Label Assignment Rules](./labeler.yml) for automation details.**

## Changelog hygiene

- On PR open, if no changelog marker exists, add `meta:needs-changelog`.
- Remove after updating changelog/README (or apply `meta:no-changelog` if internal‑only).

## Status rules (PRs)

- Keep **exactly one** `status:*`. Workflow adds `status:needs-review` if none; fails if multiple are present.

## Branching Strategy Reference

Branch prefixes and PR Types are tightly linked. See [Org-wide Branching Strategy](../docs/git-workflow/org-wide-branching-strategy.md) for conventions.
Your branch prefix (e.g. `feat/`, `fix/`, `docs/`, etc.) determines which PR template is used, the labels applied, and the automation that will run.
Always use the correct prefix for your branch to ensure full automation and proper PR classification.

## Reference

- [CONTRIBUTING.md](../CONTRIBUTING.md): Full contribution guidelines, templates, and coding standards.
- [Org-wide Issue Labels](./ISSUE_LABELS.md): Full list of default labels and usage guidance.
- [Pull Request Labels](./PR_LABELS.md): Standards for PR classification and automation.
- [Issue Types YAML](./issue-types.yml): Machine-readable list of all issue types for workflow and script automation.
- [Canonical Label Definitions](./labels.yml): Source of truth for all label names, colours, and descriptions.
- [Automated Label Assignment Rules](./labeler.yml): Automation for applying labels based on file changes and branch patterns.

Use these resources to set the 'Type' field, apply companion labels, and ensure full alignment between documentation, label definitions, and automation.

*This PR Labels standard extends the LightSpeed Projects/Issues/Labels strategy and supports org-wide label and workflow automation. All guidance here is directly reflected in labels.yml and labeler.yml for traceability and consistency.*
