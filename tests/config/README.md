---
title: 'Configuration Tests'
description: 'Test suite for validating agent configuration handling, environment variables, and operational modes'
version: '1.0'
last_updated: '2025-11-18'
author: 'LightSpeed WP Team'
category: 'tests'
tags: ['config', 'testing', 'agents', 'environment', 'bats']
standards:
  - 'https://github.com/lightspeedwp/.github/blob/develop/.github/instructions/coding-standards.instructions.md'
  - 'https://github.com/lightspeedwp/.github/blob/develop/.github/custom-instructions.md'
references:
  - '../README.md'
  - '../../docs/TESTING.md'
  - '../../docs/config/README.md'
  - '../includes/agent-test-helpers.bash'
---

# Configuration Tests

Comprehensive test suite for validating that LightSpeed WP agents handle configuration correctly, including environment variables, operational modes, and graceful degradation when configuration is missing or invalid.

## Overview

The configuration test suite ensures all agents:

- **Handle missing configuration** gracefully with meaningful errors
- **Validate environment variables** and use safe defaults
- **Respect operational modes** (dry-run, debug, production)
- **Degrade gracefully** when optional config is unavailable
- **Provide clear feedback** when configuration is invalid

## Test Files

| File | Purpose | Test Count | Status |
|------|---------|-----------|--------|
| `test-agent-config.bats` | Agent configuration validation | 12+ | ✅ Active |

## Test Categories

### 1. Environment Variable Handling

**Purpose:** Ensure agents properly validate and use environment variables.

**Tests:**
- Missing required variables (GITHUB_TOKEN, GITHUB_REPOSITORY)
- Invalid variable formats
- Default value application
- Variable precedence and overrides
- Sensitive variable protection

**Coverage:**
- Required environment variables
- Optional configuration
- Fallback mechanisms
- Validation logic

### 2. Operational Mode Validation

**Purpose:** Verify agents respect different operational modes.

**Tests:**
- Dry-run mode (no actual changes)
- Debug mode (verbose logging)
- Production mode (minimal output)
- Development mode (additional checks)
- CI/CD mode (non-interactive)

**Coverage:**
- Mode detection
- Mode-specific behavior
- Mode transitions
- Output formatting

### 3. Configuration File Handling

**Purpose:** Test agent behavior with various configuration file scenarios.

**Tests:**
- Missing configuration files
- Invalid JSON/YAML syntax
- Schema validation
- Required fields validation
- Optional fields handling

**Coverage:**
- Agent config files
- Workflow configuration
- Custom settings
- Defaults application

### 4. Graceful Degradation

**Purpose:** Ensure agents fail safely when configuration is problematic.

**Tests:**
- Meaningful error messages
- Non-zero exit codes
- Logging before exit
- No partial operations
- State cleanup

**Coverage:**
- Startup validation
- Runtime checks
- Error reporting
- Clean shutdown

## Running the Tests

### Run All Configuration Tests

```bash
# From repository root
bats tests/config/test-agent-config.bats

# Using npm script
npm run test:config
```

### Run Specific Test

```bash
# Run single test by name
bats tests/config/test-agent-config.bats -f "missing GITHUB_TOKEN"
```

### With Verbose Output

```bash
# See detailed test execution
bats -t tests/config/test-agent-config.bats
```

## Test Infrastructure

### Dependencies

- **Bats**: Bash Automated Testing System
- **Agent Test Helpers**: Shared utilities from `../includes/agent-test-helpers.bash`
- **Node.js**: For running JavaScript agents in tests

### Helper Functions

Configuration tests utilize these helper functions:

- `setup_agent_test_environment()` - Prepares isolated test environment
- `cleanup_agent_test_environment()` - Cleans up after tests
- `create_mock_github_event()` - Generates test GitHub events
- `mock_env_var()` - Mocks environment variables

### Environment Variables

Tests manipulate these environment variables:

| Variable | Purpose | Test Values |
|----------|---------|-------------|
| `GITHUB_TOKEN` | GitHub authentication | Valid/invalid/missing |
| `GITHUB_REPOSITORY` | Repository context | Valid/invalid/missing |
| `DRY_RUN` | Enable dry-run mode | `true`/`false`/missing |
| `DEBUG` | Enable debug mode | `true`/`false`/missing |
| `CI` | CI environment indicator | `true`/`false` |

## Writing Configuration Tests

### Test Template

```bash
@test "agent handles missing required config" {
    # Arrange: Remove required variable
    unset GITHUB_TOKEN

    # Act: Run agent
    run timeout 10s node "$AGENTS_DIR/some.agent.js"

    # Assert: Graceful failure with message
    [ "$status" -ne 0 ]
    [[ "$output" =~ "GITHUB_TOKEN" ]] ||
    [[ "$output" =~ "authentication" ]]
}
```

### Best Practices

1. **Environment Isolation**: Save and restore original environment
2. **Cleanup**: Always restore environment in teardown
3. **Clear Assertions**: Check both status and output
4. **Timeouts**: Prevent tests from hanging
5. **Patterns**: Match flexible error message formats

