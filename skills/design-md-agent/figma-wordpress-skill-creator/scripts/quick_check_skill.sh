#!/usr/bin/env bash
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: quick_check_skill.sh <skill-directory>" >&2
  exit 2
fi

skill_dir="$1"
skill_md="$skill_dir/SKILL.md"
agent_yaml="$skill_dir/agents/openai.yaml"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

[ -d "$skill_dir" ] || fail "skill directory not found"
[ -f "$skill_md" ] || fail "SKILL.md not found"
[ -f "$agent_yaml" ] || fail "agents/openai.yaml not found"

first_line=$(sed -n '1p' "$skill_md")
[ "$first_line" = "---" ] || fail "SKILL.md must start with YAML frontmatter"

grep -q '^name: [a-z0-9][a-z0-9-]*$' "$skill_md" || fail "frontmatter name must be lowercase hyphen-case"
grep -q '^description: ' "$skill_md" || fail "frontmatter description missing"

name=$(grep '^name: ' "$skill_md" | head -n 1 | sed 's/^name: //')
folder_name=$(basename "$skill_dir")
[ "$name" = "$folder_name" ] || fail "frontmatter name must match folder name"

if find "$skill_dir" \( -name '__MACOSX' -o -name '.DS_Store' -o -name '*.pyc' -o -name '__pycache__' -o -name 'node_modules' \) | grep -q .; then
  fail "package noise found"
fi

if grep -R "TODO\|placeholder\|Replace with" "$skill_dir" >/tmp/skill_check_hits.txt 2>/dev/null; then
  echo "WARNING: possible placeholder text found:" >&2
  sed -n '1,20p' /tmp/skill_check_hits.txt >&2
fi

echo "OK: basic skill checks passed"
