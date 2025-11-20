#!/usr/bin/env bash
#
# Script Name: security-audit.sh
# Description: Security audit for modular shell scripts
# Usage: ./security-audit.sh [--strict] [--output <file>]
# Version: 1.0.0
# Author: LightSpeedWP Team
#
# This script performs security checks including:
#   - Detection of dangerous shell patterns
#   - Hardcoded credentials scanning
#   - Insecure file permissions
#   - Unsafe command usage
#
# Options:
#   --strict        - Fail on any security issue (default: warnings only)
#   --output <file> - Output file for security report
#   --json          - Output results in JSON format
#
# Exit Codes:
#   0 - No critical security issues found
#   1 - Critical security issues found (in strict mode)
#
# Examples:
#   ./security-audit.sh
#   ./security-audit.sh --strict --output security-report.json
#

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Load common functions if available
if [[ -f "$PROJECT_ROOT/scripts/includes/core/logging.sh" ]]; then
    # shellcheck source=../includes/core/logging.sh
    source "$PROJECT_ROOT/scripts/includes/core/logging.sh"
else
    # Fallback logging functions
    log_info() { echo "[INFO] $*"; }
    log_success() { echo "[SUCCESS] $*"; }
    log_error() { echo "[ERROR] $*" >&2; }
    log_warning() { echo "[WARNING] $*"; }
fi

# Configuration
STRICT_MODE=false
OUTPUT_FILE=""
JSON_OUTPUT=false
FINDINGS_COUNT=0
CRITICAL_FINDINGS=0
HIGH_FINDINGS=0
MEDIUM_FINDINGS=0
LOW_FINDINGS=0

# Parse command-line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --strict)
                STRICT_MODE=true
                shift
                ;;
            --output|-o)
                OUTPUT_FILE="$2"
                shift 2
                ;;
            --json)
                JSON_OUTPUT=true
                shift
                ;;
            --help|-h)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown argument: $1"
                show_usage
                exit 1
                ;;
        esac
    done

    # Set default output file if not specified
    if [[ -z "$OUTPUT_FILE" ]]; then
        OUTPUT_FILE="security-audit-$(date +%Y%m%d-%H%M%S).json"
    fi
}

show_usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Perform security audit on modular shell scripts.

OPTIONS:
    --strict            Fail on any security issue (default: warnings only)
    --output, -o <file> Output file for security report
    --json              Output results in JSON format
    -h, --help          Show this help message

EXIT CODES:
    0  No critical security issues found
    1  Critical security issues found (in strict mode)

EXAMPLES:
    $(basename "$0")                                        # Basic audit
    $(basename "$0") --strict                               # Strict mode
    $(basename "$0") --output security-report.json --json   # JSON output

EOF
}

# Initialize security report
initialize_report() {
    cat > "$OUTPUT_FILE" <<EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "project": "LightSpeedWP Modular Scripts",
    "findings": []
}
EOF
}

# Add finding to report
add_finding() {
    local severity="$1"
    local file="$2"
    local line="${3:-0}"
    local message="$4"
    local pattern="${5:-}"

    ((FINDINGS_COUNT++))

    case "$severity" in
        "CRITICAL")
            ((CRITICAL_FINDINGS++))
            ;;
        "HIGH")
            ((HIGH_FINDINGS++))
            ;;
        "MEDIUM")
            ((MEDIUM_FINDINGS++))
            ;;
        "LOW")
            ((LOW_FINDINGS++))
            ;;
    esac

    # Create finding JSON
    local finding
    finding=$(jq -n \
        --arg severity "$severity" \
        --arg file "$file" \
        --argjson line "$line" \
        --arg message "$message" \
        --arg pattern "$pattern" \
        '{
            severity: $severity,
            file: $file,
            line: $line,
            message: $message,
            pattern: $pattern
        }')

    # Add to report
    jq ".findings += [$finding]" "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && \
        mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

    # Log finding
    case "$severity" in
        "CRITICAL")
            log_error "🔴 CRITICAL: $file:$line - $message"
            ;;
        "HIGH")
            log_error "🟠 HIGH: $file:$line - $message"
            ;;
        "MEDIUM")
            log_warning "🟡 MEDIUM: $file:$line - $message"
            ;;
        "LOW")
            log_info "🟢 LOW: $file:$line - $message"
            ;;
    esac
}

