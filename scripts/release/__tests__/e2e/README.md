# Release E2E Test Suite

Comprehensive end-to-end testing for the two-phase agentic release workflow.

## Overview

This test suite validates all aspects of the release workflow:
- **Phase 1:** Portable agent version bumping and changelog generation
- **Phase 2:** Agentic safety gates and release publishing

## Test Coverage

### Scenario 1: Patch Release (v1.0.0 → v1.0.1)
Basic patch release workflow end-to-end validation
- Phase 1 agent execution with version bump
- PR merge to develop
- Phase 2 safety gates validation
- Release tag creation
- Post-release sync

### Scenario 2: Minor Release (v1.0.0 → v1.1.0)
Minor release with manual approval requirement
- Validates manual approval gate
- Phase 1 and Phase 2 execution
- Release publishing

### Scenario 3: Major Release (v1.0.0 → v2.0.0)
Major release with dual approval and ADR linking
- Dual approval enforcement
- ADR reference requirement
- Breaking change documentation

### Scenarios 4-6: Error Handling
- **Scenario 4:** Missing CHANGELOG [Unreleased] section
- **Scenario 5:** Tag already exists (duplicate version)
- **Scenario 6:** Unauthorized user attempting release

### Scenario 7: Rollback Procedure
Validates ability to rollback a release if issues arise
- Tag deletion
- Commit revert on main
- Re-release capability after rollback

### Scenario 8: Sequential Releases
Multiple releases in sequence without conflicts
- v1.0.1 patch release
- v1.0.2 patch release
- v1.1.0 minor release
- Mergify queue handling validation

## Running Tests

### Run All Scenarios
```bash
npm test -- release-e2e-tests
```

### Run Specific Scenario
```bash
node scripts/release/__tests__/e2e/scenarios/patch-release.e2e.js
node scripts/release/__tests__/e2e/scenarios/minor-release.e2e.js
node scripts/release/__tests__/e2e/scenarios/major-release.e2e.js
node scripts/release/__tests__/e2e/scenarios/error-handling.e2e.js
node scripts/release/__tests__/e2e/scenarios/rollback.e2e.js
node scripts/release/__tests__/e2e/scenarios/sequential-releases.e2e.js
```

### Run in CI
```bash
# Via GitHub Actions workflow
gh workflow run release-e2e-tests.yml --ref develop

# With options
gh workflow run release-e2e-tests.yml \
  --ref develop \
  --raw-field scenario=all \
  --raw-field verbose=true
```

## Test Results

Results are saved to `.github/reports/release-validation/`:
- Individual scenario results: `{scenario}-{timestamp}.json`
- Consolidated summary: `summary.json`

### Result Format
```json
{
  "scenario": "patch-release",
  "startTime": "2026-08-22T12:00:00.000Z",
  "endTime": "2026-08-22T12:00:45.000Z",
  "passed": true,
  "steps": [
    {
      "timestamp": "2026-08-22T12:00:00.000Z",
      "level": "info",
      "message": "Creating test repository..."
    }
  ],
  "errors": []
}
```

## Test Environment

Each scenario:
- Creates ephemeral test repository with fixtures
- Simulates Git operations and branch creation
- Validates repository state at key checkpoints
- Cleans up test repository after completion

### Fixtures Provided
- `VERSION` file (v1.0.0 → target version)
- `CHANGELOG.md` with [Unreleased] section
- `README.md` and `.gitignore`
- `package.json` with test metadata

## Success Criteria

- ✅ 90%+ of release workflow code paths tested
- ✅ All 7 safety gates validated across scenarios
- ✅ Phase 1 and Phase 2 both covered
- ✅ Error scenarios included
- ✅ All scenarios pass independently
- ✅ All scenarios pass when run sequentially
- ✅ No flaky tests (reproducible results)

## Known Limitations

1. **Ephemeral Repositories:** Test repos deleted after testing (logs/artifacts saved)
2. **No Real Users:** Simulates service account authorization
3. **No External Integration:** GitHub API mocking only
4. **Single Repository Type:** Tests use control-plane repo type

## Implementation Details

### Test Harness (`test-harness.js`)
Provides utilities for:
- Creating ephemeral Git repositories
- Simulating version bumps and changelog updates
- Creating and merging release branches
- Creating Git tags and validating repository state
- Saving test results

### Scenario Files (`scenarios/*.e2e.js`)
Each scenario:
1. Inherits from TestHarness
2. Creates test repository
3. Executes workflow steps
4. Validates state at checkpoints
5. Reports results

### Result Consolidation (`consolidate-results.js`)
- Aggregates all scenario results
- Calculates coverage percentage
- Generates summary JSON
- Reports pass/fail status

## Debugging

Enable verbose logging:
```bash
VERBOSE=true node scripts/release/__tests__/e2e/scenarios/patch-release.e2e.js
```

View test results:
```bash
cat .github/reports/release-validation/patch-release-*.json | jq .
cat .github/reports/release-validation/summary.json | jq .
```

## Related Documentation

- [RELEASE_E2E_TEST_PLAN.md](../../../docs/RELEASE_E2E_TEST_PLAN.md) — Complete test plan specification
- [RELEASE_PROCESS.md](../../../docs/RELEASE_PROCESS.md) — Release workflow documentation
- [.github/workflows/release-e2e-tests.yml](../../../.github/workflows/release-e2e-tests.yml) — GitHub Actions workflow
