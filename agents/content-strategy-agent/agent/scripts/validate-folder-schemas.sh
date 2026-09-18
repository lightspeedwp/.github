#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

python3 "$ROOT/scripts/run-all-validators.py" "$ROOT"

echo "All schema validation checks passed."
