#!/usr/bin/env bats
# Test: utility-functions.bats
# Description: Bats tests for utility-functions.sh utility script


setup() {
  load '../includes/enhanced-test-helpers.bash'
  SCRIPT="$BATS_TEST_DIRNAME/../../scripts/utility/utility-functions.sh"
  echo "[DEBUG] BATS_TEST_FILENAME: $BATS_TEST_FILENAME"
  echo "[DEBUG] BATS_TEST_DIRNAME: $BATS_TEST_DIRNAME"
  echo "[DEBUG] SCRIPT: $SCRIPT"
  ls -l "$SCRIPT"
  ls -l "$(dirname "$SCRIPT")"
  [ -f "$SCRIPT" ]
  [ -x "$SCRIPT" ]
  export SCRIPT
}

teardown() {
  cleanup_test_environment
}

@test "script exists and is executable" {
  run bash "$SCRIPT" --help
  [ "$status" -eq 0 ]
}
