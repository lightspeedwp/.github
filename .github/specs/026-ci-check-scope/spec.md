---
file_type: "documentation"
title: "Feature Specification: CI Checks Scoped to Changed Files"
description: "Defines when CI checks run or reuse a prior result."
version: "v1.0"
last_updated: "2026-11-24"
owners: ["LightSpeed Team"]
tags: ["ci", "github-actions", "spec-kit"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Feature Specification: CI Checks Scoped to Changed Files

**Feature Branch**: `ci/workflows-scope-heavy-checks`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Run heavy CI checks only when relevant files change"

## Context

Every push to a pull request runs almost the whole CI suite, whatever changed. The evidence is in [GIT-2803](https://linear.app/lightspeedwp/issue/GIT-2803):

- A one-line tick in a specification `tasks.md` started 14 workflows.
- Of the 16 workflows that trigger on pull requests, 12 have no path filter.
- The `develop` ruleset requires five checks. Three of them (`Lint (JS/YAML/package.json)`, `Typecheck`, `actionlint`) do heavy work that a Markdown change cannot affect.

A workflow-level `paths:` filter is not usable for a required check. GitHub leaves the check pending when the workflow does not start, and the pull request cannot merge. The repository already works around this in two places (`tests.yml`, `claude-guard-tests.yml`), each with its own inline logic.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A push that cannot affect a check does not run it (Priority: P1)

A contributor pushes a change that touches no file a check reads. The check reports success in seconds and does not install dependencies or run its tool.

**Why this priority**: This is the waste the issue measures.

**Independent Test**: Push a commit that changes only a specification task list to a pull request whose other changes already passed.

**Acceptance Scenarios**:

1. **Given** a pull request that changes only Markdown under `.github/specs/`, **When** CI runs, **Then** lint, typecheck and actionlint report success without running their tools.
2. **Given** a pull request whose checks passed, **When** a later push changes only files a check does not read, **Then** that check reports success without running its tool.
3. **Given** the same later push, **When** the earlier result was a failure, was cancelled or cannot be read, **Then** the check runs.

---

### User Story 2 - A relevant change always runs the check (Priority: P1)

A change to a file a check reads runs that check, on every event.

**Why this priority**: Skipping a check that should have run is worse than the waste being removed.

**Independent Test**: Push a JavaScript change and a workflow change in separate commits and read the check logs.

**Acceptance Scenarios**:

1. **Given** a push that changes a JavaScript file, **When** CI runs, **Then** lint, typecheck and Jest run.
2. **Given** a push that changes a workflow file or the scope script, **When** CI runs, **Then** every scoped check runs.
3. **Given** a push to `develop`, a merge queue event or a manual run, **When** CI runs, **Then** every scoped check runs.
4. **Given** a force push, **When** CI runs, **Then** every check with a relevant file in the pull request runs.

---

### User Story 3 - Required checks still report (Priority: P1)

A pull request whose heavy work was skipped can still merge.

**Why this priority**: A required check that never reports blocks the merge.

**Independent Test**: Read the check list of a pull request where the heavy steps were skipped.

**Acceptance Scenarios**:

1. **Given** a skipped check, **When** the pull request's checks are listed, **Then** the check appears under its usual name with a success conclusion.
2. **Given** the `develop` ruleset, **When** this change merges, **Then** the five required check names are unchanged.

### Edge Cases

- The base commit is missing or the comparison fails: the step fails. It never reports "nothing to do".
- The earlier commit is not an ancestor of the new head (force push): the earlier result is not used.
- The earlier run was cancelled by a newer push: its conclusion is not success, so the check runs.
- The base branch moved since the earlier run: the earlier result tested a different merge, so the check runs.
- Jest reads prose. A read trace of the whole suite shows it reads 11,495 of the 11,745 tracked Markdown and text files, including every page under `docs/`. Only 47 of the 390 test files read or check for those files. Another 22 start programs other than Node, whose reads cannot be traced.
- The earlier rule that skipped Jest for plain `docs/` pages was unsound, because tests read those pages. It is removed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: One script MUST hold the rules for which files each check reads. Workflows MUST NOT repeat those rules inline.
- **FR-002**: A scoped check MUST keep its job and its name, and gate its expensive steps on the script's decision.
- **FR-003**: A check MUST be skipped only when no file it reads is changed in the pull request, or when the latest push changed no such file and the same check concluded success on the commit before that push, against the same base commit.
- **FR-004**: Every other case MUST run the check, including events other than `pull_request`, force pushes, and any error while reading the earlier result.
- **FR-005**: A failed comparison MUST fail the step.
- **FR-006**: Changes to any workflow file or to the script MUST run every scoped check.
- **FR-007**: The scoped checks are `Lint (JS/YAML/package.json)`, `Typecheck`, `actionlint` and the Jest suite.
- **FR-008**: The script MUST have automated tests for each rule above.
- **FR-009**: Workflows gain only the `checks: read` permission, which the script needs to read the earlier result.
- **FR-010**: A change to prose alone MUST run the test files that depend on prose, and only those. It MUST NOT skip Jest.
- **FR-011**: The list of prose-dependent test files MUST be generated from a read trace and committed. It MUST include every test file that reads a prose file, checks that one exists, or starts a program other than Node. The reads of a Node child process MUST be attributed to the test that started it.
- **FR-012**: Every full Jest run on a pull request head MUST record a read trace and fail when a traced test file is missing from the list.

### Key Entities

- **Profile**: The set of file patterns one check reads.
- **Decision**: `run=true` or `run=false`, with a reason, written for the workflow to gate on.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A Markdown-only push runs no lint, typecheck or actionlint tool.
- **SC-002**: A push that changes JavaScript runs lint, typecheck and Jest.
- **SC-003**: A pull request whose heavy steps were skipped shows all five required checks as successful.
- **SC-004**: The script's test suite passes, and covers skip, run, force push, failed earlier result and failed comparison.
- **SC-005**: This pull request shows both behaviours in its own check logs: a full run, then a skipped run after a push that changes only Markdown.
- **SC-006**: A Markdown-only push runs the listed test files only (69 of 390 when measured), and the list check passes on a full run.

## Assumptions

- Check results are deterministic for a given set of input files.
- A base branch that moves does not re-run checks today, and this change keeps that behaviour.

## Out of Scope

- `claude-guard-tests.yml`. It already skips its tests unless the pull request changes guard files. Its inline rule is asserted by contract tests and is left as it is.
- `labeling-unified.yml`, `changelog-unified.yml` and `pr-template-routing.yml`. They act on the pull request itself, not on file content.
- `documentation.yml`, `validate-specifications.yml` and `ruleset-drift.yml`. They already have path filters and are not required checks.
- The GitHub Code Quality run (`Analyze (python)` and `Analyze (javascript-typescript)`, about 150 seconds per push). It is a GitHub-managed workflow with no file in this repository. Its settings, read through `GET /repos/lightspeedwp/.github/code-quality/setup`, offer languages, a schedule and a runner type, and no path filter. The only ways to stop it running on prose are to drop a language or to turn the feature off, and both remove analysis from code changes too. It is left as it is.
- The ruleset setting that dismisses approvals on each push.
