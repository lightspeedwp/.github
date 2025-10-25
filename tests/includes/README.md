---
file_type: documentation
version: "2.0"
created_date: "2025-10-25"
last_updated: "2025-10-25"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
tags:
  - "includes"
  - "bats"
  - "test-helpers"
  - "automation"
domain: "governance"
stability: "stable"
mode: "information"
deprecated: false
references:
  - path: "../../schemas/frontmatter.schema.json"
    description: "Unified frontmatter schema definition"
  - path: "enhanced-test-helpers.bash"
    description: "Enhanced test utilities"
  - path: "agent-test-helpers.bash"
    description: "Agent-specific test helpers"
---

# Test Includes

This directory contains reusable test helper functions and utilities for LightSpeed WP Bats test suites.

## Structure

```mermaid
graph TD
    A[includes/README.md]
    B[enhanced-test-helpers.bash]
    C[agent-test-helpers.bash]
    A --> B
    A --> C
    B --> D[Environment Setup]
    B --> E[Mocking Functions]
    B --> F[Assertion Functions]
    B --> G[Utility Functions]
    C --> H[Agent Environment]
    C --> I[GitHub Mocking]
    C --> J[Agent Validation]
    C --> K[Agent Testing]
```

## Usage

Load the appropriate test helper files in your Bats tests:

```bash
#!/usr/bin/env bats
# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../includes/enhanced-test-helpers.bash"
load "$(dirname "$BATS_TEST_FILENAME")/../includes/agent-test-helpers.bash"
```

## Available Helpers

### enhanced-test-helpers.bash

Extends the basic `test-helper.bash` with advanced capabilities:

- **Environment Setup:**
  - `setup_enhanced_test_environment()` - Enhanced test environment
  - `cleanup_enhanced_test_environment()` - Enhanced cleanup
  - `source_includes()` - Load all include files

- **Mocking Functions:**
  - `mock_git_command()` - Mock specific git commands
  - `create_test_git_repo()` - Create test git repository
  - `create_test_script()` - Create test script with includes

- **Assertion Functions:**
  - `assert_log_contains()` - Assert log contains message
  - `assert_function_exists()` - Assert function is defined
  - `assert_script_follows_standards()` - Validate script standards
  - `assert_no_shellcheck_errors()` - Validate with ShellCheck

- **Utility Functions:**
  - `run_with_timeout()` - Run command with timeout
  - `create_fixture_file()` - Create test fixture
  - `load_fixture()` - Load fixture content

### agent-test-helpers.bash

Specialized helpers for testing LightSpeed WP agents:

- **Agent Environment:**
  - `setup_agent_test_environment()` - Setup for agent testing
  - `cleanup_agent_test_environment()` - Agent-specific cleanup

- **GitHub Mocking:**
  - `create_mock_github_event()` - Mock GitHub webhook events
  - `mock_github_api()` - Mock GitHub API responses
  - `create_mock_github_response()` - Create API response files

- **Agent Validation:**
  - `validate_agent_structure()` - Validate agent file structure
  - `validate_js_agent_structure()` - Validate JavaScript agents
  - `assert_agent_follows_standards()` - Comprehensive agent validation

- **Agent Testing:**
  - `run_agent_test()` - Run agent with test parameters
  - `test_agent_dry_run()` - Test agent in dry-run mode

## Test Structure Standards

### Basic Test File Template

```bash
#!/usr/bin/env bats
# ============================================================================
# Test Name: test-example-script.bats
# Testing: example-script.sh
# Description: Test suite for example script functionality
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../includes/enhanced-test-helpers.bash"

setup() {
    setup_enhanced_test_environment
    source_includes
}

teardown() {
    cleanup_enhanced_test_environment
}

# ----- Section: Basic Functionality Tests -----

# ============================================================================
# Test Name: "script executes without errors"
# Test Type: Smoke Test
# Test Scope: Validates that the script runs successfully with default parameters
# ============================================================================
@test "script executes without errors" {
    run "${BATS_TEST_DIRNAME}/../scripts/example-script.sh" --help
    [ "$status" -eq 0 ]
}
```

### Agent Test Template

```bash
#!/usr/bin/env bats
# ============================================================================
# Test Name: test-example-agent.bats
# Testing: example.agent.js
# Description: Test suite for example agent functionality
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../includes/agent-test-helpers.bash"

setup() {
    setup_agent_test_environment
}

teardown() {
    cleanup_agent_test_environment
}

# ----- Section: Agent Structure Tests -----

# ============================================================================
# Test Name: "agent follows LightSpeed WP standards"
# Test Type: Structure Validation
# Test Scope: Validates agent file structure and documentation
# ============================================================================
@test "agent follows LightSpeed WP standards" {
    assert_agent_follows_standards "example.agent.js"
}

# ============================================================================
# Test Name: "agent supports dry-run mode"
# Test Type: Safety Validation
# Test Scope: Ensures agent can run in dry-run mode without making changes
# ============================================================================
@test "agent supports dry-run mode" {
    run test_agent_dry_run "example.agent.js"
    [ "$status" -eq 0 ]
    assert_log_contains "DRY RUN"
}
```

## Integration with Main Test Helper

These enhanced helpers are designed to work alongside the main `test-helper.bash` file:

- Automatically loads basic helpers if available
- Extends functionality without replacing
- Maintains compatibility with existing tests
- Provides additional capabilities for complex testing scenarios

## Mocking and Fixtures

### Git Command Mocking

```bash
@test "handles git status command" {
    mock_git_command "status" "echo 'On branch main'"

    run git status
    [ "$status" -eq 0 ]
    [[ "$output" =~ "On branch main" ]]
}
```

### Test Fixtures

```bash
@test "processes configuration file" {
    local config_file
    config_file=$(create_fixture_file "test-config.json" '{"key": "value"}')

    run process_config "$config_file"
    [ "$status" -eq 0 ]
}
```

## Best Practices

1. **Use appropriate helpers**: Load only the helpers you need
2. **Proper setup/teardown**: Always clean up test environment
3. **Descriptive test names**: Use clear, descriptive test function names
4. **Document test scope**: Include test documentation blocks
5. **Isolate tests**: Each test should be independent
6. **Mock external dependencies**: Use mocking for git, APIs, etc.
7. **Validate standards**: Use assertion helpers for compliance checking

## Contributing

When adding new test helpers:

1. Follow the established naming convention
2. Include complete header documentation
3. Document all functions with proper format
4. Provide usage examples in this README
5. Ensure compatibility with existing helpers
6. Add tests for the helper functions themselves

## Integration with CI/CD

These test helpers integrate with the CI/CD pipeline:

- Support timeout handling for CI environments
- Provide fixtures for consistent testing
- Enable comprehensive validation in automated workflows
- Support both local and CI test execution

## References

- [Unified Frontmatter Schema](../../schemas/frontmatter.schema.json)
- [Enhanced Test Helpers](enhanced-test-helpers.bash)
- [Agent Test Helpers](agent-test-helpers.bash)
