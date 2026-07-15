#!/usr/bin/env bash
# Validate reusable file structure across templates, examples, schemas, and memory.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

failures=0

fail() {
  echo "[FAIL] $1"
  failures=$((failures + 1))
}

pass() {
  echo "[PASS] $1"
}

first_nonempty_line() {
  awk 'NF { print; exit }' "$1"
}

require_heading() {
  local file="$1"
  local heading="$2"
  if grep -Fxq "$heading" "$file"; then
    pass "$file contains heading: $heading"
  else
    fail "$file is missing heading: $heading"
  fi
}

require_regex() {
  local value="$1"
  local pattern="$2"
  local message="$3"
  if [[ "$value" =~ $pattern ]]; then
    pass "$message"
  else
    fail "$message"
  fi
}

check_template_blankness() {
  local file="$1"
  if grep -Eq '^-[[:space:]]+[^[:space:]].*:$' "$file" || grep -Eq '^-[[:space:]]*$' "$file" || grep -Eq '^[0-9]+\.[[:space:]]*$' "$file"; then
    pass "$file still looks reusable"
  else
    fail "$file no longer looks like a reusable template"
  fi
}

check_example_populated() {
  local file="$1"
  if grep -Eq '^-[[:space:]]+[^[:space:]].+|^[0-9]+\.[[:space:]]+[^[:space:]].+' "$file"; then
    pass "$file contains filled example content"
  else
    fail "$file does not contain filled example content"
  fi
}

check_json_schema() {
  local file="$1"
  if python3 - "$file" <<'PY'
import json, sys
path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)
if not isinstance(data, dict):
    raise SystemExit(1)
if not isinstance(data.get('title'), str) or not data.get('title', '').strip():
    raise SystemExit(2)
if data.get('type') != 'object':
    raise SystemExit(3)
props = data.get('properties')
if not isinstance(props, dict) or not props:
    raise SystemExit(4)
PY
  then
    pass "$file parses as valid JSON schema with object properties"
  else
    fail "$file failed JSON schema parsing or structure checks"
  fi
}

echo "Running folder schema validation checks..."

# Templates
for file in templates/*.md; do
  [[ "$(basename "$file")" == "README.md" ]] && continue
  title="$(first_nonempty_line "$file")"
  require_regex "$(basename "$file")" '^[a-z0-9-]+-template\.md$' "$file filename matches template convention"
  require_regex "$title" '^# .+' "$file starts with a level-1 title"
  check_template_blankness "$file"

  case "$(basename "$file")" in
    pre-launch-summary-template.md)
      require_heading "$file" '## Completed'
      require_heading "$file" '## Missing'
      require_heading "$file" '## Risks'
      require_heading "$file" '## Recommended next actions'
      ;;
    site-discovery-template.md)
      require_heading "$file" '## Business basics'
      require_heading "$file" '## Site structure'
      require_heading "$file" '## Content model'
      require_heading "$file" '## Forms and SEO'
      ;;
    gravity-forms-plan-template.md)
      require_heading "$file" '## Form purpose'
      require_heading "$file" '## Required fields'
      require_heading "$file" '## Optional fields'
      require_heading "$file" '## Notification routing'
      require_heading "$file" '## Confirmation message'
      require_heading "$file" '## Compliance and anti-spam'
      require_heading "$file" '## QA checks'
      ;;
    *)
      fail "$file has no per-file template heading test yet"
      ;;
  esac
done

# Examples
for file in examples/*.md; do
  [[ "$(basename "$file")" == "README.md" ]] && continue
  title="$(first_nonempty_line "$file")"
  require_regex "$(basename "$file")" '^example-[a-z0-9-]+\.md$' "$file filename matches example convention"
  require_regex "$title" '^# Example .+' "$file starts with an example title"
  check_example_populated "$file"

  case "$(basename "$file")" in
    example-pre-launch-summary.md)
      require_heading "$file" '## Completed'
      require_heading "$file" '## Missing'
      require_heading "$file" '## Risks'
      require_heading "$file" '## Next actions'
      ;;
    example-site-discovery.md)
      require_heading "$file" '## Business basics'
      require_heading "$file" '## Site structure'
      require_heading "$file" '## Content model'
      require_heading "$file" '## Forms and SEO'
      ;;
    *)
      fail "$file has no per-file example heading test yet"
      ;;
  esac
done

# Schemas
schema_files=(
  "schemas/enquiry-form-schema.json"
  "schemas/site-discovery-schema.json"
  "schemas/template-file-validation-schema.json"
  "schemas/example-file-validation-schema.json"
  "schemas/schema-file-validation-schema.json"
  "schemas/memory-file-validation-schema.json"
)

for file in "${schema_files[@]}"; do
  if [[ -f "$file" ]]; then
    require_regex "$(basename "$file")" '^[a-z0-9-]+-schema\.json$' "$file filename matches schema convention"
    check_json_schema "$file"
  else
    fail "$file is missing from the expected schema validation set"
  fi
done

for file in schemas/*.json; do
  found=false
  for known_schema in "${schema_files[@]}"; do
    if [[ "$file" == "$known_schema" ]]; then
      found=true
      break
    fi
  done
  if [[ "$found" == false ]]; then
    fail "$file is not included in the explicit schema validation set"
  fi
done

# Memory
for file in memory/*.md; do
  [[ "$(basename "$file")" == "README.md" ]] && continue
  title="$(first_nonempty_line "$file")"
  require_regex "$(basename "$file")" '^[a-z0-9-]+\.md$' "$file filename matches memory convention"
  require_regex "$title" '^# .+' "$file starts with a level-1 title"

  case "$(basename "$file")" in
    user-preferences.md)
      require_heading "$file" '## Client overview'
      require_heading "$file" '## Site defaults'
      require_heading "$file" '## Form standards'
      require_heading "$file" '## SEO priorities'
      require_heading "$file" '## QA and compliance'
      require_heading "$file" '## Notes'
      ;;
    todos.md)
      require_heading "$file" '## Active'
      require_heading "$file" '## Blocked'
      require_heading "$file" '## Follow-ups'
      require_heading "$file" '## Pending decisions'
      require_heading "$file" '## Done'
      require_heading "$file" '## Notes'
      ;;
    project-history.md)
      require_heading "$file" '## Suggested entries'
      ;;
    session-handoff.md)
      require_heading "$file" '## Suggested structure'
      ;;
    *)
      fail "$file has no per-file memory heading test yet"
      ;;
  esac
done

if [[ "$failures" -gt 0 ]]; then
  echo
  echo "Folder schema validation failed with $failures issue(s)."
  exit 1
fi

echo
echo "Folder schema validation passed."
