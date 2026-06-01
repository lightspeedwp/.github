---
title: "Archive Directory"
description: "Contains outdated or superseded documentation files preserved for historical reference"
version: "1.0"
created_date: "2025-12-08"
last_updated: "2025-12-08"
authors: ["LightSpeed Team"]
file_type: "documentation"
domain: "governance"
status: "archived"
---

# Archive Directory

This directory contains documentation files that are outdated, superseded, or no longer actively maintained but preserved for historical reference.

## Contents

### Migration Guides (Archived December 8, 2025)

**INSTRUCTION_CONSOLIDATION_MIGRATION.md** (394 lines)

- **Status:** Superseded by `/MIGRATION_GUIDE.md`
- **Purpose:** Documented the December 7, 2025 consolidation of 22 instruction files → 5
- **Reason for archival:** Duplicate content; canonical version exists at repository root
- **Estimated token savings:** ~1,970 tokens

**CONSOLIDATION_MIGRATION_GUIDE.md** (387 lines)

- **Status:** Superseded by `/MIGRATION_GUIDE.md`
- **Purpose:** Migration map for instruction file consolidation
- **Reason for archival:** Duplicate content; canonical version exists at repository root
- **Estimated token savings:** ~1,935 tokens

### Consolidated Instruction Files (Archived December 8, 2025)

**21 legacy instruction files consolidated on December 7, 2025:**

These files were the original pre-consolidation instruction files, superseded by 5 new consolidated files:

- agents.instructions.md (480 lines, ~2,400 tokens)
- file-management.instructions.md (387 lines, ~1,935 tokens)
- frontmatter.instructions.md (368 lines, ~1,840 tokens)
- javascript.instructions.md (86 lines, ~430 tokens)
- jest.instructions.md (47 lines, ~235 tokens)
- jsdoc.instructions.md (550 lines, ~2,750 tokens)
- json.instructions.md (97 lines, ~485 tokens)
- markdown.instructions.md (186 lines, ~930 tokens)
- mermaid.instructions.md (371 lines, ~1,855 tokens)
- metrics.instructions.md (53 lines, ~265 tokens)
- naming-conventions.instructions.md (46 lines, ~230 tokens)
- planner.instructions.md (61 lines, ~305 tokens)
- project-meta-sync.instructions.md (50 lines, ~250 tokens)
- readme.instructions.md (160 lines, ~800 tokens)
- release.instructions.md (218 lines, ~1,090 tokens)
- reporting.instructions.md (297 lines, ~1,485 tokens)
- reviewer.instructions.md (76 lines, ~380 tokens)
- saved-replies.instructions.md (90 lines, ~450 tokens)
- testing.instructions.md (203 lines, ~1,015 tokens)
- tests.instructions.md (273 lines, ~1,365 tokens)
- yaml.instructions.md (84 lines, ~420 tokens)

**Total legacy instructions:** 4,161 lines, ~20,805 tokens

**Superseded by:**

- `.github/instructions/languages.instructions.md` (consolidated: javascript, jsdoc, json, yaml)
- `.github/instructions/documentation-formats.instructions.md` (consolidated: markdown, frontmatter, mermaid)
- `.github/instructions/quality-assurance.instructions.md` (consolidated: testing, tests, jest)
- `.github/instructions/automation.instructions.md` (consolidated: agents, metrics, planner, project-meta-sync, release, reporting, reviewer)
- `.github/instructions/community-standards.instructions.md` (consolidated: file-management, naming-conventions, readme, saved-replies)

### Backup Files (Archived December 8, 2025)

**FRONTMATTER_SCHEMA.md.backup** (989 lines)

- **Purpose:** Backup before Phase 6.2 duplicate section removal
- **Estimated token savings:** ~4,945 tokens

**ISSUE_TYPES.md.backup** (952 lines)

- **Purpose:** Backup before Phase 6.1 consolidation
- **Estimated token savings:** ~4,760 tokens

**WORKFLOWS.md.backup** (657 lines)

- **Purpose:** Backup before Phase 6.4 title clarification
- **Estimated token savings:** ~3,285 tokens

**Total Phase 5 Archival:** 3,379 lines, ~16,895 tokens saved

---

## Accessing Archived Files

Archived files remain in the repository for historical reference. To access:

```bash
cd docs/.archive
cat FILENAME.md
```

## Canonical Versions

For current documentation, always reference:

- **Migration Guide:** `/MIGRATION_GUIDE.md` (canonical version)
- **All Instructions:** `.github/instructions/*.instructions.md` (consolidated files)

---

*This archive was created as part of Phase 5 context reduction efforts (December 2025) to reduce repository token count from ~922K to <500K target.*
