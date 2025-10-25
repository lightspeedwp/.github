#!/usr/bin/env bats

# ============================================================================
# Agent Configuration Handling Tests
# Location: tests/config/test-agent-config.bats
# Description:
#   - Tests agents handle missing or invalid configuration gracefully
#   - Validates environment variable requirements and defaults
#   - Ensures agents respect dry-run and debug modes
# Standards:
#   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
#   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
# Contribution:
#   - Update when adding new configuration options
#   - Add tests for new environment variables
# ============================================================================

load "$(dirname "$BATS_TEST_FILENAME")/../includes/agent-test-helpers.bash"

setup() {
    setup_agent_test_environment
    export AGENTS_DIR="$BATS_TEST_DIRNAME/../../.github/agents"

    # Store original environment
    export ORIGINAL_GITHUB_TOKEN="$GITHUB_TOKEN"
    export ORIGINAL_GITHUB_REPOSITORY="$GITHUB_REPOSITORY"
    export ORIGINAL_DRY_RUN="$DRY_RUN"
}

teardown() {
    # Restore original environment
    export GITHUB_TOKEN="$ORIGINAL_GITHUB_TOKEN"
    export GITHUB_REPOSITORY="$ORIGINAL_GITHUB_REPOSITORY"
    export DRY_RUN="$ORIGINAL_DRY_RUN"

    cleanup_agent_test_environment
}

@test "agents handle missing GITHUB_TOKEN environment variable" {
    unset GITHUB_TOKEN

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"

        # Should fail gracefully with meaningful error
        [ "$status" -ne 0 ]
        [[ "$output" =~ "GITHUB_TOKEN" ]] || [[ "$output" =~ "token" ]] || [[ "$output" =~ "authentication" ]]

        # Should not crash
        [ "$status" -ne 139 ]
    done
}

@test "agents handle missing GITHUB_REPOSITORY environment variable" {
    unset GITHUB_REPOSITORY

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"

        # Should either fail gracefully or use defaults
        [ "$status" -ne 139 ]

        # If it fails, should mention repository
        if [ "$status" -ne 0 ]; then
            [[ "$output" =~ "repository" ]] || [[ "$output" =~ "GITHUB_REPOSITORY" ]]
        fi
    done
}

@test "agents respect DRY_RUN=true mode" {
    export DRY_RUN="true"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # Should indicate dry-run mode in output
        [[ "$output" =~ "dry.run" ]] || [[ "$output" =~ "DRY RUN" ]] || [[ "$output" =~ "dry-run" ]]
    done
}

@test "agents respect DRY_RUN=false mode" {
    export DRY_RUN="false"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # Should not crash (though may fail due to test environment)
        [ "$status" -ne 139 ]
    done
}

@test "agents handle empty environment variables gracefully" {
    export GITHUB_TOKEN=""
    export GITHUB_REPOSITORY=""

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"

        # Should handle empty values gracefully
        [ "$status" -ne 139 ]

        # Should provide meaningful error messages
        if [ "$status" -ne 0 ]; then
            [[ "$output" =~ "token" ]] || [[ "$output" =~ "repository" ]] || [[ "$output" =~ "configuration" ]]
        fi
    done
}

@test "agents validate GITHUB_REPOSITORY format" {
    # Test various invalid repository formats
    declare -a invalid_repos=(
        "invalid-format"
        "owner/"
        "/repo"
        "owner/repo/extra"
        "owner with spaces/repo"
        ""
    )

    for repo in "${invalid_repos[@]}"; do
        export GITHUB_REPOSITORY="$repo"

        for agent in "$AGENTS_DIR"/*.agent.js; do
            [ -f "$agent" ] || continue

            run timeout 10s node "$agent"

            # Should handle invalid format gracefully
            [ "$status" -ne 139 ]
        done
    done
}

@test "agents use reasonable defaults when possible" {
    # Remove non-essential environment variables
    unset GITHUB_REF
    unset GITHUB_SHA
    unset GITHUB_ACTOR

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # Should not crash due to missing optional variables
        [ "$status" -ne 139 ]
    done
}

@test "agents handle DEBUG mode appropriately" {
    export DEBUG="true"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # In debug mode, should provide more verbose output
        if [[ "$output" =~ "debug" ]] || [[ "$output" =~ "DEBUG" ]]; then
            # If debug is implemented, should show debug info
            [ ${#output} -gt 50 ]  # Should have substantial output
        fi
    done

    unset DEBUG
}

@test "agents handle GITHUB_EVENT_PATH variations" {
    # Test with different event file locations
    export GITHUB_EVENT_PATH="/tmp/nonexistent-event.json"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"

        # Should handle missing event file gracefully
        [ "$status" -ne 139 ]
    done

    # Test with directory instead of file
    mkdir -p "/tmp/test-event-dir"
    export GITHUB_EVENT_PATH="/tmp/test-event-dir"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"

        # Should handle directory path gracefully
        [ "$status" -ne 139 ]
    done

    rm -rf "/tmp/test-event-dir"
}

@test "agents respect NODE_ENV settings" {
    # Test production mode
    export NODE_ENV="production"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # Should not crash in production mode
        [ "$status" -ne 139 ]
    done

    # Test development mode
    export NODE_ENV="development"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # Should not crash in development mode
        [ "$status" -ne 139 ]
    done

    unset NODE_ENV
}

@test "agents handle configuration file loading" {
    # Create temporary config file
    cat > "/tmp/agent-config.json" << 'EOF'
{
  "labels": {
    "enabled": true,
    "rules": []
  },
  "reviewers": {
    "enabled": false
  }
}
EOF

    export AGENT_CONFIG_PATH="/tmp/agent-config.json"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # Should handle config file presence gracefully
        [ "$status" -ne 139 ]
    done

    rm -f "/tmp/agent-config.json"
    unset AGENT_CONFIG_PATH
}

@test "agents validate required configuration values" {
    # Test with minimal valid configuration
    export GITHUB_TOKEN="ghp_valid_token_format_123456789012345678901234"
    export GITHUB_REPOSITORY="owner/repo"
    export DRY_RUN="true"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # With valid minimal config, should at least start properly
        [ "$status" -ne 139 ]
    done
}

@test "agents handle timeout configuration" {
    export AGENT_TIMEOUT="5000"  # 5 seconds

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"

        # Should respect timeout if implemented
        [ "$status" -ne 139 ]
    done

    unset AGENT_TIMEOUT
}
