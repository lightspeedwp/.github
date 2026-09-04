# .github/PR_LABELS.md

<!-- BADGES-START -->

[![changelog](https://github.com/lightspeedwp/.github/actions/workflows/changelog.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)

<!-- BADGES-END -->

> **Note:** All PR labeling, status, type, and standardization is handled by the unified labeling agent and labeling workflow. The canonical PR labels and assignment rules are maintained in ../.github/labels.yml and ../.github/labeler.yml.

---

## Purpose

Defines the org-wide standard for high-signal, automated **PR labeling** for review routing, release hygiene, and search in LightSpeed projects.
Use this reference for consistent, correct PR labels and full alignment with automation.

---

## Branch Prefixes

Every PR should use a standard branch prefix for correct label and template automation:

| Prefix    | Purpose                    | Maps to Type / Label | PR Template                                    |
| --------- | -------------------------- | -------------------- | ---------------------------------------------- |
| feat/     | New feature or enhancement | feature              | .github/PULL_REQUEST_TEMPLATE/pr_feature.md    |
| fix/      | Bugfix or regression       | bug                  | .github/PULL_REQUEST_TEMPLATE/pr_bug.md        |
| hotfix/   | Emergency production fix   | hotfix / bug         | .github/PULL_REQUEST_TEMPLATE/pr_hotfix.md     |
| release/  | Release prep/deployment    | release              | .github/PULL_REQUEST_TEMPLATE/pr_release.md    |
| refactor/ | Internal code refactoring  | refactor             | .github/PULL_REQUEST_TEMPLATE/pr_refactor.md   |
| chore/    | Maintenance/hygiene tasks  | chore                | .github/PULL_REQUEST_TEMPLATE/pr_chore.md      |
| docs/     | Documentation changes      | documentation        | .github/PULL_REQUEST_TEMPLATE/pr_docs.md       |
| ci/       | CI/CD or workflow changes  | ci                   | .github/PULL_REQUEST_TEMPLATE/pr_ci.md         |
| deps/     | Dependency updates         | dependencies         | .github/PULL_REQUEST_TEMPLATE/pr_dep_update.md |
| test/     | Add or update tests        | test                 | .github/PULL_REQUEST_TEMPLATE/pr_test.md       |
| design/   | Design system or UI changes| design               | .github/PULL_REQUEST_TEMPLATE/pr_design.md     |
| a11y/     | Accessibility improvements | a11y                 | .github/PULL_REQUEST_TEMPLATE/pr_a11y.md       |
| audit/    | Audit or compliance review | audit                | .github/PULL_REQUEST_TEMPLATE/pr_audit.md      |
| security/ | Security fixes/hardening   | security             | .github/PULL_REQUEST_TEMPLATE/pr_security.md   |
| aiops/    | AI-assisted operations     | task                 | .github/PULL_REQUEST_TEMPLATE/pr_aiops.md      |
| epic/     | Epic completion or merge   | task                 | .github/PULL_REQUEST_TEMPLATE/pr_epic.md       |

---

## PR Templates & Usage

- Select the correct template for your PR type.
- **Labels** are set automatically by the [unified agent and workflow](../.github/workflows/labeling.yml).
- Each PR must have:
  - Exactly one `status:*` (e.g., `status:needs-review`)
  - Exactly one `priority:*`
  - Exactly one `type:*`
  - At least one `area:*` or `comp:*`
  - A canonical release label (`release:patch`, etc.) for shipping PRs

---

## Label Automation

- All label assignment, enforcement, and standardization is handled by the **unified labeling agent** ([labeling.agent.js](../scripts/agents/labeling.agent.js)).
- **File/branch-based rules** are defined in [labeler.yml](../.github/labeler.yml).
- **Non-canonical or legacy labels** are automatically removed or migrated.

---

## Release & Changelog Process

- All PRs affecting user-facing features/fixes must include a valid changelog label; if missing, the agent will add `meta:needs-changelog`.
- Only one `status:*` and one `release:*` label per PR.
- See [labels.yml](../.github/abels.yml) for the current canonical options.

---

## Usage Notes

- All PR labeling, status, type, and standardization is automated and validated; maintainers may adjust as needed.
- For a full list of canonical PR labels and colors, see [labels.yml](../.github/labels.yml).

---

## References

- [labels.yml](../.github/labels.yml)
- [labeler.yml](../.github/labeler.yml)
- [issue-types.yml](../.github/issue-types.yml)
- [labeling.agent.md](../agents/labeling.agent.md)
- [labeling.yml](../.github/workflows/labeling.yml)
- [Labeling Strategy](./LABEL_STRATEGY.md)
- [Automation Governance](./AUTOMATION_GOVERNANCE.md)

---

*Labeling, status, type, and standardization for PRs are handled exclusively by the unified agent and workflow.*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
