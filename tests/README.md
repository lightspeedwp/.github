# Tests Directory

This folder contains all automated tests for the LightSpeed WP automation project. All tests are now organised by script type and feature area, with a single `utility` subfolder for all script tests, and a dedicated folder for Jest (JavaScript) tests.

## Structure

- **utility/**: Bats and Jest tests for all scripts in `/scripts/utility/` (including all former maintenance scripts).
  - `.bats` files: Shell/CLI tests for Node.js and shell scripts.
  - `.test.js` files: Jest unit tests for Node.js modules.
- **jest/**: Jest tests for agent modules and advanced JS logic.
- `test-helper.bash`: Shared Bats test helpers for setup/teardown and environment isolation.
- `tests-run-all-tests.bats`: Bats test for the test runner script.
- `TEST_COVERAGE_SUMMARY.md`: Detailed documentation of test coverage, structure, and best practices.

## Usage

- Run all Bats tests: `bats tests/`
- Run all tests with the runner: `./run-all-tests.sh`
- Run Jest tests: `npm test` or `npx jest`

## Best Practices

- Every script in `/scripts/utility/` should have a corresponding test here.
- Use `test-helper.bash` for consistent setup and teardown.
- Expand tests to cover both success and failure scenarios.
- Keep test names and descriptions clear and maintainable.

See `TEST_COVERAGE_SUMMARY.md` for full coverage details and examples.
