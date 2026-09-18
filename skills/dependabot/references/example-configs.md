# Dependabot Configuration Examples

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

Real-world `dependabot.yml` configurations for common scenarios.

---

## 1. Basic Single Ecosystem

Minimal configuration for a single npm project:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## 2. Monorepo with Glob Patterns

Turborepo/pnpm monorepo with multiple workspace packages:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directories:
      - "/"
      - "/apps/*"
      - "/packages/*"
      - "/services/*"
    schedule:
      interval: "weekly"
      day: "monday"
    groups:
      dev-dependencies:
        dependency-type: "development"
        update-types: ["minor", "patch"]
      production-dependencies:
        dependency-type: "production"
        update-types: ["minor", "patch"]
    labels:
      - "dependencies"
      - "npm"
    commit-message:
      prefix: "deps"
      include: "scope"
```

---

## 3. Grouped Dev vs Production Dependencies

Separate dev and production updates to prioritize review of production changes:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      production-deps:
        dependency-type: "production"
      dev-deps:
        dependency-type: "development"
        exclude-patterns:
          - "eslint*"
      linting:
        patterns:
          - "eslint*"
          - "prettier*"
          - "@typescript-eslint*"
```

---

## 4. Cross-Directory Grouping (Monorepo)

Create one PR per shared dependency across directories:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directories:
      - "/frontend"
      - "/admin-panel"
      - "/mobile-app"
    schedule:
      interval: "weekly"
    groups:
      monorepo-dependencies:
        group-by: dependency-name
```

When `lodash` updates in all three directories, Dependabot creates a single PR.

---

## 5. Multi-Ecosystem Group (Docker + Terraform)

Consolidate infrastructure dependency updates into a single PR:

```yaml
version: 2

multi-ecosystem-groups:
  infrastructure:
    schedule:
      interval: "weekly"
    labels: ["infrastructure", "dependencies"]
    assignees: ["@platform-team"]

updates:
  - package-ecosystem: "docker"
    directory: "/"
    patterns: ["nginx", "redis", "postgres"]
    multi-ecosystem-group: "infrastructure"

  - package-ecosystem: "terraform"
    directory: "/"
    patterns: ["aws*", "terraform-*"]
    multi-ecosystem-group: "infrastructure"
```

---

## 6. Security Updates Only (Version Updates Disabled)

Monitor for security vulnerabilities without version update PRs:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 0  # disables version update PRs
    groups:
      security-all:
        applies-to: security-updates
        patterns: ["*"]
        update-types: ["patch", "minor"]

  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 0
```

---

## 7. Private Registries

Access private npm and Docker registries:

```yaml
version: 2

registries:
  npm-private:
    type: npm-registry
    url: https://npm.internal.example.com
    token: ${{secrets.NPM_PRIVATE_TOKEN}}

  docker-ghcr:
    type: docker-registry
    url: https://ghcr.io
    username: ${{secrets.GHCR_USER}}
    password: ${{secrets.GHCR_TOKEN}}

updates:
  - package-ecosystem: "npm"
    directory: "/"
    registries:
      - npm-private
    schedule:
      interval: "weekly"

  - package-ecosystem: "docker"
    directory: "/"
    registries:
      - docker-ghcr
    schedule:
      interval: "weekly"
```

---

## 8. Cooldown Periods

Delay updates for newly released versions to avoid early-adopter bugs:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    cooldown:
      default-days: 5
      semver-major-days: 30
      semver-minor-days: 14
      semver-patch-days: 3
      include: ["*"]
      exclude:
        - "security-critical-lib"
        - "@company/internal-*"
```

---

## 9. Cron Scheduling

Run updates at a specific time using cron expressions:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "cron"
      cronjob: "0 9 * * 1"  # Every Monday at 9:00 AM
      timezone: "America/New_York"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "cron"
      cronjob: "0 6 1 * *"  # First day of each month at 6:00 AM
```

---

## 10. Full-Featured Configuration

A comprehensive example combining multiple optimizations:

```yaml
version: 2

registries:
  npm-private:
    type: npm-registry
    url: https://npm.example.com
    token: ${{secrets.NPM_TOKEN}}

updates:
  # npm — monorepo workspaces
  - package-ecosystem: "npm"
    directories:
      - "/"
      - "/apps/*"
      - "/packages/*"
      - "/services/*"
    registries:
      - npm-private
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "America/New_York"
    groups:
      dev-dependencies:
        dependency-type: "development"
        update-types: ["minor", "patch"]
      production-dependencies:
        dependency-type: "production"
        update-types: ["minor", "patch"]
      angular:
        patterns: ["@angular*"]
        update-types: ["minor", "patch"]
      security-patches:
        applies-to: security-updates
        patterns: ["*"]
        update-types: ["patch", "minor"]
    ignore:
      - dependency-name: "aws-sdk"
        update-types: ["version-update:semver-major"]
    cooldown:
      default-days: 3
      semver-major-days: 14
    labels:
      - "dependencies"
      - "npm"
    commit-message:
      prefix: "deps"
      prefix-development: "deps-dev"
      include: "scope"
    assignees:
      - "security-lead"
    open-pull-requests-limit: 15

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    groups:
      actions:
        patterns: ["*"]
    labels:
      - "dependencies"
      - "ci"
    commit-message:
      prefix: "ci"

  # Docker
  - package-ecosystem: "docker"
    directories:
      - "/services/*"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "docker"
    commit-message:
      prefix: "deps"

  # pip
  - package-ecosystem: "pip"
    directory: "/scripts"
    schedule:
      interval: "monthly"
    labels:
      - "dependencies"
      - "python"
    versioning-strategy: "increase-if-necessary"
    commit-message:
      prefix: "deps"

  # Terraform
  - package-ecosystem: "terraform"
    directory: "/infra"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "terraform"
    commit-message:
      prefix: "infra"
```

---

## 11. Ignore Patterns and Versioning Strategy

Control exactly what gets updated and how:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    versioning-strategy: "increase"
    ignore:
      # Never auto-update to Express 5.x (breaking changes)
      - dependency-name: "express"
        versions: ["5.x"]
      # Skip patch updates for type definitions
      - dependency-name: "@types/*"
        update-types: ["version-update:semver-patch"]
      # Ignore all updates for a vendored package
      - dependency-name: "legacy-internal-lib"
    allow:
      - dependency-type: "all"
    exclude-paths:
      - "vendor/**"
      - "test/fixtures/**"
```

---

## 12. Target Non-Default Branch

Test updates on a development branch before production:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    target-branch: "develop"
    labels:
      - "dependencies"
      - "staging"

  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    target-branch: "develop"
```

Note: Security updates always target the default branch regardless of `target-branch`.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
