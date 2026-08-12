#!/usr/bin/env bats

collect_shell_files() {
  find scripts .github -type f \( -name '*.sh' -o -name '*.bash' \) | sort
}

@test "first-party shell scripts use strict mode" {
  shell_files="$(collect_shell_files)"

  if [ -z "$shell_files" ]; then
    skip "No first-party shell scripts found under scripts/ or .github/."
  fi

  missing=""
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if ! grep -Eq '^set -Eeuo pipefail$' "$file"; then
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
