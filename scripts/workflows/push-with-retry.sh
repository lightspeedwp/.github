#!/usr/bin/env bash
# Push the current HEAD to a branch with rebase-and-retry.
#
# The target branch may move under the caller (merges, other bot commits),
# so a plain push loses the race with "fetch first" rejections. This helper
# rebases onto the latest remote state and retries with linear backoff.
#
# Conflicts limited to snapshot files (regenerated per run, last-writer-wins)
# are resolved by keeping this run's version ("theirs" during a rebase).
# Any other conflict aborts and fails so the race stays visible instead of
# silently dropping data.
#
# Usage:
#   push-with-retry.sh --branch <name> [--snapshot <path> ...]
#                      [--max-attempts N] [--base-delay S]
#
# Options:
#   --branch       Target branch to push HEAD to (required).
#   --snapshot     Snapshot file whose rebase conflicts resolve to this
#                  run's version. Repeatable. Defaults to none (any conflict
#                  aborts).
#   --max-attempts Push attempts before giving up. Default: 5.
#   --base-delay   Seconds multiplied by the attempt number for backoff.
#                  Default: 10. Set to 0 in tests.
set -euo pipefail

BRANCH=""
SNAPSHOTS=()
MAX_ATTEMPTS=5
BASE_DELAY=10

while [ "$#" -gt 0 ]; do
  case "$1" in
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    --snapshot)
      SNAPSHOTS+=("$2")
      shift 2
      ;;
    --max-attempts)
      MAX_ATTEMPTS="$2"
      shift 2
      ;;
    --base-delay)
      BASE_DELAY="$2"
      shift 2
      ;;
    -h | --help)
      sed -n '2,/^set /p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "push-with-retry.sh: unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

if [ -z "$BRANCH" ]; then
  echo "push-with-retry.sh: --branch is required" >&2
  exit 2
fi

attempt=1
until git push origin "HEAD:${BRANCH}"; do
  if [ "$attempt" -ge "$MAX_ATTEMPTS" ]; then
    echo "push-with-retry.sh: push failed after ${MAX_ATTEMPTS} attempts; giving up." >&2
    exit 1
  fi
  attempt=$((attempt + 1))
  echo "push-with-retry.sh: push rejected (attempt $((attempt - 1))/${MAX_ATTEMPTS}); rebasing and retrying..."
  sleep $((attempt * BASE_DELAY))
  git fetch origin "$BRANCH"
  if ! git rebase "origin/${BRANCH}"; then
    # Resolve snapshot-only conflicts with this run's version. If any
    # other file conflicts, fall through to abort below.
    conflict_files=$(git diff --name-only --diff-filter=U)
    snapshot_only=true
    for f in $conflict_files; do
      known=false
      for s in ${SNAPSHOTS[@]+"${SNAPSHOTS[@]}"}; do
        if [ "$f" = "$s" ]; then
          known=true
          break
        fi
      done
      if [ "$known" = false ]; then
        snapshot_only=false
        break
      fi
    done
    if [ "$snapshot_only" = true ] && [ -n "$conflict_files" ]; then
      git checkout --theirs -- $conflict_files
      git add -- $conflict_files
      git -c core.editor=true rebase --continue || (git rebase --abort && exit 1)
    else
      git rebase --abort && exit 1
    fi
  fi
done
echo "push-with-retry.sh: pushed to ${BRANCH}."
