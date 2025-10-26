# Test Coverage Summary

This document provides an overview of the unit and integration tests for the LightSpeed WP automation scripts repository, reflecting the current `/tests` and `/scripts` folder structure and expanded subfolders.

## Test Suite Overview

## Directory Structure

### Tests Directory Organization

The `/tests/` directory is comprehensively organized with README documentation for each subfolder:

- **Core Test Structure**: `/tests/`
  - [`README.md`](./README.md) — Main testing framework documentation
  - [`TEST_COVERAGE_SUMMARY.md`](./TEST_COVERAGE_SUMMARY.md) — This coverage summary document
  - `test-helper.bash` — Shared Bats test helpers for all test suites
  - `tests-run-all-tests.bats` — Bats test for the test runner script

- **Test Category Folders**: `/tests/*/`
  - [`awesome-copilot/`](./awesome-copilot/README.md) — Jest tests for awesome-copilot scripts
  - [`includes/`](./includes/README.md) — Test helpers and shared utilities with subfolders:
    - [`cli/`](./includes/cli/README.md) — CLI utility test helpers
    - [`core/`](./includes/core/README.md) — Core testing functionality helpers  
    - [`deployment/`](./includes/deployment/README.md) — Deployment testing helpers
    - [`filesystem/`](./includes/filesystem/README.md) — File system operation helpers
  - [`maintenance/`](./maintenance/README.md) — Tests for maintenance and automation scripts
  - [`projects/`](./projects/README.md) — Project management and GitHub integration tests
    - [`fixtures/`](./projects/fixtures/README.md) — Test fixtures and sample data
  - [`pytests/`](./pytests/README.md) — Python-based tests for documentation validation
  - [`utility/`](./utility/README.md) — Bats and Jest tests for all utility scripts

### Related Directory Documentation

- **Scripts Directory**: `/scripts/`
  - [`README.md`](../scripts/README.md) — Main scripts documentation
  - `utility/` — All Node.js and shell scripts for automation, covered by tests in `/tests/utility/`
  - `includes/` — Shared code/configuration for scripts

- **Schemas Directory**: `/schemas/`  
  - [`README.md`](../schemas/README.md) — Schema validation documentation
  - [`coderabbit/`](../schemas/coderabbit/README.md) — CodeRabbit AI configuration schemas
  - [`header-footer-agent/`](../schemas/header-footer-agent/README.md) — WordPress automation schemas
  - [`wordpress/`](../schemas/wordpress/README.md) — WordPress-specific schema definitions

- **Coverage Directory**: `/coverage/`
  - [`README.md`](../coverage/README.md) — Test coverage reporting documentation  
  - [`lcov-report/`](../coverage/lcov-report/README.md) — HTML coverage reports and assets

- **Total Test Files**: 50+ (Bats and Jest combined)
- **Total Test Cases**: 1000+ (across all scripts and agents)

## Test Organization

- **Bats Tests**: All `.bats` files in `/tests/utility/` test the corresponding scripts in `/scripts/utility/` (including all maintenance and versioning scripts).
  - Each script has a dedicated Bats test file.
  - Bats tests check script existence, CLI usage, help output, and core logic.

- **Jest Tests**: All `.test.js` files in `/tests/utility/` and `/tests/jest/` test Node.js modules and agent logic.
  - Jest tests cover function exports, input validation, and integration with other modules.

- **Test Helpers**: `test-helper.bash` provides setup/teardown and shared logic for Bats tests.
  
- **Test Runner**: `tests-run-all-tests.bats` and `run-all-tests.sh` ensure all tests are discoverable and runnable in CI/CD.

## How to Run Tests

```bash
# Run all Bats tests in the /tests directory and subfolders using the test runner script
./run-all-tests.sh

# Run all Jest tests
npm test


# Run only Bats tests for utility scripts (all scripts)
bats tests/utility/

# Run only Jest tests for agents
npx jest tests/jest/

# Run a specific Bats test file
bats tests/utility/utility-template.bats
```

## Testing Approach

- Structure and safety validation for all scripts
- Function existence and signature checks
- Input validation and edge case handling
- CLI and API integration
- Security and performance verification
- Code quality and documentation checks

## Best Practices

