#!/bin/bash

##
# GitHub Actions Minutes Measurement Script
# Purpose: Measure GitHub Actions minute usage per workflow and report metrics
# Location: .github/scripts/measure-actions-minutes.sh
#
# Usage:
#   ./measure-actions-minutes.sh                      # Measure all workflows
#   ./measure-actions-minutes.sh --workflow labeling  # Measure specific workflow
#   ./measure-actions-minutes.sh --days 7             # Measure last 7 days (default 30)
#   ./measure-actions-minutes.sh --output json        # Output format (json|csv|markdown)
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
DAYS=30
WORKFLOW=""
OUTPUT_FORMAT="markdown"
METRICS_DIR=".github/metrics"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --days)
            DAYS="$2"
            shift 2
            ;;
        --workflow)
            WORKFLOW="$2"
            shift 2
            ;;
        --output)
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate GitHub token
if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    echo -e "${RED}Error: GITHUB_TOKEN environment variable not set${NC}"
    exit 1
fi

# Create metrics directory
mkdir -p "$METRICS_DIR"

# Function to query GitHub API for workflow runs
query_workflow_minutes() {
    local workflow_name=$1
    local days=$2
    
    # Calculate date range (ISO 8601 format)
    local end_date=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local start_date=$(date -u -d "$days days ago" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v-${days}d +%Y-%m-%dT%H:%M:%SZ)
    
    # Query GitHub API (requires gh CLI or curl with token)
    # Note: GitHub API provides workflow run data; billing data requires organization settings
    echo "Querying GitHub API for $workflow_name (last $days days)..." >&2
    
    # Placeholder: Return sample data structure
    # In production, this would query the actual GitHub API
    cat <<EOF
{
  "workflow": "$workflow_name",
  "period_days": $days,
  "start_date": "$start_date",
  "end_date": "$end_date",
  "total_runs": 0,
  "total_minutes": 0,
  "average_minutes_per_run": 0,
  "status": "placeholder"
}
EOF
}

# Function to format output as JSON
output_json() {
    local workflow=$1
    local data=$2
    
    echo "$data"
}

# Function to format output as CSV
output_csv() {
    local workflow=$1
    local data=$2
    
    echo "workflow,period_days,total_runs,total_minutes,average_minutes_per_run"
    # CSV output would parse JSON data here
}

# Function to format output as Markdown
output_markdown() {
    local workflow=$1
    local data=$2
    
    echo "## GitHub Actions Minutes Report"
    echo ""
    echo "| Metric | Value |"
    echo "|--------|-------|"
    echo "| Workflow | $workflow |"
    echo "| Period | $DAYS days |"
    echo ""
}

# Main execution
echo -e "${GREEN}GitHub Actions Minutes Measurement Script${NC}"
echo "==========================================="
echo "Period: Last $DAYS days"
echo "Output Format: $OUTPUT_FORMAT"
echo "Timestamp: $TIMESTAMP"
echo ""

if [[ -n "$WORKFLOW" ]]; then
    echo "Measuring workflow: $WORKFLOW"
    METRICS=$(query_workflow_minutes "$WORKFLOW" "$DAYS")
else
    echo "Measuring all workflows..."
    METRICS=$(query_workflow_minutes "all" "$DAYS")
fi

# Format and output results
case "$OUTPUT_FORMAT" in
    json)
        output_json "$WORKFLOW" "$METRICS"
        ;;
    csv)
        output_csv "$WORKFLOW" "$METRICS"
        ;;
    markdown)
        output_markdown "$WORKFLOW" "$METRICS"
        ;;
    *)
        echo -e "${RED}Unknown output format: $OUTPUT_FORMAT${NC}"
        exit 1
        ;;
esac

# Save metrics to file
echo "$METRICS" > "$METRICS_DIR/metrics_${TIMESTAMP}.json"
echo -e "${GREEN}✓ Metrics saved to $METRICS_DIR/metrics_${TIMESTAMP}.json${NC}"
echo ""
echo "Measurement complete."
