# scripts/includes — Shared Utilities and Test Helpers

This directory contains reusable shell functions, utilities, and test helpers used across all LightSpeed WP scripts and test suites.

## Directory Structure

```text
scripts/includes/
├── README.md                    # This file
├── enhanced-test-helpers.bash   # Enhanced test utilities
├── agent-test-helpers.bash      # Agent-specific test helpers
├── cli-utils.sh                 # CLI argument parsing utilities
├── colors.sh                    # Terminal color support
├── common-functions.sh          # General-purpose shell functions
├── file-operations.sh           # File system operations
├── logging.sh                   # Standardized logging functions
├── validation.sh                # Input validation utilities
├── __tests__/                   # Tests for the helper functions
├── cli/
│   └── cli-utils.sh            # CLI utilities (alternative location)
├── core/
│   ├── colors.sh               # Core color functions
│   ├── common-functions.sh     # Core shared functions
│   ├── logging.sh              # Core logging functions
│   └── validation.sh           # Core validation functions
├── filesystem/
│   └── file-operations.sh      # File system utilities
└── network/
    └── git-functions.sh        # Git-related operations
```

## Core Utilities

### Command Line Interface (`cli-utils.sh`)

Standardized argument parsing and help generation for all scripts:

- __parse_common_args()__ — Parse standard arguments (--verbose, --dry-run, --help)
- __show_standard_help()__ — Generate consistent help output
- __validate_arguments()__ — Validate required arguments and options

### Logging System (`logging.sh`)

Consistent logging across all scripts with color support:

- __log_info()__, __log_warn()__, __log_error()__ — Structured logging functions
- __log_debug()__ — Debug output (when VERBOSE is enabled)
- __log_success()__ — Success message formatting

### Input Validation (`validation.sh`)

Common validation functions for scripts:

- __validate_required_command()__ — Check if required commands exist
- __validate_file_exists()__ — Verify file existence
- __validate_directory_exists()__ — Verify directory existence
- __validate_url()__ — URL format validation

### Color Support (`colors.sh`)

Terminal color constants and functions:

- Color constants (RED, GREEN, YELLOW, BLUE, etc.)
- __colorize()__ — Apply colors to text output
- __has_color_support()__ — Detect terminal color capability

### File Operations (`file-operations.sh`)

Safe file system operations:

- __backup_file()__ — Create file backups before modification
- __safe_write()__ — Atomic file writing operations
- __cleanup_temp_files()__ — Temporary file management

### Common Functions (`common-functions.sh`)

General-purpose utility functions:

- __get_repo_root()__ — Find repository root directory
- __is_git_repo()__ — Check if current directory is a Git repository
- __get_script_dir()__ — Get the directory of the calling script

## Test Helpers

### Enhanced Test Helpers (`enhanced-test-helpers.bash`)

Extended Bats testing utilities with advanced capabilities:

- __setup_enhanced_test_environment()__ — Enhanced test environment setup
- __cleanup_enhanced_test_environment()__ — Enhanced cleanup procedures
- __source_includes()__ — Load all include files safely

__Mocking Functions:__

- __mock_git_command()__ — Mock specific git commands
- __create_test_git_repo()__ — Create test git repository
- __create_test_script()__ — Create test script with includes

__Assertion Functions:__

- __assert_log_contains()__ — Assert log contains message
- __assert_function_exists()__ — Assert function is defined
- __assert_script_follows_standards()__ — Validate script standards
- __assert_no_shellcheck_errors()__ — Validate with ShellCheck

__Utility Functions:__

- __run_with_timeout()__ — Run command with timeout
- __create_fixture_file()__ — Create test fixture
- __load_fixture()__ — Load fixture content

### Agent Test Helpers (`agent-test-helpers.bash`)

Specialized helpers for testing LightSpeed WP agents:

__Agent Environment:__

- __setup_agent_test_environment()__ — Setup for agent testing
- __cleanup_agent_test_environment()__ — Agent-specific cleanup

__GitHub Mocking:__

- __create_mock_github_event()__ — Mock GitHub webhook events
- __mock_github_api()__ — Mock GitHub API responses
- __create_mock_github_response()__ — Create API response files

__Agent Validation:__

- __validate_agent_structure()__ — Validate agent file structure
- __validate_js_agent_structure()__ — Validate JavaScript agents
- __assert_agent_follows_standards()__ — Comprehensive agent validation

__Agent Testing:__

- __run_agent_test()__ — Run agent with test parameters
- __test_agent_dry_run()__ — Test agent in dry-run mode

## Usage Examples

### Basic Script Template

```bash
#!/bin/bash
# Load shared utilities
source "$(dirname "$0")/../includes/logging.sh"
source "$(dirname "$0")/../includes/validation.sh"
source "$(dirname "$0")/../includes/cli-utils.sh"

# Parse arguments and setup
parse_common_args "$@"
validate_required_command "git"

# Use logging functions
log_info "Starting script execution"
log_debug "Debug information"
log_success "Operation completed"
```

### Test Template

```bash
#!/usr/bin/env bats

load "$(dirname "$BATS_TEST_FILENAME")/../includes/enhanced-test-helpers.bash"

setup() {
    setup_enhanced_test_environment
    source_includes
}

teardown() {
    cleanup_enhanced_test_environment
}

@test "example test with enhanced helpers" {
    run log_info "Test message"
    assert_log_contains "Test message"
    assert_function_exists "log_info"
}
```

## Integration with Scripts

### Sourcing Helpers

All scripts should source the appropriate helpers:

```bash
# Standard pattern for all scripts
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INCLUDES_DIR="${SCRIPT_DIR}/../includes"

source "${INCLUDES_DIR}/logging.sh"
source "${INCLUDES_DIR}/validation.sh"
source "${INCLUDES_DIR}/cli-utils.sh"
```

### Error Handling

Use consistent error handling patterns:

```bash
# Validate dependencies
validate_required_command "jq" || exit 1
validate_required_command "curl" || exit 1

# Safe operations
if ! validate_file_exists "$config_file"; then
    log_error "Configuration file not found: $config_file"
    exit 1
fi
```

## Directory Organization

### Core vs. Alternative Locations

Some utilities exist in both root and subdirectory locations:

- __Root files__ (`cli-utils.sh`, `logging.sh`) — Primary implementations
- __Subdirectory files__ (`core/`, `cli/`) — Alternative or specialized versions
- __Test files__ (`__tests__/`) — Test suites for the helpers themselves

### Network Functions

Git and network-related operations are in `network/`:

- __git-functions.sh__ — Git repository operations
- Functions for remote repository interactions
- Branch and commit management utilities

## Best Practices

### For Script Authors

1. __Always source required helpers__ before using functions
2. __Use consistent error handling__ with validation functions
3. __Follow logging patterns__ for consistent output
4. __Test with enhanced helpers__ for comprehensive coverage

### For Helper Development

1. __Document all functions__ with proper headers
2. __Include usage examples__ in function comments
3. __Test all helper functions__ in `__tests__/` directory
4. __Maintain backward compatibility__ when modifying existing functions

## Contributing

When adding new helpers or modifying existing ones:

1. Follow [LightSpeedWP Coding Standards](../../.github/instructions/coding-standards.instructions.md)
2. Add comprehensive tests in `__tests__/` directory
3. Update this README with new function documentation
4. Ensure compatibility with existing scripts
5. Add usage examples for new functionality

## Related Documentation

- [Main Scripts README](../README.md) — Overview of all script directories
- [Testing Standards](../../.github/instructions/testing-standards.instructions.md) — Testing guidelines
- [Coding Standards](../../.github/instructions/coding-standards.instructions.md) — Code style guidelines
