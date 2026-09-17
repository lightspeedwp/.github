#!/usr/bin/env bats

setup() {
  REPO_ROOT="$(CDPATH="" cd "$BATS_TEST_DIRNAME/../.." && pwd)"
  AUDIT_SCRIPT="$REPO_ROOT/.specify/scripts/bash/audit-specs.sh"
  TEST_REPO="$BATS_TEST_TMPDIR/repository"

  mkdir -p "$TEST_REPO/.specify" "$TEST_REPO/.github/specs"
}

create_spec() {
  local directory="$1"

  mkdir -p "$TEST_REPO/.github/specs/$directory"
  printf '# Test specification\n' > "$TEST_REPO/.github/specs/$directory/spec.md"
}

run_audit() {
  run bash -c 'cd "$1" && bash "$2"' _ "$TEST_REPO" "$AUDIT_SCRIPT"
}

@test "a valid repository reports its complete sequential inventory" {
  create_spec "001-first-spec"
  create_spec "002-second-spec"
  create_spec "003-third-spec"

  run_audit

  [ "$status" -eq 0 ]
  [[ "$output" == *"Found 3 specification directories"* ]]
  [[ "$output" == *"Sequential numbering verified: 001 to 003 with no gaps"* ]]
  [[ "$output" == *"Total directories: 3"* ]]
  [[ "$output" == *"Naming compliance: 3/3"* ]]
  [[ "$output" == *"spec.md present: 3/3"* ]]
}

@test "numbering remains numeric across the 009 to 010 boundary" {
  for number in {1..10}; do
    printf -v prefix '%03d' "$number"
    create_spec "$prefix-test-spec"
  done

  run_audit

  [ "$status" -eq 0 ]
  [[ "$output" == *"Sequential numbering verified: 001 to 010 with no gaps"* ]]
  [[ "$output" == *"Total directories: 10"* ]]
}

@test "a numbering gap fails with the expected and actual numbers" {
  create_spec "001-first-spec"
  create_spec "003-third-spec"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"Gap detected: expected 2 but found 3"* ]]
  [[ "$output" == *"Complete Inventory Report"* ]]
  [[ "$output" == *"Total directories: 2"* ]]
}

@test "a reused numeric prefix is rejected as a duplicate" {
  create_spec "001-first-spec"
  create_spec "001-duplicate-spec"
  create_spec "002-second-spec"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"❌ Duplicate number: 1"* ]]
}

@test "invalid slugs are included in the inventory but fail naming compliance" {
  create_spec "001-valid-slug"
  create_spec "002-Uppercase-slug"
  create_spec "003-trailing-"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"002-Uppercase-slug (invalid format)"* ]]
  [[ "$output" == *"003-trailing- (invalid format)"* ]]
  [[ "$output" == *"Naming compliance: 1/3"* ]]
}

@test "a missing spec.md is reported and excluded from the presence count" {
  create_spec "001-complete-spec"
  mkdir -p "$TEST_REPO/.github/specs/002-missing-file"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"Directory: 002-missing-file"* ]]
  [[ "$output" == *"spec.md MISSING"* ]]
  [[ "$output" == *"spec.md present: 1/2"* ]]
}

@test "a directory named spec.md is not accepted as a specification file" {
  create_spec "001-complete-spec"
  mkdir -p "$TEST_REPO/.github/specs/002-directory-placeholder/spec.md"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"spec.md MISSING"* ]]
  [[ "$output" == *"spec.md present: 1/2"* ]]
}

@test "unrelated and malformed directories are scanned but fail naming validation" {
  create_spec "001-first-spec"
  create_spec "002-second-spec"
  mkdir -p \
    "$TEST_REPO/.github/specs/01-short-prefix" \
    "$TEST_REPO/.github/specs/1000-long-prefix" \
    "$TEST_REPO/.github/specs/notes"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"Found 5 specification directories"* ]]
  [[ "$output" == *"Total directories: 5"* ]]
  [[ "$output" == *"01-short-prefix"* ]]
  [[ "$output" == *"1000-long-prefix"* ]]
  [[ "$output" == *"notes"* ]]
  [[ "$output" == *"✗ 01-short-prefix (invalid format)"* ]]
  [[ "$output" == *"✗ 1000-long-prefix (invalid format)"* ]]
  [[ "$output" == *"✗ notes (invalid format)"* ]]
}