# Check for dangerous shell patterns
check_dangerous_patterns() {
    log_info "Checking for dangerous shell patterns..."

    # Define dangerous patterns with severity levels
    declare -A dangerous_patterns=(
        ["eval "]="CRITICAL:Use of eval is dangerous and can lead to code injection"
        ["source.*\\\$"]="HIGH:Dynamic sourcing with variables can be exploited"
        ["curl.*|.*sh"]="CRITICAL:Piping curl to shell is extremely dangerous"
        ["wget.*|.*sh"]="CRITICAL:Piping wget to shell is extremely dangerous"
        ["rm -rf /"]="CRITICAL:Attempting to delete root filesystem"
        ["chmod 777"]="HIGH:Overly permissive file permissions"
        ["\\\${[A-Z_]*PASSWORD"]="HIGH:Potential hardcoded password variable"
        ["\\\${[A-Z_]*SECRET"]="HIGH:Potential hardcoded secret variable"
        ["\\\${[A-Z_]*TOKEN"]="HIGH:Potential hardcoded token variable"
        ["sudo.*NOPASSWD"]="MEDIUM:Passwordless sudo can be risky"
    )

    while IFS= read -r script; do
        local line_num=0

        while IFS= read -r line; do
            ((line_num++))

            for pattern in "${!dangerous_patterns[@]}"; do
                if echo "$line" | grep -qE "$pattern"; then
                    local severity_msg="${dangerous_patterns[$pattern]}"
                    local severity="${severity_msg%%:*}"
                    local message="${severity_msg#*:}"

                    add_finding "$severity" "$script" "$line_num" "$message" "$pattern"
                fi
            done
        done < "$script"
    done < <(find scripts/ -name "*.sh" -type f 2>/dev/null)
}

# Check for hardcoded credentials
check_hardcoded_credentials() {
    log_info "Checking for hardcoded credentials..."

    # Patterns that might indicate hardcoded credentials
    local credential_patterns=(
        "password="
        "passwd="
        "pwd="
        "secret="
        "token="
        "api_key="
        "apikey="
        "private_key="
    )

    while IFS= read -r script; do
        local line_num=0

        while IFS= read -r line; do
            ((line_num++))

            # Skip comments
            if echo "$line" | grep -q "^[[:space:]]*#"; then
                continue
            fi

            for pattern in "${credential_patterns[@]}"; do
                if echo "$line" | grep -iq "$pattern"; then
                    # Check if it's an actual assignment with a value
                    if echo "$line" | grep -qE "${pattern}['\"]?[a-zA-Z0-9]"; then
                        add_finding "HIGH" "$script" "$line_num" \
                            "Potential hardcoded credential detected" "$pattern"
                    fi
                fi
            done
        done < "$script"
    done < <(find scripts/ -name "*.sh" -type f 2>/dev/null)
}

# Check file permissions
check_file_permissions() {
    log_info "Checking file permissions..."

    while IFS= read -r script; do
        # Get file permissions (octal)
        local perms
        perms=$(stat -f%p "$script" 2>/dev/null || stat -c%a "$script" 2>/dev/null || echo "")

        if [[ -z "$perms" ]]; then
            continue
        fi

        # Check if world-writable
        if [[ "${perms: -1}" -ge 2 ]]; then
            add_finding "HIGH" "$script" 0 \
                "File is world-writable (permissions: $perms)" "world-writable"
        fi

        # Check if world-readable for sensitive files
        if [[ "$(basename "$script")" =~ (credential|secret|password|token|key) ]]; then
            if [[ "${perms: -1}" -ge 4 ]]; then
                add_finding "MEDIUM" "$script" 0 \
                    "Sensitive file is world-readable (permissions: $perms)" "world-readable"
            fi
        fi
    done < <(find scripts/ -name "*.sh" -type f 2>/dev/null)
}

