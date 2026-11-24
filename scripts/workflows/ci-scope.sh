#!/usr/bin/env bash
# ci-scope.sh - decide whether a CI check has anything to do for this event.
#
# Usage: ci-scope.sh <profile>
#   Profiles: lint, typecheck, actionlint, jest
#
# Writes `run=true|false` and `reason=<text>` to $GITHUB_OUTPUT (and stdout).
# A workflow keeps its job, so a required check always reports, and gates the
# expensive steps on `steps.<id>.outputs.run == 'true'`.
#
# The check is skipped in two cases only, both on pull requests:
#   1. No file the check reads is changed anywhere in the pull request.
#   2. The latest push changed no file the check reads, and the same check
#      passed on the commit before that push.
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
# Parameters: $1 run (true|false), $2 reason
decide() {
  printf 'run=%s\nreason=%s\n' "$1" "$2"
  if [ -n "${GITHUB_OUTPUT:-}" ]; then
    printf 'run=%s\nreason=%s\n' "$1" "$2" >> "$GITHUB_OUTPUT"
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
      # The suite reads specifications, the changelog, workflows and other
      # Markdown, so only plain pages directly under docs/ are safe to ignore.
      case "$file" in
        docs/LABEL_STRATEGY.md | docs/LABELING.md) return 0 ;;
        docs/*/*) return 0 ;;
        docs/*.md) return 1 ;;
      esac
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

# previous_passed - whether CHECK_NAME concluded `success` on a commit.
# Any error counts as "did not pass".
# Parameters: $1 commit SHA
previous_passed() {
  local conclusion
  [ -n "${CHECK_NAME:-}" ] && [ -n "${GITHUB_REPOSITORY:-}" ] || return 1
  conclusion="$(gh api -X GET "repos/${GITHUB_REPOSITORY}/commits/$1/check-runs" \
    -f check_name="$CHECK_NAME" -f per_page=100 \
    --jq '[.check_runs[]] | sort_by(.started_at) | last | .conclusion // ""' 2> /dev/null)" || return 1
  [ "$conclusion" = "success" ]
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

if ! any_relevant "$profile" "$workdir/whole"; then
  decide false "no file read by this check is changed in the pull request"
fi

before="${BEFORE_SHA:-}"
if [ "${EVENT_ACTION:-}" = "synchronize" ] &&
  [[ "$before" =~ ^[0-9a-f]{40}$ ]] && [[ ! "$before" =~ ^0+$ ]] &&
  git cat-file -e "${before}^{commit}" 2> /dev/null &&
  git merge-base --is-ancestor "$before" "$head" 2> /dev/null &&
  git diff --name-only --no-renames -z "$before" "$head" > "$workdir/latest" &&
  ! any_relevant "$profile" "$workdir/latest" &&
  previous_passed "$before"; then
  decide false "the latest push changed no file read by this check, which passed on ${before:0:10}"
fi

decide true "the pull request changes files read by this check"
