#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ">>> Running markdown folder validation"
python3 scripts/validate_markdown_folders.py templates examples memory tests

echo

echo ">>> Running JSON schema validation"
python3 scripts/validate_schemas.py

echo

echo "All requested folder schema validations passed."
