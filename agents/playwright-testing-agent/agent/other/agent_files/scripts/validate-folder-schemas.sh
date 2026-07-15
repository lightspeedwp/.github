#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

failures=0

run_check() {
  local label="$1"
  shift
  echo "==> $label"
  if "$@"; then
    echo "PASS: $label"
  else
    echo "FAIL: $label"
    failures=1
  fi
  echo
}

for folder in examples schemas fixtures profiles prompts tests scripts; do
  if [[ -d "$folder" ]]; then
    echo "PASS: required folder exists: $folder/"
  else
    echo "FAIL: missing required folder: $folder/"
    failures=1
  fi
done

if [[ -f README.md ]]; then
  echo "PASS: required root file exists: README.md"
else
  echo "FAIL: missing required root file: README.md"
  failures=1
fi

if [[ -d memory ]]; then
  echo "INFO: optional folder present: memory/"
else
  echo "INFO: optional folder not present: memory/"
fi

if [[ -f business-context.md ]]; then
  echo "INFO: optional root file present: business-context.md"
else
  echo "INFO: optional root file not present: business-context.md"
fi

echo
if [[ -d schema ]]; then
  echo "FAIL: found disallowed schema/ folder. Rename it to schemas/."
  failures=1
else
  echo "PASS: no disallowed schema/ folder found"
fi

echo
run_check "Master agent pack validation" python3 scripts/validate-agent-pack.py
run_check "Markdown structure validation" python3 scripts/validate-markdown-structure.py
run_check "Example/schema alignment validation" python3 scripts/validate-template-schema-alignment.py
run_check "Links and references validation" python3 scripts/validate-links-and-references.py
run_check "Starter prompt validation" python3 scripts/validate-starter-prompts.py
run_check "Skills routing validation" python3 scripts/validate-skills-routing.py
run_check "MCP references validation" python3 scripts/validate-mcp-references.py
run_check "Memory hygiene validation" python3 scripts/validate-memory-hygiene.py
run_check "Source priority consistency validation" python3 scripts/validate-source-priority-consistency.py
run_check "Business context validation" python3 scripts/validate-business-context.py

if [[ "$failures" -ne 0 ]]; then
  echo "Validation failed."
  exit 1
fi

echo "All validation checks passed."
