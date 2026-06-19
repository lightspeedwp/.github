---
issue_number: 671
file_type: documentation
description: "Audit current file organization vs. CLAUDE.md"
parent_issue: 653
title: "[Child of [#653](https://github.com/lightspeedwp/.github/issues/653)] Audit: Current File Organization vs. CLAUDE.md Boundaries"
type: "type:audit"
area: "area:core"
priority: "priority:normal"
status: active
effort: "M"
---

## Overview

Audit current repository file organization against the planned structure defined in CLAUDE.md to identify misalignments.

## Scope

- Map current structure of `.github/`, root folders, and all major directories
- Compare against CLAUDE.md definitions for reusable vs. GitHub-native assets
- Identify misplacements of files/folders
- Document what's in the wrong location according to CLAUDE.md

## Audit Checklist

- [ ] Extract current directory structure
- [ ] Review CLAUDE.md repository boundaries section (source of truth)
- [ ] Create mapping: Current Location | Expected Location (per CLAUDE.md) | Status
- [ ] Identify items in wrong location
- [ ] Identify missing expected folders
- [ ] Identify unexpected items in `.github/`
- [ ] Document rationale for any current misplacements

## Deliverables

- Current state audit report
- Mapping document: Path | Current Location | Expected Location | Status
- List of misaligned items
- Impact assessment (what needs to move, what's OK as is)

## Related Files

- All folders and major files across repository
- `.github/` (entire folder)
- Root level folders: `agents/`, `scripts/`, `schemas/`, `docs/`, `workflows/`, etc.

## Related Documentation

- [CLAUDE.md - Repository Boundaries](https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md#repository-boundaries)
- [File Organisation Instructions](https://github.com/lightspeedwp/.github/blob/develop/.github/instructions/file-organisation.instructions.md)
- [Organization Overview](https://github.com/lightspeedwp/.github/blob/develop/docs/ORGANIZATION.md)