- Setup/teardown for isolated environments
- Descriptive, maintainable test names
- Coverage of both happy paths and failure scenarios
- Ensure every script in `/scripts/utility/` has a corresponding test in `/tests/utility/`
  - Expand Jest tests for all agent modules

## Reference

See this file for full details. For folder-level documentation, see:

### Primary Documentation

- [`/tests/README.md`](./README.md) — Main testing framework documentation
- [`/scripts/README.md`](../scripts/README.md) — Scripts directory documentation
- [`/schemas/README.md`](../schemas/README.md) — Schema validation documentation  
- [`/coverage/README.md`](../coverage/README.md) — Coverage reporting documentation

### Test Folder Documentation  

- [`awesome-copilot/README.md`](./awesome-copilot/README.md) — Jest tests for awesome-copilot scripts
- [`includes/README.md`](./includes/README.md) — Test helpers and utilities
- [`maintenance/README.md`](./maintenance/README.md) — Maintenance script tests
- [`projects/README.md`](./projects/README.md) — Project management tests
- [`pytests/README.md`](./pytests/README.md) — Python documentation validation tests
- [`utility/README.md`](./utility/README.md) — Utility script tests

### Supporting Documentation

- [`includes/cli/README.md`](./includes/cli/README.md) — CLI testing helpers
- [`includes/core/README.md`](./includes/core/README.md) — Core testing functionality
- [`includes/deployment/README.md`](./includes/deployment/README.md) — Deployment testing
- [`includes/filesystem/README.md`](./includes/filesystem/README.md) — File system helpers
- [`projects/fixtures/README.md`](./projects/fixtures/README.md) — Test fixtures and data
- [`schemas/coderabbit/README.md`](../schemas/coderabbit/README.md) — CodeRabbit schema validation
- [`schemas/header-footer-agent/README.md`](../schemas/header-footer-agent/README.md) — WordPress automation schemas
- [`coverage/lcov-report/README.md`](../coverage/lcov-report/README.md) — HTML coverage reports

### Project Scripts

All scripts are now in `/scripts/utility/` and covered by reciprocal Bats tests in `/tests/utility/`.

#### Shared Test Usage

Run shared tests for any project script with:

```bash
SCRIPT=path/to/script.sh bats tests/project-scripts/test-project-auth.bats
SCRIPT=path/to/script.sh bats tests/project-scripts/test-project-csv.bats
```

### 1. **tests/utility-functions.bats** (370+ tests)

Comprehensive test suite for `scripts/utility/utility-functions.sh` covering:

#### Basic Validation (4 tests)

- Script structure and safety features
- Shebang and pipefail configuration
- Sourcing capability
- Constants definition

#### Logging Functions (16 tests)

- `log_info()`, `log_error()`, `log_warn()`, `log_success()`, `log_debug()`
- Color output verification
- Log level filtering
- Special character handling
- Multi-line message support

#### Utility Functions (35+ tests)

- `command_exists()` - Command availability checking
- `check_dependencies()` - Dependency validation
- `confirm()` - Interactive confirmation
- `backup_file()` - File backup with timestamps
- `retry()` - Retry logic with exponential backoff
- `get_script_dir()` - Script directory detection
- `validate_url()` - URL format validation
- `is_root()` - Root user detection
- `timestamp()` - Timestamp generation

#### Edge Cases & Integration (8 tests)

- Concurrent function calls
- Multiple sourcing
- Pipeline compatibility
- Error handling without exit

### 2. **tests/prune-labels.bats** (120+ tests)

Comprehensive test suite for `scripts/utility/prune-labels.bats` covering:

#### Script Validation (3 tests)

- Shebang and safety features
- Header documentation

#### Configuration (8 tests)

- Environment variables (ORG, CANON_REPO, LABELS_PATH)
- DRY_RUN and STRICT_PRUNE modes
- PROTECT_REGEX support
- ONLY variable for selective repos

#### Dependencies (4 tests)

- GitHub CLI (gh)
- jq for JSON processing
- yq for YAML processing
- base64 for content decoding

#### Core Functionality (11 tests)

- Temporary directory creation
- Cleanup trap
- Canonical label fetching
- YAML to JSON conversion
- Repository listing
- Label synchronization (create/update/delete)

