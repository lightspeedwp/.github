---
file_type: "documentation"
title: "Implementation Plan: Remove the Unused Qodo PR-Agent Pilot"
description: "Plans the removal of the Qodo PR-Agent pilot and the clean-up of every reference to it."
version: "v1.0"
last_updated: "2026-11-24"
owners: ["LightSpeed Team"]
tags: ["ci", "github-actions", "spec-kit", "removal"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Implementation Plan: Remove the Unused Qodo PR-Agent Pilot

**Branch**: `ci/jest-tracer-gaps` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/027-qodo-pr-agent-removal/spec.md`

## Summary

Delete the 23 files that exist only for the Qodo PR-Agent pilot, remove its references from 22 other files, archive specification 019 without deleting it, and regenerate the list of prose-dependent Jest tests.

## Technical Context

**Language/Version**: Markdown, YAML, JSON, shell, JavaScript

**Testing**: The Jest suite (traced, to regenerate the prose list), Bats, the specification audit, the repository validators for skills and documentation

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:76122df4e9d231bc963cc8c5cf2039c3dc1d985e701c33babef2b455c609daee -->

**Constraints**: No locked file changes. Add allocation 027 and its supporting records to the ledger. Existing ledger records and the frozen test fixture stay unchanged.

<!-- /coderabbit-ai-generated:v1 -->

## Constitution Check

| Principle | Result | Note |
| --- | --- | --- |
| III. Asset boundaries | Pass | Removes a duplicate surface (a second reviewer's integration across 12 documents) and leaves one owner for review. |
| Locked files | Pass | `.specify/memory/constitution.md` is not edited. It names `.pr_agent.toml` only as an example of a platform-required file. |

## Decisions

### Decision 1: keep specification 019, marked Archived

- **Rationale**: The allocation ledger records 019 as materialised, and validation requires a materialised allocation to have its directory. Retiring or deleting it would also free a number that must never be reused.
- **Consequence**: Its links to removed files are historical and are not rewritten. A note at the top says the work was removed.

### Decision 2: remove the integration sections, do not reword them

- **Rationale**: Each of the twelve sections says the Qodo input is optional and that a fallback applies unchanged. Without the tool the section describes nothing, and the fallback is already the normal behaviour.

### Decision 3: keep the history

- **Rationale**: The changelog entries, the 019 feedback record at the repository root and the ledger describe what happened. Only the operational surface is removed.

### Decision 4: leave the outside-the-repository steps to a maintainer

- **Rationale**: Deleting an Environment, a secret and an API key is outward-facing and irreversible, and the key is a credential. They are listed in the pull request and in GIT-2840.

### Decision 5: leave the constitution alone

- **Rationale**: It is locked and needs an approved change request. Its mention of `.pr_agent.toml` is one example in a list, so a stale example is harmless.

## Removed

| Path | Count |
| --- | --- |
| `.github/workflows/qodo-pr-agent*.yml` | 4 |
| `.pr_agent.toml` | 1 |
| `docs/QODO_PR_AGENT.md` | 1 |
| `scripts/metrics/qodo-pr-agent-report.cjs` | 1 |
| `skills/qodo-pr-agent/` | 8 |
| `tests/js/qodo-pr-agent-*.test.js` | 7 |
| `.github/reports/metrics/qodo-pr-agent/` | 1 |
| Total | 23 |

The 12 agent and skill documents lose their integration section. The `issue-agent` loses one bullet. The docs index, `WORKFLOWS.md`, the workflow README, the AI feedback summary, the CodeRabbit alignment guide, the Linear integration guide and two agent READMEs lose their references, and the skill registry loses one entry.

## Project Structure

```text
.github/specs/027-qodo-pr-agent-removal/   # new: this specification
.github/specs/019-qodo-pr-agent-integration/  # kept, Archived
.github/specs/ALLOCATIONS.json             # 027 row added
tests/jest-prose-tests.json                # regenerated
```

## Risks

| Risk | Mitigation |
| --- | --- |
| A link or reference is missed | A search of tracked files for the Qodo names, with the expected exceptions listed in the specification |
| A removed test was the only coverage of a shared helper | The suite is run before and after, and the traced run regenerates the prose list |
| Another repository calls the reusable workflow | The pilot report records that no other repository was enabled |
