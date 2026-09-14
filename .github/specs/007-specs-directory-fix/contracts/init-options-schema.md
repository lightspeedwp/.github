# Contract: Specify Init Options Configuration Format

**Purpose**: Define the expected structure and behavior of `.specify/init-options.json`  
**Version**: 1.0  
**Date**: 2026-09-14

## Overview

The `.specify/init-options.json` file is the authoritative configuration source for the Specify tooling ecosystem. This contract defines the schema, validation rules, and expected behavior for all fields including the new `specs_directory` setting.

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Specify Init Options Configuration",
  "description": "Configuration for Specify feature management tooling",
  
  "properties": {
    "ai": {
      "type": "string",
      "description": "AI integration type",
      "enum": ["claude"],
      "default": "claude"
    },
    
    "ai_skills": {
      "type": "boolean",
      "description": "Enable AI skills support",
      "default": true
    },
    
    "feature_numbering": {
      "type": "string",
      "description": "Strategy for feature numbering",
      "enum": ["sequential", "timestamp"],
      "default": "sequential"
    },
    
    "here": {
      "type": "boolean",
      "description": "Local initialization flag",
      "default": true
    },
    
    "integration": {
      "type": "string",
      "description": "Integration type",
      "enum": ["claude"],
      "default": "claude"
    },
    
    "script": {
      "type": "string",
      "description": "Script interpreter",
      "enum": ["sh", "bash", "zsh"],
      "default": "sh"
    },
    
    "speckit_version": {
      "type": "string",
      "description": "Installed Specify version",
      "pattern": "^\\d+\\.\\d+\\.\\d+(\\.dev\\d+)?$"
    },
    
    "specs_directory": {
      "type": "string",
      "description": "Directory path for feature specifications",
      "default": ".github/specs",
      "pattern": "^(?!/)(?!(?:.*\\/)?(?:\\.|\\.\\.)(?:\\/|$))[a-zA-Z0-9._-]+(?:\\/[a-zA-Z0-9._-]+)*$",
      "examples": [".github/specs", "specs", "docs/specs"]
    }
  },
  
  "required": ["speckit_version"],
  "additionalProperties": false
}
```

## Validation Rules

### specs_directory Field

**Type**: String  
**Required**: No  
**Default**: `.github/specs`

**Validation**:

- ✅ Must be a valid relative path
- ✅ Must not reference parent directories (`..`)
- ✅ Must not start with `/` (not absolute)
- ✅ May contain letters, numbers, dots, hyphens, underscores, forward slashes
- ❌ Must not contain special characters (except `.`, `-`, `_`, `/`)
- ❌ Must not contain `.` or `..` segments in path

**Examples**:

| Value | Valid | Reason |
|-------|-------|--------|
| `.github/specs` | ✅ | Recommended location, valid path |
| `specs` | ✅ | Legacy location, still valid |
| `.github/specs/features` | ✅ | Nested, valid |
| `docs/specifications` | ✅ | Alternative location |
| `/specs` | ❌ | Absolute path not allowed |
| `../specs` | ❌ | Parent reference not allowed |
| `specs/../other` | ❌ | Parent segment not allowed |
| `specs/./other` | ❌ | Current-directory segment not allowed |
| `specs/../../other` | ❌ | Parent segments not allowed |
| `specs with spaces` | ❌ | Spaces not allowed |

## Usage

### Reading Configuration (Shell Script)

```bash
read_specs_directory() {
  local config_file="$REPO_ROOT/.specify/init-options.json"
  local configured_specs_dir

  # A missing configuration file is the only read failure that uses the fallback.
  if [[ ! -e "$config_file" ]]; then
    printf '%s\n' ".github/specs"
    return 0
  fi

  # Invalid JSON and non-string values are configuration errors, not defaults.
  if ! configured_specs_dir=$(jq -er '
    if has("specs_directory") then
      if (.specs_directory | type) == "string" then
        .specs_directory
      else
        error("specs_directory must be a string")
      end
    else # The optional field receives its schema default when omitted.
      ".github/specs"
    end
  ' "$config_file"); then
    echo "Error: Invalid configuration in $config_file" >&2
    return 1
  fi

  # Validate the repository-relative value before joining it to REPO_ROOT.
  if [[ "$configured_specs_dir" = /* ||
        ! "$configured_specs_dir" =~ ^[a-zA-Z0-9._-]+(/[a-zA-Z0-9._-]+)*$ ]]; then
    echo "Error: Invalid specs_directory in $config_file" >&2
    return 1
  fi

  case "/$configured_specs_dir/" in
    */./*|*/../*)
      echo "Error: Invalid specs_directory in $config_file: '.' and '..' path segments are not allowed" >&2
      return 1
      ;;
  esac

  printf '%s\n' "$configured_specs_dir"
}

configured_specs_dir=$(read_specs_directory) || exit 1

# Construct paths only after read_specs_directory has validated the value.
SPECS_DIR="$REPO_ROOT/$configured_specs_dir"
FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
```

### Example Configuration

**Minimal** (uses defaults):

```json
{
  "speckit_version": "1.0.7.dev0"
}
```

**Standard** (recommended):

```json
{
  "ai": "claude",
  "ai_skills": true,
  "feature_numbering": "sequential",
  "here": true,
  "integration": "claude",
  "script": "sh",
  "speckit_version": "1.0.7.dev0",
  "specs_directory": ".github/specs"
}
```

**Custom** (alternative location):

```json
{
  "ai": "claude",
  "ai_skills": true,
  "feature_numbering": "sequential",
  "here": true,
  "integration": "claude",
  "script": "sh",
  "speckit_version": "1.0.7.dev0",
  "specs_directory": "docs/specifications"
}
```

## Contracts for Consumers

### Specify Tooling Scripts

**Expected Behavior**:

- Read `specs_directory` from `.specify/init-options.json`
- Apply default `.github/specs` if field is absent
- Create feature directories under the configured location
- Resolve feature paths relative to `$REPO_ROOT`

**Error Handling**:

- If config file missing: Fall back to default
- If JSON invalid: Report error with file path and exit
- If specs_directory invalid: Report validation error and exit

### External Consumers (GitHub Actions, CI/CD)

**Expected Behavior**:

- Can read `.specify/init-options.json` to discover specs location
- Should use `jq` or equivalent to extract `specs_directory` field
- Should apply default if field absent

**Example** (GitHub Actions):

```yaml
- name: Discover specs directory
  id: specs-dir
  run: |
    SPECS_DIR=$(jq -r '.specs_directory // ".github/specs"' .specify/init-options.json)
    echo "directory=$SPECS_DIR" >> $GITHUB_OUTPUT

- name: Validate specs
  run: |
    find ${{ steps.specs-dir.outputs.directory }} -name "spec.md" -type f
```

## Backwards Compatibility

| Scenario | Before Fix | After Fix |
|----------|-----------|-----------|
| New repo with no specs | Create specs in `/specs` | Create specs in `.github/specs` (default) |
| Existing repo with field absent and root-level specs | Use hardcoded `/specs` | Must migrate first or set `specs_directory` to `"specs"` before using the updated tooling |
| Existing repo with field set | N/A (field didn't exist) | Use specified value |

**Migration Strategy**:

- Repositories with root-level `specs/` content must migrate that content to `.github/specs/` before relying on the new default
- Repositories that are not yet migrated must set `specs_directory` to `"specs"` so existing features remain discoverable
- After migration, remove the legacy override or set `specs_directory` to `".github/specs"`
- New repos get correct default

## Testing

### Test Cases

1. **Config File Parsing**
   - ✅ Valid JSON with all fields
   - ✅ Valid JSON with some fields
   - ✅ Valid JSON with just speckit_version
   - ❌ Invalid JSON (parse error)
   - ❌ Missing required fields

2. **specs_directory Validation**
   - ✅ Valid relative paths
   - ✅ Paths with subdirectories
   - ✅ Default value applied
   - ❌ Absolute paths (start with `/`)
   - ❌ Current-directory or parent references (`.` or `..` path segments)
   - ❌ Invalid characters

3. **Script Integration**
   - ✅ Scripts read and respect specs_directory
   - ✅ Feature creation works with configured path
   - ✅ Missing config file uses default
   - ❌ Invalid JSON reports the config file path and exits
   - ❌ Invalid specs_directory reports the config file path and exits

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-09-14 | Initial contract with specs_directory field definition |

## References

- [Data Model](../data-model.md)
- [Quickstart Validation](../quickstart.md)
- `.specify/init-options.json` (implementation reference)
