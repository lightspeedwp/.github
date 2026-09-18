#!/usr/bin/env bats

setup() {
  PROJECT_ROOT="$(CDPATH="" cd "$BATS_TEST_DIRNAME/.." && pwd)"
  COMMON_SH="$PROJECT_ROOT/.specify/scripts/bash/common.sh"
  CREATE_FEATURE_SH="$PROJECT_ROOT/.specify/scripts/bash/create-new-feature.sh"
  MIGRATE_SPECS_SH="$PROJECT_ROOT/.specify/scripts/bash/migrate-specs.sh"
  TEST_ROOT="$(mktemp -d)"
  TEST_REPO="$TEST_ROOT/project"
  mkdir -p "$TEST_REPO/.specify"
}

teardown() {
  rm -rf -- "$TEST_ROOT"
}

write_config() {
  printf '%s\n' "$1" > "$TEST_REPO/.specify/init-options.json"
}

read_specs_directory() {
  run bash -c 'source "$1"; read_specs_directory "$2"' _ "$COMMON_SH" "$TEST_REPO"
}

json_field() {
  local json="$1"
  local field="$2"
  printf '%s' "$json" | jq -er --arg field "$field" '.[$field]'
}

@test "repository init-options.json declares the canonical specs directory" {
  run jq -er '.specs_directory' "$PROJECT_ROOT/.specify/init-options.json"

  [ "$status" -eq 0 ]
  [ "$output" = ".github/specs" ]
}

@test "read_specs_directory returns the default when init-options.json is missing" {
  read_specs_directory

  [ "$status" -eq 0 ]
  [ "$output" = ".github/specs" ]
}

@test "read_specs_directory returns the default when the optional field is absent" {
  write_config '{"speckit_version":"1.0.7.dev0"}'

  read_specs_directory

  [ "$status" -eq 0 ]
  [ "$output" = ".github/specs" ]
}

@test "read_specs_directory accepts supported repository-relative paths" {
  for configured_path in \
    ".github/specs" \
    "specs" \
    "docs/specifications" \
    ".config/specs_2-feature"; do
    write_config "{\"specs_directory\":\"$configured_path\"}"

    read_specs_directory

    [ "$status" -eq 0 ]
    [ "$output" = "$configured_path" ]
  done
}

@test "read_specs_directory validates configuration through the Python fallback" {
  write_config '{"specs_directory":"docs/specifications"}'
  mkdir -p "$TEST_ROOT/python-bin"
  ln -s "$(command -v python3)" "$TEST_ROOT/python-bin/python3"

  run env PATH="$TEST_ROOT/python-bin" /bin/bash -c \
    'source "$1"; read_specs_directory "$2"' _ "$COMMON_SH" "$TEST_REPO"

  [ "$status" -eq 0 ]
  [ "$output" = "docs/specifications" ]
}

@test "read_specs_directory rejects malformed JSON instead of hiding configuration errors" {
  write_config '{"specs_directory":"docs/specs"'

  read_specs_directory

  [ "$status" -ne 0 ]
}

@test "read_specs_directory rejects a non-string specs_directory" {
  for invalid_value in 'null' 'true' '42' '["docs/specs"]' '{"path":"docs/specs"}'; do
    write_config "{\"specs_directory\":$invalid_value}"

    read_specs_directory

    if [ "$status" -eq 0 ]; then
      echo "Accepted non-string specs_directory: $invalid_value" >&2
      return 1
    fi
  done
}

@test "read_specs_directory rejects an explicitly empty path" {
  write_config '{"specs_directory":""}'

  read_specs_directory

  [ "$status" -ne 0 ]
}

@test "read_specs_directory rejects paths that can escape or ambiguously resolve" {
  for invalid_path in \
    "/absolute/specs" \
    "../specs" \
    "specs/../other" \
    "specs/./other" \
    "specs//other" \
    "specs/" \
    "specs with spaces" \
    "specs?draft"; do
    write_config "{\"specs_directory\":\"$invalid_path\"}"

    read_specs_directory

    if [ "$status" -eq 0 ]; then
      echo "Accepted invalid specs_directory: $invalid_path" >&2
      return 1
    fi
  done
}

