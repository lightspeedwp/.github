#!/usr/bin/env bash
# Run a Qodo PR-Agent tool for a PR or a diff WITHOUT publishing anything to GitHub,
# and return a normalised JSON result.
#
# Usage:
#   run-qodo-pr-agent.sh <tool> (--pr-url <url> | --diff-file <path>) [--question "<text>"] [--out <dir>]
#
# Result (stdout and <out>/result.json):
#   {"status":"ok|skipped|error","reason":...,"tool":...,"markdown":...,"data":...,"truncated":bool}
# Exit codes: 0 for ok and skipped, 2 for error.
#
# Contract: .github/specs/017-qodo-pr-agent-integration/contracts/skill-interface.md
set -euo pipefail

# Keep in step with .github/workflows/qodo-pr-agent-reusable.yml (a test checks they match).
readonly IMAGE="pragent/pr-agent@sha256:65e5b196e38cecd7df8a71fe29942052e081a0c6645132c2ac874df60b1760c7" # 0.46.0-github_action
readonly PIP_SPEC="pr-agent==0.46.0"
readonly MODEL="anthropic/claude-sonnet-5"
readonly PR_TOOLS=" review improve describe ask generate_labels update_changelog add_docs "
readonly DIFF_TOOLS=" review improve describe ask "

tool="${1:-}"
shift || true
pr_url=""
diff_file=""
question=""
out_dir=""

while [ $# -gt 0 ]; do
  case "$1" in
    --pr-url) pr_url="${2:-}"; shift 2 ;;
    --diff-file) diff_file="${2:-}"; shift 2 ;;
    --question) question="${2:-}"; shift 2 ;;
    --out) out_dir="${2:-}"; shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 64 ;;
  esac
done

out_dir="${out_dir:-$(mktemp -d)}"
mkdir -p "$out_dir"
# Docker bind mounts need an absolute host path; a relative one becomes a named volume.
out_dir="$(cd "$out_dir" && pwd)"
log_file="$out_dir/qodo-pr-agent.log"
: > "$log_file"

# emit <status> <reason|""> [markdown-file] [json-file] [truncated]
# Write and print the result; missing output files or invalid JSON data become null.
# Exit 2 for errors and 0 for successful or skipped runs.
emit() {
  STATUS="$1" REASON="$2" TOOL="$tool" MD_FILE="${3:-}" JSON_FILE="${4:-}" TRUNCATED="${5:-false}" \
    python3 - "$out_dir/result.json" <<'PY'
import json, os, sys

def read(path):
    """Read an existing UTF-8 file, or return None if its path is unavailable."""
    if path and os.path.isfile(path):
        with open(path, encoding="utf-8") as handle:
            return handle.read()
    return None

data = None
raw_json = read(os.environ.get("JSON_FILE"))
if raw_json:
    try:
        data = json.loads(raw_json)
    except ValueError:
        data = None

result = {
    "status": os.environ["STATUS"],
    "reason": os.environ["REASON"] or None,
    "tool": os.environ["TOOL"] or None,
    "markdown": read(os.environ.get("MD_FILE")),
    "data": data,
    "truncated": os.environ.get("TRUNCATED") == "true",
}
with open(sys.argv[1], "w", encoding="utf-8") as handle:
    json.dump(result, handle, indent=2)
print(json.dumps(result, indent=2))
PY
  case "$1" in
    error) exit 2 ;;
    *) exit 0 ;;
  esac
}

# Report invalid usage on stderr and exit with status 64.
usage_error() {
  echo "$1" >&2
  echo "Usage: run-qodo-pr-agent.sh <tool> (--pr-url <url> | --diff-file <path>) [--question \"<text>\"] [--out <dir>]" >&2
  exit 64
}

# --- Validate arguments ------------------------------------------------------
[ -n "$tool" ] || usage_error "Missing <tool>."
if [ -n "$pr_url" ] && [ -n "$diff_file" ]; then usage_error "Use either --pr-url or --diff-file, not both."; fi
if [ -z "$pr_url" ] && [ -z "$diff_file" ]; then usage_error "One of --pr-url or --diff-file is required."; fi
if [ "$tool" = "ask" ] && [ -z "$question" ]; then usage_error "--question is required for ask."; fi

