# Permissions and Tokens

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

Every workflow run gets an automatic `GITHUB_TOKEN`. Its scope is the blast radius if a step is
compromised, so scope it to the minimum.

## The Default Is Too Broad

If a workflow has no `permissions:` block, it inherits the repository/organization default. On
older or permissive repos that default is **read/write to most scopes**. A single injected command
or malicious dependency then runs with the ability to push code, publish releases, or approve PRs.

## Least-Privilege Recipe

Set a restrictive default at the top level, then elevate per job only where needed.

```yaml
# Deny by default
permissions: {}

jobs:
  build:
    permissions:
      contents: read          # checkout only
    runs-on: ubuntu-latest
    steps: [...]

  comment:
    permissions:
      contents: read
      pull-requests: write    # this job posts a comment; nothing else
    runs-on: ubuntu-latest
    steps: [...]
```

Common scopes: `contents`, `pull-requests`, `issues`, `actions`, `packages`, `id-token`,
`deployments`, `checks`, `statuses`. Each is `read`, `write`, or `none`.

## Findings to Flag

* No `permissions:` block anywhere → MEDIUM (inherits possibly-broad default).
* `permissions: write-all` → HIGH.
* A `write` scope the job's steps never use → HIGH (drop it).
* Top-level `write` that should live on one job → MEDIUM (move it down).

## OIDC Instead of Long-Lived Cloud Secrets

Storing static cloud keys (`AWS_ACCESS_KEY_ID`, etc.) as repo secrets means a leak is permanent
until manually rotated. Prefer OpenID Connect: the workflow requests a short-lived token the cloud
provider trusts, scoped to that repo/branch, expiring in minutes.

```yaml
permissions:
  id-token: write     # required to request the OIDC token
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@<sha>
        with:
          role-to-assume: arn:aws:iam::123456789012:role/my-ci-role
          aws-region: us-east-1
      # no AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY secrets needed
```

The same pattern exists for Azure (`azure/login`), GCP (`google-github-actions/auth`), HashiCorp
Vault, and others. On the cloud side, scope the trust policy to the specific repo and ideally a
specific branch/environment so a fork or another repo cannot assume the role.

## Secret Hygiene

* Reference secrets only in the jobs that need them.
* Never `echo` a secret or enable shell tracing (`set -x`) in a step that handles one.
* Don't pass secrets into third-party actions you haven't pinned and reviewed.
* Remember fork `pull_request` runs get no secrets — don't try to "fix" that by switching to
  `pull_request_target` (see `triggers-and-privilege.md`).

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
