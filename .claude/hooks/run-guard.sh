#!/usr/bin/env bash
# Launcher for the PreToolUse branch guard.
#
# A hook command that cannot start is treated as non-blocking, so invoking the
# guard as `node enforce-branch-name.mjs` fails open on any machine where node is
# not on PATH: the hook never runs, no exit code is produced, and the matched
# command proceeds unchecked. That is the opposite of what enforcement is for, so
# the interpreter is resolved here and its absence is reported as a refusal.
#
# Exit codes are the guard's own: 0 allows, 2 refuses. This launcher adds only
# the case where the guard cannot run at all, and it refuses there too, so the
# only way a guarded command proceeds is a running guard that allowed it.

set -uo pipefail

GUARD="${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/enforce-branch-name.mjs"

# The escape hatch has to work here, not just be named in the message. The hook
# matches Bash, Edit and Write, so a launcher that refused unconditionally would
# refuse every call in the session, including `ls`, and a deliberate opt-out could
# not be reached at all. FR-013 makes a fault a warning when enforcement is off,
# so the same holds here: a missing interpreter degrades to a warning.
# The messages here are fixed strings, so the only character needing an escape is
# the double quote, and the backslash escapes below are done with shell parameter
# expansion rather than sed: sed is not guaranteed to be on PATH either, and this
# function has to work in exactly the degraded environment it exists for.
# $1 message, $2 exit code. The JSON goes to stdout so the session surfaces it as
# a system message, and the plain text to stderr so it is visible in a transcript.
# The escapes are done with shell parameter expansion rather than sed, which is
# not guaranteed to be on PATH either and this has to work in exactly the degraded
# environment it exists for.
report() {
  local escaped="${1//\\/\\\\}"
  escaped="${escaped//\"/\\\"}"
  printf '{"systemMessage":"%s"}\n' "$escaped"
  printf '%s\n' "$1" >&2
  exit "$2"
}

# With enforcement deliberately off there is no guard to run and nothing to
# enforce, so a missing interpreter is a warning rather than a refusal. Without
# this the opt-out would be unreachable: the hook matches Bash, Edit and Write, so
# an unconditional refusal would block every call in the session, `ls` included.
if [ "${LS_ENFORCE_BRANCH_NAMES:-1}" = "0" ]; then
  report "Branch guard (warning only): enforcement is off, so no check ran." 0
fi

if ! command -v node >/dev/null 2>&1; then
  report "Branch guard blocked: node is not on PATH, so $GUARD cannot run. Install Node (see .claude/cloud/setup.sh), or start the session with LS_ENFORCE_BRANCH_NAMES=0 to work without the guard deliberately." 2
fi

if [ ! -f "$GUARD" ]; then
  report "Branch guard blocked: $GUARD is missing, so no check ran." 2
fi

exec node "$GUARD"
