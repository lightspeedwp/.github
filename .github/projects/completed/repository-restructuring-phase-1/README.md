---
file_type: readme
title: Repository Restructuring Phase 1
description: Comprehensive Phase 1 restructuring of LightSpeedWP .github repository with asset consolidation and schema migration
created_date: 2026-07-24
last_updated: 2026-08-05
version: 1.0.0
status: complete
maintainer: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags:
  - restructuring
  - repository
  - phase-1
  - consolidation
---

# Repository Restructuring Phase 1

## Project Status

✅ **COMPLETE** — Phase 1 restructuring merged to develop (458 files, 250+ reference updates).

## Overview

Comprehensive reorganization of the `.github` repository to establish clear separation between:

- **Control-plane assets** (GitHub-native governance, workflows, scripts)
- **Portable assets** (reusable across LightSpeedWP projects)

## Key Accomplishments

### File Consolidation

- ✅ Moved `scripts/` to `.github/scripts/`
- ✅ Moved `website/` to `.github/website/`
- ✅ Moved `projects/active/` to `.github/projects/active/`
- ✅ Migrated `schema/` to `schemas/` (visible root) with `.schemas/` (hidden) as destination

### Reference Updates

- ✅ Updated 250+ file references across workflows, scripts, and documentation
- ✅ Updated package.json npm scripts
- ✅ Updated GitHub workflow paths
- ✅ Validated all 458 files with zero data loss

### Phase 1 Audit Reports

- **INSTRUCTION_FILES_AUDIT.md** — 58 instruction files mapped (27 portable, 17 local)
- **SCHEMA_AUDIT_REPORT.md** — 25 core schemas across 3 locations
- **AGENT-AUDIT-COMPREHENSIVE.md** — 35 agents (19 spec, 16 multi-file)

## Related Documents

- See `PHASE-1-COMPLETION-STATUS.md` for detailed metrics
- See Phase 1 audit reports in `.github/projects/active/repo-restructuring-2026-07-25/`

## Phase 2-3 Planning

Phase 2B: Script consolidation and skills architecture  
Phase 3: Schema consolidation and portable asset standardization

---

**Project Lead:** Ash Shaw  
**Started:** 2026-07-24  
**Completed:** 2026-08-05  
**Archive Date:** 2026-08-06
