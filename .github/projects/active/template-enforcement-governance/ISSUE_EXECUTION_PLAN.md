---
title: "Template Enforcement Governance - OpenSpec Execution Plan"
description: "Sequenced /opsx:propose plan for issue-template and PR-template governance tracks."
file_type: "documentation"
version: "1.0.0"
last_updated: "2026-06-08"
created_date: "2026-06-08"
authors: ["github-copilot"]
maintainer: "LightSpeed Team"
status: active
---

# OpenSpec Execution Plan

## Objective

Run `/opsx:propose` for both governance tracks in the required order and capture outcomes in `RUN_LOG.md`.

## Command Sequence

1. `/opsx:propose .github/projects/active/template-enforcement-governance/openspec-strict/children/01-issue-template-governance-enforcement.md`
2. `/opsx:propose .github/projects/active/template-enforcement-governance/openspec-strict/children/02-pr-template-governance-enforcement.md`

## Controls

- Execute from repository root.
- Record each attempt with timestamp, outcome, and notes.
- If terminal CLI does not support slash commands, record blocker and equivalent fallback attempt.
