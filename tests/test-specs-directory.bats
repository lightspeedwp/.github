#!/usr/bin/env bats

setup() {
  PROJECT_ROOT="$(CDPATH="" cd "$BATS_TEST_DIRNAME/.." && pwd)"
  COMMON_SH="$PROJECT_ROOT/.specify/scripts/bash/common.sh"
  CREATE_FEATURE_SH="$PROJECT_ROOT/.specify/scripts/bash/create-new-feature.sh"
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
