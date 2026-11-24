---
file_type: "documentation"
title: "Tasks: CI Checks Scoped to Changed Files"
description: "Tracks the implementation and validation tasks for CI check scoping."
version: "v1.0"
last_updated: "2026-11-24"
owners: ["LightSpeed Team"]
tags: ["ci", "github-actions", "spec-kit"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Tasks: CI Checks Scoped to Changed Files

**Input**: Design documents from `.github/specs/026-ci-check-scope/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story the task belongs to

## Phase 1: Setup

- [X] T001 Measure what runs for a one-line Markdown push and record it in GIT-2803
- [X] T002 List every pull request workflow, its triggers and its path filters
- [X] T003 Allocate specification 026 with the generator and add its ledger row

## Phase 2: User Story 1 and 2 - The rules (Priority: P1)

- [X] T004 [US1] Write `scripts/workflows/ci-scope.sh` with the four profiles
- [X] T005 [US1] Add the later-push rule that uses the earlier check result
- [X] T006 [US2] Make workflow and script changes run every profile
- [X] T007 [P] [US2] Write `tests/bash/ci-scope.bats`

## Phase 3: User Story 3 - Wiring (Priority: P1)

- [X] T008 [US3] Gate the steps of both jobs in `.github/workflows/lint.yml`
- [X] T009 [US3] Gate the steps of `.github/workflows/workflow-lint.yml`
- [X] T010 [US3] Replace the inline rule in `.github/workflows/tests.yml` with the script
- [X] T011 [US3] Add `checks: read` to the three workflows

## Phase 4: Polish

- [X] T012 Run actionlint, Spectral, ShellCheck, Bats and the Jest contract tests that read these workflows
- [X] T013 [P] Add the catalogue entry
- [X] T014 [P] Add the changelog entry
- [X] T015 Open the pull request and read the check logs for a full run
- [X] T016 Push a Markdown-only commit and read the check logs for a skipped run

## Phase 5: Jest prose mode (added after review)

- [X] T017 [US1] Trace which prose files the suite reads and which test files read them
- [X] T018 [US1] Write `scripts/workflows/jest-read-tracer.cjs` and `tests/jest.setup.read-trace.cjs`
- [X] T019 [US1] Write `scripts/workflows/jest-prose-tests.cjs` and generate `tests/jest-prose-tests.json`
- [X] T020 [US2] Give the `jest` profile a prose mode and remove the unsound `docs/` skip
- [X] T021 [US3] Run the listed tests for prose changes in `.github/workflows/tests.yml`, and check the list on full runs
- [X] T022 Read the GitHub Code Quality settings and record why they stay as they are
- [ ] T023 Read the check logs for a full run with the list check, then for a prose-mode run
