#!/usr/bin/env bash
# Run the full validation chain for reusable files, memory quality, and agent-structure consistency.

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
run_step "Markdown structure validation" python3 scripts/validate-markdown-structure.py
run_step "Instruction-file consistency validation" python3 scripts/validate-instruction-file-consistency.py
run_step "Memory hygiene validation" python3 scripts/validate-memory-hygiene.py
run_step "Source-priority consistency validation" python3 scripts/validate-source-priority-consistency.py
run_step "Template and schema alignment validation" python3 scripts/validate-template-schema-alignment.py
run_step "Business-context validation" python3 scripts/validate-business-context.py
run_step "Starter-prompt consistency validation" python3 scripts/validate-starter-prompts.py
run_step "Memory content validation" python3 scripts/validate-memory-contents.py
run_step "Short-description consistency validation" python3 scripts/validate-short-description-consistency.py
run_step "App-usage consistency validation" python3 scripts/validate-app-usage-consistency.py
run_step "Agent structure validation" python3 scripts/validate-agent-structure.py

echo
echo "Master validation passed."
