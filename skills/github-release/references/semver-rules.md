# SemVer Decision Rules

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Reference: <https://semver.org/>

---

## Version format

```
vMAJOR.MINOR.PATCH
```

- **MAJOR** — incompatible API changes
- **MINOR** — new backward-compatible functionality
- **PATCH** — backward-compatible bug fixes

Pre-1.0 note: if the current version is `0.x.y`, anything goes — MINOR bumps are
common for breaking changes. Once past `1.0.0`, the rules below apply strictly.

---

## What counts as a MAJOR bump (breaking change)

Breaking changes are any modifications that could cause a consumer of the library to
experience a compile error, runtime error, or behavior change **without changing their
own code**.

Examples:

- Removing a public function, class, method, or constant
- Renaming a public function, class, method, or constant
- Changing a function signature (adding required parameters, removing parameters,
  changing parameter types, changing return type)
- Changing observable behavior that callers depend on (e.g., error types thrown,
  event names emitted, return value shape)
- Changing a required configuration key or its accepted values
- Dropping support for a runtime/language version that was previously supported
- Removing or renaming a publicly exported module path

**When in doubt, prefer a MAJOR bump over a MINOR.** It's better to signal a breaking
change than to silently break consumers.

---

## What counts as a MINOR bump (new feature)

- Adding a new public function, class, method, or constant
- Adding optional parameters to an existing function (with backward-compatible defaults)
- Implementing a new protocol/interface that doesn't affect existing ones
- Adding new configuration keys with sensible defaults
- Deprecating (but not removing) a public API — removal comes in a future MAJOR

---

## What counts as a PATCH bump

- Fixing a bug where behavior was incorrect relative to documented intent
- Improving performance without changing the public API
- Internal refactoring with no external observable difference
- Documentation updates
- Dependency updates that don't change the library's own public surface
- CI/CD, test, tooling changes
- Security fixes that don't break the API

---

## Multiple changes — precedence

When a release contains a mix of change types, the **highest precedence** wins:

```
MAJOR > MINOR > PATCH
```

One breaking change + ten new features = MAJOR bump.

---

## First release (no prior tags)

Default to `1.0.0` regardless of what's in the diff. Inform the user.

---

## Edge cases

| Situation | Recommendation |
|---|---|
| Only internal/private symbols changed | PATCH |
| Type annotation added to previously untyped function | PATCH (non-breaking) |
| Changing default value of optional parameter | Treat as MAJOR if callers might rely on old default |
| Adding a new required config option to an optional block | MINOR if the block itself is optional, otherwise MAJOR |
| Reverting a previous commit entirely | Follow what the net diff shows, not the revert message |

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
