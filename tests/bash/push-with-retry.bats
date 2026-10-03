#!/usr/bin/env bats
# Tests for scripts/workflows/push-with-retry.sh using local remotes.
# Each test builds an isolated bare remote plus a work clone.

SCRIPT="${BATS_TEST_DIRNAME}/../../scripts/workflows/push-with-retry.sh"

setup() {
  REMOTE_DIR=$(mktemp -d)
  WORK_DIR=$(mktemp -d)
  git init -q -b develop "$WORK_DIR"
  git -C "$WORK_DIR" config user.email "test@example.com"
  git -C "$WORK_DIR" config user.name "Test"
  # Disable background maintenance: on loaded CI runners a forked gc can
  # still hold pack files when teardown runs, failing the rm -rf.
  git -C "$WORK_DIR" config gc.auto 0
  git -C "$WORK_DIR" config maintenance.auto false
  git -C "$WORK_DIR" commit -q --allow-empty -m base
  git init -q --bare "$REMOTE_DIR/remote.git"
  git -C "$WORK_DIR" remote add origin "$REMOTE_DIR/remote.git"
  git -C "$WORK_DIR" push -q origin develop
}

teardown() {
  # Retry once: a slow background git process may briefly hold files.
  rm -rf "$REMOTE_DIR" "$WORK_DIR" || (sleep 5; rm -rf "$REMOTE_DIR" "$WORK_DIR")
}

# Simulate an external writer landing on the remote behind our back.
external_commit() {
  local file="$1"
  local content="$2"
  local clone
  clone=$(mktemp -d)
  git clone -q -b develop "$REMOTE_DIR/remote.git" "$clone"
  git -C "$clone" config user.email "bot@example.com"
  git -C "$clone" config user.name "Bot"
  git -C "$clone" config gc.auto 0
  git -C "$clone" config maintenance.auto false
  echo "$content" > "$clone/$file"
  git -C "$clone" add "$file"
  git -C "$clone" commit -qm "external: $file"
  git -C "$clone" push -q origin develop
  rm -rf "$clone"
}

@test "clean push succeeds on first attempt" {
  echo "local" > "$WORK_DIR/data.txt"
  git -C "$WORK_DIR" add data.txt
  git -C "$WORK_DIR" commit -qm local
  cd "$WORK_DIR"
  run bash "$SCRIPT" --branch develop --base-delay 0
  [ "$status" -eq 0 ]
  [[ "$output" == *"pushed to develop"* ]]
}

@test "push rejected by external commit rebases and succeeds" {
  echo "local" > "$WORK_DIR/feature.txt"
  git -C "$WORK_DIR" add feature.txt
  git -C "$WORK_DIR" commit -qm local
  external_commit "other.txt" "external"
  cd "$WORK_DIR"
  run bash "$SCRIPT" --branch develop --base-delay 0
  [ "$status" -eq 0 ]
  [[ "$output" == *"rebasing and retrying"* ]]
  [ "$(git -C "$WORK_DIR" show origin/develop:other.txt 2>/dev/null || echo MISSING)" != "MISSING" ]
}

@test "snapshot conflict resolves to this run's version" {
  echo '{"v":1}' > "$WORK_DIR/snapshot.json"
  git -C "$WORK_DIR" add snapshot.json
  git -C "$WORK_DIR" commit -qm base-snapshot
  git -C "$WORK_DIR" push -q origin develop
  echo '{"v":3}' > "$WORK_DIR/snapshot.json"
  git -C "$WORK_DIR" commit -qam local-snapshot
  external_commit "snapshot.json" '{"v":2}'
  cd "$WORK_DIR"
  run bash "$SCRIPT" --branch develop --snapshot snapshot.json --base-delay 0
  [ "$status" -eq 0 ]
  [ "$(cat "$WORK_DIR/snapshot.json")" = '{"v":3}' ]
}

@test "non-snapshot conflict aborts with failure" {
  echo "base" > "$WORK_DIR/code.txt"
  git -C "$WORK_DIR" add code.txt
  git -C "$WORK_DIR" commit -qm base-code
  git -C "$WORK_DIR" push -q origin develop
  echo "local" > "$WORK_DIR/code.txt"
  git -C "$WORK_DIR" commit -qam local-code
  external_commit "code.txt" "external"
  cd "$WORK_DIR"
  run bash "$SCRIPT" --branch develop --snapshot snapshot.json --base-delay 0
  [ "$status" -ne 0 ]
}

@test "--branch is required" {
  run bash "$SCRIPT" --base-delay 0
  [ "$status" -eq 2 ]
  [[ "$output" == *"--branch is required"* ]]
}
