---
issue_number: 672
file_type: documentation
description: "Audit agent and script file migration status"
parent_issue: 653
title: "[Child of [#653](https://github.com/lightspeedwp/.github/issues/653)] Audit: Agent & Script Files - Migration Status"
type: "type:audit"
area: "area:core"
priority: "priority:normal"
status: active
effort: "M"
---

## Overview

Audit the current location of agent and script files to determine migration status and identify items still in `.github/` that should be in root folders.

## Scope

- Check if `.github/agents/` still exists (should have moved to `/agents`)
- Check if `.github/scripts/` exists (should have moved to `/scripts`)
- Verify what remains in `.github/` vs. what's in root folders
- Document migration status for each file/folder
- Identify any duplication or orphaned files

## Audit Checklist

- [ ] List all files in `.github/agents/` (if exists)
- [ ] List all files in `.github/scripts/` (if exists)
- [ ] List all files in `agents/` (root level)
- [ ] List all files in `scripts/` (root level)
- [ ] Check for duplicate files in both locations
- [ ] Verify referenced paths in workflows/configs point to correct locations
- [ ] Document which files have been migrated vs. which haven't

## Deliverables

- Migration status audit report
- File inventory: Path | Current Location | Expected Location | Status | Notes
- List of files still needing migration
- List of potential duplicate files
- Recommendations for completion

## Related Files

- `.github/agents/` (if exists)
- `.github/scripts/` (if exists)
- `agents/` (root level)
- `scripts/` (root level)
- `.github/workflows/` (references to check)

## Related Documentation

- [CLAUDE.md - Repository Boundaries](https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md#repository-boundaries)
- [AGENTS.md](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md)
