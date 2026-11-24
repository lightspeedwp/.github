#!/usr/bin/env bats
# Tests for scripts/workflows/ci-scope.sh: when a CI check may skip its work.

setup() {
  REPO_ROOT="$(cd "$BATS_TEST_DIRNAME/../.." && pwd)"
  SCOPE_SH="$REPO_ROOT/scripts/workflows/ci-scope.sh"
  TEST_REPO="$(mktemp -d)"
  STUB_DIR="$(mktemp -d)"
  cd "$TEST_REPO"
  git init -q -b develop
  git config user.email "test@example.com"
  git config user.name "Test"
  mkdir -p docs src .github/workflows .github/specs/001-demo
  printf 'base\n' > README.md
  printf 'const a = 1;\n' > src/a.js
  git add -A
  git commit -q -m "base"
  BASE="$(git rev-parse HEAD)"
  git checkout -q -b feature
  export EVENT_NAME=pull_request EVENT_ACTION=opened BASE_SHA="$BASE"
  export CHECK_NAME="Example" GITHUB_REPOSITORY="example/repo"
  unset GITHUB_OUTPUT BEFORE_SHA HEAD_SHA
}

teardown() {
  rm -rf "$TEST_REPO" "$STUB_DIR"
}

# commit_file - write a file and commit it; prints the new commit.
commit_file() {
  mkdir -p "$(dirname "$1")"
  printf '%s\n' "${2:-change}" >> "$1"
  git add -A
  git commit -q -m "change $1"
  git rev-parse HEAD
}

# stub_gh - put a fake gh on PATH that prints a conclusion, or fails.
stub_gh() {
  if [ "$1" = "error" ]; then
    printf '#!/usr/bin/env bash\nexit 1\n' > "$STUB_DIR/gh"
  else
    printf '#!/usr/bin/env bash\nprintf "%%s\\n" "%s"\n' "$1" > "$STUB_DIR/gh"
  fi
  chmod +x "$STUB_DIR/gh"
  PATH="$STUB_DIR:$PATH"
}

@test "an unknown profile is a usage error" {
  run bash "$SCOPE_SH" nonsense
  [ "$status" -eq 2 ]
}

@test "events other than pull_request always run the check" {
  EVENT_NAME=push run bash "$SCOPE_SH" lint
  [ "$status" -eq 0 ]
  [[ "$output" == *"run=true"* ]]
}

@test "a pull request that changes only a specification task list skips lint, typecheck and actionlint" {
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  for profile in lint typecheck actionlint; do
    run bash "$SCOPE_SH" "$profile"
    [ "$status" -eq 0 ]
    [[ "$output" == *"run=false"* ]]
  done
}

@test "the same pull request still runs Jest, because the suite reads specifications" {
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  run bash "$SCOPE_SH" jest
  [[ "$output" == *"run=true"* ]]
}

@test "a JavaScript change runs lint, typecheck and Jest but not actionlint" {
  commit_file src/a.js > /dev/null
  for profile in lint typecheck jest; do
    run bash "$SCOPE_SH" "$profile"
    [[ "$output" == *"run=true"* ]]
  done
  run bash "$SCOPE_SH" actionlint
  [[ "$output" == *"run=false"* ]]
}

@test "a workflow change runs every check" {
  commit_file .github/workflows/example.yml > /dev/null
  for profile in lint typecheck actionlint jest; do
    run bash "$SCOPE_SH" "$profile"
    [[ "$output" == *"run=true"* ]]
  done
}

@test "a root configuration file runs lint and typecheck" {
  commit_file .eslintrc.cjs > /dev/null
  for profile in lint typecheck; do
    run bash "$SCOPE_SH" "$profile"
    [[ "$output" == *"run=true"* ]]
  done
}

@test "Jest skips plain docs pages but not the label documents or nested docs" {
  commit_file docs/GUIDE.md > /dev/null
  run bash "$SCOPE_SH" jest
  [[ "$output" == *"run=false"* ]]
  commit_file docs/LABELING.md > /dev/null
  run bash "$SCOPE_SH" jest
  [[ "$output" == *"run=true"* ]]
}

@test "nested docs files run Jest" {
  commit_file docs/sub/page.md > /dev/null
  run bash "$SCOPE_SH" jest
  [[ "$output" == *"run=true"* ]]
}

@test "a later push without relevant files skips when the check passed before it" {
  before="$(commit_file src/a.js)"
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  stub_gh success
  EVENT_ACTION=synchronize BEFORE_SHA="$before" run bash "$SCOPE_SH" lint
  [ "$status" -eq 0 ]
  [[ "$output" == *"run=false"* ]]
  [[ "$output" == *"${before:0:10}"* ]]
}

@test "a later push without relevant files still runs when the earlier check failed" {
  before="$(commit_file src/a.js)"
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  stub_gh failure
  EVENT_ACTION=synchronize BEFORE_SHA="$before" run bash "$SCOPE_SH" lint
  [[ "$output" == *"run=true"* ]]
}

@test "a later push runs when the earlier result cannot be read" {
  before="$(commit_file src/a.js)"
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  stub_gh error
  EVENT_ACTION=synchronize BEFORE_SHA="$before" run bash "$SCOPE_SH" lint
  [[ "$output" == *"run=true"* ]]
}

@test "a later push that touches relevant files runs even if the check passed before" {
  before="$(commit_file src/a.js)"
  commit_file src/a.js again > /dev/null
  stub_gh success
  EVENT_ACTION=synchronize BEFORE_SHA="$before" run bash "$SCOPE_SH" lint
  [[ "$output" == *"run=true"* ]]
}

@test "a force push runs the check" {
  before="$(commit_file src/a.js)"
  git reset -q --hard "$BASE"
  commit_file src/a.js rewritten > /dev/null
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  stub_gh success
  EVENT_ACTION=synchronize BEFORE_SHA="$before" run bash "$SCOPE_SH" lint
  [[ "$output" == *"run=true"* ]]
}

@test "a missing or unreadable base fails instead of skipping" {
  commit_file src/a.js > /dev/null
  BASE_SHA="" run bash "$SCOPE_SH" lint
  [ "$status" -eq 1 ]
  BASE_SHA="0000000000000000000000000000000000000001" run bash "$SCOPE_SH" lint
  [ "$status" -eq 1 ]
}

@test "the decision is written to GITHUB_OUTPUT" {
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  GITHUB_OUTPUT="$TEST_REPO/out" run bash "$SCOPE_SH" lint
  [ "$status" -eq 0 ]
  [ "$(awk -F= '$1=="run"{print $2}' "$TEST_REPO/out")" = "false" ]
}