@test "create-new-feature dry-run uses the configured directory and its numbering sequence" {
  write_config '{"specs_directory":"docs/specifications"}'
  mkdir -p \
    "$TEST_REPO/docs/specifications/002-existing" \
    "$TEST_REPO/specs/999-legacy"

  run env SPECIFY_INIT_DIR="$TEST_REPO" \
    bash "$CREATE_FEATURE_SH" --dry-run --json --short-name "new-feature" \
    "Create a new feature"

  [ "$status" -eq 0 ]
  [ "$(json_field "$output" 'BRANCH_NAME')" = "003-new-feature" ]
  [ "$(json_field "$output" 'SPEC_FILE')" = \
    "$TEST_REPO/docs/specifications/003-new-feature/spec.md" ]
  [ "$(json_field "$output" 'FEATURE_NUM')" = "003" ]
  [ "$(json_field "$output" 'DRY_RUN')" = "true" ]
  [ ! -e "$TEST_REPO/docs/specifications/003-new-feature" ]
  [ ! -e "$TEST_REPO/.specify/feature.json" ]
}

@test "create-new-feature dry-run defaults to .github/specs and does not mutate the repository" {
  write_config '{"speckit_version":"1.0.7.dev0"}'
  mkdir -p "$TEST_REPO/.github/specs/007-existing"

  run env SPECIFY_INIT_DIR="$TEST_REPO" \
    bash "$CREATE_FEATURE_SH" --dry-run --json --short-name "boundary-case" \
    "Exercise the default path"

  [ "$status" -eq 0 ]
  [ "$(json_field "$output" 'BRANCH_NAME')" = "008-boundary-case" ]
  [ "$(json_field "$output" 'SPEC_FILE')" = \
    "$TEST_REPO/.github/specs/008-boundary-case/spec.md" ]
  [ "$(json_field "$output" 'FEATURE_NUM')" = "008" ]
  [ "$(json_field "$output" 'DRY_RUN')" = "true" ]
  [ ! -e "$TEST_REPO/.github/specs/008-boundary-case" ]
  [ ! -e "$TEST_REPO/.specify/feature.json" ]
}

@test "create-new-feature creates the spec and persists context under the configured directory" {
  write_config '{"specs_directory":"docs/specifications"}'

  run env SPECIFY_INIT_DIR="$TEST_REPO" \
    bash "$CREATE_FEATURE_SH" --json --number 12 --short-name "created-feature" \
    "Create a configured feature"

  [ "$status" -eq 0 ]
  [ -f "$TEST_REPO/docs/specifications/012-created-feature/spec.md" ]
  [ ! -e "$TEST_REPO/specs/012-created-feature" ]

  run jq -er '.feature_directory' "$TEST_REPO/.specify/feature.json"

  [ "$status" -eq 0 ]
  [ "$output" = "docs/specifications/012-created-feature" ]
}

@test "create-new-feature stops before resolving a feature path from invalid configuration" {
  write_config '{"specs_directory":"../outside-project"}'

  run env SPECIFY_INIT_DIR="$TEST_REPO" \
    bash "$CREATE_FEATURE_SH" --dry-run --json --short-name "unsafe-path" \
    "Reject an unsafe path"

  [ "$status" -ne 0 ]
  [ ! -e "$TEST_ROOT/outside-project" ]
}

@test "migration rejects a custom configured specs directory without changing either tree" {
  write_config '{"specs_directory":"docs/specs"}'
  mkdir -p "$TEST_REPO/specs" "$TEST_REPO/.github/specs"
  printf '%s\n' 'source' > "$TEST_REPO/specs/source.txt"
  printf '%s\n' 'target' > "$TEST_REPO/.github/specs/target.txt"

  run env SPECIFY_INIT_DIR="$TEST_REPO" bash "$MIGRATE_SPECS_SH"

  [ "$status" -ne 0 ]
  [[ "$output" == *"requires specs_directory to be '.github/specs'"* ]]
  [ "$(< "$TEST_REPO/specs/source.txt")" = "source" ]
  [ "$(< "$TEST_REPO/.github/specs/target.txt")" = "target" ]
  [ ! -e "$TEST_REPO/.github/tmp" ]
}

