---
title: 'Integration Tests'
description: 'Test suite for validating cross-agent compatibility, multi-agent scenarios, and end-to-end workflows'
version: '1.0'
last_updated: '2025-11-18'
author: 'LightSpeed WP Team'
category: 'tests'
tags: ['integration', 'testing', 'agents', 'compatibility', 'bats', 'e2e']
standards:
  - 'https://github.com/lightspeedwp/.github/blob/develop/.github/instructions/coding-standards.instructions.md'
  - 'https://github.com/lightspeedwp/.github/blob/develop/.github/custom-instructions.md'
references:
  - '../README.md'
  - '../../docs/TESTING.md'
  - '../../docs/WORKFLOWS.md'
  - '../includes/agent-test-helpers.bash'
---

# Integration Tests

Comprehensive test suite for validating that multiple agents work together correctly, don't interfere with each other, and produce consistent results across different combinations and scenarios.

## Overview

The integration test suite ensures:

- **Agent compatibility** - Multiple agents can run on same event
- **No interference** - Agents don't conflict or corrupt shared state
- **Consistent behavior** - Agents produce expected results together
- **End-to-end workflows** - Complete automation workflows work correctly
- **Real-world scenarios** - Common use cases are validated

## Test Files

| File | Purpose | Test Count | Status |
|------|---------|-----------|--------|
| `test-agent-compatibility.bats` | Cross-agent compatibility | 8+ | ✅ Active |

## Test Categories

### 1. Cross-Agent Compatibility

**Purpose:** Ensure multiple agents can run on the same event without conflicts.

**Tests:**
- Multiple agents on same PR event
- Label conflicts prevention
- Concurrent agent execution
- Shared resource management
- State isolation

**Coverage:**
- PR lifecycle events
- Issue lifecycle events
- Label management
- Status updates
- Comment handling

### 2. Agent Interaction Patterns

**Purpose:** Validate agents interact correctly when processing related events.

**Tests:**
- Sequential agent execution
- Dependent agent workflows
- Shared data access patterns
- Event chain handling
- State transitions

**Coverage:**
- PR labeling → status checks
- Issue triage → assignment
- Comment → labeling workflows
- Release → changelog automation

### 3. Workflow Integration

**Purpose:** Test complete automation workflows from end to end.

**Tests (Planned):**
- PR open → label → review → merge flow
- Issue open → triage → assignment flow
- Release preparation workflow
- Documentation update workflow
- Security scan workflow

**Coverage:**
- GitHub Actions workflows
- Agent orchestration
- External tool integration
- Notification systems

### 4. Conflict Resolution

**Purpose:** Ensure agents handle conflicts gracefully.

**Tests:**
- Duplicate label addition
- Concurrent modifications
- Race condition handling
- Lock mechanism validation
- Retry logic

**Coverage:**
- API rate limiting
- Concurrent access
- State conflicts
- Error recovery

## Running the Tests

### Run All Integration Tests

```bash
# From repository root
bats tests/integration/test-agent-compatibility.bats

# Using npm script
npm run test:integration
```

### Run Specific Test

```bash
# Run single test by name
bats tests/integration/test-agent-compatibility.bats -f "multiple agents"
```

### With Verbose Output

```bash
# See detailed test execution
bats -t tests/integration/test-agent-compatibility.bats
```

## Test Infrastructure

### Dependencies

- **Bats**: Bash Automated Testing System
- **Agent Test Helpers**: Shared utilities from `../includes/agent-test-helpers.bash`
- **Node.js**: For running JavaScript agents in tests
- **GitHub API Mocking**: Simulated GitHub API responses

### Helper Functions

Integration tests utilize these helper functions:

- `setup_agent_test_environment()` - Prepares isolated test environment
- `cleanup_agent_test_environment()` - Cleans up after tests
- `create_mock_github_event()` - Generates complex test events
- `mock_github_api()` - Mocks multi-agent API interactions
- `simulate_agent_run()` - Runs multiple agents in sequence
- `verify_no_conflicts()` - Validates clean agent execution

### Environment Variables

Tests use these environment variables:

| Variable | Purpose | Default |
|----------|---------|---------|
| `AGENTS_DIR` | Location of agents to test | `../../.github/agents` |
| `GITHUB_EVENT_PATH` | Complex event payload | Generated |
| `DRY_RUN` | Enable dry-run mode | `true` |
| `PARALLEL_AGENTS` | Enable concurrent testing | `false` |