### Common Assertions

```bash
# Variable required
unset REQUIRED_VAR
run node "$agent"
[ "$status" -ne 0 ]
[[ "$output" =~ "REQUIRED_VAR" ]]

# Dry-run respected
export DRY_RUN=true
run node "$agent"
[[ "$output" =~ "DRY_RUN" ]] || [[ "$output" =~ "dry-run" ]]

# Debug output present
export DEBUG=true
run node "$agent"
[[ "$output" =~ "DEBUG" ]] || [[ "$output" =~ "Debugging enabled" ]]

# Safe defaults applied
unset OPTIONAL_VAR
run node "$agent"
[ "$status" -eq 0 ]
[[ "$output" =~ "Using default" ]]
```

## Configuration Standards

All agents must comply with:

1. **Fail Fast** - Validate configuration at startup
2. **Clear Errors** - Provide actionable error messages
3. **Safe Defaults** - Use secure, sensible defaults
4. **Environment First** - Prefer environment variables over files
5. **Documentation** - Document all configuration options

## Required Environment Variables

### Minimum Required

All agents must handle these variables:

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| `GITHUB_TOKEN` | GitHub authentication | ✅ Yes | None |
| `GITHUB_REPOSITORY` | Repository context | ✅ Yes | None |

### Common Optional

These variables should be supported where applicable:

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| `DRY_RUN` | Prevent actual changes | ❌ No | `false` |
| `DEBUG` | Enable verbose logging | ❌ No | `false` |
| `CI` | CI environment indicator | ❌ No | Autodetect |
| `GITHUB_EVENT_PATH` | Event payload path | ❌ No | None |

## Test Coverage Goals

| Area | Current | Target | Status |
|------|---------|--------|--------|
| Env var validation | 75% | 95% | 🟡 In Progress |
| Mode detection | 80% | 90% | 🟡 In Progress |
| Error messages | 85% | 95% | 🟢 Good |
| Defaults handling | 70% | 85% | 🟡 In Progress |

## Related Documentation

- [Main Test Documentation](../README.md)
- [Test Coverage Summary](../TEST_COVERAGE_SUMMARY.md)
- [Configuration Hub](../../docs/config/README.md)
- [Agent Test Helpers](../includes/agent-test-helpers.bash)
- [Environment Setup](../../docs/DEVELOPMENT.md)

## Continuous Integration

Configuration tests run automatically:

- **On PR creation** - Via `.github/workflows/test.yml`
- **On PR updates** - To catch configuration regressions
- **Pre-commit** - Via Husky hooks (optional)
- **Pre-release** - Required before version bumps

## Troubleshooting

### Test Failures

**Environment not restored:**
```bash
# Ensure teardown saves/restores
setup() {
    export ORIGINAL_TOKEN="$GITHUB_TOKEN"
}

teardown() {
    export GITHUB_TOKEN="$ORIGINAL_TOKEN"
}
```

**Tests affecting each other:**
```bash
# Check for global state
# Ensure proper cleanup
# Use unique test data
```

**Timeout on missing config:**
```bash
# Agent might wait for input
# Add timeout to tests
run timeout 10s node "$agent"
```

### Common Issues

**Missing error message:**
- Verify agent validates config at startup
- Check error output goes to stderr/stdout
- Ensure non-zero exit code on failure

**Test environment contamination:**
- Use `setup()` and `teardown()` consistently
- Save original environment
- Clean up temp files

## Example: Configuration Validation Flow

```bash
@test "agent requires GITHUB_TOKEN and fails gracefully" {
    # Save original environment
    export ORIGINAL_GITHUB_TOKEN="$GITHUB_TOKEN"

    # Remove required variable
    unset GITHUB_TOKEN

    # Run agent with timeout
    run timeout 10s node "$AGENTS_DIR/example.agent.js"

    # Verify graceful failure
    [ "$status" -ne 0 ]

    # Verify meaningful error
    [[ "$output" =~ "GITHUB_TOKEN" ]] ||
    [[ "$output" =~ "token" ]] ||
    [[ "$output" =~ "authentication" ]]

    # Verify no partial operations
    [[ ! "$output" =~ "SUCCESS" ]]

    # Restore environment
    export GITHUB_TOKEN="$ORIGINAL_GITHUB_TOKEN"
}
```

## Contributing

When adding new configuration tests:

1. Follow the test template above
2. Document the configuration requirement being tested
3. Include both positive and negative test cases
4. Update this README with new test descriptions
5. Ensure tests are fast and deterministic
6. Add appropriate timeout guards
7. Clean up environment in teardown

## Maintenance

- **Review quarterly** - Ensure tests align with configuration standards
- **Update for new config** - Add tests when new options are introduced
- **Monitor failures** - Investigate and fix any recurring issues
- **Refactor when needed** - Keep tests maintainable and clear

---

**Last Updated:** 2025-11-18
**Maintained By:** LightSpeed WP Team
**Test Framework:** Bats (Bash Automated Testing System)
**Status:** ✅ Active | 🟢 Passing
