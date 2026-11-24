#!/usr/bin/env bash
# ci-scope.sh - decide whether a CI check has anything to do for this event.
#
# Usage: ci-scope.sh <profile>
#   Profiles: lint, typecheck, actionlint, jest
#
# Writes `run=true|false`, `mode=full|prose` and `reason=<text>` to
# $GITHUB_OUTPUT (and stdout). `mode=prose` is used by the jest profile only: it
# means run just the tests listed in tests/jest-prose-tests.json.
# A workflow keeps its job, so a required check always reports, and gates the
# expensive steps on `steps.<id>.outputs.run == 'true'`.
#
# The check is skipped in two cases only, both on pull requests:
#   1. No file the check reads is changed anywhere in the pull request.
#   2. The latest push changed no file the check reads, and the same check
#      passed on the commit before that push against the same base.
# Everything else runs the check: other events, a force push, a failed or
# missing earlier result, or an error while asking. An unreadable diff exits 1,
# so a broken comparison can never look like "nothing to do".
#
# Environment:
#   EVENT_NAME    github.event_name
#   EVENT_ACTION  github.event.action
#   BASE_SHA      github.event.pull_request.base.sha
#   HEAD_SHA      github.event.pull_request.head.sha
#   BEFORE_SHA    github.event.before (set on `synchronize`)
#   CHECK_NAME    name of the check whose earlier result is consulted
#   GH_TOKEN      token for `gh` (needs `checks: read`)
#   GITHUB_REPOSITORY, GITHUB_OUTPUT

set -euo pipefail

profile="${1:-}"
case "$profile" in
  lint | typecheck | actionlint | jest) ;;
  *)
    echo "Usage: $0 <lint|typecheck|actionlint|jest>" >&2
    exit 2
    ;;
esac

# decide - record the decision and stop.
# Parameters: $1 run (true|false), $2 reason, $3 mode (full|prose, default full)
decide() {
  printf 'run=%s\nmode=%s\nreason=%s\n' "$1" "${3:-full}" "$2"
  if [ -n "${GITHUB_OUTPUT:-}" ]; then
    printf 'run=%s\nmode=%s\nreason=%s\n' "$1" "${3:-full}" "$2" >> "$GITHUB_OUTPUT"
  fi
  # Record the event base on the check itself for the next push. Jest's
  # result belongs to its compare job, which records the base separately.
  if [ "${GITHUB_ACTIONS:-}" = "true" ] && [ "$profile" != "jest" ] &&
    [ "${EVENT_NAME:-}" = "pull_request" ] && [[ "${BASE_SHA:-}" =~ ^[0-9a-f]{40}$ ]]; then
    printf '::notice file=scripts/workflows/ci-scope.sh,line=1,title=CI scope base::%s\n' "$BASE_SHA"
  fi
  exit 0
}

# is_relevant - whether a changed path can affect the profile's result.
# Each list errs on the side of running the check.
# Parameters: $1 profile, $2 path
is_relevant() {
  local file="$2"

  # A change to the workflows or to this script re-runs every check.
  case "$file" in
    .github/workflows/* | scripts/workflows/ci-scope.sh | .nvmrc) return 0 ;;
  esac

  case "$1" in
    lint)
      # eslint, spectral and the package.json linter, plus their configuration.
      [[ "$file" =~ \.(js|jsx|ts|tsx|cjs|mjs|yml|yaml)$ ]] && return 0
      [[ "$file" =~ (^|/)package(-lock)?\.json$ ]] && return 0
      # Root-level files other than prose are tool configuration.
      [[ "$file" != */* && ! "$file" =~ \.(md|mdx|txt)$ ]] && return 0
      return 1
      ;;
    typecheck)
      [[ "$file" =~ \.(js|jsx|ts|tsx|cjs|mjs|astro|json)$ ]] && return 0
      [[ "$file" == website/* ]] && return 0
      [[ "$file" != */* && ! "$file" =~ \.(md|mdx|txt)$ ]] && return 0
      return 1
      ;;
    actionlint)
      [[ "$file" =~ ^\.github/actionlint\.ya?ml$ ]] && return 0
      [[ "$file" == scripts/validation/run-actionlint.cjs ]] && return 0
      [[ "$file" =~ ^package(-lock)?\.json$ ]] && return 0
      return 1
      ;;
    jest)
      # Everything except prose needs the whole suite. A read trace shows
      # the suite reads nearly every Markdown file in the repository, but
      # only the test files in tests/jest-prose-tests.json do so. A change
      # to prose alone therefore runs those tests (mode=prose), never none.
      [[ "$file" =~ \.(md|mdx|txt)$ ]] && return 1
      return 0
      ;;
  esac
}