## Writing Integration Tests

### Test Template

```bash
@test "multiple agents work together correctly" {
    # Arrange: Create realistic scenario
    create_mock_github_event "pull_request"

    # Act: Run multiple agents
    run_agent "labeler.agent.js"
    labeler_output="$output"

    run_agent "reviewer.agent.js"
    reviewer_output="$output"

    # Assert: No conflicts, expected behavior
    verify_no_conflicts
    [[ "$labeler_output" =~ "Labels applied" ]]
    [[ "$reviewer_output" =~ "Reviewers assigned" ]]
}
```

### Best Practices

1. **Realistic Scenarios**: Use real-world event payloads
2. **Multiple Agents**: Test common agent combinations
3. **State Verification**: Check state after each agent
4. **Isolation**: Ensure tests don't affect each other
5. **Timeouts**: Set appropriate timeouts for multi-agent runs

### Common Assertions

```bash
# No conflicts
verify_no_conflicts
[ "$status" -eq 0 ]

# Both agents succeeded
[[ "$agent1_output" =~ "SUCCESS" ]]
[[ "$agent2_output" =~ "SUCCESS" ]]

# No duplicate operations
label_count=$(echo "$output" | grep -c "label:")
[ "$label_count" -eq 1 ]

# Proper sequencing
[[ "$timestamp1" -lt "$timestamp2" ]]
```

## Integration Testing Patterns

### Pattern 1: Sequential Agent Execution

```bash
@test "agents run sequentially without interference" {
    # Agent 1 labels PR
    run_agent "labeler.agent.js"
    [ "$status" -eq 0 ]

    # Agent 2 assigns reviewers based on labels
    run_agent "reviewer-assigner.agent.js"
    [ "$status" -eq 0 ]

    # Agent 3 updates project board
    run_agent "project-sync.agent.js"
    [ "$status" -eq 0 ]

    # Verify complete flow
    verify_pr_state_consistent
}
```

### Pattern 2: Concurrent Agent Execution

```bash
@test "agents run concurrently without conflicts" {
    # Start multiple agents in background
    run_agent_async "labeler.agent.js" &
    pid1=$!

    run_agent_async "size-calculator.agent.js" &
    pid2=$!

    # Wait for all to complete
    wait $pid1 $pid2

    # Verify no conflicts
    verify_no_api_conflicts
    verify_no_state_corruption
}
```

### Pattern 3: Event Chain Handling

```bash
@test "agents handle event chains correctly" {
    # Trigger initial event
    create_pr_opened_event

    # Process through agent pipeline
    run_full_agent_pipeline

    # Verify complete workflow
    assert_labels_applied
    assert_reviewers_assigned
    assert_checks_triggered
    assert_project_updated
}
```

## Integration Test Scenarios

### Scenario 1: PR Lifecycle

**Flow:**
1. PR opened → Labeler adds labels
2. Labels added → Reviewer assigns team members
3. Review requested → Status enforcer tracks reviews
4. Approved → Merge coordinator prepares merge
5. Merged → Release notes generator updates changelog

**Tests:**
- Each step succeeds
- No duplicate operations
- Correct state transitions
- Proper notifications

### Scenario 2: Issue Triage

**Flow:**
1. Issue opened → Type detector identifies issue type
2. Type set → Labeler adds appropriate labels
3. Labels set → Assignment agent assigns to team
4. Assigned → Project sync adds to board
5. Prioritized → Notification sent to team

**Tests:**
- Classification accuracy
- Label consistency
- Assignment rules followed
- Project sync successful

### Scenario 3: Release Preparation

**Flow:**
1. Release PR created → Version bumper updates versions
2. Version updated → Changelog generator collects changes
3. Changelog ready → Documentation updater syncs docs
4. Docs updated → Release drafter prepares notes
5. Notes ready → Approval workflow triggered

**Tests:**
- Version consistency
- Changelog completeness
- Documentation accuracy
- Approval gates work

## Test Coverage Goals

| Area | Current | Target | Status |
|------|---------|--------|--------|
| Agent compatibility | 70% | 90% | 🟡 In Progress |
| Workflow integration | 50% | 85% | 🟡 In Progress |
| Conflict handling | 60% | 80% | 🟡 In Progress |
| Error recovery | 55% | 75% | 🟡 In Progress |

