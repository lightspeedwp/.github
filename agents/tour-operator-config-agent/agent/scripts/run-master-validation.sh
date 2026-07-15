#!/usr/bin/env bash
# Run the full validation chain for reusable files and file-reference quality.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

run_step() {
  local label="$1"
  shift
  echo
  echo "==> $label"
  "$@"
}

run_step "Folder schema validation" bash scripts/validate-folder-schemas.sh
run_step "Naming validation" python3 scripts/validate-file-naming.py
run_step "Reference-link validation" python3 scripts/validate-reference-links.py
run_step "App-usage consistency validation" python3 scripts/validate-app-usage-consistency.py
run_step "Starter-prompt consistency validation" python3 scripts/validate-starter-prompts.py
run_step "Short-description consistency validation" python3 scripts/validate-short-description-consistency.py
run_step "Instruction-file consistency validation" python3 scripts/validate-instruction-file-consistency.py
run_step "Required structure validation" python3 scripts/validate-agent-structure.py
run_step "Memory validation" python3 scripts/validate-memory-files.py
run_step "Reusable file schema validation" python3 scripts/file-schema-validator.py

echo
echo "Master validation passed."