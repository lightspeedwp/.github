#!/bin/bash

# Bulk Label GitHub Issues for PRD Agent Consolidation
# Script: Applies type:, status:, priority:, area:, spec:001, and task:<ID> labels
# Source: ISSUE_LABELING_PLAN.md matrix
# Usage: ./bulk-label-issues.sh [--dry-run] [--batch N]

set -e

REPO="lightspeedwp/.github"
DRY_RUN=false
BATCH_SIZE=10
DELAY=0.5  # Seconds between API calls (respect rate limits)

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --batch)
      if [[ $# -lt 2 || -z "${2:-}" ]]; then
        echo "Option error: --batch requires a positive integer argument." >&2
        exit 2
      fi
      if [[ ! "$2" =~ ^[0-9]+$ || "$2" =~ ^0+$ ]]; then
        echo "Option error: --batch must be a positive integer; received '$2'." >&2
        exit 2
      fi
      BATCH_SIZE=$((10#$2))
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo "=================================================="
echo "GitHub Issue Bulk Labeler"
echo "Repository: $REPO"
echo "Dry Run: $DRY_RUN"
echo "Batch Size: $BATCH_SIZE"
echo "=================================================="
echo ""

# Define labeling matrix (extracted from ISSUE_LABELING_PLAN.md)
# Format: ISSUE_NUMBER | LABELS (comma-separated)
declare -A ISSUES=(
  [3134]="spec:001,task:T001,type:task,status:completed,priority:high,area:governance"
  [3135]="spec:001,task:T002,type:decision,status:completed,priority:high,area:governance"
  [3136]="spec:001,task:T003,type:decision,status:completed,priority:high,area:governance"
  [3137]="spec:001,task:T004,type:decision,status:completed,priority:high,area:governance"
  [3139]="spec:001,task:T005,type:task,status:completed,priority:critical,area:agents"
  [3140]="spec:001,task:T006,type:task,status:completed,priority:critical,area:agents"
  [3141]="spec:001,task:T007,type:task,status:completed,priority:critical,area:agents"
  [3142]="spec:001,task:T008,type:task,status:completed,priority:critical,area:agents"
  [3143]="spec:001,task:T009,type:task,status:completed,priority:critical,area:agents"
  [3144]="spec:001,task:T010,type:task,status:completed,priority:critical,area:agents"
  [3145]="spec:001,task:T011,type:task,status:completed,priority:critical,area:agents"
  [3146]="spec:001,task:T012,type:task,status:completed,priority:critical,area:agents"
  [3147]="spec:001,task:T013,type:task,status:completed,priority:critical,area:agents"
  [3148]="spec:001,task:T014,type:task,status:completed,priority:critical,area:agents"
  [3149]="spec:001,task:T015,type:task,status:completed,priority:critical,area:agents"
  [3150]="spec:001,task:T016,type:task,status:completed,priority:critical,area:agents"
  [3151]="spec:001,task:T017,type:task,status:completed,priority:critical,area:agents"
  [3152]="spec:001,task:T018,type:task,status:completed,priority:critical,area:agents"
  [3153]="spec:001,task:T019,type:task,status:completed,priority:critical,area:agents"
  [3154]="spec:001,task:T020,type:task,status:completed,priority:critical,area:agents"
  [3155]="spec:001,task:T021,type:task,status:completed,priority:critical,area:agents"
  [3156]="spec:001,task:T022,type:task,status:completed,priority:critical,area:agents"
  [3157]="spec:001,task:T023,type:task,status:completed,priority:critical,area:agents"
  [3158]="spec:001,task:T024,type:task,status:completed,priority:critical,area:agents"
  [3159]="spec:001,task:T025,type:task,status:completed,priority:critical,area:agents"
  [3160]="spec:001,task:T026,type:task,status:completed,priority:critical,area:agents"
  [3161]="spec:001,task:T027,type:task,status:completed,priority:critical,area:agents"
  [3162]="spec:001,task:T028,type:task,status:completed,priority:critical,area:agents"
  [3163]="spec:001,task:T029,type:task,status:completed,priority:critical,area:agents"
  [3164]="spec:001,task:T030,type:task,status:completed,priority:critical,area:agents"
  [3165]="spec:001,task:T031,type:task,status:completed,priority:critical,area:agents"
  [3166]="spec:001,task:T032,type:task,status:completed,priority:critical,area:agents"
  [3167]="spec:001,task:T033,type:task,status:completed,priority:critical,area:agents"
  [3168]="spec:001,task:T034,type:task,status:completed,priority:critical,area:agents"
  [3169]="spec:001,task:T035,type:task,status:completed,priority:critical,area:agents"
  [3170]="spec:001,task:T036,type:task,status:completed,priority:critical,area:agents"
  [3171]="spec:001,task:T037,type:task,status:completed,priority:critical,area:agents"
  [3172]="spec:001,task:T038,type:task,status:completed,priority:critical,area:agents"
  [3173]="spec:001,task:T039,type:task,status:completed,priority:normal,area:agents"
  [3174]="spec:001,task:T040,type:task,status:completed,priority:normal,area:agents"
  [3175]="spec:001,task:T041,type:task,status:completed,priority:normal,area:agents"
  [3176]="spec:001,task:T042,type:task,status:completed,priority:critical,area:agents"
  [3177]="spec:001,task:T043,type:task,status:completed,priority:critical,area:agents"
  [3178]="spec:001,task:T044,type:task,status:completed,priority:critical,area:agents"
  [3179]="spec:001,task:T045,type:task,status:completed,priority:critical,area:agents"
  [3180]="spec:001,task:T046,type:task,status:completed,priority:critical,area:agents"
  [3181]="spec:001,task:T047,type:task,status:completed,priority:normal,area:agents"
  [3182]="spec:001,task:T048,type:task,status:completed,priority:normal,area:docs"
  [3183]="spec:001,task:T049,type:task,status:completed,priority:high,area:docs"
  [3184]="spec:001,task:T050,type:docs,status:completed,priority:high,area:docs"
  [3185]="spec:001,task:T051,type:docs,status:completed,priority:high,area:docs"
  [3186]="spec:001,task:T052,type:docs,status:completed,priority:normal,area:docs"
  [3187]="spec:001,task:T053,type:task,status:completed,priority:normal,area:docs"
  [3188]="spec:001,task:T054,type:test,status:completed,priority:normal,area:qa"
  [3189]="spec:001,task:T055,type:test,status:completed,priority:normal,area:qa"
  [3190]="spec:001,task:T056,type:docs,status:completed,priority:normal,area:docs"
  [3191]="spec:001,task:T057,type:test,status:completed,priority:critical,area:qa"
  [3192]="spec:001,task:T058,type:docs,status:completed,priority:normal,area:docs"
  [3196]="spec:001,task:T059,type:task,status:completed,priority:critical,area:agents"
  [3197]="spec:001,task:T060,type:task,status:completed,priority:critical,area:agents"
  [3198]="spec:001,task:T061,type:task,status:completed,priority:critical,area:agents"
  [3199]="spec:001,task:T062,type:test,status:completed,priority:critical,area:qa"
  [3200]="spec:001,task:T063,type:docs,status:completed,priority:high,area:docs"
  [3201]="spec:001,task:T064,type:test,status:completed,priority:critical,area:qa"
  [3202]="spec:001,task:T065,type:test,status:completed,priority:critical,area:qa"
  [3203]="spec:001,task:T066,type:test,status:completed,priority:critical,area:qa"
  [3204]="spec:001,task:T067,type:docs,status:completed,priority:critical,area:docs"
  [3205]="spec:001,task:T068,type:test,status:completed,priority:high,area:qa"
  [3206]="spec:001,task:T069,type:docs,status:completed,priority:high,area:docs"
  [3207]="spec:001,task:T070,type:task,status:completed,priority:critical,area:operations"
  [3208]="spec:001,task:T071,type:task,status:in-progress,priority:critical,area:operations"
  [3209]="spec:001,task:T072,type:task,status:completed,priority:critical,area:operations"
  [3210]="spec:001,task:T073,type:task,status:in-progress,priority:critical,area:operations"
  [3211]="spec:001,task:T074,type:docs,status:completed,priority:critical,area:docs"
  [3212]="spec:001,task:T075,type:docs,status:in-progress,priority:critical,area:docs"
  [3213]="spec:001,task:T076,type:decision,status:blocked,priority:low,area:governance"
  [3214]="spec:001,task:T077,type:decision,status:blocked,priority:low,area:governance"
  [3215]="spec:001,task:T078,type:task,status:blocked,priority:low,area:governance"
  [3216]="spec:001,task:T079,type:task,status:blocked,priority:low,area:governance"
  [3217]="spec:001,task:T080,type:docs,status:blocked,priority:low,area:docs"
)

SUCCESS=0
FAILED=0
SKIPPED=0
BATCH_COUNT=0

echo "Processing ${#ISSUES[@]} issues in batches of $BATCH_SIZE..."
echo ""

for ISSUE in $(echo "${!ISSUES[@]}" | tr ' ' '\n' | sort -n); do
  LABELS="${ISSUES[$ISSUE]}"
  BATCH_COUNT=$((BATCH_COUNT + 1))

  if [ "$DRY_RUN" = true ]; then
    echo "[DRY-RUN] Issue #$ISSUE: add-label $LABELS"
    ((++SUCCESS))
  else
    echo -n "Issue #$ISSUE: "
    if gh issue edit "$ISSUE" \
      --add-label "$LABELS" \
      --repo "$REPO" 2>/dev/null; then
      echo "✅ labeled"
      ((++SUCCESS))
    else
      echo "❌ failed"
      ((++FAILED))
    fi
  fi

  # Batch progress & rate limiting
  if [ $((BATCH_COUNT % BATCH_SIZE)) -eq 0 ]; then
    echo "  → Processed $BATCH_COUNT issues (Success: $SUCCESS, Failed: $FAILED)"
    sleep "$DELAY"
  fi
done

echo ""
echo "=================================================="
echo "Summary:"
echo "  Total Issues: ${#ISSUES[@]}"
echo "  ✅ Successful: $SUCCESS"
echo "  ❌ Failed: $FAILED"
echo "  ⏭️  Skipped: $SKIPPED"
echo "=================================================="

if [ $FAILED -eq 0 ]; then
  echo "✅ All issues labeled successfully!"
  exit 0
else
  echo "⚠️  $FAILED issues failed to label. Check GitHub CLI authentication."
  exit 1
fi