@test "single-component, numeric, and hyphenated lowercase slugs are valid" {
  create_spec "001-a"
  create_spec "002-version-2"
  create_spec "003-123"

  run_audit

  [ "$status" -eq 0 ]
  [[ "$output" == *"✓ 001-a"* ]]
  [[ "$output" == *"✓ 002-version-2"* ]]
  [[ "$output" == *"✓ 003-123"* ]]
  [[ "$output" == *"Naming compliance: 3/3"* ]]
}

@test "empty, repeated, spaced, and underscored slug segments are invalid" {
  create_spec "001-valid-slug"
  create_spec "002--leading-separator"
  create_spec "003-double--separator"
  create_spec "004-has_underscore"
  create_spec "005-has space"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"✗ 002--leading-separator (invalid format)"* ]]
  [[ "$output" == *"✗ 003-double--separator (invalid format)"* ]]
  [[ "$output" == *"✗ 004-has_underscore (invalid format)"* ]]
  [[ "$output" == *"✗ 005-has space (invalid format)"* ]]
  [[ "$output" == *"Naming compliance: 1/5"* ]]
}

@test "an empty specification inventory is rejected" {
  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"❌ No specification directories found"* ]]
  [[ "$output" == *"Total directories: 0"* ]]
}

@test "numbering must begin at 001" {
  create_spec "002-second-spec"
  create_spec "003-third-spec"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"Gap detected: expected 1 but found 2"* ]]
}

@test "zero is rejected as a specification number" {
  create_spec "000-zero-spec"
  create_spec "001-first-spec"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"❌ Duplicate number: 0"* ]]
}

@test "every numbering gap is reported" {
  create_spec "001-first-spec"
  create_spec "003-third-spec"
  create_spec "005-fifth-spec"

  run_audit

  [ "$status" -ne 0 ]
  [[ "$output" == *"Gap detected: expected 2 but found 3"* ]]
  [[ "$output" == *"Gap detected: expected 4 but found 5"* ]]
}

@test "an empty regular spec.md satisfies the file-presence check" {
  mkdir -p "$TEST_REPO/.github/specs/001-empty-spec"
  : > "$TEST_REPO/.github/specs/001-empty-spec/spec.md"

  run_audit

  [ "$status" -eq 0 ]
  [[ "$output" == *"spec.md present: 1/1"* ]]
}

@test "root files and nested directories are excluded from the inventory" {
  create_spec "001-first-spec"
  mkdir -p "$TEST_REPO/.github/specs/001-first-spec/nested-directory"
  printf '# Not a directory\n' > "$TEST_REPO/.github/specs/002-file-entry"

  run_audit

  [ "$status" -eq 0 ]
  [[ "$output" == *"Found 1 specification directories"* ]]
  [[ "$output" == *"Total directories: 1"* ]]
  [[ "$output" != *"Directory: nested-directory"* ]]
  [[ "$output" != *"Directory: 002-file-entry"* ]]
}

@test "script works when run from a subdirectory" {
  create_spec "001-first-spec"
  create_spec "002-second-spec"
  mkdir -p "$TEST_REPO/.specify"

  # Run from .github subdirectory instead of repo root
  run bash -c 'cd "$1/.github" && bash "$2"' _ "$TEST_REPO" "$AUDIT_SCRIPT"

  [ "$status" -eq 0 ]
  [[ "$output" == *"Found 2 specification directories"* ]]
  [[ "$output" == *"Sequential numbering verified: 001 to 002 with no gaps"* ]]
  [[ "$output" == *"Total directories: 2"* ]]
}
