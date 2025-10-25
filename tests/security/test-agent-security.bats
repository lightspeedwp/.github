#!/usr/bin/env bats

# ============================================================================
# Agent Security Validation Tests
# Location: tests/security/test-agent-security.bats
# Description:
#   - Validates agents do not expose secrets in logs or output
#   - Tests agents handle malformed input safely
#   - Ensures proper authentication and authorization
# Standards:
#   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
#   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/custom-instructions.md)
# Contribution:
#   - Update when adding new security requirements
#   - Add tests for new agent security features
# ============================================================================

load "$(dirname "$BATS_TEST_FILENAME")/../includes/agent-test-helpers.bash"

setup() {
    setup_agent_test_environment
    export AGENTS_DIR="$BATS_TEST_DIRNAME/../../.github/agents"
}

teardown() {
    cleanup_agent_test_environment
}

@test "agents do not expose GitHub tokens in logs" {
    export GITHUB_TOKEN="ghp_test_secret_token_12345"

    # Test each agent
    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        # Run agent in dry-run mode and capture output
        run timeout 30s node "$agent" 2>&1

        # Check output doesn't contain the token
        [[ ! "$output" =~ "ghp_test_secret_token_12345" ]]
        [[ ! "$output" =~ "$GITHUB_TOKEN" ]]

        # Check for common token patterns
        [[ ! "$output" =~ "ghp_[A-Za-z0-9_]{36}" ]]
        [[ ! "$output" =~ "gho_[A-Za-z0-9_]{36}" ]]
        [[ ! "$output" =~ "ghu_[A-Za-z0-9_]{36}" ]]
    done
}

@test "agents handle malformed JSON input safely" {
    # Create malformed event file
    echo '{"malformed": json}' > "$GITHUB_EVENT_PATH"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        # Agent should not crash with malformed JSON
        run timeout 10s node "$agent"

        # Should not exit with segfault or similar crash codes
        [ "$status" -ne 139 ]  # SIGSEGV
        [ "$status" -ne 132 ]  # SIGILL
        [ "$status" -ne 134 ]  # SIGABRT
    done
}

@test "agents handle empty or missing event files safely" {
    # Test with empty file
    echo "" > "$GITHUB_EVENT_PATH"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"
        # Should handle gracefully, not crash
        [ "$status" -ne 139 ]
    done

    # Test with missing file
    rm -f "$GITHUB_EVENT_PATH"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"
        # Should handle gracefully
        [ "$status" -ne 139 ]
    done
}

@test "agents require valid GitHub token" {
    unset GITHUB_TOKEN
    export GITHUB_TOKEN=""

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"

        # Should fail without token (unless in dry-run mode)
        if [[ "$DRY_RUN" != "true" ]]; then
            [ "$status" -ne 0 ]
            [[ "$output" =~ "token" ]] || [[ "$output" =~ "authentication" ]]
        fi
    done
}

@test "agents validate repository permissions" {
    # Set invalid repository format
    export GITHUB_REPOSITORY="invalid-repo-format"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 10s node "$agent"

        # Should handle invalid repository format
        [ "$status" -ne 139 ]
    done
}

@test "agents handle rate limiting appropriately" {
    # Create mock event that would trigger API calls
    create_mock_github_event "pull_request"

    # Test that agents don't make actual API calls in dry-run
    export DRY_RUN="true"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # In dry-run mode, should complete without API rate limit errors
        [[ ! "$output" =~ "rate limit" ]]
        [[ ! "$output" =~ "403" ]]
    done
}

@test "agents sanitize user input in PR titles and bodies" {
    # Create event with potentially malicious content
    cat > "$GITHUB_EVENT_PATH" << 'EOF'
{
  "action": "opened",
  "pull_request": {
    "number": 1,
    "title": "<script>alert('xss')</script>Test PR",
    "body": "This contains <script>malicious code</script> and other ${injection} attempts",
    "user": {
      "login": "test-user"
    }
  },
  "repository": {
    "name": "test-repo",
    "owner": {
      "login": "test-owner"
    }
  }
}
EOF

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent"

        # Agent should handle malicious content safely
        [ "$status" -ne 139 ]

        # Should not execute or echo back script tags
        [[ ! "$output" =~ "<script>" ]]
    done
}

@test "agents do not expose sensitive environment variables" {
    # Set various sensitive environment variables
    export AWS_SECRET_ACCESS_KEY="secret-aws-key"
    export DATABASE_PASSWORD="secret-db-pass"
    export PRIVATE_KEY="secret-private-key"

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        run timeout 30s node "$agent" 2>&1

        # Check output doesn't contain sensitive values
        [[ ! "$output" =~ "secret-aws-key" ]]
        [[ ! "$output" =~ "secret-db-pass" ]]
        [[ ! "$output" =~ "secret-private-key" ]]
    done

    # Clean up
    unset AWS_SECRET_ACCESS_KEY DATABASE_PASSWORD PRIVATE_KEY
}

@test "agents use secure HTTP methods and headers" {
    # This test would require mocking HTTP requests
    # For now, we'll test that agents don't use insecure patterns

    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        # Check agent source doesn't contain insecure patterns
        run grep -i "http://" "$agent"
        [ "$status" -ne 0 ]  # Should not find insecure HTTP URLs

        # Check for proper authentication headers (if any)
        if grep -q "Authorization" "$agent"; then
            # Should use Bearer token format
            run grep "Bearer" "$agent"
            [ "$status" -eq 0 ]
        fi
    done
}

@test "agents handle file system operations securely" {
    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        # Check for potentially dangerous file operations
        run grep -E "(rm -rf|eval|exec)" "$agent"
        [ "$status" -ne 0 ]  # Should not find dangerous operations

        # Check for path traversal attempts in source
        run grep -E "\.\.[\\/]" "$agent"
        [ "$status" -ne 0 ]  # Should not contain path traversal
    done
}

@test "agents validate webhook signatures (if implemented)" {
    # Create event with invalid signature
    export GITHUB_WEBHOOK_SECRET="test-secret"

    # This test depends on webhook signature validation implementation
    # Skip if not implemented
    skip "Webhook signature validation test requires specific implementation"
}

@test "agents respect HTTPS-only policy" {
    for agent in "$AGENTS_DIR"/*.agent.js; do
        [ -f "$agent" ] || continue

        # Check that any GitHub API calls use HTTPS
        if grep -q "api.github.com" "$agent"; then
            run grep "https://api.github.com" "$agent"
            [ "$status" -eq 0 ]

            # Should not find insecure HTTP calls to GitHub API
            run grep "http://api.github.com" "$agent"
            [ "$status" -ne 0 ]
        fi
    done
}
