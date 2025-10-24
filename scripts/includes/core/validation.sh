#!/bin/bash
# ============================================================================
# Script Name: validation.sh
# Description: Input and system validation functions for LightSpeed WP scripts
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bash 4.0+, logging.sh
# Usage: source scripts/includes/core/validation.sh
# Environment Variables: None
# Options: None - this is a library file
# Examples:
#   source scripts/includes/core/validation.sh
#   validate_required_tools "git" "curl" "jq"
#   validate_file_exists "/path/to/file" "Configuration file"
#   validate_version_format "v1.2.3"
# Notes:
#   - All validation functions return 0 for success, 1 for failure
#   - Error messages are logged using the logging system
#   - Functions are designed to be composable and reusable
# ============================================================================

# Strict mode for safety
set -euo pipefail

# Source logging functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=logging.sh
source "${SCRIPT_DIR}/logging.sh"

# ============================================================================
# Function: command_exists
# Description: Check if a command is available in PATH
# Arguments: $1 - Command name to check
# Output: None
# Notes: Returns 0 if command exists, 1 otherwise
# ============================================================================
command_exists() {
    local command="$1"
    command -v "$command" >/dev/null 2>&1
}

# ============================================================================
# Function: validate_required_tools
# Description: Check if all required command-line tools are available
# Arguments: $* - List of required commands/tools
# Output: Error messages for missing tools
# Notes: Exits with code 1 if any tools are missing
# ============================================================================
validate_required_tools() {
    local missing_tools=()
    
    for tool in "$@"; do
        if ! command_exists "$tool"; then
            missing_tools+=("$tool")
        fi
    done
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        log_error "Please install the missing tools and try again"
        return 1
    fi
    
    log_debug "All required tools are available: $*"
    return 0
}

# ============================================================================
# Function: check_dependencies
# Description: Validate that all required commands are available (alias)
# Arguments: $* - Array of command names
# Output: Error messages for missing commands
# Notes: Alias for validate_required_tools for backward compatibility
# ============================================================================
check_dependencies() {
    validate_required_tools "$@"
}

# ============================================================================
# Function: validate_file_exists
# Description: Check if a file exists and is readable
# Arguments: $1 - File path, $2 (optional) - Description for error messages
# Output: Error message if file doesn't exist or isn't readable
# Notes: Returns 0 if file exists and is readable, 1 otherwise
# ============================================================================
validate_file_exists() {
    local file="$1"
    local description="${2:-File}"
    
    if [[ ! -f "$file" ]]; then
        log_error "$description does not exist: $file"
        return 1
    fi
    
    if [[ ! -r "$file" ]]; then
        log_error "$description is not readable: $file"
        return 1
    fi
    
    log_debug "$description exists and is readable: $file"
    return 0
}

# ============================================================================
# Function: validate_directory_exists
# Description: Check if a directory exists and is accessible
# Arguments: $1 - Directory path, $2 (optional) - Description for error messages
# Output: Error message if directory doesn't exist or isn't accessible
# Notes: Returns 0 if directory exists and is accessible, 1 otherwise
# ============================================================================
validate_directory_exists() {
    local dir="$1"
    local description="${2:-Directory}"
    
    if [[ ! -d "$dir" ]]; then
        log_error "$description does not exist: $dir"
        return 1
    fi
    
    if [[ ! -x "$dir" ]]; then
        log_error "$description is not accessible: $dir"
        return 1
    fi
    
    log_debug "$description exists and is accessible: $dir"
    return 0
}

# ============================================================================
# Function: validate_version_format
# Description: Validate semantic version format
# Arguments: $1 - Version string to validate
# Output: Error message if version format is invalid
# Notes: Supports both v1.2.3 and 1.2.3 formats, with optional pre-release/build
# ============================================================================
validate_version_format() {
    local version="$1"
    
    # Semantic version regex pattern
    # Supports: v1.2.3, 1.2.3, 1.2.3-alpha.1, 1.2.3+build.1, etc.
    local semver_pattern='^v?([0-9]+)\.([0-9]+)\.([0-9]+)(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$'
    
    if [[ ! "$version" =~ $semver_pattern ]]; then
        log_error "Invalid version format: $version"
        log_error "Expected format: [v]MAJOR.MINOR.PATCH[-prerelease][+build]"
        return 1
    fi
    
    log_debug "Valid version format: $version"
    return 0
}

# ============================================================================
# Function: validate_email
# Description: Validate email address format
# Arguments: $1 - Email address to validate
# Output: Error message if email format is invalid
# Notes: Basic email validation using regex pattern
# ============================================================================
validate_email() {
    local email="$1"
    
    # Basic email regex pattern
    local email_pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if [[ ! "$email" =~ $email_pattern ]]; then
        log_error "Invalid email format: $email"
        return 1
    fi
    
    log_debug "Valid email format: $email"
    return 0
}

