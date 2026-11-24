---
file_type: "documentation"
title: "Implementation Plan: CI Checks Scoped to Changed Files"
description: "Describes the implementation and validation of CI check scoping."
version: "v1.0"
last_updated: "2026-11-24"
owners: ["LightSpeed Team"]
tags: ["ci", "github-actions", "spec-kit"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Implementation Plan: CI Checks Scoped to Changed Files

**Branch**: `ci/workflows-scope-heavy-checks` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/026-ci-check-scope/spec.md`

## Summary

Add one script, `scripts/workflows/ci-scope.sh`, that decides whether a check has anything to do. Wire it into `lint.yml`, `workflow-lint.yml` and `tests.yml`. Each job keeps its name and gates its expensive steps on the decision.

## Technical Context

**Language/Version**: Bash, GitHub Actions workflow YAML

**Primary Dependencies**: `git`, and `gh` (preinstalled on GitHub-hosted runners)

**Testing**: Bats (`tests/bash/ci-scope.bats`), actionlint, Spectral, the existing Jest contract tests

**Constraints**: No constitution change, no locked file touched, required check names unchanged

**Scale/Scope**: One new script, one new test file, three workflows, this specification, the allocation ledger, the catalogue and the changelog

## Constitution Check

| Principle | Result | Note |
| --- | --- | --- |
| III. Asset boundaries | Pass | The script is repository-authored and lives in root `scripts/`. The rules exist in one place. |
| X. Automated validation | Pass | The checks still report on every pull request. Only work that cannot change the result is skipped. |

## Decisions

### Decision 1: gate steps, not jobs or workflows

- **Rationale**: A workflow-level path filter leaves a required check pending. A job-level `if:` relies on a skipped job counting as success. Gating steps inside the job means the job always completes normally and reports success itself.
- **Precedent**: `claude-guard-tests.yml` already gates its steps this way.

### Decision 2: use the earlier result for later pushes

- **Rationale**: Looking only at the whole pull request does not help the measured case. A pull request with code changes would still re-run everything for a later one-line Markdown push.
- **Rule**: Skip when the latest push changed no file the check reads and the same check concluded success on the commit before it.
- **Safety**: The earlier commit must be an ancestor of the new head. Any other state runs the check.

### Decision 3: keep Jest's scope as it is

- **Rationale**: Jest tests read specifications, `CHANGELOG.md`, workflow files and other Markdown (25 test files reference them). Only plain pages directly under `docs/` were ignored before, and that stays. Jest gains the later-push rule only.

### Decision 4: every workflow change runs every scoped check

- **Rationale**: A mistake in a workflow or in the script should be caught by the checks it affects.

### Decision 5: add `checks: read`

- **Rationale**: The script reads the earlier check result through the GitHub API. The permission is read-only and scoped to the three workflows.

## Profiles

| Profile | Check | Files that run it |
| --- | --- | --- |
| `lint` | `Lint (JS/YAML/package.json)` | JavaScript and TypeScript files, YAML files, `package.json` and its lock file, root-level files other than prose |
| `typecheck` | `Typecheck` | JavaScript, TypeScript, Astro and JSON files, anything under `website/`, root-level files other than prose |
| `actionlint` | `actionlint` | `.github/actionlint.yaml`, `scripts/validation/run-actionlint.cjs`, root `package.json` and its lock file |
| `jest` | `No new test failures` | Everything except plain pages directly under `docs/` |

All profiles also run for any file under `.github/workflows/`, for the script itself and for `.nvmrc`.

## Project Structure

```text
scripts/workflows/ci-scope.sh      # new: the rules
tests/bash/ci-scope.bats           # new: 16 tests
.github/workflows/lint.yml         # gated: lint, typecheck
.github/workflows/workflow-lint.yml  # gated: actionlint
.github/workflows/tests.yml        # scope job calls the script
```

## Risks

| Risk | Mitigation |
| --- | --- |
| A profile misses a file the check reads | Lists err towards running. Workflow, script and root configuration changes always run. |
| The API call fails | The check runs. |
| A skipped result is trusted later | A skipped check reports success only when an earlier run on the same inputs passed, so the chain always ends at a real run. |
