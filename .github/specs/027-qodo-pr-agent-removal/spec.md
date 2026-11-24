---
file_type: "documentation"
title: "Feature Specification: Remove the Unused Qodo PR-Agent Pilot"
description: "Defines the removal of the Qodo PR-Agent pilot workflows, skill, configuration, documentation and tests."
version: "v1.0"
last_updated: "2026-11-24"
owners: ["LightSpeed Team"]
tags: ["ci", "github-actions", "spec-kit", "removal"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Feature Specification: Remove the Unused Qodo PR-Agent Pilot

**Feature Branch**: `ci/jest-tracer-gaps`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Qodo PR-Agent is not going to be used, so the workflow should be removed"

## Context

Specification 019 piloted the open-source Qodo PR-Agent alongside CodeRabbit. The evidence in [GIT-2840](https://linear.app/lightspeedwp/issue/GIT-2840) is:

- It is the open-source PR-Agent (`The-PR-Agent/pr-agent`), run in this repository's CI with its own Anthropic key. It is not the paid Qodo platform, and specification 019 says the Qodo-hosted app is not used.
- It has never run. `QODO_PR_AGENT_ENABLED` is not set, so all 385 receiver runs were skips, and the pilot report says "not started".
- Its trigger workflow still runs on every pull request.
- One of its tests, `tests/js/qodo-pr-agent-workflow.test.js`, fails on `develop` because it pins an old `download-artifact` commit.
- CodeRabbit remains the automated reviewer.

The repository also has an internal `agents/pr-agent/`, which creates pull requests. It is unrelated and stays.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Nothing runs for a tool that is not used (Priority: P1)

A contributor opens a pull request and no Qodo PR-Agent workflow starts, and no check or test for it exists.

**Why this priority**: The trigger costs CI time on every pull request, for a tool that has never run.

**Independent Test**: List `.github/workflows/` and open a pull request.

**Acceptance Scenarios**:

1. **Given** the change is merged, **When** a pull request is opened, **Then** no workflow named "Qodo PR-Agent" starts.
2. **Given** the change is merged, **When** the Jest suite runs, **Then** it has no test file for Qodo PR-Agent, and the failing `download-artifact` pin test is gone.

---

### User Story 2 - Nothing is left pointing at removed files (Priority: P1)

A reader following a link or an agent following its instructions never reaches a removed file.

**Why this priority**: Twelve agent and skill documents describe an optional Qodo input, and several documents link to the removed guide and skill.

**Independent Test**: Search tracked files for the Qodo names, outside the history that is kept on purpose.

**Acceptance Scenarios**:

1. **Given** the change is merged, **When** tracked files are searched for the Qodo names, **Then** the only matches are specification 019, the allocation ledger, the changelog history, the locked constitution and a root feedback record of the 019 pull request.
2. **Given** the agent and skill documents, **When** they are read, **Then** none describes a Qodo input or links to the removed guide, skill or responsibility matrix.

---

### User Story 3 - History and the allocation survive (Priority: P2)

A maintainer can still read what was built and why it was removed, and the number 019 stays allocated.

**Why this priority**: The allocation ledger records 019 as materialised, and a retired or reused number is a defect.

**Independent Test**: Run the specification audit.

**Acceptance Scenarios**:

1. **Given** the change is merged, **When** the specification audit runs, **Then** it passes with 019 still materialised.
2. **Given** specification 019, **When** it is opened, **Then** its status is Archived and it says where the work went.

### Edge Cases

- Specification 019 links to files this change removes. Those links are historical and are not rewritten.
- The constitution is a locked file and names `.pr_agent.toml` as an example of a platform-required file. It is not edited here.
- The `Qodo PR-Agent • Trigger` workflow name may be cached by GitHub in the Actions list for old runs. That is not controllable from the repository.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The four workflows `qodo-pr-agent.yml`, `qodo-pr-agent-trigger.yml`, `qodo-pr-agent-reusable.yml` and `qodo-pr-agent-report.yml` MUST be removed.
- **FR-002**: `.pr_agent.toml`, `docs/QODO_PR_AGENT.md`, `scripts/metrics/qodo-pr-agent-report.cjs`, `skills/qodo-pr-agent/`, `.github/reports/metrics/qodo-pr-agent/` and the seven `tests/js/qodo-pr-agent-*.test.js` files MUST be removed.
- **FR-003**: The "Qodo PR-Agent integration" section MUST be removed from every agent and skill document that has one, and every other reference MUST be removed or reworded.
- **FR-004**: Specification 019 MUST stay, marked Archived, and its allocation MUST stay materialised.
- **FR-005**: `agents/pr-agent/` MUST NOT change, other than losing its Qodo section.
- **FR-006**: Locked files MUST NOT change.
- **FR-007**: The list of prose-dependent Jest tests MUST be regenerated from a trace after the tests are removed.
- **FR-008**: The changelog MUST record the removal and keep the earlier entries.
- **FR-009**: The steps outside the repository MUST be listed for a maintainer: delete the `qodo-pr-agent` Environment and its secret, revoke the Anthropic key, and close lightspeedwp/.github#3535.

### Key Entities

- **Pilot files**: The 23 tracked files that exist only for the pilot, besides the 11 files of specification 019, which are kept.
- **References**: Mentions of the pilot in other tracked files.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No workflow, skill, configuration, script or test for Qodo PR-Agent remains.
- **SC-002**: Searching tracked files for the Qodo names returns only the exceptions in User Story 2.
- **SC-003**: The specification audit passes with 027 allocated and 019 materialised.
- **SC-004**: The Jest suite has no failure that `develop` does not also have, and the failure caused by the Qodo workflow test is gone.
- **SC-005**: The required pull request checks pass.

## Assumptions

- The pilot's Environment, secret and key exist only to serve the pilot. Removing them is a manual step.
- No other repository calls `qodo-pr-agent-reusable.yml`. The pilot report says no other repository was enabled.

## Out of Scope

- Replacing Qodo PR-Agent with another reviewer.
- Editing the constitution, which is locked.
- Rewriting the links inside archived specification 019.
