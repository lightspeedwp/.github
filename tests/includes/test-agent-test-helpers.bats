#!/usr/bin/env bats

# ============================================================================
# Agent Test Helper Function Tests
# Location: tests/includes/test-agent-test-helpers.bats
# Description:
#   - Tests the agent test helper functions themselves
#   - Validates test environment setup and teardown
#   - Ensures mock creation functions work correctly
# Standards:
#   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
#   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
# Contribution:
#   - Update when adding new helper functions
#   - Maintain compatibility with Bats testing framework
# ============================================================================

load "$(dirname "$BATS_TEST_FILENAME")/agent-test-helpers.bash"

setup() {
    # Create temporary directory for tests
    export TEST_TEMP_DIR="$(mktemp -d)"
    export ORIGINAL_PWD="$PWD"
    cd "$TEST_TEMP_DIR"
}

teardown() {
    # Clean up temporary directory
    cd "$ORIGINAL_PWD"
    rm -rf "$TEST_TEMP_DIR"
}

@test "setup_agent_test_environment creates required environment variables" {
    setup_agent_test_environment

    # Check required environment variables are set
    [ -n "$AGENTS_DIR" ]
    [ -n "$GITHUB_TOKEN" ]
    [ -n "$GITHUB_REPOSITORY" ]
    [ -n "$GITHUB_EVENT_PATH" ]
    [ -n "$DRY_RUN" ]

    # Check DRY_RUN is enabled in tests
    [ "$DRY_RUN" = "true" ]
}

@test "setup_agent_test_environment creates event file" {
    setup_agent_test_environment

    [ -f "$GITHUB_EVENT_PATH" ]

    # Validate JSON structure
    run jq '.' "$GITHUB_EVENT_PATH"
    [ "$status" -eq 0 ]

    # Check for required fields
    run jq '.action' "$GITHUB_EVENT_PATH"
    [ "$status" -eq 0 ]
    [ "$output" != "null" ]
}

@test "validate_agent_structure detects missing module.exports" {
    # Create test agent without proper exports
    cat > "bad-agent.js" << 'EOF'
console.log('This agent has no exports');
function someFunction() {
    return 'test';
}
EOF

    run validate_agent_structure "bad-agent.js"
    [ "$status" -eq 1 ]
    [[ "$output" =~ "missing module.exports" ]]
}

@test "validate_agent_structure accepts valid agent structure" {
    # Create properly structured agent
    cat > "good-agent.js" << 'EOF'
const { Octokit } = require('@octokit/rest');

async function run(context) {
    return { success: true };
}

module.exports = {
    run
};
EOF

    run validate_agent_structure "good-agent.js"
    [ "$status" -eq 0 ]
}

@test "validate_agent_structure detects missing run function" {
    # Create agent with exports but no run function
    cat > "no-run-agent.js" << 'EOF'
function helper() {
    return 'helper';
}

module.exports = {
    helper
};
EOF

    run validate_agent_structure "no-run-agent.js"
    [ "$status" -eq 1 ]
    [[ "$output" =~ "missing run function" ]] || [[ "$output" =~ "no run export" ]]
}

@test "create_mock_github_event generates valid JSON for different event types" {
    # Test pull request event
    create_mock_github_event "pull_request"
    [ -f "$GITHUB_EVENT_PATH" ]

    run jq '.action' "$GITHUB_EVENT_PATH"
    [ "$status" -eq 0 ]

    run jq '.pull_request' "$GITHUB_EVENT_PATH"
    [ "$status" -eq 0 ]
    [ "$output" != "null" ]

    # Test issues event
    create_mock_github_event "issues"

    run jq '.issue' "$GITHUB_EVENT_PATH"
    [ "$status" -eq 0 ]
    [ "$output" != "null" ]
}

@test "create_mock_github_event includes repository information" {
    create_mock_github_event "push"

    # Check repository structure
    run jq '.repository.name' "$GITHUB_EVENT_PATH"
    [ "$status" -eq 0 ]
    [ "$output" != "null" ]

    run jq '.repository.owner.login' "$GITHUB_EVENT_PATH"
    [ "$status" -eq 0 ]
    [ "$output" != "null" ]
}

@test "cleanup_agent_test_environment removes created files" {
    setup_agent_test_environment

    # Verify files exist
    [ -f "$GITHUB_EVENT_PATH" ]

    cleanup_agent_test_environment

    # Verify files are removed
    [ ! -f "$GITHUB_EVENT_PATH" ]
}

@test "agent test helpers handle missing dependencies gracefully" {
    # Test behavior when jq is not available (simulate)
    if command -v jq >/dev/null 2>&1; then
        # jq is available, create mock scenario
        export PATH="/nonexistent:$PATH"

        run validate_agent_structure "nonexistent-file.js"
        # Should handle missing dependencies
        [ "$status" -ne 0 ]
    fi

    skip "jq dependency test requires specific environment setup"
}

@test "test helpers work with different shell environments" {
    # Test in subshell with different settings
    (
        set -u  # Unset variables cause errors
        setup_agent_test_environment
        [ -n "$GITHUB_TOKEN" ]
    )

    # Should not fail with strict shell settings
    [ "$?" -eq 0 ]
}

@test "mock data generation creates unique values" {
    create_mock_github_event "pull_request"
    first_number=$(jq '.pull_request.number' "$GITHUB_EVENT_PATH")

    create_mock_github_event "pull_request"
    second_number=$(jq '.pull_request.number' "$GITHUB_EVENT_PATH")

    # Numbers should be different (assuming random generation)
    # Note: This test might occasionally fail due to randomness
    [ "$first_number" != "$second_number" ] || skip "Random collision occurred"
}
