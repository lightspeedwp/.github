---
file_type: documentation
title: LightSpeed Community Health and Automation Repository
description: Central control-plane repository for LightSpeed community health files, governance, automation, and portable AI operations assets.
version: "4.0"
last_updated: "2026-08-19"
owners:
  - LightSpeed Team
tags:
  - community-health
  - automation
  - governance
  - ai-operations
status: active
stability: stable
domain: governance
language: en
---

# LightSpeed Community Health and Automation Repository

This repository is the LightSpeed `.github` control plane and canonical source for shared governance, templates, labels, workflows, and reusable AI operations assets.

## Current Status

- Phase 1 instruction, schema, and agent audits are complete.
- Two-tier agent model is active:
  - Portable multi-file agents in `agents/`.
  - Spec-based GitHub-native agents in `.github/agents/`.
- Canonical schema path is `schemas/`.
- Release process is v4.0 with two-phase agentic gates. See `docs/RELEASE_PROCESS.md`.

## Canonical Paths

- `instructions/` — Portable instruction standards.
- `.github/instructions/` — Repo-local control-plane instructions.
- `agents/` — Portable multi-file agents.
- `.github/agents/` — Spec-based control-plane agents.
- `schemas/` — Canonical JSON schema definitions.
- `.github/reports/` — Audit and analysis reporting.

## Top-Level Documentation

- `AGENTS.md` — Global AI governance rules.
- `CLAUDE.md` — Repo-specific operating rules and release governance.
- `docs/README.md` — Documentation index.
- `instructions/README.md` — Portable instruction index.
- `schemas/README.md` — Schema inventory and validation guidance.

## Repository Structure

```text
.github/                       # GitHub-native control-plane assets
agents/                        # Portable multi-file agents
ai/                            # Canonical AI references
cookbook/                      # Implementation playbooks
docs/                          # Human-facing governance and process docs
hooks/                         # Portable guardrail hooks
instructions/                  # Portable standards
plugins/                       # Installable plugin bundles
prompts/                       # Reusable prompt templates
schemas/                       # Canonical JSON schemas
scripts/                       # Automation scripts
skills/                        # Reusable skills
tests/                         # Test suites
website/                       # Public site source
workflows/                     # Portable workflow playbooks
```

## Governance Flow

```mermaid
graph LR
    A["Community Health Files"] --> B["Labels and Templates"]
    B --> C["Automation Workflows"]
    C --> D["Quality Gates"]
    D --> E["Organisation-wide Consistency"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff
```

## Release Lifecycle

```mermaid
graph LR
    A["Phase 1\nPortable Release Agent"] --> B["release/vX.Y.Z\nVersion + Changelog"]
    B --> C["Phase 2\nAgentic Safety Gates"]
    C --> D["main\nTagged Release"]
    D --> E["Post-release Sync\nmain -> develop"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff
```

## Quick Start

1. Read `CONTRIBUTING.md` for contribution workflow.
2. Read `docs/BRANCHING_STRATEGY.md` for branch and PR policy.
3. Use `npm run lint-all` and `npm test` before opening a PR.
4. Follow `docs/RELEASE_PROCESS.md` for releases.
