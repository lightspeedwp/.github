# Quickstart: Validate Specs Directory Configuration

**Date**: 2026-09-14  
**Purpose**: End-to-end validation that specs directory configuration works correctly

## Overview

This guide provides runnable steps to verify that:

1. Configuration is correctly set
2. Specs are created in the right location
3. Speckit commands resolve paths correctly
4. Migration completed successfully

## Prerequisites

- Repository root: `/home/user/.github`
- Bash shell with `jq` installed
- Git repository with proper permissions
- `.specify/` tooling installed and configured

## Test Scenarios

### Scenario 1: Configuration Validation

**Objective**: Verify `.specify/init-options.json` has correct `specs_directory` setting

**Prerequisites**: None

**Setup Commands**:

```bash
cd /home/user/.github
```

**Test Commands**:

```bash
# Verify config file exists
test -f .specify/init-options.json && echo "✅ Config file exists" || echo "❌ Config file missing"

# Extract specs_directory value
SPECS_DIR=$(jq -r '.specs_directory' .specify/init-options.json)
echo "specs_directory value: $SPECS_DIR"

# Verify it equals .github/specs
if [ "$SPECS_DIR" = ".github/specs" ]; then
  echo "✅ specs_directory correctly set to .github/specs"
else
  echo "❌ specs_directory is '$SPECS_DIR', expected '.github/specs'"
fi

# Verify directory exists
if [ -d "$SPECS_DIR" ]; then
  echo "✅ Directory exists: $SPECS_DIR"
else
  echo "⚠️  Directory does not exist (will be created on first use)"
fi
```

**Expected Output**:

```
✅ Config file exists
specs_directory value: .github/specs
✅ specs_directory correctly set to .github/specs
✅ Directory exists: .github/specs
```

**Acceptance Criteria**:

- Config file is valid JSON
- `specs_directory` field equals `.github/specs`
- Directory is accessible and writable

---

### Scenario 2: Directory Structure

**Objective**: Verify existing specs have been migrated to `.github/specs/`

**Prerequisites**: Scenario 1 passed, migration completed

**Setup Commands**:

```bash
cd /home/user/.github
```

**Test Commands**:

```bash
# List all specs in .github/specs/
echo "Specs in .github/specs/:"
ls -1d .github/specs/*/

# Count specs
SPEC_COUNT=$(find .github/specs/ -name "spec.md" -type f | wc -l)
echo "Total specs found: $SPEC_COUNT"

# Verify no specs in root specs/ (if it still exists)
if [ -d "specs" ] && [ ! -z "$(ls -A specs 2>/dev/null)" ]; then
  echo "⚠️  WARNING: specs/ directory still has content. Should be empty after migration."
  ls -1d specs/*/
else
  echo "✅ No legacy specs in root specs/ directory"
fi

# Verify specific migrated spec
if [ -f ".github/specs/002-coderabbit-config-improvements/spec.md" ]; then
  echo "✅ Migrated spec found: 002-coderabbit-config-improvements"
else
  echo "❌ Expected migrated spec not found"
fi
```

**Expected Output**:

```
Specs in .github/specs/:
.github/specs/002-coderabbit-config-improvements/
.github/specs/007-specs-directory-fix/
Total specs found: 2
✅ No legacy specs in root specs/ directory
✅ Migrated spec found: 002-coderabbit-config-improvements
```

**Acceptance Criteria**:

- All specs located in `.github/specs/` subdirectories
- No specs remaining in legacy `specs/` location
- Existing spec content preserved (can read spec.md)

---

### Scenario 3: New Spec Creation

**Objective**: Verify `/speckit-specify` creates specs in `.github/specs/`

**Prerequisites**: Scenarios 1-2 passed

**Setup Commands**:

```bash
cd /home/user/.github
```

**Test Commands**:

```bash
# Create a test feature spec (dry-run to avoid actual creation)
TEST_OUTPUT=$(.specify/scripts/bash/create-new-feature.sh --json --dry-run "test validation scenario")

echo "Dry-run output:"
echo "$TEST_OUTPUT" | jq .

# Extract SPEC_FILE path
SPEC_FILE=$(echo "$TEST_OUTPUT" | jq -r '.SPEC_FILE')
echo ""
echo "Expected spec file path: $SPEC_FILE"

# Verify path is under .github/specs/
if [[ "$SPEC_FILE" == .github/specs/* ]]; then
  echo "✅ Spec file would be created in .github/specs/"
else
  echo "❌ Spec file path is incorrect: $SPEC_FILE"
fi
```

