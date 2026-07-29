---
issue_number: 653
file_type: documentation
description: "Comprehensive audit of file organization and alignment with CLAUDE.md repository structure"
title: "[Audit] File Organization - Align with CLAUDE.md Repository Boundaries"
type: "type:audit"
area: "area:core"
priority: "priority:normal"
status: active
effort: "L"
children:
  - "5.1-current-vs-planned"
  - "5.2-agent-script-locations"
  - "5.3-migration-plan"
last_updated: '2026-06-01'
---

## Overview

Audit current file organization against the planned structure defined in CLAUDE.md and identify misalignments requiring refactoring.

## Current Problems

1. `.github/agents/` still exists but agents moved to `/agents` in root
2. `.github/scripts/` exists but scripts moved to `/scripts` in root
3. `.github/schemas/` exists but should be `/schema` or `/schemas` in root
4. Documentation in both `docs/` and `.github/docs/`
5. Uncertainty about which folders are reusable vs. GitHub-native

## Areas to Audit

See child issues for detailed audits of:

- `.github/` contents vs. root-level portable assets
- Agent file locations and migration status
- Script file locations and migration status
- Schema/config file locations
- Documentation folder organization
- Workflows folder structure
- Instructions folder organization

## Acceptance Criteria

- [ ] Current state mapped against CLAUDE.md
- [ ] All misalignments documented
- [ ] Migration plan with impact assessment and rollback procedures documented in `/docs/MIGRATION.md`
- [ ] Impact assessment completed

## Related Files

- `CLAUDE.md` (source of truth for repo boundaries)
- `.github/` (all folders)
- `agents/`
- `scripts/`
- `.schemas/` or `schemas/`
- `workflows/`
- `instructions/`

## Related Documentation

- [CLAUDE.md - Repository Boundaries](https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md#repository-boundaries)
- [File Organisation Instructions](https://github.com/lightspeedwp/.github/blob/develop/.github/instructions/file-organisation.instructions.md)
- [AGENTS.md](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md)