@test "migration preserves files empty directories symlinks and existing target entries" {
  write_config '{"specs_directory":".github/specs"}'
  mkdir -p \
    "$TEST_REPO/specs/nested/empty directory" \
    "$TEST_REPO/.github/specs"
  printf '%s\n' 'source content' > "$TEST_REPO/specs/nested/file with spaces.txt"
  ln -s "nested/file with spaces.txt" "$TEST_REPO/specs/source-link"
  printf '%s\n' 'existing target' > "$TEST_REPO/.github/specs/existing.txt"

  run env SPECIFY_INIT_DIR="$TEST_REPO" bash "$MIGRATE_SPECS_SH"

  [ "$status" -eq 0 ]
  [ ! -e "$TEST_REPO/specs" ]
  [ -d "$TEST_REPO/.github/specs/nested/empty directory" ]
  [ "$(< "$TEST_REPO/.github/specs/nested/file with spaces.txt")" = "source content" ]
  [ -L "$TEST_REPO/.github/specs/source-link" ]
  [ "$(readlink "$TEST_REPO/.github/specs/source-link")" = "nested/file with spaces.txt" ]
  [ "$(< "$TEST_REPO/.github/specs/existing.txt")" = "existing target" ]
}

@test "target backup failure stops before migration and preserves both trees" {
  write_config '{"specs_directory":".github/specs"}'
  mkdir -p \
    "$TEST_REPO/specs" \
    "$TEST_REPO/.github/specs" \
    "$TEST_ROOT/bin"
  printf '%s\n' 'source content' > "$TEST_REPO/specs/source.txt"
  printf '%s\n' 'target content' > "$TEST_REPO/.github/specs/target.txt"

  local real_cp
  real_cp="$(command -v cp)"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'for argument in "$@"; do' \
    '  if [[ "$argument" == "$MIGRATION_TARGET" ]]; then' \
    '    exit 1' \
    '  fi' \
    'done' \
    'exec "$REAL_CP" "$@"' > "$TEST_ROOT/bin/cp"
  chmod +x "$TEST_ROOT/bin/cp"

  run env \
    PATH="$TEST_ROOT/bin:$PATH" \
    REAL_CP="$real_cp" \
    MIGRATION_TARGET="$TEST_REPO/.github/specs" \
    SPECIFY_INIT_DIR="$TEST_REPO" \
    bash "$MIGRATE_SPECS_SH"

  [ "$status" -ne 0 ]
  [[ "$output" == *"Migration failed: Failed to create target backup"* ]]
  [[ "$output" == *"stopped before source or target contents were changed"* ]]
  [ "$(< "$TEST_REPO/specs/source.txt")" = "source content" ]
  [ "$(< "$TEST_REPO/.github/specs/target.txt")" = "target content" ]
  [ -d "$TEST_REPO/.github/tmp" ]
}

@test "migration failure restores both trees and exits nonzero" {
  write_config '{"specs_directory":".github/specs"}'
  mkdir -p \
    "$TEST_REPO/specs/empty" \
    "$TEST_REPO/.github/specs" \
    "$TEST_ROOT/bin"
  printf '%s\n' 'source content' > "$TEST_REPO/specs/fail-copy.txt"
  printf '%s\n' 'target content' > "$TEST_REPO/.github/specs/target.txt"

  local real_cp
  real_cp="$(command -v cp)"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'last_argument="${!#}"' \
    'for argument in "$@"; do' \
    '  if [[ "$argument" == "$MIGRATION_SOURCE/"* && "$last_argument" == "$MIGRATION_TARGET/" ]]; then' \
    '    exit 1' \
    '  fi' \
    'done' \
    'exec "$REAL_CP" "$@"' > "$TEST_ROOT/bin/cp"
  chmod +x "$TEST_ROOT/bin/cp"

  run env \
    PATH="$TEST_ROOT/bin:$PATH" \
    REAL_CP="$real_cp" \
    MIGRATION_SOURCE="$TEST_REPO/specs" \
    MIGRATION_TARGET="$TEST_REPO/.github/specs" \
    SPECIFY_INIT_DIR="$TEST_REPO" \
    bash "$MIGRATE_SPECS_SH"

  [ "$status" -ne 0 ]
  [[ "$output" == *"Migration failed and rollback restored the original source and target state"* ]]
  [ "$(< "$TEST_REPO/specs/fail-copy.txt")" = "source content" ]
  [ -d "$TEST_REPO/specs/empty" ]
  [ "$(< "$TEST_REPO/.github/specs/target.txt")" = "target content" ]
  [ ! -e "$TEST_REPO/.github/specs/fail-copy.txt" ]
  [ -d "$TEST_REPO/.github/tmp" ]
}