**Expected Output**:

```
Dry-run output:
{
  "BRANCH_NAME": "004-test-validation-scenario",
  "SPEC_FILE": "/home/user/.github/.github/specs/004-test-validation-scenario/spec.md",
  "FEATURE_NUM": "004",
  "DRY_RUN": true
}

Expected spec file path: /home/user/.github/.github/specs/004-test-validation-scenario/spec.md
✅ Spec file would be created in .github/specs/
```

**Acceptance Criteria**:

- Dry-run succeeds without errors
- SPEC_FILE path includes `.github/specs/` directory
- Feature numbering continues sequentially (004 after 003)

---

### Scenario 4: Documentation Verification

**Objective**: Verify CLAUDE.md documents specs location

**Prerequisites**: All previous scenarios passed

**Setup Commands**:

```bash
cd /home/user/.github
```

**Test Commands**:

```bash
# Check CLAUDE.md for specs location reference
if grep -q "\.github/specs" CLAUDE.md; then
  echo "✅ CLAUDE.md references .github/specs"
  echo "Context:"
  grep -A2 -B2 "\.github/specs" CLAUDE.md | head -10
else
  echo "❌ CLAUDE.md does not reference .github/specs"
fi

# Verify Repository Boundaries section exists
if grep -q "Repository Boundaries" CLAUDE.md; then
  echo "✅ CLAUDE.md has Repository Boundaries section"
else
  echo "❌ Repository Boundaries section missing"
fi
```

**Expected Output**:

```
✅ CLAUDE.md references .github/specs
Context:
| Specification files | `.github/specs/` |
✅ CLAUDE.md has Repository Boundaries section
```

**Acceptance Criteria**:

- CLAUDE.md includes `.github/specs` in Repository Boundaries
- Section clearly documents specs location
- Documentation is accurate and current

---

### Scenario 5: Integration Verification

**Objective**: Verify speckit commands work with new location

**Prerequisites**: All previous scenarios passed

**Setup Commands**:

```bash
cd /home/user/.github
```

**Test Commands**:

```bash
# Verify setup-plan.sh can find existing spec
export SPECIFY_FEATURE="007-specs-directory-fix"
export SPECIFY_FEATURE_DIRECTORY=".github/specs/007-specs-directory-fix"
echo "Testing plan setup with existing spec: $SPECIFY_FEATURE..."

if [ -f "$SPECIFY_FEATURE_DIRECTORY/spec.md" ]; then
  echo "✅ Spec file found at configured location"
else
  echo "❌ Spec file not found"
  exit 1
fi

# Verify plan.md exists
if [ -f "$SPECIFY_FEATURE_DIRECTORY/plan.md" ]; then
  echo "✅ Plan file exists at configured location"
else
  echo "⚠️  Plan file not created yet"
fi

# Verify research.md exists
if [ -f "$SPECIFY_FEATURE_DIRECTORY/research.md" ]; then
  echo "✅ Research file exists"
else
  echo "⚠️  Research file not created yet"
fi
```

**Expected Output**:

```
Testing plan setup with existing spec: 007-specs-directory-fix...
✅ Spec file found at configured location
✅ Plan file exists at configured location
✅ Research file exists
```

**Acceptance Criteria**:

- Spec file resolvable from configured location
- Downstream speckit commands (plan, tasks) can find specs
- Feature context properly preserved

---

## Full Validation Test

Run all scenarios in sequence:

```bash
#!/bin/bash
set -e

echo "=== SPECS DIRECTORY CONFIGURATION VALIDATION ==="
echo ""

# Scenario 1
echo "Test 1: Configuration Validation"
# [Insert Scenario 1 test commands]

# Scenario 2
echo ""
echo "Test 2: Directory Structure"
# [Insert Scenario 2 test commands]

# Scenario 3
echo ""
echo "Test 3: New Spec Creation"
# [Insert Scenario 3 test commands]

# Scenario 4
echo ""
echo "Test 4: Documentation Verification"
# [Insert Scenario 4 test commands]

# Scenario 5
echo ""
echo "Test 5: Integration Verification"
# [Insert Scenario 5 test commands]

echo ""
echo "=== ALL VALIDATION TESTS PASSED ✅ ==="
```

