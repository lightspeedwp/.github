#!/usr/bin/env bash
set -eu

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: validate-design-md.sh <design-md-path> [report-path]" >&2
  exit 2
fi

design_md="$1"
report_path="${2:-}"

if [ ! -f "$design_md" ]; then
  echo "ERROR: DESIGN.md not found: $design_md" >&2
  exit 1
fi

tmp_report="$(mktemp)"
tmp_spec="$(mktemp)"
tmp_lint="$(mktemp)"
tmp_extract_dir=""
cleanup() {
  rm -f "$tmp_report" "$tmp_spec" "$tmp_lint"
  if [ -n "$tmp_extract_dir" ] && [ -d "$tmp_extract_dir" ]; then
    rm -rf "$tmp_extract_dir"
  fi
}
trap cleanup EXIT

script_dir="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
design_dir="$(CDPATH= cd -- "$(dirname "$design_md")" && pwd)"

is_designmd_cli_repo() {
  candidate="$1"
  [ -d "$candidate" ] || return 1
  [ -f "$candidate/package.json" ] || return 1
  [ -f "$candidate/src/index.ts" ] || return 1
  grep -q '"name":[[:space:]]*"@google/design.md"' "$candidate/package.json"
}

find_designmd_repo_dir() {
  if [ -n "${DESIGNMD_REPO_PATH:-}" ] && is_designmd_cli_repo "${DESIGNMD_REPO_PATH}"; then
    printf '%s\n' "${DESIGNMD_REPO_PATH}"
    return
  fi

  for candidate in \
    "$design_dir/design.md-main/packages/cli" \
    "$design_dir/packages/cli" \
    "$PWD/design.md-main/packages/cli" \
    "$PWD/packages/cli" \
    "$script_dir/../../design.md-main/packages/cli" \
    "$script_dir/../../tmp/designmd-repo/design.md-main/packages/cli" \
    "$script_dir/../../../tmp/designmd-repo/design.md-main/packages/cli" \
    "/workspace/design.md-main/packages/cli" \
    "/workspace/tmp/designmd-repo/design.md-main/packages/cli"
  do
    if is_designmd_cli_repo "$candidate"; then
      printf '%s\n' "$candidate"
      return
    fi
  done

  if command -v unzip >/dev/null 2>&1 && command -v find >/dev/null 2>&1; then
    for search_root in "$design_dir" "$PWD" "/workspace" "/workspace/user_files"; do
      [ -d "$search_root" ] || continue
      zip_path="$(find "$search_root" -maxdepth 3 -type f \( -iname '*design.md*.zip' -o -iname '*design-md*.zip' \) | head -n 1 || true)"
      if [ -n "$zip_path" ]; then
        tmp_extract_dir="$(mktemp -d)"
        if unzip -q -o "$zip_path" -d "$tmp_extract_dir" >/dev/null 2>&1; then
          repo_dir="$(find "$tmp_extract_dir" -type d -path '*/packages/cli' | head -n 1 || true)"
          if [ -n "$repo_dir" ] && is_designmd_cli_repo "$repo_dir"; then
            printf '%s\n' "$repo_dir"
            return
          fi
        fi
      fi
    done
  fi
}

cli_cmd=""
cli_cwd="."
repo_dir="$(find_designmd_repo_dir || true)"

if [ -n "${DESIGNMD_CLI_CMD:-}" ]; then
  cli_cmd="${DESIGNMD_CLI_CMD}"
elif command -v designmd >/dev/null 2>&1; then
  cli_cmd="designmd"
elif command -v design.md >/dev/null 2>&1; then
  cli_cmd="design.md"
else
  if [ -n "$repo_dir" ] && command -v bun >/dev/null 2>&1; then
    cli_cmd="bun run src/index.ts"
    cli_cwd="$repo_dir"
  elif command -v npx >/dev/null 2>&1; then
    cli_cmd="npx --yes @google/design.md"
  fi
fi

cli_source="not available"
if [ "$cli_cmd" = "designmd" ] || [ "$cli_cmd" = "design.md" ]; then
  cli_source="installed command"
elif [ "$cli_cmd" = "bun run src/index.ts" ]; then
  cli_source="local repo"
elif [ "$cli_cmd" = "npx --yes @google/design.md" ]; then
  cli_source="npx package"
fi

echo "# DESIGN.md Validation Report" > "$tmp_report"
echo >> "$tmp_report"
echo "## Summary" >> "$tmp_report"
echo "- File: \`$design_md\`" >> "$tmp_report"
echo "- Validation date (UTC): $(date -u '+%Y-%m-%d %H:%M:%S')" >> "$tmp_report"
if [ -n "$cli_cmd" ]; then
  echo "- CLI command: \`$cli_cmd\`" >> "$tmp_report"
  echo "- CLI working directory: \`$cli_cwd\`" >> "$tmp_report"
  echo "- CLI source: $cli_source" >> "$tmp_report"
