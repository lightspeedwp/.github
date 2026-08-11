---
title: "OpenSpec Project Location"
description: "Project-local guidance for storing OpenSpec changes under .github/projects/active while preserving CLI compatibility."
file_type: "documentation"
status: active
created_date: "2026-06-03"
last_updated: "2026-08-07"
version: "v1.0.0"
authors: ["github-copilot"]
tags: ["openspec", "opsx", "projects", "active"]
---

# OpenSpec Project Location

This repository keeps OpenSpec change data inside the active project area:

- `.github/projects/active/openspec/changes/...`

To remain compatible with the OpenSpec CLI, the repository root path `openspec` is a symlink that points to:

- `.github/projects/active/openspec`

## Why this setup

Current OpenSpec CLI configuration only supports global profile/workflow settings and does not expose a supported project-level key for overriding the changes directory.

The symlink keeps CLI behaviour unchanged while storing project artefacts in the preferred active planning structure.

## About This Project

OpenSpec is a **structured specification system** for tracking and coordinating major changes across the repository.

**What's Here:**
- `changes/` — Active specifications (proposals, designs, formal specs)
- `RFC.md` — Request for Comments establishing OpenSpec coordination model
- `COORDINATION_PLAN.md` — Implementation plan for GitHub issue linking

**Key Documents:**
- **[RFC.md](./RFC.md)** — Read this first to understand the OpenSpec coordination model
- **[COORDINATION_PLAN.md](./COORDINATION_PLAN.md)** — Step-by-step implementation plan

## Active Specifications

### 1. Agent-Tool Permission Alignment
**Purpose:** Canonical contract for agent tool access & permissions  
**Status:** 🟢 Active (Proposal phase)  
**Docs:** [proposal.md](./changes/agent-tool-permission-alignment/proposal.md) · [design.md](./changes/agent-tool-permission-alignment/design.md) · [spec.md](./changes/agent-tool-permission-alignment/specs/agent-tool-permission-contract/spec.md)

### 2. Test Coverage Implementation
**Purpose:** Expand test coverage to 80%+ (62-task programme)  
**Status:** 🟢 Active (Planning phase)  
**Docs:** [proposal.md](./changes/test-coverage-implementation/proposal.md) · [design.md](./changes/test-coverage-implementation/design.md) · [spec.md](./changes/test-coverage-implementation/specs/coverage-programme-issue-chain/spec.md)

## GitHub Issues (To Be Created)

**Agent-Tool Permission Alignment Spec:**
- Epic: Coordinate agent-tool permission contract work
- Phase 1: Audit existing agent specs
- Phase 2: Design contract & tiers
- Phase 3: Implement validation & CI enforcement
- Phase 4: Review & approve all agent specs

**Test Coverage Implementation Spec:**
- Epic: Expand test coverage to 80%+
- Phase 1-6: One issue per phase (mapped to OpenSpec input files)

*Issue numbers will be populated here after creation. See [COORDINATION_PLAN.md](./COORDINATION_PLAN.md#step-2-update-proposalmd-files-with-issue-links).*

## Operational notes

1. Run OpenSpec commands from repository root as usual.
2. New changes created by OpenSpec will resolve through the symlink and be written under `.github/projects/active/openspec/changes`.
3. Keep the `openspec` symlink committed in git.
4. If symlink drift occurs, recreate it from repository root:

   `ln -sfn .github/projects/active/openspec openspec`
