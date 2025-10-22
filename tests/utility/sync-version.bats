#!/usr/bin/env bats
# Test: sync-version.bats
# Description: Bats tests for sync-version.js utility script

setup() {
    echo "[DEBUG] BATS_TEST_FILENAME: $BATS_TEST_FILENAME" >&2
    echo "[DEBUG] SCRIPT: $SCRIPT" >&2
  load '../test-helper.bash'
  load '../includes/enhanced-test-helpers.bash'
  setup_test_environment
  export SCRIPT="../../scripts/utility/sync-version.js"
  export TEST_PKG="test-package.json"
  PKG_SRC="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)/package.json"
  echo "[DEBUG] BATS_TEST_FILENAME: $BATS_TEST_FILENAME" >&2
  echo "[DEBUG] SCRIPT: $SCRIPT" >&2
  echo "[DEBUG] PKG_SRC: $PKG_SRC" >&2
    # Dynamically resolve script and version file paths relative to this test file
    SCRIPT_SRC="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../scripts/utility" && pwd)/sync-version.js"
    VERSION_SRC="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)/VERSION"
    if [ ! -f "$VERSION_SRC" ]; then
      echo "1.2.3" > "$VERSION_SRC"
    fi
    export TEST_TMPDIR="$(mktemp -d)"
    export SCRIPT="$TEST_TMPDIR/sync-version.js"
    export TEST_PKG="$TEST_TMPDIR/package.json"
    export VERSION_FILE="$TEST_TMPDIR/VERSION"
    cp "$SCRIPT_SRC" "$SCRIPT"
    cp "$VERSION_SRC" "$VERSION_FILE"
    echo '{"version":"0.0.1"}' > "$TEST_PKG"
    cd "$TEST_TMPDIR" || exit 1
}

teardown() {
  cleanup_test_environment
    rm -rf "$TEST_TMPDIR"
}

@test "updates package.json version if different" {
  cd "$(dirname "$BATS_TEST_FILENAME")"
    echo '{"version":"0.0.1"}' > "$TEST_PKG"
    echo "1.2.3" > "$VERSION_FILE"
    run node "$SCRIPT"
    run node -e 'console.log(require("./package.json").version)'
  [ "$output" = "1.2.3" ]
}

@test "does nothing if version matches" {
  cd "$(dirname "$BATS_TEST_FILENAME")"
    echo '{"version":"1.2.3"}' > "$TEST_PKG"
    echo "1.2.3" > "$VERSION_FILE"
    run node "$SCRIPT"
  echo "$output"
  [ "$status" -eq 0 ]
  [[ "$output" == *"already matches"* ]]
}

@test "errors if VERSION file missing" {
  cd "$(dirname "$BATS_TEST_FILENAME")"
    rm -f "$VERSION_FILE"
  run node $SCRIPT
  [ "$status" -ne 0 ]
  [[ "$output" == *"VERSION file not found"* ]]
}