if [ -n "$diff_file" ]; then
  [ -f "$diff_file" ] || usage_error "Diff file not found: $diff_file"
  case "$DIFF_TOOLS" in *" $tool "*) ;; *) emit skipped tool-disabled ;; esac
else
  case "$PR_TOOLS" in *" $tool "*) ;; *) emit skipped tool-disabled ;; esac
fi

# --- Credentials (never printed, never passed on the command line) -----------
# Dedicated key only (FR-002): a shared ANTHROPIC_API_KEY is deliberately ignored.
ANTHROPIC__KEY="${ANTHROPIC_API_KEY_QODO_PR_AGENT:-}"
[ -n "$ANTHROPIC__KEY" ] || emit skipped no-credential
export ANTHROPIC__KEY

if [ -n "$pr_url" ]; then
  [ -n "${GITHUB_TOKEN:-}" ] || emit skipped no-credential
  export GITHUB__USER_TOKEN="$GITHUB_TOKEN"
fi

# --- Build the upstream command ----------------------------------------------
settings=(
  "--config.publish_output=false"
  "--config.verbosity_level=2"
  "--config.propagate_tool_errors=true"
  "--config.response_language=en-GB"
  "--config.model=$MODEL"
)
tool_args=("$tool")
if [ "$tool" = "ask" ]; then tool_args+=("$question"); fi

md_out="$out_dir/out.md"
json_out="$out_dir/out.json"

# Run the pinned container against a PR URL or a read-only mounted diff.
run_docker() {
  local args=(run --rm -e ANTHROPIC__KEY --entrypoint python)
  local target=()
  if [ -n "$pr_url" ]; then
    args+=(-e GITHUB__USER_TOKEN)
    target=(--pr_url "$pr_url")
  else
    local abs_diff
    abs_diff="$(cd "$(dirname "$diff_file")" && pwd)/$(basename "$diff_file")"
    args+=(-v "$abs_diff:/work/input.diff:ro" -v "$out_dir:/work/out")
    target=(--diff-file /work/input.diff --output /work/out/out.md)
    # Upstream accepts --json-output for review only.
    if [ "$tool" = "review" ]; then target+=(--json-output /work/out/out.json); fi
  fi
  docker "${args[@]}" "$IMAGE" -m pr_agent.cli "${target[@]}" "${tool_args[@]}" "${settings[@]}"
}

# Run the pinned pipx CLI against a PR URL or a local diff and output files.
run_pipx() {
  local target=()
  if [ -n "$pr_url" ]; then
    target=(--pr_url "$pr_url")
  else
    target=(--diff-file "$diff_file" --output "$md_out")
    if [ "$tool" = "review" ]; then target+=(--json-output "$json_out"); fi
  fi
  pipx run --spec "$PIP_SPEC" pr-agent "${target[@]}" "${tool_args[@]}" "${settings[@]}"
}

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  runner=run_docker
elif command -v pipx >/dev/null 2>&1 && python3 -c 'import sys; sys.exit(sys.version_info < (3, 12))' 2>/dev/null; then
  runner=run_pipx
else
  emit skipped no-runtime
fi

# --- Run ---------------------------------------------------------------------
set +e
"$runner" > "$out_dir/stdout.txt" 2> "$log_file"
exit_code=$?
set -e

# In PR mode (publishing off) the tool prints its result to stdout.
if [ -n "$pr_url" ] && [ ! -s "$md_out" ]; then
  cp "$out_dir/stdout.txt" "$md_out"
fi

truncated=false
if grep -qiE 'clipped|omitted|other modified files' "$md_out" 2>/dev/null; then truncated=true; fi

if [ "$exit_code" -ne 0 ]; then
  if grep -qiE '429|rate.?limit' "$log_file" "$out_dir/stdout.txt" 2>/dev/null; then
    emit error rate-limited
  fi
  emit error upstream-error
fi

emit ok "" "$md_out" "$json_out" "$truncated"
