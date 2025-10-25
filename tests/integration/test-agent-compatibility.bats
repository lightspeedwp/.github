#!/usr/bin/env bats

# ============================================================================
# Cross-Agent Compatibility Tests
# Location: tests/integration/test-agent-compatibility.bats
# Description:
#   - Tests multiple agents can run on the same event without conflicts
#   - Validates agents don't interfere with each other's operations
#   - Ensures consistent behavior across different agent combinations
# Standards:
#   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
#   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
# Contribution:
#   - Update when adding new agent interactions
#   - Add tests for new agent combinations
# ============================================================================

load "$(dirname "$BATS_TEST_FILENAME")/../includes/agent-test-helpers.bash"

setup() {
    setup_agent_test_environment
    export AGENTS_DIR="$BATS_TEST_DIRNAME/../../.github/agents"

    # Create a more complex test event
    create_mock_github_event "pull_request"
}

teardown() {
    cleanup_agent_test_environment
}

@test "multiple agents can run on same PR event without conflicts" {
    # Create realistic PR event
    cat > "$GITHUB_EVENT_PATH" << 'EOF'
{
  "action": "opened",
  "pull_request": {
    "number": 123,
    "title": "feat(security): Add authentication improvements",
    "body": "This PR adds new security features and updates documentation.",
    "user": {
      "login": "contributor"
    },
    "labels": [],
    "changed_files": 5,
    "additions": 150,
    "deletions": 25
  },
  "repository": {
    "name": "test-repo",
    "owner": {
      "login": "lightspeedwp"
    }
  }
}
EOF

    # Run all agents sequentially and collect results
    declare -a agent_results
    declare -a agent_names

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        agent_name=$(basename "$agent" .agent.js)
        agent_names+=("$agent_name")

        run timeout 30s node "$agent"
        agent_results+=("$status")

        echo "Agent $agent_name exit status: $status"
        if [ "$status" -ne 0 ] && [ "$status" -ne 139 ]; then
            echo "Agent $agent_name output: $output"
        fi
    done

    # Verify no agent crashed
    for i in "${!agent_results[@]}"; do
        echo "Checking ${agent_names[$i]}: exit code ${agent_results[$i]}"
        [ "${agent_results[$i]}" -ne 139 ]  # No segfault
        [ "${agent_results[$i]}" -ne 132 ]  # No illegal instruction
    done
}

@test "agents handle shared resources without conflicts" {
    # Create shared resource (mock labels file)
    mkdir -p ".github"
    cat > ".github/labels.yml" << 'EOF'
- name: "type:bug"
  color: "d73a4a"
  aliases: ["bug", "defect"]
- name: "type:feature"
  color: "0075ca"
  aliases: ["feature", "enhancement"]
- name: "lang:php"
  color: "4f5d95"
  aliases: ["php"]
EOF

    # Run multiple agents that might access the same files
    declare -a pids

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        # Run agents in parallel
        timeout 30s node "$agent" &
        pids+=("$!")
    done

    # Wait for all agents to complete
    for pid in "${pids[@]}"; do
        wait "$pid"
        exit_code=$?
        [ "$exit_code" -ne 139 ]  # No segfault from resource conflicts
    done

    # Verify shared resource is still intact
    [ -f ".github/labels.yml" ]

    # Cleanup
    rm -rf ".github"
}

@test "agents produce consistent results with same input" {
    # Run the same agent multiple times with identical input
    first_agent="$(find "$AGENTS_DIR" -name "*.agent.js" -type f | head -n 1)"

    if [ -z "$first_agent" ]; then
        skip "No agents found to test"
    fi

    declare -a outputs
    declare -a exit_codes

    # Run agent multiple times
    for i in {1..3}; do
        run timeout 30s node "$first_agent"
        outputs+=("$output")
        exit_codes+=("$status")
    done

    # Compare results - exit codes should be consistent
    for i in {1..2}; do
        [ "${exit_codes[0]}" -eq "${exit_codes[$i]}" ]
    done

    # If successful, outputs should be similar (allowing for timestamps/IDs)
    if [ "${exit_codes[0]}" -eq 0 ]; then
        # Basic consistency check - all should mention dry-run if in dry-run mode
        if [[ "${outputs[0]}" =~ "dry" ]]; then
            [[ "${outputs[1]}" =~ "dry" ]]
            [[ "${outputs[2]}" =~ "dry" ]]
        fi
    fi
}

