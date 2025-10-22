#!/usr/bin/env bats
# Test: fetch-canonical-labels.bats
# Description: Bats tests for fetch-canonical-labels.js utility script

setup() {
    echo "[DEBUG] BATS_TEST_FILENAME: $BATS_TEST_FILENAME" >&2
    echo "[DEBUG] SCRIPT: $SCRIPT" >&2
  load '../test-helper.bash'
  load '../includes/enhanced-test-helpers.bash'
  setup_test_environment
  SCRIPT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../scripts/utility" && pwd)/fetch-canonical-labels.js"
  chmod +x "$SCRIPT"
}

teardown() {
  cleanup_test_environment
}

@test "script exists and is executable with node" {
  run node "$SCRIPT" --help
  [ "$status" -eq 0 ]
}
