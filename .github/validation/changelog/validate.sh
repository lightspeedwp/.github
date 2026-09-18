#!/bin/bash

# Changelog Validation Wrapper Script
# Framework: Keep a Changelog 1.1.0
# Usage: ./validate.sh [--changelog-path PATH] [--trigger TRIGGER] [--pr-number NUMBER]

set -euo pipefail

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Defaults
CHANGELOG_PATH="CHANGELOG.md"
TRIGGER="manual"
PR_NUMBER=""
BRANCH=""
GITHUB_TOKEN=""
OUTPUT_FORMAT="text"
VERBOSE="false"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --changelog-path)
      CHANGELOG_PATH="$2"
      shift 2
      ;;
    --trigger)
      TRIGGER="$2"
      shift 2
      ;;
    --pr-number)
      PR_NUMBER="$2"
      shift 2
      ;;
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    --github-token)
      GITHUB_TOKEN="$2"
      shift 2
      ;;
    --output)
      OUTPUT_FORMAT="$2"
      shift 2
      ;;
    --verbose)
      VERBOSE="true"
      shift
      ;;
    --help)
      print_usage
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      print_usage
      exit 1
      ;;
  esac
done

print_usage() {
  cat << EOF
Usage: ./validate.sh [OPTIONS]

Options:
  --changelog-path PATH     Path to CHANGELOG.md (default: CHANGELOG.md)
  --trigger TRIGGER         Trigger type: manual, pr_submission, scheduled_audit (default: manual)
  --pr-number NUMBER        GitHub PR number (for pr_submission trigger)
  --branch BRANCH           Git branch name
  --github-token TOKEN      GitHub API token (for link validation)
  --output FORMAT           Output format: text, json (default: text)
  --verbose                 Enable verbose output
  --help                    Show this help message

Examples:
  ./validate.sh
  ./validate.sh --changelog-path CHANGELOG.md --output json
  ./validate.sh --trigger pr_submission --pr-number 3350 --github-token \${{ secrets.GITHUB_TOKEN }}
EOF
}

# Validate changelog file exists
if [ ! -f "$CHANGELOG_PATH" ]; then
  if [ "$OUTPUT_FORMAT" = "json" ]; then
    echo "{\"error\": \"CHANGELOG.md not found at $CHANGELOG_PATH\", \"exit_code\": 1}"
  else
    echo -e "${RED}✗ CHANGELOG.md not found at $CHANGELOG_PATH${NC}"
  fi
  exit 1
fi

# Validate [Unreleased] section exists
if ! grep -q "^\## \[Unreleased\]" "$CHANGELOG_PATH"; then
  if [ "$OUTPUT_FORMAT" = "json" ]; then
    echo "{\"error\": \"[Unreleased] section not found in CHANGELOG.md\", \"exit_code\": 1}"
  else
    echo -e "${RED}✗ [Unreleased] section not found in CHANGELOG.md${NC}"
  fi
  exit 1
fi

# Call Node.js validation engine
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ "$VERBOSE" = "true" ]; then
  echo -e "${BLUE}Calling Node.js validation engine...${NC}"
  echo "  Changelog: $CHANGELOG_PATH"
  echo "  Trigger: $TRIGGER"
  echo "  Output: $OUTPUT_FORMAT"
fi

# Run validation (create empty bin/validate.js stub for now)
if [ -f "$SCRIPT_DIR/bin/validate.js" ]; then
  node "$SCRIPT_DIR/bin/validate.js" \
    --changelog-path "$CHANGELOG_PATH" \
    --trigger "$TRIGGER" \
    $([ -n "$PR_NUMBER" ] && echo "--pr-number $PR_NUMBER" || true) \
    $([ -n "$BRANCH" ] && echo "--branch $BRANCH" || true) \
    $([ -n "$GITHUB_TOKEN" ] && echo "--github-token $GITHUB_TOKEN" || true) \
    --output "$OUTPUT_FORMAT"
  EXIT_CODE=$?
else
  # Fallback: basic validation until Node.js engine is ready
  if [ "$OUTPUT_FORMAT" = "json" ]; then
    echo '{"summary": {"total_entries": 0, "passed": 0, "failed": 0, "pass_rate": 0}, "ci_gate_result": "warning", "recommendation": "review"}'
  else
    echo -e "${YELLOW}⚠ Validation engine not yet initialized (Phase 2 implementation in progress)${NC}"
  fi
  EXIT_CODE=0
fi

exit $EXIT_CODE
