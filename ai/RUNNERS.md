---
title: "AI Runner Inventory"
description: "Canonical inventory of JavaScript and Bash runners plus telemetry hooks used in this repository."
version: "v1.0.0"
last_updated: "2026-05-28"
file_type: "documentation"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team"]
license: "GPL-3.0"
tags: ["ai", "runners", "javascript", "bash", "telemetry"]
domain: "governance"
stability: "active"
---

# AI Runner Inventory

This file documents runner entry points currently used by repository automation.

## JavaScript Runners

- `scripts/agents/*.agent.js` - primary operational agent runners.
- `scripts/workflows/release/*.cjs` - workflow runtime wrappers for release and
  telemetry logic.
- `scripts/validation/*.js|*.cjs` - validation runners used in CI and local
  quality gates.

## Bash Runners

- GitHub workflow inline shell remains present in selected workflows during
  phased migration.
- Local shell hooks under `.husky/` (`pre-commit`, `pre-push`) orchestrate
  Node-based checks.
- Portable shell helpers under `skills/**/scripts/*.sh` remain out of scope for
  phase-1 workflow migration.

## Telemetry Hooks

- `.github/workflows/release.yml` trigger telemetry is emitted via
  `scripts/workflows/release/trigger-telemetry.cjs` and uploaded as
  `trigger-telemetry.json` artifact.
- Workflow-level health and metrics updates are recorded through existing
  metrics automation and reporting workflows in `.github/workflows/`.

## Migration Direction

- Default new runner logic to Node CLI scripts.
- Avoid introducing new Bash-heavy control-flow in workflows.
- Keep legacy shell runner inventory explicit until phase-2 migration is
  complete.
