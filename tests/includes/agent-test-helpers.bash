#!/usr/bin/env bash
# ============================================================================
# Test Name: agent-test-helpers.bash
# Testing: Test helpers specifically for agent validation and testing
# Description: Specialized test helper functions for LightSpeed WP agents
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bats, bash 4.0+, node.js (for JS agents)
# Usage: load "$(dirname "$BATS_TEST_FILENAME")/../includes/agent-test-helpers.bash"
# Environment Variables: TEST_TEMP_DIR, GITHUB_TOKEN (optional for testing)
# Options: None - this is a library file
# Examples:
#   load "$(dirname "$BATS_TEST_FILENAME")/../includes/agent-test-helpers.bash"
#   setup_agent_test_environment
#   validate_agent_structure "issue-type.agent.js"
# Notes:
#   - Provides agent-specific testing capabilities
#   - Validates agent structure and standards
#   - Includes GitHub API mocking for testing
# ============================================================================

# Load enhanced test helpers
if [[ -f "$(dirname "${BASH_SOURCE[0]}")/enhanced-test-helpers.bash" ]]; then
    # shellcheck source=enhanced-test-helpers.bash
    source "$(dirname "${BASH_SOURCE[0]}")/enhanced-test-helpers.bash"
fi

# ============================================================================
# Function: setup_agent_test_environment
# Description: Setup test environment specifically for agent testing
# Arguments: None
# Output: Sets up agent testing environment
# Notes: Extends enhanced test environment for agents
# ============================================================================
setup_agent_test_environment() {
    # Setup enhanced environment
    setup_enhanced_test_environment
    
    # Add agents directory to test environment
    export AGENTS_DIR="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Setup mock GitHub environment
    export GITHUB_TOKEN="mock-token-for-testing"
    export GITHUB_REPOSITORY="lightspeedwp/scripts"
    export GITHUB_EVENT_NAME="issues"
    export GITHUB_EVENT_PATH="${TEST_TEMP_DIR}/github-event.json"
    
    # Create mock GitHub event file
    create_mock_github_event
    
    # Setup Node.js modules path if needed
    if [[ -d "${BATS_TEST_DIRNAME}/../node_modules" ]]; then
        export NODE_PATH="${BATS_TEST_DIRNAME}/../node_modules"
    fi
}

# ============================================================================
# Function: create_mock_github_event
# Description: Create a mock GitHub event JSON file
# Arguments: $1 (optional) - Event type (default: issues)
# Output: Creates mock event file
# Notes: Creates realistic GitHub event structure
# ============================================================================
create_mock_github_event() {
    local event_type="${1:-issues}"
    
    cat << 'EOF' > "$GITHUB_EVENT_PATH"
{
  "action": "opened",
  "issue": {
    "number": 123,
    "title": "Test Issue Title",
    "body": "This is a test issue body with some content.",
    "labels": [
      {
        "name": "bug",
        "color": "d73a4a"
      }
    ],
    "user": {
      "login": "testuser"
    },
    "html_url": "https://github.com/lightspeedwp/scripts/issues/123"
  },
  "repository": {
    "name": "scripts",
    "full_name": "lightspeedwp/scripts",
    "owner": {
      "login": "lightspeedwp"
    }
  }
}
EOF
}

# ============================================================================
# Function: validate_agent_structure
# Description: Validate that an agent follows LightSpeed WP standards
# Arguments: $1 - Agent filename (in .github/agents/)
# Output: Validation results
# Notes: Checks agent structure, exports, and documentation
# ============================================================================
validate_agent_structure() {
    local agent_filename="$1"
    local agent_path="${AGENTS_DIR}/${agent_filename}"
    
    if [[ ! -f "$agent_path" ]]; then
        echo "Agent file does not exist: $agent_path"
        return 1
    fi
    
    # Check file extension
    if [[ "$agent_filename" != *.agent.js ]]; then
        echo "Agent filename should end with .agent.js: $agent_filename"
        return 1
    fi
    
    # Check for required Node.js structure (if JS agent)
    if [[ "$agent_filename" == *.js ]]; then
        validate_js_agent_structure "$agent_path"
    fi
    
    # Check for agent documentation in AGENTS.md
    local agent_name
    agent_name=$(basename "$agent_filename" .agent.js)
    
    if ! grep -q "$agent_name" "${BATS_TEST_DIRNAME}/../AGENTS.md"; then
        echo "Agent not documented in AGENTS.md: $agent_name"
        return 1
    fi
}

# ============================================================================
# Function: validate_js_agent_structure
# Description: Validate JavaScript agent structure and exports
# Arguments: $1 - Path to JavaScript agent file
# Output: Validation results
# Notes: Checks for proper module structure and exports
# ============================================================================
validate_js_agent_structure() {
    local agent_path="$1"
    
    # Check for module.exports or export statements
    if ! grep -qE "(module\.exports|export)" "$agent_path"; then
        echo "JavaScript agent missing module.exports or export: $agent_path"
        return 1
    fi
    
    # Check for main function
    if ! grep -q "async.*function\|function.*async" "$agent_path"; then
        echo "JavaScript agent should have async functions: $agent_path"
        return 1
    fi
    
    # Check syntax with Node.js
    if command -v node >/dev/null 2>&1; then
        if ! node -c "$agent_path" 2>/dev/null; then
            echo "JavaScript agent has syntax errors: $agent_path"
            return 1
        fi
    fi
}

