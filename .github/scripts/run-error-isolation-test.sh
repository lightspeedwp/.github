#!/bin/bash

##
# Error Isolation Test Runner
# Purpose: Execute T072 - Validate that single workflow failure doesn't cascade
# Location: .github/scripts/run-error-isolation-test.sh
#
# Usage:
#   ./run-error-isolation-test.sh                    # Run all scenarios
#   ./run-error-isolation-test.sh labeling_fails     # Test labeling failure only
#   ./run-error-isolation-test.sh --help             # Show help
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Defaults
TEST_SCENARIO="${1:-all_scenarios}"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
WORKFLOW_FILE=".github/tests/error-isolation-test.yml"

# Help text
show_help() {
    cat <<EOF
Error Isolation Test Runner (T072)

Purpose: Validate that single workflow type failure does not cascade to other workflows

Usage:
  ./run-error-isolation-test.sh [SCENARIO]

Test Scenarios:
  all_scenarios          Run all 5 failure scenarios (recommended)
  labeling_fails         Test labeling-unified.yml failure isolation
  validation_fails       Test validation-unified.yml failure isolation
  testing_fails          Test testing-unified.yml failure isolation
  linting_fails          Test linting-unified.yml failure isolation
  quality_gates_fails    Test quality-gates.yml failure isolation

Environment:
  GITHUB_TOKEN          GitHub API token (requires workflow scope)

Examples:
  ./run-error-isolation-test.sh                     # All scenarios
  ./run-error-isolation-test.sh labeling_fails      # Labeling only
  ./run-error-isolation-test.sh validation_fails    # Validation only

Output:
  - Triggers GitHub Actions workflow
  - Displays workflow run URL
  - Shows status after trigger (may be queued)
  - Prints results location

For more info on T072, see: .github/specs/011-workflow-consolidation-phase-2/tasks.md
EOF
}

# Validate inputs
if [[ "$TEST_SCENARIO" == "--help" || "$TEST_SCENARIO" == "-h" ]]; then
    show_help
    exit 0
fi

case "$TEST_SCENARIO" in
    all_scenarios|labeling_fails|validation_fails|testing_fails|linting_fails|quality_gates_fails)
        ;;
    *)
        echo -e "${RED}❌ Invalid scenario: $TEST_SCENARIO${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac

# Validate workflow file exists
if [[ ! -f "$WORKFLOW_FILE" ]]; then
    echo -e "${RED}❌ Workflow file not found: $WORKFLOW_FILE${NC}"
    exit 1
fi

# Validate GitHub token
if [[ -z "$GITHUB_TOKEN" ]]; then
    echo -e "${RED}❌ GITHUB_TOKEN environment variable not set${NC}"
    echo "Set it with: export GITHUB_TOKEN=<your-token>"
    exit 1
fi

# Print header
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Error Isolation Test (T072)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Test Scenario: ${YELLOW}$TEST_SCENARIO${NC}"
echo "Workflow: ${YELLOW}$WORKFLOW_FILE${NC}"
echo ""

# Determine repository info
REPO_DIR=$(git rev-parse --show-toplevel)
REPO_NAME=$(basename "$REPO_DIR")
REPO_OWNER=$(git remote get-url origin | sed -E 's|.*github.com[:/](.+)/.*|\1|')

echo "Repository: ${YELLOW}$REPO_OWNER/$REPO_NAME${NC}"
echo ""

# Trigger workflow
echo -e "${GREEN}📤 Triggering error isolation test...${NC}"
echo ""

# Construct curl command for GitHub API
WORKFLOW_DISPATCH_URL="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/workflows/error-isolation-test.yml/dispatches"

DISPATCH_DATA=$(cat <<EOF
{
  "ref": "$(git rev-parse --abbrev-ref HEAD)",
  "inputs": {
    "test_scenario": "$TEST_SCENARIO"
  }
}
EOF
)

# Make API request
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$DISPATCH_DATA" \
  "$WORKFLOW_DISPATCH_URL" \
  -w "\n%{http_code}" \
  2>&1)

# Parse response
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)

echo "HTTP Status: ${YELLOW}$HTTP_CODE${NC}"
echo ""

case "$HTTP_CODE" in
    204)
        echo -e "${GREEN}✅ Workflow triggered successfully${NC}"
        echo ""
        echo "Workflow will start running in a few seconds."
        echo ""
        echo -e "${BLUE}View progress:${NC}"
        echo "  https://github.com/$REPO_OWNER/$REPO_NAME/actions/workflows/error-isolation-test.yml"
        echo ""
        echo -e "${BLUE}Expected Results:${NC}"
        case "$TEST_SCENARIO" in
            all_scenarios)
                echo "  ✓ Test 1: Labeling Failure - Other workflows independent"
                echo "  ✓ Test 2: Validation Failure - Other workflows independent"
                echo "  ✓ Test 3: Testing Failure - Other workflows independent"
                echo "  ✓ Test 4: Linting Failure - Other workflows independent"
                echo "  ✓ Test 5: Quality Gates Failure - Other workflows independent"
                ;;
            labeling_fails)
                echo "  ✓ Labeling workflow fails"
                echo "  ✓ Validation/Testing/Linting/Quality-Gates workflows continue"
                echo "  ✓ No cascading failures observed"
                ;;
            validation_fails)
                echo "  ✓ Validation workflow fails"
                echo "  ✓ Labeling/Testing/Linting/Quality-Gates workflows continue"
                echo "  ✓ No cascading failures observed"
                ;;
            testing_fails)
                echo "  ✓ Testing workflow fails"
                echo "  ✓ Labeling/Validation/Linting/Quality-Gates workflows continue"
                echo "  ✓ No cascading failures observed"
                ;;
            linting_fails)
                echo "  ✓ Linting workflow fails"
                echo "  ✓ Labeling/Validation/Testing/Quality-Gates workflows continue"
                echo "  ✓ No cascading failures observed"
                ;;
            quality_gates_fails)
                echo "  ✓ Quality Gates workflow fails"
                echo "  ✓ Labeling/Validation/Testing/Linting workflows continue"
                echo "  ✓ No cascading failures observed"
                ;;
        esac
        echo ""
        echo -e "${BLUE}Next Steps:${NC}"
        echo "  1. Wait for workflow to complete (typically 1-2 minutes)"
        echo "  2. Review results in GitHub Actions"
        echo "  3. Verify all expected outcomes observed"
        echo "  4. Document results in .github/docs/PHASE2_STATUS.md"
        echo "  5. Mark T072 complete in tasks.md"
        echo ""
        ;;
    401)
        echo -e "${RED}❌ Authentication failed${NC}"
        echo "Verify your GitHub token has 'workflow' scope"
        exit 1
        ;;
    403)
        echo -e "${RED}❌ Permission denied${NC}"
        echo "Verify your GitHub token has access to this repository"
        exit 1
        ;;
    404)
        echo -e "${RED}❌ Workflow not found${NC}"
        echo "Verify error-isolation-test.yml exists in .github/tests/"
        exit 1
        ;;
    422)
        echo -e "${RED}❌ Validation failed${NC}"
        echo "Response: $RESPONSE_BODY"
        exit 1
        ;;
    *)
        echo -e "${RED}❌ Unexpected HTTP status: $HTTP_CODE${NC}"
        echo "Response: $RESPONSE_BODY"
        exit 1
        ;;
esac

exit 0