## Troubleshooting

### Problem: jq not found

**Solution**:

```bash
# Install jq
brew install jq          # macOS
sudo apt-get install jq  # Linux
```

### Problem: Config file not found

**Solution**:

```bash
# Verify you're in repository root
pwd  # should be /home/user/.github

# Check .specify directory
ls -la .specify/
```

### Problem: Specs still in old location

**Solution**:

```bash
# Verify migration completed
ls -la .github/specs/
ls -la specs/  # should be empty or not exist

# If specs remain, run migration manually
if ! mkdir -p .github/specs; then
  echo "Migration failed: could not create .github/specs" >&2
  exit 1
fi

# Refuse to overwrite any existing destination entry; resolve conflicts first.
while IFS= read -r -d '' source_entry; do
  relative_entry="${source_entry#specs/}"
  if [[ -e ".github/specs/$relative_entry" || -L ".github/specs/$relative_entry" ]]; then
    echo "Migration failed: resolve conflicting entry .github/specs/$relative_entry" >&2
    exit 1
  fi
done < <(find specs -mindepth 1 -maxdepth 1 -print0)

# specs/. includes hidden entries; archive mode preserves the complete tree.
if ! cp -a specs/. .github/specs/; then
  echo "Migration failed: could not copy specs/ to .github/specs/" >&2
  exit 1
fi

# Verify every copied entry recursively before removing the source tree.
while IFS= read -r -d '' source_entry; do
  relative_entry="${source_entry#specs/}"
  if ! diff -qr "$source_entry" ".github/specs/$relative_entry"; then
    echo "Migration failed: copied content differs for $relative_entry" >&2
    exit 1
  fi
done < <(find specs -mindepth 1 -maxdepth 1 -print0)

if ! rm -rf specs/; then
  echo "Migration failed: verified copy retained, but specs/ could not be removed" >&2
  exit 1
fi
```

## Rollback Behaviour (FR-009)

`.specify/scripts/bash/migrate-specs.sh` backs up both trees to `.github/tmp/migration-backup-<epoch>/` before changing anything. Any failed `cp`, `mv` or `mkdir` triggers a rollback, and the script exits non-zero. Use `--dry-run` to see what would be migrated without changing anything.

What you see depends on where the failure happens:

| When it fails | Message on stderr | State afterwards |
|---|---|---|
| Pre-flight checks (config, symlinked roots, target not a directory) | `ERROR: <reason>. No changes were made.` | Both trees untouched; no backup is created |
| Creating a backup | `ERROR: Migration failed: <reason>` followed by `ERROR: Migration stopped before source or target contents were changed.` | Both trees untouched |
| During migration, rollback succeeded | `ERROR: Migration failed and rollback restored the original source and target state: <reason>` and `ERROR: Backup preserved at: <dir>` | Both trees restored from the backup |
| During migration, rollback also failed | `ERROR: Rollback failed after migration error: <reason>`, the backup path, and manual recovery steps | Restore by hand from `<dir>/source` and `<dir>/target` as printed |

To confirm the original state was preserved after a rollback, compare each tree with its backup:

```bash
diff -r .github/tmp/migration-backup-<epoch>/source specs
diff -r .github/tmp/migration-backup-<epoch>/target .github/specs
```

No output means the trees match. The failure paths are tested in `tests/bash/specs-directory.bats`: "target backup failure stops before migration and preserves both trees" and "migration failure restores both trees and exits nonzero".

## Success Criteria Summary

All validation scenarios must pass:

- ✅ Configuration file valid and `specs_directory` set to `.github/specs`
- ✅ Directory structure correct with all specs under `.github/specs/`
- ✅ New specs created via speckit tools land in `.github/specs/`
- ✅ CLAUDE.md documents specs location in Repository Boundaries
- ✅ All speckit commands work with new location
- ✅ No data loss during migration
- ✅ Legacy `specs/` location empty or removed

**Status**: Ready for implementation phase