#### Safety Features (5 tests)

- URI encoding
- Dry-run mode
- Protected labels
- Special character handling

#### Label Logic (5 tests)

- Existence checking
- Canonical label skipping
- Field processing (name, color, description)
- Array processing with mapfile

#### API Interaction (4 tests)

- REST API usage
- Rate limiting
- HTTP methods
- Field passing

#### Advanced Features (8 tests)

- Conservative pruning
- Pattern protection
- Batch processing
- Empty repository handling

#### Data Processing (3 tests)

- Property extraction
- Case-sensitive comparison
- Special name handling

#### Integration (2 tests)

- Workflow ordering
- Update before delete

#### Security (3 tests)

- Token safety
- Variable quoting
- Input validation

#### Documentation (3 tests)

- Usage information
- Environment variable docs
- Example invocations

#### Edge Cases (5 tests)

- Empty labels
- Empty descriptions
- Network failures
- Malformed YAML
- Special characters

#### Performance (3 tests)

- Pagination
- API call minimization
- Label caching

#### Maintainability (3 tests)

- Variable naming
- Consistent formatting
- Operation grouping

### 3. **tests/sync-org-labels.bats** (140+ tests)

Comprehensive test suite for `scripts/utility/sync-org-labels.sh` covering:

#### Basic Validation (3 tests)

- Script structure validation
- Safety features
- Documentation

#### Configuration (9 tests)

- All environment variables
- Default values
- Override capability

#### Dependencies (5 tests)

- Required tools verification
- GitHub CLI
- jq, yq, base64, mktemp

#### Core Functionality (12 tests)

- Complete workflow coverage
- API operations
- Repository management

#### Label Synchronization (7 tests)

- Create/update logic
- Existence checking
- Property handling

#### Pruning (5 tests)

- Optional pruning
- Pattern protection
- Canonical identification

#### Dry-Run (5 tests)

- Mode implementation
- Preview messages
- Execution control

#### Output (6 tests)

- Progress indicators
- Status reporting
- Completion messages

#### Repository Selection (4 tests)

- Selective targeting
- Array processing
- Iteration logic

#### API Interaction (5 tests)

- GitHub API usage
- HTTP methods
- Field passing

#### Error Handling (4 tests)

- Missing files
- Empty repos
- API failures
- Cleanup

#### Label Format (5 tests)

- Array format
- Property extraction
- Special characters

#### Comparison (3 tests)

- Case sensitivity
- Array printing
- Exact matching

#### Configuration Validation (3 tests)

- Organization setting
- Repository setting
- Path configuration

#### Label Patterns (6 tests)

- Protection patterns (cpt:, tax:, vendor:, release:, type:)
- Regex matching

#### Integration **tests/test-sync-org-labels.bats** (2 tests)

- Workflow order
- Sync before prune

#### Security **tests/test-sync-org-labels.bats** (3 tests)

- Token safety
- Variable quoting
- Input validation

#### Documentation (2 tests)

- Configuration docs
- Usage examples

#### Edge Cases (4 tests)

- Empty variables
- Empty values
- Network issues
- Malformed data

#### Performance (4 tests)

- Pagination
- Caching
- Batch processing
- API efficiency

#### Code Quality **tests/test-sync-org-labels.bats** (4 tests)

- Variable naming
- Formatting
- Section organization
- Local variables

#### Robustness **tests/test-sync-org-labels.bats** (4 tests)

- Special characters
- Large datasets
- Rate limiting

#### Maintainability (2 tests)

- Comments
- Consistent style

### 4. **tests/validate-release.bats** (80+ tests)

Comprehensive test suite for `scripts/utility/validate-release.sh` covering:

#### Basic Validation **tests/test-validate-release.bats** (3 tests)

- Script structure
- Safety features
- Documentation

#### Help & Usage (5 tests)

- Help function
- Flag support (--help, -h)
- Usage examples
- Option descriptions

#### Configuration (6 tests)

- Required variables
- Default values
- Version settings

#### Logging (5 tests)

- All log functions
- Icon/emoji usage

#### Version Validation (4 tests)

- Format validation
- File checking
- Semantic versioning

#### Workflow Validation (2 tests)

- Workflow files
- YAML syntax