# Check for unsafe command usage
check_unsafe_commands() {
    log_info "Checking for unsafe command usage..."

    local unsafe_commands=(
        "dd:MEDIUM:dd command can be dangerous if misused"
        "mkfs:CRITICAL:Filesystem formatting can destroy data"
        "fdisk:HIGH:Disk partitioning is risky"
        "parted:HIGH:Disk partitioning is risky"
    )

    while IFS= read -r script; do
        local line_num=0

        while IFS= read -r line; do
            ((line_num++))

            for cmd_def in "${unsafe_commands[@]}"; do
                IFS=':' read -r cmd severity message <<< "$cmd_def"

                if echo "$line" | grep -qw "$cmd"; then
                    add_finding "$severity" "$script" "$line_num" "$message" "$cmd"
                fi
            done
        done < "$script"
    done < <(find scripts/ -name "*.sh" -type f 2>/dev/null)
}

# Check for missing security headers
check_security_headers() {
    log_info "Checking for security best practices..."

    while IFS= read -r script; do
        # Check for 'set -e' or 'set -euo pipefail'
        if ! grep -q "set -e" "$script"; then
            add_finding "LOW" "$script" 0 \
                "Script missing 'set -e' for error handling" "missing-set-e"
        fi

        # Check for shebang
        if ! head -n 1 "$script" | grep -q "^#!"; then
            add_finding "LOW" "$script" 1 \
                "Script missing shebang" "missing-shebang"
        fi
    done < <(find scripts/ -name "*.sh" -type f 2>/dev/null)
}

# Run all security checks
run_security_audit() {
    log_info "Starting security audit..."
    echo ""

    initialize_report

    check_dangerous_patterns
    check_hardcoded_credentials
    check_file_permissions
    check_unsafe_commands
    check_security_headers

    echo ""
}

# Display audit summary
display_summary() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Security Audit Summary"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Total Findings: $FINDINGS_COUNT"
    echo ""
    echo "By Severity:"
    echo "  🔴 Critical: $CRITICAL_FINDINGS"
    echo "  🟠 High:     $HIGH_FINDINGS"
    echo "  🟡 Medium:   $MEDIUM_FINDINGS"
    echo "  🟢 Low:      $LOW_FINDINGS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Add summary to JSON report
    jq --argjson total "$FINDINGS_COUNT" \
       --argjson critical "$CRITICAL_FINDINGS" \
       --argjson high "$HIGH_FINDINGS" \
       --argjson medium "$MEDIUM_FINDINGS" \
       --argjson low "$LOW_FINDINGS" \
       '.summary = {
           total: $total,
           critical: $critical,
           high: $high,
           medium: $medium,
           low: $low
       }' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && \
        mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

    log_info "Full security report saved to: $OUTPUT_FILE"

    # Determine exit status
    if [[ $CRITICAL_FINDINGS -gt 0 ]] || [[ $HIGH_FINDINGS -gt 0 ]]; then
        log_error "❌ Security audit found critical or high severity issues"

        if [[ "$STRICT_MODE" == true ]]; then
            return 1
        fi
    elif [[ $FINDINGS_COUNT -eq 0 ]]; then
        log_success "✅ No security issues found"
    else
        log_warning "⚠️  Security audit found $FINDINGS_COUNT low/medium severity issues"
    fi

    return 0
}

# Script entry point
main() {
    parse_arguments "$@"

    run_security_audit

    if ! display_summary; then
        exit 1
    fi

    exit 0
}

# Run main function
main "$@"
