# Phase 1.C: Folder Finalization & Documentation (Claude Automation Prompt)

## Repository Restructuring — README & Structure Documentation

**Duration:** 1 day  
**Owner:** Claude Code Agent (automated documentation generation)  
**Status:** Ready to Execute  
**Prerequisites:** Phase 1.B complete, all path references updated

---

## Overview

Phase 1.C creates documentation and finalizes folder structure. This ensures developers understand the new organization and empty folders are tracked by git.

---

## Copy This Prompt for Claude

````text
PHASE 1.C: Finalize folder structure and create documentation.

STATUS: Phase 1.B complete. All path references updated and tests passing.

TASK: Create documentation for restructured folders and finalize structure.

=====================================
STEP 1: CREATE .gitkeep FILES
=====================================

These files ensure empty directories are tracked by git:

Create .github/tmp/.gitkeep:
- Content: Single line with comment explaining purpose

Create .github/memory/.gitkeep:
- Content: Single line with comment explaining purpose

File contents should be minimal comments explaining:
- Why the folder exists
- What it will contain
- When developers should use it

Example .gitkeep content:
```
# This directory holds temporary files during restructuring and CI/CD
# It is .gitignored but tracked by .gitkeep to ensure the folder structure exists
```

=====================================
STEP 2: CREATE .github/config/README.md
=====================================

Create file: .github/config/README.md

Content should document GitHub-native configuration files:

---
# GitHub Configuration

This directory contains GitHub-native configuration files specific to this repository.

## Contents

### Plugins
- `plugins/` — Plugin setup and configuration files
  - Individual plugin configuration files and manifests
  - See [plugins/README.md](../plugins/README.md) for details

### Labels & Issue Types
- `labels.yml` — Issue and PR label definitions
  - Used by GitHub's labeling UI
  - Loaded via organization workflows

- `issue-types.yml` — Custom GitHub issue type definitions
  - Defines available issue types for this repository
  - Controls issue template routing

### Automation
- `auto-labeler.yml` — Automatic labeling rules
  - Configures when labels are auto-applied
  - Evaluated on PR creation and updates

## For Developers

These are GitHub-specific configurations and typically don't require modification during development.

If you're setting up a **WordPress project workspace** that references this repository, see the root [config/](../../config/README.md) for shared linting and formatting configurations.

## Maintenance

These configurations are maintained by the `.github` repository team as part of the control plane.

See [CLAUDE.md](../../CLAUDE.md) for information about repository boundaries and asset organization.

---

=====================================
STEP 3: CREATE schemas/README.md
=====================================

Create file: schemas/README.md

Content should document schema organization and usage:

---
# Schemas

JSON Schema definitions for LightSpeed projects.

## Organization

Schemas are organized by **type**, with each subdirectory containing related schemas:

### Current Schema Types

#### memory/
- `memory-profile.schema.json` — User/team memory profile structure
- `memory-example.schema.json` — Example memory entry format
- Additional memory-related schemas as needed

*Future schema types will be added as needed (frontmatter, agents, plugins, etc.)*

## Using Schemas in Your Project

### For Validation Scripts

Validation scripts check files against these schemas. For example:

```bash
npm run validate:memory     # Validates memory records
npm run validate:agents     # Validates agent specs
npm run validate:plugins    # Validates plugin manifests
```

### For Reference

If you're creating a new document type or structured record, check the relevant schema to understand:
- Required fields
- Field types and formats
- Examples and defaults

### For Consumers (WordPress Project Teams)

If your WordPress project consumes agents, skills, or other assets from this `.github` repository, schemas ensure compatibility. Validation tools check that consumed assets match expected structure.

## Schema Consolidation History

**Date:** 2026-07-25  
**Status:** Consolidated  
**Sources:**
- `.schemas/` (hidden folder) — Contains memory and core schemas
- `schema/` (root-level) — Legacy schema location
- Both consolidated into single visible `schemas/` folder

This consolidation makes schemas discoverable and simplifies path references across the repository.

## Adding New Schemas

When adding a new schema type:

1. Create appropriate subdirectory: `schemas/{type}/`
2. Add `.schema.json` files
3. Update this README with documentation
4. Update validation scripts if needed
5. Update tooling references if needed