# ============================================================================
# Function: mock_github_api
# Description: Mock GitHub API responses for agent testing
# Arguments: $1 - API endpoint pattern, $2 - Mock response file
# Output: Sets up GitHub API mocking
# Notes: Creates mock responses for GitHub API calls
# ============================================================================
mock_github_api() {
    local endpoint_pattern="$1"
    local response_file="$2"
    
    # Create mock response directory
    mkdir -p "${TEST_TEMP_DIR}/github-api-mocks"
    
    # Create mock response file
    local mock_file="${TEST_TEMP_DIR}/github-api-mocks/${endpoint_pattern//\//_}.json"
    cp "$response_file" "$mock_file"
    
    # Set environment variable for mock location
    export GITHUB_API_MOCK_DIR="${TEST_TEMP_DIR}/github-api-mocks"
}

# ============================================================================
# Function: create_mock_github_response
# Description: Create a mock GitHub API response file
# Arguments: $1 - Response type, $2 - Response data
# Output: Creates mock response file
# Notes: Creates standard GitHub API response structure
# ============================================================================
create_mock_github_response() {
    local response_type="$1"
    local response_data="$2"
    local response_file="${TEST_TEMP_DIR}/mock-${response_type}-response.json"
    
    case "$response_type" in
        "issue")
            cat << EOF > "$response_file"
{
  "id": 1,
  "number": 123,
  "title": "Mock Issue",
  "body": "$response_data",
  "state": "open",
  "labels": []
}
EOF
            ;;
        "labels")
            echo "$response_data" > "$response_file"
            ;;
        *)
            echo "$response_data" > "$response_file"
            ;;
    esac
    
    echo "$response_file"
}

# ============================================================================
# Function: run_agent_test
# Description: Run an agent with test parameters
# Arguments: $1 - Agent filename, $2+ - Additional arguments
# Output: Agent execution results
# Notes: Runs agent in test environment with mocks
# ============================================================================
run_agent_test() {
    local agent_filename="$1"
    shift
    local agent_path="${AGENTS_DIR}/${agent_filename}"
    
    if [[ ! -f "$agent_path" ]]; then
        echo "Agent file does not exist: $agent_path"
        return 1
    fi
    
    # Run agent based on type
    if [[ "$agent_filename" == *.js ]]; then
        # JavaScript agent
        if command -v node >/dev/null 2>&1; then
            cd "${BATS_TEST_DIRNAME}/.."
            node "$agent_path" "$@"
        else
            echo "Node.js not available for testing JavaScript agent"
            return 1
        fi
    else
        # Assume shell script agent
        bash "$agent_path" "$@"
    fi
}

# ============================================================================
# Function: assert_agent_follows_standards
# Description: Assert that agent follows all LightSpeed WP standards
# Arguments: $1 - Agent filename
# Output: Comprehensive validation results
# Notes: Runs all applicable validation checks
# ============================================================================
assert_agent_follows_standards() {
    local agent_filename="$1"
    
    # Validate basic structure
    validate_agent_structure "$agent_filename"
    
    # Check for idempotent operations (no destructive changes without confirmation)
    local agent_path="${AGENTS_DIR}/${agent_filename}"
    if grep -qE "(rm -rf|del|DELETE|DROP)" "$agent_path"; then
        echo "Agent may contain destructive operations: $agent_filename"
        echo "Ensure proper safety checks and confirmation prompts are in place"
    fi
    
    # Check for proper error handling
    if [[ "$agent_filename" == *.js ]]; then
        if ! grep -qE "(try.*catch|\.catch\()" "$agent_path"; then
            echo "JavaScript agent should include error handling: $agent_filename"
            return 1
        fi
    else
        if ! grep -q "set -euo pipefail" "$agent_path"; then
            echo "Shell agent should include strict mode: $agent_filename"
            return 1
        fi
    fi
}

# ============================================================================
# Function: test_agent_dry_run
# Description: Test agent in dry-run mode
# Arguments: $1 - Agent filename
# Output: Dry-run test results
# Notes: Ensures agent supports dry-run testing
# ============================================================================
test_agent_dry_run() {
    local agent_filename="$1"
    
    # Set dry-run environment
    export DRY_RUN=true
    
    # Run agent
    run_agent_test "$agent_filename"
    
    # Reset environment
    unset DRY_RUN
}

# ============================================================================
# Function: cleanup_agent_test_environment
# Description: Clean up agent testing environment
# Arguments: None
# Output: Cleans up agent testing artifacts
# Notes: Extends cleanup for agent-specific resources
# ============================================================================
cleanup_agent_test_environment() {
    # Clean up enhanced environment
    cleanup_enhanced_test_environment
    
    # Clean up agent-specific environment variables
    unset AGENTS_DIR
    unset GITHUB_TOKEN
    unset GITHUB_REPOSITORY
    unset GITHUB_EVENT_NAME
    unset GITHUB_EVENT_PATH
    unset NODE_PATH
    unset GITHUB_API_MOCK_DIR
}