else
  echo "- CLI command: not available" >> "$tmp_report"
fi
if [ -n "$repo_dir" ]; then
  echo "- Local DESIGN.md repo detected: \`$repo_dir\`" >> "$tmp_report"
  if ! command -v bun >/dev/null 2>&1; then
    echo "- Local repo execution note: repo found, but \`bun\` is not installed, so source execution is unavailable in this environment." >> "$tmp_report"
  fi
fi
echo >> "$tmp_report"
echo "## Automated checks" >> "$tmp_report"

spec_status="not run"
lint_status="not run"

if [ -n "$cli_cmd" ]; then
  if (cd "$cli_cwd" && sh -lc "$cli_cmd spec --rules --format json" >"$tmp_spec" 2>&1); then
    spec_status="pass"
    echo "### Spec check" >> "$tmp_report"
    echo "- Result: pass" >> "$tmp_report"
  else
    spec_status="fail"
    echo "### Spec check" >> "$tmp_report"
    echo "- Result: fail" >> "$tmp_report"
    echo '```text' >> "$tmp_report"
    sed -n '1,80p' "$tmp_spec" >> "$tmp_report"
    echo '```' >> "$tmp_report"
  fi

  if (cd "$cli_cwd" && sh -lc "$cli_cmd lint \"$design_md\" --format json" >"$tmp_lint" 2>&1); then
    lint_status="pass"
  else
    lint_status="fail"
  fi

  echo >> "$tmp_report"
  echo "### Lint check" >> "$tmp_report"
  echo "- Result: $lint_status" >> "$tmp_report"

  if command -v jq >/dev/null 2>&1 && jq empty "$tmp_lint" >/dev/null 2>&1; then
    errors="$(jq -r '.summary.errors // 0' "$tmp_lint")"
    warnings="$(jq -r '.summary.warnings // 0' "$tmp_lint")"
    infos="$(jq -r '.summary.infos // 0' "$tmp_lint")"
    echo "- Summary: errors=$errors warnings=$warnings infos=$infos" >> "$tmp_report"
    echo "- Findings excerpt:" >> "$tmp_report"
    echo '```json' >> "$tmp_report"
    jq '.findings[:10]' "$tmp_lint" >> "$tmp_report"
    echo '```' >> "$tmp_report"
  else
    echo '```text' >> "$tmp_report"
    sed -n '1,120p' "$tmp_lint" >> "$tmp_report"
    echo '```' >> "$tmp_report"
  fi
else
  echo "- No supported DESIGN.md CLI command was found. Skipped \`spec\` and \`lint\` checks." >> "$tmp_report"
fi

echo >> "$tmp_report"
echo "## Manual checks" >> "$tmp_report"

if grep -q '^---$' "$design_md"; then
  echo "- Front matter delimiter present: yes" >> "$tmp_report"
else
  echo "- Front matter delimiter present: no" >> "$tmp_report"
fi

check_heading() {
  label="$1"
  pattern="$2"
  if grep -Eq "$pattern" "$design_md"; then
    echo "- Heading present: $label" >> "$tmp_report"
  else
    echo "- Heading missing: $label" >> "$tmp_report"
  fi
}

check_heading 'Overview or Brand & Style' '^## (Overview|Brand & Style)$'
check_heading 'Colors' '^## Colors$'
check_heading 'Typography' '^## Typography$'
check_heading 'Layout or Layout & Spacing' '^## (Layout|Layout & Spacing)$'
check_heading 'Elevation & Depth or Elevation' '^## (Elevation & Depth|Elevation)$'
check_heading 'Shapes' '^## Shapes$'
check_heading 'Components' '^## Components$'
check_heading "Do's and Don'ts" "^## Do's and Don'ts$"

if [ "$(basename "$design_md")" = "DESIGN.md" ]; then
  echo "- File name is DESIGN.md: yes" >> "$tmp_report"
else
  echo "- File name is DESIGN.md: no" >> "$tmp_report"
fi

echo >> "$tmp_report"
echo "## Result" >> "$tmp_report"
echo "- Spec status: $spec_status" >> "$tmp_report"
echo "- Lint status: $lint_status" >> "$tmp_report"

if [ -n "$report_path" ]; then
  mkdir -p "$(dirname "$report_path")"
  cp "$tmp_report" "$report_path"
  echo "Wrote report to $report_path"
else
  cat "$tmp_report"
fi
