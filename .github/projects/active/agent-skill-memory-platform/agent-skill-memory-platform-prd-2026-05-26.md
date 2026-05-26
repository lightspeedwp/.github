---
file_type: "project"
title: "Agent And Skill Memory Platform PRD"
description: "Product requirements for an expansive hybrid memory platform spanning all current agents and skills."
version: "v1.0.0"
last_updated: "2026-05-26"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["memory", "agents", "skills", "schemas", "validation", "governance"]
domain: "governance"
stability: "active"
---

# Agent And Skill Memory Platform PRD

## Objective

Deliver a hybrid memory platform that combines a global registry with per-asset memory profiles and validated examples for every current agent and skill in this repository.

## Scope

- In scope: memory schemas, memory registry, per-agent and per-skill memory profiles, example snapshots, packs, validation automation, drift checks, and local issue drafts.
- Out of scope: live GitHub issue posting, runtime mutation engines, external memory backends.

## Required Outcomes

- Coverage for all current assets: 19 agents and 89 skills.
- Strict schema contracts under `.schemas/memory/`.
- Registry and inventory lock under `workflows/memory/registry/`.
- Per-asset profiles and examples under `workflows/memory/profiles/` and `workflows/memory/examples/`.
- Validation command and test coverage for memory contracts.

## Contract Model

- Global: memory registry with counts, option-family taxonomy, and asset-to-file mapping.
- Local: per-asset memory profile defining retention, scope, sensitivity, required keys, and validation rules.
- Runtime/handoff: memory snapshot records with typed family ownership and confidence metadata.

## Acceptance Criteria

- [ ] Exactly 19 agent profiles and 89 skill profiles exist.
- [ ] Exactly 19 agent examples and 89 skill examples exist.
- [ ] Every profile has at least one valid example reference.
- [ ] Drift checks fail when any `*.agent.md` or `SKILL.md` lacks a profile.
- [ ] `validate:memory` passes in local validation.

## Delivery Notes

This programme keeps memory assets in portable top-level source folders and avoids adding new GitHub-native dependencies beyond project planning artefacts.
