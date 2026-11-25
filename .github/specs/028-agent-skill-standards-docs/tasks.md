---
file_type: "documentation"
title: "Tasks: Agent and Skill Standards Documentation"
description: "Lists the tasks for rewriting the nine agent and skill standards documents."
version: "v1.0"
last_updated: "2026-11-25"
owners: ["LightSpeed Team"]
tags: ["agents", "skills", "standards", "documentation", "spec-kit"]
status: "draft"
stability: "experimental"
domain: "governance"
---

# Tasks: Agent and Skill Standards Documentation

**Input**: Design documents from `.github/specs/028-agent-skill-standards-docs/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story the task belongs to

## Phase 1: Setup

- [X] T001 Measure the nine documents on `develop` (lines, last change, superseded terms)
- [X] T002 Confirm from `docs/AGENT_STANDARDS.md` that it describes `agent.md`, `version`, `providers` and `.js` skills
- [X] T003 Allocate specification 028 with the helper and add its ledger row and catalogue entry

## Phase 2: Verify the sources

- [ ] T004 Read the current Agent Skills specification and record each rule with its URL and date
- [ ] T005 [P] Read the current Claude Code subagents, skills, plugins and memory documentation and record each rule with its URL and date
- [ ] T006 [P] Read the current GitHub custom agents and `agents.md` documentation and record each rule with its URL and date
- [ ] T007 Reconcile any source that no longer matches the GIT-2302 decisions and report the difference on GIT-2302

## Phase 3: User Story 1 - Agents (P1)

- [ ] T008 [US1] Rewrite `docs/AGENT_STANDARDS.md` for `agents/*.agent.md`, `name`, `description`, `tools`, `model` and `AGENTS.md`
- [ ] T009 [US1] Create a sample agent that declares `file_type: "agent"`, `title` and `last_updated` in a temporary tree, run `validate-skills.js` with that tree as the working directory, then run `validate-agent-frontmatter.js` (no path argument) and `validate-agents.js`, and record each failure or `Skipped` result as a gap without changing the validators
- [ ] T010 [US1] Add the enforcement table and record rules that nothing checks

## Phase 4: User Story 2 - Skills (P1)

- [ ] T011 [US2] Update `docs/SKILLS_STANDARDS.md` for the six frontmatter fields, name and size limits, and platform routing outside `SKILL.md`
- [ ] T012 [US2] Create a sample skill from the document, check it against the specification rules, run `validate-skills.js` with its temporary tree as the working directory, and record either success or a validator gap
- [ ] T013 [US2] Add the distribution section for `.claude-plugin/marketplace.json` and its path rules

## Phase 5: User Story 3 - The other seven documents (P2)

- [ ] T014 [P] [US3] Rewrite `docs/INSTRUCTIONS_STANDARDS.md` with the formats Claude Code loads and does not load
- [ ] T015 [P] [US3] Rewrite `docs/PROMPTS_STANDARDS.md` with the formats Claude Code loads and does not load
- [ ] T016 [P] [US3] Rewrite `docs/PLUGINS_STANDARDS.md` for `.claude-plugin/plugin.json` and the marketplace file
- [ ] T017 [P] [US3] Update `docs/HOOKS_STANDARDS.md`, `docs/WORKFLOWS_STANDARDS.md`, `docs/COOKBOOKS_STANDARDS.md` and `docs/AI_REFERENCES_STANDARDS.md`
- [ ] T018 [US3] Search the nine documents for the superseded terms and remove each standard-setting use

## Phase 6: User Story 4 - Enforcement (P2)

- [ ] T019 [US4] Compare each rule with `scripts/validation/` and mark it enforced or guidance
- [ ] T020 [US4] List the unenforced rules as input for the validation specification

## Phase 7: Polish

- [ ] T021 Update `.github/specs/CATALOG.md`, add a standards section to `docs/index.md`, check `docs/README.md` and `docs/AGENT-INDEX.md`, and update each document's cross-references
- [ ] T022 Run `markdownlint`, link checking, frontmatter validation and the specification audit
- [ ] T023 Record the outcome and the open gaps on GIT-2302
- [ ] T024 Record on GIT-2626 that specification 014 FR-002 requires `AGENT.md` and conflicts with the adopted structure

## Dependencies

- T004 to T007 before any rewrite task.
- T008 and T011 before T014 to T017.
- T019 after every rewrite task.
- T022 and T023 last.
