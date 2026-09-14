#!/usr/bin/env bats

setup() {
  REPO_ROOT="$(cd "$BATS_TEST_DIRNAME/../.." && pwd)"
  SCRIPT="$REPO_ROOT/.github/projects/active/prd-combined-agent/bulk-label-issues.sh"
  LABELING_PLAN="$REPO_ROOT/.github/projects/active/prd-combined-agent/ISSUE_LABELING_PLAN.md"
  MOCK_BIN="$BATS_TEST_TMPDIR/bin"
  GH_CALL_LOG="$BATS_TEST_TMPDIR/gh-calls.log"
  SLEEP_CALL_LOG="$BATS_TEST_TMPDIR/sleep-calls.log"

  mkdir -p "$MOCK_BIN"
  : > "$GH_CALL_LOG"
  : > "$SLEEP_CALL_LOG"

  cat > "$MOCK_BIN/gh" <<'EOF_GH'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$GH_CALL_LOG"

if [[ "${3:-}" == "${MOCK_GH_FAIL_ISSUE:-}" ]]; then
  exit 1
fi
EOF_GH

  cat > "$MOCK_BIN/sleep" <<'EOF_SLEEP'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$SLEEP_CALL_LOG"
EOF_SLEEP

  chmod +x "$MOCK_BIN/gh" "$MOCK_BIN/sleep"
}

run_bulk_labeler() {
  run env \
    PATH="$MOCK_BIN:$PATH" \
    GH_CALL_LOG="$GH_CALL_LOG" \
    SLEEP_CALL_LOG="$SLEEP_CALL_LOG" \
    MOCK_GH_FAIL_ISSUE="${MOCK_GH_FAIL_ISSUE:-}" \
    bash "$SCRIPT" "$@"
}

plan_label_rows() {
  awk -F '|' '
    function trim(value) {
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
      return value
    }
    $2 ~ /^[[:space:]]*[0-9]+[[:space:]]*$/ {
      issue = trim($2)
      labels = trim($7)
      gsub(/, /, ",", labels)
      print issue "|" labels
    }
  ' "$LABELING_PLAN"
}

script_label_rows() {
  sed -nE 's/^  \[([0-9]+)\]="([^"]+)"$/\1|\2/p' "$SCRIPT"
}

@test "the executable matrix exactly matches every row in the labeling plan" {
  mapfile -t planned_rows < <(plan_label_rows)
  mapfile -t script_rows < <(script_label_rows)

  [ "${#planned_rows[@]}" -eq 80 ]
  [ "${#script_rows[@]}" -eq 80 ]
  [ "${script_rows[*]}" = "${planned_rows[*]}" ]
}

@test "dry-run previews every issue in numeric order without calling GitHub" {
  run_bulk_labeler --dry-run --batch 100

  [ "$status" -eq 0 ]
  [ "$(printf '%s\n' "$output" | grep -c '^\[DRY-RUN\]')" -eq 80 ]
  [ ! -s "$GH_CALL_LOG" ]
  [[ "$output" == *"[DRY-RUN] Issue #3134: add-label spec:001,task:T001,type:task,status:completed,priority:high,area:governance"* ]]
  [[ "$output" == *"[DRY-RUN] Issue #3217: add-label spec:001,task:T080,type:docs,status:blocked,priority:low,area:docs"* ]]
  [[ "$output" == *"Total Issues: 80"* ]]
  [[ "$output" == *"Successful: 80"* ]]
}

@test "live mode sends every mapped label set to the intended repository" {
  run_bulk_labeler --batch 100

  [ "$status" -eq 0 ]
  mapfile -t calls < "$GH_CALL_LOG"
  [ "${#calls[@]}" -eq 80 ]
  [ "${calls[0]}" = "issue edit 3134 --add-label spec:001,task:T001,type:task,status:completed,priority:high,area:governance --repo lightspeedwp/.github" ]
  [ "${calls[79]}" = "issue edit 3217 --add-label spec:001,task:T080,type:docs,status:blocked,priority:low,area:docs --repo lightspeedwp/.github" ]
  [[ "$output" == *"Successful: 80"* ]]
  [[ "$output" == *"Failed: 0"* ]]
  [[ "$output" == *"All issues labeled successfully!"* ]]
}

@test "a failed GitHub update is counted while later issues continue processing" {
  MOCK_GH_FAIL_ISSUE=3135
  run_bulk_labeler --batch 100

  [ "$status" -eq 1 ]
  [ "$(wc -l < "$GH_CALL_LOG")" -eq 80 ]
  [[ "$output" == *"Issue #3135: ❌ failed"* ]]
  [[ "$output" == *"Successful: 79"* ]]
  [[ "$output" == *"Failed: 1"* ]]
  [[ "$output" == *"1 issues failed to label"* ]]
}

@test "batch boundaries report progress and apply the configured delay" {
  run_bulk_labeler --dry-run --batch 40

  [ "$status" -eq 0 ]
  [[ "$output" == *"Processed 40 issues (Success: 40, Failed: 0)"* ]]
  [[ "$output" == *"Processed 80 issues (Success: 80, Failed: 0)"* ]]
  mapfile -t sleeps < "$SLEEP_CALL_LOG"
  [ "${#sleeps[@]}" -eq 2 ]
  [ "${sleeps[0]}" = "0.5" ]
  [ "${sleeps[1]}" = "0.5" ]
}

@test "unknown options fail before any GitHub update" {
  run_bulk_labeler --unsupported

  [ "$status" -eq 1 ]
  [[ "$output" == *"Unknown option: --unsupported"* ]]
  [ ! -s "$GH_CALL_LOG" ]
}

@test "a missing batch size fails before issue processing" {
  run_bulk_labeler --batch

  [ "$status" -ne 0 ]
  [[ "$output" != *"Processing 80 issues"* ]]
  [ ! -s "$GH_CALL_LOG" ]
}

@test "non-positive and non-numeric batch sizes are rejected before processing" {
  for invalid_size in 0 -1 not-a-number; do
    run_bulk_labeler --dry-run --batch "$invalid_size"

    [ "$status" -ne 0 ]
    [[ "$output" != *"[DRY-RUN] Issue #3134"* ]]
    [ ! -s "$GH_CALL_LOG" ]
  done
}
