---
file_type: documentation
title: "Phase 4 - Release Agent Coverage Hardening"
description: "Improve the release agent so it participates in the coverage programme and enforces the expected release-time checks."
version: "1.0.0"
last_updated: "2026-06-08"
owners: ["Ash"]
tags: ["automation", "coverage", "release-agent", "opsx"]
status: active
stability: stable
domain: quality
name: "Phase 4 - Release Agent Coverage Hardening"
about: "Harden the release agent with coverage-aware checks, guardrails, and reporting support."
labels: ["status:needs-review", "priority:important", "type:automation", "area:automation", "area:quality"]
---

# Phase 4 - Release Agent Coverage Hardening

## Summary

Improve the release agent so it participates in the coverage programme and enforces the expected release-time checks.

## Scope

- Task 4.1: review the release agent control flow.
- Task 4.2: add or update release-time coverage checks.
- Task 4.3: add guardrails for incomplete coverage data.
- Task 4.4: validate release output formatting.
- Task 4.5: ensure release-state transitions stay deterministic.
- Task 4.6: document any coverage-related release constraints.
- Task 4.7: add tests for the new release-agent paths.
- Task 4.8: ensure the release workflow still passes.
- Task 4.9: record rollout and rollback notes.
- Task 4.10: document the release-agent enhancement slice.

## Acceptance Criteria

- [ ] Release-agent behaviour is adjusted without breaking existing release flows.
- [ ] Coverage-aware checks are enforced where needed.
- [ ] Tests cover the new release-agent behaviour.
- [ ] Rollout and rollback notes are documented.

## Dependencies

- Phase 1 baseline checklist exists.
- Metrics and linting work is available as input for release validation.

## Additional Context

This phase protects the final release path from bad or incomplete coverage state.
