#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "templates/agent-investigation-template.md"
  "templates/agent-customer-reply-template.md"
  "templates/agent-escalation-template.md"
  "templates/agent-backlog-report-template.md"
  "examples/templates/agent-investigation.example.md"
  "examples/templates/agent-customer-reply.example.md"
  "examples/templates/agent-escalation.example.md"
  "examples/templates/agent-backlog-report.example.md"
  "examples/memory/user-preferences.example.md"
  "examples/memory/report-defaults.example.yaml"
  "examples/memory/drafting-preferences.example.md"
  "examples/memory/todos.example.md"
  "schemas/report-defaults.schema.json"
  "schemas/user-preferences.schema.json"
  "schemas/drafting-preferences.schema.json"
  "memory/user-preferences.md"
  "memory/report-defaults.yaml"
  "memory/drafting-preferences.md"
  "memory/todos.md"
)

for path in "${required_files[@]}"; do
  if [[ ! -f "$path" ]]; then
    echo "Missing required file: $path" >&2
    exit 1
  fi
done

while IFS= read -r file; do
  [[ -n "$file" ]] || continue
  first_line=$(grep -m1 -v '^[[:space:]]*$' "$file" || true)
  if [[ -z "$first_line" || "$first_line" != \#* ]]; then
    echo "Markdown file should begin with a heading: $file" >&2
    exit 1
  fi
done < <(find templates examples -type f -name '*.md' | sort)

while IFS= read -r schema_file; do
  [[ -n "$schema_file" ]] || continue
  python - <<'PY' "$schema_file"
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])
with path.open('r', encoding='utf-8') as handle:
    data = json.load(handle)

if not isinstance(data, dict):
    raise SystemExit(f'Schema root must be an object: {path}')
if '$schema' not in data:
    raise SystemExit(f'Schema missing $schema: {path}')
if data.get('type') != 'object':
    raise SystemExit(f'Schema should declare type=object: {path}')
if 'properties' not in data or not isinstance(data['properties'], dict):
    raise SystemExit(f'Schema missing object properties: {path}')
PY
done < <(find schemas -type f -name '*.json' | sort)

python scripts/validate_schema_files.py

echo "Folder schema checks passed."
