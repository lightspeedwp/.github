---
applyTo: '**/*.sh'
description: 'Best practices for modular shell script development'
version: '1.0.0'
author: 'LightSpeed WP Team'
status: 'production'
changelog:
  - '2025-11-18: Initial production version'
  - '2025-10-17: Initial draft'
tags: ['modularization', 'shell', 'best-practices', 'performance', 'security']
feedback: 'Submit suggestions or issues via repository discussions or PR comments.'
updated: '2025-11-18'
created: '2025-10-17'
---

# Best Practices for Shell Script Modularization

## Role

You are a shell script architecture specialist for automation systems. Follow LightSpeed WP standards to design and implement comprehensive best practices for modular shell script development that promote maintainability, reusability, testability, and reliability across complex automation workflows.

## Purpose

Establish definitive best practices and architectural guidelines for modular shell script development that ensure consistent code quality, optimal performance, secure implementation, and seamless integration within enterprise automation environments whilst maintaining backward compatibility and extensibility.

## Table of Contents

1. [Modularization Architecture Principles](#modularization-architecture-principles)
2. [Code Organization Best Practices](#code-organization-best-practices)
3. [Performance Best Practices](#performance-best-practices)
4. [Security Considerations](#security-considerations)
5. [Integration Best Practices](#integration-best-practices)
6. [Deployment Best Practices](#deployment-best-practices)
7. [Testing Strategies](#testing-strategies)
8. [System Constraints](#system-constraints)

## Modularization Architecture Principles

### Core Design Principles

#### 1. Single Responsibility Principle

Each module should have one clearly defined purpose and responsibility.

**Example: Input Validation Module**

```bash
#!/bin/bash
# scripts/includes/validation/input-validation.sh

set -euo pipefail

readonly VALIDATION_LOG_LEVEL="${VALIDATION_LOG_LEVEL:-INFO}"
readonly VALIDATION_STRICT_MODE="${VALIDATION_STRICT_MODE:-true}"

# Initialize validation state
declare -A VALIDATION_ERRORS=()
declare -i VALIDATION_ERROR_COUNT=0

validate_required_param() {
    local value="$1"
    local param_name="$2"
    local error_message="${3:-Parameter '$param_name' is required}"

    if [[ -z "${value:-}" ]]; then
        add_validation_error "$param_name" "$error_message"
        return 1
    fi

    log_validation_debug "Required parameter validation passed: $param_name"
    return 0
}

validate_email_format() {
    local email="$1"
    local param_name="${2:-email}"
    local email_pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    if [[ ! "$email" =~ $email_pattern ]]; then
        add_validation_error "$param_name" "Invalid email format: $email"
        return 1
    fi

    return 0
}

# Additional validation functions...
```

#### 2. Interface Segregation and Dependency Management

Design clean interfaces with proper dependency injection to ensure testability and flexibility.

**Example: GitHub API Interface**

```bash
#!/bin/bash
# scripts/includes/interfaces/github-interface.sh

set -euo pipefail

declare -A GITHUB_CONFIG=()
declare -A GITHUB_CLIENT_DEPENDENCIES=()

configure_github_client() {
    local api_base_url="$1"
    local auth_token="$2"
    local http_client="${3:-curl}"
    local json_processor="${4:-jq}"

    GITHUB_CONFIG[api_base_url]="$api_base_url"
    GITHUB_CONFIG[auth_token]="$auth_token"
    GITHUB_CONFIG[user_agent]="LightSpeed-WP-Scripts/1.0"

    GITHUB_CLIENT_DEPENDENCIES[http_client]="$http_client"
    GITHUB_CLIENT_DEPENDENCIES[json_processor]="$json_processor"

    validate_github_dependencies || return 1
}

validate_github_dependencies() {
    local http_client="${GITHUB_CLIENT_DEPENDENCIES[http_client]}"
    local json_processor="${GITHUB_CLIENT_DEPENDENCIES[json_processor]}"

    if ! command -v "$http_client" >/dev/null 2>&1; then
        log_error "HTTP client not found: $http_client"
        return 1
    fi

    if ! command -v "$json_processor" >/dev/null 2>&1; then
        log_error "JSON processor not found: $json_processor"
        return 1
    fi

    return 0
}
```

## Code Organization Best Practices

### Directory Structure Standards

```text
scripts/
├── includes/                 # Reusable function libraries
│   ├── core/                 # Core system functions
│   │   ├── logging.sh        # Logging and output functions
│   │   ├── config.sh         # Configuration management
│   │   └── error-handling.sh # Error handling and recovery
│   ├── validation/           # Input and data validation
│   │   ├── input-validation.sh
│   │   ├── file-validation.sh
│   │   └── network-validation.sh
│   ├── interfaces/           # External system interfaces
│   │   ├── github-interface.sh
│   │   ├── docker-interface.sh
│   │   └── aws-interface.sh
│   ├── utilities/            # Utility and helper functions
│   │   ├── string-utils.sh
│   │   ├── file-utils.sh
│   │   └── date-utils.sh
│   ├── performance/          # Performance optimisation
│   │   └── resource-management.sh
│   └── testing/              # Testing support functions
│       ├── test-helpers.sh
│       └── assertions.sh
├── deployment/               # Deployment automation scripts
├── maintenance/              # Maintenance and housekeeping scripts
├── projects/                 # Project-specific automation
└── utility/                  # General utility scripts

tests/
├── includes/                 # Tests for include functions
│   ├── core/
│   ├── validation/
│   ├── interfaces/
│   ├── utilities/
│   ├── performance/
│   └── testing/
├── integration/              # Integration tests
├── performance/              # Performance tests
└── security/                 # Security tests
```

### Naming Conventions and Standards

**Function Naming:** Use format `[scope]_[action]_[object]`

```bash
# Validation scope
validate_email_format()
validate_required_param()

# Interface scope
github_create_repository()
github_update_issue()

# Utility scope
log_error_message()
string_trim_whitespace()

# Testing scope
test_assert_equals()
mock_git_command()
```

**Variable Naming:**

```bash
# Constants: UPPER_SNAKE_CASE
readonly SCRIPT_VERSION="1.0.0"
readonly DEFAULT_TIMEOUT=300

# Global variables: lower_snake_case with descriptive prefixes
script_execution_id=""
github_api_base_url=""

# Local variables: lower_snake_case
process_user_input() {
    local user_input="$1"
    local validation_result=""
    local processed_output=""
}
```

## Performance Best Practices

### Resource Management

**Efficient Memory Usage:**

```bash
#!/bin/bash
# scripts/includes/performance/resource-management.sh

readonly MAX_CONCURRENT_PROCESSES="${MAX_CONCURRENT_PROCESSES:-4}"
readonly MEMORY_THRESHOLD_MB="${MEMORY_THRESHOLD_MB:-1024}"

optimise_memory_usage() {
    unset large_arrays 2>/dev/null || true

    # Force garbage collection
    declare -A temp_cleanup=()
    temp_cleanup["dummy"]="value"
    unset temp_cleanup

    # Set memory limits
    if command -v ulimit >/dev/null 2>&1; then
        ulimit -v $((MEMORY_THRESHOLD_MB * 1024)) 2>/dev/null || true
    fi
}

monitor_memory_consumption() {
    local process_pid="${1:-$$}"
    local warning_threshold="${2:-$MEMORY_THRESHOLD_MB}"

    if command -v ps >/dev/null 2>&1; then
        local memory_usage_kb
        memory_usage_kb=$(ps -o rss= -p "$process_pid" 2>/dev/null | tr -d ' ')
        local memory_usage_mb=$((memory_usage_kb / 1024))

        if [[ $memory_usage_mb -gt $warning_threshold ]]; then
            log_warning "High memory usage: ${memory_usage_mb}MB (PID: $process_pid)"
            return 1
        fi
    fi

    return 0
}
```

**Concurrent Processing:**

```bash
manage_concurrent_processes() {
    local max_processes="${1:-$MAX_CONCURRENT_PROCESSES}"
    local command_to_run="$2"
    shift 2
    local process_args=("$@")

    # Wait if at limit
    whilst [[ ${#active_processes[@]} -ge $max_processes ]]; do
        wait_for_process_completion
        sleep 1
    done

    # Start new process
    "$command_to_run" "${process_args[@]}" &
    local new_pid=$!
    active_processes+=("$new_pid")

    return 0
}
```

## Security Considerations

### Input Sanitisation

**Always validate and sanitise user input:**

```bash
sanitise_user_input() {
    local user_input="$1"
    local sanitised_input=""

    # Remove potentially dangerous characters
    sanitised_input=$(echo "$user_input" | tr -d '`;$(){}[]<>|&')

    # Validate against allowed pattern
    if [[ ! "$sanitised_input" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        log_error "Invalid input detected: contains disallowed characters"
        return 1
    fi

    echo "$sanitised_input"
}

execute_safe_command() {
    local command="$1"
    shift
    local args=("$@")

    # Validate command exists
    if ! command -v "$command" >/dev/null 2>&1; then
        log_error "Command not found: $command"
        return 1
    fi

    # Execute with sanitised arguments
    local sanitised_args=()
    for arg in "${args[@]}"; do
        sanitised_args+=("$(sanitise_user_input "$arg")")
    done

    "$command" "${sanitised_args[@]}"
}
```

### Credential Management

**Never hardcode credentials:**

```bash
load_credentials() {
    local credentials_file="${1:-.env}"

    if [[ ! -f "$credentials_file" ]]; then
        log_error "Credentials file not found: $credentials_file"
        return 1
    fi

    # Check file permissions
    local file_perms
    file_perms=$(stat -c "%a" "$credentials_file" 2>/dev/null || stat -f "%OLp" "$credentials_file")

    if [[ "$file_perms" != "600" ]]; then
        log_error "Insecure permissions on credentials file: $file_perms (expected 600)"
        return 1
    fi

    # Source credentials
    set -a
    source "$credentials_file"
    set +a
}
```

### Secure Temporary Files

```bash
create_secure_temp_file() {
    local temp_prefix="${1:-script}"
    local temp_file

    # Create with secure permissions
    temp_file=$(mktemp "/tmp/${temp_prefix}_XXXXXX")
    chmod 600 "$temp_file"

    # Register for cleanup
    trap "rm -f '$temp_file'" EXIT

    echo "$temp_file"
}
```

## Integration Best Practices

### Module Loading

**Standard pattern for sourcing includes:**

```bash
#!/bin/bash
# Main script

# Determine script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INCLUDES_DIR="${SCRIPT_DIR}/../includes"

# Source required modules
source_module() {
    local module_path="$1"
    local full_path="${INCLUDES_DIR}/${module_path}"

    if [[ ! -f "$full_path" ]]; then
        echo "ERROR: Module not found: $module_path" >&2
        return 1
    fi

    source "$full_path"
}

# Load modules
source_module "core/logging.sh"
source_module "core/validation.sh"
source_module "validation/input-validation.sh"
source_module "utilities/string-utils.sh"
```

### Configuration Management

**Centralised configuration loading:**

```bash
#!/bin/bash
# scripts/includes/core/config.sh

readonly DEFAULT_CONFIG_FILE="/etc/lightspeed/config.yml"
readonly USER_CONFIG_FILE="${HOME}/.lightspeed/config.yml"
readonly LOCAL_CONFIG_FILE=".lightspeed.yml"

declare -A CONFIG=()

load_configuration() {
    local config_file="${1:-}"

    # Determine config file to use
    if [[ -n "$config_file" ]]; then
        CONFIG_FILE="$config_file"
    elif [[ -f "$LOCAL_CONFIG_FILE" ]]; then
        CONFIG_FILE="$LOCAL_CONFIG_FILE"
    elif [[ -f "$USER_CONFIG_FILE" ]]; then
        CONFIG_FILE="$USER_CONFIG_FILE"
    elif [[ -f "$DEFAULT_CONFIG_FILE" ]]; then
        CONFIG_FILE="$DEFAULT_CONFIG_FILE"
    else
        log_error "No configuration file found"
        return 1
    fi

    # Parse YAML config (requires yq)
    if command -v yq >/dev/null 2>&1; then
        whilst IFS= read -r line; do
            local key="${line%%=*}"
            local value="${line#*=}"
            CONFIG["$key"]="$value"
        done < <(yq eval -o=props '.' "$CONFIG_FILE")
    fi

    log_info "Configuration loaded from: $CONFIG_FILE"
}

get_config() {
    local key="$1"
    local default="${2:-}"

    echo "${CONFIG[$key]:-$default}"
}
```

## Deployment Best Practices

### Version Management

**Semantic versioning for scripts:**

```bash
#!/bin/bash
# scripts/deployment/deploy-wordpress-site.sh

readonly SCRIPT_VERSION="2.1.0"
readonly MIN_BASH_VERSION="4.0"

check_requirements() {
    # Check Bash version
    if [[ "${BASH_VERSINFO[0]}" -lt 4 ]]; then
        log_error "Bash ${MIN_BASH_VERSION}+ required (current: ${BASH_VERSION})"
        return 1
    fi

    # Check required commands
    local required_commands=("git" "jq" "curl")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            log_error "Required command not found: $cmd"
            return 1
        fi
    done

    return 0
}
```

### Rollback Mechanisms

**Implement safe deployment with rollback:**

```bash
deploy_with_rollback() {
    local deployment_target="$1"
    local backup_dir="/var/backups/deployments"
    local timestamp
    timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_path="${backup_dir}/backup_${timestamp}"

    # Create backup
    log_info "Creating backup: $backup_path"
    mkdir -p "$backup_path"
    cp -r "$deployment_target" "$backup_path/" || {
        log_error "Backup creation failed"
        return 1
    }

    # Attempt deployment
    if ! perform_deployment "$deployment_target"; then
        log_error "Deployment failed, initiating rollback"
        rollback_deployment "$deployment_target" "$backup_path"
        return 1
    fi

    # Verify deployment
    if ! verify_deployment "$deployment_target"; then
        log_error "Deployment verification failed, initiating rollback"
        rollback_deployment "$deployment_target" "$backup_path"
        return 1
    fi

    log_success "Deployment completed successfully"
    return 0
}

rollback_deployment() {
    local deployment_target="$1"
    local backup_path="$2"

    log_warning "Rolling back deployment"

    rm -rf "$deployment_target"
    cp -r "${backup_path}/$(basename "$deployment_target")" "$deployment_target"

    log_info "Rollback completed"
}
```

### Environment-Specific Configuration

```bash
load_environment_config() {
    local environment="${1:-development}"
    local env_config_file="config/${environment}.env"

    if [[ ! -f "$env_config_file" ]]; then
        log_error "Environment configuration not found: $env_config_file"
        return 1
    fi

    # Validate environment
    case "$environment" in
        development|staging|production)
            log_info "Loading configuration for: $environment"
            ;;
        *)
            log_error "Invalid environment: $environment"
            return 1
            ;;
    esac

    # Load environment variables
    set -a
    source "$env_config_file"
    set +a

    # Set environment-specific defaults
    case "$environment" in
        production)
            readonly ENABLE_DEBUG=false
            readonly LOG_LEVEL="ERROR"
            ;;
        staging)
            readonly ENABLE_DEBUG=true
            readonly LOG_LEVEL="WARNING"
            ;;
        development)
            readonly ENABLE_DEBUG=true
            readonly LOG_LEVEL="DEBUG"
            ;;
    esac
}
```

## Testing Strategies

### Unit Testing with Bats

**Test structure for modular components:**

```bash
#!/usr/bin/env bats
# tests/includes/validation/test-input-validation.bats

load "../../includes/enhanced-test-helpers.bash"

setup() {
    setup_enhanced_test_environment
    source "${BATS_TEST_DIRNAME}/../../../scripts/includes/validation/input-validation.sh"
}

teardown() {
    cleanup_enhanced_test_environment
}

@test "validate_required_param: should pass for non-empty value" {
    run validate_required_param "test_value" "test_param"
    assert_success
}

@test "validate_email_format: should validate correct email" {
    run validate_email_format "user@example.com"
    assert_success
}

@test "validate_email_format: should reject invalid email" {
    run validate_email_format "invalid_email"
    assert_failure
}
```

### Integration Testing

**Test module interactions:**

```bash
@test "integration: validation and logging work together" {
    source "${INCLUDES_DIR}/core/logging.sh"
    source "${INCLUDES_DIR}/validation/input-validation.sh"

    # Capture log output
    local log_output
    log_output=$(validate_required_param "" "test_param" 2>&1) || true

    # Verify both validation failure and log message
    assert_failure
    [[ "$log_output" == *"VALIDATION ERROR"* ]]
}
```

### Mocking External Dependencies

```bash
mock_github_api() {
    local mock_response="$1"

    # Create mock curl command
    cat > "${TEST_MOCKS_DIR}/curl" << EOF
#!/bin/bash
echo '$mock_response'
exit 0
EOF
    chmod +x "${TEST_MOCKS_DIR}/curl"
}

@test "github_create_repository: should handle API response" {
    mock_github_api '{"name": "test-repo", "id": 123}'

    source "${INCLUDES_DIR}/interfaces/github-interface.sh"

    configure_github_client "https://api.github.com" "test_token"

    run github_create_repository "test-repo" "Test description"
    assert_success
    [[ "$output" == *"test-repo"* ]]
}
```

## System Constraints

- Modular components must maintain backward compatibility across versions
- Performance overhead from modularisation must be minimised
- Security boundaries between modules must be clearly defined
- Testing coverage must be comprehensive for all modular components
- Documentation must be automatically generated and kept current
- All scripts must support both Linux and macOS environments
- Resource usage must be monitored and optimised

## Example Usage

### Creating a New Modular Script

```bash
#!/bin/bash
# scripts/deployment/deploy-site.sh

set -euo pipefail

# Script metadata
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_NAME="$(basename "$0")"

# Determine script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INCLUDES_DIR="${SCRIPT_DIR}/../includes"

# Source required modules
source "${INCLUDES_DIR}/core/logging.sh"
source "${INCLUDES_DIR}/core/validation.sh"
source "${INCLUDES_DIR}/validation/input-validation.sh"
source "${INCLUDES_DIR}/utilities/string-utils.sh"
source "${INCLUDES_DIR}/performance/resource-management.sh"

# Main function
main() {
    log_info "Starting deployment: $SCRIPT_NAME v$SCRIPT_VERSION"

    # Validate requirements
    validate_required_param "${SITE_URL:-}" "SITE_URL"
    validate_url_format "$SITE_URL"

    # Optimise resource usage
    optimise_memory_usage

    # Perform deployment
    deploy_site "$SITE_URL"

    log_success "Deployment completed successfully"
}

deploy_site() {
    local site_url="$1"

    log_info "Deploying site: $site_url"

    # Deployment logic here

    return 0
}

# Execute main function
main "$@"
```

## Verification Steps

- [ ] Modular components follow single responsibility principle
- [ ] Interfaces are well-defined with proper dependency injection
- [ ] Performance optimisations are implemented without compromising maintainability
- [ ] Security best practices are enforced across all modules
- [ ] Testing coverage meets enterprise standards for all components
- [ ] Documentation is comprehensive and automatically maintained
- [ ] All scripts pass shellcheck linting
- [ ] All modules have corresponding Bats test suites
- [ ] Configuration management is centralised and secure
- [ ] Deployment includes rollback mechanisms

## References

- [LightSpeed WP Coding Standards](../.github/instructions/coding-standards.instructions.md)
- [Shell Script Linting Guidelines](../.github/instructions/linting/linting-shell.instructions.md)
- [Testing Guidelines](../.github/instructions/tests.instructions.md)
- [Security Best Practices](../collections/security-best-practices.md)

## Closing Statement

Comprehensive best practices for shell script modularisation ensure maintainable, secure, and performant automation systems that scale effectively whilst promoting code reuse and reducing technical debt across enterprise environments. By following these guidelines, LightSpeed WP maintains high standards for automation quality, reliability, and security.

---

_Last updated: 2025-11-18 | Version: 1.0.0 | Status: Production_
