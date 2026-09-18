#!/usr/bin/env bash
set -euo pipefail

repo_root="${1:-$(pwd)}"
design_file="${DESIGN_MD_FILE:-$repo_root/DESIGN.md}"
report_file="${DESIGN_MD_REPORT:-$repo_root/design-md-validation-report.md}"
json_file="${DESIGN_MD_JSON_REPORT:-$repo_root/designmd-lint.json}"
comment_file="${DESIGN_MD_PR_COMMENT:-$repo_root/design-md-pr-comment.md}"
script_dir="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"

if [ ! -f "$design_file" ]; then
  echo "DESIGN.md not found at $design_file" >&2
  exit 1
fi

echo "Validating $design_file"
"$script_dir/validate-design-md.sh" "$design_file" "$report_file"

run_lint_with_available_cli() {
  if command -v designmd >/dev/null 2>&1; then
    designmd lint "$design_file" --format json >"$json_file"
    return
  fi

  if command -v design.md >/dev/null 2>&1; then
    design.md lint "$design_file" --format json >"$json_file"
    return
  fi

  if [ -d "$repo_root/design.md-main/packages/cli" ] && command -v bun >/dev/null 2>&1; then
    (cd "$repo_root/design.md-main/packages/cli" && bun run src/index.ts lint "$design_file" --format json >"$json_file")
    return
  fi

  if command -v npx >/dev/null 2>&1; then
    npx --yes @google/design.md lint "$design_file" --format json >"$json_file"
    return
  fi

  return 1
}

if ! run_lint_with_available_cli; then
  echo "No runnable DESIGN.md CLI was found after validation. Report written to $report_file" >&2
  exit 0
fi

errors=0
warnings=0
infos=0

if command -v jq >/dev/null 2>&1; then
  errors="$(jq -r '.summary.errors // 0' "$json_file")"
  warnings="$(jq -r '.summary.warnings // 0' "$json_file")"
  infos="$(jq -r '.summary.infos // 0' "$json_file")"
  echo "DESIGN.md summary: errors=$errors warnings=$warnings infos=$infos"
fi

node - "$json_file" "$comment_file" <<'EOF'
const fs = require('fs');

const jsonPath = process.argv[2];
const commentPath = process.argv[3];
const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const findings = Array.isArray(report.findings) ? report.findings : [];
const summary = report.summary || {};
const errors = Number(summary.errors || 0);
const warnings = Number(summary.warnings || 0);
const infos = Number(summary.infos || 0);

const topFindings = findings.slice(0, 10).map((finding) => {
  const severity = String(finding.severity || 'info').toUpperCase();
  const path = finding.path ? ` \`${finding.path}\`` : '';
  return `- **${severity}**${path}: ${finding.message}`;
});

const body = [
  '<!-- design-md-lint-comment -->',
  '## DESIGN.md Lint Summary',
  '',
  `- Errors: ${errors}`,
  `- Warnings: ${warnings}`,
  `- Infos: ${infos}`,
  '',
  findings.length > 0 ? '### Top findings' : '### Top findings',
  '',
  ...(topFindings.length > 0 ? topFindings : ['- No findings reported by the CLI.']),
  '',
  `Full report file: \`design-md-validation-report.md\``,
].join('\n');

fs.writeFileSync(commentPath, body);
EOF

if [ "$errors" -gt 0 ]; then
  echo "DESIGN.md lint failed with $errors error(s)." >&2
  exit 1
fi

echo "DESIGN.md validation completed. Report: $report_file"
