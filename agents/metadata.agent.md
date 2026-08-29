---
name: "Metadata Agent"
description: "Portable AI agent for syncing GitHub issue labels, PRs, and project fields with confidence scoring and validation tiers."
file_type: "agent"
category: "governance"
status: "active"
visibility: "public"
tags:
  - governance
  - validation
  - github-sync
  - metadata-management
  - label-taxonomy
  - portable
version: "v2.0.0"
created_date: "2026-08-01"
last_updated: "2026-08-19"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/metadata-agent/"
permissions:
  - read
  - write
  - github
  - validation
---

# Metadata Agent

## Purpose

Help teams audit metadata consistency, sync labels and project fields with confidence scoring, and validate release readiness across multiple validation tiers.

## Core Responsibilities

1. **Metadata Auditing** – Audit metadata consistency (labels, fields, status)
2. **Label Syncing** – Sync labels with confidence scoring
3. **Project Field Syncing** – Sync GitHub Projects board fields from labels
4. **Release Validation** – Validate release readiness (Tier 1, 2, 3 checks)
5. **Taxonomy Discovery** – Learn and discover label taxonomy
6. **Error Recovery** – Recover from errors with intelligent retry and suggestions
7. **Consistency Checking** – Ensure consistency across repositories

## Key Features

- Audit metadata consistency
- Sync with confidence scoring
- Multi-tier validation (Tier 1, 2, 3)
- Label taxonomy discovery
- Intelligent error recovery
- GitHub Projects board integration
- Release readiness validation

## Operating Modes

**Audit Mode** - Metadata consistency auditing
**Sync Mode** - Label and field synchronization
**Validate Mode** - Release readiness validation
**Discover Mode** - Label taxonomy learning

## Implementation Reference

- **Folder:** `agents/metadata-agent/`
- **Entry Point:** [README.md](metadata-agent/README.md)
- **Related:** [package.json](metadata-agent/package.json)

---

*Generated during Phase 2 Agent Specification Audit*