#### Test Validation (2 tests)

- Coverage checking
- Passing tests

#### Documentation **tests/test-validate-release.bats** (3 tests)

- README validation
- Changelog format
- Completeness

#### Argument Parsing (3 tests)

- Version argument
- Verbose argument
- Unknown argument handling

#### Exit Codes (3 tests)

- Variable usage
- Error exits
- Success exits

#### File Validation (2 tests)

- Required files
- Project structure

#### Verbose Mode (2 tests)

- Implementation
- Detailed output

#### Error Handling (3 tests)

- Missing files
- Error messages
- Error accumulation

#### Validation Logic (3 tests)

- Multiple checks
- Version consistency
- Format validation

#### Integration (3 tests)

- No-arg execution
- Path handling
- Root usage

#### Output **tests/test-validate-release.bats** (2 tests)

- Structured output
- Consistent format

#### Dependencies (1 test)

- Tool checking

#### Code Quality (3 tests)

- Function naming
- Coding style
- Documentation

#### Security (2 tests)

- Variable quoting
- Sensitive info

#### Specific Features (3 tests)

- Workflow YAML
- Changelog entries
- Semantic versioning

#### Edge Cases **tests/test-validate-release.bats** (3 tests)

- Missing files
- Empty input

#### Maintainability **tests/test-validate-release.bats** (3 tests)

- Function separation
- Constants usage
- Error propagation

### 5. **tests/update-projects.bats** (180+ tests)

Greatly expanded test suite for `scripts/utility/update-projects.sh` covering:

#### Basic Validation Tests **tests/test-validate-release.bats** (3 tests)

- Script structure
- Safety features
- Documentation

#### Help & Usage (4 tests)

- Help function
- Multiple flag support
- Option documentation

#### Argument Parsing (5 tests)

- All command-line options
- Error handling
- Flag acceptance

#### Required Functions (11 tests)

- All critical functions
- Function existence

#### GitHub CLI Integration (4 tests)

- API usage
- Command availability
- Authentication
- Project commands

#### Scope Management (7 tests)

- Required scopes
- Validation
- Refresh capability

#### Logging (3 tests)

- Color output
- Stream handling

#### Dry-Run (4 tests)

- Implementation
- Command preview
- Execution prevention

#### Project Owner Detection (4 tests)

- Automatic detection
- Git remote parsing
- API fallback

#### Scope Refresh (4 tests)

- Functionality
- User prompting
- Command usage

#### Field Creation (4 tests)

- Field types
- Options
- Existence checking

#### Error Handling (5 tests)

- Missing CLI
- Auth failures
- Missing scopes
- Error messages
- Exit codes

#### GraphQL & API (3 tests)

- Mutations
- Queries
- Response handling

#### Project Operations (5 tests)

- CRUD operations
- Field listing
- Validation

#### Configuration (3 tests)

- Environment variables
- Defaults
- Scope list

#### JWT & App Auth (4 tests)

- App authentication
- Token generation
- Token exchange
- Base64url encoding

#### Input Validation (3 tests)

- Required parameters
- Environment variables
- Numeric validation

#### Field Types (4 tests)

- Single-select
- Number
- Date
- Text

#### Options (3 tests)

- Creation
- Updates
- Colors

#### Command Execution (2 tests)

- Wrapper function
- Dry-run respect

#### Interactive Mode (2 tests)

- Prompting
- Confirmation

#### Output (3 tests)

- Progress indicators
- Success messages
- Error clarity

#### Integration **tests/test-update-projects.bats** (2 tests)

- Dry-run mode
- No-arg usage

#### Code Quality (4 tests)

- Variable quoting
- ShellCheck compliance
- Constants
- Documentation

#### Security **tests/test-update-projects.bats** (3 tests)

- Token protection
- Private key handling
- Cleanup

#### Portability (2 tests)

- Bash features
- OS variations

#### Validation (2 tests)

- API responses
- GraphQL errors

#### Maintainability **tests/test-update-projects.bats** (3 tests)

- Naming conventions
- Separation of concerns
- DRY principle

#### Edge Cases **tests/test-update-projects.bats** (4 tests)

- Empty responses
- Special characters
- Network failures
- Interrupted execution
