# Data Model: Specs Directory Configuration

**Date**: 2026-09-14  
**Phase**: Phase 1 (Design)

## Configuration Schema

### Entity: SpecifyInitOptions

**File**: `.specify/init-options.json`  
**Purpose**: Store Specify tooling configuration and feature management settings

**Fields**:

```json
{
  "ai": "string",                    // AI integration (e.g., "claude")
  "ai_skills": "boolean",            // Enable AI skills support
  "feature_numbering": "string",     // Strategy: "sequential" | "timestamp"
  "here": "boolean",                 // Local initialization flag
  "integration": "string",           // Integration type (e.g., "claude")
  "script": "string",                // Script interpreter (e.g., "sh")
  "speckit_version": "string",       // Version of speckit installed
  "specs_directory": "string"        // NEW: Directory for feature specs (e.g., ".github/specs")
}
```

### Field Specifications

#### `specs_directory` (NEW)

- **Type**: String (directory path)
- **Required**: No (defaults to `.github/specs` if omitted)
- **Format**: Repository-relative path (no leading `/`; no `.` or `..` path segments)
- **Valid Values**:
  - `.github/specs` (recommended)
  - `specs` (legacy, not recommended)
  - Any valid relative path
- **Validation Rules**:
  - Must be a valid directory path (no special characters except `.`, `/`, `-`, `_`)
  - Must not reference parent directories (`..`)
  - Should be under version control (not in `.gitignore`)
- **Usage**: Read by `.specify/scripts/bash/create-new-feature.sh` and other spec management scripts
- **State Transitions**:
  - Unset → Use default `.github/specs`
  - Set to value → Use specified directory
  - Change during project lifecycle → Requires migration of existing specs

## Directory Structure

### Before: Current (Root-Level Specs)

```
repository-root/
├── specs/
│   ├── 002-coderabbit-config-improvements/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── ...
│   └── 006-specs-directory-fix/
│       ├── spec.md
│       ├── plan.md
│       └── ...
└── .github/
    └── ...
```

### After: Target (.github/specs)

```
repository-root/
├── .github/
│   ├── specs/
│   │   ├── 002-coderabbit-config-improvements/
│   │   │   ├── spec.md
│   │   │   ├── plan.md
│   │   │   └── ...
│   │   └── 006-specs-directory-fix/
│   │       ├── spec.md
│   │       ├── plan.md
│   │       └── ...
│   └── ...
└── (empty root specs/ - can be removed)
```

## Configuration Evolution

| Version | State | Behavior |
|---------|-------|----------|
| Pre-fix | `specs_directory` field absent | Creates specs in `/specs` (current bug) |
| Post-fix | `specs_directory: ".github/specs"` | Creates specs in `.github/specs` (correct) |
| Future | `specs_directory` customizable | Allows org-specific paths if needed |

## Relationships & Dependencies

### Dependencies

- `.specify/init-options.json` ← Configuration source
- `.specify/scripts/bash/common.sh` ← Helper functions
- `.specify/scripts/bash/create-new-feature.sh` ← Script that reads config
- CLAUDE.md ← Documentation of intent

### Dependents

- `/speckit-specify` skill ← Uses create-new-feature.sh
- `/speckit-plan` skill ← References spec location
- `/speckit-tasks` skill ← Resolves spec paths
- Repository automation ← Depends on spec locations

## Validation Rules

1. **Path Validation**
   - A missing destination is valid when it can be created on first use in an accessible, writable parent location
   - An existing destination must be accessible and writable
   - Must not contain invalid characters

2. **Specification Integrity**
   - All moved specs must maintain file structure
   - No loss of metadata or content
   - Feature numbering sequence preserved

3. **Backwards Compatibility**
   - Scripts must function if `specs_directory` field is absent
   - Default behavior must be sensible (`.github/specs`)

## State Transitions

### Migration Path: Root → .github/specs

```
Step 1: Add to init-options.json
  specs_directory: ".github/specs" ← NEW

Step 2: Update create-new-feature.sh
  Read specs_directory from config
  Create directories under configured path

Step 3: Migrate existing specs
  cp -r specs/* .github/specs/
  rm -rf specs/

Step 4: Verify
  Check all specs in new location
  Run `/speckit-specify` test
  Confirm all references updated
```

## Success Criteria

- ✅ `specs_directory` field present in init-options.json
- ✅ All shell scripts read and respect this configuration
- ✅ Existing specs successfully migrated with zero data loss
- ✅ New specs created via `/speckit-specify` land in `.github/specs/`
- ✅ All downstream speckit commands (plan, tasks, etc.) resolve paths correctly
- ✅ CLAUDE.md documents the new location
