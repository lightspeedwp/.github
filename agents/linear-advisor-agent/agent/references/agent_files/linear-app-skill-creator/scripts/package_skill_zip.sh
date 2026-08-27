#!/usr/bin/env bash
set -eu

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: package_skill_zip.sh <skill-directory> [output-directory]" >&2
  exit 2
fi

skill_dir=$(cd "$1" && pwd)
out_dir=${2:-$(pwd)}
mkdir -p "$out_dir"
out_file="$out_dir/skill.zip"

script_dir=$(cd "$(dirname "$0")" && pwd)
"$script_dir/quick_check_skill.sh" "$skill_dir"

parent=$(dirname "$skill_dir")
folder=$(basename "$skill_dir")
rm -f "$out_file"

(
  cd "$parent"
  zip -qr "$out_file" "$folder" \
    -x '*/__MACOSX/*' \
    -x '*/.DS_Store' \
    -x '*/__pycache__/*' \
    -x '*.pyc' \
    -x '*/node_modules/*' \
    -x "$folder/evals/*" \
    -x '*/Icon' \
    -x '*/Icon?'
)

bytes=$(wc -c < "$out_file" | tr -d ' ')
limit=15728640
if [ "$bytes" -gt "$limit" ]; then
  echo "WARNING: skill.zip exceeds 15 MB ($bytes bytes)" >&2
fi

echo "OK: packaged $out_file ($bytes bytes)"