# any_relevant - whether any NUL-separated path in a file is relevant.
# Parameters: $1 profile, $2 file holding the list
any_relevant() {
  local file
  while IFS= read -r -d '' file; do
    if is_relevant "$1" "$file"; then
      return 0
    fi
  done < "$2"
  return 1
}

# previous_passed - whether the latest check passed on the commit and same base.
# Any missing or unreadable result or base counts as "did not pass".
# Parameters: $1 commit SHA, $2 base SHA
previous_passed() {
  local check_id tested_base
  [ -n "${CHECK_NAME:-}" ] && [ -n "${GITHUB_REPOSITORY:-}" ] || return 1
  [[ "$2" =~ ^[0-9a-f]{40}$ ]] || return 1
  check_id="$(gh api -X GET "repos/${GITHUB_REPOSITORY}/commits/$1/check-runs" \
    -f check_name="$CHECK_NAME" -f per_page=100 \
    --jq '.check_runs | sort_by(.started_at, .id) | last
      | select(.conclusion == "success" and .app.slug == "github-actions") | .id' 2> /dev/null)" || return 1
  [[ "$check_id" =~ ^[0-9]+$ ]] || return 1

  # A check run's PR metadata can describe the current PR rather than the
  # base used by that run. Read the annotation attached to this exact check.
  tested_base="$(gh api --paginate "repos/${GITHUB_REPOSITORY}/check-runs/$check_id/annotations" \
    --jq '.[] | select(.title == "CI scope base" and .path == "scripts/workflows/ci-scope.sh") | .message' \
    2> /dev/null)" || return 1
  [ "$tested_base" = "$2" ]
}

if [ "${EVENT_NAME:-}" != "pull_request" ]; then
  decide true "event ${EVENT_NAME:-unknown} always runs the check"
fi

head="${HEAD_SHA:-HEAD}"
workdir="$(mktemp -d)"
trap 'rm -rf -- "$workdir"' EXIT

if [ -z "${BASE_SHA:-}" ] || ! git diff --name-only --no-renames -z "${BASE_SHA}...${head}" > "$workdir/whole"; then
  echo "Could not list the files changed between ${BASE_SHA:-<no base>} and ${head}." >&2
  exit 1
fi

# prose_mode - the mode for a prose-only change to the jest profile.
# Without the list of prose-dependent tests the whole suite has to run.
prose_mode() {
  if [ -f "$(dirname "${BASH_SOURCE[0]}")/../../tests/jest-prose-tests.json" ]; then
    echo prose
  else
    echo full
  fi
}

if ! any_relevant "$profile" "$workdir/whole"; then
  if [ "$profile" = "jest" ] && [ -s "$workdir/whole" ]; then
    decide true "the pull request changes only prose, so only the tests that depend on prose run" "$(prose_mode)"
  fi
  decide false "no file read by this check is changed in the pull request"
fi

before="${BEFORE_SHA:-}"
if [ "${EVENT_ACTION:-}" = "synchronize" ] &&
  [[ "$before" =~ ^[0-9a-f]{40}$ ]] && [[ ! "$before" =~ ^0+$ ]] &&
  git cat-file -e "${before}^{commit}" 2> /dev/null &&
  git merge-base --is-ancestor "$before" "$head" 2> /dev/null; then
  if ! git diff --name-only --no-renames -z "$before" "$head" > "$workdir/latest"; then
    echo "Could not list the files changed between $before and $head." >&2
    exit 1
  fi
  if ! any_relevant "$profile" "$workdir/latest" && previous_passed "$before" "$BASE_SHA"; then
    if [ "$profile" = "jest" ] && [ -s "$workdir/latest" ]; then
      decide true "the latest push changed only prose, and the suite passed on ${before:0:10}, so only the tests that depend on prose run" "$(prose_mode)"
    fi
    decide false "the latest push changed no file read by this check, which passed on ${before:0:10}"
  fi
fi

decide true "the pull request changes files read by this check"
