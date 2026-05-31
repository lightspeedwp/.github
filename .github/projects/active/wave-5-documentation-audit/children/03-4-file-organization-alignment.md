---
issue_number: null
parent_issue: "3"
title: "[Child of #] Audit: Documentation Folder Structure vs. CLAUDE.md Boundaries"
type: "type:audit"
area: "area:core"
priority: "priority:normal"
status: "status:needs-triage"
effort: "M"
---

## Overview

Audit current documentation folder organization against the planned structure in CLAUDE.md to identify misplacements and reorganization needs.

## Scope

- Review current structure of `docs/`, `.github/`, `instructions/`, and related folders
- Compare against CLAUDE.md guidance for where documentation should live
- Identify misplaced files
- Identify missing documentation
- Propose reorganization plan with rationale

## Audit Checklist

- [ ] Extract current documentation file structure
- [ ] Review CLAUDE.md repository boundaries section
- [ ] Create mapping: Current Location → Expected Location
- [ ] Identify files in wrong folder
- [ ] Identify folders that need to be created
- [ ] Identify files that should be merged or archived
- [ ] Document rationale for any reorganization
- [ ] Create migration plan with dependencies

## Deliverables

- Current state documentation inventory
- Mapping table: File | Current Location | Expected Location (per CLAUDE.md) | Action
- Reorganization proposal with rationale
- Migration plan with step-by-step instructions
- Impact assessment (what breaks if we move X?)

## Related Files

- `CLAUDE.md` (source of truth)
- `docs/` (all files)
- `.github/` (all subfolders)
- `instructions/` (all files)
- `README.md` (root)

## Related Documentation

- [CLAUDE.md - Repository Boundaries](https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md#repository-boundaries)
- [File Organisation Instructions](https://github.com/lightspeedwp/.github/blob/develop/.github/instructions/file-organisation.instructions.md)
- [Organization Overview](https://github.com/lightspeedwp/.github/blob/develop/docs/ORGANIZATION.md)
