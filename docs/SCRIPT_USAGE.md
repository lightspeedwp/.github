---
title: Project Documentation Update Script Usage
description: Complete guide for using the project-docs-update.sh automation script
---

# Project Documentation Update Script Usage

## Overview

The `project-docs-update.sh` script automates the creation and maintenance of project documentation files:

- **PLANNING.md** — Project specification and planning document
- **OPENSPEC.md** — Technical specification (stub by default)
- **README.md** — Project overview and orientation

## Quick Start

### Dry-Run Mode (Safe—No Changes)

```bash
# Show what would be created without making changes
./scripts/automation/project-docs-update.sh

# With verbose output
VERBOSE=true ./scripts/automation/project-docs-update.sh
```

### Execute Changes

```bash
# Create missing documentation files
DRY_RUN=false ./scripts/automation/project-docs-update.sh

# With verbose output
DRY_RUN=false VERBOSE=true ./scripts/automation/project-docs-update.sh
```

### Display Help

```bash
./scripts/automation/project-docs-update.sh --help
# or
./scripts/automation/project-docs-update.sh -h
```

## Environment Variables

| Variable | Values | Default | Purpose |
|----------|--------|---------|---------|
| `DRY_RUN` | `true` \| `false` | `true` | Enable/disable file creation |
| `VERBOSE` | `true` \| `false` | `false` | Enable detailed output |

## Examples

### Example 1: Check Status (Dry-Run with Verbose Output)

```bash
DRY_RUN=true VERBOSE=true ./scripts/automation/project-docs-update.sh
```

**Output:**

```
[INFO] === Project Documentation Update Suite ===
[INFO] DRY_RUN: true
[INFO] VERBOSE: true

[INFO] Processing all projects in .github/projects/active...
[INFO] Processing: my-first-project
[VERBOSE] → Creating PLANNING.md
[VERBOSE]   [DRY-RUN] Would copy PLANNING_TEMPLATE.md
[VERBOSE] → Creating OPENSPEC.md (stub)
[VERBOSE]   [DRY-RUN] Would create OPENSPEC.md stub
[VERBOSE] → Creating README.md
[VERBOSE]   [DRY-RUN] Would copy README_TEMPLATE.md

[INFO] === SUMMARY ===
[INFO] Projects processed: 1
[INFO] PLANNING.md files created: 1
[INFO] OPENSPEC.md files created: 1
[INFO] README.md files created: 1

[WARN] DRY-RUN MODE: No files were actually modified
[INFO] Run with DRY_RUN=false to apply changes
```

### Example 2: Create Documentation (Execute Changes)

```bash
DRY_RUN=false ./scripts/automation/project-docs-update.sh
```

**Output:**

```
[INFO] === Project Documentation Update Suite ===
[INFO] DRY_RUN: false
[INFO] VERBOSE: false

[INFO] Processing all projects in .github/projects/active...
[INFO] Processing: my-first-project
[SUCCESS] ✓ Created PLANNING.md
[SUCCESS] ✓ Created OPENSPEC.md (stub)
[SUCCESS] ✓ Created README.md

[INFO] === SUMMARY ===
[INFO] Projects processed: 1
[INFO] PLANNING.md files created: 1
[INFO] OPENSPEC.md files created: 1
[INFO] README.md files created: 1

[SUCCESS] Documentation update complete!
```

### Example 3: Validate Project Documentation

```bash
./scripts/automation/project-docs-update.sh
```

The script runs validation automatically and reports missing documentation:

```
=== VALIDATION ===
[SUCCESS] All critical documentation is in place!
```

Or if issues are found:

```
[ERROR] my-project: Missing README.md
[WARN] my-project: Missing OPENSPEC.md (acceptable for simple projects)
[ERROR] Some critical documentation is missing
```

## Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| `0` | Success | All required documentation is present or was created |
| `1` | Error | Critical documentation is missing or errors occurred |

## What Files Are Created

### PLANNING.md

**Template:** `.github/projects/_templates/PLANNING_TEMPLATE.md`

- Contains project scope, phases, and deliverables
- Automatically filled with project name and creation date
- Customization required after creation

**Example snippet:**

```markdown
# Project Name — Planning & Specification

**Created:** 2026-08-12

## Project Scope
[Details to be added]

## Phases
1. Phase 1: [Scope]
2. Phase 2: [Scope]
```

### OPENSPEC.md

**Template:** Auto-generated stub (no external template)

- Technical specification file (stub by default)
- References PLANNING.md for simple projects
- Extended during Phase 2 if needed

**Auto-generated content:**

```markdown
---
file_type: openspec
title: "Project Name — OpenSpec Specification"
status: draft

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
