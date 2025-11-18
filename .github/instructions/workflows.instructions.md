---
file_type: "instructions"
applyTo: ['.github/workflows/**/*.yml', '.github/workflows/**/*.yaml']
description: "Write secure, cache-efficient, reusable workflows with tests."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission

Outline best practices for authoring GitHub Actions workflows that are secure, maintainable and efficient.

# Permissions & Security

- Always declare explicit permissions for each workflow using `permissions`. Use `contents: read` by default and elevate privileges only when necessary.
- Avoid passing secrets to third‑party actions. Use GitHub’s encrypted secrets and limit their scope.

# Concurrency & Caching

- Use the `concurrency` key to prevent overlapping runs (`concurrency: { group: '<workflow-name>', cancel-in-progress: true }`).
- Cache dependencies deterministically using `actions/cache` with a key based on lockfiles (e.g. `package-lock.json`, `composer.lock`).

# Structure & Reusability

- Break complex logic into reusable composite actions stored in a separate repository or under `.github/actions/`.
- Pin actions to a full length commit SHA instead of a mutable tag to guarantee reproducibility.
- Provide manual triggers (`workflow_dispatch`) and clear names for jobs and steps.

# Testing Workflows

- Validate workflow syntax with `actionlint` locally or as part of CI.
- Add a smoke‑test job that runs a minimal build or test to confirm the workflow functions end‑to‑end.

# Examples

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

# References

- <https://docs.github.com/en/actions>
- <https://docs.github.com/en/actions/tutorials>
- <https://docs.github.com/en/actions/tutorials/create-an-example-workflow>
