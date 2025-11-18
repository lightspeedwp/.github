#!/bin/bash
# scripts/includes/validation/input-validation.sh

# ============================================================================
# Script Name: input-validation.sh
# Description: Comprehensive input validation functions for shell scripts
# Usage: source scripts/includes/validation/input-validation.sh
# Examples:
#   # Basic validation
#   validate_required_param "$username" "username"
#   validate_email_format "$email"
#   validate_file_exists "$config_file"
#
#   # Complex validation with custom rules
#   validate_with_pattern "$input" "^[a-zA-Z0-9_-]+$" "alphanumeric with dashes"
#   validate_number_range "$port" 1 65535 "port number"
#
#   # Batch validation
#   validate_params_batch "username:$username" "email:$email" "port:$port"
# ============================================================================

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

    log_validation_debug "Email format validation passed: $email"
    return 0
}

validate_file_exists() {
    local file_path="$1"
    local param_name="${2:-file_path}"
    local check_readable="${3:-false}"

    if [[ ! -f "$file_path" ]]; then
        add_validation_error "$param_name" "File does not exist: $file_path"
        return 1
    fi

    if [[ "$check_readable" == "true" && ! -r "$file_path" ]]; then
        add_validation_error "$param_name" "File is not readable: $file_path"
        return 1
    fi

    log_validation_debug "File existence validation passed: $file_path"
    return 0
}

validate_directory_exists() {
    local dir_path="$1"
    local param_name="${2:-directory_path}"
    local check_writable="${3:-false}"

    if [[ ! -d "$dir_path" ]]; then
        add_validation_error "$param_name" "Directory does not exist: $dir_path"
        return 1
    fi

    if [[ "$check_writable" == "true" && ! -w "$dir_path" ]]; then
        add_validation_error "$param_name" "Directory is not writable: $dir_path"
        return 1
    fi

    log_validation_debug "Directory validation passed: $dir_path"
    return 0
}

validate_with_pattern() {
    local value="$1"
    local pattern="$2"
    local description="$3"
    local param_name="${4:-value}"

    if [[ ! "$value" =~ $pattern ]]; then
        add_validation_error "$param_name" "Value does not match required pattern ($description): $value"
        return 1
    fi

    log_validation_debug "Pattern validation passed for $description: $value"
    return 0
}

validate_number_range() {
    local value="$1"
    local min_val="$2"
    local max_val="$3"
    local description="$4"
    local param_name="${5:-number}"

    # Check if value is a number
    if ! [[ "$value" =~ ^-?[0-9]+$ ]]; then
        add_validation_error "$param_name" "Value is not a valid number: $value"
        return 1
    fi

    # Check range
    if [[ $value -lt $min_val || $value -gt $max_val ]]; then
        add_validation_error "$param_name" "$description must be between $min_val and $max_val, got: $value"
        return 1
    fi

    log_validation_debug "Number range validation passed for $description: $value"
    return 0
}

validate_url_format() {
    local url="$1"
    local param_name="${2:-url}"
    local allowed_schemes="${3:-http https}"

    # Basic URL pattern
    local url_pattern='^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:[0-9]+)?(/.*)?$'

    if [[ ! "$url" =~ $url_pattern ]]; then
        add_validation_error "$param_name" "Invalid URL format: $url"
        return 1
    fi

    # Validate scheme if specified
    if [[ -n "$allowed_schemes" ]]; then
        local scheme="${url%%://*}"
        if [[ ! " $allowed_schemes " =~ " $scheme " ]]; then
            add_validation_error "$param_name" "URL scheme '$scheme' not allowed. Allowed: $allowed_schemes"
            return 1
        fi
    fi

    log_validation_debug "URL format validation passed: $url"
    return 0
}

validate_params_batch() {
    local batch_errors=0
    local param_spec

    for param_spec in "$@"; do
        local param_name="${param_spec%%:*}"
        local param_value="${param_spec#*:}"

        case "$param_name" in
            *_email)
                validate_email_format "$param_value" "$param_name" || ((batch_errors++))
                ;;
            *_file)
                validate_file_exists "$param_value" "$param_name" || ((batch_errors++))
                ;;
            *_dir|*_directory)
                validate_directory_exists "$param_value" "$param_name" || ((batch_errors++))
                ;;
            *_url)
                validate_url_format "$param_value" "$param_name" || ((batch_errors++))
                ;;
            *)
                validate_required_param "$param_value" "$param_name" || ((batch_errors++))
                ;;
        esac
    done

    if [[ $batch_errors -gt 0 ]]; then
        log_validation_error "Batch validation failed with $batch_errors errors"
        return 1
    fi

    log_validation_info "Batch validation passed for ${#@} parameters"
    return 0
}

# Validation error management
add_validation_error() {
    local param_name="$1"
    local error_message="$2"

    VALIDATION_ERRORS["$param_name"]="$error_message"
    ((VALIDATION_ERROR_COUNT++))

    log_validation_error "Validation error for '$param_name': $error_message"

    if [[ "$VALIDATION_STRICT_MODE" == "true" ]]; then
        return 1
    fi
}

get_validation_errors() {
    local output_format="${1:-text}"

    if [[ $VALIDATION_ERROR_COUNT -eq 0 ]]; then
        echo "No validation errors"
        return 0
    fi

    case "$output_format" in
        "json")
            echo "{"
            echo "  \"error_count\": $VALIDATION_ERROR_COUNT,"
            echo "  \"errors\": {"
            local first=true
            for param in "${!VALIDATION_ERRORS[@]}"; do
                if [[ "$first" == "true" ]]; then
                    first=false
                else
                    echo ","
                fi
                echo -n "    \"$param\": \"${VALIDATION_ERRORS[$param]}\""
            done
            echo ""
            echo "  }"
            echo "}"
            ;;
        *)
            echo "Validation Errors ($VALIDATION_ERROR_COUNT):"
            for param in "${!VALIDATION_ERRORS[@]}"; do
                echo "  - $param: ${VALIDATION_ERRORS[$param]}"
            done
            ;;
    esac
}

clear_validation_errors() {
    VALIDATION_ERRORS=()
    VALIDATION_ERROR_COUNT=0
    log_validation_debug "Validation errors cleared"
}

# Validation logging functions
log_validation_debug() {
    [[ "$VALIDATION_LOG_LEVEL" == "DEBUG" ]] && echo "[VALIDATION DEBUG] $*" >&2
}

log_validation_info() {
    [[ "$VALIDATION_LOG_LEVEL" =~ ^(DEBUG|INFO)$ ]] && echo "[VALIDATION INFO] $*" >&2
}

log_validation_error() {
    echo "[VALIDATION ERROR] $*" >&2
}
