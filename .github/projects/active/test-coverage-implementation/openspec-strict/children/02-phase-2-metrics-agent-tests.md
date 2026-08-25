# Phase 2 - Metrics Agent Coverage

## Summary

Add test coverage for the metrics agent so its collection, aggregation, and reporting paths are reliable.

## Scope

- Task 2.1: create the test file structure.
- Task 2.2: add import and setup scaffolding.
- Task 2.3: test metric collection.
- Task 2.4: test GitHub API response handling.
- Task 2.5: test aggregation and calculations.
- Task 2.6: test report generation output.
- Task 2.7: test error handling and retries.
- Task 2.8: test edge cases and empty inputs.
- Task 2.9: test async timing and promise paths.
- Task 2.10: test mocking boundaries.
- Task 2.11: test file output side effects.
- Task 2.12: test logging behaviour.
- Task 2.13: test configuration-driven behaviour.
- Task 2.14: run the file-level coverage checks.
- Task 2.15: document the finished metrics coverage slice.

## Acceptance Criteria

- [ ] Metrics-agent test file exists and follows repo conventions.
- [ ] Core collection, aggregation, and reporting paths are covered.
- [ ] Error handling and empty-input edge cases are covered.
- [ ] The phase is documented and passes the required test run.

## Dependencies

- Phase 1 baseline checklist exists.
- Metrics agent source file is stable enough to test.

## Additional Context

This phase carries the largest single-file coverage lift in the programme.
