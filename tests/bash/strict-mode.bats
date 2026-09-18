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
#   0 when script has set -euo pipefail or set -Eeuo pipefail before first function definition
#   1 when script lacks proper strict-mode setup at top level or it's nested in a function
has_strict_mode() {
  # Extract everything before the first function definition (both forms)
  # Then verify set -euo pipefail appears on a non-indented line (truly top-level)
  awk '
    /^[a-zA-Z_][a-zA-Z0-9_]*\s*\(\s*\)/ { exit }  # Stop at name() declaration
    /^function\s+[a-zA-Z_][a-zA-Z0-9_]*/ { exit }  # Stop at function name declaration
    /^set -E?euo pipefail/ { found = 1 }          # Match non-indented set command
    END { exit !found }
  ' "$1"
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

@test "strict-mode parser rejects name() with nested set command" {
  # Regression test: name() form should be detected and rejected when set is nested
  tmpfile=$(mktemp)
  trap 'rm -f "$tmpfile"' EXIT
  cat > "$tmpfile" <<'EOF'
#!/bin/bash

helper() {
  set -euo pipefail
  echo "nested strict mode"
}

helper
EOF
  if has_strict_mode "$tmpfile"; then
    return 1  # Should fail because strict-mode is nested in function
  fi
}

@test "strict-mode parser rejects function name with nested set command" {
  # Regression test: function name form should be detected and rejected when set is nested
  tmpfile=$(mktemp)
  trap 'rm -f "$tmpfile"' EXIT
  cat > "$tmpfile" <<'EOF'
#!/bin/bash

function helper {
  set -euo pipefail
  echo "nested strict mode"
}

helper
EOF
  if has_strict_mode "$tmpfile"; then
    return 1  # Should fail because strict-mode is nested in function
  fi
}

@test "strict-mode parser rejects function name() with nested set command" {
  # Regression test: function name() form should be detected and rejected when set is nested
  tmpfile=$(mktemp)
  trap 'rm -f "$tmpfile"' EXIT
  cat > "$tmpfile" <<'EOF'
#!/bin/bash

function helper() {
  set -euo pipefail
  echo "nested strict mode"
}

helper
EOF
  if has_strict_mode "$tmpfile"; then
    return 1  # Should fail because strict-mode is nested in function
  fi
}

@test "strict-mode parser accepts top-level set before name() form" {
  # Regression test: top-level set should pass even with name() declarations after
  tmpfile=$(mktemp)
  trap 'rm -f "$tmpfile"' EXIT
  cat > "$tmpfile" <<'EOF'
#!/bin/bash
set -euo pipefail

helper() {
  echo "function body"
}

helper
EOF
  if ! has_strict_mode "$tmpfile"; then
    return 1  # Should pass because strict-mode is at top-level
  fi
}

@test "strict-mode parser accepts top-level set before function name form" {
  # Regression test: top-level set should pass even with function name declarations after
  tmpfile=$(mktemp)
  trap 'rm -f "$tmpfile"' EXIT
  cat > "$tmpfile" <<'EOF'
#!/bin/bash
set -euo pipefail

function helper {
  echo "function body"
}

helper
EOF
  if ! has_strict_mode "$tmpfile"; then
    return 1  # Should pass because strict-mode is at top-level
  fi
}

@test "strict-mode parser accepts top-level set before function name() form" {
  # Regression test: top-level set should pass even with function name() declarations after
  tmpfile=$(mktemp)
  trap 'rm -f "$tmpfile"' EXIT
  cat > "$tmpfile" <<'EOF'
#!/bin/bash
set -euo pipefail

function helper() {
  echo "function body"
}

helper
EOF
  if ! has_strict_mode "$tmpfile"; then
    return 1  # Should pass because strict-mode is at top-level
  fi
}