Example:
```
schemas/
├── memory/
│   ├── memory-profile.schema.json
│   └── memory-example.schema.json
├── frontmatter/            ← NEW TYPE
│   ├── frontmatter.schema.json
│   └── examples/
└── agents/                 ← FUTURE TYPE
    └── agent-spec.schema.json
```

## References

- [SPECIFICATION.md](../../.github/projects/active/repo-restructuring-2026-07-25/SPECIFICATION.md) — Restructuring specification
- [Repository Structure](../../CLAUDE.md#repository-boundaries) — Folder organization overview

---

=====================================
STEP 4: CREATE scripts/README.md
=====================================

Create file: .github/scripts/README.md

Content documents the scripts directory:

---
# Scripts

Portable validation and utility scripts for the `.github` repository.

## Directory Structure

```
scripts/
├── validation/
│   ├── validate-frontmatter.js      # Checks frontmatter in markdown files
│   ├── validate-agents.js            # Validates agent specifications
│   ├── validate-plugins.js           # Validates plugin manifests
│   ├── validate-memory.js            # Validates memory records
│   └── [other validation scripts...]
├── setup/
│   ├── setup-vscode-workspace.sh    # Automated VSCode setup
│   ├── setup-git-hooks.sh           # Git hook installation
│   └── install-vscode-extensions.sh # VSCode extension setup
└── [utility scripts...]
```

## Common Scripts

### Validation

Run validators via npm scripts:

```bash
npm run validate:frontmatter   # Check all markdown frontmatter
npm run validate:agents        # Check agent specifications
npm run validate:plugins       # Check plugin manifests
npm run validate:all           # Run all validations
```

### Setup

Run setup scripts for development environment:

```bash
./.github/scripts/setup-vscode-workspace.sh   # Full setup
./.github/scripts/setup-git-hooks.sh          # Hooks only
./.github/scripts/install-vscode-extensions.sh # Extensions only
```

## For Developers

If you need to modify or add validation scripts:

1. Add new script to appropriate subdirectory (validation/, setup/, etc.)
2. Update validation references in `package.json` if needed
3. Test the script locally before committing
4. Update this README if adding new validation or setup capabilities

## References

- [VSCode Plugin Troubleshooting](../../docs/vscode-plugin-troubleshooting.md) — Plugin setup and troubleshooting

---

=====================================
STEP 5: CREATE .github/reports/README.md
=====================================

Create file: .github/reports/README.md

Content documents the reports directory:

---
# Reports

Audit reports, metrics, and project artifacts generated during development.

## Directory Structure

```
reports/
├── audits/           # Codebase audits and assessments
├── metrics/          # Build metrics and performance data
├── releases/         # Release notes and changelogs
└── [other reports...]
```

## Using Reports

Reports are generated during:
- CI/CD pipelines
- Automated audits
- Release cycles
- Project planning phases

Reports help teams understand:
- Code quality and coverage
- Repository health
- Release readiness
- Dependency status

## For Maintenance

Reports directory is typically cleaned up before major commits to avoid report clutter in the main branch. Use `.gitignore` patterns to exclude large report files from version control.

---

=====================================
STEP 6: CREATE .github/projects/README.md
=====================================

Create file: .github/projects/README.md

Content documents the projects directory:

---
# Projects

Active project tracking, planning documents, and decision records.

## Directory Structure

```
projects/
├── active/
│   ├── repo-restructuring-2026-07-25/    # Current: Repository restructuring
│   ├── [other active projects]/
│   └── README.md                         # Active projects index
├── archived/
│   ├── [completed projects]/
│   └── README.md                         # Archive index
└── templates/
    └── [project templates for new initiatives]
```

## Active Projects

See [active/README.md](./active/README.md) for current project list.

## Creating New Projects

When starting a significant initiative:

1. Create `active/{slug}-{date}/` directory
2. Create `README.md` with project overview
3. Create phase documentation (PHASE-1.md, etc.)
4. Create INDEX.md to list all project files
5. Update active/README.md with project entry

Example structure:
```
active/
└── my-initiative-2026-08-15/
    ├── README.md
    ├── SPECIFICATION.md
    ├── INDEX.md
    ├── PHASE-1.md
    ├── PHASE-2.md
    └── [supporting files]
```

---

=====================================
STEP 7: CREATE .github/tmp/.gitignore
=====================================

Create file: .github/tmp/.gitignore

Content ensures temporary files are not tracked:

```
# Temporary files - not tracked by git
*
!.gitkeep
!.gitignore
```

This pattern:
- Ignores all files in this directory (`*`)
- But keeps .gitkeep so the folder is tracked (`!.gitkeep`)
- And keeps this .gitignore file (`!.gitignore`)

=====================================
STEP 8: CREATE .github/memory/.gitignore
=====================================

Create file: .github/memory/.gitignore

Content ensures memory sessions are managed by tool, not committed:

```
# Session memory - managed by Claude Code sessions
# These files are created and managed by Claude Code and should not be committed
*
!.gitkeep
!.gitignore
```

=====================================
STEP 9: UPDATE ROOT .gitignore
=====================================

Update root .gitignore to reflect new folder locations:

Find and update these patterns (if they exist):

OLD PATTERNS (to remove or update):
```
/tmp/
/memory/
/reports/tmp/
```

NEW PATTERNS (add if missing):
```
# Temporary and session files (moved to .github/)
/.github/tmp/
!/.github/tmp/.gitkeep
!/.github/tmp/.gitignore

/.github/memory/
!/.github/memory/.gitkeep
!/.github/memory/.gitignore
```

Verify .gitignore syntax is valid.

=====================================
STEP 10: UPDATE CLAUDE.md
=====================================

Update file: CLAUDE.md

Find section: "## Repository Boundaries"

Update the folder structure table to reflect new locations:

---
OLD TABLE ENTRY:
| scripts/ | Portable scripts | Top-level root |
| reports/ | Audit reports | Top-level root |

NEW TABLE ENTRY:
| .github/scripts/ | Validation & setup scripts | .github (repo-specific) |
| .github/reports/ | Audit reports & metrics | .github (repo-specific) |
| .github/projects/ | Active project tracking | .github (repo-specific) |
| schemas/ | JSON schema definitions | Root (portable) |

---

Also update the "Path Reference" section if present to document:
- scripts/ → .github/scripts/
- reports/ → .github/reports/
- .schemas/ → schemas/

=====================================
STEP 11: VERIFY STRUCTURE
=====================================

Run verification commands to ensure all files created correctly:

```bash
# Check all README files exist
ls -la .github/config/README.md
ls -la schemas/README.md
ls -la .github/scripts/README.md
ls -la .github/reports/README.md
ls -la .github/projects/README.md

# Check .gitkeep files exist
ls -la .github/tmp/.gitkeep
ls -la .github/memory/.gitkeep

# Check .gitignore files exist
ls -la .github/tmp/.gitignore
ls -la .github/memory/.gitignore

# Verify git status
git status
```

EXPECTED OUTPUT:
```
✅ All README files exist
✅ All .gitkeep files exist
✅ All .gitignore files exist
✅ git status shows new files ready to commit
```

=====================================
STEP 12: CREATE FINAL COMMIT
=====================================

After all documentation created, commit everything:

git add -A

git commit -m "refactor: Create documentation and finalize folder structure

Created documentation:
- .github/config/README.md — GitHub configuration documentation
- schemas/README.md — Schema organization and usage guide
- .github/scripts/README.md — Scripts directory documentation
- .github/reports/README.md — Reports directory documentation
- .github/projects/README.md — Project tracking documentation
- .gitkeep files in .github/tmp/ and .github/memory/
- .gitignore files in temporary directories

Updated:
- Root .gitignore with new folder locations
- CLAUDE.md with updated folder structure reference

This finalizes the folder structure after Phase 1.A and 1.B moves.
Phase 2 (schema consolidation) can now proceed.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

git log --oneline -3
```

EXPECTED OUTPUT:
- Commit created with clear message
- All documentation files staged
- Ready for Phase 2
````

---

## What to Expect

**Duration:** 1 day  
**Scope:** Create 5 README files, 2 .gitkeep files, 2 .gitignore files, update root .gitignore and CLAUDE.md

**Outcomes:**

- ✅ All folders have clear documentation
- ✅ Developers understand folder purposes
- ✅ Empty folders tracked by git
- ✅ Root configuration updated

---

## After Phase 1.C

Once Phase 1.C is complete:

- Repository structure is fully documented
- All folders have clear README files
- Empty folders are tracked by git
- Path references are updated
- Ready for Phase 2 (schema consolidation & validation)

---

**Document Version:** 1.0  
**Status:** Ready to Execute  
**Created:** 2026-07-26
