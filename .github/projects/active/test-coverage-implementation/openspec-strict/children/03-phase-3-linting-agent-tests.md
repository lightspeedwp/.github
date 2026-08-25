# Phase 3 - Linting Agent Coverage

## Summary

Add test coverage for the linting agent so lint parsing, rule execution, and reporting stay deterministic.

## Scope

- Task 3.1: create the test file structure.
- Task 3.2: add import and setup scaffolding.
- Task 3.3: test lint input parsing.
- Task 3.4: test rule selection and ordering.
- Task 3.5: test success output formatting.
- Task 3.6: test failure output formatting.
- Task 3.7: test missing-file behaviour.
- Task 3.8: test invalid-config handling.
- Task 3.9: test output grouping and deduplication.
- Task 3.10: test cache or memoisation boundaries.
- Task 3.11: test logging behaviour.
- Task 3.12: test asynchronous and promise flows.
- Task 3.13: test boundary inputs and empty sets.
- Task 3.14: run the file-level coverage checks.
- Task 3.15: document the finished linting coverage slice.

## Acceptance Criteria

- [ ] Linting-agent test file exists and follows repo conventions.
- [ ] Parsing, rule selection, and output formatting are covered.
- [ ] Failure modes and boundary cases are covered.
- [ ] The phase is documented and passes the required test run.

## Dependencies

- Phase 1 baseline checklist exists.
- Linting agent source file is stable enough to test.

## Additional Context

This phase should close the largest correctness gaps in lint rule handling.
