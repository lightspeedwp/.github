# CI/CD Instructions

## Pipelines
- Jobs: lint → unit → e2e → build → release (tag/changelog).
- Require green CI for merge; protect `main`.

## Releases
- Auto-generate notes from PRs; attach artefacts as needed.
