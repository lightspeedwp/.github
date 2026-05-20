---
file_type: "instructions"
applyTo: [".github/workflows/**/*.yml", ".github/workflows/**/*.yaml"]
description: "Write secure, cache-efficient, reusable workflows with tests."
last_updated: "2025-12-04"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# GitHub Actions Workflow Standards

You are a workflow reliability assistant. Follow our GitHub Actions security, caching, and reuse standards to design and review workflows. Avoid broad permissions, unpinned actions, or cache patterns that break reproducibility.

## Overview

Applies to all GitHub Actions workflows in this repository. Covers permissions, security, concurrency/caching, structure/reuse, testing, pipeline standards, and release automation. Excludes non-GitHub CI systems.

## General Rules

- Declare minimal permissions and pin actions to SHAs.
- Prevent overlapping runs with concurrency; cache deterministically.
- Keep workflows modular via reusable/composite actions.
- Validate workflows with actionlint and smoke tests.

## Detailed Guidance

Use the sections below for specific guidance on permissions, caching, structure, testing, and pipeline standards.

## Permissions & Security

- Always declare explicit permissions for each workflow using `permissions`. Use `contents: read` by default and elevate privileges only when necessary.
- Avoid passing secrets to third‑party actions. Use GitHub’s encrypted secrets and limit their scope.

## Concurrency & Caching

- Use the `concurrency` key to prevent overlapping runs (`concurrency: { group: '<workflow-name>', cancel-in-progress: true }`).
- Cache dependencies deterministically using `actions/cache` with a key based on lockfiles (e.g. `package-lock.json`, `composer.lock`).

## Structure & Reusability

- Break complex logic into reusable composite actions stored in a separate repository or under `.github/actions/`.
- Pin actions to a full length commit SHA instead of a mutable tag to guarantee reproducibility.
- Provide manual triggers (`workflow_dispatch`) and clear names for jobs and steps.

## Testing Workflows

- Validate workflow syntax with `actionlint` locally or as part of CI.
- Add a smoke‑test job that runs a minimal build or test to confirm the workflow functions end‑to‑end.

## Examples

```yaml
name: Example CI
on:
  push:
    branches: [main]
  workflow_dispatch: {}
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

## CI/CD Pipeline Standards

## Pipeline Structure

Standard pipeline order: **lint → unit → e2e → build → release** (tag/changelog).

- Require green CI for merge; protect `main` branch
- PR + main: checkout → setup-node LTS → cache → `npm ci` → `npm run lint` → `npm run build` → optional tests
- Main branch: zip artifact; gated deploy via environments

## Release Automation

- Auto-generate release notes from PRs
- Attach build artefacts as needed
- Use semantic versioning with conventional commits

## Validation

- YAML must be valid (use `actionlint`)
- Secrets via `${{ secrets.* }}` only
- No hardcoded credentials

## References

- [instructions.instructions.md](instructions.instructions.md)
- [automation.instructions.md](automation.instructions.md)
- [file-organisation.instructions.md](file-organisation.instructions.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Tutorials](https://docs.github.com/en/actions/tutorials)
- [Create an Example Workflow](https://docs.github.com/en/actions/tutorials/create-an-example-workflow)
