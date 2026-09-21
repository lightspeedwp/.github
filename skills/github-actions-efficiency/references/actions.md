# GitHub Actions Efficiency

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Load this reference only when the task involves GitHub Actions or CI workflow efficiency.

If the repo is onboarding GitHub Actions for the first time, define a minimal baseline workflow first, then optimize using the rest of this guide.

## Audit Order

Inspect in this order:

1. If `.github/workflows/` is missing or empty, gather baseline requirements first: triggering events, required checks, runtime versions, and repository-specific validation policy.
2. `.github/workflows/*.yml`
3. Docs describing CI expectations
4. Existing reports or run history if the user wants measured impact

For new setups, start with a small workflow that proves core checks, then add matrix breadth or additional jobs only when needed.

Start with common, low-risk waste:

1. Missing dependency caches
2. Missing `concurrency` cancellation
3. Over-broad workflow triggers
4. Duplicate workflow coverage across files or jobs
5. Expensive jobs that run on every change regardless of scope

## Actions-Specific Guidance

### Trigger scoping

- Use `paths` or `paths-ignore` when whole workflows truly should not run for some file classes.
- Use job-level gating when event-level filters are too coarse.
- Prefer explicit changed-file detection when reliability matters more than clever filter expressions.

### Job shaping

- Do not merge jobs blindly. If separate jobs preserve parallelism and shorten the critical path, keep them separate.
- Keep lightweight coordination or change-detection jobs separate from heavy execution jobs when that makes skip behavior obvious.
- If a workflow-only change still runs the full suite, treat that as evidence the gating model is too broad.

### Matrix reduction

Match matrix breadth to the decision being made:

- Full matrix for releases or explicit compatibility validation
- Reduced compatibility matrix for runtime, plugin, packaging, or framework-integration changes
- Single representative latest-version leg for ordinary code changes
- No heavy test job for clearly non-runtime changes when lighter protection already exists

### Optional maintenance jobs

Formatting or autofix jobs that write back to a branch are often better as opt-in jobs.

Good triggers:

- PR label such as `ci:format`
- Manual dispatch
- Explicit comment-command flow if the repo already supports it

If you use a label trigger, remember to listen for PR `labeled` and usually `unlabeled` events or the label change will not reevaluate the job.

## Safe-Change Rules

- Do not hide required release, migration, or shared-library validation.
- Do not widen changed-file scope accidentally when replacing a wrapper action.
- Treat severity drift as a regression risk.
- Match the real check surface before replacing a broad action with native tools.

## Live Validation

Prefer live GitHub validation when possible:

- Trigger `workflow_dispatch` workflows once
- Verify stale-run cancellation with two quick updates
- Verify path-gating with an incremental ignored-only or workflow-only change on an existing branch
- Confirm heavy jobs skip in the UI instead of assuming they would

Do not treat the first push on a brand-new branch as a clean path-ignore test.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
