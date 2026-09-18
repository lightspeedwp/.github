#!/usr/bin/env bats

# Strict-mode policy for first-party shell scripts.
#
# Compliant: a top-level `set -euo pipefail` or `set -Eeuo pipefail` line.
# Scope: scripts/ and .github/, excluding .github/projects/ (archived project
# artefacts and vendored copies, not executed by CI).
# Baseline: scripts listed in BASELINE predate this policy and are tolerated
# until fixed. Remove an entry once its script is compliant; never add to it.

BASELINE='
.github/scripts/__tests__/run-all-tests.sh
.github/scripts/measure-actions-minutes.sh
scripts/automation/test-project-docs-update.sh
scripts/check-mermaid-diagrams.sh
scripts/report-changelog-action.sh
scripts/summarize-native-type.sh
'

# collect_shell_files - Find all first-party shell scripts in scripts/ and .github/
# Outputs sorted list of all .sh and .bash files, excluding archived project artifacts
collect_shell_files() {
  find scripts .github -type f \( -name '*.sh' -o -name '*.bash' \) \
    -not -path '.github/projects/*' | sort
}

# is_baselined - Check if a script is on the baseline exemption list
# Parameters:
#   $1 - Script file path to check against baseline
# Returns:
#   0 when script is in BASELINE list
#   1 when script is not in BASELINE list
is_baselined() {
  printf '%s\n' "$BASELINE" | grep -Fxq -- "$1"
}

# has_strict_mode - Verify that a script contains proper strict-mode setup at top level
# Parameters:
#   $1 - Script file path to check for strict mode
# Returns:
#   0 when script has set -euo pipefail or set -Eeuo pipefail in the first 20 lines
#   1 when script lacks proper strict-mode setup at top level
has_strict_mode() {
  # Verify strict mode is at top-level (before any function definitions)
  # Check first 20 lines to ensure it's not buried in a function
  head -20 "$1" | grep -q "^set -E\?euo pipefail"
}

@test "first-party shell scripts use strict mode" {
  shell_files="$(collect_shell_files)"

  if [ -z "$shell_files" ]; then
    skip "No first-party shell scripts found under scripts/ or .github/."
  fi

  missing=""
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    is_baselined "$file" && continue
    if ! has_strict_mode "$file"; then
      missing="$missing$file\n"
    fi
  done <<EOF_FILES
$shell_files
EOF_FILES

  if [ -n "$missing" ]; then
    printf 'Missing strict mode in:\n%b' "$missing" >&2
    return 1
  fi
}

@test "strict-mode baseline entries still exist and are still non-compliant" {
  stale=""
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if [ ! -f "$file" ]; then
      stale="$stale$file (missing)\n"
    elif has_strict_mode "$file"; then
      stale="$stale$file (now compliant, remove from BASELINE)\n"
    fi
  done <<EOF_BASE
$BASELINE
EOF_BASE

  if [ -n "$stale" ]; then
    printf 'Stale baseline entries:\n%b' "$stale" >&2
    return 1
  fi
}
