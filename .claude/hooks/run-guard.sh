#!/usr/bin/env bash
# Launcher for the PreToolUse branch guard.
#
# A hook command that cannot start is treated as non-blocking, so invoking the
# guard as `node enforce-branch-name.mjs` fails open on any machine where node is
# not on PATH: the hook never runs, no exit code is produced, and the matched
# command proceeds unchecked. That is the opposite of what enforcement is for, so
# the interpreter is resolved here and its absence is handled as a guard fault
# (FR-012a, research R15).
#
# Exit codes are the guard's own: 0 allows, 2 refuses. This launcher adds only
# the case where the guard cannot run at all. With enforcement on it then refuses
# git commit, push and branch operations and the GitHub tools, with "Branch guard
# unavailable", and allows every other call with a visible warning. Refusing every
# call, as this launcher used to, blocked a session without Node from running even
# `ls` to diagnose the problem.

set -uo pipefail

GUARD="${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/enforce-branch-name.mjs"

# The messages here are fixed strings, so the only character needing an escape is
# the double quote, and the backslash escapes below are done with shell parameter
# expansion rather than sed: sed is not guaranteed to be on PATH either, and this
# function has to work in exactly the degraded environment it exists for.
# $1 message, $2 exit code. The JSON goes to stdout so the session surfaces it as
# a system message, and the plain text to stderr so it is visible in a transcript.
report() {
  local escaped="${1//\\/\\\\}"
  escaped="${escaped//\"/\\\"}"
  printf '{"systemMessage":"%s"}\n' "$escaped"
  printf '%s\n' "$1" >&2
  exit "$2"
}

# Which calls are writes, judged without the guard. These are the guard's own
# fault-path patterns (GIT_WRITE in enforce-branch-name.mjs, research R11),
# restated for a shell with no interpreter. They are written with explicit
# character classes instead of \b and \s, which not every regex library accepts,
# and they are matched against the raw hook JSON, so a quoted argument arrives as
# \" and a newline as \n; neither is a pipe, a semicolon or an ampersand, so the
# `[^|;&]*` spans behave as they do on the decoded command. The test suite runs
# both classifiers over the same commands and fails when they disagree.
#   N  a character that cannot continue a word
#   P  anything within one command, that is, up to a pipe, semicolon or ampersand
N='[^[:alnum:]_]'
P='[^|;&]*'
S='[[:space:]]'
GIT="(^|${N})git(${N}${P})?${N}"
WRITE_PATTERNS=(
  "${GIT}(commit|push)(${N}|\$)"
  "${GIT}branch(${N}${P})?${S}(-[mMdDf]|--move|--delete|--force)(${N}|\$)"
  "${GIT}checkout(${N}${P})?${S}-[bB](${N}|\$)"
  "${GIT}switch(${N}${P})?${S}(-[cC]|--create|--force-create)(${N}|\$)"
  "(^|${N})gh${S}+pr${S}+create(${N}|\$)"
  "(^|${N})gh${S}+api(${N}${P})?${S}(-X[A-Za-z]+|-X(${N}|\$)|--method|-f[A-Za-z]|-f(${N}|\$)|-F[A-Za-z]|-F(${N}|\$)|--field|--raw-field|--input)"
)

# Plain `git branch <name>` creates a branch with no flag for a pattern to find, so
# it is judged on its arguments: a query flag makes it a read (the guard's own
# BRANCH_QUERY_FLAGS), a bare `git branch` lists, and any other word is a name.
# Mirrors createsBranchPlainly in enforce-branch-name.mjs.
QUERY_FLAGS=' -l --list -a --all -r --remotes --show-current -v -vv --verbose --contains --no-contains --merged --no-merged --points-at --sort --format -u --set-upstream-to --unset-upstream --edit-description --column --no-column '
creates_branch() {
  local call="$1" seg tok flag seen positional query
  local re='(^|[^[:alnum:]_])git[^|;&]*'
  while [[ $call =~ $re ]]; do
    seg="${BASH_REMATCH[0]}"
    call="${call#*"$seg"}"
    seen=0
    positional=0
    query=0
    set -f
    for tok in $seg; do
      if [ "$seen" = 0 ]; then
        if [ "$tok" = branch ]; then seen=1; fi
        continue
      fi
      flag="${tok%%=*}"
      case "$QUERY_FLAGS" in *" $flag "*) query=1 ;; esac
      case "$tok" in -*) ;; *) positional=1 ;; esac
    done
    set +f
    if [ "$seen" = 1 ] && [ "$query" = 0 ] && [ "$positional" = 1 ]; then
      return 0
    fi
  done
  return 1
}

# Whether the hook call on stdin is a write. $1 is the raw hook JSON. Every GitHub
# MCP tool counts, as it does in the guard; an unreadable or empty call is not a
# write, the same as the guard's treatment of malformed input.
is_write() {
  local call="$1" tool="" pattern
  # JSON writes a tab, a newline and a carriage return inside a string as an
  # escape, two characters that [[:space:]] does not match, so `git<TAB>push`
  # arrives as `git\tpush`. They are turned back into a space before the patterns
  # run, as the guard sees them after decoding. The \u forms are the same
  # characters written the long way, together with the vertical tab and form feed.
  call="${call//\\t/ }"
  call="${call//\\n/ }"
  call="${call//\\r/ }"
  call="${call//\\u0009/ }"
  call="${call//\\u000a/ }"
  call="${call//\\u000d/ }"
  call="${call//\\u000b/ }"
  call="${call//\\u000c/ }"
  local tool_re='"tool_name"[[:space:]]*:[[:space:]]*"([^"]*)"'
  if [[ $call =~ $tool_re ]]; then
    tool="${BASH_REMATCH[1]}"
  fi
  case "$tool" in
    mcp__github__*) return 0 ;;
    Bash) ;;
    *) return 1 ;;
  esac
  for pattern in "${WRITE_PATTERNS[@]}"; do
    if [[ $call =~ $pattern ]]; then
      return 0
    fi
  done
  creates_branch "$call"
}

# The guard cannot run. $1 is the reason. The switch is read here only where it
# cannot be honoured by the guard itself: short-circuiting on it unconditionally
# would stop the guard from ever starting with enforcement off, which is the one
# case where it still has something to say (contracts/hooks.md, FR-013). With
# enforcement off the call proceeds with a warning, whatever it is, because a
# missing guard file is exactly when a developer needs to put the file back and
# the hook matches Edit and Write.
guard_unavailable() {
  if [ "${LS_ENFORCE_BRANCH_NAMES:-1}" = "0" ]; then
    report "Branch guard (warning only): enforcement is off, so no check ran." 0
  fi
  # The call is read only here. On the normal path stdin belongs to the guard.
  local call=""
  IFS= read -r -d '' call || true
  if is_write "$call"; then
    report "Branch guard unavailable: $1" 2
  fi
  report "Branch guard unavailable: $1" 0
}

if ! command -v node >/dev/null 2>&1; then
  guard_unavailable "node is not on PATH, so $GUARD cannot run. Install Node (see .claude/cloud/setup.sh), or start the session with LS_ENFORCE_BRANCH_NAMES=0 to work without the guard deliberately."
fi

if [ ! -f "$GUARD" ]; then
  guard_unavailable "$GUARD is missing, so no check ran."
fi

exec node "$GUARD"
