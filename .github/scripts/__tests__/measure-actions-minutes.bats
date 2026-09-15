#!/usr/bin/env bats

setup() {
  REPO_ROOT="$(cd "$BATS_TEST_DIRNAME/../../.." && pwd)"
  SCRIPT="$REPO_ROOT/.github/scripts/measure-actions-minutes.sh"
  MOCK_BIN="$BATS_TEST_TMPDIR/bin"
  WORKFLOW_ROOT="$BATS_TEST_TMPDIR/repository"
  GH_CALL_LOG="$BATS_TEST_TMPDIR/gh-calls.log"
  MOCK_ENV="$BATS_TEST_TMPDIR/mock-env.bash"

  mkdir -p "$MOCK_BIN" "$WORKFLOW_ROOT/.github/workflows/archived"
  : > "$GH_CALL_LOG"

  touch \
    "$WORKFLOW_ROOT/.github/workflows/labeling.yml" \
    "$WORKFLOW_ROOT/.github/workflows/testing.yaml" \
    "$WORKFLOW_ROOT/.github/workflows/archived/legacy.yml"

  cat > "$MOCK_ENV" <<'EOF_MOCKS'
gh() {
  printf '%s\n' "$*" >> "$GH_CALL_LOG"
}

git() {
case "$*" in
  "rev-parse --show-toplevel")
    printf '%s\n' "$WORKFLOW_ROOT"
    ;;
  "remote get-url origin")
    printf '%s\n' 'git@github.com:lightspeedwp/.github.git'
    ;;
  *)
    exit 1
    ;;
esac
}

date() {
  printf '%s\n' '2026-09-15T12:00:00Z'
}
EOF_MOCKS
}

run_measurement() {
  run env \
    PATH="$MOCK_BIN:$PATH" \
    BASH_ENV="$MOCK_ENV" \
    GH_CALL_LOG="$GH_CALL_LOG" \
    WORKFLOW_ROOT="$WORKFLOW_ROOT" \
    bash -c 'cd "$1" && exec bash "$2" "${@:3}"' _ \
    "$WORKFLOW_ROOT" "$SCRIPT" "$@"
}

@test "unknown options fail before inspecting the repository" {
  run_measurement --unsupported

  [ "$status" -eq 1 ]
  [[ "$output" == *"Unknown option: --unsupported"* ]]
  [ ! -s "$GH_CALL_LOG" ]
}

@test "a workflow filter limits measurement to matching workflow files" {
  run_measurement --workflow labeling

  [ "$status" -ne 0 ]
  [[ "$output" == *"division by 0"* ]]
  [[ "$output" == *"labeling.yml: (measurement pending API integration)"* ]]
  [[ "$output" != *"testing.yaml: (measurement pending API integration)"* ]]
  [[ "$output" != *"legacy.yml: (measurement pending API integration)"* ]]
}

@test "the default scan includes active yml and yaml workflows but excludes archives" {
  run_measurement

  [ "$status" -ne 0 ]
  [[ "$output" == *"division by 0"* ]]
  [[ "$output" == *"labeling.yml: (measurement pending API integration)"* ]]
  [[ "$output" == *"testing.yaml: (measurement pending API integration)"* ]]
  [[ "$output" != *"legacy.yml: (measurement pending API integration)"* ]]
}

@test "zero measured runs fail without writing a misleading report" {
  output_file="$BATS_TEST_TMPDIR/report.txt"

  run_measurement --days 7 --output "$output_file"

  [ "$status" -ne 0 ]
  [[ "$output" == *"division by 0"* ]]
  [ ! -e "$output_file" ]
}
