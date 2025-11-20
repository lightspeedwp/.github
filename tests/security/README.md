---
title: "Security Tests"
description: "Test suite for validating agent security compliance, secret handling, and safe operation practices"
version: "1.0"
last_updated: "2025-11-18"
author: "LightSpeed WP Team"
category: "tests"
tags: ["security", "testing", "agents", "compliance", "bats"]
standards:
  - "https://github.com/lightspeedwp/.github/blob/develop/.github/instructions/coding-standards.instructions.md"
  - "https://github.com/lightspeedwp/.github/blob/develop/.github/custom-instructions.md"
references:
  - "../README.md"
  - "../../docs/TESTING.md"
  - "../../docs/SECURITY.md"
  - "../includes/agent-test-helpers.bash"
---

# Security Tests

Comprehensive test suite for validating that LightSpeed WP agents follow security best practices, handle secrets safely, and operate within established security boundaries.

## Overview

The security test suite ensures all agents:

- **Never expose secrets** in logs, output, or error messages
- **Handle malformed input** safely without crashes or vulnerabilities
- **Validate authentication** and authorization properly
- **Follow security standards** as defined in our coding guidelines
- **Protect sensitive data** throughout their lifecycle

## Test Files

| File                       | Purpose                   | Test Count | Status    |
| -------------------------- | ------------------------- | ---------- | --------- |
| `test-agent-security.bats` | Agent security validation | 15+        | ✅ Active |

## Test Categories

### 1. Secret Exposure Prevention

**Purpose:** Ensure agents never leak sensitive tokens, credentials, or API keys.

**Tests:**

- GitHub token exposure in logs
- Token pattern detection (ghp*, gho*, ghu\_ prefixes)
- Environment variable leakage
- Debug output sanitization
- Error message security

**Coverage:**

- All agent types (`.agent.js` files)
- Dry-run and production modes
- Standard output and error streams
- Log files and debug output

### 2. Input Validation & Safety

**Purpose:** Validate agents handle malformed, malicious, or unexpected input safely.

**Tests:**

- Malformed JSON input handling
- Oversized payload rejection
- Invalid event type handling
- Missing required fields
- Injection attack prevention

**Coverage:**

- GitHub event payloads
- Configuration files
- API responses
- User input validation

### 3. Authentication & Authorization

**Purpose:** Ensure proper authentication checks and authorization enforcement.

**Tests:**

- Missing token handling
- Invalid token rejection
- Permission verification
- Scope validation
- Rate limiting respect

**Coverage:**

- GitHub API authentication
- Third-party service auth
- Token lifecycle management

## Running the Tests

### Run All Security Tests

```bash
# From repository root
bats tests/security/test-agent-security.bats

# Using npm script
npm run test:security
```

### Run Specific Test

```bash
# Run single test by name
bats tests/security/test-agent-security.bats -f "agents do not expose"
```

### With Verbose Output

```bash
# See detailed test execution
bats -t tests/security/test-agent-security.bats
```

## Test Infrastructure

### Dependencies

- **Bats**: Bash Automated Testing System
- **Agent Test Helpers**: Shared utilities from `../includes/agent-test-helpers.bash`
- **Node.js**: For running JavaScript agents in tests

### Helper Functions

Security tests utilize these helper functions:

- `setup_agent_test_environment()` - Prepares isolated test environment
- `cleanup_agent_test_environment()` - Cleans up after tests
- `create_mock_github_event()` - Generates test GitHub events
- `mock_github_api()` - Mocks GitHub API responses

### Environment Variables

Tests use these environment variables:

| Variable       | Purpose                    | Default                       |
| -------------- | -------------------------- | ----------------------------- |
| `AGENTS_DIR`   | Location of agents to test | `../../.github/agents`        |
| `GITHUB_TOKEN` | Test token for validation  | `ghp_test_secret_token_12345` |
| `DRY_RUN`      | Enable dry-run mode        | `true`                        |

## Writing Security Tests

### Test Template

```bash
@test "description of security check" {
    # Arrange: Set up test conditions
    export SENSITIVE_VALUE="secret_data"

    # Act: Run agent or operation
    run node "$AGENTS_DIR/some.agent.js"

    # Assert: Verify security requirement
    [[ ! "$output" =~ "$SENSITIVE_VALUE" ]]
    [ "$status" -eq 0 ]
}
```

### Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up sensitive test data
3. **Coverage**: Test both success and failure paths
4. **Patterns**: Use regex patterns to catch variations
5. **Timeouts**: Set reasonable timeouts to prevent hangs

### Common Assertions

```bash
# Token not in output
[[ ! "$output" =~ "ghp_[A-Za-z0-9_]{36}" ]]

# Graceful error handling
[ "$status" -ne 0 ]
[[ "$output" =~ "authentication" ]]

# No error logs
[[ ! "$output" =~ "ERROR" ]]

# Safe defaults
[[ "$output" =~ "DRY_RUN=true" ]]
```

## Security Standards

All agents must comply with:

1. **OWASP Top 10** - Address common vulnerabilities
2. **Secrets Management** - Never log or expose credentials
3. **Input Validation** - Validate all external input
4. **Least Privilege** - Request minimum required permissions
5. **Safe Defaults** - Fail securely by default

## Test Coverage Goals

| Area                 | Current | Target | Status         |
| -------------------- | ------- | ------ | -------------- |
| Token exposure tests | 85%     | 95%    | 🟡 In Progress |
| Input validation     | 75%     | 90%    | 🟡 In Progress |
| Auth/authz tests     | 80%     | 95%    | 🟡 In Progress |
| Error handling       | 70%     | 85%    | 🟡 In Progress |

## Related Documentation

- [Main Test Documentation](../README.md)
- [Test Coverage Summary](../TEST_COVERAGE_SUMMARY.md)
- [Security Policy](../../SECURITY.md)
- [Agent Test Helpers](../includes/agent-test-helpers.bash)
- [Coding Standards](../../.github/instructions/coding-standards.instructions.md)

## Continuous Integration

Security tests run automatically:

- **On PR creation** - Via `.github/workflows/test.yml`
- **On PR updates** - To catch regressions
- **On schedule** - Weekly security validation
- **Pre-release** - Required before version bumps

## Troubleshooting

### Test Failures

**Token exposure detected:**

```bash
# Review agent logging code
grep -r "console.log.*TOKEN" .github/agents/

# Sanitize debug output
# Replace sensitive vars before logging
```

**Timeout errors:**

```bash
# Increase timeout in test
run timeout 60s node "$agent"

# Check for infinite loops
# Review agent execution flow
```

**Mock setup failures:**

```bash
# Verify helper scripts loaded
load "../includes/agent-test-helpers.bash"

# Check environment setup
echo "$AGENTS_DIR"
ls "$AGENTS_DIR"
```

## Contributing

When adding new security tests:

1. Follow existing test structure
2. Document security requirement being tested
3. Include both positive and negative test cases
4. Update this README with new test descriptions
5. Ensure tests are deterministic and fast
6. Add appropriate timeout guards

## Maintenance

- **Review quarterly** - Ensure tests align with evolving security standards
- **Update for new agents** - Add coverage when new agents are created
- **Monitor failures** - Investigate and fix any recurring issues
- **Benchmark performance** - Keep test execution time reasonable

---

**Last Updated:** 2025-11-18
**Maintained By:** LightSpeed WP Team
**Test Framework:** Bats (Bash Automated Testing System)
**Status:** ✅ Active | 🟢 Passing
