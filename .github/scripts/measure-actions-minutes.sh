#!/usr/bin/env bash

# GitHub Actions Minutes Measurement Script
# Measures total GitHub Actions minutes consumed by workflows over a 30-day period
# Usage: ./measure-actions-minutes.sh [options]
# Options:
#   --days N       Measure over N days (default: 30)
#   --workflow W   Measure specific workflow (pattern match)
#   --output FILE  Write results to FILE (default: stdout)
#   --json         Output in JSON format

set -e

DAYS=30
WORKFLOW_PATTERN=""
OUTPUT_FILE=""
JSON_OUTPUT=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --days)
            DAYS="$2"
            shift 2
            ;;
        --workflow)
            WORKFLOW_PATTERN="$2"
            shift 2
            ;;
        --output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Requires: gh CLI authenticated with repo access
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) not found. Install from https://cli.github.com"
    exit 1
fi

# Get repository info
REPO_ROOT=$(git rev-parse --show-toplevel)
REPO=$(cd "$REPO_ROOT" && git remote get-url origin | sed 's/.*://; s/\.git$//')

echo "Measuring GitHub Actions minutes for $REPO over last $DAYS days..." >&2

# Query workflow runs using GitHub API
# Note: This requires authentication and may be rate-limited for large result sets
# API returns billing_info with minutes used per run
TOTAL_MINUTES=0
RUN_COUNT=0

# Build list of workflows to measure
if [[ -n "$WORKFLOW_PATTERN" ]]; then
    WORKFLOWS=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | grep "$WORKFLOW_PATTERN")
else
    WORKFLOWS=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | grep -v archived)
fi

for workflow in $WORKFLOWS; do
    WORKFLOW_NAME=$(basename "$workflow")
    # Using gh CLI to query workflow runs (requires authentication)
    # This is a simplified measurement - actual GitHub API returns detailed billing info
    # For production, integrate with GitHub's actual billing/metrics API
    echo "  - $WORKFLOW_NAME: (measurement pending API integration)" >&2
done

# Output results
OUTPUT=$(cat <<EOF
Measurement Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Measurement Period: Last $DAYS days
Repository: $REPO

Total Minutes: $TOTAL_MINUTES
Total Runs: $RUN_COUNT
Average per Run: $((TOTAL_MINUTES / RUN_COUNT))

Status: Pending full GitHub API integration for actual billing data

Note: This script provides the measurement framework. Full implementation requires:
  1. GitHub GraphQL API authentication (personal access token or app)
  2. Query WorkflowRun.billingInfo for accurate minute measurement
  3. Filter by createdAt timestamp within $DAYS days
  4. Aggregate by workflow type (labeling, validation, testing, etc.)
EOF
)

if [[ -n "$OUTPUT_FILE" ]]; then
    echo "$OUTPUT" > "$OUTPUT_FILE"
    echo "Results written to $OUTPUT_FILE" >&2
else
    echo "$OUTPUT"
fi

exit 0
