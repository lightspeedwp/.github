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
  # Keep the test doubles first on PATH in child shells.
  unset BASH_ENV GITHUB_ACTIONS GITHUB_OUTPUT BEFORE_SHA HEAD_SHA
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

# stub_gh - serve check and annotation fixtures through the script's jq filters.
stub_gh() {
  export STUB_CONCLUSION="$1" STUB_TESTED_BASE="${2-$BASE}" STUB_CHECK_COMMIT="$before"
  cat > "$STUB_DIR/gh" <<'SH'
#!/usr/bin/env bash
[ "$STUB_CONCLUSION" != error ] || exit 1
case " $* " in
  *" repos/example/repo/commits/$STUB_CHECK_COMMIT/check-runs "*)
    jq -n --arg conclusion "$STUB_CONCLUSION" '{
      check_runs: [{id: 123, conclusion: $conclusion, app: {slug: "github-actions"}}]
    }' | jq -r "${@: -1}"
    ;;
  *" repos/example/repo/check-runs/123/annotations "*)
    jq -n --arg base "$STUB_TESTED_BASE" '
      if $base == "" then [] else
        [{title: "CI scope base", path: "scripts/workflows/ci-scope.sh", message: $base}]
      end' | jq -r "${@: -1}"
    ;;
  *) exit 1 ;;
esac
SH
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

@test "a prose-only pull request runs Jest in prose mode, because some tests read prose" {
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  run bash "$SCOPE_SH" jest
  [[ "$output" == *"run=true"* ]]
  [[ "$output" == *"mode=prose"* ]]
}

@test "a JavaScript change runs Jest in full mode" {
  commit_file src/a.js > /dev/null
  run bash "$SCOPE_SH" jest
  [[ "$output" == *"run=true"* ]]
  [[ "$output" == *"mode=full"* ]]
}

@test "prose next to code in the same pull request still runs the whole suite" {
  commit_file src/a.js > /dev/null
  commit_file docs/GUIDE.md > /dev/null
  run bash "$SCOPE_SH" jest
  [[ "$output" == *"mode=full"* ]]
}

@test "a later prose-only push runs prose mode when the suite passed before it" {
  before="$(commit_file src/a.js)"
  commit_file docs/GUIDE.md > /dev/null
  stub_gh success
  EVENT_ACTION=synchronize BEFORE_SHA="$before" run bash "$SCOPE_SH" jest
  [[ "$output" == *"run=true"* ]]
  [[ "$output" == *"mode=prose"* ]]
}

@test "a later prose-only push runs the whole suite when the earlier run failed" {
  before="$(commit_file src/a.js)"
  commit_file docs/GUIDE.md > /dev/null
  stub_gh failure
  EVENT_ACTION=synchronize BEFORE_SHA="$before" run bash "$SCOPE_SH" jest
  [[ "$output" == *"mode=full"* ]]
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

@test "Jest never skips docs pages, because tests read them" {
  commit_file docs/GUIDE.md > /dev/null
  run bash "$SCOPE_SH" jest
  [[ "$output" == *"run=true"* ]]
  [[ "$output" == *"mode=prose"* ]]
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

@test "a later push runs when the earlier check passed against a different base" {
  before="$(commit_file src/a.js)"
  git checkout -q develop
  new_base="$(commit_file src/base.js)"
  git checkout -q feature
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  stub_gh success
  BASE_SHA="$new_base" EVENT_ACTION=synchronize BEFORE_SHA="$before" run bash "$SCOPE_SH" lint
  [ "$status" -eq 0 ]
  [[ "$output" == *"run=true"* ]]
}

@test "a later push runs when the earlier check has no base annotation" {
  before="$(commit_file src/a.js)"
  commit_file .github/specs/001-demo/tasks.md > /dev/null
  stub_gh success ""
  EVENT_ACTION=synchronize BEFORE_SHA="$before" run bash "$SCOPE_SH" lint
  [ "$status" -eq 0 ]
  [[ "$output" == *"run=true"* ]]
}

@test "an unreadable latest-push diff fails without recording a decision" {
  before="$(commit_file src/a.js)"
  head="$(commit_file .github/specs/001-demo/tasks.md)"
  REAL_GIT="$(command -v git)"
  export REAL_GIT
  cat > "$STUB_DIR/git" <<'SH'
#!/usr/bin/env bash
if [ "$1" = diff ] && [ "${@: -2:1}" = "$BEFORE_SHA" ] && [ "${@: -1}" = "$HEAD_SHA" ]; then
  exit 128
fi
exec "$REAL_GIT" "$@"
SH
  chmod +x "$STUB_DIR/git"
  PATH="$STUB_DIR:$PATH" GITHUB_OUTPUT="$TEST_REPO/out" EVENT_ACTION=synchronize \
    BEFORE_SHA="$before" HEAD_SHA="$head" run bash "$SCOPE_SH" lint
  [ "$status" -eq 1 ]
  [[ "$output" == *"Could not list the files changed between $before and $head."* ]]
  [ ! -e "$TEST_REPO/out" ]
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