# ============================================================================
# Function: validate_url
# Description: Validate URL format
# Arguments: $1 - URL to validate
# Output: Error message if URL format is invalid
# Notes: Basic URL validation for http/https protocols
# ============================================================================
validate_url() {
    local url="$1"
    
    # Basic URL regex pattern for http/https
    local url_pattern='^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}([/?].*)?$'
    
    if [[ ! "$url" =~ $url_pattern ]]; then
        log_error "Invalid URL format: $url"
        return 1
    fi
    
    log_debug "Valid URL format: $url"
    return 0
}

# ============================================================================
# Function: validate_port
# Description: Validate port number
# Arguments: $1 - Port number to validate
# Output: Error message if port is invalid
# Notes: Validates port range (1-65535)
# ============================================================================
validate_port() {
    local port="$1"
    
    # Check if port is a number
    if ! [[ "$port" =~ ^[0-9]+$ ]]; then
        log_error "Port must be a number: $port"
        return 1
    fi
    
    # Check port range
    if [[ $port -lt 1 || $port -gt 65535 ]]; then
        log_error "Port must be between 1 and 65535: $port"
        return 1
    fi
    
    log_debug "Valid port number: $port"
    return 0
}

# ============================================================================
# Function: validate_ip_address
# Description: Validate IPv4 address format
# Arguments: $1 - IP address to validate
# Output: Error message if IP format is invalid
# Notes: Basic IPv4 validation
# ============================================================================
validate_ip_address() {
    local ip="$1"
    
    # IPv4 regex pattern
    local ip_pattern='^([0-9]{1,3}\.){3}[0-9]{1,3}$'
    
    if [[ ! "$ip" =~ $ip_pattern ]]; then
        log_error "Invalid IP address format: $ip"
        return 1
    fi
    
    # Validate each octet
    IFS='.' read -ra octets <<< "$ip"
    for octet in "${octets[@]}"; do
        if [[ $octet -gt 255 ]]; then
            log_error "Invalid IP address (octet > 255): $ip"
            return 1
        fi
    done
    
    log_debug "Valid IP address: $ip"
    return 0
}

# ============================================================================
# Function: validate_json_file
# Description: Validate JSON file format and syntax
# Arguments: $1 - JSON file path
# Output: Error message if JSON is invalid
# Notes: Requires jq command for validation
# ============================================================================
validate_json_file() {
    local json_file="$1"
    
    # Check if file exists first
    if ! validate_file_exists "$json_file" "JSON file"; then
        return 1
    fi
    
    # Check if jq is available
    if ! command_exists "jq"; then
        log_error "jq command required for JSON validation"
        return 1
    fi
    
    # Validate JSON syntax
    if ! jq empty "$json_file" >/dev/null 2>&1; then
        log_error "Invalid JSON syntax in file: $json_file"
        return 1
    fi
    
    log_debug "Valid JSON file: $json_file"
    return 0
}

# ============================================================================
# Function: validate_yaml_file
# Description: Validate YAML file format and syntax
# Arguments: $1 - YAML file path
# Output: Error message if YAML is invalid
# Notes: Requires yq command for validation
# ============================================================================
validate_yaml_file() {
    local yaml_file="$1"
    
    # Check if file exists first
    if ! validate_file_exists "$yaml_file" "YAML file"; then
        return 1
    fi
    
    # Check if yq is available
    if ! command_exists "yq"; then
        log_error "yq command required for YAML validation"
        return 1
    fi
    
    # Validate YAML syntax
    if ! yq eval '.' "$yaml_file" >/dev/null 2>&1; then
        log_error "Invalid YAML syntax in file: $yaml_file"
        return 1
    fi
    
    log_debug "Valid YAML file: $yaml_file"
    return 0
}

# ============================================================================
# Function: validate_path_safe
# Description: Validate that a path is safe (no directory traversal)
# Arguments: $1 - Path to validate
# Output: Error message if path contains unsafe elements
# Notes: Prevents directory traversal attacks
# ============================================================================
validate_path_safe() {
    local path="$1"
    
    # Check for directory traversal patterns
    if [[ "$path" == *".."* ]]; then
        log_error "Unsafe path (contains ..): $path"
        return 1
    fi
    
    # Check for absolute paths in contexts where they shouldn't be used
    if [[ "$path" == /* ]]; then
        log_warning "Absolute path detected: $path"
    fi
    
    log_debug "Safe path: $path"
    return 0
}

# End of validation.sh