## Related Documentation

- [Main Test Documentation](../README.md)
- [Test Coverage Summary](../TEST_COVERAGE_SUMMARY.md)
- [Workflows Documentation](../../docs/WORKFLOWS.md)
- [Agent Test Helpers](../includes/agent-test-helpers.bash)
- [PR Workflow Guide](../../docs/git-workflow/pr-workflow-guide-v1-1.md)

## Continuous Integration

Integration tests run automatically:

- **On PR creation** - Via `.github/workflows/test.yml`
- **On PR updates** - To catch integration regressions
- **Nightly** - Full integration test suite
- **Pre-release** - Required before version bumps

## Troubleshooting

### Test Failures

**Agent conflicts:**
```bash
# Review agent execution order
# Check for shared state modifications
# Verify API call sequencing

# Debug with verbose output
DEBUG=true bats -t tests/integration/
```

**Race conditions:**
```bash
# Add synchronization points
wait_for_agent_completion

# Use locks for shared resources
acquire_test_lock "resource_name"

# Increase timeouts
run timeout 60s test_scenario
```

**State corruption:**
```bash
# Verify cleanup between tests
teardown() {
    cleanup_all_agent_state
    reset_test_environment
}

# Check for global state leakage
verify_test_isolation
```

### Common Issues

**Agents interfere with each other:**
- Ensure proper state isolation
- Check for shared resource locks
- Verify API mocking doesn't overlap
- Review execution order dependencies

**Timing issues:**
- Add appropriate sleep/wait calls
- Use condition-based waiting
- Increase timeout values
- Check for async operations

**Complex scenarios fail:**
- Break down into smaller tests
- Add intermediate verifications
- Log state at each step
- Use verbose debugging mode

## Example: Multi-Agent Compatibility Test

```bash
@test "multiple agents can run on same PR event without conflicts" {
    # Create realistic PR event
    cat > "$GITHUB_EVENT_PATH" << 'EOF'
{
  "action": "opened",
  "pull_request": {
    "number": 123,
    "title": "feat(security): Add authentication improvements",
    "body": "This PR adds new security features.",
    "changed_files": 5,
    "additions": 150,
    "deletions": 25
  }
}
EOF

    # Run first agent (labeler)
    run timeout 30s node "$AGENTS_DIR/labeler.agent.js"
    [ "$status" -eq 0 ]
    labeler_output="$output"

    # Run second agent (size calculator)
    run timeout 30s node "$AGENTS_DIR/size-calculator.agent.js"
    [ "$status" -eq 0 ]
    size_output="$output"

    # Run third agent (reviewer assigner)
    run timeout 30s node "$AGENTS_DIR/reviewer-assigner.agent.js"
    [ "$status" -eq 0 ]
    reviewer_output="$output"

    # Verify no conflicts
    verify_no_api_conflicts

    # Verify each agent succeeded
    [[ "$labeler_output" =~ "feat" ]] || [[ "$labeler_output" =~ "security" ]]
    [[ "$size_output" =~ "size:" ]]
    [[ "$reviewer_output" =~ "reviewer" ]]
}
```

## Contributing

When adding new integration tests:

1. Identify the integration scenario to test
2. Create realistic, complex event payloads
3. Test common agent combinations
4. Verify no conflicts or interference
5. Update this README with scenario description
6. Document expected behavior and interactions
7. Add troubleshooting tips for common failures

## Maintenance

- **Review quarterly** - Ensure tests cover current workflows
- **Update for new agents** - Add integration tests for new agents
- **Monitor failures** - Track and fix flaky integration tests
- **Expand scenarios** - Add new real-world workflow tests
- **Performance tracking** - Keep test execution time reasonable

## Future Enhancements

Planned integration test improvements:

1. **Parallel Execution Testing** - Test true concurrent agent runs
2. **External API Integration** - Test with real external services
3. **Performance Benchmarking** - Track multi-agent performance
4. **Chaos Testing** - Random failure injection
5. **Load Testing** - High-volume event handling

---

**Last Updated:** 2025-11-18
**Maintained By:** LightSpeed WP Team
**Test Framework:** Bats (Bash Automated Testing System)
**Status:** ✅ Active | 🟢 Passing
