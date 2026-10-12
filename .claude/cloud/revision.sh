#!/usr/bin/env bash
# LightSpeed cloud environment — revision stamp
#
# Prints the 12-character revision of the shared environment definition. The same
# value is stored in LS_CLOUD_ENV_REVISION (.claude/cloud/environment.env), checked
# by a CI test, and compared by .claude/hooks/session-start.sh. See
# .github/specs/018-claude-cloud-environment/contracts/cloud-environment.md (FR-025).
#
# Usage: bash .claude/cloud/revision.sh [repository-root]
#   The repository root defaults to two directories above this script.
#
# Each file is hashed on its own, and the stamp is the first 12 hex characters of
# the SHA-256 of a two-line manifest, so a change to either file, or a line moving
# from one file to the other, changes the stamp:
#   setup.sh <SHA-256 of the exact bytes of setup.sh>
#   environment.env <SHA-256 of the environment.env lines that remain once every
#                    line starting "LS_CLOUD_ENV_REVISION=" is removed>
# The remaining environment.env lines are each newline-terminated (including a
# final line that had no trailing newline), which is what `grep -v` writes. Both
# manifest lines end with a newline.
#
# When sha256sum is missing, or either file is unreadable, it prints nothing and
# still exits 0, so a caller can skip the check silently.

set -uo pipefail

root="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
setup="$root/.claude/cloud/setup.sh"
env_file="$root/.claude/cloud/environment.env"

command -v sha256sum >/dev/null 2>&1 || exit 0
[ -r "$setup" ] && [ -r "$env_file" ] || exit 0

setup_digest="$(sha256sum < "$setup" | cut -d' ' -f1)"
env_digest="$(grep -v '^LS_CLOUD_ENV_REVISION=' "$env_file" | sha256sum | cut -d' ' -f1)"

printf 'setup.sh %s\nenvironment.env %s\n' "$setup_digest" "$env_digest" | sha256sum | cut -c1-12

exit 0
