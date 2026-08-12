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

# Project Name — OpenSpec Specification

See [PLANNING.md](./PLANNING.md) for project specifications.
```

### README.md

**Template:** `.github/projects/_templates/README_TEMPLATE.md`

- Project overview and quick orientation
- Automatically filled with project name and creation date
- Links to PLANNING.md and other key documents

## Template Files

All templates are stored in `.github/projects/_templates/`:

```
.github/projects/_templates/
├── PLANNING_TEMPLATE.md      # Planning document template
├── OPENSPEC_TEMPLATE.md      # (Optional) OpenSpec template
└── README_TEMPLATE.md        # README document template
```

**Template variables (auto-replaced):**

- `PROJECT_TITLE` → Project folder name
- `YYYY-MM-DD` → Current date

## Integration with CI/CD

### GitHub Actions Workflow

Example `.github/workflows/project-docs-maintenance.yml`:

```yaml
name: Project Documentation Maintenance

on:
  schedule:
    # Run nightly at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check project documentation
        run: |
          DRY_RUN=true VERBOSE=true ./scripts/automation/project-docs-update.sh
      
      - name: Report findings
        if: failure()
        run: |
          echo "⚠️ Some projects missing documentation"
          echo "Run: DRY_RUN=false ./scripts/automation/project-docs-update.sh"
```

## Troubleshooting

### Script not executable

```bash
chmod +x scripts/automation/project-docs-update.sh
```

### Template files not found

Ensure `.github/projects/_templates/` exists with required files:

```bash
ls -la .github/projects/_templates/
```

Expected output:

```
total 48
drwxr-xr-x   5 user  staff   160 Aug 12 12:00 .
drwxr-xr-x   8 user  staff   256 Aug 12 12:00 ..
-rw-r--r--   1 user  staff  1234 Aug 12 12:00 PLANNING_TEMPLATE.md
-rw-r--r--   1 user  staff   567 Aug 12 12:00 OPENSPEC_TEMPLATE.md
-rw-r--r--   1 user  staff   890 Aug 12 12:00 README_TEMPLATE.md
```

### Projects directory not found

Ensure `.github/projects/active/` exists:

```bash
mkdir -p .github/projects/active
```

### No output when running

Enable verbose mode:

```bash
VERBOSE=true ./scripts/automation/project-docs-update.sh
```

## Security Considerations

### Sed Injection Prevention

The script uses safe delimiter patterns for `sed` commands:

- Delimiter: `|` instead of `/` (safer for filenames)
- Character escaping: `${var//old/new}` for safe substitution
- No unquoted variables in sed patterns

This prevents injection attacks from special characters in project names:

✅ Safe: `project&name`, `project/name`, `project\name`

## Testing

Run the test suite:

```bash
./scripts/automation/test-project-docs-update.sh
```

Tests cover:

- Script existence and executability
- Help text display
- Dry-run mode functionality
- Template file presence
- Project validation logic
- Error handling
- Integration testing
- Special character handling
- Return value conventions
- Statistics format consistency

## Advanced Usage

### Creating Custom Templates

1. Create a custom template in `.github/projects/_templates/`:

```bash
cp .github/projects/_templates/PLANNING_TEMPLATE.md \
   .github/projects/_templates/PLANNING_CUSTOM.md
```

1. Modify as needed, keeping `PROJECT_TITLE` and `YYYY-MM-DD` placeholders

2. Extend script to use custom template (modify `create_planning_md()` function)

### Batch Processing

Process specific project subset:

```bash
# Process a single project directory
export PROJECTS_DIR=".github/projects/active/my-project"
./scripts/automation/project-docs-update.sh
```

### Integration with Project Maintenance Agent

The script is designed to be wrapped by the `Project Maintenance Agent`:

```
Project Maintenance Agent
  ↓
  Uses: project-docs-update.sh skill
  ↓
  Creates: PLANNING.md, OPENSPEC.md, README.md
  ↓
  Reports: Statistics and validation results
```

## See Also

- [.github/projects/_templates/](../.github/projects/_templates/) — Template directory
- [.github/projects/active/](../.github/projects/active/) — Active projects
- [ISSUE_MAINTENANCE_SCRIPTS.md](./ISSUE_MAINTENANCE_SCRIPTS.md) — Related automation
- [LABEL_MANAGEMENT_CLI.md](./LABEL_MANAGEMENT_CLI.md) — Label automation

## Questions?

For issues or feature requests, open a GitHub issue in the `.github` repository.
