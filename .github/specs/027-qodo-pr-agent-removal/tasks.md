---
file_type: "documentation"
title: "Tasks: Remove the Unused Qodo PR-Agent Pilot"
description: "Lists the tasks for removing the Qodo PR-Agent pilot and its references."
version: "v1.0"
last_updated: "2026-11-24"
owners: ["LightSpeed Team"]
tags: ["ci", "github-actions", "spec-kit", "removal"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Tasks: Remove the Unused Qodo PR-Agent Pilot

**Input**: Design documents from `.github/specs/027-qodo-pr-agent-removal/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story the task belongs to

## Phase 1: Setup

- [X] T001 Establish that the pilot never ran and is not the paid platform
- [X] T002 List every tracked file that names the pilot, and separate the files it owns from the references
- [X] T003 Allocate specification 027 with the generator and add its ledger row

## Phase 2: User Story 1 - Nothing runs (Priority: P1)

- [X] T004 [US1] Remove the four workflows
- [X] T005 [US1] Remove the seven tests, the report script and the pilot report

## Phase 3: User Story 2 - No dangling references (Priority: P1)

- [X] T006 [P] [US2] Remove the integration section from the 7 agent and 5 skill documents
- [X] T007 [P] [US2] Remove the references from the workflow README, the docs index, `WORKFLOWS.md`, the AI feedback summary, the alignment guide, the Linear guide, two agent READMEs and the skill registry
- [X] T008 [US2] Remove the guide, the skill folder and `.pr_agent.toml`
- [X] T009 [US2] Search tracked files for the Qodo names and confirm only the listed exceptions remain

## Phase 4: User Story 3 - History and allocation (Priority: P2)

- [X] T010 [US3] Mark specification 019 Archived and update the catalogue
- [X] T011 [US3] Add the 027 catalogue entry and update the next-number text
- [X] T012 [US3] Run the specification audit with 019 still materialised

## Phase 5: Polish

- [X] T013 Regenerate the prose-dependent test list from a traced run
- [X] T014 Add the changelog entry
- [X] T015 Run the Jest suite, the validators and the linters
- [ ] T016 Read the check logs on the pull request
- [ ] T017 Maintainer hand-off, outside the repository (FR-009): delete the `qodo-pr-agent` Environment and its secret `ANTHROPIC_API_KEY_QODO_PR_AGENT`, revoke the dedicated Anthropic key, and close lightspeedwp/.github#3535