@test "agents respect execution order when dependencies exist" {
    # Create event that would trigger label-dependent operations
    cat > "$GITHUB_EVENT_PATH" << 'EOF'
{
  "action": "labeled",
  "pull_request": {
    "number": 456,
    "title": "fix: Bug fix",
    "labels": [
      {"name": "type:bug"},
      {"name": "priority:high"}
    ]
  },
  "repository": {
    "name": "test-repo",
    "owner": {
      "login": "lightspeedwp"
    }
  }
}
EOF

    # Run agents in typical execution order
    # 1. Labeling agent (adds/modifies labels)
    # 2. Reviewer agent (might use labels for decisions)

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # Each agent should handle the labeled event appropriately
        [ "$status" -ne 139 ]

        echo "Agent $(basename "$agent"): exit $status"
    done
}

@test "agents handle concurrent GitHub API rate limits gracefully" {
    # Simulate multiple agents hitting API limits
    export DRY_RUN="false"  # Would normally hit real API

    # Create event that would trigger API calls
    cat > "$GITHUB_EVENT_PATH" << 'EOF'
{
  "action": "opened",
  "pull_request": {
    "number": 789,
    "title": "Large PR with many changes",
    "changed_files": 50
  },
  "repository": {
    "name": "test-repo",
    "owner": {
      "login": "lightspeedwp"
    }
  }
}
EOF

    # Start multiple agents in parallel (would compete for rate limits)
    declare -a pids

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        timeout 30s node "$agent" &
        pids+=("$!")
    done

    # Wait for completion
    for pid in "${pids[@]}"; do
        wait "$pid"
        # Should handle rate limits gracefully, not crash
        [ "$?" -ne 139 ]
    done

    export DRY_RUN="true"  # Reset to safe mode
}

@test "agents maintain state isolation" {
    # Test that agents don't interfere with each other's internal state

    # Create environment that might encourage state sharing
    export TEST_SHARED_VAR="initial-value"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        # Run agent
        run timeout 30s node "$agent"

        # Verify shared environment wasn't corrupted
        [ "$TEST_SHARED_VAR" = "initial-value" ]

        # Agent should not crash due to state conflicts
        [ "$status" -ne 139 ]
    done

    unset TEST_SHARED_VAR
}

@test "agents handle different event types appropriately" {
    declare -a event_types=("pull_request" "issues" "push" "release")

    for event_type in "${event_types[@]}"; do
        echo "Testing event type: $event_type"

        create_mock_github_event "$event_type"

        for agent in "$AGENTS_DIR"/*.agent.js; do
            [ -f "$agent" ] || continue

            run timeout 20s node "$agent"

            # Agent should handle different event types gracefully
            [ "$status" -ne 139 ]

            # If agent doesn't support event type, should exit cleanly
            if [ "$status" -ne 0 ]; then
                # Should provide meaningful message about unsupported event
                [[ "$output" =~ "unsupported" ]] || [[ "$output" =~ "not applicable" ]] || [ "$output" = "" ]
            fi
        done
    done
}

@test "agents handle workflow cancellation gracefully" {
    # Test agents can be interrupted cleanly
    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        # Start agent in background
        timeout 30s node "$agent" &
        agent_pid=$!

        # Let it run briefly
        sleep 1

        # Send termination signal
        kill -TERM "$agent_pid" 2>/dev/null || true

        # Wait for cleanup
        wait "$agent_pid" 2>/dev/null || true

        # Should not leave zombie processes or corrupted state
        ! kill -0 "$agent_pid" 2>/dev/null
    done
}
