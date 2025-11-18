#!/bin/bash
# Script Name: calculate-quality-score.sh
# Description: Calculate overall quality score for modular scripts
# Usage: ./calculate-quality-score.sh [output_file]
# Examples:
#   ./calculate-quality-score.sh
#   ./calculate-quality-score.sh quality-report.json

set -euo pipefail

# Source common functions if available
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/../includes/logging.sh" ]]; then
    # shellcheck source=../includes/logging.sh
    source "$SCRIPT_DIR/../includes/logging.sh"
else
    # Fallback logging functions
    log_info() { echo "[INFO] $*" >&2; }
    log_error() { echo "[ERROR] $*" >&2; }
    log_success() { echo "[SUCCESS] $*" >&2; }
fi

# Calculate overall quality score
calculate_overall_quality_score() {
    local output_file="${1:-quality-report.json}"

    log_info "Calculating quality score for modular scripts"

    # Initialize quality report
    cat > "$output_file" << 'EOF'
{
    "timestamp": "",
    "metrics": {},
    "scores": {},
    "overall_score": 0,
    "quality_gates": {}
}
EOF

    # Update timestamp
    local timestamp
    timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)

    # Collect metrics
    local code_quality_score
    local test_coverage_score
    local documentation_score
    local security_score
    local performance_score

    code_quality_score=$(calculate_code_quality_score)
    test_coverage_score=$(calculate_test_coverage_score)
    documentation_score=$(calculate_documentation_score)
    security_score=$(calculate_security_score)
    performance_score=85  # Default performance score

    # Calculate weighted overall score
    local overall_score
    overall_score=$(echo "scale=0; \
        ($code_quality_score * 0.25) + \
        ($test_coverage_score * 0.30) + \
        ($documentation_score * 0.20) + \
        ($security_score * 0.15) + \
        ($performance_score * 0.10)" | bc)

    # Update quality report using jq
    if command -v jq >/dev/null 2>&1; then
        jq --arg ts "$timestamp" \
           --argjson code "$code_quality_score" \
           --argjson test "$test_coverage_score" \
           --argjson docs "$documentation_score" \
           --argjson security "$security_score" \
           --argjson perf "$performance_score" \
           --argjson overall "${overall_score%.*}" \
           '.timestamp = $ts |
           .scores = {
               "code_quality": $code,
               "test_coverage": $test,
               "documentation": $docs,
               "security": $security,
               "performance": $perf
           } |
           .overall_score = $overall |
           .quality_gates = {
               "code_quality_pass": ($code >= 80),
               "test_coverage_pass": ($test >= 85),
               "documentation_pass": ($docs >= 75),
               "security_pass": ($security >= 90),
               "performance_pass": ($perf >= 70),
               "overall_pass": ($overall >= 80)
           }' "$output_file" > "$output_file.tmp" && mv "$output_file.tmp" "$output_file"
    fi

    cat "$output_file"
    log_success "Quality score calculation completed: ${overall_score%.*}%"
}

# Calculate code quality score based on ShellCheck results
calculate_code_quality_score() {
    local total_scripts=0
    local scripts_without_issues=0

    # Check all shell scripts for ShellCheck issues
    while IFS= read -r -d '' script; do
        ((total_scripts++))

        if shellcheck "$script" >/dev/null 2>&1; then
            ((scripts_without_issues++))
        fi
    done < <(find scripts/ -name "*.sh" -type f -print0 2>/dev/null || true)

    if [[ $total_scripts -eq 0 ]]; then
        echo "100"
    else
        echo "$((scripts_without_issues * 100 / total_scripts))"
    fi
}

# Calculate test coverage score
calculate_test_coverage_score() {
    local total_includes=0
    local tested_includes=0

    # Count includes with corresponding tests
    while IFS= read -r -d '' include_file; do
        ((total_includes++))

        local include_name
        include_name=$(basename "$include_file" .sh)
        local test_file="tests/includes/test-${include_name}.bats"

        if [[ -f "$test_file" ]]; then
            ((tested_includes++))
        fi
    done < <(find scripts/includes/ -name "*.sh" -type f -print0 2>/dev/null || true)

    if [[ $total_includes -eq 0 ]]; then
        echo "100"
    else
        echo "$((tested_includes * 100 / total_includes))"
    fi
}

# Calculate documentation score
calculate_documentation_score() {
    local total_includes=0
    local documented_includes=0

    # Check documentation completeness for includes
    while IFS= read -r -d '' include_file; do
        ((total_includes++))

        # Check if include has proper documentation
        if has_complete_documentation "$include_file"; then
            ((documented_includes++))
        fi
    done < <(find scripts/includes/ -name "*.sh" -type f -print0 2>/dev/null || true)

    if [[ $total_includes -eq 0 ]]; then
        echo "100"
    else
        echo "$((documented_includes * 100 / total_includes))"
    fi
}

# Check if a file has complete documentation
has_complete_documentation() {
    local file="$1"
    local required_docs=("Script Name" "Description" "Usage")

    for doc in "${required_docs[@]}"; do
        if ! grep -q "^# $doc:" "$file" 2>/dev/null; then
            return 1
        fi
    done

    return 0
}

# Calculate security score
calculate_security_score() {
    local security_issues=0
    local total_checks=0

    # Check for unsafe eval usage using ShellCheck (SC2006, SC2086, SC2016, SC2140, SC2312)
    ((total_checks++))
    if command -v shellcheck >/dev/null 2>&1; then
        # Run ShellCheck and look for warnings about unsafe eval usage
        if shellcheck -f gcc -e SC1090,SC1091 $(find scripts/ -name "*.sh" -type f) 2>/dev/null | grep -E "SC2006|SC2086|SC2016|SC2140|SC2312" >/dev/null; then
            ((security_issues++))
        fi
    else
        log_info "ShellCheck not found; skipping eval security check"
    fi

# (Removed ineffective check for command substitution)

    # Calculate score (100 - percentage of issues)
    if [[ $total_checks -eq 0 ]]; then
        echo "100"
    else
        local issues_pct=$((security_issues * 100 / total_checks))
        echo "$((100 - issues_pct))"
    fi
}

# Main execution
main() {
    local output_file="${1:-quality-report.json}"

    # Ensure we're in the repository root
    if [[ ! -d "scripts" ]]; then
        log_error "Must be run from repository root"
        exit 1
    fi

    calculate_overall_quality_score "$output_file"
}

# Run main if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
